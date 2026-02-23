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
		color?: string;
		year?: string;
		category?: string;
		tag?: string;
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
		className = '',
		color = '',
		year = '',
		category = '',
		tag = 'div'
	}: Props = $props();

	const altText = $derived(imageAlt || title);
	const hasProjectMeta = $derived(!!color || !!year || !!category);
</script>

{#if hasProjectMeta}
	<!-- ═══════════════════════════════════════════════════════════
	     EDITORIAL PROJECT ROW — compact horizontal, thumbnail + text
	     ═══════════════════════════════════════════════════════════ -->
	{#snippet projectRowInner()}
		<!-- Accent left edge -->
		<div
			class="absolute top-0 left-0 bottom-0 w-[3px] z-30 rounded-full"
			style="background: {color || '#3b82f6'};"
		></div>

		<div
			class="flex items-center gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 relative z-10"
		>
			<!-- Thumbnail -->
			<div
				class="project-thumb relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden p-1.5 sm:p-2"
				style="box-shadow: 0 4px 16px {color || '#3b82f6'}33, 0 2px 6px {color ||
					'#3b82f6'}22; background: var(--bg-surface, rgba(255,255,255,0.05));"
			>
				<!-- Colored border ring -->
				<div
					class="absolute inset-0 rounded-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
					style="box-shadow: inset 0 0 0 2px {color || '#3b82f6'}88;"
				></div>

				{#if children}
					<div class="absolute inset-0 flex items-center justify-center z-[5] bg-black/5">
						{@render children()}
					</div>
				{:else if image && typeof image === 'object'}
					<enhanced:img
						src={image}
						alt={altText}
						class="project-img relative w-full h-full rounded-md object-contain"
						loading="eager"
					/>
				{:else if typeof image === 'string' && image}
					<img
						src={image}
						alt={altText}
						class="project-img relative w-full h-full rounded-md object-contain"
						loading="eager"
					/>
				{/if}
			</div>

			<!-- Text content -->
			<div class="flex-1 min-w-0">
				<!-- Category + Year -->
				<div class="flex items-center gap-2 mb-1 sm:mb-1.5">
					{#if category}
						<span
							class="text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase"
							style="color: {color || '#3b82f6'};"
						>
							{category}
						</span>
					{/if}
					{#if year}
						<span
							class="text-[10px] sm:text-[11px] font-medium tracking-wider"
							style="color: var(--text-tertiary, var(--text-secondary));"
						>
							{year}
						</span>
					{/if}
				</div>

				<!-- Title -->
				<h3
					class="text-sm sm:text-base lg:text-lg font-bold tracking-tight leading-tight mb-1 sm:mb-1.5 group-hover:translate-x-0.5 transition-transform duration-300"
					style="color: var(--text-heading);"
				>
					{title}
				</h3>

				<!-- Description — unclamped, full text -->
				<p
					class="text-[11px] sm:text-[12px] lg:text-[13px] leading-relaxed line-clamp-2 sm:line-clamp-none"
					style="color: var(--text-secondary);"
				>
					{description}
				</p>
			</div>

			<!-- Arrow -->
			<div
				class="project-arrow flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-300"
				style="background: {color || '#3b82f6'}15; color: {color || '#3b82f6'};"
			>
				<svg
					class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
				</svg>
			</div>
		</div>

		<!-- Hover accent glow (bottom edge) -->
		<div
			class="absolute bottom-0 left-0 right-0 h-px z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
			style="background: linear-gradient(90deg, {color || '#3b82f6'}, transparent 80%);"
		></div>

		<!-- Shimmer -->
		<div class="project-shimmer" aria-hidden="true"></div>
	{/snippet}

	<div class="project-row-item {className}">
		{#if link}
			<a
				href={link}
				target={target || undefined}
				rel={rel || undefined}
				class="project-row block relative group overflow-hidden rounded-xl"
				style="--accent: {color || '#3b82f6'}; --accent-glow: {color || '#3b82f6'}33;"
			>
				{@render projectRowInner()}
			</a>
		{:else}
			<div
				class="project-row block relative group overflow-hidden rounded-xl"
				style="--accent: {color || '#3b82f6'}; --accent-glow: {color || '#3b82f6'}33;"
			>
				{@render projectRowInner()}
			</div>
		{/if}
	</div>
{:else}
	<!-- ═══════════════════════════════════════════════════════════
	     CLASSIC CARD — used for hobbies, generic content
	     ═══════════════════════════════════════════════════════════ -->
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
{/if}

<style>
	/* ═══════════════════════════════════════════
	   PROJECT ROW — Editorial compact style
	   ═══════════════════════════════════════════ */
	.project-row {
		background: var(--card-bg);
		border: 1px solid var(--glass-border);
		transition:
			transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
			box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1),
			border-color 0.35s ease,
			background 0.35s ease;
		will-change: transform;
	}

	.project-row:hover {
		background: var(--card-bg-hover, var(--card-bg));
		border-color: var(--accent);
		box-shadow:
			0 8px 24px -8px rgba(0, 0, 0, 0.15),
			0 0 0 1px var(--accent-glow);
	}

	.project-row:active {
		transform: scale(0.995);
		transition-duration: 0.1s;
	}

	.project-row-item {
		/* For GSAP animation targets */
	}

	.project-thumb {
		transition:
			transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
			box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.project-row:hover .project-thumb {
		transform: scale(1.05);
		box-shadow:
			0 6px 24px var(--accent-glow),
			0 2px 8px var(--accent-glow);
	}

	.project-img {
		transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.project-row:hover .project-img {
		transform: scale(1.06);
	}

	.project-arrow {
		transition:
			opacity 0.3s ease,
			background 0.3s ease;
	}

	.project-row:hover .project-arrow {
		background: var(--accent) !important;
		color: white !important;
	}

	.project-shimmer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		background: linear-gradient(
			105deg,
			transparent 0%,
			transparent 40%,
			rgba(255, 255, 255, 0.04) 45%,
			rgba(255, 255, 255, 0.08) 50%,
			rgba(255, 255, 255, 0.04) 55%,
			transparent 60%,
			transparent 100%
		);
		transform: translateX(-100%);
		z-index: 25;
	}

	.project-row:hover .project-shimmer {
		opacity: 1;
		animation: project-shimmer 0.7s ease-out forwards;
	}

	@keyframes project-shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	/* ═══════════════════════════════════════════
	   CLASSIC CARD — Existing style preserved
	   ═══════════════════════════════════════════ */
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

	/* ═══════════════════════════════════════════
	   Reduced motion — both card types
	   ═══════════════════════════════════════════ */
	@media (prefers-reduced-motion: reduce) {
		.project-row,
		.project-img,
		.project-thumb,
		.project-shimmer,
		.project-arrow,
		.card-inset,
		.card-image,
		.shimmer-overlay,
		.glow-border,
		.image-inset {
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
		}

		.project-row:hover {
			transform: none;
		}

		.project-row:hover .project-img,
		.project-row:hover .project-thumb {
			transform: none;
		}

		.project-row:hover .project-shimmer {
			animation: none;
			opacity: 0;
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

		.card-inset:active,
		.project-row:active {
			transform: none;
		}
	}
</style>
