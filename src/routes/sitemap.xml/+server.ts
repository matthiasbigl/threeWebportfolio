import type { RequestHandler } from './$types';
import { projects } from '$lib/data/projects';

const siteUrl = 'https://bigls.net';

/** Escape special XML characters in text content */
function escXml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async () => {
    const lastmod = new Date().toISOString().split('T')[0];

    const projectUrls = projects
        .filter(p => !p.isExternal)
        .map(project => {
            // Resolve image URL: enhanced imports are Picture objects, others are plain strings
            let imageUrl: string;
            if (typeof project.image === 'string') {
                imageUrl = project.image.startsWith('http') ? project.image : `${siteUrl}/${project.image}`;
            } else {
                // Picture object from ?enhanced — grab the first source fallback
                const src = (project.image as any)?.sources?.avif?.[0]?.src
                    ?? (project.image as any)?.sources?.webp?.[0]?.src
                    ?? (project.image as any)?.img?.src
                    ?? `${siteUrl}/favicon.png`;
                imageUrl = src.startsWith('http') ? src : `${siteUrl}${src}`;
            }
            return `
    <url>
        <loc>${siteUrl}/projects/${project.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
        <image:image>
            <image:loc>${imageUrl}</image:loc>
            <image:title>${escXml(project.slug.charAt(0).toUpperCase() + project.slug.slice(1))} – Matthias Bigl Portfolio</image:title>
        </image:image>
    </url>`;
        }).join('');

    // Hreflang omitted: site uses client-side i18n with a single URL per page.
    // Will be re-added after migrating to URL-based i18n (Paraglide).
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <!-- Homepage -->
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
    </url>
    <!-- Contact -->
    <url>
        <loc>${siteUrl}/contact</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <!-- Pricing Guide -->
    <url>
        <loc>${siteUrl}/pricing</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
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
