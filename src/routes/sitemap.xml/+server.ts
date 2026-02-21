import type { RequestHandler } from './$types';
import { projects } from '$lib/data/projects';

const siteUrl = 'https://bigls.net';
const langs = ['de', 'en', 'cs'] as const;

/** Escape special XML characters in text content */
function escXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** Build hreflang xhtml:link elements for all language variants */
function hreflangLinks(path: string): string {
	return langs
		.map((l) => `        <xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}${path}" />`)
		.join('\n') +
		`\n        <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/de${path}" />`;
}

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString().split('T')[0];

	// Per-language static pages
	const staticPages = ['', '/about', '/contact', '/pricing', '/impressum', '/datenschutz'];
	const staticUrls = langs.flatMap((lang) =>
		staticPages.map((path) => {
			const isHome = path === '';
			const priority = isHome ? '1.0' : path === '/contact' || path === '/pricing' ? '0.9' : path === '/about' ? '0.8' : '0.3';
			const changefreq = isHome ? 'weekly' : path === '/pricing' ? 'monthly' : 'monthly';
			const fullPath = path;
			return `
    <url>
        <loc>${siteUrl}/${lang}${fullPath}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
${hreflangLinks(fullPath)}
    </url>`;
		})
	);

	const projectUrls = projects
		.filter((p) => !p.isExternal)
		.flatMap((project) => {
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
			return langs.map((lang) => `
    <url>
        <loc>${siteUrl}/${lang}/projects/${project.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
${hreflangLinks(`/projects/${project.slug}`)}
        <image:image>
            <image:loc>${imageUrl}</image:loc>
            <image:title>${escXml(project.slug.charAt(0).toUpperCase() + project.slug.slice(1))} – Matthias Bigl Portfolio</image:title>
        </image:image>
    </url>`);
		});

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <!-- Root redirect -->
    <url>
        <loc>${siteUrl}/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <!-- Language-prefixed pages -->${staticUrls.join('')}
    <!-- Project Case Studies -->${projectUrls.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
