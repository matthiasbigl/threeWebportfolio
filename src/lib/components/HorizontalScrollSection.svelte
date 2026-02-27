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
		/** Bound elements for the scrollable cards */
		cardElements?: HTMLElement[];
		/** Bound elements for the background numbers */
		bgNumElements?: HTMLElement[];
	}

	let {
		id,
		watermark,
		background = 'var(--bg-body)',
		introSlide,
		cards,
		trailingSlide,
		cardElements = [],
		bgNumElements = []
	}: Props = $props();

	// Bound DOM refs
	let sectionEl: HTMLElement | null = null;
	let wrapperEl: HTMLElement | null = null;
	let progressBarEl: HTMLElement | null = null;
	let introEl: HTMLElement | null = null;

	let hasInteracted = $state(false);
	let isTouchDevice = $state(false);

	// Exposed for the clickable scroll hint
	let scrollToNext: (() => void) | null = null;

	onMount(() => {
		if (!browser) return;

		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		let mm: gsap.MatchMedia;

		(async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			if (!sectionEl || !wrapperEl) return;

			// Reduced-motion: simple native horizontal scroll fallback
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

			// Use the passed-in cardElements and the introEl
			const allCards = [introEl, ...cardElements].filter(Boolean) as HTMLElement[];
			if (allCards.length === 0) return;

			const getScrollDistance = () => wrapperEl!.scrollWidth - window.innerWidth;

			const getCardSnapPoints = () => {
				const scrollDist = getScrollDistance();
				if (scrollDist <= 0) return [0, 1];
				return allCards.map((card) => {
					const cardCenter = card.offsetLeft + card.offsetWidth / 2;
					const viewportCenter = window.innerWidth / 2;
					const targetScroll = cardCenter - viewportCenter;
					return Math.max(0, Math.min(1, targetScroll / scrollDist));
				});
			};

			mm = gsap.matchMedia();

			// ═══════════════════════════════════════════════
			// UNIFIED LOGIC: Let native browser vertical scroll
			// power the timeline smoothly with snapping.
			// ═══════════════════════════════════════════════
			mm.add('(min-width: 0px)', () => {
				sectionEl?.classList.add('gsap-pinned');

				// Base timeline containing horizontal movement + parallax
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: sectionEl!,
						start: 'top top',
						end: () => `+=${getScrollDistance() + window.innerWidth * 0.3}`,
						pin: true,
						scrub: 0.5, // 0.5 scrub offers nice dampening across devices
						snap: {
							snapTo: (progress) => gsap.utils.snap(getCardSnapPoints(), progress),
							duration: { min: 0.2, max: 0.5 },
							ease: 'power2.inOut',
							delay: 0.05,
							inertia: false // CRITICAL: Stop GSAP from jumping again based on previous swipe velocity
						},
						invalidateOnRefresh: true,
						onUpdate: (self) => {
							if (progressBarEl) progressBarEl.style.width = `${self.progress * 100}%`;
							if (!hasInteracted && self.progress > 0.04) hasInteracted = true;
						}
					}
				});

				// Move the wrapper horizontally
				tl.to(
					wrapperEl!,
					{
						x: () => -getScrollDistance(),
						ease: 'none'
					},
					0
				);

				// Parallax the background numbers alongside
				bgNumElements.filter(Boolean).forEach((bgNum) => {
					tl.fromTo(bgNum, { xPercent: -15 }, { xPercent: 15, ease: 'none' }, 0);
				});

				// Logic to jump safely between cards natively (for swipes & clicks)
				let lastJumpTime = 0;
				const JUMP_COOLDOWN = 400;

				const jumpToCard = (direction: 'next' | 'prev') => {
					const now = Date.now();
					if (now - lastJumpTime < JUMP_COOLDOWN) return;

					const st = tl.scrollTrigger;
					if (!st) return;

					// Register jump time only if successful
					lastJumpTime = now;

					const points = getCardSnapPoints();
					let currentIndex = 0;
					let minDist = Infinity;

					points.forEach((p, i) => {
						const d = Math.abs(st.progress - p);
						if (d < minDist) {
							minDist = d;
							currentIndex = i;
						}
					});

					let targetProgress = st.progress;
					if (direction === 'next') {
						if (currentIndex < points.length - 1) {
							targetProgress = points[currentIndex + 1];
						} else {
							// Push page past boundary so user can keep reading downwards smoothly
							window.scrollBy({ top: 200, behavior: 'smooth' });
							return;
						}
					} else {
						if (currentIndex > 0) {
							targetProgress = points[currentIndex - 1];
						} else {
							// Push page up
							window.scrollBy({ top: -200, behavior: 'smooth' });
							return;
						}
					}

					const scrollTarget = st.start + targetProgress * (st.end - st.start);
					window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
				};

				scrollToNext = () => jumpToCard('next');

				// ==============================
				// VIEWPORT SPECIFIC HANDLERS
				// ==============================
				let wheelHandler: ((e: WheelEvent) => void) | null = null;
				let observer: gsap.core.Observer | null = null;

				// Desktop Additions
				if (!isTouchDevice) {
					wheelHandler = (e: WheelEvent) => {
						const target = e.target as HTMLElement;
						if (target.closest('.chips-row, [data-hscroll]')) return;
						const st = tl.scrollTrigger;
						if (!st) return;

						const absX = Math.abs(e.deltaX);
						const absY = Math.abs(e.deltaY);
						if (absY > absX) return; // Ignore standard vertical mouse wheel scrolling

						if (st.progress <= 0 && e.deltaX <= 0) return;
						if (st.progress >= 1 && e.deltaX >= 0) return;

						if (!hasInteracted) hasInteracted = true;
						e.preventDefault();
						window.scrollBy({ top: e.deltaX, behavior: 'auto' });
					};
					sectionEl!.addEventListener('wheel', wheelHandler, { passive: false });
				}
				// Mobile Additions
				else {
					let startX = 0;
					let startY = 0;

					const onTouchStart = (e: TouchEvent) => {
						startX = e.touches[0].clientX;
						startY = e.touches[0].clientY;
					};

					const onTouchEnd = (e: TouchEvent) => {
						const endX = e.changedTouches[0].clientX;
						const endY = e.changedTouches[0].clientY;
						const diffX = startX - endX;
						const diffY = Math.abs(startY - endY);

						// Only count as a horizontal swipe if it moved >30px and was mostly horizontal
						if (Math.abs(diffX) > 30 && Math.abs(diffX) > diffY) {
							if (diffX > 0) {
								jumpToCard('next'); // Swiped left
							} else {
								jumpToCard('prev'); // Swiped right
							}
						}
					};

					sectionEl!.addEventListener('touchstart', onTouchStart, { passive: true });
					sectionEl!.addEventListener('touchend', onTouchEnd, { passive: true });

					// Cleanup hook closure will capture these to remove them
					observer = {
						kill: () => {
							sectionEl!.removeEventListener('touchstart', onTouchStart);
							sectionEl!.removeEventListener('touchend', onTouchEnd);
						}
					} as any;
				}

				return () => {
					if (wheelHandler) sectionEl!.removeEventListener('wheel', wheelHandler);
					if (observer) observer.kill();
					tl.scrollTrigger?.kill();
					tl.kill();
					sectionEl?.classList.remove('gsap-pinned');
					scrollToNext = null;
				};
			});
		})();

		return () => {
			mm?.revert();
		};
	});
