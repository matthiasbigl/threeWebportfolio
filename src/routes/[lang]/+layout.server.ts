import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const VALID_LANGS = ['de', 'en', 'cs'] as const;

export const load: LayoutServerLoad = ({ params, url }) => {
	const { lang } = params;
	if (!(VALID_LANGS as readonly string[]).includes(lang)) {
		redirect(302, `/de${url.pathname.slice(lang.length + 1)}`);
	}
	return { lang: lang as 'de' | 'en' | 'cs' };
};
