import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

const securityHandle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

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

export const handle: Handle = ({ event, resolve }) =>
	paraglideHandle({
		event,
		resolve: (e, opts) => securityHandle({ event: e, resolve: (ev) => resolve(ev, opts) })
	});
