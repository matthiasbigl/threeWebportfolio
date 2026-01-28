<script lang="ts">
	import Mountains from './Mountains.svelte';

	interface Props {
		title: string;
		description: string;
		image?: string;
		link?: string;
		isSpecialComponent?: boolean;
		imageObjectFit?: 'contain' | 'cover';
	}

	let {
		title,
		description,
		image = '',
		link = '',
		isSpecialComponent = false,
		imageObjectFit = 'contain'
	}: Props = $props();
</script>

<div class="stagger-item h-full overflow-visible">
	{#if link}
		<a
			href={link}
			class="block glass-card glass-card-hover h-full transition-all duration-300 rounded-xl p-4 sm:p-6 text-center relative magnetic-btn"
			style="z-index: 1; will-change: transform, box-shadow; perspective: 1000px;"
		>
			<div class="h-full flex flex-col">
				<div
					class="aspect-square mb-4 sm:mb-6 rounded-xl overflow-hidden bg-white/5 p-1 flex-shrink-0"
				>
					{#if isSpecialComponent && title === 'Skiing'}
						<Mountains />
					{:else}
						<img
							src={image}
							alt={title}
							class="w-full h-full rounded-lg"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{/if}
				</div>

				<h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 blue-gradient_text flex-shrink-0">
					{title}
				</h3>

				<p class="text-gray-300 text-xs md:text-sm leading-relaxed flex-grow sm:text-base">
					{description}
				</p>
			</div>
		</a>
	{:else}
		<div
			class="block glass-card glass-card-hover h-full transition-all duration-300 rounded-xl p-4 sm:p-6 text-center relative magnetic-btn"
			style="z-index: 1; will-change: transform, box-shadow; perspective: 1000px;"
		>
			<div class="h-full flex flex-col">
				<div
					class="aspect-square mb-4 sm:mb-6 rounded-xl overflow-hidden bg-white/5 p-1 flex-shrink-0"
				>
					{#if isSpecialComponent && title === 'Skiing'}
						<Mountains />
					{:else}
						<img
							src={image}
							alt={title}
							class="w-full h-full rounded-lg"
							style="object-fit: {imageObjectFit}"
							loading="lazy"
						/>
					{/if}
				</div>

				<h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 blue-gradient_text flex-shrink-0">
					{title}
				</h3>

				<p class="text-gray-300 text-xs md:text-sm leading-relaxed flex-grow sm:text-base">
					{description}
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Ensure proper z-index stacking on hover */
	.glass-card:hover {
		z-index: 50;
	}

	h3 {
		font-family: 'Poppins', sans-serif;
	}

	/* Optimize shadow rendering */
	.stagger-item {
		transform-style: preserve-3d;
	}
</style>
