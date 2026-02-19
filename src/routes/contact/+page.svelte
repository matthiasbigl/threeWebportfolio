<script lang="ts">
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import deLocale from '$lib/i18n/locales/de.json';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { _ } from 'svelte-i18n';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let isSubmitting = $state(false);
	let formLoadTime = $state(0);

	// Contact page specific structured data
	const contactPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		name: 'Kontakt - Matthias Bigl Webdesign',
		description:
			'Kontaktieren Sie mich für Ihr Webprojekt. Kostenlose Erstberatung für Websites, Webshops und individuelle Web-Erlebnisse. Webdesigner aus Wien/Korneuburg.',
		url: 'https://bigls.net/contact',
		mainEntity: {
			'@type': 'Person',
			name: 'Matthias Bigl',
			email: 'biglmatthias@gmail.com',
			telephone: '+43 660 459 6636',
			jobTitle: 'Webdesigner & Full Stack Developer',
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Korneuburg',
				addressRegion: 'Niederösterreich',
				addressCountry: 'AT'
			},
			areaServed: ['Wien', 'Korneuburg', 'Niederösterreich', 'Österreich']
		}
	};

	// Reactive contact methods based on translations
	const contactMethods = $derived([
		{
			icon: 'email',
			title: $_('contact.methods.email.title'),
			value: 'biglmatthias@gmail.com',
			href: 'mailto:biglmatthias@gmail.com',
			description: $_('contact.methods.email.description')
		},
		{
			icon: 'phone',
			title: $_('contact.methods.phone.title'),
			value: '+43 660 459 6636',
			href: 'tel:+436604596636',
			description: $_('contact.methods.phone.description')
		},
		{
			icon: 'location',
			title: $_('contact.methods.location.title'),
			value: 'Korneuburg, Austria',
			href: 'https://maps.google.com/?q=Korneuburg,Austria',
			description: $_('contact.methods.location.description')
		},
		{
			icon: 'github',
			title: $_('contact.methods.github.title'),
			value: '@matthiasbigl',
			href: 'https://github.com/matthiasbigl',
			description: $_('contact.methods.github.description')
		}
	]);

	onMount(async () => {
		if (!browser) return;

		// Record form load time for bot detection
		formLoadTime = Date.now();

		const { gsap } = await import('gsap');
		const mm = gsap.matchMedia();

		mm.add('(min-width: 768px)', () => {
			// Hero animation
			gsap.fromTo(
				'.contact-hero',
				{ opacity: 0, y: 100, scale: 0.9 },
				{ opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)', delay: 0.3 }
			);

			// Contact methods stagger animation
			gsap.fromTo(
				'.contact-method',
				{ opacity: 0, y: 60, rotationX: -15 },
				{
					opacity: 1,
					y: 0,
					rotationX: 0,
					duration: 0.8,
					ease: 'back.out(1.7)',
					stagger: 0.15,
					delay: 0.8
				}
			);

			// Form animation
			gsap.fromTo(
				'.contact-form',
				{ opacity: 0, x: 50, scale: 0.95 },
				{ opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out', delay: 1.2 }
			);

			// Magnetic effect handles by Button component now
		});

		mm.add('(max-width: 767px)', () => {
			// Simpler entrance for mobile
			gsap.fromTo(
				'.contact-hero, .contact-method, .contact-form',
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
			);
		});

		// Form input focus animations
		document.querySelectorAll('.form-input').forEach((input: any) => {
			input.addEventListener('focus', () => {
				gsap.to(input.parentElement, { scale: 1.02, duration: 0.3 });
			});

			input.addEventListener('blur', () => {
				gsap.to(input.parentElement, { scale: 1, duration: 0.3 });
			});
		});

		return () => mm.revert();
	});
</script>

<SEO
	title={deLocale.seo.contact.title}
	description={deLocale.seo.contact.description}
	url="https://bigls.net/contact"
	keywords={[
		'Matthias Bigl Kontakt',
		'Matthias Bigl kontaktieren',
		'Webdesign Anfrage Wien',
		'Kontakt Webdesigner Wien',
		'Website erstellen lassen Angebot',
		'Webentwickler kontaktieren Österreich',
		'Freelancer Webdesign Wien Angebot',
		'Freelance Webdesigner anfragen',
		'Webshop Anfrage Österreich',
		'Webdesign Korneuburg Kontakt',
		'Homepage erstellen Angebot Wien',
		'Webentwicklung Niederösterreich Anfrage',
		'kostenlose Webdesign Beratung',
		'Webdesigner in der Nähe kontaktieren',
		'web developer Vienna contact',
		'freelance web designer Austria contact'
	]}
	breadcrumbs={[
		{ name: 'Matthias Bigl', url: 'https://bigls.net' },
		{ name: 'Kontakt', url: 'https://bigls.net/contact' }
	]}
/>

<svelte:head>
	<!-- Contact Page Specific Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(contactPageSchema)}</script>`}
</svelte:head>

<CustomCursor />
<ScrollProgress />

<div class="relative min-h-dvh overflow-hidden pt-16 sm:pt-20">
	<!-- Background Elements -->
	<div class="fixed inset-0 z-0">
		<div class="aurora-bg w-full h-full"></div>
		<div
			class="absolute inset-0"
			style="background: linear-gradient(135deg, var(--overlay-bg) 0%, var(--overlay-strong) 50%, var(--overlay-bg) 100%);"
		></div>

		<!-- Floating geometric shapes -->
		<div
			class="floating-1 css-floating-1 absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
		></div>
		<div
			class="floating-2 css-floating-2 absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"
		></div>
		<div
			class="floating-3 css-floating-3 absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"
		></div>
	</div>

	<main class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
		<!-- Hero Section -->
		<section class="contact-hero text-center mb-16 lg:mb-24">
			<h1 class="font-poppins text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-glow">
				{$_('contact.title')} <span class="blue-gradient_text">{$_('contact.titleHighlight')}</span>
			</h1>
			<p
				class="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
				style="color: var(--text-secondary);"
			>
				{$_('contact.subtitle')}
			</p>
		</section>

		<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
			<!-- Contact Methods -->
			<section class="space-y-6">
				<h2
					class="font-poppins text-2xl lg:text-3xl font-bold mb-8"
					style="color: var(--text-secondary);"
				>
					{$_('contact.getInTouch')}
					<span class="blue-gradient_text">{$_('contact.getInTouchHighlight')}</span>
				</h2>

				<div class="grid gap-6">
					{#each contactMethods as method, index}
						<article class="contact-method">
							<a
								href={method.href}
								target="_blank"
								rel="noopener noreferrer"
								class="contact-card glass-card glass-card-hover p-6 rounded-xl transition-all duration-300 block group"
							>
								<div class="flex items-center gap-4">
									<div
										class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
									>
										{#if method.icon === 'email'}
											<svg
												class="w-8 h-8 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												></path>
											</svg>
										{:else if method.icon === 'phone'}
											<svg
												class="w-8 h-8 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
												></path>
											</svg>
										{:else if method.icon === 'location'}
											<svg
												class="w-8 h-8 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												></path>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												></path>
											</svg>
										{:else if method.icon === 'github'}
											<svg class="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
												/>
											</svg>
										{/if}
									</div>

									<address class="flex-1 not-italic">
										<h3
											class="font-poppins text-lg font-semibold mb-1"
											style="color: var(--text-heading);"
										>
											{method.title}
										</h3>
										<p class="blue-gradient_text font-medium mb-1">{method.value}</p>
										<p class="text-sm" style="color: var(--text-secondary);">
											{method.description}
										</p>
									</address>

									<div
										class="group-hover:text-blue-400 transition-colors duration-300"
										style="color: var(--text-secondary);"
									>
										<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											></path>
										</svg>
									</div>
								</div>
							</a>
						</article>
					{/each}
				</div>
			</section>

			<!-- Contact Form -->
			<div class="contact-form">
				<div class="glass-card p-6 sm:p-8 rounded-2xl">
					<h2
						class="font-poppins text-2xl lg:text-3xl font-bold mb-8"
						style="color: var(--text-secondary);"
					>
						{$_('contact.form.title')}
						<span class="blue-gradient_text">{$_('contact.form.titleHighlight')}</span>
					</h2>

					<form
						method="POST"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ result, update }) => {
								isSubmitting = false;
								if (result.type === 'success') {
									// Clear form on success
									const form = document.querySelector('form');
									if (form) form.reset();
								}
								await update();
							};
						}}
						class="space-y-6"
					>
						<!-- Honeypot field - hidden from users but filled by bots -->
						<div
							style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;"
							aria-hidden="true"
						>
							<label for="website">Website (leave blank)</label>
							<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
						</div>

						<!-- Timestamp for timing check -->
						<input type="hidden" name="_timestamp" value={formLoadTime} />

						<div class="form-field">
							<label
								for="name"
								class="block text-sm font-medium mb-2"
								style="color: var(--text-secondary);"
							>
								{$_('contact.form.name')}
							</label>
							<div class="relative">
								<input
									type="text"
									id="name"
									name="name"
									value={form?.name ?? ''}
									required
									maxlength="100"
									class="form-input w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300"
									style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);"
									placeholder={$_('contact.form.namePlaceholder')}
									class:border-red-500={form?.errors?.name}
								/>
								<div
									class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
								></div>
							</div>
							{#if form?.errors?.name}
								<p class="mt-2 text-sm text-red-400">{form.errors.name}</p>
							{/if}
						</div>

						<div class="form-field">
							<label
								for="email"
								class="block text-sm font-medium mb-2"
								style="color: var(--text-secondary);"
							>
								{$_('contact.form.email')}
							</label>
							<div class="relative">
								<input
									type="email"
									id="email"
									name="email"
									value={form?.email ?? ''}
									required
									maxlength="254"
									class="form-input w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300"
									style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);"
									placeholder={$_('contact.form.emailPlaceholder')}
									class:border-red-500={form?.errors?.email}
								/>
								<div
									class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
								></div>
							</div>
							{#if form?.errors?.email}
								<p class="mt-2 text-sm text-red-400">{form.errors.email}</p>
							{/if}
						</div>

						<div class="form-field">
							<label
								for="message"
								class="block text-sm font-medium mb-2"
								style="color: var(--text-secondary);"
							>
								{$_('contact.form.message')}
							</label>
							<div class="relative">
								<textarea
									id="message"
									name="message"
									value={form?.message ?? ''}
									required
									maxlength="2000"
									rows="6"
									class="form-input w-full px-4 py-3 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300 resize-none"
									style="background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-primary);"
									placeholder={$_('contact.form.messagePlaceholder')}
									class:border-red-500={form?.errors?.message}
								></textarea>
								<div
									class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
								></div>
							</div>
							{#if form?.errors?.message}
								<p class="mt-2 text-sm text-red-400">{form.errors.message}</p>
							{/if}
						</div>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full relative group overflow-hidden"
							variant="secondary"
						>
							<span class="relative z-10 flex items-center justify-center">
								{#if isSubmitting}
									<svg
										class="animate-spin w-5 h-5 inline-block mr-2"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									{$_('contact.form.sending')}
								{:else}
									{$_('contact.form.submit')}
								{/if}
							</span>
							<div
								class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							></div>
						</Button>

						{#if form?.success}
							<div class="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
								<p class="text-green-400 font-medium">{form.message}</p>
							</div>
						{/if}

						{#if form?.errors?.form}
							<div class="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
								<p class="text-red-400 font-medium">{form.errors.form}</p>
							</div>
						{/if}
					</form>
				</div>
			</div>
		</div>

		<!-- Additional CTA Section -->
		<div class="text-center mt-16 lg:mt-24">
			<div class="glass-card p-8 lg:p-12 rounded-2xl max-w-4xl mx-auto">
				<h3 class="font-poppins text-2xl lg:text-3xl font-bold mb-4 text-glow">
					{$_('contact.cta.title')}
					<span class="blue-gradient_text">{$_('contact.cta.titleHighlight')}</span>{$_(
						'contact.cta.titleEnd'
					)}
				</h3>
				<p class="text-lg mb-8 max-w-2xl mx-auto" style="color: var(--text-secondary);">
					{$_('contact.cta.subtitle')}
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button href="mailto:biglmatthias@gmail.com" variant="secondary">
						{$_('contact.cta.emailMe')}
					</Button>
					<Button href="/assets/resume.pdf" external={true} variant="secondary">
						{$_('contact.cta.downloadResume')}
					</Button>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.form-field {
		position: relative;
	}

	.form-field:hover .form-input {
		border-color: rgba(59, 130, 246, 0.25);
		background: var(--bg-surface-hover);
	}

	.contact-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: inherit;
		padding: 1px;
		background: linear-gradient(135deg, transparent 30%, rgba(59, 130, 246, 0.2), transparent 70%);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
		-webkit-mask-composite: destination-out;
		opacity: 0;
		transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.contact-card:hover::before {
		opacity: 1;
	}
</style>
