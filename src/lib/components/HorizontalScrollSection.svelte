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

	/* ─── Constants ─── */
	const MOBILE_BREAKPOINT = '(max-width: 767px)';
	const DESKTOP_BREAKPOINT = '(min-width: 768px)';
	const SWIPE_THRESHOLD_PX = 30;
	const MOBILE_JUMP_DURATION = 0.4;
	const MOBILE_JUMP_EASE = 'power2.out';
	const DESKTOP_SCRUB_SPEED = 0.5;
	const DESKTOP_SCROLL_MULTIPLIER = 0.5;
	const BOUNDARY_SCROLL_PX = 300;
	const BOUNDARY_SCROLL_DURATION = 0.5;
	const RESIZE_DEBOUNCE_MS = 150;

	/* ─── DOM refs ─── */
	let sectionEl: HTMLElement | null = null;
	let wrapperEl: HTMLElement | null = null;
	let progressBarEl: HTMLElement | null = null;
	let introEl: HTMLElement | null = null;

	/* ─── Reactive state ─── */
	let hasInteracted = $state(false);
	let isTouchDevice = $state(false);
	let activeCardIndex = $state(0);
	let totalCards = $state(0);

	/* ─── Exposed for scroll hint click ─── */
	let scrollToNext: (() => void) | null = null;
	let scrollToPrev: (() => void) | null = null;

	onMount(() => {
		if (!browser) return;

		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		let mm: gsap.MatchMedia;
		let resizeTimer: ReturnType<typeof setTimeout>;
		let onResize: (() => void) | null = null;
		let reducedMotionCleanup: (() => void) | null = null;

		(async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
			gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
			ScrollTrigger.config({ ignoreMobileResize: true });

			if (!sectionEl || !wrapperEl) return;

			/* ─── Reduced motion: simple native fallback ─── */
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				/* Enable native horizontal scroll for reduced-motion users */
				sectionEl.style.overflowX = 'auto';
				sectionEl.style.overflowY = 'hidden';
				const onScroll = () => {
					if (!sectionEl || !progressBarEl) return;
					const max = sectionEl.scrollWidth - sectionEl.clientWidth;
					const pct = max > 0 ? sectionEl.scrollLeft / max : 0;
					progressBarEl.style.transform = `scaleX(${pct})`;
				};
				sectionEl.addEventListener('scroll', onScroll, { passive: true });
				reducedMotionCleanup = () => {
					sectionEl!.removeEventListener('scroll', onScroll);
					sectionEl!.style.overflowX = '';
					sectionEl!.style.overflowY = '';
				};
				return;
			}

			/* ─── Build card list from intro + bound card elements ─── */
			const allCards = [introEl, ...cardElements].filter(Boolean) as HTMLElement[];
			if (allCards.length === 0) return;
			totalCards = allCards.length;

			/* ─── Cached layout values (recomputed only on resize) ─── */
			let cachedScrollDistance = 0;
			let cachedSnapPoints: number[] = [];

			function recalcLayout() {
				if (!wrapperEl) return;
				cachedScrollDistance = wrapperEl.scrollWidth - window.innerWidth;
				if (cachedScrollDistance <= 0) {
					cachedSnapPoints = allCards.map(() => 0);
					return;
				}
				cachedSnapPoints = allCards.map((card) => {
					const cardCenter = card.offsetLeft + card.offsetWidth / 2;
					const viewportCenter = window.innerWidth / 2;
					const targetScroll = cardCenter - viewportCenter;
					return Math.max(0, Math.min(1, targetScroll / cachedScrollDistance));
				});
			}

			/* Debounced resize handler — only recalc when width changes.
			   iOS Safari fires resize on address bar show/hide (height-only change);
			   recalculating layout on those events breaks pin positions mid-scroll. */
			let lastWidth = window.innerWidth;
			onResize = () => {
				const w = window.innerWidth;
				if (w === lastWidth) return; // height-only change (iOS address bar)
				lastWidth = w;
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(recalcLayout, RESIZE_DEBOUNCE_MS);
			};
			window.addEventListener('resize', onResize, { passive: true });

			/* Initial layout computation */
			recalcLayout();

			/* ─── Shared: find closest card index to a given progress value ─── */
			function findClosestCardIndex(progress: number): number {
				let bestIndex = 0;
				let minDist = Infinity;
				for (let i = 0; i < cachedSnapPoints.length; i++) {
					const d = Math.abs(progress - cachedSnapPoints[i]);
					if (d < minDist) {
						minDist = d;
						bestIndex = i;
					}
				}
				return bestIndex;
			}

			/* ─── Shared: update focus classes on cards ─── */
			let lastActiveIndex = -1;
			function updateFocus(activeIndex: number) {
				if (activeIndex === lastActiveIndex) return;
				lastActiveIndex = activeIndex;
				activeCardIndex = activeIndex;
				for (let i = 0; i < allCards.length; i++) {
					allCards[i].classList.toggle('is-focused', i === activeIndex);
				}
			}

			/* ─── Shared: update progress bar via gsap.set (keeps GSAP cache in sync) ─── */
			function updateProgressBar(progress: number) {
				if (progressBarEl) {
					gsap.set(progressBarEl, { scaleX: progress });
				}
			}

			mm = gsap.matchMedia();

			/* ═══════════════════════════════════════════════
			   DESKTOP: Vertical scroll drives horizontal scrub
			   ═══════════════════════════════════════════════ */
			mm.add(DESKTOP_BREAKPOINT, () => {
				sectionEl?.classList.add('gsap-pinned');
				recalcLayout();

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: sectionEl!,
						start: 'top top',
						end: () =>
							`+=${cachedScrollDistance * DESKTOP_SCROLL_MULTIPLIER + window.innerWidth * 0.3}`,
						pin: true,
						scrub: DESKTOP_SCRUB_SPEED,
						invalidateOnRefresh: true,
						onRefreshInit: () => recalcLayout(),
						onUpdate: (self) => {
							if (!hasInteracted && self.progress > 0.04) hasInteracted = true;
							updateFocus(findClosestCardIndex(self.progress));
						}
					}
				});

				/* Horizontal movement */
				tl.to(
					wrapperEl!,
					{
						x: () => -cachedScrollDistance,
						ease: 'none'
					},
					0
				);

				/* Progress bar — driven by timeline, no manual DOM writes */
				if (progressBarEl) {
					tl.fromTo(progressBarEl, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
				}

				/* Background numbers: static position on desktop.
				   Continuous parallax behind backdrop-filter cards is expensive —
				   the blur kernel must re-rasterize every frame. Keep them fixed. */
				bgNumElements.filter(Boolean).forEach((bgNum) => {
					gsap.set(bgNum, { xPercent: 0 });
				});

				/* Desktop jump helper — used by scroll hint click and vertical scroll jump */
				const jumpToCardViaScroll = (direction: 'next' | 'prev') => {
					const st = tl.scrollTrigger;
					if (!st) return;
					const currentIndex = findClosestCardIndex(st.progress);
					if (direction === 'next') {
						if (currentIndex < cachedSnapPoints.length - 1) {
							const targetProgress = cachedSnapPoints[currentIndex + 1];
							const scrollTarget = st.start + targetProgress * (st.end - st.start);
							gsap.to(window, {
								scrollTo: { y: scrollTarget },
								duration: 0.5,
								ease: 'power4.out',
								overwrite: 'auto'
							});
						} else {
							gsap.to(window, {
								scrollTo: { y: `+=${BOUNDARY_SCROLL_PX}` },
								duration: BOUNDARY_SCROLL_DURATION,
								ease: 'power2.out'
							});
						}
					} else {
						if (currentIndex > 0) {
							const targetProgress = cachedSnapPoints[currentIndex - 1];
							const scrollTarget = st.start + targetProgress * (st.end - st.start);
							gsap.to(window, {
								scrollTo: { y: scrollTarget },
								duration: 0.5,
								ease: 'power4.out',
								overwrite: 'auto'
							});
						} else {
							gsap.to(window, {
								scrollTo: { y: `-=${BOUNDARY_SCROLL_PX}` },
								duration: BOUNDARY_SCROLL_DURATION,
								ease: 'power2.out'
							});
						}
					}
				};
				scrollToNext = () => jumpToCardViaScroll('next');
				scrollToPrev = () => jumpToCardViaScroll('prev');

				/* Direct card jump — scrolls to the exact target position instantly,
				   then the scrub smoothly animates the wrapper. No fighting. */
				let desktopCardIndex = 0;
				let isDesktopJumping = false;

				const jumpToCardDirect = (direction: 'next' | 'prev') => {
					if (isDesktopJumping) return;
					const st = tl.scrollTrigger;
					if (!st) return;

					/* Sync index from scroll position in case user scrolled with mouse wheel */
					desktopCardIndex = findClosestCardIndex(st.progress);

					const targetIndex = direction === 'next' ? desktopCardIndex + 1 : desktopCardIndex - 1;

					/* Boundary: past last card → scroll page forward */
					if (targetIndex >= allCards.length) {
						gsap.to(window, {
							scrollTo: { y: `+=${BOUNDARY_SCROLL_PX}` },
							duration: BOUNDARY_SCROLL_DURATION,
							ease: 'power2.out'
						});
						return;
					}
					/* Boundary: before first card → scroll page backward */
					if (targetIndex < 0) {
						gsap.to(window, {
							scrollTo: { y: `-=${BOUNDARY_SCROLL_PX}` },
							duration: BOUNDARY_SCROLL_DURATION,
							ease: 'power2.out'
						});
						return;
					}

					isDesktopJumping = true;
					if (!hasInteracted) hasInteracted = true;
					desktopCardIndex = targetIndex;

					/* Scroll to exact target — scrub will animate the wrapper */
					const targetProgress = cachedSnapPoints[targetIndex];
					const scrollTarget = st.start + targetProgress * (st.end - st.start);
					gsap.to(window, {
						scrollTo: { y: scrollTarget },
						duration: 0.35,
						ease: 'power2.out',
						overwrite: 'auto',
						onComplete() {
							isDesktopJumping = false;
						}
					});
				};

				/* Desktop wheel: horizontal trackpad gestures trigger discrete card jumps.
				   We accumulate horizontal deltas and jump when threshold is crossed.
				   Vertical mouse wheel is left to ScrollTrigger's native scrub. */
				const TRACKPAD_JUMP_THRESHOLD = 40;
				let accumulatedDeltaX = 0;
				let wheelResetTimer: ReturnType<typeof setTimeout>;
				const wheelHandler = (e: WheelEvent) => {
					const target = e.target as HTMLElement;
					if (target.closest('.chips-row, .chips-wrapper, [data-hscroll="false"]')) return;
					const st = tl.scrollTrigger;
					if (!st) return;

					const absX = Math.abs(e.deltaX);
					const absY = Math.abs(e.deltaY);

					/* Only intercept predominantly-horizontal gestures */
					if (absY > absX) return;

					/* Don't block if already at boundaries */
					if (st.progress <= 0 && e.deltaX <= 0) return;
					if (st.progress >= 1 && e.deltaX >= 0) return;

					if (!hasInteracted) hasInteracted = true;
					e.preventDefault();

					/* Accumulate horizontal delta */
					accumulatedDeltaX += e.deltaX;

					/* Reset accumulator if user stops swiping */
					clearTimeout(wheelResetTimer);
					wheelResetTimer = setTimeout(() => {
						accumulatedDeltaX = 0;
					}, 200);

					/* Jump when threshold is crossed */
					if (Math.abs(accumulatedDeltaX) >= TRACKPAD_JUMP_THRESHOLD) {
						const direction = accumulatedDeltaX > 0 ? 'next' : 'prev';
						accumulatedDeltaX = 0;
						jumpToCardDirect(direction);
					}
				};
				sectionEl!.addEventListener('wheel', wheelHandler, { passive: false });

				return () => {
					sectionEl!.removeEventListener('wheel', wheelHandler);
					clearTimeout(wheelResetTimer);
					tl.scrollTrigger?.kill();
					tl.kill();
					sectionEl?.classList.remove('gsap-pinned');
					scrollToNext = null;
					scrollToPrev = null;
					lastActiveIndex = -1;
				};
			});

			/* ═══════════════════════════════════════════════
			   MOBILE: Pin-only, discrete card jumps via touch
			   ═══════════════════════════════════════════════ */
			mm.add(MOBILE_BREAKPOINT, () => {
				sectionEl?.classList.add('gsap-pinned');
				recalcLayout();

				let currentCardIndex = 0;
				let isAnimating = false;
				let isPinned = false;

				/* Pin the section — no scrub, no scroll-driven horizontal movement.
				   Large pin range so momentum scroll can't accidentally skip past it. */
				const pinTrigger = ScrollTrigger.create({
					trigger: sectionEl!,
					start: 'top top',
					end: () => `+=${cachedScrollDistance + window.innerWidth * 0.3}`,
					pin: true,
					pinSpacing: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					onRefreshInit: () => recalcLayout(),
					onEnter: () => {
						isPinned = true;
						currentCardIndex = 0;
						gsap.set(wrapperEl!, { x: 0 });
						updateFocus(0);
						updateProgressBar(0);
						bgNumElements.filter(Boolean).forEach((bgNum) => {
							gsap.set(bgNum, { xPercent: -15 });
						});
						sectionEl?.classList.add('mobile-pinned');
					},
					onLeave: () => {
						isPinned = false;
						sectionEl?.classList.remove('mobile-pinned');
					},
					onEnterBack: () => {
						isPinned = true;
						currentCardIndex = allCards.length - 1;
						const lastProgress = cachedSnapPoints[allCards.length - 1];
						gsap.set(wrapperEl!, { x: -(lastProgress * cachedScrollDistance) });
						updateFocus(allCards.length - 1);
						updateProgressBar(lastProgress);
						bgNumElements.filter(Boolean).forEach((bgNum) => {
							gsap.set(bgNum, { xPercent: -15 + 30 * lastProgress });
						});
						sectionEl?.classList.add('mobile-pinned');
					},
					onLeaveBack: () => {
						isPinned = false;
						sectionEl?.classList.remove('mobile-pinned');
					}
				});

				/* Parallax background numbers — driven by a proxy progress */
				const bgNumTweens: gsap.core.Tween[] = [];
				bgNumElements.filter(Boolean).forEach((bgNum) => {
					gsap.set(bgNum, { xPercent: -15 });
				});

				/* Animate wrapper to a specific card position */
				function jumpToCard(targetIndex: number) {
					if (isAnimating || !isPinned) return;
					targetIndex = Math.max(0, Math.min(targetIndex, allCards.length - 1));

					/* Boundary: swiped past last card → scroll past pin end to exit */
					if (targetIndex === currentCardIndex && targetIndex === allCards.length - 1) {
						isAnimating = true;
						const scrollTarget = pinTrigger.end + BOUNDARY_SCROLL_PX;
						gsap.to(window, {
							scrollTo: { y: scrollTarget },
							duration: BOUNDARY_SCROLL_DURATION,
							ease: 'power2.out',
							onComplete: () => {
								isAnimating = false;
							}
						});
						return;
					}
					/* Boundary: swiped before first card → scroll before pin start to exit */
					if (targetIndex === currentCardIndex && targetIndex === 0) {
						isAnimating = true;
						const scrollTarget = Math.max(0, pinTrigger.start - BOUNDARY_SCROLL_PX);
						gsap.to(window, {
							scrollTo: { y: scrollTarget },
							duration: BOUNDARY_SCROLL_DURATION,
							ease: 'power2.out',
							onComplete: () => {
								isAnimating = false;
							}
						});
						return;
					}

					if (targetIndex === currentCardIndex) return;

					isAnimating = true;
					const targetX = -(cachedSnapPoints[targetIndex] * cachedScrollDistance);
					const progress = cachedSnapPoints[targetIndex];

					/* Animate bg number parallax in sync with card jump */
					const targetXPct = -15 + 30 * progress;
					bgNumElements.filter(Boolean).forEach((bgNum) => {
						gsap.to(bgNum, {
							xPercent: targetXPct,
							duration: MOBILE_JUMP_DURATION,
							ease: MOBILE_JUMP_EASE,
							overwrite: 'auto'
						});
					});

					gsap.to(wrapperEl!, {
						x: targetX,
						duration: MOBILE_JUMP_DURATION,
						ease: MOBILE_JUMP_EASE,
						overwrite: 'auto',
						onComplete: () => {
							currentCardIndex = targetIndex;
							updateFocus(targetIndex);
							if (!hasInteracted) hasInteracted = true;
							isAnimating = false;
						}
					});

					/* Progress bar — tween directly alongside wrapper, no per-frame reads */
					if (progressBarEl) {
						gsap.to(progressBarEl, {
							scaleX: progress,
							duration: MOBILE_JUMP_DURATION,
							ease: MOBILE_JUMP_EASE,
							overwrite: 'auto'
						});
					}

					/* Update focus immediately for responsiveness */
					updateFocus(targetIndex);
				}

				scrollToNext = () => jumpToCard(currentCardIndex + 1);
				scrollToPrev = () => jumpToCard(currentCardIndex - 1);

				/* ─── Touch handler: omni-directional swipe ─── */
				let startX = 0;
				let startY = 0;
				let startTime = 0;

				const onTouchStart = (e: TouchEvent) => {
					/* Only intercept touches when section is actively pinned */
					if (!isPinned) {
						startX = -1;
						return;
					}
					const target = e.target as HTMLElement;
					if (target.closest('.chips-row, .chips-wrapper, [data-hscroll="false"]')) {
						startX = -1;
						return;
					}
					startX = e.touches[0].clientX;
					startY = e.touches[0].clientY;
					startTime = Date.now();
				};

				/* Block native scroll while pinned so iOS doesn't steal the gesture.
				   Without this, iOS starts native scrolling during the drag, which can
				   push the page past the pin boundary before touchend fires — causing
				   isPinned to go false and our swipe to be silently dropped. */
				const onTouchMove = (e: TouchEvent) => {
					if (startX === -1 || !isPinned) return;
					e.preventDefault();
				};

				const onTouchEnd = (e: TouchEvent) => {
					if (startX === -1) return;
					if (!isPinned) return;

					const endX = e.changedTouches[0].clientX;
					const endY = e.changedTouches[0].clientY;
					const deltaX = startX - endX;
					const deltaY = startY - endY;
					const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

					/* Require minimum distance to count as a swipe */
					if (totalDistance < SWIPE_THRESHOLD_PX) return;

					/* Determine dominant direction:
					   - Positive deltaX = swiped left, positive deltaY = swiped up
					   - Any "forward" swipe (left OR up) → next card
					   - Any "backward" swipe (right OR down) → previous card */
					const isForward = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX > 0 : deltaY > 0;

					if (isForward) {
						jumpToCard(currentCardIndex + 1);
					} else {
						jumpToCard(currentCardIndex - 1);
					}
				};

				sectionEl!.addEventListener('touchstart', onTouchStart, { passive: true });
				sectionEl!.addEventListener('touchmove', onTouchMove, { passive: false });
				sectionEl!.addEventListener('touchend', onTouchEnd, { passive: true });

				/* Set initial state */
				updateFocus(0);
				updateProgressBar(0);
				gsap.set(wrapperEl!, { x: 0 });

				return () => {
					sectionEl!.removeEventListener('touchstart', onTouchStart);
					sectionEl!.removeEventListener('touchmove', onTouchMove);
					sectionEl!.removeEventListener('touchend', onTouchEnd);
					pinTrigger.kill();
					bgNumTweens.forEach((t) => t.kill());
					sectionEl?.classList.remove('gsap-pinned', 'mobile-pinned');
					scrollToNext = null;
					scrollToPrev = null;
					lastActiveIndex = -1;
				};
			});
		})();

		return () => {
			reducedMotionCleanup?.();
			if (onResize) window.removeEventListener('resize', onResize);
			clearTimeout(resizeTimer);
			mm?.revert();
		};
	});
