<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';
    import { _ } from 'svelte-i18n';

    let openIndex = $state<number | null>(null);

    // Reactive FAQs based on translations
    const faqs = $derived([
        {
            question: $_('faq.items.cost.question'),
            answer: $_('faq.items.cost.answer')
        },
        {
            question: $_('faq.items.duration.question'),
            answer: $_('faq.items.duration.answer')
        },
        {
            question: $_('faq.items.hosting.question'),
            answer: $_('faq.items.hosting.answer')
        },
        {
            question: $_('faq.items.edit.question'),
            answer: $_('faq.items.edit.answer')
        },
        {
            question: $_('faq.items.remote.question'),
            answer: $_('faq.items.remote.answer')
        },
        {
            question: $_('faq.items.agency.question'),
            answer: $_('faq.items.agency.answer')
        },
        {
            question: $_('faq.items.tech.question'),
            answer: $_('faq.items.tech.answer')
        },
        {
            question: $_('faq.items.process.question'),
            answer: $_('faq.items.process.answer')
        },
        {
            question: $_('faq.items.seo.question'),
            answer: $_('faq.items.seo.answer')
        },
        {
            question: $_('faq.items.existing.question'),
            answer: $_('faq.items.existing.answer')
        }
    ]);

    // FAQ Schema for SEO - reactive
    const faqSchema = $derived({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    });

    function toggleFAQ(index: number) {
        if (openIndex === index) {
            openIndex = null;
        } else {
            openIndex = index;
        }
    }

    onMount(() => {
        if (!browser) return;

        gsap.fromTo(
            '.faq-item',
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.faq-container',
                    start: 'top 80%'
                }
            }
        );
    });
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<section id="faq" class="faq-section relative py-20 sm:py-24 lg:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <!-- Section Header -->
        <div class="text-center mb-14 sm:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 text-glow tracking-tight">
                {$_('faq.title')} <span class="blue-gradient_text">{$_('faq.titleHighlight')}</span>
            </h2>
            <p class="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {$_('faq.subtitle')}
            </p>
        </div>

        <!-- FAQ List -->
        <div class="faq-container space-y-3 sm:space-y-4">
            {#each faqs as faq, index}
                <div class="faq-item glass-card rounded-2xl overflow-hidden transition-all duration-300" class:faq-item-open={openIndex === index}>
                    <button
                        class="w-full px-5 sm:px-6 py-5 sm:py-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors duration-300"
                        onclick={() => toggleFAQ(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-answer-${index}`}
                    >
                        <span class="text-sm sm:text-base lg:text-lg font-medium text-white pr-4 leading-snug">{faq.question}</span>
                        <span 
                            class="w-8 h-8 rounded-full flex items-center justify-center text-blue-400 transition-all duration-300 flex-shrink-0 {openIndex === index ? 'bg-blue-500/20 rotate-45' : 'bg-blue-500/10'}"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6"></path>
                            </svg>
                        </span>
                    </button>
                    
                    {#if openIndex === index}
                        <div 
                            id={`faq-answer-${index}`}
                            class="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-400 text-sm sm:text-base leading-relaxed animate-fadeIn"
                        >
                            {faq.answer}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- CTA -->
        <div class="text-center mt-14 sm:mt-16">
            <p class="text-gray-500 mb-6 text-sm sm:text-base">{$_('faq.moreQuestions')}</p>
            <a 
                href="/contact" 
                class="magnetic-btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 hover:border-blue-500/50 rounded-2xl transition-all duration-300 group shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
            >
                <span class="text-base sm:text-lg font-bold text-white">{$_('faq.cta')}</span>
                <svg
                    class="w-5 h-5 text-blue-400 group-hover:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                </svg>
            </a>
        </div>
    </div>
</section>

<style>
    .rotate-45 {
        transform: rotate(45deg);
    }

    .animate-fadeIn {
        animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .faq-item {
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .faq-item:hover {
        border-color: rgba(255, 255, 255, 0.1);
    }

    .faq-item-open {
        border-color: rgba(0, 198, 255, 0.2);
        background: rgba(255, 255, 255, 0.02);
    }
</style>
