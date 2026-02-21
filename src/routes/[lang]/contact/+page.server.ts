import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import emailjs from '@emailjs/nodejs';

// Environment variables with fallbacks for type safety
const EMAILJS_SERVICE_ID = import.meta.env.EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = import.meta.env.EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY = import.meta.env.EMAILJS_PUBLIC_KEY ?? '';
const EMAILJS_PRIVATE_KEY = import.meta.env.EMAILJS_PRIVATE_KEY ?? '';

// Rate limiting store (in production, use Redis or a database)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3; // 3 submissions per hour per IP

// Simple in-memory spam detector
const spamPatterns = [
	/http:\/\//gi, // Multiple HTTP links
	/https:\/\//gi, // Multiple HTTPS links
	/<a\s+href/gi, // HTML links
	/<script/gi, // Script tags
	/onclick/gi, // JS events
	/viagra|cialis|casino|lottery|crypto|bitcoin/gi // Common spam words
];

// Validation functions
function validateName(name: string): string | null {
	if (!name || name.trim().length === 0) {
		return 'Name is required';
	}
	if (name.trim().length < 2) {
		return 'Name must be at least 2 characters long';
	}
	if (name.trim().length > 100) {
		return 'Name must be less than 100 characters';
	}
	// Check for URL patterns in name
	if (/https?:\/\//i.test(name)) {
		return 'Name cannot contain URLs';
	}
	return null;
}

function validateEmail(email: string): string | null {
	if (!email || email.trim().length === 0) {
		return 'Email is required';
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email.trim())) {
		return 'Please enter a valid email address';
	}

	if (email.trim().length > 254) {
		return 'Email address is too long';
	}

	// Block common disposable email domains
	const disposableDomains = [
		'tempmail.com',
		'guerrillamail.com',
		'throwaway.email',
		'10minutemail.com'
	];
	const domain = email.split('@')[1]?.toLowerCase();
	if (disposableDomains.includes(domain)) {
		return 'Please use a permanent email address';
	}

	return null;
}

