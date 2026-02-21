import type { PageLoad } from './$types';
import { marked } from 'marked';

export const load: PageLoad = async ({ params }) => {
	const lang = (params.lang === 'en' || params.lang === 'cs') ? params.lang : 'de';
	const modules = import.meta.glob('$lib/content/pricing/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});
	const rawContent = modules[`/src/lib/content/pricing/${lang}.md`] as string;

	let content = '';
	if (rawContent) {
		content = await marked.parse(rawContent);
	}

	return {
		article: content
	};
};
