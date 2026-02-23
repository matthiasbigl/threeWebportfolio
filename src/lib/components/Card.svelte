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
	     CINEMATIC PROJECT CARD — full-bleed image, overlay text
	     ═══════════════════════════════════════════════════════════ -->
	<div class="stagger-item h-full {className}">
		{@const Wrapper = link ? 'a' : 'div'}
		<svelte:element
			this={Wrapper}
			href={link || undefined}
			target={target || undefined}
			rel={rel || undefined}
			class="project-card block h-full rounded-2xl relative group overflow-hidden"
			style="--accent: {color || '#3b82f6'}; --accent-glow: {color || '#3b82f6'}33;"
		>
			<!-- Accent top edge -->
			<div
				class="absolute top-0 left-0 right-0 h-[2px] z-30"
				style="background: linear-gradient(90deg, transparent 10%, {color ||
					'#3b82f6'}, transparent 90%);"
			></div>

			<!-- Image area — full card height -->
			<div class="project-card-image relative w-full aspect-[4/3] sm:aspect-[3/2] overflow-hidden">
				<!-- Colored tint overlay -->
				<div
					class="absolute inset-0 z-10 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-500"
					style="background: {color || '#3b82f6'};"
				></div>

				<!-- Bottom gradient for text readability -->
				<div
					class="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
				></div>

				<!-- Hover vignette -->
				<div
					class="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
					style="background: radial-gradient(ellipse at center, transparent 40%, {color ||
						'#3b82f6'}15 100%);"
				></div>

				{#if children}
					<div class="absolute inset-0 flex items-center justify-center z-[5]">
						{@render children()}
					</div>
				{:else if image && typeof image === 'object'}
					<enhanced:img
						src={image}
						alt={altText}
						class="project-img absolute inset-0 w-full h-full object-cover"
						style="object-fit: {imageObjectFit};"
						loading="eager"
					/>
				{:else if typeof image === 'string' && image}
					<img
						src={image}
						alt={altText}
						class="project-img absolute inset-0 w-full h-full object-cover"
						style="object-fit: {imageObjectFit};"
						loading="eager"
					/>
				{/if}
			</div>

			<!-- Floating metadata chips -->
			<div class="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5">
				{#if category}
					<span
						class="px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase rounded-md backdrop-blur-md border"
						style="background: rgba(0,0,0,0.5); color: rgba(255,255,255,0.9); border-color: rgba(255,255,255,0.1);"
					>
						{category}
					</span>
				{/if}
				{#if year}
					<span
						class="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wider rounded-md backdrop-blur-md"
						style="background: {color || '#3b82f6'}CC; color: white;"
					>
						{year}
					</span>
				{/if}
			</div>

			<!-- Arrow indicator -->
			<div
				class="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 backdrop-blur-md"
				style="background: {color || '#3b82f6'}; color: white;"
			>
				<svg
					class="w-3.5 h-3.5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
				</svg>
			</div>

			<!-- Text overlay at bottom -->
			<div class="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5">
				<h3
					class="text-base sm:text-lg font-bold text-white mb-1 tracking-tight leading-snug group-hover:translate-x-1 transition-transform duration-300"
				>
					{title}
				</h3>
				<p
					class="text-[12px] sm:text-[13px] font-light leading-relaxed text-white/60 group-hover:text-white/80 transition-colors duration-300 line-clamp-2"
				>
					{description}
				</p>
			</div>

			<!-- Shimmer -->
			<div class="project-shimmer" aria-hidden="true"></div>

			<!-- Bottom accent glow on hover -->
			<div
				class="absolute bottom-0 left-0 right-0 h-px z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
				style="background: linear-gradient(90deg, transparent, {color ||
					'#3b82f6'}, transparent); box-shadow: 0 0 12px {color || '#3b82f6'}66;"
			></div>
		</svelte:element>
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
	   PROJECT CARD — Cinematic style
	   ═══════════════════════════════════════════ */
	.project-card {
		background: var(--bg-surface);
		border: 1px solid var(--glass-border);
		transition:
			transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
			box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1),
			border-color 0.4s ease;
		will-change: transform;
	}

	.project-card:hover {
		transform: translateY(-6px);
		border-color: var(--accent);
		box-shadow:
			0 20px 40px -12px rgba(0, 0, 0, 0.2),
			0 0 0 1px var(--accent-glow),
			0 0 30px var(--accent-glow);
	}

	.project-card:active {
		transform: translateY(-2px) scale(0.99);
		transition-duration: 0.1s;
	}

	.project-img {
		transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.project-card:hover .project-img {
		transform: scale(1.06);
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
			rgba(255, 255, 255, 0.06) 45%,
			rgba(255, 255, 255, 0.12) 50%,
			rgba(255, 255, 255, 0.06) 55%,
			transparent 60%,
			transparent 100%
		);
		transform: translateX(-100%);
		z-index: 25;
	}

	.project-card:hover .project-shimmer {
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
		.project-card,
		.project-img,
		.project-shimmer,
		.card-inset,
		.card-image,
		.shimmer-overlay,
		.glow-border,
		.image-inset {
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
		}

		.project-card:hover {
			transform: none;
		}

		.project-card:hover .project-img {
			transform: none;
		}

		.project-card:hover .project-shimmer {
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
		.project-card:active {
			transform: none;
		}
	}
</style>
