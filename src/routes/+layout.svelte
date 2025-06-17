<script>
    import "../app.css";
    import Navbar from "$lib/components/navbar.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    onMount(() => {
        if (browser) {
            // Smooth scrolling behavior
            document.documentElement.style.scrollBehavior = 'smooth';
            
            // Add loading animation
            document.body.classList.add('loaded');
        }
    });
</script>

<main class="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <Navbar/>
    <slot/>
</main>

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