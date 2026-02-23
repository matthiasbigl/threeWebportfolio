import type { RequestHandler } from './$types';
import { projects } from '$lib/data/projects';
import { locales, localizeHref } from '$lib/paraglide/runtime.js';

const siteUrl = 'https://bigls.net';

const staticPages = ['/', '/contact', '/pricing', '/about', '/impressum', '/datenschutz'];

function escXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function generateHreflangTags(path: string): string {
	return locales
		.map(
			(locale) =>
				`        <xhtml:link rel="alternate" hreflang="${locale}" href="${siteUrl}${escXml(localizeHref(path, { locale }))}"/>`
		)
		.join('\n');
}

function generateUrlEntry(
	path: string,
	options?: {
		lastmod?: string;
		priority?: string;
		changefreq?: string;
		imageUrl?: string;
		imageTitle?: string;
	}
): string {
	const lastmod = options?.lastmod ?? new Date().toISOString().split('T')[0];
	const hreflangTags = generateHreflangTags(path);

	return locales
		.map((locale) => {
			const localizedPath = localizeHref(path, { locale });
			let imageTag = '';
			if (options?.imageUrl) {
				imageTag = `
        <image:image>
            <image:loc>${escXml(options.imageUrl)}</image:loc>${
							options.imageTitle
								? `
            <image:title>${escXml(options.imageTitle)}</image:title>`
								: ''
						}
        </image:image>`;
			}
			return `    <url>
        <loc>${siteUrl}${escXml(localizedPath)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${options?.changefreq ?? 'monthly'}</changefreq>
        <priority>${options?.priority ?? '0.5'}</priority>${imageTag}
${hreflangTags}
    </url>`;
		})
		.join('\n');
}

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString().split('T')[0];

	const projectUrlEntries = projects
		.filter((p) => !p.isExternal)
		.map((project) => {
			let imageUrl: string;
			if (typeof project.image === 'string') {
				imageUrl = project.image.startsWith('http') ? project.image : `${siteUrl}/${project.image}`;
			} else {
				const src =
					(project.image as any)?.sources?.avif?.[0]?.src ??
					(project.image as any)?.sources?.webp?.[0]?.src ??
					(project.image as any)?.img?.src ??
					`${siteUrl}/favicon.png`;
				imageUrl = src.startsWith('http') ? src : `${siteUrl}${src}`;
			}

			return generateUrlEntry(`/projects/${project.slug}`, {
				lastmod,
				priority: '0.7',
				changefreq: 'monthly',
				imageUrl,
				imageTitle: `${project.slug.charAt(0).toUpperCase() + project.slug.slice(1)} – Matthias Bigl Portfolio`
			});
		})
		.join('\n');

	const staticUrlEntries = staticPages
		.map((path) =>
			generateUrlEntry(path, {
				lastmod,
				priority: path === '/' ? '1.0' : path === '/contact' || path === '/pricing' ? '0.9' : '0.5',
				changefreq: path === '/' ? 'weekly' : 'monthly',
				imageUrl: path === '/' ? `${siteUrl}/headshot.png` : undefined,
				imageTitle:
					path === '/'
						? 'Matthias Bigl – Webdesigner & Full Stack Developer Wien Korneuburg'
						: undefined
			})
		)
		.join('\n');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticUrlEntries}
${projectUrlEntries}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