</script>

<section
	bind:this={sectionEl}
	{id}
	class="hscroll-section relative h-[100dvh] overflow-hidden flex items-center"
	style="background: {background};"
	aria-label="Horizontal scroll section - {watermark}"
>
	<!-- Large background watermark -->
	<div
		class="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-0"
	>
		<span
			class="watermark-text font-syne font-black tracking-tighter whitespace-nowrap"
			style="color: var(--text-heading); opacity: 0.04;"
		>
			{watermark}
		</span>
	</div>

	<!-- Horizontal scroll wrapper — GSAP translates this element -->
	<div
		bind:this={wrapperEl}
		class="flex h-full items-center relative z-10 w-max pl-[6vw] md:pl-[10vw] pr-[30vw] md:pr-[25vw] gap-6 md:gap-8"
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

	<!-- Progress bar (desktop) -->
	<div class="progress-track desktop-only">
		<div bind:this={progressBarEl} class="progress-fill"></div>
	</div>

	<!-- Progress dots (mobile) -->
	{#if totalCards > 0}
		<div class="progress-dots mobile-only" role="tablist" aria-label="Card navigation">
			{#each { length: totalCards } as _, i}
				<button
					class="progress-dot"
					class:active={i === activeCardIndex}
					role="tab"
					aria-selected={i === activeCardIndex}
					aria-label="Card {i + 1} of {totalCards}"
					tabindex={i === activeCardIndex ? 0 : -1}
					onclick={() => {
						/* Allow dot-tap navigation on mobile */
					}}
				></button>
			{/each}
		</div>
	{/if}

	<!-- Scroll hint — shows prompt before interaction, position counter after -->
	<div
		class="scroll-hint"
		class:interacted={hasInteracted}
		role="button"
		tabindex="0"
		aria-label={hasInteracted
			? `Card ${activeCardIndex + 1} of ${totalCards}. Click to go to next card.`
			: 'Scroll to next card'}
		onclick={() => scrollToNext?.()}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') scrollToNext?.();
		}}
	>
		{#if hasInteracted && totalCards > 0}
			<span class="hint-counter">
				<span class="hint-current">{activeCardIndex + 1}</span>
				<span class="hint-separator">/</span>
				<span class="hint-total">{totalCards}</span>
			</span>
			<MoveRight class="w-3.5 h-3.5" />
		{:else if isTouchDevice}
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
	/* ═══════════════════════════════════════════════
	   Section base
	   ═══════════════════════════════════════════════ */
	.hscroll-section {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.hscroll-section::-webkit-scrollbar {
		display: none;
	}

	/* When GSAP takes over, lock overflow so the pin works correctly */
	.hscroll-section:global(.gsap-pinned) {
		overflow: hidden !important;
	}

	/* Mobile pinned: block all native touch scroll so swipe handler has full control */
	.hscroll-section:global(.mobile-pinned) {
		touch-action: none;
	}

	/* ═══════════════════════════════════════════════
	   Watermark — sized per breakpoint
	   ═══════════════════════════════════════════════ */
	.watermark-text {
		font-size: 20vw;
	}
	@media (min-width: 768px) {
		.watermark-text {
			font-size: 16vw;
		}
	}

	/* ═══════════════════════════════════════════════
	   Responsive visibility helpers
	   ═══════════════════════════════════════════════ */
	.desktop-only {
		display: none;
	}
	.mobile-only {
		display: flex;
	}
	@media (min-width: 768px) {
		.desktop-only {
			display: block;
		}
		.mobile-only {
			display: none;
		}
	}

	/* ═══════════════════════════════════════════════
	   Progress bar (desktop) — thicker, theme-aware
	   ═══════════════════════════════════════════════ */
	.progress-track {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 5px;
		background: var(--border-primary);
		z-index: 20;
	}
	.progress-fill {
		height: 100%;
		width: 100%;
		background: linear-gradient(to right, #3b82f6, #a855f7);
		border-radius: 0 2px 2px 0;
		box-shadow: 0 0 8px rgba(168 85 247 / 0.4);
		transform: scaleX(0);
		transform-origin: left;
		will-change: transform;
	}

	/* ═══════════════════════════════════════════════
	   Progress dots (mobile) — segmented position
	   ═══════════════════════════════════════════════ */
	.progress-dots {
		position: absolute;
		bottom: 1.125rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 25;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.625rem;
		border-radius: 9999px;
		background: var(--overlay-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid var(--border-primary);
	}
	.progress-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--text-tertiary);
		opacity: 0.35;
		border: none;
		padding: 0;
		cursor: pointer;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease,
			background 0.3s ease;
	}
	.progress-dot.active {
		opacity: 1;
		background: #3b82f6;
		transform: scale(1.3);
		box-shadow: 0 0 6px rgba(59 130 246 / 0.5);
	}
	.progress-dot:not(.active):hover {
		opacity: 0.6;
	}

	/* ═══════════════════════════════════════════════
	   Scroll hint — theme-aware pill, position counter
	   ═══════════════════════════════════════════════ */
	.scroll-hint {
		position: absolute;
		bottom: 1rem;
		right: 1.25rem;
		z-index: 30;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.4rem 0.75rem;
		border-radius: 9999px;
		background: var(--overlay-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid var(--border-primary);
		color: var(--text-secondary);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		animation: hint-slide-in 0.5s 0.8s ease forwards;
		opacity: 0;
		transition:
			opacity 0.5s ease,
			background 0.2s ease,
			transform 0.2s ease;
	}
	.scroll-hint:hover {
		background: var(--overlay-strong);
		transform: translateY(-2px);
	}
	.scroll-hint:active {
		transform: scale(0.95);
	}
	/* After interaction: dim but stay readable */
	.scroll-hint.interacted {
		animation: none;
		opacity: 0.55;
	}
	.scroll-hint.interacted:hover {
		opacity: 1;
	}

	/* Position counter styling */
	.hint-counter {
		display: flex;
		align-items: center;
		gap: 0.175rem;
		font-variant-numeric: tabular-nums;
	}
	.hint-current {
		color: var(--text-primary);
		font-weight: 700;
	}
	.hint-separator {
		opacity: 0.4;
	}
	.hint-total {
		opacity: 0.6;
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

	/* On mobile, move scroll hint above the progress dots */
	@media (max-width: 767px) {
		.scroll-hint {
			bottom: 3.75rem;
			right: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-hint {
			display: none;
		}
		.progress-dots {
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
	   Glass card base — backdrop-filter kept for
	   visual richness (small isolated surfaces)
	   ═══════════════════════════════════════════════ */
	:global(.hscroll-card) {
		background: var(--glass-bg);
		backdrop-filter: blur(12px) saturate(130%);
		-webkit-backdrop-filter: blur(12px) saturate(130%);
		box-shadow:
			0 8px 32px var(--glass-shadow),
			inset 0 1px 0 var(--glass-inset-highlight);
		transition:
			box-shadow 0.4s ease,
			border-color 0.4s ease,
			background 0.4s ease,
			opacity 0.4s ease;
	}

	/* Focused card: elevated shadow instead of scale to avoid
	   repainting the backdrop-filter on a resized surface */
	:global(.is-focused .hscroll-card) {
		background: var(--glass-bg-hover);
		border-color: var(--glass-border-hover);
		box-shadow:
			0 20px 60px var(--glass-shadow-hover),
			inset 0 1px 0 var(--glass-inset-highlight);
		z-index: 10;
	}

	:global(.hscroll-card:hover) {
		background: var(--glass-bg-hover);
		border-color: var(--glass-border-hover);
		box-shadow:
			0 16px 48px var(--glass-shadow-hover),
			inset 0 1px 0 var(--glass-inset-highlight);
	}

	/* Mobile touch feedback — brief highlight on tap */
	@media (max-width: 767px) {
		:global(.hscroll-card:active) {
			background: var(--glass-bg-hover);
			transition-duration: 0.1s;
		}
	}
</style>
