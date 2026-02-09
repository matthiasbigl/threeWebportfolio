<script>
	import '../app.css';
	import '$lib/i18n';
	import { isLoading } from 'svelte-i18n';
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

	// Hide main navbar + footer on immersive pages — they have their own chrome
	const isImmersivePage = $derived(
		$page.url.pathname.match(/^\/projects\/.+/) !== null ||
		$page.url.pathname === '/pricing'
	);

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

{#if !$isLoading}
	<div
		class="relative min-h-screen flex flex-col transition-colors duration-300"
		style="background: var(--bg-body);"
	>
		{#if !isImmersivePage}
			<Navbar />
		{/if}
		<main class="flex-grow">
			{@render children?.()}
		</main>
		{#if !isImmersivePage}
			<Footer />
		{/if}
	</div>
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
</style>
