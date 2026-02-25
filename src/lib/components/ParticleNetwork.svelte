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
		/** Whether mouse interaction is enabled (desktop only) */
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
	let animationId: number = 0;

	onMount(() => {
		if (!browser) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let particles: Particle[] = [];
		let mouse = { x: -9999, y: -9999 };
		let w = 0;
		let h = 0;
		let isMobile = false;
		let isVisible = true;
		let resizeTimer: ReturnType<typeof setTimeout> | null = null;

		const checkMobile = () => {
			isMobile =
				window.innerWidth < 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
		};
		checkMobile();

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
			const oldParticles = particles;
			particles = [];
			const area = w * h;
			const mobileScale = isMobile ? 0.6 : 1;
			const scaledCount = Math.min(count, Math.floor((area / 12000) * mobileScale));

			for (let i = 0; i < scaledCount; i++) {
				// Reuse existing particle positions when possible to avoid visual jumps
				if (i < oldParticles.length) {
					const old = oldParticles[i];
					particles.push({
						x: Math.min(old.x, w),
						y: Math.min(old.y, h),
						vx: old.vx,
						vy: old.vy,
						r: old.r,
						baseAlpha: old.baseAlpha
					});
				} else {
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
		}

		function startAnimation() {
			if (!animationId && isVisible) {
				animationId = requestAnimationFrame(draw);
			}
		}

		function stopAnimation() {
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = 0;
			}
		}

		function draw() {
			animationId = 0;
			if (!ctx || !isVisible) return;
			ctx.clearRect(0, 0, w, h);

			const dark = isDark();
			const dotColor = dark ? [255, 255, 255] : [15, 23, 42];
			const lineColor = dark ? [59, 130, 246] : [59, 130, 246];

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;

				if (p.x < -10) p.x = w + 10;
				if (p.x > w + 10) p.x = -10;
				if (p.y < -10) p.y = h + 10;
				if (p.y > h + 10) p.y = -10;
			}

			if (interactive && !isMobile && mouse.x > -9000) {
				for (const p of particles) {
					const dx = p.x - mouse.x;
					const dy = p.y - mouse.y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < mouseRadius && dist > 0) {
						const force = (1 - dist / mouseRadius) * 0.04;
						p.vx += (dx / dist) * force;
						p.vy += (dy / dist) * force - 0.006;
					}
					const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
					const maxSpeed = speed * 1.5;
					if (currentSpeed > maxSpeed) {
						p.vx = (p.vx / currentSpeed) * maxSpeed;
						p.vy = (p.vy / currentSpeed) * maxSpeed;
					}
				}
			}

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

			if (interactive && !isMobile && mouse.x > -9000) {
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

			for (const p of particles) {
				let alpha = p.baseAlpha;
				if (interactive && !isMobile && mouse.x > -9000) {
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

		/** Debounced resize — avoids particle re-creation thrashing from mobile address bar */
		function onResize() {
			checkMobile();
			resize();
			if (resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				createParticles();
			}, 150);
		}

		// IntersectionObserver: pause animation when canvas is off-screen
		const observer = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting;
				if (isVisible) {
					startAnimation();
				} else {
					stopAnimation();
				}
			},
			{ threshold: 0 }
		);
		observer.observe(canvas);

		resize();
		createParticles();
		startAnimation();

		window.addEventListener('resize', onResize);

		// Listen to visualViewport resize for mobile address bar changes
		if (window.visualViewport) {
			window.visualViewport.addEventListener('resize', onResize);
		}

		if (interactive && !isMobile) {
			window.addEventListener('mousemove', onMouseMove);
			canvas.parentElement?.addEventListener('mouseleave', onMouseLeave);
		}

		return () => {
			stopAnimation();
			observer.disconnect();
			window.removeEventListener('resize', onResize);
			if (window.visualViewport) {
				window.visualViewport.removeEventListener('resize', onResize);
			}
			if (resizeTimer) clearTimeout(resizeTimer);
			if (interactive) {
				window.removeEventListener('mousemove', onMouseMove);
				canvas.parentElement?.removeEventListener('mouseleave', onMouseLeave);
			}
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute inset-0 w-full h-full"
	style="pointer-events: none;"
	aria-hidden="true"
></canvas>
