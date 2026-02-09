import { browser } from '$app/environment';
import { init, register, getLocaleFromNavigator, locale, _ } from 'svelte-i18n';

// Register translation files
register('de', () => import('./locales/de.json'));
register('en', () => import('./locales/en.json'));

// Initialize i18n
init({
	fallbackLocale: 'de',
	initialLocale: browser ? getLocaleFromNavigator()?.split('-')[0] || 'de' : 'de'
});

// Export locale for use in components
export { locale, _ };

// Helper function to switch locale
export function setLocale(lang: 'de' | 'en') {
	locale.set(lang);
	if (browser) {
		localStorage.setItem('preferred-locale', lang);
	}
}

// Initialize from localStorage if available
export function initLocaleFromStorage() {
	if (browser) {
		const stored = localStorage.getItem('preferred-locale');
		if (stored === 'de' || stored === 'en') {
			locale.set(stored);
		}
	}
}