</script>

<section
	bind:this={sectionEl}
	{id}
	class="hscroll-section relative h-[100dvh] overflow-x-auto overflow-y-hidden flex items-center"
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
			bind:this={introEl}
			class="w-[88vw] md:w-[70vw] lg:w-[50vw] max-w-2xl shrink-0 flex flex-col justify-center px-4 md:px-12 relative"
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

	<!-- Persistent scroll hint — clickable, bottom-right, dims after interaction -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="scroll-hint"
		class:interacted={hasInteracted}
		role="button"
		tabindex="0"
		aria-label="Scroll to next card"
		onclick={() => scrollToNext?.()}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') scrollToNext?.();
		}}
	>
		{#if isTouchDevice}
			<Hand class="w-4 h-4" />
			<span>Swipe</span>
			<MoveRight class="w-4 h-4" />
		{:else}
			<MoveRight class="w-4 h-4" />
			<span>Scroll</span>
		{/if}
	</div>

	<!-- Mobile spacer: ensures last card can snap fully into view -->
	<div class="mobile-end-spacer" aria-hidden="true"></div>
</section>

<style>
	/* ═══════════════════════════════════════════════
	   Section base
	   ═══════════════════════════════════════════════ */
	.hscroll-section {
		scrollbar-width: none;
		-ms-overflow-style: none;
		touch-action: pan-y; /* Prevent browser navigation swiping, allow native vertical scroll */
	}
	.hscroll-section::-webkit-scrollbar {
		display: none;
	}

	/* When GSAP takes over, lock overflow so the pin works correctly */
	.hscroll-section:global(.gsap-pinned) {
		overflow: hidden !important;
	}

	/* ═══════════════════════════════════════════════
	   Progress bar
	   ═══════════════════════════════════════════════ */
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

	/* ═══════════════════════════════════════════════
	   Scroll hint — persistent pill, bottom-right
	   ═══════════════════════════════════════════════ */
	.scroll-hint {
		position: absolute;
		bottom: 1rem;
		right: 1.25rem;
		z-index: 30;
		cursor: pointer;
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
		transition:
			opacity 0.6s ease,
			background 0.2s ease,
			transform 0.2s ease;
	}
	.scroll-hint:hover {
		background: rgba(15 23 42 / 0.9);
		transform: translateY(-2px);
	}
	.scroll-hint:active {
		transform: scale(0.95);
	}
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

	@media (prefers-reduced-motion: reduce) {
		.scroll-hint {
			display: none;
		}
	}

	/* ═══════════════════════════════════════════════
	   Animations
	   ═══════════════════════════════════════════════ */
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

	/* ═══════════════════════════════════════════════
	   Glass card base
	   ═══════════════════════════════════════════════ */
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
