<script lang="ts">
	interface Props {
		className?: string;
		shape?: 'rect' | 'circle' | 'rounded';
	}

	let { className = '', shape = 'rounded' }: Props = $props();

	const shapeClass = $derived(
		shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-xl' : 'rounded-none'
	);
</script>

<div class="skeleton-container {className} {shapeClass} overflow-hidden bg-white/5 relative">
	<div class="shimmer"></div>
</div>

<style>
	.skeleton-container {
		min-height: 1rem;
		width: 100%;
	}

	.shimmer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.05) 50%,
			transparent 100%
		);
		animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		transform: translateX(-100%);
	}

	@keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}
</style>
