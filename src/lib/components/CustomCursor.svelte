<script lang="ts">
	import { onMount } from 'svelte';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import { browser } from '$app/environment';

	let cursor: HTMLDivElement | undefined = $state();
	let follower: HTMLDivElement | undefined = $state();
	let isMobile = $state(
		browser
			? window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 768
			: true
	);

	// Only hide system cursor when custom cursor is actually active
	let isCursorActive = $state(false);

	if (browser) {
		onMount(() => {
			(async () => {
				// Don't even mount logic if we shouldn't show the cursor
				if (isMobile || $reducedMotion) return;

				const { gsap } = await import('gsap');

				// Initial hidden state
				gsap.set([cursor, follower], { xPercent: -50, yPercent: -50, opacity: 0 });

				const handleMouseMove = (e: MouseEvent) => {
					if (!cursor || !follower) return;

					// First movement detected, show cursor and hide system cursor
					if (!isCursorActive) {
						isCursorActive = true;
						gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
					}

					gsap.to(cursor, {
						x: e.clientX,
						y: e.clientY,
						duration: 0.1,
						ease: 'power2.out'
					});

					gsap.to(follower, {
						x: e.clientX,
						y: e.clientY,
						duration: 0.4,
						ease: 'power3.out'
					});
				};

				const handleMouseEnter = () => {
					if (!cursor || !follower) return;
					gsap.to(cursor, {
						backgroundColor: 'var(--cursor-dot-hover, #ffffff)',
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
					gsap.to(follower, {
						borderWidth: '1px',
						borderColor: 'var(--cursor-follower-hover, #ffffff)',
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
				};

				const handleMouseLeave = () => {
					if (!cursor || !follower) return;
					gsap.to(cursor, {
						backgroundColor: 'var(--cursor-dot)',
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
					gsap.to(follower, {
						borderWidth: '2px',
						borderColor: 'var(--cursor-follower-border)',
						duration: 0.3,
						ease: 'back.out(1.7)'
					});
				};

				const handleMouseDown = () => {
					if (!cursor || !follower) return;
					gsap.to([cursor, follower], {
						scale: 0.8,
						duration: 0.2,
						ease: 'power2.inOut'
					});
				};

				const handleMouseUp = () => {
					if (!cursor || !follower) return;
					gsap.to([cursor, follower], {
						scale: 1,
						duration: 0.3,
						ease: 'back.out(2)'
					});
				};

				const handleGlobalOver = (e: MouseEvent) => {
					const target = e.target as HTMLElement;
					if (target.closest('a, button, [role="button"], .magnetic-btn, .interactive')) {
						handleMouseEnter();
					}
				};

				const handleGlobalOut = (e: MouseEvent) => {
					const target = e.target as HTMLElement;
					if (target.closest('a, button, [role="button"], .magnetic-btn, .interactive')) {
						handleMouseLeave();
					}
				};

				document.addEventListener('mousemove', handleMouseMove);
				document.addEventListener('mouseover', handleGlobalOver);
				document.addEventListener('mouseout', handleGlobalOut);
				document.addEventListener('mousedown', handleMouseDown);
				document.addEventListener('mouseup', handleMouseUp);

				// Safety check: hide cursor if mouse leaves window
				document.addEventListener('mouseleave', () => {
					isCursorActive = false;
					gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
				});

				return () => {
					document.removeEventListener('mousemove', handleMouseMove);
					document.removeEventListener('mouseover', handleGlobalOver);
					document.removeEventListener('mouseout', handleGlobalOut);
					document.removeEventListener('mousedown', handleMouseDown);
					document.removeEventListener('mouseup', handleMouseUp);
				};
			})();
		});
	}

	// Logic to toggle body class for cursor visibility
	if (browser) {
		$effect(() => {
			if (isCursorActive) {
				document.body.classList.add('hide-system-cursor');
			} else {
				document.body.classList.remove('hide-system-cursor');
			}
		});
	}
</script>

{#if !isMobile && !$reducedMotion}
	<div bind:this={cursor} class="cursor-dot"></div>
	<div bind:this={follower} class="cursor-follower"></div>
{/if}

<style>
	:global(body.hide-system-cursor) {
		cursor: none !important;
	}

	/* Optional: hide cursor for interactive elements specifically if needed */
	:global(body.hide-system-cursor a, body.hide-system-cursor button) {
		cursor: none !important;
	}

	.cursor-dot {
		position: fixed;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background: var(--cursor-dot, #ffffff);
		border-radius: 50%;
		pointer-events: none;
		z-index: 10000;
		mix-blend-mode: difference;
		will-change: transform, opacity;
	}

	.cursor-follower {
		position: fixed;
		top: 0;
		left: 0;
		width: 32px;
		height: 32px;
		border: 2px solid var(--cursor-follower-border, rgba(255, 255, 255, 0.5));
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		will-change: transform, opacity;
		transition:
			border-color 0.3s ease,
			background-color 0.3s ease;
	}
</style>
