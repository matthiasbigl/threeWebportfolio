<script>
    import "../app.css";
    import Navbar from "$lib/components/navbar.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();

    onMount(() => {
        if (browser) {
            // Smooth scrolling behavior
            document.documentElement.style.scrollBehavior = 'smooth';
            
            // Add loading animation
            document.body.classList.add('loaded');
        }
    });
</script>

<svelte:head>    <!-- Primary Meta Tags -->
    <title>Matthias Bigl - Full Stack Developer & Designer</title>
    <meta name="title" content="Matthias Bigl - Full Stack Developer & Designer" />
    <meta name="description" content="Passionate full stack developer and designer creating innovative web experiences." />
    <meta name="author" content="Matthias Bigl" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://matthias-bigl.vercel.app/" />
    <meta property="og:title" content="Matthias Bigl - Full Stack Developer & Designer" />    <meta property="og:description" content="Passionate full stack developer and designer creating innovative web experiences." />    <meta property="og:image" content="https://matthias-bigl.vercel.app/assets/portfolioPreview.png" />
    <meta property="og:image:width" content="1350" />
    <meta property="og:image:height" content="720" />    
    <meta property="og:image:alt" content="Portfolio Preview" />    <meta property="og:site_name" content="Matthias Bigl Portfolio" />    

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://matthias-bigl.vercel.app/" />
    <meta property="twitter:title" content="Matthias Bigl - Full Stack Developer & Designer" />
    <meta property="twitter:description" content="Passionate full stack developer and designer creating innovative web experiences." />
    <meta property="twitter:image" content="https://matthias-bigl.vercel.app/assets/portfolioPreview.png" />
    <meta property="twitter:image:alt" content="Portfolio Preview" />


    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />    
    <meta name="language" content="English" />
    <meta name="revisit-after" content="7 days" />
    <meta name="theme-color" content="#0072ff" />
    <link rel="canonical" href="https://matthias-bigl.vercel.app/" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/favicon.png" />
</svelte:head>

<main class="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ">
    <Navbar/>
    {@render children?.()}
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
