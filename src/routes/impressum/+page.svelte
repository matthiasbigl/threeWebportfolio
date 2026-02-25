<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<SEO
	title="Impressum | Matthias Bigl – Webdesigner Wien/Korneuburg"
	description="Impressum und rechtliche Informationen von Matthias Bigl, Webdesigner & Full Stack Developer aus Korneuburg bei Wien, Österreich."
	url="https://bigls.net/impressum"
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
				{m['imprint.title']()}
			</h1>
			<div class="h-1 w-20 bg-blue-500 rounded-full"></div>
		</header>

		<div
			class="glass-card p-8 sm:p-12 rounded-[2rem] space-y-10 leading-relaxed"
			style="color: var(--text-secondary);"
		>
			<section>
				<h2 class="font-bold text-xl mb-4" style="color: var(--text-heading);">
					{m['imprint.owner']()}
				</h2>
				<p>Matthias Bigl<br />Webdesigner & Softwareentwickler</p>
			</section>

			<section>
				<h2 class="font-bold text-xl mb-4" style="color: var(--text-heading);">
					{m['imprint.address']()}
				</h2>
				<p>Dammstraße 11/2<br />2100 Korneuburg<br />Österreich</p>
			</section>

			<section>
				<h2 class="font-bold text-xl mb-4" style="color: var(--text-heading);">
					{m['imprint.contact']()}
				</h2>
				<p>
					E-Mail: <a href="mailto:biglmatthias@gmail.com" class="text-blue-400 hover:underline"
						>biglmatthias@gmail.com</a
					><br />
					Tel:
					<a href="tel:+436604596636" class="text-blue-400 hover:underline">+43 660 459 6636</a>
				</p>
			</section>

			<section>
				<h2 class="font-bold text-xl mb-4" style="color: var(--text-heading);">
					{m['imprint.disclaimer']()}
				</h2>
				<p>{m['imprint.disclaimerText']()}</p>
			</section>

			<section class="pt-6" style="border-top: 1px solid var(--border-primary);">
				<h2
					class="font-bold text-sm uppercase tracking-widest mb-4"
					style="color: var(--text-heading);"
				>
					{m['imprint.content']()}
				</h2>
				<p class="text-sm opacity-80">{m['imprint.contentText']()}</p>
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
