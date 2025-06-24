<script lang="ts">
    import CustomCursor from "$lib/components/CustomCursor.svelte";
    import ScrollProgress from "$lib/components/ScrollProgress.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();

    let isSubmitting = $state(false);

    const contactMethods = [
        {
            icon: 'email',
            title: 'Email',
            value: 'biglmatthias@gmail.com',
            href: 'mailto:biglmatthias@gmail.com',
            description: 'Send me an email for any inquiries'
        },
        {
            icon: 'phone',
            title: 'Phone',
            value: '+43 660 459 6636',
            href: 'tel:+436604596636',
            description: 'Call me for urgent matters'
        },
        {
            icon: 'location',
            title: 'Location',
            value: 'Korneuburg, Austria',
            href: 'https://maps.google.com/?q=Korneuburg,Austria',
            description: 'Based in beautiful Austria'
        },
        {
            icon: 'github',
            title: 'GitHub',
            value: '@matthiasbigl',
            href: 'https://github.com/matthiasbigl',
            description: 'Check out my code repositories'
        }    ];

    onMount(() => {
        if (!browser) return;

        // Hero animation
        gsap.fromTo(".contact-hero", 
            { opacity: 0, y: 100, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.7)", delay: 0.3 }
        );

        // Contact methods stagger animation
        gsap.fromTo(".contact-method", 
            { opacity: 0, y: 60, rotationX: -15 },
            { 
                opacity: 1, 
                y: 0, 
                rotationX: 0,
                duration: 0.8, 
                ease: "back.out(1.7)", 
                stagger: 0.2,
                delay: 0.8 
            }
        );

        // Form animation
        gsap.fromTo(".contact-form", 
            { opacity: 0, x: 50, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 1, ease: "power2.out", delay: 1.2 }
        );

        // Floating animations
        gsap.to(".floating-1", {
            y: -20,
            rotation: 5,
            duration: 4,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });

        gsap.to(".floating-2", {
            y: -15,
            rotation: -3,
            duration: 5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1
        });

        // Magnetic effect for contact cards
        document.querySelectorAll('.contact-card').forEach((card: any) => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { scale: 1, x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
            
            card.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(card, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Form input focus animations
        document.querySelectorAll('.form-input').forEach((input: any) => {
            input.addEventListener('focus', () => {
                gsap.to(input.parentElement, { scale: 1.02, duration: 0.3 });
            });
            
            input.addEventListener('blur', () => {
                gsap.to(input.parentElement, { scale: 1, duration: 0.3 });
            });
        });
    });
</script>

<svelte:head>
    <title>Contact - Matthias Bigl</title>
    <meta name="description" content="Get in touch with Matthias Bigl - Software Engineer from Austria"/>
    <meta name="keywords" content="Matthias Bigl, contact, email, phone, software engineer, austria, web developer"/>
</svelte:head>

<CustomCursor />
<ScrollProgress />

<main class="relative min-h-screen overflow-hidden pt-16 sm:pt-20">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 z-0">
        <div class="aurora-bg w-full h-full"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/70 to-gray-900/50"></div>
        
        <!-- Floating geometric shapes -->
        <div class="floating-1 absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
        <div class="floating-2 absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"></div>
        <div class="floating-1 absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        <!-- Hero Section -->
        <div class="contact-hero text-center mb-16 lg:mb-24">
            <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-glow">
                Let's <span class="blue-gradient_text">Connect</span>
            </h1>
            <p class="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Ready to bring your ideas to life? Let's discuss your next project and create something amazing together.
            </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
            
            <!-- Contact Methods -->
            <div class="space-y-6">
                <h2 class="text-2xl lg:text-3xl font-bold mb-8 text-gray-300">
                    Get In <span class="blue-gradient_text">Touch</span>
                </h2>
                
                <div class="grid gap-6">
                    {#each contactMethods as method, index}
                        <a href={method.href} target="_blank" rel="noopener noreferrer" 
                           class="contact-method contact-card glass-card glass-card-hover p-6 rounded-xl transition-all duration-300 group">
                            <div class="flex items-center gap-4">
                                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                                    {#if method.icon === 'email'}
                                        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    {:else if method.icon === 'phone'}
                                        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                    {:else if method.icon === 'location'}
                                        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    {:else if method.icon === 'github'}
                                        <svg class="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    {/if}
                                </div>
                                
                                <div class="flex-1">
                                    <h3 class="text-lg font-semibold text-white mb-1">{method.title}</h3>
                                    <p class="blue-gradient_text font-medium mb-1">{method.value}</p>
                                    <p class="text-sm text-gray-400">{method.description}</p>
                                </div>
                                
                                <div class="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form">
                <div class="glass-card p-8 rounded-2xl">
                    <h2 class="text-2xl lg:text-3xl font-bold mb-8 text-gray-300">
                        Send Me A <span class="blue-gradient_text">Message</span>
                    </h2>
                    
                    <form method="POST" use:enhance={() => {
                        isSubmitting = true;
                        return async ({ result, update }) => {
                            isSubmitting = false;
                            if (result.type === 'success') {
                                // Clear form on success
                                const form = document.querySelector('form')
                                if (form) form.reset();
                            }
                            await update();
                        };
                    }} class="space-y-6">                        <div class="form-field">
                            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                                Your Name
                            </label>
                            <div class="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form?.name ?? ''}
                                    required
                                    class="form-input w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                                    placeholder="John Doe"
                                    class:border-red-500={form?.errors?.name}
                                />
                                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {#if form?.errors?.name}
                                <p class="mt-2 text-sm text-red-400">{form.errors.name}</p>
                            {/if}
                        </div>                        <div class="form-field">
                            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                                Your Email
                            </label>
                            <div class="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form?.email ?? ''}
                                    required
                                    class="form-input w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
                                    placeholder="john@example.com"
                                    class:border-red-500={form?.errors?.email}
                                />
                                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {#if form?.errors?.email}
                                <p class="mt-2 text-sm text-red-400">{form.errors.email}</p>
                            {/if}
                        </div>                        <div class="form-field">
                            <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                                Your Message
                            </label>
                            <div class="relative">
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form?.message ?? ''}
                                    required
                                    rows="6"
                                    class="form-input w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                                    placeholder="Tell me about your project..."
                                    class:border-red-500={form?.errors?.message}
                                ></textarea>
                                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {#if form?.errors?.message}
                                <p class="mt-2 text-sm text-red-400">{form.errors.message}</p>
                            {/if}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            class="w-full magnetic-btn glass-card glass-card-hover px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span class="relative z-10">
                                {#if isSubmitting}
                                    <svg class="animate-spin w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                {:else}
                                    Send Message
                                {/if}
                            </span>
                            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>                        {#if form?.success}
                            <div class="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <p class="text-green-400 font-medium">{form.message}</p>
                            </div>
                        {/if}

                        {#if form?.errors?.form}
                            <div class="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p class="text-red-400 font-medium">{form.errors.form}</p>
                            </div>
                        {/if}
                    </form>
                </div>
            </div>
        </div>
        
        <!-- Additional CTA Section -->
        <div class="text-center mt-16 lg:mt-24">
            <div class="glass-card p-8 lg:p-12 rounded-2xl max-w-4xl mx-auto">
                <h3 class="text-2xl lg:text-3xl font-bold mb-4 text-glow">
                    Ready to start your <span class="blue-gradient_text">project</span>?
                </h3>
                <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                    I'm always excited to work on new challenges and help bring innovative ideas to life. Let's create something extraordinary together.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="mailto:biglmatthias@gmail.com" class="magnetic-btn glass-card glass-card-hover px-8 py-4 text-lg font-semibold text-white text-center rounded-xl border border-white/20">
                        Email Me
                    </a>
                    <a href="/assets/resume.pdf" download="MatthiasBigl-Resume.pdf" class="magnetic-btn glass-card glass-card-hover px-8 py-4 text-lg font-semibold text-white text-center rounded-xl">
                        Download Resume
                    </a>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .form-field {
        position: relative;
    }
    
    .form-field:hover .form-input {
        border-color: rgba(59, 130, 246, 0.3);
        background: rgba(255, 255, 255, 0.08);
    }
    
    .contact-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .contact-card:hover::before {
        opacity: 1;
    }
</style>
