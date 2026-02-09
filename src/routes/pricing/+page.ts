import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const load: PageLoad = async ({ fetch }) => {
	// We'll use a dynamic import or fetch to get the markdown content based on locale
	// Since we are in a SPA-like environment with SvelteKit, we can try to load it here
	// or just pass the locale to the page and let it handle it.
	
	const currentLocale = get(locale) || 'de';
	
	return {
		locale: currentLocale
	};
};
