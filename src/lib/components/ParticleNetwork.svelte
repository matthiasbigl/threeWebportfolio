<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		/** Max number of particles */
		count?: number;
		/** Max distance to draw a connection line */
		connectionDistance?: number;
		/** Particle speed multiplier */
		speed?: number;
		/** Particle radius range [min, max] */
		radius?: [number, number];
		/** Whether mouse interaction is enabled */
		interactive?: boolean;
		/** Mouse attraction radius */
		mouseRadius?: number;
	}

	let {
		count = 60,
		connectionDistance = 150,
		speed = 0.3,
		radius = [1, 2.5],
		interactive = true,
		mouseRadius = 280
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;

	onMount(() => {
		if (!browser) return;

		// Respect reduced motion
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let particles: Particle[] = [];
		let mouse = { x: -9999, y: -9999 };
		let w = 0;
		let h = 0;
		let isTouchDevice = false;
		let isScrolling = false;
		let scrollTimeout: number;

		// Detect if device supports touch
		if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
			isTouchDevice = true;
		}

		interface Particle {
			x: number;
			y: number;
			vx: number;
			vy: number;
			r: number;
			baseAlpha: number;
		}

		function isDark(): boolean {
			return document.documentElement.classList.contains('dark');
		}

		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const rect = canvas.parentElement!.getBoundingClientRect();
			w = rect.width;
			h = rect.height;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function createParticles() {
			particles = [];
			// Scale count to canvas size so density stays consistent
			const area = w * h;
			const scaledCount = Math.min(count, Math.floor(area / 12000));

			for (let i = 0; i < scaledCount; i++) {
				const angle = Math.random() * Math.PI * 2;
				const s = (Math.random() * 0.5 + 0.5) * speed;
				particles.push({
					x: Math.random() * w,
					y: Math.random() * h,
					vx: Math.cos(angle) * s,
					vy: Math.sin(angle) * s,
					r: radius[0] + Math.random() * (radius[1] - radius[0]),
					baseAlpha: 0.15 + Math.random() * 0.35
				});
			}
		}

		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, w, h);

			const dark = isDark();
			const dotColor = dark ? [255, 255, 255] : [15, 23, 42];
			const lineColor = dark ? [59, 130, 246] : [59, 130, 246];

			// Update positions
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;

				// Wrap around edges with padding
				if (p.x < -10) p.x = w + 10;
				if (p.x > w + 10) p.x = -10;
				if (p.y < -10) p.y = h + 10;
				if (p.y > h + 10) p.y = -10;
			}

			// Mouse interaction — gently push nearby particles
			if (interactive && mouse.x > -9000) {
				for (const p of particles) {
					const dx = p.x - mouse.x;
					const dy = p.y - mouse.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < mouseRadius && dist > 0) {
						const force = (1 - dist / mouseRadius) * 0.04;
						p.vx += (dx / dist) * force;
						p.vy += (dy / dist) * force - 0.006;
					}
					// Dampen velocity so particles don't fly off
					const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
					const maxSpeed = speed * 1.5;
					if (currentSpeed > maxSpeed) {
						p.vx = (p.vx / currentSpeed) * maxSpeed;
						p.vy = (p.vy / currentSpeed) * maxSpeed;
					}
				}
			}

			// Draw connections
			const cd2 = connectionDistance * connectionDistance;
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const d2 = dx * dx + dy * dy;
					if (d2 < cd2) {
						const alpha = (1 - d2 / cd2) * 0.15;
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${alpha})`;
						ctx.lineWidth = 0.5;
						ctx.stroke();
					}
				}
			}

			// Draw mouse connections
			if (interactive && mouse.x > -9000) {
				for (const p of particles) {
					const dx = p.x - mouse.x;
					const dy = p.y - mouse.y;
					const d2 = dx * dx + dy * dy;
					const mr2 = mouseRadius * mouseRadius;
					if (d2 < mr2) {
						const alpha = (1 - d2 / mr2) * 0.25;
						ctx.beginPath();
						ctx.moveTo(mouse.x, mouse.y);
						ctx.lineTo(p.x, p.y);
						ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${alpha})`;
						ctx.lineWidth = 0.6;
						ctx.stroke();
					}
				}
			}

			// Draw particles
			for (const p of particles) {
				let alpha = p.baseAlpha;
				if (interactive && mouse.x > -9000) {
					const dx = p.x - mouse.x;
					const dy = p.y - mouse.y;
					const d2 = dx * dx + dy * dy;
					const mr2 = mouseRadius * mouseRadius;
					if (d2 < mr2) {
						alpha = p.baseAlpha + (1 - d2 / mr2) * 0.6;
					}
				}
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${dotColor[0]},${dotColor[1]},${dotColor[2]},${alpha})`;
				ctx.fill();
			}

			animationId = requestAnimationFrame(draw);
		}

		function onMouseMove(e: MouseEvent) {
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		}

		function onMouseLeave() {
			mouse.x = -9999;
			mouse.y = -9999;
		}

		function onTouchMove(e: TouchEvent) {
			// Track single touch for particle interaction
			// Only update on tap-and-hold, not during scroll
			if (e.touches.length === 1 && !isScrolling) {
				const touch = e.touches[0];
				const rect = canvas.getBoundingClientRect();
				mouse.x = touch.clientX - rect.left;
				mouse.y = touch.clientY - rect.top;
			}
		}

		function onTouchEnd() {
			mouse.x = -9999;
			mouse.y = -9999;
		}

		resize();
		createParticles();
		draw();

		window.addEventListener('resize', () => {
			resize();
			createParticles();
		});

		if (interactive) {
			if (isTouchDevice) {
				// On touch devices, detect scrolling to avoid interference
				const onTouchStart = () => {
					isScrolling = false;
				};
				const onScroll = () => {
					isScrolling = true;
					clearTimeout(scrollTimeout);
					scrollTimeout = window.setTimeout(() => {
						isScrolling = false;
					}, 100);
				};
				
				window.addEventListener('scroll', onScroll, { passive: true });
				canvas.addEventListener('touchstart', onTouchStart, { passive: true });
				// On touch devices, use touch events (passive allows scrolling)
				canvas.addEventListener('touchmove', onTouchMove, { passive: true });
				canvas.addEventListener('touchend', onTouchEnd);
				canvas.addEventListener('touchcancel', onTouchEnd);
			} else {
				// On desktop, use mouse events
				canvas.addEventListener('mousemove', onMouseMove);
				canvas.addEventListener('mouseleave', onMouseLeave);
			}
		}

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
			clearTimeout(scrollTimeout);
			if (interactive) {
				if (isTouchDevice) {
					window.removeEventListener('scroll', () => {});
					canvas.removeEventListener('touchstart', () => {});
					canvas.removeEventListener('touchmove', onTouchMove);
					canvas.removeEventListener('touchend', onTouchEnd);
					canvas.removeEventListener('touchcancel', onTouchEnd);
				} else {
					canvas.removeEventListener('mousemove', onMouseMove);
					canvas.removeEventListener('mouseleave', onMouseLeave);
				}
			}
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute inset-0 w-full h-full touch-none"
	style="pointer-events: {interactive ? 'auto' : 'none'};"
	aria-hidden="true"
></canvas>
