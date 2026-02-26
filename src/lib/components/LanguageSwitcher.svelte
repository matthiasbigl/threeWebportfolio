<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import type { Locale } from '$lib/paraglide/runtime.js';
	import * as m from '$lib/paraglide/messages.js';

	let isOpen = $state(false);

	const currentLocale = $derived(getLocale());

	const labelMap: Record<string, () => string> = {
		de: () => m['language.de'](),
		en: () => m['language.en'](),
		cs: () => m['language.cs']()
	};

	function handleLocaleChange(lang: Locale) {
		setLocale(lang);
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
			{#each locales as lang}
				<button
					onclick={() => handleLocaleChange(lang)}
					class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-500/10 transition-colors duration-200 {currentLocale ===
					lang
						? 'bg-blue-500/10'
						: ''}"
					style="color: var(--text-primary);"
				>
					<span>{labelMap[lang]?.() ?? lang.toUpperCase()}</span>
					{#if currentLocale === lang}
						<svg class="w-4 h-4 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</button>
			{/each}
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
