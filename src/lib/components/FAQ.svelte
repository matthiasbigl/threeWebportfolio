<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';
    import { _ } from 'svelte-i18n';
    import Button from './Button.svelte';

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
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <!-- Section Header -->
        <div class="text-center mb-14 sm:mb-16">
            <div class="flex items-center justify-center gap-3 mb-6">
                <div class="h-px w-8 bg-blue-500/50"></div>
                <span class="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">FAQ</span>
                <div class="h-px w-8 bg-blue-500/50"></div>
            </div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 text-white tracking-tight font-poppins">
                {$_('faq.title')} <span class="blue-gradient_text">{$_('faq.titleHighlight')}</span>
            </h2>
            <p class="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
                {$_('faq.subtitle')}
            </p>
        </div>

        <!-- FAQ List -->
        <div class="faq-container space-y-2.5 sm:space-y-3">
            {#each faqs as faq, index}
                <div class="faq-item rounded-xl overflow-hidden transition-all duration-300" class:faq-item-open={openIndex === index}>
                    <button
                        class="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors duration-300"
                        onclick={() => toggleFAQ(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-answer-${index}`}
                    >
                        <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                            <span class="text-xs font-bold text-blue-500/60 font-poppins flex-shrink-0 tabular-nums w-6 text-right">{String(index + 1).padStart(2, '0')}</span>
                            <span class="text-sm sm:text-base font-medium text-gray-300 leading-snug">{faq.question}</span>
                        </div>
                        <span 
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-blue-400/80 transition-all duration-300 flex-shrink-0 {openIndex === index ? 'bg-blue-500/15 rotate-45' : 'bg-white/[0.04]'}"
                        >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6"></path>
                            </svg>
                        </span>
                    </button>
                    
                    {#if openIndex === index}
                        <div 
                            id={`faq-answer-${index}`}
                            class="px-5 sm:px-6 pb-5 sm:pb-6 pl-[3.25rem] sm:pl-[3.75rem] text-gray-500 text-sm leading-relaxed animate-fadeIn"
                        >
                            {faq.answer}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- CTA -->
        <div class="text-center mt-14 sm:mt-16">
            <p class="text-gray-600 mb-5 text-sm">{$_('faq.moreQuestions')}</p>
            <Button href="/contact" variant="secondary" className="!px-6 !py-3 !text-sm !rounded-xl">
                <span class="font-semibold">{$_('faq.cta')}</span>
                <svg
                    class="w-4 h-4 text-blue-400/70 group-hover:translate-x-1 transition-transform duration-300"
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
            </Button>
        </div>
    </div>
</section>

<style>
    .rotate-45 {
        transform: rotate(45deg);
    }

    .animate-fadeIn {
        animation: fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-6px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .faq-item {
        background: rgba(255, 255, 255, 0.015);
        border: 1px solid rgba(255, 255, 255, 0.04);
        transition: border-color 0.3s ease, background 0.3s ease;
    }

    .faq-item:hover {
        background: rgba(255, 255, 255, 0.025);
        border-color: rgba(255, 255, 255, 0.06);
    }

    .faq-item-open {
        border-color: rgba(59, 130, 246, 0.12);
        background: rgba(59, 130, 246, 0.03);
    }
</style>
