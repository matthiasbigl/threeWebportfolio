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
		speed = 'fast',
		resumeDelay = 2000
	}: Props = $props();

	const resolvedDuration = $derived(duration ?? (speed === 'fast' ? 25 : 35));

	let container: HTMLElement | undefined = $state();
	let track: HTMLElement | undefined = $state();

	onMount(() => {
		if (!browser || !container || !track) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// If reduced motion, just make it scrollable — no auto-scroll
		if (prefersReducedMotion) return;

		let gsapInstance: typeof import('gsap').gsap;
		let tween: gsap.core.Tween | null = null;
		let userInteracting = false;
		let resumeTimer: ReturnType<typeof setTimeout> | null = null;
		let destroyed = false;

		(async () => {
			const { gsap } = await import('gsap');
			gsapInstance = gsap;
			if (destroyed) return;

			startAutoScroll();
		})();

		function startAutoScroll() {
			if (!container || !track || destroyed) return;

			// Half-width = one full set of items (content is duplicated)
			const halfWidth = track.scrollWidth / 2;
			if (halfWidth <= 0) return;

			// Calculate remaining distance from current scroll position
			const currentScroll = container.scrollLeft % halfWidth;
			const remaining = halfWidth - currentScroll;
			const fraction = remaining / halfWidth;
			const adjustedDuration = resolvedDuration * fraction;

			tween = gsapInstance.to(container, {
				scrollLeft: container.scrollLeft + remaining,
				duration: adjustedDuration,
				ease: 'none',
				onComplete: () => {
					if (destroyed || !container) return;
					// Reset to start for seamless loop
					container.scrollLeft = container.scrollLeft - halfWidth;
					// Restart the full loop
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

		// Touch handlers
		function onTouchStart() {
			pauseAutoScroll();
		}
		function onTouchEnd() {
			scheduleResume();
		}

		// Mouse drag handlers (for desktop drag-scroll)
		let isDragging = false;
		let startX = 0;
		let scrollStart = 0;

		function onMouseDown(e: MouseEvent) {
			isDragging = true;
			startX = e.pageX;
			scrollStart = container!.scrollLeft;
			pauseAutoScroll();
			container!.style.cursor = 'grabbing';
			container!.style.userSelect = 'none';
		}

		function onMouseMove(e: MouseEvent) {
			if (!isDragging || !container) return;
			e.preventDefault();
			const dx = e.pageX - startX;
			container.scrollLeft = scrollStart - dx;
		}

		function onMouseUp() {
			if (!isDragging) return;
			isDragging = false;
			container!.style.cursor = '';
			container!.style.userSelect = '';
			scheduleResume();
		}

		// Hover pause (like the old CSS hover-pause)
		function onMouseEnter() {
			if (!isDragging) pauseAutoScroll();
		}
		function onMouseLeave() {
			if (isDragging) {
				isDragging = false;
				container!.style.cursor = '';
				container!.style.userSelect = '';
			}
			scheduleResume();
		}

		// Seamless loop: if user scrolls past the halfway point, wrap around
		function onScroll() {
			if (!container || !track || !userInteracting) return;
			const halfWidth = track.scrollWidth / 2;
			if (halfWidth <= 0) return;
			if (container.scrollLeft >= halfWidth) {
				container.scrollLeft -= halfWidth;
			} else if (container.scrollLeft <= 0) {
				container.scrollLeft += halfWidth;
			}
		}

		container.addEventListener('touchstart', onTouchStart, { passive: true });
		container.addEventListener('touchend', onTouchEnd, { passive: true });
		container.addEventListener('mousedown', onMouseDown);
		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('mouseup', onMouseUp);
		container.addEventListener('mouseenter', onMouseEnter);
		container.addEventListener('mouseleave', onMouseLeave);
		container.addEventListener('scroll', onScroll, { passive: true });
		// Also listen on window for mouseup in case cursor leaves container
		window.addEventListener('mouseup', onMouseUp);

		return () => {
			destroyed = true;
			tween?.kill();
			if (resumeTimer) clearTimeout(resumeTimer);
			container?.removeEventListener('touchstart', onTouchStart);
			container?.removeEventListener('touchend', onTouchEnd);
			container?.removeEventListener('mousedown', onMouseDown);
			container?.removeEventListener('mousemove', onMouseMove);
			container?.removeEventListener('mouseup', onMouseUp);
			container?.removeEventListener('mouseenter', onMouseEnter);
			container?.removeEventListener('mouseleave', onMouseLeave);
			container?.removeEventListener('scroll', onScroll);
			window.removeEventListener('mouseup', onMouseUp);
		};
	});
</script>

<div
	bind:this={container}
	class="marquee-container flex overflow-x-auto cursor-grab {className}"
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
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.marquee-container::-webkit-scrollbar {
		display: none;
	}
</style>
