import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const stored = cookies.get('preferred-locale');
	const lang = stored === 'en' || stored === 'cs' ? stored : 'de';
	redirect(302, `/${lang}`);
};
