<script>
	import '../app.css';
	import '$lib/i18n';
	import { isLoading, _ } from 'svelte-i18n';
	import { initLocaleFromStorage } from '$lib/i18n';
	import { initTheme } from '$lib/theme';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();

	let showScrollIndicator = $state(true);

	// ─── Sub-page route config ───
	// One array. Add a route → navbar and footer adapt automatically.
	// pattern: regex tested against pathname
	// backHref / backLabelKey: fed straight into Navbar
	// hideFooter: true when the page has its own CTA footer
	const subPageRoutes = [
		{
			pattern: /^\/projects\/.+/,
			backHref: '/#projects',
			backLabelKey: 'projectDetail.backLabel',
			hideFooter: true
		},
		{ pattern: /^\/pricing$/, backHref: '/', backLabelKey: 'pricing.backToHome', hideFooter: true }
	];

	const activeSubPage = $derived(subPageRoutes.find((r) => r.pattern.test($page.url.pathname)));

	const navConfig = $derived(
		activeSubPage
			? { backHref: activeSubPage.backHref, backLabel: $_(activeSubPage.backLabelKey) }
			: {}
	);

	const hideFooter = $derived(!!activeSubPage?.hideFooter);

	onMount(() => {
		if (browser) {
			initLocaleFromStorage();
			initTheme();

			const handleScroll = () => {
				showScrollIndicator = window.scrollY < 100;
			};
			window.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				window.removeEventListener('scroll', handleScroll);
			};
		}
	});
</script>

<CustomCursor />
<ScrollProgress />

<!-- Universal loading spinner: shown during i18n init + SvelteKit page navigations -->
<LoadingSpinner visible={$isLoading} fullscreen />

<div
	class="relative min-h-screen flex flex-col transition-colors duration-300"
	style="background: var(--bg-body);"
	data-reduced-motion={$reducedMotion}
>
	<Navbar backHref={navConfig.backHref} backLabel={navConfig.backLabel} />
	<main class="flex-grow">
		{@render children?.()}
	</main>
	{#if !hideFooter}
		<Footer />
	{:else}
		<div class="h-20 sm:h-32 pointer-events-none"></div>
	{/if}
</div>

{#if showScrollIndicator}
	<button
		class="scroll-indicator fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50 transition-all duration-500 hover:scale-110"
		style="opacity: {showScrollIndicator ? 1 : 0}; transform: translateY({showScrollIndicator
			? 0
			: 30}px);"
		onclick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
		aria-label={$_('a11y.scrollDown')}
	>
		<svg
			class="w-6 h-6 transition-transform duration-300 group-hover:translate-y-0.5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 14l-7 7m0 0l-7-7m7 7V3"
			/>
		</svg>
		<div class="scroll-indicator-ring absolute inset-0 rounded-full"></div>
		<div class="scroll-indicator-pulse absolute inset-0 rounded-full"></div>
	</button>
{/if}

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Avoid opacity:0 flash — show body immediately, use class for initial fade */
	:global(body) {
		opacity: 1;
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
	}

	:global(::-webkit-scrollbar) {
		width: 6px;
	}

	:global(::-webkit-scrollbar-track) {
		background: var(--scrollbar-track);
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: linear-gradient(180deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.4));
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.6));
	}

	/* Contain layout shifts in main sections */
	:global(section) {
		contain: layout style;
	}

	.scroll-indicator {
		background: linear-gradient(135deg, #3b82f6 0%, #7b68ee 100%);
		color: white;
		box-shadow:
			0 4px 20px rgba(59, 130, 246, 0.4),
			0 0 0 1px rgba(255, 255, 255, 0.1) inset;
	}

	.scroll-indicator-ring {
		border: 2px solid rgba(59, 130, 246, 0.3);
		animation: scroll-indicator-ring 2s ease-out infinite;
	}

	.scroll-indicator-pulse {
		background: rgba(59, 130, 246, 0.3);
		animation: scroll-indicator-pulse 2s ease-out infinite;
	}

	@keyframes scroll-indicator-ring {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.6);
			opacity: 0;
		}
	}

	@keyframes scroll-indicator-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.3;
		}
	}
</style>
