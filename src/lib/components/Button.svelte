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

	onMount(async () => {
		if (!element) return;

		// Lazy-load GSAP for magnetic hover effect
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

		element.addEventListener('mouseenter', handleMouseEnter);
		element.addEventListener('mouseleave', handleMouseLeave);
		element.addEventListener('mousemove', handleMouseMove);

		return () => {
			if (element) {
				element.removeEventListener('mouseenter', handleMouseEnter);
				element.removeEventListener('mouseleave', handleMouseLeave);
				element.removeEventListener('mousemove', handleMouseMove);
			}
		};
	});

	const baseClasses =
		'magnetic-btn px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-center rounded-2xl transition-all duration-300 inline-flex items-center justify-center gap-2';

	const variants: Record<string, string> = {
		primary:
			'glass-card text-white shadow-lg shadow-blue-500/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/25 hover:border-blue-500/40 hover:shadow-blue-500/20',
		secondary: 'glass-card glass-card-hover text-white border border-white/[0.08] hover:border-white/15',
		inverted: 'bg-white text-slate-900 shadow-xl shadow-black/15 hover:bg-blue-50 hover:shadow-2xl hover:-translate-y-0.5'
	};
</script>

{#if href}
	<a
		bind:this={element}
		{href}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		class="{baseClasses} {variants[variant]} {className}"
		{onclick}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={element}
		{type}
		class="{baseClasses} {variants[variant]} {className} {disabled
			? 'opacity-50 cursor-not-allowed'
			: ''}"
		{onclick}
		{disabled}
	>
		{@render children?.()}
	</button>
{/if}
