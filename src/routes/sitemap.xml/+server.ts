import type { RequestHandler } from './$types';

const siteUrl = 'https://bigls.net';

export const GET: RequestHandler = async () => {
    const lastmod = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>${siteUrl}/</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>${siteUrl}/assets/portfolioPreview.png</image:loc>
            <image:title>Webdesign Wien Korneuburg - Matthias Bigl</image:title>
            <image:caption>Professionelle Webentwicklung aus Wien und Korneuburg - Websites, Webshops und individuelle Web-Erlebnisse von Matthias Bigl</image:caption>
        </image:image>
    </url>
    <url>
        <loc>${siteUrl}/contact</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400'
        }
    });
};
