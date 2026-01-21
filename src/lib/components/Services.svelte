<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { _ } from 'svelte-i18n';

    if (browser) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Reactive services based on translations
    const services = $derived([
        {
            icon: '🌐',
            title: $_('services.items.websites.title'),
            description: $_('services.items.websites.description')
        },
        {
            icon: '🛒',
            title: $_('services.items.webshops.title'),
            description: $_('services.items.webshops.description')
        },
        {
            icon: '✨',
            title: $_('services.items.experiences.title'),
            description: $_('services.items.experiences.description')
        },
        {
            icon: '🔧',
            title: $_('services.items.fullstack.title'),
            description: $_('services.items.fullstack.description')
        }
    ]);

    const benefits = $derived([
        {
            icon: '🤝',
            title: $_('services.benefits.personal.title'),
            description: $_('services.benefits.personal.description')
        },
        {
            icon: '📍',
            title: $_('services.benefits.local.title'),
            description: $_('services.benefits.local.description')
        },
        {
            icon: '💰',
            title: $_('services.benefits.prices.title'),
            description: $_('services.benefits.prices.description')
        },
        {
            icon: '🎯',
            title: $_('services.benefits.detail.title'),
            description: $_('services.benefits.detail.description')
        },
        {
            icon: '⚡',
            title: $_('services.benefits.tech.title'),
            description: $_('services.benefits.tech.description')
        },
        {
            icon: '🛡️',
            title: $_('services.benefits.allInOne.title'),
            description: $_('services.benefits.allInOne.description')
        }
    ]);

    onMount(() => {
        if (!browser) return;

        // Animate service cards
        gsap.utils.toArray('.service-card').forEach((card: any, index: number) => {
            gsap.fromTo(
                card,
                { opacity: 0, y: 60, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%'
                    },
                    delay: index * 0.1
                }
            );
        });

        // Animate benefit cards
        gsap.utils.toArray('.benefit-card').forEach((card: any, index: number) => {
            gsap.fromTo(
                card,
                { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%'
                    }
                }
            );
        });
    });
</script>

<section id="services" class="services-section relative py-16 sm:py-20 lg:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-12 sm:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-glow">
                {$_('services.title')} <span class="blue-gradient_text">{$_('services.titleHighlight')}</span>
            </h2>
            <p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {@html $_('services.subtitle')}
            </p>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 sm:mb-20">
            {#each services as service, index}
                <article class="service-card glass-card p-6 sm:p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                    <div class="flex items-start gap-4">
                        <span class="text-4xl sm:text-5xl" role="img" aria-label={service.title}>{service.icon}</span>
                        <div class="flex-1">
                            <h3 class="text-xl sm:text-2xl font-bold text-white mb-3">{service.title}</h3>
                            <p class="text-gray-300 leading-relaxed">{service.description}</p>
                        </div>
                    </div>
                </article>
            {/each}
        </div>

        <!-- Why Choose Me Section -->
        <div class="text-center mb-10 sm:mb-12">
            <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-glow">
                {$_('services.whyMe.title')} <span class="blue-gradient_text">{$_('services.whyMe.titleHighlight')}</span>?
            </h3>
            <p class="text-gray-400 max-w-2xl mx-auto">
                {$_('services.whyMe.subtitle')}
            </p>
        </div>

        <!-- Benefits Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {#each benefits as benefit}
                <div class="benefit-card glass-card glass-card-hover p-5 sm:p-6 rounded-xl">
                    <span class="text-2xl sm:text-3xl mb-3 block">{benefit.icon}</span>
                    <h4 class="text-lg font-semibold text-white mb-2">{benefit.title}</h4>
                    <p class="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
            {/each}
        </div>

        <!-- CTA -->
        <div class="text-center mt-12 sm:mt-16">
            <a 
                href="/contact" 
                class="magnetic-btn inline-block glass-card glass-card-hover px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold text-white rounded-xl border border-white/20 hover:border-blue-400/50 transition-colors"
            >
                {$_('services.cta')}
            </a>
            <p class="text-gray-500 text-sm mt-4">{$_('services.ctaSubtext')}</p>
        </div>
    </div>
</section>

<style>
    .service-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .service-card:hover {
        border-color: rgba(0, 198, 255, 0.3);
        box-shadow: 0 0 30px rgba(0, 198, 255, 0.1);
    }

    .benefit-card {
        background: rgba(255, 255, 255, 0.03);
    }
</style>