function validateMessage(message: string): string | null {
	if (!message || message.trim().length === 0) {
		return 'Message is required';
	}
	if (message.trim().length < 10) {
		return 'Message must be at least 10 characters long';
	}
	if (message.trim().length > 2000) {
		return 'Message must be less than 2000 characters';
	}

	// Check for spam patterns
	const linkCount = (message.match(/https?:\/\//gi) || []).length;
	if (linkCount > 2) {
		return 'Message contains too many links';
	}

	return null;
}

// Bot detection functions
function isLikelyBot(name: string, email: string, message: string, honeypot: string): boolean {
	// 1. Honeypot field check (most important)
	if (honeypot && honeypot.trim().length > 0) {
		console.log('Bot detected: Honeypot filled');
		return true;
	}

	// 2. Check for spam patterns in message
	let spamScore = 0;
	spamPatterns.forEach((pattern) => {
		const matches = message.match(pattern);
		if (matches) {
			spamScore += matches.length;
		}
	});

	if (spamScore > 3) {
		console.log('Bot detected: High spam score', spamScore);
		return true;
	}

	// 3. Check for suspicious patterns
	const combined = `${name} ${email} ${message}`.toLowerCase();

	// Check for random character strings (like "wcg04g8k80owwggw4goggcg8")
	if (/[a-z0-9]{15,}/i.test(combined)) {
		console.log('Bot detected: Random character string');
		return true;
	}

	// 4. Check if name looks like URL or code
	if (/^http|^www\.|\.com|\.net|\.org/i.test(name)) {
		console.log('Bot detected: Name contains URL');
		return true;
	}

	return false;
}

function checkRateLimit(clientIP: string): boolean {
	const now = Date.now();
	const record = rateLimitStore.get(clientIP);

	if (!record) {
		rateLimitStore.set(clientIP, { count: 1, timestamp: now });
		return true;
	}

	// Reset if window has passed
	if (now - record.timestamp > RATE_LIMIT_WINDOW) {
		rateLimitStore.set(clientIP, { count: 1, timestamp: now });
		return true;
	}

	// Check if limit exceeded
	if (record.count >= MAX_REQUESTS_PER_WINDOW) {
		console.log('Rate limit exceeded for IP:', clientIP);
		return false;
	}

	// Increment count
	record.count++;
	rateLimitStore.set(clientIP, record);
	return true;
}

// Clean up old rate limit entries periodically
setInterval(
	() => {
		const now = Date.now();
		for (const [ip, record] of rateLimitStore.entries()) {
			if (now - record.timestamp > RATE_LIMIT_WINDOW) {
				rateLimitStore.delete(ip);
			}
		}
	},
	10 * 60 * 1000
); // Clean up every 10 minutes

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const message = data.get('message') as string;
		const honeypot = data.get('website') as string; // Honeypot field
		const timestamp = data.get('_timestamp') as string; // Form load timestamp

		// Get client IP for rate limiting
		const clientIP = getClientAddress();

		// Check rate limit
		if (!checkRateLimit(clientIP)) {
			console.log('Rate limit exceeded for:', clientIP);
			return fail(429, {
				errors: {
					form: 'Too many requests. Please try again later.'
				}
			});
		}

		// Check form submission time (bots submit instantly)
		if (timestamp) {
			const submitTime = Date.now();
			const loadTime = parseInt(timestamp);
			const timeDiff = submitTime - loadTime;

			// If form submitted in less than 3 seconds, likely a bot
			if (timeDiff < 3000) {
				console.log('Bot detected: Form submitted too quickly', timeDiff, 'ms');
				// Return success to fool the bot
				return {
					success: true,
					message: 'Thank you for your message!'
				};
			}
		}

		// Bot detection
		if (isLikelyBot(name, email, message, honeypot)) {
			console.log('Bot detected for submission:', { name, email, clientIP });
			// Return fake success to fool the bot
			return {
				success: true,
				message: 'Thank you for your message!'
			};
		}

		// Validate form data
		const errors: Record<string, string> = {};

		const nameError = validateName(name);
		if (nameError) errors.name = nameError;

		const emailError = validateEmail(email);
		if (emailError) errors.email = emailError;

		const messageError = validateMessage(message);
		if (messageError) errors.message = messageError;

		// If there are validation errors, return them
		if (Object.keys(errors).length > 0) {
			return fail(400, {
				errors,
				name: name?.trim(),
				email: email?.trim(),
				message: message?.trim()
			});
		}

		// Check if EmailJS configuration is present
		if (
			!EMAILJS_SERVICE_ID ||
			!EMAILJS_TEMPLATE_ID ||
			!EMAILJS_PUBLIC_KEY ||
			!EMAILJS_PRIVATE_KEY
		) {
			console.error('EmailJS configuration missing. Please check your environment variables.');
			return fail(500, {
				errors: { form: 'Email service configuration error. Please try again later.' },
				name: name?.trim(),
				email: email?.trim(),
				message: message?.trim()
			});
		}

		try {
			// Send email using EmailJS
			const templateParams = {
				from_name: name.trim(),
				from_email: email.trim(),
				message: message.trim(),
				to_name: 'Matthias Bigl',
				reply_to: email.trim(),
				client_ip: clientIP, // Include IP for reference
				timestamp: new Date().toLocaleString('en-US', {
					timeZone: 'Europe/Vienna',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			};

			await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
				publicKey: EMAILJS_PUBLIC_KEY,
				privateKey: EMAILJS_PRIVATE_KEY
			});

			console.log('Email sent successfully from:', email, 'IP:', clientIP);

			return {
				success: true,
				message: "Thank you for your message! I'll get back to you as soon as possible."
			};
		} catch (error) {
			console.error('Failed to send email:', error);

			return fail(500, {
				errors: {
					form: 'Failed to send message. Please try again or contact me directly at biglmatthias@gmail.com'
				},
				name: name?.trim(),
				email: email?.trim(),
				message: message?.trim()
			});
		}
	}
};
