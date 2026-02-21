<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { _, locale as localeStore } from 'svelte-i18n';

	let isOpen = $state(false);

	// Reactive current locale
	let currentLocale = $state('de');

	// Subscribe to locale changes
	$effect(() => {
		const unsubscribe = localeStore.subscribe((value) => {
			currentLocale = value || 'de';
		});
		return unsubscribe;
	});

	function handleLocaleChange(lang: 'de' | 'en' | 'cs') {
		const currentPath = $page.url.pathname;
		const hash = $page.url.hash;
		// Handle root path or paths with a lang segment
		const segments = currentPath.split('/');
		if (segments.length >= 2 && segments[1]) {
			segments[1] = lang;
			const newPath = segments.join('/') + hash;
			goto(newPath, { replaceState: false });
		} else {
			goto(`/${lang}${hash}`, { replaceState: false });
		}
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>

<svelte:window onclick={() => (isOpen = false)} />

<div class="relative">
	<button
		onclick={(e) => {
			e.stopPropagation();
			toggleDropdown();
		}}
		class="flex items-center gap-2 md:gap-1.5 px-3 py-2 md:px-2 md:py-1 rounded-lg glass-card glass-card-hover text-sm md:text-xs font-medium transition-all duration-300 hover:scale-105"
		style="color: var(--text-primary); border: 1px solid var(--border-primary);"
		aria-label="Change language"
		title="Change language"
	>
		<!-- Globe icon -->
		<svg
			class="w-4 h-4 md:w-3.5 md:h-3.5 text-blue-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
			/>
		</svg>
		<span class="text-base md:text-sm">{currentLocale === 'de' ? '🇩🇪' : currentLocale === 'cs' ? '🇨🇿' : '🇬🇧'}</span>
		<span class="text-xs uppercase tracking-wide">{currentLocale}</span>
		<svg
			class="w-3 h-3 transition-transform duration-200"
			class:rotate-180={isOpen}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden shadow-xl z-50 animate-fadeIn dropdown-glass"
			style="border: 1px solid var(--border-primary); background: var(--navbar-bg-scrolled);"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				onclick={() => handleLocaleChange('de')}
				class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-500/10 transition-colors duration-200 {currentLocale ===
				'de'
					? 'bg-blue-500/10'
					: ''}"
				style="color: var(--text-primary);"
			>
				<span class="text-lg">🇩🇪</span>
				<span>{$_('language.de')}</span>
				{#if currentLocale === 'de'}
					<svg class="w-4 h-4 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>
			<button
				onclick={() => handleLocaleChange('en')}
				class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-500/10 transition-colors duration-200 {currentLocale ===
				'en'
					? 'bg-blue-500/10'
					: ''}"
				style="color: var(--text-primary);"
			>
				<span class="text-lg">🇬🇧</span>
				<span>{$_('language.en')}</span>
				{#if currentLocale === 'en'}
					<svg class="w-4 h-4 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>
			<button
				onclick={() => handleLocaleChange('cs')}
				class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-500/10 transition-colors duration-200 {currentLocale ===
				'cs'
					? 'bg-blue-500/10'
					: ''}"
				style="color: var(--text-primary);"
			>
				<span class="text-lg">🇨🇿</span>
				<span>{$_('language.cs')}</span>
				{#if currentLocale === 'cs'}
					<svg class="w-4 h-4 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>
		</div>
	{/if}
</div>

<style>
	.dropdown-glass {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	.animate-fadeIn {
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
