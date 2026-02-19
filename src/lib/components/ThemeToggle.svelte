<script lang="ts">
	import { theme, toggleTheme } from '$lib/theme';
	import type { Theme } from '$lib/theme';

	let currentTheme: Theme = $state('dark');

	$effect(() => {
		const unsubscribe = theme.subscribe((value) => {
			currentTheme = value;
		});
		return unsubscribe;
	});
</script>

<button
	onclick={toggleTheme}
	class="theme-toggle relative w-10 h-10 sm:w-11 sm:h-11 md:w-8 md:h-8 rounded-xl glass-card glass-card-hover flex items-center justify-center transition-all duration-300 hover:scale-105 border border-[var(--glass-border)]"
	aria-label={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
	<div class="relative w-5 h-5 md:w-4 md:h-4">
		<!-- Sun icon (shown in dark mode — clicking switches to light) -->
		<svg
			class="absolute inset-0 w-5 h-5 md:w-4 md:h-4 text-amber-400 transition-all duration-500 {currentTheme ===
			'dark'
				? 'opacity-100 rotate-0 scale-100'
				: 'opacity-0 -rotate-90 scale-50'}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			stroke-width="2"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
			/>
		</svg>

		<!-- Moon icon (shown in light mode — clicking switches to dark) -->
		<svg
			class="absolute inset-0 w-5 h-5 md:w-4 md:h-4 text-blue-500 transition-all duration-500 {currentTheme ===
			'light'
				? 'opacity-100 rotate-0 scale-100'
				: 'opacity-0 rotate-90 scale-50'}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			stroke-width="2"
		>
			<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
		</svg>
	</div>
</button>

<style>
	.theme-toggle:active {
		transform: scale(0.92);
	}
</style>
