import type { Handle } from '@sveltejs/kit';

const VALID_LANGS = ['de', 'en', 'cs'] as const;
type Lang = (typeof VALID_LANGS)[number];

function detectLang(pathname: string): Lang {
	const seg = pathname.split('/')[1];
	return (VALID_LANGS as readonly string[]).includes(seg) ? (seg as Lang) : 'de';
}

export const handle: Handle = async ({ event, resolve }) => {
	const lang = detectLang(event.url.pathname);
	event.locals.lang = lang;

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html lang="de"', `<html lang="${lang}"`),
		// Preload critical assets via Link headers
		preload: ({ type }) => {
			// Only preload JS, CSS, and fonts — skip images (lazy-loaded)
			return type === 'js' || type === 'css' || type === 'font';
		}
	});

	// Security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	// Cache static assets
	if (
		event.url.pathname.startsWith('/assets/') ||
		event.url.pathname.endsWith('.png') ||
		event.url.pathname.endsWith('.jpg') ||
		event.url.pathname.endsWith('.ico') ||
		event.url.pathname.endsWith('.webmanifest')
	) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}

	// Cache static text files
	if (
		event.url.pathname === '/robots.txt' ||
		event.url.pathname === '/humans.txt' ||
		event.url.pathname === '/llms.txt' ||
		event.url.pathname === '/ai.txt'
	) {
		response.headers.set('Cache-Control', 'public, max-age=86400');
	}

	return response;
};
