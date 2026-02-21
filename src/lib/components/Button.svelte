<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	interface Props {
		href?: string;
		variant?: 'primary' | 'secondary' | 'inverted';
		type?: 'button' | 'submit' | 'reset';
		className?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
		external?: boolean;
		disabled?: boolean;
	}

	let {
		href,
		variant = 'primary',
		type = 'button',
		className = '',
		onclick,
		children,
		external = false,
		disabled = false
	}: Props = $props();

	let element = $state<HTMLElement>();
	let ripples = $state<{ id: number; x: number; y: number; size: number }[]>([]);
	let rippleId = 0;

	function createRipple(e: MouseEvent) {
		if (!element || disabled) return;
		const rect = element.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const size = Math.max(rect.width, rect.height) * 2;
		ripples = [...ripples, { id: rippleId++, x, y, size }];
		setTimeout(() => {
			ripples = ripples.filter((r) => r.id !== rippleId - 1);
		}, 600);
	}

	onMount(() => {
		if (!element) return;

		const el = element;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let cleanup: (() => void) | undefined;

		(async () => {
			try {
				const { gsap } = await import('gsap');

			const handleMouseEnter = (e: Event) => {
				const target = e.currentTarget as HTMLElement;
				gsap.to(target, { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' });
			};

			const handleMouseLeave = (e: Event) => {
				const target = e.currentTarget as HTMLElement;
				gsap.to(target, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
			};

			const handleMouseMove = (e: MouseEvent) => {
				const target = e.currentTarget as HTMLElement;
				const rect = target.getBoundingClientRect();
				const x = e.clientX - rect.left - rect.width / 2;
				const y = e.clientY - rect.top - rect.height / 2;

				gsap.to(target, {
					x: x * 0.3,
					y: y * 0.3,
					duration: 0.3,
					ease: 'power2.out'
				});
			};

			el.addEventListener('mouseenter', handleMouseEnter);
			el.addEventListener('mouseleave', handleMouseLeave);
			el.addEventListener('mousemove', handleMouseMove);
			el.addEventListener('click', createRipple);

			cleanup = () => {
				el.removeEventListener('mouseenter', handleMouseEnter);
				el.removeEventListener('mouseleave', handleMouseLeave);
				el.removeEventListener('mousemove', handleMouseMove);
				el.removeEventListener('click', createRipple);
			};
			} catch (e) {
				console.error('Failed to load GSAP for Button', e);
			}
		})();

		return () => cleanup?.();
	});

	const baseClasses =
		'magnetic-btn px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-center rounded-2xl transition-all duration-300 inline-flex items-center justify-center gap-2';

	const baseStyle = variant === 'inverted' ? '' : `color: var(--text-heading);`;

	const variants: Record<string, string> = {
		primary:
			'glass-card shadow-lg shadow-blue-500/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/25 hover:border-blue-500/40 hover:shadow-blue-500/20',
		secondary: 'glass-card glass-card-hover border hover:border-white/15',
		inverted:
			'bg-white text-slate-900 shadow-xl shadow-black/15 hover:bg-blue-50 hover:shadow-2xl hover:-translate-y-0.5'
	};
</script>

{#if href}
	<a
		bind:this={element}
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		class="{baseClasses} {variants[variant]} {className}"
		style={baseStyle}
		{onclick}
	>
		{@render children?.()}
		{#each ripples as ripple}
			<span
				class="ripple-effect"
				style="left: {ripple.x}px; top: {ripple.y}px; width: {ripple.size}px; height: {ripple.size}px;"
			></span>
		{/each}
	</a>
{:else}
	<button
		bind:this={element}
		{type}
		class="{baseClasses} {variants[variant]} {className} {disabled
			? 'opacity-50 cursor-not-allowed'
			: ''}"
		style={baseStyle}
		{onclick}
		{disabled}
	>
		{@render children?.()}
		{#each ripples as ripple}
			<span
				class="ripple-effect"
				style="left: {ripple.x}px; top: {ripple.y}px; width: {ripple.size}px; height: {ripple.size}px;"
			></span>
		{/each}
	</button>
{/if}

<style>
	.ripple-effect {
		position: absolute;
		border-radius: 50%;
		background: rgba(59, 130, 246, 0.25);
		transform: translate(-50%, -50%) scale(0);
		animation: ripple-animation 0.6s ease-out forwards;
		pointer-events: none;
	}

	@keyframes ripple-animation {
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ripple-effect {
			animation: none;
			display: none;
		}
	}
</style>
