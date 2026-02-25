<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Items rendered twice for seamless looping — passed as a snippet */
		children: Snippet;
		/** Gap between items in pixels (default 6) */
		gap?: number;
		/** Duration for one full loop in seconds (default 25) */
		duration?: number;
		/** Extra classes on the outer container */
		className?: string;
		/** Inline styles on the outer container */
		style?: string;
		/** Speed multiplier — use 'fast' (25s) or 'slow' (35s) presets */
		speed?: 'fast' | 'slow';
		/** Resume delay after user interaction in ms (default 2000) */
		resumeDelay?: number;
	}

	let {
		children,
		gap = 6,
		duration,
		className = '',
		style = '',
		speed = 'fast',
		resumeDelay = 2000
	}: Props = $props();

	const resolvedDuration = $derived(duration ?? (speed === 'fast' ? 25 : 35));

	let container: HTMLElement | undefined = $state();
	let track: HTMLElement | undefined = $state();

	onMount(() => {
		if (!browser || !container || !track) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// If reduced motion, no auto-scroll
		if (prefersReducedMotion) return;

		let gsapInstance: typeof import('gsap').gsap;
		let tween: gsap.core.Tween | null = null;
		let userInteracting = false;
		let resumeTimer: ReturnType<typeof setTimeout> | null = null;
		let destroyed = false;

		// Current translateX in px — valid range: (-halfWidth, 0]
		// Negative = scrolled forward; 0 = at the start
		let xPos = 0;

		(async () => {
			const { gsap } = await import('gsap');
			gsapInstance = gsap;
			if (destroyed) return;

			startAutoScroll();
		})();

		/** Apply translate3d to the track for GPU-composited rendering */
		function applyTransform(x: number) {
			if (track) track.style.transform = `translate3d(${x}px, 0, 0)`;
		}

		/** Wrap x into the seamless range (-halfWidth, 0] */
		function wrapX(x: number, halfWidth: number) {
			while (x > 0) x -= halfWidth;
			while (x <= -halfWidth) x += halfWidth;
			return x;
		}

		function startAutoScroll() {
			if (!track || destroyed) return;

			const halfWidth = track.scrollWidth / 2;
			if (halfWidth <= 0) return;

			xPos = wrapX(xPos, halfWidth);

			// Distance from current xPos to -halfWidth (one full cycle end)
			const distance = Math.abs(-halfWidth - xPos);
			const fraction = distance / halfWidth;
			const adjustedDuration = resolvedDuration * fraction;

			if (adjustedDuration <= 0) {
				xPos = 0;
				applyTransform(xPos);
				startAutoScroll();
				return;
			}

			// Animate a proxy value so we can intercept and apply the transform ourselves
			const proxy = { x: xPos };
			tween = gsapInstance.to(proxy, {
				x: -halfWidth,
				duration: adjustedDuration,
				ease: 'none',
				onUpdate() {
					xPos = proxy.x;
					applyTransform(xPos);
				},
				onComplete() {
					if (destroyed) return;
					xPos = 0; // seamless reset
					applyTransform(xPos);
					startAutoScroll();
				}
			});
		}

		function pauseAutoScroll() {
			userInteracting = true;
			if (resumeTimer) clearTimeout(resumeTimer);
			tween?.kill();
			tween = null;
		}

		function scheduleResume() {
			userInteracting = false;
			if (resumeTimer) clearTimeout(resumeTimer);
			resumeTimer = setTimeout(() => {
				if (!destroyed && !userInteracting) {
					startAutoScroll();
				}
			}, resumeDelay);
		}

		// --- Touch handling with direction lock ---
		let touchStartX = 0;
		let touchStartY = 0;
		let touchLastX = 0;
		let touchLocked: 'horizontal' | 'vertical' | null = null;

		function onTouchStart(e: TouchEvent) {
			pauseAutoScroll();
			touchStartX = e.touches[0].clientX;
			touchLastX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			touchLocked = null;
		}

		function onTouchMove(e: TouchEvent) {
			const dx = e.touches[0].clientX - touchStartX;
			const dy = e.touches[0].clientY - touchStartY;

			// Determine direction lock on first significant movement
			if (!touchLocked) {
				if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
				touchLocked = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
			}

			// If vertical, bail out and let page scroll normally
			if (touchLocked === 'vertical') return;

			// Horizontal swipe — prevent page scroll and drive the transform
			e.preventDefault();
			if (!track) return;
			const deltaX = e.touches[0].clientX - touchLastX;
			touchLastX = e.touches[0].clientX;
			xPos = wrapX(xPos + deltaX, track.scrollWidth / 2);
			applyTransform(xPos);
		}

		function onTouchEnd() {
			touchLocked = null;
			scheduleResume();
		}

		// --- Mouse drag handlers (desktop) ---
		let isDragging = false;
		let dragStartX = 0;
		let dragStartXPos = 0;

		function onMouseDown(e: MouseEvent) {
			isDragging = true;
			dragStartX = e.pageX;
			dragStartXPos = xPos;
			pauseAutoScroll();
			container!.style.cursor = 'grabbing';
			container!.style.userSelect = 'none';
		}

		function onMouseMove(e: MouseEvent) {
			if (!isDragging || !track) return;
			e.preventDefault();
			const dx = e.pageX - dragStartX;
			xPos = wrapX(dragStartXPos + dx, track.scrollWidth / 2);
			applyTransform(xPos);
		}

		function onMouseUp() {
			if (!isDragging) return;
			isDragging = false;
			if (container) {
				container.style.cursor = '';
				container.style.userSelect = '';
			}
			scheduleResume();
		}

		// Hover pause
		function onMouseEnter() {
			if (!isDragging) pauseAutoScroll();
		}

		function onMouseLeave() {
			// Don't cancel an active drag — mousemove/mouseup on window handle it
			if (!isDragging) scheduleResume();
		}

		container.addEventListener('touchstart', onTouchStart, { passive: true });
		container.addEventListener('touchmove', onTouchMove, { passive: false });
		container.addEventListener('touchend', onTouchEnd, { passive: true });
		container.addEventListener('mousedown', onMouseDown);
		// Listen on window so dragging works even when cursor leaves the container
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		container.addEventListener('mouseenter', onMouseEnter);
		container.addEventListener('mouseleave', onMouseLeave);

		return () => {
			destroyed = true;
			tween?.kill();
			if (resumeTimer) clearTimeout(resumeTimer);
			container?.removeEventListener('touchstart', onTouchStart);
			container?.removeEventListener('touchmove', onTouchMove);
			container?.removeEventListener('touchend', onTouchEnd);
			container?.removeEventListener('mousedown', onMouseDown);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
			container?.removeEventListener('mouseenter', onMouseEnter);
			container?.removeEventListener('mouseleave', onMouseLeave);
		};
	});
</script>

<div
	bind:this={container}
	class="marquee-container flex overflow-hidden cursor-grab {className}"
	{style}
	role="marquee"
>
	<div bind:this={track} class="marquee-track flex items-center flex-nowrap" style="gap: {gap}px;">
		{@render children()}
	</div>
</div>

<style>
	.marquee-container {
		mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
		touch-action: pan-y;
		-webkit-tap-highlight-color: transparent;
	}
	.marquee-track {
		will-change: transform;
	}
</style>
