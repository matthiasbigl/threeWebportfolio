import type { RequestHandler } from './$types';

const siteUrl = 'https://bigls.net';

const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' }
];

export const GET: RequestHandler = async () => {
    const lastmod = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `    <url>
        <loc>${siteUrl}${page.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
        ${page.url === '/' ? `<image:image>
            <image:loc>${siteUrl}/assets/portfolioPreview.png</image:loc>
            <image:title>Matthias Bigl Portfolio Preview</image:title>
            <image:caption>Portfolio of Matthias Bigl - Full Stack Developer and Designer</image:caption>
        </image:image>` : ''}
    </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400'
        }
    });
};
