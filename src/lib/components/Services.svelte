<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { _, locale } from 'svelte-i18n';
	import Button from './Button.svelte';

	// GSAP is dynamically imported in onMount to avoid blocking initial render

	const services = $derived([
		{
			id: 'experiences',
			icon: '✨',
			title: $_('services.items.experiences.title'),
			description: $_('services.items.experiences.description'),
			features: $_('services.items.experiences.features') as unknown as string[],
			gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-600/10',
			border: 'group-hover:border-emerald-500/50',
			colSpan: 'md:col-span-3 lg:col-span-3',
			delay: 0
		},
		{
			id: 'fullstack',
			icon: '🔧',
			title: $_('services.items.fullstack.title'),
			description: $_('services.items.fullstack.description'),
			features: $_('services.items.fullstack.features') as unknown as string[],
			gradient: 'from-orange-500/10 via-amber-500/10 to-orange-600/10',
			border: 'group-hover:border-orange-500/50',
			colSpan: 'md:col-span-3 lg:col-span-3',
			delay: 0.1
		},
		{
			id: 'seo',
			icon: '🌐',
			title: $_('services.items.seo.title'),
			description: $_('services.items.seo.description'),
			features: $_('services.items.seo.features') as unknown as string[],
			gradient: 'from-blue-500/10 via-cyan-500/10 to-blue-600/10',
			border: 'group-hover:border-blue-500/50',
			colSpan: 'md:col-span-2',
			delay: 0.2
		},
		{
			id: 'webshops',
			icon: '🛒',
			title: $_('services.items.webshops.title'),
			description: $_('services.items.webshops.description'),
			features: $_('services.items.webshops.features') as unknown as string[],
			gradient: 'from-purple-500/10 via-pink-500/10 to-purple-600/10',
			border: 'group-hover:border-purple-500/50',
			colSpan: 'md:col-span-4',
			delay: 0.3
		}
	]);

	const benefitIcons: Record<string, string> = {
		personal: '🤝',
		local: '📍',
		prices: '💰',
		detail: '🎯',
		tech: '⚡',
		allInOne: '🛡️'
	};

	// Generate benefits list dynamically preserving JSON order
	const benefits = $derived(
		Object.keys($_('services.benefits')).map((key) => ({
			icon: benefitIcons[key] || '⭐',
			title: $_(`services.benefits.${key}.title`)
		}))
	);

	onMount(() => {
		if (!browser) return;

		let mm: gsap.MatchMedia;

		(async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			mm = gsap.matchMedia();

			mm.add(
				{
					isDesktop: '(min-width: 768px)',
					isMobile: '(max-width: 767px)',
					reduceMotion: '(prefers-reduced-motion: reduce)'
				},
				(context) => {
					const { isDesktop, isMobile, reduceMotion } = context.conditions!;

					if (reduceMotion) {
						// Optionally handle specific logic for reduced motion here
						// but usually we just want to skip the following animations
						return;
					}

					if (isDesktop) {
						// Bento Grid Entrance
						gsap.fromTo(
							'.bento-item',
							{
								opacity: 0,
								y: 50,
								scale: 0.9,
								filter: 'blur(10px)'
							},
							{
								opacity: 1,
								y: 0,
								scale: 1,
								filter: 'blur(0px)',
								duration: 1,
								stagger: 0.1,
								ease: 'power3.out',
								scrollTrigger: {
									trigger: '.bento-grid',
									start: 'top 85%'
								}
							}
						);

						// Holographic tilt effect
						const cards = document.querySelectorAll('.bento-item');
						cards.forEach((card: any) => {
							card.addEventListener('mousemove', (e: MouseEvent) => {
								const rect = card.getBoundingClientRect();
								const x = e.clientX - rect.left;
								const y = e.clientY - rect.top;

								const centerX = rect.width / 2;
								const centerY = rect.height / 2;

								const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
								const rotateY = ((x - centerX) / centerX) * 5;

								gsap.to(card, {
									rotationX: rotateX,
									rotationY: rotateY,
									duration: 0.4,
									ease: 'power2.out',
									transformPerspective: 1000
								});

								// Spotlight effect
								const spotlight = card.querySelector('.card-spotlight');
								if (spotlight) {
									gsap.to(spotlight, {
										background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`,
										duration: 0.3
									});
								}
							});

							card.addEventListener('mouseleave', () => {
								gsap.to(card, {
									rotationX: 0,
									rotationY: 0,
									duration: 0.7,
									ease: 'elastic.out(1, 0.5)'
								});
								const spotlight = card.querySelector('.card-spotlight');
								if (spotlight) {
									gsap.to(spotlight, {
										background: `radial-gradient(600px circle at 50% 50%, rgba(255,255,255,0), transparent 40%)`,
										duration: 0.3
									});
								}
							});
						});

						// Magnetic effect for refined CTA
						const cta = document.querySelector('.cta-magnetic');
						if (cta) {
							cta.addEventListener('mouseenter', () => {
								gsap.to(cta, { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' });
							});
							cta.addEventListener('mouseleave', () => {
								gsap.to(cta, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
							});
							(cta as HTMLElement).addEventListener('mousemove', (e: MouseEvent) => {
								const rect = cta.getBoundingClientRect();
								const x = e.clientX - rect.left - rect.width / 2;
								const y = e.clientY - rect.top - rect.height / 2;
								gsap.to(cta, {
									x: x * 0.3,
									y: y * 0.3,
									duration: 0.3,
									ease: 'power2.out'
								});
							});
						}
					}
				}
			);

			mm.add(
				{
					isMobile: '(max-width: 767px)',
					reduceMotion: '(prefers-reduced-motion: reduce)'
				},
				(context) => {
					if (context.conditions?.reduceMotion) return;
					const { isMobile } = context.conditions!;

					if (isMobile) {
						gsap.fromTo(
							'.bento-item',
							{ opacity: 0, x: -20 },
							{
								opacity: 1,
								x: 0,
								duration: 0.8,
								stagger: 0.1,
								ease: 'power2.out',
								scrollTrigger: {
									trigger: '.bento-grid',
									start: 'top 90%'
								}
							}
						);
					}
				}
			);
		})();

		return () => mm?.revert();
	});
</script>

<section
	id="services"
	class="relative py-20 lg:py-32 overflow-hidden selection:bg-blue-500/30 selection:text-white"
>
	<!-- Background Ambiance -->
	<div class="absolute inset-0 pointer-events-none">
		<div
			class="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full animate-blob"
		></div>
		<div
			class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full animate-blob animation-delay-2000"
		></div>

		<!-- Noise texture for premium feel -->
		<div
			class="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')] invert filter contrast-125"
		></div>
	</div>

	<div class="container mx-auto px-4 sm:px-6 relative z-10">
		<!-- Section Header -->
		<div class="max-w-3xl mb-10 sm:mb-16 lg:mb-20">
			<div class="flex items-center gap-3 mb-4 sm:mb-6">
				<div class="h-px w-8 bg-blue-500"></div>
				<span class="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">
					{$_('services.title')}
				</span>
			</div>

			<h2
				class="text-3xl sm:text-5xl lg:text-7xl font-bold mb-5 sm:mb-8 tracking-tight leading-[0.95] sm:leading-[0.9]"
				style="color: var(--text-heading);"
			>
				{$_('services.titleHighlight')}
			</h2>

			<p
				class="text-base sm:text-xl font-light leading-relaxed max-w-2xl pl-4 sm:pl-6"
				style="color: var(--text-secondary); border-left: 2px solid var(--border-primary);"
			>
				{@html $_('services.subtitle')}
			</p>
		</div>

		<!-- Bento Grid Layout -->
		<div class="bento-grid grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 lg:gap-5 mb-10 sm:mb-12">
			{#each services as service}
				<article
					class="bento-item group relative {service.colSpan} rounded-xl sm:rounded-2xl overflow-hidden border isolate backdrop-blur-md"
					style="border-color: var(--glass-border);"
				>
					<!-- Consistent Background -->
					<div
						class="absolute inset-0 transition-colors duration-500"
						style="background: var(--glass-bg);"
					></div>
					<div
						class="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none dark:from-white/[0.04] from-black/[0.02]"
					></div>

					<!-- Holographic Gradient Accents -->
					<div
						class="absolute inset-0 bg-gradient-to-br {service.gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-50"
					></div>

					<!-- Spotlight Overlay -->
					<div
						class="card-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
					></div>

					<!-- Animated Border Gradient -->
					<div
						class="absolute inset-0 rounded-2xl border border-transparent {service.border} transition-colors duration-500"
					></div>

					<!-- Content Container -->
					<div
						class="relative z-10 h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[300px] transition-transform duration-500 group-hover:scale-[1.01]"
					>
						<!-- Header -->
						<div>
							<div
								class="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
								style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
							>
								{service.icon}
							</div>

							<h3
								class="text-[15px] sm:text-lg lg:text-xl font-bold mb-1.5 sm:mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300"
								style="color: var(--text-heading);"
							>
								{service.title}
							</h3>
						</div>

						<!-- Description & Features -->
						<div class="flex flex-col h-full justify-between">
							<p
								class="text-xs sm:text-sm font-light leading-relaxed mb-3 sm:mb-5 pl-3 sm:pl-4 transition-colors duration-500"
								style="color: var(--text-secondary); border-left: 1px solid var(--border-primary);"
							>
								{service.description}
							</p>

							<!-- Features List -->
							<ul
								class="flex flex-wrap sm:flex-nowrap gap-1.5 mb-2 sm:mb-4 sm:overflow-x-auto sm:scrollbar-hide sm:mask-fade-right"
							>
								{#each service.features as feature}
									<li
										class="flex-shrink-0 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium rounded-full whitespace-nowrap transition-all duration-300"
										style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-primary);"
									>
										{feature}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- Benefits & Pricing Stack -->
		<div class="flex flex-col gap-10 lg:gap-12">
			<!-- Quick Benefits -->
			<div class="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
				{#each benefits as benefit}
					<div
						class="rounded-lg sm:rounded-xl p-3 sm:p-5 flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2.5 transition-all duration-300 group hover:scale-[1.02]"
						style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
					>
						<span
							class="text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-300"
							>{benefit.icon}</span
						>
						<span
							class="text-[10px] sm:text-xs font-medium transition-colors leading-tight"
							style="color: var(--text-secondary);">{benefit.title}</span
						>
					</div>
				{/each}
			</div>

			<!-- Pricing Banner -->
			<div
				class="relative group rounded-2xl overflow-hidden"
				style="border: 1px solid var(--glass-border);"
			>
				<!-- Glass background -->
				<div class="absolute inset-0" style="background: var(--glass-bg);"></div>
				<div
					class="absolute inset-0 bg-gradient-to-r from-blue-600/[0.06] via-purple-600/[0.04] to-blue-600/[0.06]"
				></div>

				<div
					class="relative h-full p-5 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8"
				>
					<!-- Animated sheen -->
					<div
						class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
					></div>

					<div class="relative z-10 max-w-xl text-center md:text-left">
						<h3
							class="text-xl sm:text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2.5"
							style="color: var(--text-heading);"
						>
							<span class="text-2xl">💎</span>
							{$locale === 'de' ? 'Transparente Preise' : 'Transparent Pricing'}
						</h3>
						<p
							class="font-light leading-relaxed text-sm sm:text-base"
							style="color: var(--text-secondary);"
						>
							{$locale === 'de'
								? 'Laden Sie meinen vollständigen Preisführer 2026 herunter.'
								: 'Download my complete 2026 pricing guide.'}
						</p>
					</div>

					<Button
						href="/pricing"
						variant="inverted"
						className="relative z-10 !text-sm sm:!text-base !px-7 !py-3.5 sm:!px-8 sm:!py-4"
					>
						<span>{$_('pricing.navTitle')}</span>
						<svg
							class="w-4 h-4 group-hover:translate-x-1 transition-transform"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</Button>
				</div>
			</div>
		</div>
		<!-- Final CTA - Matched to Hero Style -->
		<div class="mt-24 text-center">
			<Button href="/contact">
				{$_('services.cta')} &rarr;
			</Button>
		</div>
	</div>
</section>

<style>
	.animate-blob {
		animation: blob 10s infinite;
	}
	.animation-delay-2000 {
		animation-delay: 2s;
	}
	@keyframes blob {
		0% {
			transform: translate(0px, 0px) scale(1);
		}
		33% {
			transform: translate(30px, -50px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		100% {
			transform: translate(0px, 0px) scale(1);
		}
	}
</style>
