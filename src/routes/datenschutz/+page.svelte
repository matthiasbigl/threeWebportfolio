<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import { _ } from 'svelte-i18n';
</script>

<SEO
	title="Datenschutz | Matthias Bigl – Webdesigner Wien/Korneuburg"
	description="Datenschutzerklärung von Matthias Bigl, Webdesigner & Full Stack Developer aus Korneuburg bei Wien. DSGVO-konforme Informationen zur Datenverarbeitung."
	url="https://bigls.net/datenschutz"
	noindex={true}
/>

<CustomCursor />

<div class="relative min-h-screen pt-32 pb-20 selection:bg-blue-500/20">
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
		<header class="mb-12">
			<h1 class="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
				{$_('privacy.title')}
			</h1>
			<div class="h-1 w-20 bg-blue-500 rounded-full"></div>
		</header>

		<div class="glass-card p-8 sm:p-12 rounded-[2rem] space-y-10 text-gray-300 leading-relaxed">
			<section>
				<p>{$_('privacy.intro')}</p>
			</section>

			<section>
				<h2 class="text-white font-bold text-xl mb-4">{$_('privacy.contact')}</h2>
				<p>{$_('privacy.contactText')}</p>
			</section>

			<section>
				<h2 class="text-white font-bold text-xl mb-4">{$_('privacy.analytics')}</h2>
				<p>{$_('privacy.analyticsText')}</p>
			</section>

			<section class="pt-6 border-t border-white/10">
				<p class="text-sm opacity-80">Stand: Jänner 2026</p>
			</section>
		</div>
	</div>
</div>

<style>
	.aurora-bg {
		background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
			radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%);
		filter: blur(80px);
	}

	.glass-card {
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(20px) saturate(150%);
		-webkit-backdrop-filter: blur(20px) saturate(150%);
		border: 1px solid rgba(255, 255, 255, 0.07);
	}
</style>
