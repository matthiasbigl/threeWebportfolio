import type { PageServerLoad } from './$types';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	const lang = (params.lang as string) || 'de';
	const supportedLangs = ['de', 'en', 'cs'];
	const effectiveLang = supportedLangs.includes(lang) ? lang : 'de';

	const modules = import.meta.glob('$lib/content/pricing/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;
	const rawContent = modules[`/src/lib/content/pricing/${effectiveLang}.md`];
	const fallback = modules[`/src/lib/content/pricing/de.md`];

	let content = '';
	const src = rawContent || fallback;
	if (src) {
		content = await marked.parse(src);
	}

	return { article: content };
};
