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
		if (prefersReducedMotion) return;

		let isDragging = false;
		let pointerStartX = 0;
		let dragStartX = 0;
		let currentX = 0;
		let resumeTimer: ReturnType<typeof setTimeout> | null = null;
		let destroyed = false;

		// Set the animation duration from the resolved prop
		track.style.animationDuration = `${resolvedDuration}s`;

		function getHalfWidth(): number {
			return (track?.scrollWidth ?? 0) / 2;
		}

		// Read the current translateX from the running CSS animation
		function getAnimationX(): number {
			const matrix = new DOMMatrix(window.getComputedStyle(track!).transform);
			return matrix.m41;
		}

		// Wrap x into the valid range (-halfWidth, 0]
		function normalizeX(x: number): number {
			const hw = getHalfWidth();
			if (hw <= 0) return 0;
			let n = x % hw;
			if (n > 0) n -= hw;
			return n;
		}

		// Freeze the track at its current animated position using an inline transform
		function pauseAtCurrent() {
			if (!track) return;
			currentX = getAnimationX();
			track.style.transform = `translateX(${currentX}px)`;
			track.style.animationPlayState = 'paused';
		}

		// Resume CSS animation from the given position by using a negative animationDelay
		function resumeFrom(x: number) {
			if (!track || destroyed) return;
			const hw = getHalfWidth();
			if (hw <= 0) return;
			const normalized = normalizeX(x);
			const delay = -(Math.abs(normalized) / hw) * resolvedDuration;
			// Apply new delay while paused, then force a reflow so the browser
			// registers the updated @keyframes start point before we resume.
			track.style.animationDelay = `${delay}s`;
			track.style.animationPlayState = 'paused';
			void track.offsetWidth; // force reflow
			track.style.transform = ''; // hand control back to CSS animation
			track.style.animationPlayState = 'running';
		}

		function scheduleResume() {
			if (resumeTimer) clearTimeout(resumeTimer);
			resumeTimer = setTimeout(() => {
				if (!destroyed) resumeFrom(currentX);
			}, resumeDelay);
		}

		// --- Pointer Events (mouse + touch, unified) ---

		function onPointerDown(e: PointerEvent) {
			if (!track) return;
			pauseAtCurrent();
			isDragging = true;
			pointerStartX = e.clientX;
			dragStartX = currentX;
			track.setPointerCapture(e.pointerId);
			if (resumeTimer) clearTimeout(resumeTimer);
		}

		function onPointerMove(e: PointerEvent) {
			if (!isDragging || !track) return;
			currentX = normalizeX(dragStartX + (e.clientX - pointerStartX));
			track.style.transform = `translateX(${currentX}px)`;
		}

		function onPointerUp() {
			if (!isDragging) return;
			isDragging = false;
			scheduleResume();
		}

		// Hover pause/resume (desktop only — pointer events handle drag on all devices)
		function onMouseEnter() {
			if (!isDragging) pauseAtCurrent();
		}

		function onMouseLeave() {
			if (!isDragging) scheduleResume();
		}

		track.addEventListener('pointerdown', onPointerDown);
		track.addEventListener('pointermove', onPointerMove);
		track.addEventListener('pointerup', onPointerUp);
		track.addEventListener('pointercancel', onPointerUp);
		container.addEventListener('mouseenter', onMouseEnter);
		container.addEventListener('mouseleave', onMouseLeave);

		return () => {
			destroyed = true;
			if (resumeTimer) clearTimeout(resumeTimer);
			track?.removeEventListener('pointerdown', onPointerDown);
			track?.removeEventListener('pointermove', onPointerMove);
			track?.removeEventListener('pointerup', onPointerUp);
			track?.removeEventListener('pointercancel', onPointerUp);
			container?.removeEventListener('mouseenter', onMouseEnter);
			container?.removeEventListener('mouseleave', onMouseLeave);
		};
	});
</script>

<div bind:this={container} class="marquee-container {className}">
	<div
		bind:this={track}
		class="marquee-track flex items-center flex-nowrap cursor-grab"
		style="gap: {gap}px"
	>
		{@render children()}
	</div>
</div>

<style>
	.marquee-container {
		overflow: hidden;
		mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
	}

	.marquee-track {
		will-change: transform;
		/* touch-action: pan-y lets vertical page-scroll work while our pointer
		   events capture horizontal drag gestures on touch devices */
		touch-action: pan-y;
		animation: marquee-scroll linear infinite;
	}

	@keyframes marquee-scroll {
		from {
			transform: translateX(0);
		}
		to {
			/* -50% = exactly one full set of items (content is duplicated in the parent) */
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
			cursor: default;
		}
	}
</style>
