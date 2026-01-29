<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		image?: string;
		link?: string;
		imageObjectFit?: 'contain' | 'cover';
		children?: Snippet;
		className?: string;
	}

	let {
		title,
		description,
		image = '',
		link = '',
		imageObjectFit = 'contain',
		children,
		className = ''
	}: Props = $props();
</script>

<div class="stagger-item h-full {className}">
	{#if link}
		<a
			href={link}
			class="magnetic-btn card-inset block h-full rounded-2xl p-5 sm:p-6 relative group"
		>
			<div class="h-full flex flex-col">
				<!-- Image area with inset effect and backlight -->
				<div class="aspect-square mb-5 sm:mb-6 rounded-xl flex-shrink-0 flex items-center justify-center relative image-inset overflow-visible">
					<!-- Constant warm backlight glow -->
					<div class="absolute -inset-3 rounded-2xl bg-gradient-to-t from-amber-200/15 via-white/10 to-white/5 blur-2xl"></div>
					<!-- Subtle hover enhancement -->
					<div class="absolute -inset-2 rounded-2xl bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					{#if children}
						<div class="relative z-10 w-full h-full flex items-center justify-center">
							{@render children()}
						</div>
					{:else if image}
						<img
							src={image}
							alt={title}
							class="relative z-10 w-full h-full rounded-lg object-center transition-transform duration-500 group-hover:scale-105"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{/if}
				</div>

				<h3 class="text-base sm:text-lg lg:text-xl font-bold mb-3 flex-shrink-0 tracking-tight blue-gradient_text">
					{title}
				</h3>

				<p class="text-gray-400 text-sm sm:text-base leading-relaxed flex-grow group-hover:text-gray-300 transition-colors duration-300">
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
				<div class="aspect-square mb-5 sm:mb-6 rounded-xl flex-shrink-0 flex items-center justify-center relative image-inset overflow-visible">
					<!-- Constant warm backlight glow -->
					<div class="absolute -inset-3 rounded-2xl bg-gradient-to-t from-amber-200/15 via-white/10 to-white/5 blur-2xl"></div>
					<!-- Subtle hover enhancement -->
					<div class="absolute -inset-2 rounded-2xl bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					{#if children}
						<div class="relative z-10 w-full h-full flex items-center justify-center">
							{@render children()}
						</div>
					{:else if image}
						<img
							src={image}
							alt={title}
							class="relative z-10 w-full h-full rounded-lg object-center transition-transform duration-500 group-hover:scale-105"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{/if}
				</div>

				<h3 class="text-base sm:text-lg lg:text-xl font-bold mb-3 flex-shrink-0 tracking-tight blue-gradient_text">
					{title}
				</h3>

				<p class="text-gray-400 text-sm sm:text-base leading-relaxed flex-grow group-hover:text-gray-300 transition-colors duration-300">
					{description}
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.card-inset {
		background: linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.6));
		box-shadow: 
			inset 4px 4px 8px rgba(0, 0, 0, 0.4),
			inset -4px -4px 8px rgba(255, 255, 255, 0.02),
			0 4px 20px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.4s ease;
	}

	.card-inset:hover {
		background: linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.7));
		box-shadow: 
			inset 2px 2px 4px rgba(0, 0, 0, 0.3),
			inset -2px -2px 4px rgba(255, 255, 255, 0.03),
			0 8px 30px rgba(0, 0, 0, 0.4),
			0 0 20px rgba(59, 130, 246, 0.08);
		border-color: rgba(59, 130, 246, 0.15);
	}

	.image-inset {
		background: rgba(0, 0, 0, 0.3);
		box-shadow: 
			inset 3px 3px 6px rgba(0, 0, 0, 0.5),
			inset -2px -2px 4px rgba(255, 255, 255, 0.02);
		padding: 0.75rem;
	}

	.card-inset {
		will-change: transform;
	}

	h3 {
		font-family: 'Poppins', sans-serif;
	}

	.stagger-item {
		transform-style: preserve-3d;
	}
</style>
