import type { RequestHandler } from './$types';
import { projects } from '$lib/data/projects';

const siteUrl = 'https://bigls.net';
const langs = ['de', 'en', 'cs'];

/** Escape special XML characters in text content */
function escXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function hreflangAlternates(path: string): string {
	const alts = langs.map((l) => `
        <xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}${path}"/>`).join('');
	const xDefault = `
        <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/de${path}"/>`;
	return alts + xDefault;
}

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString().split('T')[0];

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
			return langs.map(
				(lang) => `
    <url>
        <loc>${siteUrl}/${lang}/projects/${project.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>${hreflangAlternates(`/projects/${project.slug}`)}
        <image:image>
            <image:loc>${imageUrl}</image:loc>
            <image:title>${escXml(project.slug.charAt(0).toUpperCase() + project.slug.slice(1))} – Matthias Bigl Portfolio</image:title>
        </image:image>
    </url>`
			);
		})
		.join('');

	const staticPages = [
		{ path: '', priority: '1.0', changefreq: 'weekly' },
		{ path: '/contact', priority: '0.9', changefreq: 'monthly' },
		{ path: '/pricing', priority: '0.9', changefreq: 'monthly' },
		{ path: '/about', priority: '0.8', changefreq: 'monthly' },
		{ path: '/impressum', priority: '0.3', changefreq: 'yearly' },
		{ path: '/datenschutz', priority: '0.3', changefreq: 'yearly' }
	];

	const staticUrls = staticPages
		.flatMap(({ path, priority, changefreq }) =>
			langs.map(
				(lang) => `
    <url>
        <loc>${siteUrl}/${lang}${path}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>${hreflangAlternates(path)}
    </url>`
			)
		)
		.join('');

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
        <image:image>
            <image:loc>${siteUrl}/headshot.png</image:loc>
            <image:title>Matthias Bigl – Webdesigner &amp; Full Stack Developer Wien Korneuburg</image:title>
            <image:caption>Matthias Bigl – Professionelle Webentwicklung, Websites, Webshops und interaktive Web-Erlebnisse aus Wien und Korneuburg, Österreich</image:caption>
        </image:image>
    </url>${staticUrls}
    <!-- Project Case Studies -->${projectUrls}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};

