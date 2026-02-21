<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import { _ } from 'svelte-i18n';
</script>

<SEO
	title={$_('seo.datenschutz.title')}
	description={$_('seo.datenschutz.description')}
	url="https://bigls.net/datenschutz"
	noindex={true}
/>

<CustomCursor />

<div class="relative min-h-dvh pt-32 pb-20 selection:bg-blue-500/20">
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
		<header class="mb-12">
			<h1
				class="font-poppins text-4xl sm:text-5xl font-bold mb-4"
				style="color: var(--text-heading);"
			>
				{$_('privacy.title')}
			</h1>
			<div class="h-1 w-20 bg-blue-500 rounded-full"></div>
		</header>

		<div
			class="glass-card p-8 sm:p-12 rounded-[2rem] space-y-10 leading-relaxed"
			style="color: var(--text-secondary);"
		>
			<section>
				<p>{$_('privacy.intro')}</p>
			</section>

			<section>
				<h2 class="font-bold text-xl mb-4" style="color: var(--text-heading);">
					{$_('privacy.contact')}
				</h2>
				<p>{$_('privacy.contactText')}</p>
			</section>

			<section>
				<h2 class="font-bold text-xl mb-4" style="color: var(--text-heading);">
					{$_('privacy.analytics')}
				</h2>
				<p>{$_('privacy.analyticsText')}</p>
			</section>

			<section class="pt-6" style="border-top: 1px solid var(--border-primary);">
				<p class="text-sm opacity-80">Stand: Jänner 2026</p>
			</section>
		</div>
	</div>
</div>

<style>
	.aurora-bg {
		background:
			radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
			radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%);
		filter: blur(80px);
	}

	.glass-card {
		background: var(--glass-bg);
		backdrop-filter: blur(20px) saturate(150%);
		-webkit-backdrop-filter: blur(20px) saturate(150%);
		border: 1px solid var(--glass-border);
	}
</style>
