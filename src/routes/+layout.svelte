<script>
	import '../app.css';
	import '$lib/i18n';
	import { isLoading, _ } from 'svelte-i18n';
	import { initLocaleFromStorage } from '$lib/i18n';
	import { initTheme } from '$lib/theme';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();

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
		}
	});
</script>

<CustomCursor />

<!-- Universal loading spinner: shown during i18n init + SvelteKit page navigations -->
<LoadingSpinner visible={$isLoading} fullscreen />

<div
	class="relative min-h-screen flex flex-col transition-colors duration-300"
	style="background: var(--bg-body);"
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
</style>
