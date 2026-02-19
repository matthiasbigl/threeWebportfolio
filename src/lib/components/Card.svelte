<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		image?: any;
		imageAlt?: string;
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
		imageAlt = '',
		link = '',
		target = '',
		rel = '',
		imageObjectFit = 'contain',
		children,
		className = ''
	}: Props = $props();

	const altText = $derived(imageAlt || title);
</script>

<div class="stagger-item h-full {className}">
	{#if link}
		<a
			href={link}
			{target}
			{rel}
			class="magnetic-btn card-inset block h-full rounded-2xl p-5 sm:p-6 relative group"
		>
			<div class="shimmer-overlay" aria-hidden="true"></div>
			<div class="glow-border" aria-hidden="true"></div>
			<div class="h-full flex flex-col">
				<div
					class="aspect-[16/10] sm:aspect-square mb-5 sm:mb-6 rounded-xl flex-shrink-0 flex items-center justify-center relative image-inset overflow-hidden"
				>
					<div
						class="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-400/10 via-white/8 to-white/5 blur-xl"
					></div>
					<div
						class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5"
					></div>
					<div
						class="absolute inset-0 rounded-xl bg-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					></div>

					{#if children}
						<div class="relative z-10 w-full h-full flex items-center justify-center">
							{@render children()}
						</div>
					{:else if image && typeof image === 'object'}
						<enhanced:img
							src={image}
							alt={altText}
							class="card-image relative z-10 w-full h-full rounded-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit};"
							loading="eager"
						/>
					{:else if typeof image === 'string' && image}
						<img
							src={image}
							alt={altText}
							class="card-image relative z-10 w-full h-full rounded-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit};"
							loading="eager"
						/>
					{/if}
				</div>

				<h3
					class="text-base sm:text-lg lg:text-xl font-bold mb-2.5 flex-shrink-0 tracking-tight blue-gradient_text font-poppins"
				>
					{title}
				</h3>

				<p
					class="text-[13px] sm:text-sm leading-relaxed flex-grow transition-colors duration-300"
					style="color: var(--text-secondary);"
				>
					{description}
				</p>
			</div>
		</a>
	{:else}
		<div class="magnetic-btn card-inset block h-full rounded-2xl p-5 sm:p-6 relative group">
			<div class="shimmer-overlay" aria-hidden="true"></div>
			<div class="glow-border" aria-hidden="true"></div>
			<div class="h-full flex flex-col">
				<div
					class="aspect-[16/10] sm:aspect-square mb-5 sm:mb-6 rounded-xl flex-shrink-0 flex items-center justify-center relative image-inset overflow-hidden"
				>
					<div
						class="absolute inset-0 rounded-xl bg-gradient-to-t from-blue-400/10 via-white/8 to-white/5 blur-xl"
					></div>
					<div
						class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5"
					></div>
					<div
						class="absolute inset-0 rounded-xl bg-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					></div>

					{#if children}
						<div class="relative z-10 w-full h-full flex items-center justify-center">
							{@render children()}
						</div>
					{:else if image && typeof image === 'object'}
						<enhanced:img
							src={image}
							alt={altText}
							class="card-image relative z-10 w-full h-full rounded-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit};"
							loading="eager"
						/>
					{:else if typeof image === 'string' && image}
						<img
							src={image}
							alt={altText}
							class="card-image relative z-10 w-full h-full rounded-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
							style="object-fit: {imageObjectFit};"
							loading="eager"
						/>
					{/if}
				</div>

				<h3
					class="text-base sm:text-lg lg:text-xl font-bold mb-2.5 flex-shrink-0 tracking-tight blue-gradient_text font-poppins"
				>
					{title}
				</h3>

				<p
					class="text-[13px] sm:text-sm leading-relaxed flex-grow transition-colors duration-300"
					style="color: var(--text-secondary);"
				>
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
		transition:
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.4s ease,
			background 0.3s ease;
		overflow: hidden;
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

	.card-inset:active {
		transform: scale(0.985);
		transition-duration: 0.1s;
	}

	.shimmer-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		background: linear-gradient(
			105deg,
			transparent 0%,
			transparent 40%,
			rgba(255, 255, 255, 0.03) 45%,
			rgba(255, 255, 255, 0.06) 50%,
			rgba(255, 255, 255, 0.03) 55%,
			transparent 60%,
			transparent 100%
		);
		transform: translateX(-100%);
		transition: opacity 0.3s ease;
		z-index: 1;
	}

	.card-inset:hover .shimmer-overlay {
		opacity: 1;
		animation: shimmer 0.8s ease-out forwards;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.glow-border {
		position: absolute;
		inset: -1px;
		pointer-events: none;
		border-radius: inherit;
		opacity: 0;
		background: linear-gradient(
			135deg,
			rgba(59, 130, 246, 0) 0%,
			rgba(59, 130, 246, 0.15) 25%,
			rgba(147, 51, 234, 0.15) 50%,
			rgba(59, 130, 246, 0.15) 75%,
			rgba(59, 130, 246, 0) 100%
		);
		transition: opacity 0.4s ease;
		z-index: -1;
		filter: blur(1px);
	}

	.card-inset:hover .glow-border {
		opacity: 1;
		animation: glow-pulse 2s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}

	.card-image {
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.card-inset:hover .card-image {
		transform: scale(1.03) translateY(-2px);
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
		transition: box-shadow 0.4s ease;
	}

	.card-inset:hover .image-inset {
		box-shadow:
			inset 1px 1px 4px var(--glass-shadow),
			0 4px 16px var(--glass-shadow),
			0 0 30px rgba(59, 130, 246, 0.08);
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

	@media (prefers-reduced-motion: reduce) {
		.card-inset,
		.card-image,
		.shimmer-overlay,
		.glow-border,
		.image-inset {
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
		}

		.card-inset:hover .shimmer-overlay {
			animation: none;
			opacity: 0;
		}

		.card-inset:hover .glow-border {
			animation: none;
		}

		.card-inset:hover .card-image {
			transform: scale(1.03);
		}

		.card-inset:active {
			transform: none;
		}
	}
</style>
