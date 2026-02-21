import i18n from 'sveltekit-i18n';
import type { Config } from 'sveltekit-i18n';

export const supportedLocales = ['de', 'en', 'cs'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const config: Config = {
	loaders: [
		{
			locale: 'de',
			key: '',
			loader: async () => (await import('./locales/de.json')).default
		},
		{
			locale: 'en',
			key: '',
			loader: async () => (await import('./locales/en.json')).default
		},
		{
			locale: 'cs',
			key: '',
			loader: async () => (await import('./locales/cs.json')).default
		}
	]
};

const i18nInstance = new i18n(config);

export const { t, locale, locales, loading, loadTranslations, translations, setLocale } =
	i18nInstance;
