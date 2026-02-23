<script lang="ts">
	interface Props {
		title: string;
		description: string;
		category?: string;
		year?: string;
		link: string;
		isExternal?: boolean;
		image?: any;
		imageAlt?: string;
		className?: string;
	}

	let {
		title,
		description,
		category = '',
		year = '',
		link,
		isExternal = false,
		image,
		imageAlt = '',
		className = ''
	}: Props = $props();

	const target = isExternal ? '_blank' : undefined;
	const rel = isExternal ? 'noopener noreferrer' : undefined;
</script>

<a
	href={link}
	{target}
	{rel}
	class="project-row-item group block relative border-b border-[var(--border-primary)] py-8 sm:py-12 lg:py-16 transition-all duration-500 hover:bg-[var(--text-primary)] {className}"
>
	<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 sm:px-8">
		<div class="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
			<!-- Meta (Category & Year) -->
			<div
				class="flex sm:flex-col gap-4 sm:gap-1 text-xs sm:text-sm font-mono tracking-widest uppercase opacity-60 group-hover:text-[var(--bg-body)] transition-colors duration-500"
			>
				{#if category}<span>{category}</span>{/if}
				{#if year}<span>{year}</span>{/if}
			</div>

			<!-- Title -->
			<h3
				class="text-4xl sm:text-6xl md:text-7xl font-poppins font-extrabold tracking-tighter uppercase group-hover:text-[var(--bg-body)] transition-colors duration-500"
			>
				{title}
			</h3>
		</div>

		<!-- Hover Reveal Image (Desktop) -->
		<div
			class="hidden lg:block w-0 opacity-0 group-hover:w-72 group-hover:opacity-100 transition-all duration-700 ease-expo overflow-hidden rounded-xl flex-shrink-0 origin-left"
		>
			<div class="w-72 h-40 relative flex items-center justify-center p-2">
				{#if image && typeof image === 'object'}
					<enhanced:img
						src={image}
						alt={imageAlt}
						class="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-expo group-hover:scale-110"
					/>
				{:else if image}
					<img
						src={image}
						alt={imageAlt}
						class="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-expo group-hover:scale-110"
					/>
				{/if}
			</div>
		</div>

		<!-- Arrow & Desc -->
		<div class="flex flex-col items-start lg:items-end gap-4 lg:w-1/4 flex-shrink-0">
			<p
				class="text-sm opacity-70 group-hover:text-[var(--bg-body)] transition-colors duration-500 line-clamp-2 lg:text-right"
			>
				{description}
			</p>

			<div
				class="w-12 h-12 rounded-full border border-[var(--border-primary)] flex items-center justify-center group-hover:border-[var(--bg-body)] group-hover:text-[var(--bg-body)] group-hover:bg-[var(--text-primary)] transition-all duration-500 relative overflow-hidden"
			>
				<div
					class="absolute inset-0 bg-[var(--bg-body)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"
				></div>
				<svg
					class="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-expo-in-out relative z-10"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</div>
		</div>
	</div>
</a>
