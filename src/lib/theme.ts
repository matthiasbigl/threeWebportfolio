import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

/**
 * Determine initial theme:
 * 1. Check localStorage for explicit preference
 * 2. Respect system prefers-color-scheme
 * 3. Default to dark if neither available
 */
function getInitialTheme(): Theme {
	if (!browser) return 'dark';

	const stored = localStorage.getItem('theme') as Theme | null;
	if (stored === 'light' || stored === 'dark') return stored;

	// Follow system preference
	if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';

	return 'dark';
}

export const theme = writable<Theme>(getInitialTheme());

/** Apply the theme class to <html> and persist choice */
export function applyTheme(t: Theme) {
	if (!browser) return;

	const html = document.documentElement;
	if (t === 'dark') {
		html.classList.add('dark');
	} else {
		html.classList.remove('dark');
	}
	localStorage.setItem('theme', t);
}

/** Toggle between light and dark */
export function toggleTheme() {
	theme.update((current) => {
		const next: Theme = current === 'dark' ? 'light' : 'dark';
		applyTheme(next);
		return next;
	});
}

/** Initialize on first load — call in layout onMount */
export function initTheme() {
	if (!browser) return;

	const t = getInitialTheme();
	applyTheme(t);
	theme.set(t);
}
