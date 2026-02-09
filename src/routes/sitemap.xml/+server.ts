import type { RequestHandler } from './$types';
import { projects } from '$lib/data/projects';

const siteUrl = 'https://bigls.net';

export const GET: RequestHandler = async () => {
    const lastmod = new Date().toISOString().split('T')[0];

    const projectUrls = projects
        .filter(p => !p.isExternal)
        .map(project => `
    <url>
        <loc>${siteUrl}/projects/${project.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
        <xhtml:link rel="alternate" hreflang="de" href="${siteUrl}/projects/${project.slug}" />
        <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/projects/${project.slug}" />
        <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/projects/${project.slug}" />
        <image:image>
            <image:loc>${project.image.startsWith('http') ? project.image : `${siteUrl}/${project.image}`}</image:loc>
            <image:title>${project.slug.charAt(0).toUpperCase() + project.slug.slice(1)} – Matthias Bigl Portfolio</image:title>
        </image:image>
    </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <!-- Homepage -->
    <url>
        <loc>${siteUrl}/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        <xhtml:link rel="alternate" hreflang="de" href="${siteUrl}/" />
        <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/" />
        <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
        <image:image>
            <image:loc>${siteUrl}/headshot.png</image:loc>
            <image:title>Matthias Bigl – Webdesigner & Full Stack Developer Wien Korneuburg</image:title>
            <image:caption>Matthias Bigl – Professionelle Webentwicklung, Websites, Webshops und interaktive Web-Erlebnisse aus Wien und Korneuburg, Österreich</image:caption>
        </image:image>
    </url>
    <!-- Contact -->
    <url>
        <loc>${siteUrl}/contact</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
        <xhtml:link rel="alternate" hreflang="de" href="${siteUrl}/contact" />
        <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/contact" />
        <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/contact" />
    </url>
    <!-- Pricing Guide -->
    <url>
        <loc>${siteUrl}/pricing</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
        <xhtml:link rel="alternate" hreflang="de" href="${siteUrl}/pricing" />
        <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/pricing" />
        <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/pricing" />
    </url>
    <!-- Legal / Impressum -->
    <url>
        <loc>${siteUrl}/impressum</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <!-- Privacy / Datenschutz -->
    <url>
        <loc>${siteUrl}/datenschutz</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <!-- Project Case Studies -->${projectUrls}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400'
        }
    });
};
