<script lang="ts">
	import { onMount } from 'svelte';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import { browser } from '$app/environment';

	let cursor: HTMLDivElement | undefined = $state();
	let follower: HTMLDivElement | undefined = $state();
	// Detect mobile early to avoid flash of custom cursor
	let isMobile = $state(
		browser
			? window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 768
			: true
	);

	if (browser) {
		onMount(() => {
			(async () => {
				if (isMobile || $reducedMotion) return;

				// Lazy-load GSAP — cursor is non-critical
				const { gsap } = await import('gsap');

				const handleMouseMove = (e: MouseEvent) => {
					if (!cursor || !follower) return;
					gsap.to(cursor, {
						x: e.clientX,
						y: e.clientY,
						duration: 0.1,
						ease: 'power2.out'
					});

					gsap.to(follower, {
						x: e.clientX,
						y: e.clientY,
						duration: 0.3,
						ease: 'power2.out'
					});
				};

				const handleMouseEnter = () => {
					if (!cursor || !follower) return;
					gsap.to(cursor, {
						scale: 1.5,
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
					gsap.to(follower, {
						scale: 0.8,
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
				};

				const handleMouseLeave = () => {
					if (!cursor || !follower) return;
					gsap.to(cursor, {
						scale: 1,
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
					gsap.to(follower, {
						scale: 1,
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
				};

				// Use event delegation for global coverage
				const handleGlobalOver = (e: MouseEvent) => {
					const target = e.target as HTMLElement;
					if (target.closest('a, button, [role="button"], .magnetic-btn')) {
						handleMouseEnter();
					}
				};

				const handleGlobalOut = (e: MouseEvent) => {
					const target = e.target as HTMLElement;
					if (target.closest('a, button, [role="button"], .magnetic-btn')) {
						handleMouseLeave();
					}
				};

				document.addEventListener('mousemove', handleMouseMove);
				document.addEventListener('mouseover', handleGlobalOver);
				document.addEventListener('mouseout', handleGlobalOut);

				return () => {
					document.removeEventListener('mousemove', handleMouseMove);
					document.removeEventListener('mouseover', handleGlobalOver);
					document.removeEventListener('mouseout', handleGlobalOut);
				};
			})();
		});
	}
</script>

{#if !isMobile}
	<div bind:this={cursor} class="cursor-dot"></div>
	<div bind:this={follower} class="cursor-follower"></div>
{/if}

<style>
	@media (hover: hover) and (pointer: fine) {
		:global(body) {
			cursor: none;
		}
	}

	.cursor-dot {
		position: fixed;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background: var(--cursor-dot);
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		transform: translate(-50%, -50%);
		mix-blend-mode: difference;
	}

	.cursor-follower {
		position: fixed;
		top: 0;
		left: 0;
		width: 30px;
		height: 30px;
		border: 2px solid var(--cursor-follower-border);
		border-radius: 50%;
		pointer-events: none;
		z-index: 9998;
		transform: translate(-50%, -50%);
	}
</style>
