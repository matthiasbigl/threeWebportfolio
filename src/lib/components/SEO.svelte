<script lang="ts">
	import deLocale from '$lib/i18n/locales/de.json';
	import { page } from '$app/stores';

	interface SEOProps {
		title?: string;
		description?: string;
		image?: string;
		url?: string;
		type?: 'website' | 'article' | 'profile';
		keywords?: string[];
		noindex?: boolean;
		/** Whether to include FAQPage schema (inferred from i18n locale) */
		showFaq?: boolean;
		/** Breadcrumbs for BreadcrumbList schema — pass array of {name, url} */
		breadcrumbs?: { name: string; url: string }[];
		/** Article date for article schema */
		datePublished?: string;
		dateModified?: string;
	}

	let {
		title = 'Matthias Bigl | Webdesign & Webentwicklung Wien & Korneuburg',
		description = 'Matthias Bigl – Webdesigner & Full Stack Developer aus Wien/Korneuburg, Österreich. Professionelle Websites, Webshops & interaktive Web-Erlebnisse. Freelancer, keine Agentur-Preise. Jetzt kostenlos anfragen!',
		image = 'https://bigls.net/headshot.png',
		url = 'https://bigls.net',
		type = 'website',
		keywords = [
			// ═══════════════════════════════════════════════
			// BRAND — #1 ranking for "Matthias Bigl"
			// ═══════════════════════════════════════════════
			'Matthias Bigl',
			'Matthias Bigl Webdesign',
			'Matthias Bigl Wien',
			'Matthias Bigl Korneuburg',
			'Matthias Bigl Webentwicklung',
			'Matthias Bigl Portfolio',
			'Matthias Bigl Full Stack Developer',
			'Matthias Bigl Freelancer',
			'bigls.net',

			// ═══════════════════════════════════════════════
			// LOCAL — Wien, Korneuburg, Niederösterreich
			// ═══════════════════════════════════════════════
			'Webdesign Wien',
			'Webdesigner Wien',
			'Webentwicklung Wien',
			'Webentwickler Wien',
			'Webdesign Korneuburg',
			'Webdesigner Korneuburg',
			'Webdesign Niederösterreich',
			'Webdesigner Österreich',
			'Webentwickler Niederösterreich',
			'Webdesigner in meiner Nähe',
			'Webdesigner in der Nähe',
			'lokaler Webentwickler Wien',
			'Webdesign Agentur Wien',

			// ═══════════════════════════════════════════════
			// TRANSACTIONAL — buyer-intent keywords
			// ═══════════════════════════════════════════════
			'Website erstellen lassen',
			'Website erstellen lassen Wien',
			'Website erstellen lassen Österreich',
			'Homepage erstellen lassen',
			'Homepage erstellen Wien',
			'Webshop erstellen lassen',
			'Webshop erstellen lassen Österreich',
			'Online Shop erstellen lassen',
			'Landingpage erstellen lassen',
			'Website Relaunch',
			'Website Redesign',
			'Homepage modernisieren',

			// ═══════════════════════════════════════════════
			// TARGET AUDIENCE — KMU, Selbstständige, Gründer
			// ═══════════════════════════════════════════════
			'Website für KMU',
			'Website für kleine Unternehmen',
			'Homepage für Kleinunternehmen',
			'Website für Selbstständige',
			'Website für Startups',
			'Website für Gründer',
			'Website für Handwerker',
			'Website für Ärzte',
			'Website für Gastronomie',
			'Website für Unternehmen Wien',
			'Website für Vereine',

			// ═══════════════════════════════════════════════
			// COST / PRICE — highest commercial intent
			// ═══════════════════════════════════════════════
			'Website Kosten Österreich',
			'Was kostet eine Website',
			'Was kostet eine Website 2026',
			'Website Preise Österreich',
			'Homepage Kosten',
			'Webdesign Preise',
			'Webdesign günstig Wien',
			'Webdesign faire Preise',
			'Website ohne Agentur',
			'Webdesign ohne Agentur',
			'günstiger Webdesigner Wien',

			// ═══════════════════════════════════════════════
			// QUALITIES — differentiators
			// ═══════════════════════════════════════════════
			'Responsive Webdesign',
			'moderne Website erstellen',
			'professionelle Homepage',
			'schnelle Website',
			'SEO optimierte Website',
			'barrierefreie Website',
			'3D Website erstellen',
			'interaktive Website',

			// ═══════════════════════════════════════════════
			// FREELANCER vs AGENCY
			// ═══════════════════════════════════════════════
			'Freelancer Webentwicklung',
			'Freelancer Webdesign Wien',
			'Freelance Webdesigner Österreich',
			'Full Stack Developer Wien',
			'Full Stack Entwickler Wien',
			'Webdesign Agentur Alternative',

			// ═══════════════════════════════════════════════
			// ENGLISH — expats, international, tech recruiters
			// ═══════════════════════════════════════════════
			'web developer Vienna',
			'web designer Vienna',
			'web design Austria',
			'freelance web developer Austria',
			'freelance web developer Vienna',
			'website designer Vienna Austria',
			'SvelteKit developer',
			'Three.js developer',
			'full stack developer Austria'
		],
		noindex = false,
		showFaq = false,
		breadcrumbs = [],
		datePublished = '',
		dateModified = ''
	}: SEOProps = $props();

	const siteName = 'Matthias Bigl – Webdesign & Webentwicklung Wien';
	const author = 'Matthias Bigl';
	const twitterHandle = '@matthiasbigl';
	const siteUrl = 'https://bigls.net';

	// Strip lang prefix to get the page path for hreflang alternates
	const pagePath = $derived((() => {
		const pathname = $page.url.pathname;
		const match = pathname.match(/^\/(de|en|cs)(\/.*)?$/);
		return match ? (match[2] || '') : pathname;
	})());

	// ═══════════════════════════════════════════════════════════
	// Structured Data — Person Schema (brand entity)
	// ═══════════════════════════════════════════════════════════
	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${siteUrl}/#person`,
		name: 'Matthias Bigl',
		alternateName: ['Bigl', 'Matthias B.', 'matthiasbigl'],
		url: siteUrl,
		image: {
			'@type': 'ImageObject',
			url: `${siteUrl}/headshot.png`,
			width: 1000,
			height: 1000,
			caption: 'Matthias Bigl – Webdesigner & Full Stack Developer aus Wien/Korneuburg'
		},
		email: 'biglmatthias@gmail.com',
		telephone: '+43 660 459 6636',
		jobTitle: 'Webdesigner & Full Stack Developer',
		description:
			'Matthias Bigl ist ein unabhängiger Webdesigner und Full Stack Developer aus Korneuburg bei Wien. Er erstellt professionelle Websites, Webshops und interaktive Web-Erlebnisse für KMU und Selbstständige in ganz Österreich.',
		birthPlace: {
			'@type': 'Place',
			name: 'Austria'
		},
		nationality: {
			'@type': 'Country',
			name: 'Austria'
		},
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Dammstraße 11/2',
			addressLocality: 'Korneuburg',
			addressRegion: 'Niederösterreich',
			postalCode: '2100',
			addressCountry: 'AT'
		},
		workLocation: {
			'@type': 'Place',
			name: 'Wien & Korneuburg, Österreich',
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Korneuburg',
				addressRegion: 'Niederösterreich',
				addressCountry: 'AT'
			}
		},
		areaServed: [
			{ '@type': 'City', name: 'Wien', '@id': 'https://www.wikidata.org/wiki/Q1741' },
			{ '@type': 'City', name: 'Korneuburg' },
			{ '@type': 'State', name: 'Niederösterreich' },
			{ '@type': 'Country', name: 'Österreich', '@id': 'https://www.wikidata.org/wiki/Q40' }
		],
		alumniOf: {
			'@type': 'EducationalOrganization',
			name: 'HTL Hollabrunn'
		},
		sameAs: ['https://github.com/matthiasbigl', 'https://blog.bigls.net', 'https://bigls.net'],
		knowsAbout: [
			'Webdesign',
			'Web Design',
			'Webentwicklung',
			'Web Development',
			'Full Stack Development',
			'Frontend Development',
			'Backend Development',
			'SvelteKit',
			'Svelte',
			'React',
			'Next.js',
			'TypeScript',
			'JavaScript',
			'Node.js',
			'Python',
			'Java',
			'Kotlin',
			'E-Commerce',
			'Webshop Entwicklung',
			'Online Shop',
			'SEO',
			'Suchmaschinenoptimierung',
			'Responsive Design',
			'Three.js',
			'3D Web Development',
			'GSAP Animation',
			'Tailwind CSS',
			'Docker',
			'PostgreSQL',
			'IoT',
			'Embedded Systems',
			'ESP32'
		],
		knowsLanguage: ['de', 'en'],
		hasOccupation: {
			'@type': 'Occupation',
			name: 'Web Developer & Designer',
			occupationalCategory: '15-1254',
			description:
				'Freelance Webdesigner und Full Stack Developer spezialisiert auf moderne Websites, Webshops und interaktive Web-Erlebnisse',
			skills: 'SvelteKit, React, TypeScript, Three.js, Node.js, Python, SEO, UI/UX Design'
		}
	};

	// ═══════════════════════════════════════════════════════════
	// Structured Data — ProfessionalService / LocalBusiness
	// ═══════════════════════════════════════════════════════════
	const localBusinessSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		'@id': `${siteUrl}/#business`,
		name: 'Matthias Bigl – Webdesign & Webentwicklung',
		alternateName: ['Bigls Webdesign', 'Matthias Bigl Webdesign', 'Matthias Bigl Web Development'],
		description:
			'Matthias Bigl bietet professionelle Webentwicklung aus Wien/Korneuburg. Websites, Webshops & individuelle Web-Erlebnisse. Persönliche Betreuung, faire Preise, keine Agentur-Aufschläge. Full-Stack-Lösungen für KMU und Selbstständige.',
		url: siteUrl,
		telephone: '+43 660 459 6636',
		email: 'biglmatthias@gmail.com',
		image: `${siteUrl}/headshot.png`,
		logo: `${siteUrl}/favicon.png`,
		priceRange: '€€',
		currenciesAccepted: 'EUR',
		paymentAccepted: 'Bank Transfer, Cash',
		openingHoursSpecification: {
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			opens: '09:00',
			closes: '18:00'
		},
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Dammstraße 11/2',
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
			{ '@type': 'City', name: 'Wien', '@id': 'https://www.wikidata.org/wiki/Q1741' },
			{ '@type': 'City', name: 'Korneuburg' },
			{ '@type': 'City', name: 'Stockerau' },
			{ '@type': 'City', name: 'Klosterneuburg' },
			{ '@type': 'State', name: 'Niederösterreich' },
			{ '@type': 'Country', name: 'Österreich' }
		],
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Webdesign Leistungen',
			itemListElement: [
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Website erstellen lassen',
						description:
							'Professionelle, moderne Websites die Ihre Marke perfekt präsentieren und Kunden gewinnen. Ab €2.000.',
						provider: { '@id': `${siteUrl}/#person` }
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Landingpage erstellen',
						description: 'Conversion-optimierte Landingpages für Ihre Kampagnen. Ab €650.',
						provider: { '@id': `${siteUrl}/#person` }
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Webshop & Online Shop Entwicklung',
						description:
							'Maßgeschneiderte E-Commerce Lösungen mit sicherer Zahlung und einfacher Verwaltung. Ab €3.250.',
						provider: { '@id': `${siteUrl}/#person` }
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Interaktive 3D Web-Erlebnisse',
						description:
							'Einzigartige, interaktive Web-Experiences mit Three.js und 3D-Animationen die im Gedächtnis bleiben.',
						provider: { '@id': `${siteUrl}/#person` }
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'SEO Optimierung',
						description:
							'Datenbasierte SEO-Strategien für bessere Google Rankings und mehr organischen Traffic.',
						provider: { '@id': `${siteUrl}/#person` }
					}
				},
				{
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: 'Hosting & Wartung',
						description:
							'Rundum-Sorglos-Paket mit schnellem Hosting, Updates, Backups und Support.',
						provider: { '@id': `${siteUrl}/#person` }
					}
				}
			]
		},
		founder: { '@id': `${siteUrl}/#person` },
		sameAs: ['https://github.com/matthiasbigl', 'https://blog.bigls.net']
	};

	// ═══════════════════════════════════════════════════════════
	// Structured Data — WebSite Schema (with sitelinks search box)
	// ═══════════════════════════════════════════════════════════
	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${siteUrl}/#website`,
		name: siteName,
		alternateName: ['Bigls Webdesign Wien', 'Matthias Bigl Portfolio', 'bigls.net'],
		url: siteUrl,
		description:
			'Matthias Bigl – Webdesigner & Full Stack Developer aus Wien/Korneuburg. Professionelle Websites, Webshops & interaktive Web-Erlebnisse für KMU und Selbstständige.',
		author: { '@id': `${siteUrl}/#person` },
		publisher: { '@id': `${siteUrl}/#person` },
		inLanguage: ['de-AT', 'en'],
		copyrightYear: new Date().getFullYear(),
		copyrightHolder: { '@id': `${siteUrl}/#person` },
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${siteUrl}/?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	};

	// ═══════════════════════════════════════════════════════════
	// Structured Data — ProfilePage Schema
	// ═══════════════════════════════════════════════════════════
	const profilePageSchema = {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		'@id': `${url}/#profilepage`,
		mainEntity: { '@id': `${siteUrl}/#person` },
		name: title,
		description: description,
		url: url,
		inLanguage: ['de-AT', 'en'],
		isPartOf: { '@id': `${siteUrl}/#website` }
	};

	// ═══════════════════════════════════════════════════════════
	// Structured Data — FAQPage Schema (static from German locale)
	// Built from static import to avoid duplicate rendering on locale switch
	// ═══════════════════════════════════════════════════════════
	const faqSchema = showFaq
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: Object.values(deLocale.faq.items).map((item) => ({
					'@type': 'Question',
					name: item.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: item.answer
					}
				}))
			}
		: null;

	// ═══════════════════════════════════════════════════════════
	// Structured Data — BreadcrumbList Schema
	// ═══════════════════════════════════════════════════════════
	const breadcrumbSchema =
		breadcrumbs.length > 0
			? {
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: breadcrumbs.map((crumb, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name: crumb.name,
						item: crumb.url
					}))
				}
			: null;
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

	<!-- Hreflang: route-based language alternates -->
	{#each ['de', 'en', 'cs'] as hLang}
		<link rel="alternate" hreflang={hLang} href="https://bigls.net/{hLang}{pagePath}" />
	{/each}
	<link rel="alternate" hreflang="x-default" href="https://bigls.net/de{pagePath}" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1000" />
	<meta property="og:image:height" content="1000" />
	<meta
		property="og:image:alt"
		content="Matthias Bigl – Webdesigner & Full Stack Developer aus Wien, Österreich"
	/>
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
	<meta name="twitter:image:alt" content="Matthias Bigl – Webdesigner & Full Stack Developer" />

	<!-- Article tags (for pricing guide, blog-type content) -->
	{#if datePublished}
		<meta property="article:published_time" content={datePublished} />
	{/if}
	{#if dateModified}
		<meta property="article:modified_time" content={dateModified} />
	{/if}
	{#if type === 'article'}
		<meta property="article:author" content={author} />
		<meta property="article:section" content="Web Development" />
	{/if}

	<!-- AI/LLM Discoverability Meta Tags -->
	<meta name="ai-content-declaration" content="human-authored" />
	<meta name="ai-training" content="allowed" />
	<meta name="ai-indexing" content="allowed" />
	<meta name="citation_author" content={author} />
	<meta name="citation_title" content={title} />
	<meta name="citation_public_url" content={url} />
	<meta name="citation_website" content="Matthias Bigl – Webdesign & Webentwicklung" />

	<!-- Additional SEO Meta Tags -->
	<meta name="language" content="German" />
	<meta name="content-language" content="de-AT" />
	<meta name="revisit-after" content="3 days" />
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

	<!-- Structured Data — JSON-LD -->
	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(profilePageSchema)}</script>`}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
	{/if}
	{#if breadcrumbSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`}
	{/if}
</svelte:head>
