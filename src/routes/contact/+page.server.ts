import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import emailjs from '@emailjs/nodejs';
import { 
    EMAILJS_SERVICE_ID, 
    EMAILJS_TEMPLATE_ID, 
    EMAILJS_PUBLIC_KEY, 
    EMAILJS_PRIVATE_KEY 
} from '$env/static/private';


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
    return null;
}

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const message = data.get('message') as string;

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
        if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
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
                timestamp: new Date().toLocaleString('en-US', {
                    timeZone: 'Europe/Vienna',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                {
                    publicKey: EMAILJS_PUBLIC_KEY,
                    privateKey: EMAILJS_PRIVATE_KEY,
                }
            );

            console.log('Email sent successfully from:', email);
            
            return {
                success: true,
                message: 'Thank you for your message! I\'ll get back to you as soon as possible.'
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
