<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	interface Props {
		/** The HTML id of the outer <section> element — also used as GSAP trigger selector */
		id: string;
		/** Large background watermark text (e.g. "SERVICES" or "JOURNEY") */
		watermark: string;
		/** Background color CSS value — defaults to var(--bg-body) */
		background?: string;
		/** Intro slide content */
		introSlide: Snippet;
		/** The scrolling cards — rendered inside the horizontal wrapper */
		cards: Snippet;
		/** Optional trailing slide (e.g. pricing CTA) rendered after the cards */
		trailingSlide?: Snippet;
	}

	let {
		id,
		watermark,
		background = 'var(--bg-body)',
		introSlide,
		cards,
		trailingSlide
	}: Props = $props();

	// Unique CSS class names derived from id so multiple instances don't clash
	const cardClass = `${id}-horizontal-card`;
	const bgNumClass = `${id}-bg-number`;

	// Bound DOM refs
	let sectionEl: HTMLElement | null = null;
	let wrapperEl: HTMLElement | null = null;
	let progressBarEl: HTMLElement | null = null;

	onMount(() => {
		if (!browser) return;

		const triggers: gsap.core.Tween[] = [];
		let wheelHandler: ((e: WheelEvent) => void) | null = null;

		(async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			if (!sectionEl || !wrapperEl) return;

			// Reduced-motion: leave native horizontal scroll intact, wire up native scroll progress
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				const onScroll = () => {
					if (!sectionEl || !progressBarEl) return;
					const max = sectionEl.scrollWidth - sectionEl.clientWidth;
					const pct = max > 0 ? (sectionEl.scrollLeft / max) * 100 : 0;
					progressBarEl.style.width = `${pct}%`;
				};
				sectionEl.addEventListener('scroll', onScroll, { passive: true });
				return () => sectionEl!.removeEventListener('scroll', onScroll);
			}

			// GSAP is active — switch section to pin-compatible overflow mode
			sectionEl.classList.add('gsap-pinned');

			// Cards are rendered inside wrapperEl by the consumer snippets
			const allCards = gsap.utils.toArray<HTMLElement>(`.${cardClass}`, wrapperEl!);

			if (allCards.length === 0) return;

			const getScrollDistance = () => wrapperEl!.scrollWidth - window.innerWidth;

			const mainTween = gsap.to(wrapperEl!, {
				x: () => -getScrollDistance(),
				ease: 'none',
				scrollTrigger: {
					trigger: sectionEl!,
					start: 'top top',
					end: () => `+=${getScrollDistance() + window.innerWidth * 0.3}`,
					pin: true,
					scrub: 0.8,
					invalidateOnRefresh: true,
					onUpdate: (self) => {
						if (progressBarEl) progressBarEl.style.width = `${self.progress * 100}%`;
					}
				}
			});
			triggers.push(mainTween);

			// Translate horizontal wheel delta into vertical scroll so ScrollTrigger picks it up
			wheelHandler = (e: WheelEvent) => {
				// Let the event pass through if it originated inside a horizontally scrollable child
				// (e.g. the chips row) — that element handles it natively
				const target = e.target as HTMLElement;
				const scrollableParent = target.closest('.chips-row, [data-hscroll]');
				if (scrollableParent) return;

				const st = mainTween.scrollTrigger;
				if (!st) return;
				if (st.progress <= 0 && e.deltaX <= 0) return;
				if (st.progress >= 1 && e.deltaX >= 0) return;
				const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
				if (delta === 0) return;
				e.preventDefault();
				window.scrollBy({ top: delta, behavior: 'instant' });
			};
			sectionEl.addEventListener('wheel', wheelHandler, { passive: false });

			// Parallax on big background numbers — scoped to wrapperEl
			allCards.forEach((card) => {
				const bgNum = card.querySelector<HTMLElement>(`.${bgNumClass}`);
				if (bgNum) {
					const t = gsap.fromTo(
						bgNum,
						{ xPercent: -15 },
						{
							xPercent: 15,
							ease: 'none',
							scrollTrigger: {
								trigger: sectionEl!,
								start: 'top top',
								end: () => `+=${getScrollDistance() + window.innerWidth * 0.3}`,
								scrub: 0.8,
								invalidateOnRefresh: true
							}
						}
					);
					triggers.push(t);
				}
			});
		})();

		return () => {
			triggers.forEach((t) => t.scrollTrigger?.kill());
			sectionEl?.classList.remove('gsap-pinned');
			if (wheelHandler) sectionEl?.removeEventListener('wheel', wheelHandler);
		};
	});
