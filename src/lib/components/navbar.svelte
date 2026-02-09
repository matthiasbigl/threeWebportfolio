<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { _ } from 'svelte-i18n';
    import LanguageSwitcher from './LanguageSwitcher.svelte';
    import ThemeToggle from './ThemeToggle.svelte';

    /**
     * When backHref is set the center section shows a back-arrow link
     * instead of the full desktop navigation links. One navbar, one DOM
     * tree — only the middle swaps.
     */
    interface Props {
        /** URL the back arrow navigates to (e.g. "/" or "/#projects") */
        backHref?: string;
        /** Translated label shown next to the back arrow */
        backLabel?: string;
    }

    let { backHref, backLabel }: Props = $props();

    const isSubPage = $derived(!!backHref);

    // GSAP loaded dynamically to avoid blocking initial render
    let gsapModule: typeof import('gsap') | null = null;

    let isHamOpen = $state(false);
    let navbar: HTMLElement | undefined = $state();

    function checkIfShouldClose(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (target.classList.contains("fixed")) {
            isHamOpen = false;
        }
    }

    async function toggleMenu() {
        isHamOpen = !isHamOpen;
        
        if (browser && isHamOpen) {
            if (!gsapModule) gsapModule = await import('gsap');
            const { gsap } = gsapModule;
            gsap.fromTo(".mobile-menu", 
                { opacity: 0, scale: 0.8, y: -20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
            );
            gsap.fromTo(".mobile-menu-item", 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out", delay: 0.1 }
            );
        }
    }

    onMount(() => {
        if (!browser || !navbar) return;

        // Navbar scroll effect (no GSAP needed — pure DOM)
        const handleScroll = () => {
            if (!navbar) return;
            const scrolled = window.scrollY > 50;
            if (scrolled) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Lazy-load GSAP for the entrance animation
        (async () => {
            if (!gsapModule) gsapModule = await import('gsap');
            const { gsap } = gsapModule;
            gsap.fromTo(navbar, 
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
            );
        })();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<svelte:window onclick={checkIfShouldClose} />

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- UNIFIED NAVBAR — One header, center content swaps per route        -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
<header
    bind:this={navbar}
    class="navbar fixed top-0 left-0 z-50 w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300"
    class:navbar-sub={isSubPage}
>
    <div class="w-full max-w-6xl flex items-center justify-between">

        <!-- ── Left: Logo ── -->
        <div class="logo-container magnetic-btn shrink-0">
            <a 
                href="/"
                class="w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl rounded-xl glass-card glass-card-hover items-center justify-center flex font-bold glow-border" 
                style="color: var(--text-primary);"
            >
                <span class="blue-gradient_text">MB</span>
            </a>
        </div>

        <!-- ── Center: Nav links OR Back arrow ── -->
        {#if isSubPage}
            <a
                href={backHref}
                class="back-link group flex items-center gap-2 hover:text-blue-400 transition-colors duration-300"
                style="color: var(--text-tertiary);"
            >
                <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
                </svg>
                <span class="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase font-syne">{backLabel}</span>
            </a>
        {:else}
            <!-- Desktop Navigation (centered) -->
            <nav class="hidden md:flex items-center justify-center text-center glass-card px-6 lg:px-8 py-3 lg:py-4 font-semibold">
                <a href="/" class="nav-link magnetic-btn hover:blue-gradient_text transition-all duration-300 hover:scale-110 px-4 lg:px-6 py-2 relative overflow-hidden text-sm lg:text-base" style="color: var(--text-primary);">
                    {$_('nav.home')}
                </a>
                <div class="w-px h-6 bg-[var(--border-primary)] mx-2"></div>
                <a href="/#services" class="nav-link magnetic-btn hover:blue-gradient_text transition-all duration-300 hover:scale-110 px-4 lg:px-6 py-2 relative overflow-hidden text-sm lg:text-base" style="color: var(--text-primary);">
                    {$_('nav.services')}
                </a>
                <div class="w-px h-6 bg-[var(--border-primary)] mx-2"></div>
                <a href="/#faq" class="nav-link magnetic-btn hover:blue-gradient_text transition-all duration-300 hover:scale-110 px-4 lg:px-6 py-2 relative overflow-hidden text-sm lg:text-base" style="color: var(--text-primary);">
                    {$_('nav.faq')}
                </a>
                <div class="w-px h-6 bg-[var(--border-primary)] mx-2"></div>
                <a href="/contact" class="nav-link magnetic-btn hover:blue-gradient_text transition-all duration-300 hover:scale-110 px-4 lg:px-6 py-2 relative overflow-hidden text-sm lg:text-base" style="color: var(--text-primary);">
                    {$_('nav.contact')}
                </a>
            </nav>
        {/if}

        <!-- ── Right: Utilities ── -->
        <div class="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />

            <!-- Hamburger — only on mobile when showing full nav -->
            {#if !isSubPage}
                <button 
                    onclick={toggleMenu}
                    class="hamburger-btn md:hidden w-12 h-12 rounded-xl glass-card glass-card-hover flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border border-[var(--glass-border)]"
                    aria-label="Open menu"
                    aria-expanded={isHamOpen}
                >
                    <span 
                        class="hamburger-line w-6 h-0.5 rounded-full transition-all duration-300"
                        style="background: var(--text-primary);"
                        class:rotate-45={isHamOpen}
                        class:translate-y-2={isHamOpen}
                    ></span>
                    <span 
                        class="hamburger-line w-6 h-0.5 rounded-full transition-all duration-300"
                        style="background: var(--text-primary);"
                        class:opacity-0={isHamOpen}
                    ></span>
                    <span 
                        class="hamburger-line w-6 h-0.5 rounded-full transition-all duration-300"
                        style="background: var(--text-primary);"
                        class:-rotate-45={isHamOpen}
                        class:-translate-y-2={isHamOpen}
                    ></span>
                </button>
            {/if}
        </div>
    </div>
</header>

<!-- Mobile Menu (only for full-nav mode) -->
{#if !isSubPage && isHamOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="mobile-menu fixed top-0 left-0 w-full h-full backdrop-blur-md flex items-center justify-center z-50"
         style="background: var(--mobile-menu-bg);"
         onclick={() => (isHamOpen = false)}
    >        
        <div class="glass-card p-6 sm:p-8 rounded-2xl m-4 sm:m-6 max-w-sm w-full">
            <div class="flex flex-col space-y-4 sm:space-y-6">
                <button
                    class="mobile-menu-item nav-link magnetic-btn text-lg sm:text-xl font-semibold hover:blue-gradient_text transition-all duration-300 text-center py-3 sm:py-4 rounded-lg glass-card-hover"
                    style="color: var(--text-primary);"
                    onclick={() => {
                        goto("/");
                        isHamOpen = false;
                    }}
                >
                    {$_('nav.home')}
                </button>
                
                <a href="/#services" 
                   class="mobile-menu-item nav-link block text-lg sm:text-xl font-semibold hover:blue-gradient_text transition-all duration-300 text-center py-3 sm:py-4 rounded-lg glass-card-hover"
                   style="color: var(--text-primary);"
                   onclick={() => (isHamOpen = false)}
                >
                    {$_('nav.services')}
                </a>
                
                <a href="/#faq" 
                   class="mobile-menu-item nav-link block text-lg sm:text-xl font-semibold hover:blue-gradient_text transition-all duration-300 text-center py-3 sm:py-4 rounded-lg glass-card-hover"
                   style="color: var(--text-primary);"
                   onclick={() => (isHamOpen = false)}
                >
                    {$_('nav.faq')}
                </a>
                
                <button
                    class="mobile-menu-item nav-link magnetic-btn text-lg sm:text-xl font-semibold hover:blue-gradient_text transition-all duration-300 text-center py-3 sm:py-4 rounded-lg glass-card-hover"
                    style="color: var(--text-primary);"
                    onclick={() => {
                        goto("/contact");
                        isHamOpen = false;
                    }}
                >
                    {$_('nav.contact')}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .navbar {
        background: var(--navbar-bg);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border-bottom: 1px solid var(--navbar-border);
        transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    :global(.navbar-scrolled) {
        background: var(--navbar-bg-scrolled) !important;
        backdrop-filter: blur(32px) saturate(180%);
        -webkit-backdrop-filter: blur(32px) saturate(180%);
        border-bottom: 1px solid var(--navbar-border-scrolled) !important;
        box-shadow: 0 4px 24px var(--glass-shadow);
    }

    .nav-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 198, 255, 0.1), transparent);
        transform: translateX(-100%);
        transition: transform 0.6s ease;
    }

    .nav-link:hover::before {
        transform: translateX(100%);
    }

    .logo-container {
        position: relative;
        overflow: visible;
    }

    .logo-container::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 150%;
        height: 150%;
        background: radial-gradient(circle, rgba(0, 198, 255, 0.3) 0%, transparent 70%);
        transform: translate(-50%, -50%) scale(0);
        border-radius: 50%;
        transition: transform 0.3s ease;
        z-index: -1;
        pointer-events: none;
    }

    .logo-container:hover::after {
        transform: translate(-50%, -50%) scale(1.5);
    }

    /* Hamburger button styles */
    .hamburger-btn:hover .hamburger-line {
        background: linear-gradient(90deg, #00c6ff, #0072ff);
    }

    .hamburger-btn:active {
        transform: scale(0.95);
    }
</style>

