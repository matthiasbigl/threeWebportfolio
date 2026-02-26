<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let container = $state<HTMLElement>();
	let image = $state<HTMLElement>();

	async function handleMouseEnter() {
		if (!container || !image) return;
		const { gsap } = await import('gsap');
		gsap.to(container, {
			scale: 1.02,
			duration: 0.4,
			ease: 'power2.out'
		});
		gsap.to(image, {
			scale: 1.1,
			duration: 0.6,
			ease: 'power2.out'
		});
	}

	async function handleMouseLeave() {
		if (!container || !image) return;
		const { gsap } = await import('gsap');
		gsap.to(container, {
			scale: 1,
			duration: 0.4,
			ease: 'power2.out'
		});
		gsap.to(image, {
			scale: 1.05,
			duration: 0.6,
			ease: 'power2.out'
		});
	}

	async function handleMouseMove(e: MouseEvent) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		const { gsap } = await import('gsap');
		gsap.to(container, {
			rotationY: x * 10,
			rotationX: -y * 10,
			duration: 0.5,
			ease: 'power2.out'
		});
	}
</script>

<figure
	bind:this={container}
	class="photo-avatar-container relative w-full h-full rounded-3xl overflow-hidden glass-card-premium shadow-2xl"
	style="perspective: 1000px;"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmousemove={handleMouseMove}
>
	<!-- Background Gradient/Glow (Subtle) -->
	<div
		class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 mix-blend-overlay"
	></div>

	<!-- The Image -->
	<enhanced:img
		bind:this={image}
		src="$lib/assets/headshot.png"
		alt={m['a11y.avatarAlt']()}
		class="w-full h-full object-cover object-top scale-105 transition-transform duration-700 ease-out"
	/>

	/* Inner Border/Glint */
	<div class="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none"></div>
	<div
		class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none"
	></div>

	<!-- Sweeping Glint Effect -->
	<div
		class="glint-effect absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full pointer-events-none"
	></div>
</figure>

<style>
	.glass-card-premium {
		background: var(--glass-bg);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--glass-border);
		box-shadow: var(--card-shadow);
	}

	.photo-avatar-container {
		transform-style: preserve-3d;
		will-change: transform;
	}

	.glint-effect {
		animation: glint 8s infinite ease-in-out;
	}

	@keyframes glint {
		0%,
		80% {
			transform: skewX(-12deg) translateX(-100%);
		}
		90%,
		100% {
			transform: skewX(-12deg) translateX(100%);
		}
	}

	:global(.hero-avatar) {
		filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.2));
	}
</style>
