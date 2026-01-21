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

<section id="faq" class="faq-section relative py-16 sm:py-20 lg:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <!-- Section Header -->
        <div class="text-center mb-12 sm:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-glow">
                {$_('faq.title')} <span class="blue-gradient_text">{$_('faq.titleHighlight')}</span>
            </h2>
            <p class="text-lg text-gray-300 max-w-2xl mx-auto">
                {$_('faq.subtitle')}
            </p>
        </div>

        <!-- FAQ List -->
        <div class="faq-container space-y-4">
            {#each faqs as faq, index}
                <div class="faq-item glass-card rounded-xl overflow-hidden">
                    <button
                        class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                        onclick={() => toggleFAQ(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-answer-${index}`}
                    >
                        <span class="text-base sm:text-lg font-medium text-white pr-4">{faq.question}</span>
                        <span 
                            class="text-2xl text-blue-400 transition-transform duration-300 flex-shrink-0"
                            class:rotate-45={openIndex === index}
                        >
                            +
                        </span>
                    </button>
                    
                    {#if openIndex === index}
                        <div 
                            id={`faq-answer-${index}`}
                            class="px-6 pb-5 text-gray-300 leading-relaxed animate-fadeIn"
                        >
                            {faq.answer}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- CTA -->
        <div class="text-center mt-12 sm:mt-16">
            <p class="text-gray-400 mb-6">{$_('faq.moreQuestions')}</p>
            <a 
                href="/contact" 
                class="magnetic-btn inline-block glass-card glass-card-hover px-8 py-4 text-lg font-semibold text-white rounded-xl"
            >
                {$_('faq.cta')}
            </a>
        </div>
    </div>
</section>

<style>
    .rotate-45 {
        transform: rotate(45deg);
    }

    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .faq-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .faq-item:hover {
        border-color: rgba(0, 198, 255, 0.2);
    }
</style>
