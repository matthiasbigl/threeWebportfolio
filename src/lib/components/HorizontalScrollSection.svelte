<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import { MoveRight, Hand } from 'lucide-svelte';

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
	const cardClass = $derived(`${id}-horizontal-card`);
	const bgNumClass = $derived(`${id}-bg-number`);

	// Bound DOM refs
	let sectionEl: HTMLElement | null = null;
	let wrapperEl: HTMLElement | null = null;
	let progressBarEl: HTMLElement | null = null;

	// Touch tracking for mobile swipe
	let touchStartY = 0;
	let touchStartX = 0;
	let isTouchScrolling = false;
	let hasInteracted = $state(false);
	let isTouchDevice = $state(false);

	onMount(() => {
		if (!browser) return;

		// Detect touch device
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

		const triggers: gsap.core.Tween[] = [];
		let wheelHandler: ((e: WheelEvent) => void) | null = null;
		let touchStartHandler: ((e: TouchEvent) => void) | null = null;
		let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
		let touchEndHandler: (() => void) | null = null;

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
						if (!hasInteracted && self.progress > 0.04) hasInteracted = true;
					}
				}
			});
			triggers.push(mainTween);

			// Translate horizontal wheel delta into vertical scroll so ScrollTrigger picks it up
			wheelHandler = (e: WheelEvent) => {
				const target = e.target as HTMLElement;
				const scrollableParent = target.closest('.chips-row, [data-hscroll]');
				if (scrollableParent) return;

				if (!hasInteracted) hasInteracted = true;

				const st = mainTween.scrollTrigger;
				if (!st) return;

				// Pure vertical scroll — let it pass through to GSAP/page naturally
				const absX = Math.abs(e.deltaX);
				const absY = Math.abs(e.deltaY);
				if (absY > absX) return;

				// Horizontal delta at boundaries — pass through to page scroll
				if (st.progress <= 0 && e.deltaX <= 0) return;
				if (st.progress >= 1 && e.deltaX >= 0) return;

				e.preventDefault();
				window.scrollBy({ top: e.deltaX, behavior: 'instant' });
			};
			sectionEl.addEventListener('wheel', wheelHandler, { passive: false });

			// Mobile touch swipe — translate horizontal swipe into vertical scroll for GSAP
			touchStartHandler = (e: TouchEvent) => {
				const target = e.target as HTMLElement;
				const scrollableParent = target.closest('.chips-row, [data-hscroll]');
				if (scrollableParent) return;

				// Mark that user has interacted
				if (!hasInteracted) hasInteracted = true;

				touchStartX = e.touches[0].clientX;
				touchStartY = e.touches[0].clientY;
				isTouchScrolling = true;
			};

			touchMoveHandler = (e: TouchEvent) => {
				if (!isTouchScrolling) return;

				const target = e.target as HTMLElement;
				const scrollableParent = target.closest('.chips-row, [data-hscroll]');
				if (scrollableParent) return;

				const deltaX = e.touches[0].clientX - touchStartX;
				const deltaY = e.touches[0].clientY - touchStartY;
				const st = mainTween.scrollTrigger;
				if (!st) return;

				const absX = Math.abs(deltaX);
				const absY = Math.abs(deltaY);

				const tryPrevent = () => {
					if (e.cancelable) e.preventDefault();
				};

				// Horizontal swipe dominant — drive the horizontal scroll
				if (absX > absY && absX > 10) {
					tryPrevent();

					// Instead of window.scrollBy which is sluggish, directly apply the delta to the scroll position
					// This cuts out the middleman and updates GSAP instantly
					const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

					// Multiplier to match physical finger movement.
					// On iOS, a slightly higher multiplier feels more 1:1 because of pixel scaling.
					const scrollDelta = -deltaX * 1.5;

					window.scrollTo({
						top: currentScroll + scrollDelta,
						behavior: 'instant'
					});

					touchStartX = e.touches[0].clientX;
					touchStartY = e.touches[0].clientY;
				}

				// Vertical swipe dominant at boundaries — push page past pin
				if (absY > absX && absY > 10) {
					if (st.progress >= 1 || st.progress <= 0) {
						tryPrevent();
						window.scrollBy({ top: -deltaY, behavior: 'instant' });
						touchStartX = e.touches[0].clientX;
						touchStartY = e.touches[0].clientY;
					}
				}
			};

			touchEndHandler = () => {
				isTouchScrolling = false;
			};

			sectionEl.addEventListener('touchstart', touchStartHandler, { passive: true });
			sectionEl.addEventListener('touchmove', touchMoveHandler, { passive: false });
			sectionEl.addEventListener('touchend', touchEndHandler, { passive: true });

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
								scrub: isTouchDevice ? 0.05 : 0.8,
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
			if (touchStartHandler) sectionEl?.removeEventListener('touchstart', touchStartHandler);
			if (touchMoveHandler) sectionEl?.removeEventListener('touchmove', touchMoveHandler);
			if (touchEndHandler) sectionEl?.removeEventListener('touchend', touchEndHandler);
		};
	});
</script>

<section
	bind:this={sectionEl}
	{id}
	class="relative h-[100dvh] overflow-x-auto overflow-y-hidden flex items-center"
	style="background: {background};"
	aria-label="Horizontal scroll section - {watermark}"
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

	<!-- Persistent scroll hint — bottom-right, dims after first interaction -->
	<div class="scroll-hint" class:interacted={hasInteracted} aria-hidden="true">
		{#if isTouchDevice}
			<Hand class="w-4 h-4" />
			<span>Swipe</span>
			<MoveRight class="w-4 h-4" />
		{:else}
			<MoveRight class="w-4 h-4" />
			<span>Scroll</span>
		{/if}
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
		height: 4px;
		background: rgba(255 255 255 / 0.08);
		z-index: 20;
	}
	.progress-fill {
		height: 100%;
		width: 0%;
		background: linear-gradient(to right, #3b82f6, #a855f7);
		border-radius: 0 2px 2px 0;
		transition: width 0.05s linear;
		box-shadow: 0 0 8px rgba(168 85 247 / 0.4);
	}

	/* Scroll hint — persistent pill, bottom-right */
	.scroll-hint {
		position: absolute;
		bottom: 1rem;
		right: 1.25rem;
		z-index: 30;
		pointer-events: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		border-radius: 9999px;
		background: rgba(15 23 42 / 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255 255 255 / 0.12);
		color: rgba(255 255 255 / 0.75);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		animation: hint-slide-in 0.5s 0.8s ease forwards;
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	/* Dim after interaction — animation: none means fill is dropped,
	   but we immediately set opacity so there is no flash */
	.scroll-hint.interacted {
		animation: none;
		opacity: 0.22;
	}
	@keyframes hint-slide-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.scroll-hint :global(.lucide) {
		flex-shrink: 0;
	}

	/* Hide on reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.scroll-hint {
			display: none;
		}
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