</script>

<section
	bind:this={sectionEl}
	{id}
	class="relative h-[100dvh] overflow-x-auto overflow-y-hidden flex items-center"
	style="background: {background};"
>
	<!-- Large background watermark -->
	<div
		class="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-0"
	>
		<span
			class="font-syne font-black text-[40vw] md:text-[25vw] tracking-tighter whitespace-nowrap"
			style="color: var(--text-heading); opacity: 0.04;"
		>
			{watermark}
		</span>
	</div>

	<!-- Horizontal scroll wrapper — GSAP translates this element -->
	<div
		bind:this={wrapperEl}
		class="flex h-full items-center relative z-10 w-max pl-[6vw] md:pl-[10vw] pr-[30vw] md:pr-[25vw] gap-6 md:gap-8"
		style="will-change: transform;"
	>
		<!-- Intro slide -->
		<div
			class="{cardClass} w-[88vw] md:w-[70vw] lg:w-[50vw] max-w-2xl shrink-0 flex flex-col justify-center px-4 md:px-12 relative"
		>
			{@render introSlide()}
		</div>

		<!-- Cards (consumer renders the loop) -->
		{@render cards()}

		<!-- Optional trailing slide -->
		{#if trailingSlide}
			{@render trailingSlide()}
		{/if}
	</div>

	<!-- Progress bar -->
	<div class="progress-track">
		<div bind:this={progressBarEl} class="progress-fill"></div>
	</div>
</section>

<style>
	/* Native horizontal scroll fallback (no GSAP / reduced-motion) */
	section {
		scroll-behavior: smooth;
		scrollbar-width: thin;
		scrollbar-color: var(--glass-border, rgba(255 255 255 / 0.2)) transparent;
	}
	section::-webkit-scrollbar {
		height: 4px;
	}
	section::-webkit-scrollbar-track {
		background: transparent;
	}
	section::-webkit-scrollbar-thumb {
		background: var(--glass-border, rgba(255 255 255 / 0.2));
		border-radius: 2px;
	}

	/* When GSAP takes over, lock overflow so the pin works correctly */
	section:global(.gsap-pinned) {
		overflow: hidden !important;
	}

	/* Progress bar */
	.progress-track {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--glass-border, rgba(255 255 255 / 0.1));
		z-index: 20;
	}
	.progress-fill {
		height: 100%;
		width: 0%;
		background: linear-gradient(to right, #3b82f6, #a855f7);
		border-radius: 0 2px 2px 0;
		transition: width 0.05s linear;
	}

	@keyframes bounce-x {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(6px);
		}
	}

	:global(.animate-bounce-x) {
		animation: bounce-x 1.5s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.animate-bounce-x) {
			animation: none;
		}
	}

	/* Glass card base — used by both journey-card and service-card */
	:global(.hscroll-card) {
		background: var(--glass-bg);
		backdrop-filter: blur(20px) saturate(130%);
		-webkit-backdrop-filter: blur(20px) saturate(130%);
		box-shadow:
			0 8px 32px var(--glass-shadow),
			inset 0 1px 0 var(--glass-inset-highlight);
		transition:
			box-shadow 0.4s ease,
			border-color 0.4s ease,
			background 0.4s ease;
	}

	:global(.hscroll-card:hover) {
		background: var(--glass-bg-hover);
		border-color: var(--glass-border-hover);
		box-shadow:
			0 16px 48px var(--glass-shadow-hover),
			inset 0 1px 0 var(--glass-inset-highlight);
	}
</style>
