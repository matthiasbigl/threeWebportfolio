<script lang="ts">
	import { locale, _ } from '$lib/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import Button from '$lib/components/Button.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	// Static German SEO metadata (avoids duplicate <head> on hydration locale switch)
	const seoTitle = 'Website Kosten Österreich 2026 | Was kostet eine Website? Matthias Bigl';
	const seoDescription = 'Was kostet eine Website 2026 in Österreich? Landingpages ab €650, Websites ab €2.000, Webshops ab €3.250. Ehrlicher Preisguide von Matthias Bigl – Webdesigner Wien/Korneuburg. Jetzt lesen!';
	const seoKeywords = [
		'Website Kosten Österreich',
		'Was kostet eine Website',
		'Was kostet eine Website 2026',
		'Webdesign Preise 2026',
		'Homepage Kosten Österreich',
		'Webdesigner Wien Preise',
		'Website erstellen lassen Kosten',
		'Landingpage Kosten',
		'Webshop Kosten Österreich',
		'Matthias Bigl Preise',
		'Webdesign günstig Wien',
		'Website Preise Vergleich'
	];

	let content = $state('');

	async function loadContent(lang: string) {
		try {
			const modules = import.meta.glob('$lib/content/pricing/*.md', { query: '?raw', import: 'default', eager: true });
			const rawContent = modules[`/src/lib/content/pricing/${lang}.md`] as string;

			if (rawContent) {
				content = await marked.parse(rawContent);
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
	title={seoTitle}
	description={seoDescription}
	keywords={seoKeywords}
	type="article"
	url="https://bigls.net/pricing"
	datePublished="2025-12-01"
	dateModified="2026-02-01"
	breadcrumbs={[
		{ name: 'Matthias Bigl', url: 'https://bigls.net' },
		{ name: seoTitle, url: 'https://bigls.net/pricing' }
	]}
/>

<div class="min-h-screen selection:bg-blue-500/20 relative overflow-hidden" style="background: var(--bg-body); color: var(--text-primary);">
	<!-- Background Effects -->
	<div class="fixed inset-0 z-0 pointer-events-none grid-lines" style="opacity: var(--grid-opacity);"></div>
	<div class="fixed inset-0 z-0 pointer-events-none">
		<div class="pricing-aurora w-full h-full"></div>
	</div>
	<!-- Floating orbs for depth -->
	<div class="fixed top-[15%] left-[5%] w-[500px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[120px] pointer-events-none animate-float-slow"></div>
	<div class="fixed bottom-[10%] right-[8%] w-[400px] h-[400px] bg-purple-600/[0.06] rounded-full blur-[100px] pointer-events-none animate-float-slow-reverse"></div>

	<!-- ═══════════════════════════════════════════════════════════ -->
	<!-- PAGE NAV — Fixed top bar with logo, back link & language    -->
	<!-- ═══════════════════════════════════════════════════════════ -->
	<nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style="background: var(--navbar-bg-scrolled); border-bottom: 1px solid var(--border-primary);">
		<div class="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16">
			<div class="flex items-center gap-3 sm:gap-4">
				<a href="/" class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0" style="background: var(--bg-surface); border: 1px solid var(--border-primary);">
					<span class="text-sm sm:text-base font-bold blue-gradient_text">MB</span>
				</a>
				<div class="w-px h-5" style="background: var(--border-primary);"></div>
				<a
					href="/"
					class="group flex items-center gap-2 hover:text-blue-400 transition-colors duration-300"
					style="color: var(--text-tertiary);"
				>
					<svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
					</svg>
					<span class="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase font-syne">{$_('pricing.backToHome')}</span>
				</a>
			</div>

			<div class="flex items-center gap-2">
				<ThemeToggle />
				<LanguageSwitcher />
			</div>
		</div>
	</nav>

	<div class="relative z-10 pt-24 pb-20">

		<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Glass card only on sm+ screens; on mobile, content flows openly -->
			<div
				class="pricing-card relative sm:rounded-[2rem] sm:shadow-2xl overflow-hidden"
			>
				<!-- Top accent gradient line (sm+ only) -->
				<div class="hidden sm:block absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
				<!-- Inner glow (sm+ only) -->
				<div class="hidden sm:block absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] via-transparent to-purple-500/[0.02] pointer-events-none"></div>

				<div class="relative z-10 py-2 sm:p-12 lg:p-16">
					<!-- Custom wrapper for markdown content -->
					<div class="pricing-content">
						{@html content}
					</div>

					<!-- CTA Block — Glass style matching site aesthetic -->
					<div
						class="pricing-cta mt-12 sm:mt-20 relative rounded-xl sm:rounded-2xl overflow-hidden group"
					>
						<!-- Glass background -->
						<div class="absolute inset-0" style="background: var(--glass-bg);"></div>
						<div class="absolute inset-0 bg-gradient-to-r from-blue-600/[0.06] via-purple-600/[0.04] to-blue-600/[0.06]"></div>
						<!-- Top accent line -->
						<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
						<!-- Animated sheen -->
						<div
							class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
						></div>
						
						<div class="relative z-10 p-6 sm:p-10 lg:p-14">
							<div class="flex flex-col md:flex-row items-center gap-6 md:gap-12">
								<div class="flex-1 text-center md:text-left">
									<h2 class="text-2xl sm:text-3xl lg:text-4xl font-poppins font-bold mb-3 sm:mb-4 !mt-0 !bg-none tracking-tight" style="color: var(--text-heading);">
										{$locale === 'de' ? 'Bereit für Ihr Projekt?' : 'Ready for your project?'}
									</h2>
									<p class="text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-lg" style="color: var(--text-secondary);">
										{$locale === 'de'
											? 'Lassen Sie uns gemeinsam herausfinden, wie wir Ihre Ziele erreichen können.'
											: "Let's find out together how we can achieve your goals."}
									</p>
								</div>
								<Button
									href="/contact"
									variant="primary"
									className="flex-shrink-0 no-underline !text-base sm:!text-lg"
								>
									{$_('hero.cta')}
									<svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	</div>
</div>

<style>
	/* Pricing page aurora - more dramatic than global */
	.pricing-aurora {
		background: radial-gradient(ellipse at 25% 15%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
			radial-gradient(ellipse at 75% 85%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
			radial-gradient(ellipse at 50% 50%, rgba(37, 99, 235, 0.04) 0%, transparent 60%);
		filter: blur(60px);
	}

	.grid-lines {
		background-image: linear-gradient(var(--grid-color) 1px, transparent 1px),
			linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
		background-size: 60px 60px;
	}

	/* Main card glass effect — transparent on mobile, glass on sm+ */
	.pricing-card {
		background: transparent;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	@media (min-width: 640px) {
		.pricing-card {
			background: var(--glass-bg);
			backdrop-filter: blur(40px) saturate(150%);
			-webkit-backdrop-filter: blur(40px) saturate(150%);
			border: 1px solid var(--glass-border);
		}
		.pricing-cta {
			border: 1px solid var(--glass-border);
		}
	}

	/* Floating orb animations */
	:global(.animate-float-slow) {
		animation: floatSlow 18s ease-in-out infinite;
	}
	:global(.animate-float-slow-reverse) {
		animation: floatSlowReverse 22s ease-in-out infinite;
	}
	@keyframes floatSlow {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(30px, -40px); }
	}
	@keyframes floatSlowReverse {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(-25px, 35px); }
	}

	/* ─── MARKDOWN CONTENT STYLING ─── */
	:global(.pricing-content) {
		color: var(--text-secondary);
		font-family: 'Work Sans', sans-serif;
		line-height: 1.85;
		font-size: 1.05rem;
	}

	/* ── HEADINGS ── */
	:global(.pricing-content h1) {
		font-family: 'Poppins', sans-serif;
		font-weight: 800;
		font-size: clamp(2rem, 5vw, 3.25rem);
		letter-spacing: -0.03em;
		color: var(--text-heading);
		margin-top: 0;
		margin-bottom: 1.25rem;
		line-height: 1.1;
	}

	:global(.pricing-content h2) {
		font-family: 'Poppins', sans-serif;
		font-weight: 700;
		font-size: clamp(1.5rem, 3.5vw, 2rem);
		letter-spacing: -0.02em;
		color: var(--text-heading);
		margin-top: 4rem;
		margin-bottom: 1.5rem;
		line-height: 1.2;
		padding-bottom: 0.75rem;
		position: relative;
	}

	:global(.pricing-content h2::after) {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		border-radius: 2px;
	}

	:global(.pricing-content h3) {
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
		font-size: clamp(1.125rem, 2.5vw, 1.375rem);
		letter-spacing: -0.01em;
		color: var(--text-heading);
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		line-height: 1.3;
	}

	/* ── PARAGRAPHS ── */
	:global(.pricing-content p) {
		margin-bottom: 1.5rem;
		color: var(--text-secondary);
	}

	/* ── BOLD/STRONG – Gradient accent ── */
	:global(.pricing-content strong) {
		background: linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		font-weight: 700;
	}

	/* ── LINKS ── */
	:global(.pricing-content a) {
		color: #60a5fa;
		text-decoration: none;
		border-bottom: 1px solid rgba(96, 165, 250, 0.25);
		transition: all 0.25s ease;
		font-weight: 500;
	}
	:global(.pricing-content a:hover) {
		color: #93c5fd;
		border-bottom-color: rgba(147, 197, 253, 0.6);
		text-shadow: 0 0 12px rgba(96, 165, 250, 0.3);
	}

	/* ── HORIZONTAL RULES ── */
	:global(.pricing-content hr) {
		border: none;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--border-primary), transparent);
		margin: 3rem 0;
	}

	/* ── LISTS ── */
	:global(.pricing-content ul) {
		list-style: none;
		padding-left: 0;
		margin: 1.5rem 0;
	}
	:global(.pricing-content ul li) {
		position: relative;
		padding-left: 1.75rem;
		margin-bottom: 0.75rem;
		color: var(--text-secondary);
	}
	:global(.pricing-content ul li::before) {
		content: '';
		position: absolute;
		left: 0;
		top: 0.65em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
	}
	:global(.pricing-content ol) {
		counter-reset: pricing-counter;
		list-style: none;
		padding-left: 0;
		margin: 1.5rem 0;
	}
	:global(.pricing-content ol li) {
		counter-increment: pricing-counter;
		position: relative;
		padding-left: 2.5rem;
		margin-bottom: 1rem;
		color: var(--text-secondary);
	}
	:global(.pricing-content ol li::before) {
		content: counter(pricing-counter) '.';
		position: absolute;
		left: 0;
		top: 0;
		font-family: 'Poppins', sans-serif;
		font-weight: 700;
		font-size: 1rem;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	/* ── TABLES – Premium glass card look ── */
	:global(.pricing-content table) {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		margin: 2.5rem 0;
		background: var(--bg-surface);
		backdrop-filter: blur(20px);
		border-radius: 1rem;
		border: 1px solid var(--glass-border);
		box-shadow: var(--card-shadow);
		overflow: hidden;
	}

	:global(.pricing-content thead) {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%);
	}

	:global(.pricing-content th) {
		text-align: left;
		padding: 1rem 1.25rem;
		color: var(--text-heading);
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		border-bottom: 1px solid var(--border-primary);
		white-space: nowrap;
	}

	:global(.pricing-content td) {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border-secondary);
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	:global(.pricing-content tr:last-child td) {
		border-bottom: none;
	}

	:global(.pricing-content tbody tr) {
		transition: all 0.2s ease;
	}

	:global(.pricing-content tbody tr:hover td) {
		background: rgba(59, 130, 246, 0.04);
		color: var(--text-heading);
	}

	/* First column in tables - the category/type */
	:global(.pricing-content td:first-child) {
		color: var(--text-heading);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		:global(.pricing-content table) {
			display: block;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			border: none;
		}
		:global(.pricing-content th),
		:global(.pricing-content td) {
			padding: 0.75rem 1rem;
			font-size: 0.85rem;
		}
	}

	/* ── BLOCKQUOTE ── */
	:global(.pricing-content blockquote) {
		border-left: 3px solid rgba(59, 130, 246, 0.5);
		padding: 1rem 1.5rem;
		margin: 2rem 0;
		background: rgba(59, 130, 246, 0.04);
		border-radius: 0 0.75rem 0.75rem 0;
		color: var(--text-secondary);
		font-style: italic;
	}

	/* ── EMPHASIS ── */
	:global(.pricing-content em) {
		color: var(--text-secondary);
		font-style: italic;
	}

	/* ── MOBILE TIGHTENING ── */
	@media (max-width: 639px) {
		:global(.pricing-content) {
			font-size: 0.95rem;
			line-height: 1.7;
		}
		:global(.pricing-content h1) {
			margin-bottom: 1rem;
		}
		:global(.pricing-content h2) {
			margin-top: 2.5rem;
			margin-bottom: 1rem;
		}
		:global(.pricing-content h3) {
			margin-top: 1.75rem;
		}
		:global(.pricing-content hr) {
			margin: 2rem 0;
		}
		:global(.pricing-content blockquote) {
			padding: 0.75rem 1rem;
			margin: 1.5rem 0;
		}
	}
</style>
