import { browser } from '$app/environment';
import { init, register, locale, _, addMessages } from 'svelte-i18n';
import deMessages from './locales/de.json';

// Load default locale synchronously so $_() works immediately (SSR + hydration)
addMessages('de', deMessages);

// Register English as lazy-loaded
register('en', () => import('./locales/en.json'));

// Register Czech as lazy-loaded
register('cs', () => import('./locales/cs.json'));

// Initialize i18n
init({
	fallbackLocale: 'de',
	initialLocale: 'de'
});

// Export locale for use in components
export { locale, _ };

// Helper function to switch locale (used by [lang]/+layout.svelte on mount)
export function setLocale(lang: 'de' | 'en' | 'cs') {
	locale.set(lang);
	if (browser) {
		document.cookie = `preferred-locale=${lang};path=/;max-age=31536000;SameSite=Lax`;
	}
}
