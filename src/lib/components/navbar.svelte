<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';

    let isHamOpen = false;
    let navbar: HTMLElement;

    function checkIfShouldClose(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (target.classList.contains("fixed")) {
            isHamOpen = false;
        }
    }

    function toggleMenu() {
        isHamOpen = !isHamOpen;
        
        if (browser) {
            if (isHamOpen) {
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
    }

    onMount(() => {
        if (!browser) return;

        // Navbar scroll effect
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            if (scrolled) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Initial navbar animation
        gsap.fromTo(navbar, 
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
        );

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<svelte:window on:click={checkIfShouldClose} />

<header bind:this={navbar} class="navbar fixed top-0 left-0 z-50 w-full flex items-center justify-center px-6 py-4 transition-all duration-300">
    <div class="w-full max-w-6xl flex-row flex items-center justify-between">
        <!-- Logo -->
        <div class="logo-container magnetic-btn">
            <button 
                class="w-14 h-14 text-xl rounded-xl glass-card glass-card-hover items-center justify-center flex font-bold text-white glow-border" 
                on:click={toggleMenu}
            >
                <span class="blue-gradient_text">MB</span>
            </button>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center justify-center text-center glass-card px-8 py-4 font-semibold">
            <a href="/" class="nav-link magnetic-btn hover:blue-gradient_text transition-all duration-300 hover:scale-110 px-6 py-2 relative overflow-hidden">
                Home
            </a>
            <div class="w-px h-6 bg-white/20 mx-2"></div>
            <a href="/assets/resume.pdf" download="MatthiasBigl-Resume.pdf" class="nav-link magnetic-btn hover:blue-gradient_text transition-all duration-300 hover:scale-110 px-6 py-2 relative overflow-hidden">
                Resume
            </a>
            <div class="w-px h-6 bg-white/20 mx-2"></div>
            <a href="/contact" class="nav-link magnetic-btn hover:blue-gradient_text transition-all duration-300 hover:scale-110 px-6 py-2 relative overflow-hidden">
                Contact
            </a>
        </nav>
    </div>
</header>

<!-- Mobile Menu -->
{#if isHamOpen}
    <div class="mobile-menu fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
         on:click={() => (isHamOpen = false)}
    >
        <div class="glass-card p-8 rounded-2xl m-6 max-w-sm w-full">
            <div class="flex flex-col space-y-6">
                <button
                    class="mobile-menu-item nav-link magnetic-btn text-xl font-semibold text-white hover:blue-gradient_text transition-all duration-300 text-center py-4 rounded-lg glass-card-hover"
                    on:click={() => {
                        goto("/");
                        isHamOpen = false;
                    }}
                >
                    Home
                </button>
                
                <a href="/assets/resume.pdf" download="MatthiasBigl-Resume.pdf" 
                   class="mobile-menu-item nav-link block text-xl font-semibold text-white hover:blue-gradient_text transition-all duration-300 text-center py-4 rounded-lg glass-card-hover"
                   on:click={() => (isHamOpen = false)}
                >
                    Resume
                </a>
                
                <button
                    class="mobile-menu-item nav-link magnetic-btn text-xl font-semibold text-white hover:blue-gradient_text transition-all duration-300 text-center py-4 rounded-lg glass-card-hover"
                    on:click={() => {
                        goto("/contact");
                        isHamOpen = false;
                    }}
                >
                    Contact
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .navbar {
        background: rgba(10, 10, 15, 0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .navbar-scrolled {
        background: rgba(10, 10, 15, 0.95);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
    }

    .logo-container::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0, 198, 255, 0.3) 0%, transparent 70%);
        transform: translate(-50%, -50%) scale(0);
        border-radius: 50%;
        transition: transform 0.3s ease;
        z-index: -1;
    }

    .logo-container:hover::after {
        transform: translate(-50%, -50%) scale(1.5);
    }
</style>

