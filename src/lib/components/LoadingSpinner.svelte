<script lang="ts">
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		/** Show spinner unconditionally (e.g. during i18n load) */
		visible?: boolean;
		/** Cover the full viewport */
		fullscreen?: boolean;
	}

	let { visible = false, fullscreen = true }: Props = $props();

	// Show on explicit prop OR during SvelteKit page navigation
	const show = $derived(visible || !!$navigating);
</script>

{#if show}
	<div
		class="loading-overlay"
		class:fullscreen
		transition:fade={{ duration: $reducedMotion ? 0 : 220 }}
		aria-live="polite"
		aria-label={m["a11y.loading"]()}
		role="status"
	>
		<div class="spinner-wrapper">
			<!-- Outer glow ring -->
			<div class="glow-ring"></div>

			<!-- Spinning arc -->
			<svg class="spinner" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
				<circle class="track" cx="25" cy="25" r="20" fill="none" stroke-width="3" />
				<circle
					class="arc"
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke-width="3"
					stroke-linecap="round"
				/>
			</svg>

			<!-- Center dot pulse -->
			<div class="center-dot"></div>
		</div>
	</div>
{/if}

<style>
	.loading-overlay {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		pointer-events: none;
	}

	.loading-overlay.fullscreen {
		position: fixed;
		inset: 0;
		background: var(--bg-body);
		pointer-events: all;
	}

	/* ── spinner container ── */
	.spinner-wrapper {
		position: relative;
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ── ambient glow ── */
	.glow-ring {
		position: absolute;
		inset: -8px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%);
		animation: glow-pulse 2s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.15);
		}
	}

	/* ── SVG spinner ── */
	.spinner {
		width: 100%;
		height: 100%;
		animation: spin 1s linear infinite;
	}

	.track {
		stroke: var(--border-primary);
		opacity: 0.5;
	}

	.arc {
		stroke: url(#spinner-gradient);
		stroke: #3b82f6;
		stroke-dasharray: 80, 200;
		stroke-dashoffset: 0;
		animation: arc-dash 1.4s ease-in-out infinite;
	}

	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes arc-dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 80, 200;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 80, 200;
			stroke-dashoffset: -125;
		}
	}

	/* ── center pulse dot ── */
	.center-dot {
		position: absolute;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #3b82f6;
		animation: dot-pulse 1.4s ease-in-out infinite;
		box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
	}

	@keyframes dot-pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(0.8);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
	}
</style>
