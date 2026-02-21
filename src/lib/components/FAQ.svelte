<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import * as m from '$lib/paraglide/messages.js';
	import Button from './Button.svelte';

	let openIndex = $state<number | null>(null);

	const faqs = $derived([
		{ question: m['faq.items.cost.question'](), answer: m['faq.items.cost.answer']() },
		{ question: m['faq.items.duration.question'](), answer: m['faq.items.duration.answer']() },
		{ question: m['faq.items.hosting.question'](), answer: m['faq.items.hosting.answer']() },
		{ question: m['faq.items.edit.question'](), answer: m['faq.items.edit.answer']() },
		{ question: m['faq.items.remote.question'](), answer: m['faq.items.remote.answer']() },
		{ question: m['faq.items.agency.question'](), answer: m['faq.items.agency.answer']() },
		{ question: m['faq.items.tech.question'](), answer: m['faq.items.tech.answer']() },
		{ question: m['faq.items.process.question'](), answer: m['faq.items.process.answer']() },
		{ question: m['faq.items.seo.question'](), answer: m['faq.items.seo.answer']() },
		{ question: m['faq.items.existing.question'](), answer: m['faq.items.existing.answer']() }
	]);

	function toggleFAQ(index: number) {
		if (openIndex === index) {
			openIndex = null;
		} else {
			openIndex = index;
		}
	}

	onMount(async () => {
		if (!browser || $reducedMotion) return;

		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

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

<section id="faq" class="faq-section relative py-20 sm:py-24 lg:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
		<!-- Section Header -->
		<div class="text-center mb-14 sm:mb-16">
			<div class="flex items-center justify-center gap-3 mb-6">
				<div class="h-px w-8 bg-blue-500/50"></div>
				<span class="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">FAQ</span>
				<div class="h-px w-8 bg-blue-500/50"></div>
			</div>
			<h2
				class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 tracking-tight font-poppins"
				style="color: var(--text-heading);"
			>
				{m["faq.title"]()} <span class="blue-gradient_text">{m["faq.titleHighlight"]()}</span>
			</h2>
			<p
				class="text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
				style="color: var(--text-tertiary);"
			>
				{m["faq.subtitle"]()}
			</p>
		</div>

		<!-- FAQ List -->
		<div class="faq-container space-y-2.5 sm:space-y-3">
			{#each faqs as faq, index}
				<details
					class="faq-item rounded-xl overflow-hidden transition-all duration-300"
					open={openIndex === index}
					ontoggle={(e: Event & { currentTarget: HTMLDetailsElement }) => {
						if (e.currentTarget.open) {
							openIndex = index;
						} else if (openIndex === index) {
							openIndex = null;
						}
					}}
				>
					<summary
						class="px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
					>
						<div class="faq-item-highlight"></div>
						<div class="flex items-center gap-3 sm:gap-4 min-w-0">
							<span
								class="text-xs font-bold text-blue-500/60 font-poppins flex-shrink-0 tabular-nums w-6 text-right"
								>{String(index + 1).padStart(2, '0')}</span
							>
							<span
								class="text-sm sm:text-base font-medium leading-snug"
								style="color: var(--text-secondary);">{faq.question}</span
							>
						</div>
						<span
							class="w-7 h-7 rounded-lg flex items-center justify-center text-blue-400/80 transition-all duration-300 flex-shrink-0 {openIndex ===
							index
								? 'bg-blue-500/15 rotate-45'
								: ''}"
							style="background: {openIndex === index ? '' : 'var(--bg-surface)'};"
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v12m6-6H6"
								></path>
							</svg>
						</span>
					</summary>

					<div
						class="px-5 sm:px-6 pb-5 sm:pb-6 pl-[3.25rem] sm:pl-[3.75rem] text-sm leading-relaxed animate-fadeIn"
						style="color: var(--text-tertiary);"
					>
						{faq.answer}
					</div>
				</details>
			{/each}
		</div>

		<!-- CTA -->
		<div class="text-center mt-14 sm:mt-16">
			<p class="mb-5 text-sm" style="color: var(--text-tertiary);">{m["faq.moreQuestions"]()}</p>
			<Button href="/contact" variant="secondary" className="!px-6 !py-3 !text-sm !rounded-xl">
				<span class="font-semibold">{m["faq.cta"]()}</span>
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
		background: var(--faq-bg);
		border: 1px solid var(--faq-border);
		transition:
			border-color 0.3s ease,
			background 0.3s ease,
			box-shadow 0.3s ease,
			transform 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.faq-item-highlight {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
		transform: scaleY(0);
		transform-origin: top;
		transition: transform 0.3s ease;
		border-radius: 0 2px 2px 0;
	}

	.faq-item[open] .faq-item-highlight {
		transform: scaleY(1);
	}

	.faq-item:hover {
		background: var(--faq-bg-hover);
		border-color: var(--glass-border-hover);
		box-shadow: 0 4px 20px -4px rgba(59, 130, 246, 0.08);
		transform: translateY(-1px);
	}

	.faq-item[open] {
		border-color: var(--faq-open-border);
		background: var(--faq-open-bg);
		box-shadow:
			0 8px 32px -8px rgba(59, 130, 246, 0.12),
			0 0 0 1px rgba(59, 130, 246, 0.08);
		transform: translateY(-2px);
	}
</style>
