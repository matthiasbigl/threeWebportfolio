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
		title = 'Matthias Bigl | Webdesign & Webentwicklung Wien/Korneuburg',
		description = 'Matthias Bigl – Ihr Webdesigner aus Wien/Korneuburg. Websites, Webshops & individuelle Web-Erlebnisse. Persönliche Betreuung, faire Preise. Jetzt unverbindlich anfragen!',
		image = 'https://bigls.net/assets/portfolioPreview.png',
		url = 'https://bigls.net',
		type = 'website',
		keywords = [
			// Personal Brand
			'Matthias Bigl',
			'Matthias Bigl Webdesign',
			'Matthias Bigl Wien',
			
			// Lokale Keywords
			'Webdesign Wien',
			'Webentwicklung Wien',
			'Webdesign Korneuburg',
			'Webdesigner Österreich',
			'Webentwickler Niederösterreich',
			'Webdesigner in der Nähe',
			'lokaler Webentwickler Wien',
			
			// Services Deutsch
			'Website erstellen lassen',
			'Homepage erstellen Wien',
			'Webshop erstellen',
			'Webshop erstellen lassen Österreich',
			'Website Redesign',
			'Homepage modernisieren',
			'Landingpage erstellen',
			
			// Zielgruppen
			'Website für KMU',
			'Homepage für Kleinunternehmen',
			'Website für Selbstständige',
			'Website für Handwerker',
			'Website für Unternehmen Wien',
			
			// Preisbezogen (hohe Suchintention!)
			'Website Kosten Österreich',
			'Was kostet eine Website',
			'Website Wien günstig',
			'Webdesign faire Preise',
			'Webdesign ohne Agentur',
			
			// Eigenschaften
			'Responsive Webdesign',
			'moderne Website erstellen',
			'professionelle Homepage',
			'schnelle Website erstellen',
			
			// Freelancer vs Agentur
			'Freelancer Webentwicklung',
			'Webdesign Agentur Alternative',
			'Full Stack Developer Wien',
			
			// Englisch (Expats & International)
			'Web developer Vienna',
			'Web design Austria',
			'Website designer Vienna',
			'Freelance web developer Austria'
		],
		noindex = false
	}: SEOProps = $props();

	const siteName = 'Matthias Bigl - Webdesign & Webentwicklung';
	const author = 'Matthias Bigl';
	const twitterHandle = '@matthiasbigl';

	// Structured Data - Person Schema
	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Matthias Bigl',
		alternateName: 'Bigl',
		url: 'https://bigls.net',
		image: 'https://bigls.net/assets/portfolioPreview.png',
		email: 'biglmatthias@gmail.com',
		telephone: '+43 660 459 6636',
		jobTitle: 'Webdesigner & Full Stack Developer',
		description: 'Unabhängiger Webentwickler aus Wien/Korneuburg. Spezialisiert auf moderne Websites, Webshops und individuelle Web-Erlebnisse.',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Korneuburg',
			addressRegion: 'Niederösterreich',
			addressCountry: 'AT'
		},
		areaServed: [
			{
				'@type': 'City',
				name: 'Wien'
			},
			{
				'@type': 'City', 
				name: 'Korneuburg'
			},
			{
				'@type': 'State',
				name: 'Niederösterreich'
			},
			{
				'@type': 'Country',
				name: 'Österreich'
			}
		],
		sameAs: ['https://github.com/matthiasbigl', 'https://blog.bigls.net'],
		knowsAbout: [
			'Webdesign',
			'Webentwicklung',
			'Web Development',
			'Full Stack Development',
			'SvelteKit',
			'React',
			'TypeScript',
			'JavaScript',
			'Node.js',
			'E-Commerce',
			'Webshops',
			'SEO',
			'Responsive Design',
			'Three.js',
			'GSAP',
			'Tailwind CSS'
		]
	};

	// Structured Data - LocalBusiness Schema (for SEO ranking)
	const localBusinessSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		'@id': 'https://bigls.net/#business',
		name: 'Matthias Bigl - Webdesign & Webentwicklung',
		alternateName: 'Bigls Webdesign',
		description: 'Professionelle Webentwicklung aus Wien/Korneuburg. Websites, Webshops & individuelle Web-Erlebnisse. Persönliche Betreuung, faire Preise, Full-Stack-Lösungen.',
		url: 'https://bigls.net',
		telephone: '+43 660 459 6636',
		email: 'biglmatthias@gmail.com',
		image: 'https://bigls.net/assets/portfolioPreview.png',
		priceRange: '€€',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Korneuburg',
			addressRegion: 'Niederösterreich',
			postalCode: '2100',
			addressCountry: 'AT'
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: 48.345,
			longitude: 16.332
		},
		areaServed: [
			{
				'@type': 'City',
				name: 'Wien',
				'@id': 'https://www.wikidata.org/wiki/Q1741'
			},
			{
				'@type': 'City',
				name: 'Korneuburg'
			},
			{
				'@type': 'State',
				name: 'Niederösterreich'
			}
		],
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Webdesign Leistungen',
			itemListElement: [
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Website Erstellung',
						description: 'Professionelle, moderne Websites die Ihre Marke perfekt präsentieren'
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Webshop Entwicklung',
						description: 'Maßgeschneiderte E-Commerce Lösungen mit sicherer Zahlung'
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Individuelle Web-Erlebnisse',
						description: 'Einzigartige, interaktive Web-Experiences mit 3D-Animationen'
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Hosting & Wartung',
						description: 'Rundum-Sorglos-Paket mit Hosting, Updates und Support'
					}
				}
			]
		},
		founder: {
			'@type': 'Person',
			name: 'Matthias Bigl'
		},
		sameAs: ['https://github.com/matthiasbigl', 'https://blog.bigls.net']
	};

	// Structured Data - Website Schema
	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteName,
		alternateName: 'Bigls Webdesign Wien',
		url: 'https://bigls.net',
		description: description,
		author: {
			'@type': 'Person',
			name: author
		},
		publisher: {
			'@type': 'Person',
			name: author
		},
		inLanguage: ['de', 'en'],
		copyrightYear: new Date().getFullYear(),
		potentialAction: {
			'@type': 'SearchAction',
			target: 'https://bigls.net/?q={search_term_string}',
			'query-input': 'required name=search_term_string'
		}
	};

	// Structured Data - ProfilePage Schema (for portfolio)
	const profilePageSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		mainEntity: personSchema,
		name: title,
		description: description,
		url: url
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
	<meta
		name="robots"
		content={noindex
			? 'noindex, nofollow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
	/>
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
	<meta property="og:locale" content="de_AT" />
	<meta property="og:locale:alternate" content="en_US" />

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
	<meta name="language" content="German" />
	<meta name="content-language" content="de-AT" />
	<meta name="revisit-after" content="7 days" />
	<meta name="rating" content="general" />
	<meta name="distribution" content="global" />
	<meta name="coverage" content="Austria" />
	<meta name="target" content="all" />
	<meta name="HandheldFriendly" content="True" />
	<meta name="MobileOptimized" content="320" />
	<meta name="format-detection" content="telephone=yes" />

	<!-- Geo Tags for Local SEO -->
	<meta name="geo.region" content="AT-3" />
	<meta name="geo.placename" content="Korneuburg, Niederösterreich, Austria" />
	<meta name="geo.position" content="48.345;16.332" />
	<meta name="ICBM" content="48.345, 16.332" />

	<!-- Structured Data - JSON-LD -->
	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(profilePageSchema)}</script>`}
</svelte:head>
