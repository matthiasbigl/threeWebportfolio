<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { _, locale } from 'svelte-i18n';
	import Button from './Button.svelte';

	if (browser) {
		gsap.registerPlugin(ScrollTrigger);
	}

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
			colSpan: 'col-span-2',
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
			colSpan: 'col-span-4',
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

		const mm = gsap.matchMedia();

		mm.add('(min-width: 768px)', () => {
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
		});

		mm.add('(max-width: 767px)', () => {
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
		});

		return () => mm.revert();
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
		<div class="max-w-3xl mb-16 sm:mb-20">
			<div class="flex items-center gap-3 mb-6">
				<div class="h-px w-8 bg-blue-500"></div>
				<span class="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">
					{$_('services.title')}
				</span>
			</div>

			<h2
				class="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 text-white tracking-tight leading-[0.9]"
			>
				{$_('services.titleHighlight')}
			</h2>

			<p
				class="text-lg sm:text-xl text-gray-400 font-light leading-relaxed max-w-2xl border-l-2 border-white/10 pl-6"
			>
				{@html $_('services.subtitle')}
			</p>
		</div>

		<!-- Bento Grid Layout -->
		<div class="bento-grid grid grid-cols-1 md:grid-cols-6 gap-5 lg:gap-6 mb-12">
			{#each services as service}
				<div
					class="bento-item group relative {service.colSpan} rounded-[2rem] overflow-hidden border border-white/5 isolate backdrop-blur-md"
				>
					<!-- Consistent Slate/Blue Background (Matching Card.svelte) -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-slate-900/60 transition-colors duration-500"
					></div>
					<div
						class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"
					></div>

					<!-- Holographic Gradient Accents -->
					<div
						class="absolute inset-0 bg-gradient-to-br {service.gradient} opacity-30 transition-opacity duration-500 group-hover:opacity-60"
					></div>

					<!-- Spotlight Overlay -->
					<div
						class="card-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
					></div>

					<!-- Animated Border Gradient -->
					<div
						class="absolute inset-0 rounded-[2rem] border border-transparent {service.border} transition-colors duration-500"
					></div>

					<!-- Content Container -->
					<div
						class="relative z-10 h-full p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] transition-transform duration-500 group-hover:scale-[1.01]"
					>
						<!-- Header -->
						<div>
							<div
								class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center text-2xl sm:text-3xl mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-black/20"
							>
								{service.icon}
							</div>

							<h3
								class="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300"
							>
								{service.title}
							</h3>
						</div>

						<!-- Description & Features -->
						<div class="flex flex-col h-full justify-between">
							<p
								class="text-slate-300 text-sm sm:text-base font-light leading-relaxed mb-6 border-l border-white/10 pl-4 group-hover:border-white/30 transition-colors duration-500"
							>
								{service.description}
							</p>

							<!-- Features List (Scrollable & Tiny) -->
							<ul
								class="flex flex-nowrap gap-2 mb-6 overflow-x-auto scrollbar-hide mask-fade-right"
							>
								{#each service.features as feature}
									<li
										class="flex-shrink-0 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full whitespace-nowrap group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300"
									>
										{feature}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Holographic Benefits & Pricing Stack (Reordered) -->
		<div class="flex flex-col gap-10 lg:gap-14">
			<!-- Quick Benefits Stack (Now on Top) -->
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
				{#each benefits as benefit}
					<div
						class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 sm:gap-3 hover:bg-white/[0.08] transition-all duration-300 group hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/5 hover:border-white/10"
					>
						<span
							class="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg"
							>{benefit.icon}</span
						>
						<span
							class="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors leading-tight"
							>{benefit.title}</span
						>
					</div>
				{/each}
			</div>

			<!-- Pricing Banner (Now Below) -->
			<div
				class="relative group rounded-[2.5rem] p-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 overflow-hidden"
			>
				<div
					class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 opacity-50 blur-xl"
				></div>

				<div
					class="relative h-full bg-slate-900/60 rounded-[2.3rem] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden backdrop-blur-xl"
				>
					<!-- Animated sheen -->
					<div
						class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
					></div>

					<div class="relative z-10 max-w-xl text-center md:text-left">
						<h3
							class="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-3"
						>
							<span class="text-3xl">💎</span>
							{$locale === 'de' ? 'Transparente Preise' : 'Transparent Pricing'}
						</h3>
						<p class="text-gray-400 font-light leading-relaxed text-base sm:text-lg">
							{$locale === 'de'
								? 'Laden Sie meinen vollständigen Preisführer 2026 herunter.'
								: 'Download my complete 2026 pricing guide.'}
						</p>
					</div>

					<a
						href="/pricing"
						class="relative z-10 px-8 py-4 sm:px-10 sm:py-5 bg-white text-blue-900 font-bold rounded-xl shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 group/btn"
					>
						<span>{$_('pricing.navTitle')}</span>
						<svg
							class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
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
					</a>
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
