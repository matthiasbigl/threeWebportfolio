<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Picture } from 'vite-imagetools';

	interface Props {
		title: string;
		description: string;
		image?: string | Picture;
		link?: string;
		target?: string;
		rel?: string;
		imageObjectFit?: 'contain' | 'cover';
		children?: Snippet;
		className?: string;
	}

	let {
		title,
		description,
		image = '',
		link = '',
		target = '',
		rel = '',
		imageObjectFit = 'contain',
		children,
		className = ''
	}: Props = $props();

	const isEnhanced = $derived(image && typeof image === 'object');
</script>

<div class="stagger-item h-full {className}">
	{#if link}
		<a
			href={link}
			{target}
			{rel}
			class="magnetic-btn card-inset block h-full rounded-2xl p-5 sm:p-6 relative group"
		>
			<div class="h-full flex flex-col">
				<!-- Image area with inset effect and backlight -->
				<div class="aspect-[16/10] sm:aspect-square mb-5 sm:mb-6 rounded-xl flex-shrink-0 flex items-center justify-center relative image-inset overflow-hidden">
					<!-- Ambient backlight glow - always visible -->
					<div class="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-400/10 via-white/8 to-white/5 blur-xl"></div>
					<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
					<!-- Subtle hover enhancement -->
					<div class="absolute inset-0 rounded-xl bg-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					{#if children}
						<div class="relative z-10 w-full h-full flex items-center justify-center">
							{@render children()}
						</div>
					{:else if isEnhanced}
						<enhanced:img
							src={image}
							alt={title}
							class="relative z-10 w-full h-full rounded-lg object-center transition-transform duration-500 group-hover:scale-[1.03] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{:else if image}
						<img
							src={image}
							alt={title}
							class="relative z-10 w-full h-full rounded-lg object-center transition-transform duration-500 group-hover:scale-[1.03] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{/if}
				</div>

				<h3 class="text-base sm:text-lg lg:text-xl font-bold mb-2.5 flex-shrink-0 tracking-tight blue-gradient_text font-poppins">
					{title}
				</h3>

				<p class="text-[13px] sm:text-sm leading-relaxed flex-grow transition-colors duration-300" style="color: var(--text-secondary);">
					{description}
				</p>
			</div>
		</a>
	{:else}
		<div
			class="magnetic-btn card-inset block h-full rounded-2xl p-5 sm:p-6 relative group"
		>
			<div class="h-full flex flex-col">
				<!-- Image area with inset effect and backlight -->
				<div class="aspect-[16/10] sm:aspect-square mb-5 sm:mb-6 rounded-xl flex-shrink-0 flex items-center justify-center relative image-inset overflow-hidden">
					<!-- Ambient backlight glow - always visible -->
					<div class="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-400/10 via-white/8 to-white/5 blur-xl"></div>
					<div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
					<!-- Subtle hover enhancement -->
					<div class="absolute inset-0 rounded-xl bg-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					{#if children}
						<div class="relative z-10 w-full h-full flex items-center justify-center">
							{@render children()}
						</div>
					{:else if isEnhanced}
						<enhanced:img
							src={image}
							alt={title}
							class="relative z-10 w-full h-full rounded-lg object-center transition-transform duration-500 group-hover:scale-[1.03] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{:else if image}
						<img
							src={image}
							alt={title}
							class="relative z-10 w-full h-full rounded-lg object-center transition-transform duration-500 group-hover:scale-[1.03] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{/if}
				</div>

				<h3 class="text-base sm:text-lg lg:text-xl font-bold mb-2.5 flex-shrink-0 tracking-tight blue-gradient_text font-poppins">
					{title}
				</h3>

				<p class="text-[13px] sm:text-sm leading-relaxed flex-grow transition-colors duration-300" style="color: var(--text-secondary);">
					{description}
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.card-inset {
		background: var(--card-bg);
		box-shadow: var(--card-shadow), var(--card-inset-shadow);
		border: 1px solid var(--glass-border);
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s ease, background 0.3s ease;
	}

	@media (min-width: 640px) {
		.card-inset {
			box-shadow: var(--card-shadow), var(--card-inset-shadow);
		}
	}

	.card-inset:hover {
		background: var(--card-bg-hover);
		box-shadow: var(--card-shadow-hover);
		border-color: var(--border-accent);
	}

	.image-inset {
		background: var(--bg-inset);
		box-shadow: 
			inset 1px 1px 4px var(--glass-shadow),
			0 2px 8px var(--glass-shadow),
			0 0 20px rgba(59, 130, 246, 0.04);
		padding: 0.625rem;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid var(--border-secondary);
	}

	@media (min-width: 640px) {
		.image-inset {
			padding: 0.75rem;
		}
	}

	.card-inset {
		will-change: transform;
	}

	.stagger-item {
		transform-style: preserve-3d;
	}

	@media (max-width: 640px) {
		.stagger-item {
			transform-style: flat;
		}
	}
</style>
