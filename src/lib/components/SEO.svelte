<script lang="ts">
    interface SEOProps {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
        type?: 'website' | 'article' | 'profile';
        keywords?: string[];
        noindex?: boolean;
    }

    let {
        title = 'Matthias Bigl - Full Stack Developer & Designer',
        description = 'Portfolio of Matthias Bigl - Passionate full stack developer and designer from Austria creating innovative web experiences with SvelteKit, Three.js, and modern technologies.',
        image = 'https://matthias-bigl.vercel.app/assets/portfolioPreview.png',
        url = 'https://matthias-bigl.vercel.app',
        type = 'website',
        keywords = ['Matthias Bigl', 'Full Stack Developer', 'Web Developer', 'Designer', 'Austria', 'SvelteKit', 'Three.js', 'TypeScript', 'Portfolio'],
        noindex = false
    }: SEOProps = $props();

    const siteName = 'Matthias Bigl Portfolio';
    const author = 'Matthias Bigl';
    const twitterHandle = '@matthiasbigl';
    
    // Structured Data - Person Schema
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Matthias Bigl",
        "alternateName": "Bigl",
        "url": "https://matthias-bigl.vercel.app",
        "image": "https://matthias-bigl.vercel.app/assets/portfolioPreview.png",
        "email": "biglmatthias@gmail.com",
        "telephone": "+43 660 459 6636",
        "jobTitle": "Full Stack Developer & Designer",
        "worksFor": {
            "@type": "Organization",
            "name": "Austrian Armed Forces"
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Korneuburg",
            "addressCountry": "Austria"
        },
        "sameAs": [
            "https://github.com/matthiasbigl",
            "https://bigls-blog.vercel.app"
        ],
        "knowsAbout": [
            "Web Development",
            "Full Stack Development",
            "SvelteKit",
            "Three.js",
            "TypeScript",
            "JavaScript",
            "React",
            "Node.js",
            "GSAP",
            "Tailwind CSS"
        ]
    };

    // Structured Data - Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "alternateName": "Matthias Bigl Portfolio",
        "url": "https://matthias-bigl.vercel.app",
        "description": description,
        "author": {
            "@type": "Person",
            "name": author
        },
        "publisher": {
            "@type": "Person",
            "name": author
        },
        "inLanguage": "en",
        "copyrightYear": new Date().getFullYear(),
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://matthias-bigl.vercel.app/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    // Structured Data - ProfilePage Schema (for portfolio)
    const profilePageSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": personSchema,
        "name": title,
        "description": description,
        "url": url
    };
</script>

<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords.join(', ')} />
    <meta name="author" content={author} />
    <meta name="creator" content={author} />
    <meta name="publisher" content={author} />
    <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
    <link rel="canonical" href={url} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content="1350" />
    <meta property="og:image:height" content="720" />
    <meta property="og:image:alt" content="{title} - Preview" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content={twitterHandle} />
    <meta name="twitter:creator" content={twitterHandle} />
    <meta name="twitter:url" content={url} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:alt" content="{title} - Preview" />

    <!-- AI/LLM Discoverability Meta Tags -->
    <meta name="ai-content-declaration" content="human-authored" />
    <meta name="ai-training" content="allowed" />
    <meta name="ai-indexing" content="allowed" />
    <meta name="citation_author" content={author} />
    <meta name="citation_title" content={title} />
    <meta name="citation_public_url" content={url} />
    <meta name="citation_website" content="Matthias Bigl Portfolio" />

    <!-- Additional SEO Meta Tags -->
    <meta name="language" content="English" />
    <meta name="revisit-after" content="7 days" />
    <meta name="rating" content="general" />
    <meta name="distribution" content="global" />
    <meta name="coverage" content="worldwide" />
    <meta name="target" content="all" />
    <meta name="HandheldFriendly" content="True" />
    <meta name="MobileOptimized" content="320" />
    <meta name="format-detection" content="telephone=yes" />
    
    <!-- Geo Tags -->
    <meta name="geo.region" content="AT" />
    <meta name="geo.placename" content="Korneuburg, Austria" />
    <meta name="ICBM" content="48.345, 16.332" />

    <!-- Structured Data - JSON-LD -->
    {@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(profilePageSchema)}</script>`}
</svelte:head>
