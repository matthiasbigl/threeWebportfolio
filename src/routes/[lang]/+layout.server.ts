import { loadTranslations, supportedLocales } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, url }) => {
	const { lang } = params;

	if (!(supportedLocales as readonly string[]).includes(lang)) {
		redirect(308, `/de${url.pathname.slice(lang.length + 1)}`);
	}

	await loadTranslations(lang, url.pathname);

	return { lang };
};
