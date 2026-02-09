<script>
	import '../app.css';
	import '$lib/i18n';
	import { isLoading } from 'svelte-i18n';
	import { initLocaleFromStorage } from '$lib/i18n';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
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
			// Initialize locale from localStorage
			initLocaleFromStorage();

			// Smooth scrolling behavior
			document.documentElement.style.scrollBehavior = 'smooth';

			// Add loading animation
			document.body.classList.add('loaded');
		}
	});
</script>

<CustomCursor />

{#if $isLoading}
	<div
		class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center"
	>
		<div
			class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
		></div>
	</div>
{:else}
	<div
		class="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col"
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

	:global(body) {
		opacity: 0;
		animation: fadeIn 1s ease-out forwards;
	}

	:global(body.loaded) {
		opacity: 1;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: rgba(59, 130, 246, 0.35) rgba(255, 255, 255, 0.05);
	}

	:global(::-webkit-scrollbar) {
		width: 6px;
	}

	:global(::-webkit-scrollbar-track) {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: linear-gradient(180deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.4));
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(99, 102, 241, 0.6));
	}
</style>
