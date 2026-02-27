import type { PageLoad } from './$types';
import { marked } from 'marked';
import { baseLocale, getLocaleForUrl } from '$lib/paraglide/runtime.js';

const seoData: Record<string, { title: string; description: string; keywords: string[] }> = {
	de: {
		title: 'Website Kosten Österreich 2026 | Was kostet eine Website? Matthias Bigl',
		description:
			'Was kostet eine Website 2026 in Österreich? Landingpages ab €650, Websites ab €2.000, Webshops ab €3.250. Ehrlicher Preisguide von Matthias Bigl – Webdesigner Wien/Korneuburg. Jetzt lesen!',
		keywords: [
			'Website Kosten Österreich',
			'Was kostet eine Website',
			'Was kostet eine Website 2026',
			'Webdesign Preise 2026',
			'Homepage Kosten Österreich',
			'Webdesigner Wien Preise',
			'Website erstellen lassen Kosten',
			'Landingpage Kosten',
			'Webshop Kosten Österreich',
			'Matthias Bigl Preise',
			'Webdesign günstig Wien',
			'Website Preise Vergleich'
		]
	},
	en: {
		title: 'Website Costs Austria 2026 | What does a website cost? Matthias Bigl',
		description:
			'What does a website cost in Austria 2026? Landing pages from €650, websites from €2,000, webshops from €3,250. Honest pricing guide by Matthias Bigl – Web designer Vienna. Read now!',
		keywords: [
			'Website costs Austria',
			'Web design prices 2026',
			'Cost to build a website Vienna',
			'Professional website pricing',
			'SEO web design Austria',
			'SvelteKit developer Austria',
			'Web development pricing'
		]
	},
	cs: {
		title: 'Náklady na webové stránky Rakousko 2026 | Co stojí web? Matthias Bigl',
		description:
			'Co stojí webové stránky v Rakousku v roce 2026? Landing pages od €650, webové stránky od €2.000, e-shopy od €3.250. Upřímný cenový průvodce od Matthiase Bigl – webový designér Vídeň. Čtěte nyní!',
		keywords: [
			'Náklady na webové stránky Rakousko',
			'Ceny webového designu 2026',
			'Náklady na vytvoření webových stránek Vídeň',
			'Profesionální ceny webových stránek',
			'SEO web design Rakousko',
			'SvelteKit vývojář Rakousko',
			'Ceny webového vývoje'
		]
	}
};

export const load: PageLoad = async ({ url }) => {
	// Use URL-based locale detection - this works because paraglide middleware
	// has already processed the URL and set up the locale
	const locale = getLocaleForUrl(url);
	const lang = locale ?? baseLocale;

	const modules = import.meta.glob('$lib/content/pricing/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	const contentPath = `/src/lib/content/pricing/${lang}.md`;
	const rawContent =
		(modules[contentPath] as string) ??
		(modules[`/src/lib/content/pricing/${baseLocale}.md`] as string);

	let content = '';
	if (rawContent) {
		content = await marked.parse(rawContent);
	}

	return {
		article: content,
		seo: seoData[lang] ?? seoData[baseLocale]
	};
};
