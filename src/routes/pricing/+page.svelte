<script lang="ts">
	import { locale, _ } from '$lib/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	let content = $state('');
	let metadata = $state({
		title: '',
		description: '',
		keywords: []
	});

	async function loadContent(lang: string) {
		try {
			// In a real SvelteKit app, you might use a server load function or a vite glob import
			// For this specific setup, we'll fetch the raw markdown files
			// Since they are in src/lib/content, they might not be directly fetchable if not served as static
			// However, for SvelteKit, we can use import.meta.glob

			const modules = import.meta.glob('$lib/content/pricing/*.md', { as: 'raw', eager: true });
			const rawContent = modules[`/src/lib/content/pricing/${lang}.md`] as string;

			if (rawContent) {
				content = await marked.parse(rawContent);

				// Basic SEO metadata extraction from the markdown if needed,
				// but we'll use high-quality defaults for this page
				if (lang === 'de') {
					metadata = {
						title: 'Website Kosten Österreich 2026 | Preise & ROI Guide',
						description:
							'Was kostet eine Website 2026 in Österreich? Ein ehrlicher Guide zu Preisen von Landingpages bis Webshops, Strategie und ROI. Jetzt lesen!',
						keywords: [
							'Website Kosten Österreich',
							'Webdesign Preise 2026',
							'Homepage Kosten',
							'Webdesigner Wien Preise'
						]
					};
				} else {
					metadata = {
						title: 'Website Costs Austria 2026 | Pricing & ROI Guide',
						description:
							'How much does a website cost in 2026 in Austria? An honest guide to pricing from landing pages to webshops, strategy and ROI.',
						keywords: [
							'Website Costs Austria',
							'Web Design Prices 2026',
							'Homepage Costs',
							'Web Developer Vienna Prices'
						]
					};
				}
			}
		} catch (e) {
			console.error('Failed to load pricing content', e);
		}
	}

	$effect(() => {
		loadContent($locale || 'de');
	});
</script>

<SEO
	title={metadata.title}
	description={metadata.description}
	keywords={metadata.keywords}
	type="article"
/>

<div class="min-h-screen bg-[#0a0a0f] text-white selection:bg-blue-500/20 relative overflow-hidden">
	<!-- Background Effects -->
	<div class="fixed inset-0 z-0 opacity-[0.05] pointer-events-none grid-lines"></div>
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<div class="relative z-10 pt-24 pb-16">
		<div class="max-w-4xl mx-auto px-6 lg:px-8 mb-12">
			<a
				href="/"
				class="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group mb-8 font-medium"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="group-hover:-translate-x-1 transition-transform"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
				{$_('pricing.backToHome')}
			</a>
		</div>

		<article class="max-w-4xl mx-auto px-6 lg:px-8">
			<div
				class="glass-section p-8 sm:p-12 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl"
			>
				<!-- Custom wrapper instead of prose to force exact design -->
				<div class="pricing-content">
					{@html content}
				</div>

				<div
					class="mt-16 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 border border-blue-400/20 relative overflow-hidden group"
				>
					<div
						class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					></div>
					<div class="relative z-10">
						<h2 class="text-3xl font-poppins font-bold mb-4 !text-white !mt-0 !bg-none">
							{$locale === 'de' ? 'Bereit für Ihr Projekt?' : 'Ready for your project?'}
						</h2>
						<p class="text-xl opacity-90 mb-8 font-light !text-white/90">
							{$locale === 'de'
								? 'Lassen Sie uns gemeinsam herausfinden, wie wir Ihre Ziele erreichen können. Kostenlos und unverbindlich.'
								: "Let's find out together how we can achieve your goals. Free and without obligation."}
						</p>
						<a
							href="/contact"
							class="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg no-underline"
						>
							{$_('hero.cta')}
						</a>
					</div>
				</div>
			</div>
		</article>
	</div>
</div>

<style>
	/* Aurora Background */
	.aurora-bg {
		background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
			radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%);
		filter: blur(80px);
	}

	.grid-lines {
		background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 50px 50px;
	}

	.glass-section {
		background: rgba(13, 17, 23, 0.65);
	}

	/* Manual Markdown Styling - "The Hard Way" to ensure match */
	:global(.pricing-content) {
		color: #cbd5e1; /* text-slate-300 */
		font-family: 'Work Sans', sans-serif;
		line-height: 1.8;
	}

	/* Headings */
	:global(.pricing-content h1),
	:global(.pricing-content h2),
	:global(.pricing-content h3) {
		font-family: 'Poppins', sans-serif;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: white;
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		line-height: 1.2;
		text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}

	:global(.pricing-content h1) {
		font-size: 3rem;
	}
	@media (max-width: 640px) {
		:global(.pricing-content h1) {
			font-size: 2.25rem;
		}
	}

	:global(.pricing-content h2) {
		font-size: 2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 0.5rem;
	}

	:global(.pricing-content h3) {
		font-size: 1.5rem;
		color: #e2e8f0;
	}

	/* Highlights - The "Blue Gradient" */
	:global(.pricing-content strong) {
		background: linear-gradient(135deg, #00c6ff 0%, #0072ff 50%, #7b68ee 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		background-size: 200% 200%;
		animation: gradientShift 3s ease-in-out infinite;
		font-weight: 800;
		text-shadow: 0 0 20px rgba(0, 198, 255, 0.3);
	}

	/* Links */
	:global(.pricing-content a) {
		color: #60a5fa;
		text-decoration: none;
		border-bottom: 1px solid rgba(96, 165, 250, 0.3);
		transition: all 0.2s;
	}
	:global(.pricing-content a:hover) {
		color: #93c5fd;
		border-bottom-color: #93c5fd;
	}

	/* Tables - The Glass Card Look */
	:global(.pricing-content table) {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		margin: 3rem 0;
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(20px);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	:global(.pricing-content thead) {
		background: rgba(255, 255, 255, 0.05);
	}

	:global(.pricing-content th) {
		text-align: left;
		padding: 1.25rem 1.5rem;
		color: #fff;
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.85rem;
		letter-spacing: 0.05em;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(.pricing-content td) {
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		color: #cbd5e1;
	}

	:global(.pricing-content tr:last-child td) {
		border-bottom: none;
	}

	:global(.pricing-content tr:hover td) {
		background: rgba(255, 255, 255, 0.03);
		color: white;
	}

	@media (max-width: 768px) {
		:global(.pricing-content table) {
			display: block;
			overflow-x: auto;
		}
	}

	/* Animations matches app.css */
	@keyframes gradientShift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
