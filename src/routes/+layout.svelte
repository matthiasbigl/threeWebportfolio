<script>
    import "../app.css";
    import "$lib/i18n";
    import { isLoading } from 'svelte-i18n';
    import { initLocaleFromStorage } from '$lib/i18n';
    import Navbar from "$lib/components/navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import SEO from "$lib/components/SEO.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();

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

<!-- Default SEO - will be overridden by page-specific SEO components -->
<SEO />

{#if $isLoading}
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
{:else}
    <div class="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
        <Navbar/>
        <main class="flex-grow">
            {@render children?.()}
        </main>
        <Footer />
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
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    :global(*) {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 198, 255, 0.5) rgba(255, 255, 255, 0.1);
    }
    
    :global(::-webkit-scrollbar) {
        width: 8px;
    }
    
    :global(::-webkit-scrollbar-track) {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
    
    :global(::-webkit-scrollbar-thumb) {
        background: linear-gradient(45deg, #00c6ff, #0072ff);
        border-radius: 4px;
    }
    
    :global(::-webkit-scrollbar-thumb:hover) {
        background: linear-gradient(45deg, #0072ff, #7b68ee);
    }
</style>
