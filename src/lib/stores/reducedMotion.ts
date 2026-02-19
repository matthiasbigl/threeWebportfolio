import { readable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * A readable store that tracks the user's preference for reduced motion.
 * Defaults to false on the server or if the media query is not supported.
 */
export const reducedMotion = readable(false, (set) => {
	if (!browser) return;

	const query = window.matchMedia('(prefers-reduced-motion: reduce)');

	// Initial value
	set(query.matches);

	const handler = (event: MediaQueryListEvent) => {
		set(event.matches);
	};

	query.addEventListener('change', handler);

	return () => {
		query.removeEventListener('change', handler);
	};
});
