import type { PageLoad } from './$types';
import { marked } from 'marked';

export const load: PageLoad = async ({ fetch }) => {
	// We use a default locale 'de' for the SSR pass.
	// In the browser, the component will re-load if the locale changes.
	const lang = 'de';
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
