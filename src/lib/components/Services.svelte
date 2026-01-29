<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { _ } from 'svelte-i18n';
	import Card from './Card.svelte';

	if (browser) {
		gsap.registerPlugin(ScrollTrigger);
	}

	const services = $derived([
		{
			icon: '🌐',
			title: $_('services.items.websites.title'),
			description: $_('services.items.websites.description'),
			color: 'from-blue-500/20 to-cyan-500/20'
		},
		{
			icon: '🛒',
			title: $_('services.items.webshops.title'),
			description: $_('services.items.webshops.description'),
			color: 'from-purple-500/20 to-pink-500/20'
		},
		{
			icon: '✨',
			title: $_('services.items.experiences.title'),
			description: $_('services.items.experiences.description'),
			color: 'from-emerald-500/20 to-teal-500/20'
		},
		{
			icon: '🔧',
			title: $_('services.items.fullstack.title'),
			description: $_('services.items.fullstack.description'),
			color: 'from-orange-500/20 to-yellow-500/20'
		}
	]);

	const benefits = $derived([
		{
			icon: '🤝',
			title: $_('services.benefits.personal.title'),
			description: $_('services.benefits.personal.description')
		},
		{
			icon: '📍',
			title: $_('services.benefits.local.title'),
			description: $_('services.benefits.local.description')
		},
		{
			icon: '💰',
			title: $_('services.benefits.prices.title'),
			description: $_('services.benefits.prices.description')
		},
		{
			icon: '🎯',
			title: $_('services.benefits.detail.title'),
			description: $_('services.benefits.detail.description')
		},
		{
			icon: '⚡',
			title: $_('services.benefits.tech.title'),
			description: $_('services.benefits.tech.description')
		},
		{
			icon: '🛡️',
			title: $_('services.benefits.allInOne.title'),
			description: $_('services.benefits.allInOne.description')
		}
	]);

	onMount(() => {
		if (!browser) return;

		const mm = gsap.matchMedia();

		mm.add('(min-width: 768px)', () => {
			// ScrollReveal for service cards
			gsap.fromTo(
				'.service-card',
				{
					opacity: 0,
					y: 40,
					rotationX: -5,
					scale: 0.98
				},
				{
					opacity: 1,
					y: 0,
					rotationX: 0,
					scale: 1,
					duration: 0.8,
					stagger: 0.08,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: '.services-grid',
						start: 'top 90%'
					}
				}
			);

			// Mouse follow light effect
			const cards = document.querySelectorAll('.service-card');
			cards.forEach((card: any) => {
				const light = card.querySelector('.card-light');

				card.addEventListener('mousemove', (e: MouseEvent) => {
					const rect = card.getBoundingClientRect();
					const x = e.clientX - rect.left;
					const y = e.clientY - rect.top;

					gsap.to(light, {
						x: x - 100,
						y: y - 100,
						opacity: 1,
						duration: 0.4,
						ease: 'power1.out'
					});

					// Subtle 3D tilt
					const centerX = rect.width / 2;
					const centerY = rect.height / 2;
					const rotateX = (y - centerY) / 30;
					const rotateY = (centerX - x) / 30;

					gsap.to(card, {
						rotationX: rotateX,
						rotationY: rotateY,
						duration: 0.4,
						ease: 'power1.out'
					});
				});

				card.addEventListener('mouseleave', () => {
					gsap.to(light, { opacity: 0, duration: 0.4 });
					gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power2.out' });
				});
			});
		});

		mm.add('(max-width: 767px)', () => {
			gsap.fromTo(
				'.service-card',
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.05,
					ease: 'power1.out',
					scrollTrigger: {
						trigger: '.services-grid',
						start: 'top 95%'
					}
				}
			);
		});

		return () => mm.revert();
	});
</script>

<section id="services" class="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
	<!-- Background glow - enhanced with subtle gradient -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/8 to-purple-500/5 blur-[120px] rounded-full pointer-events-none"
	></div>

	<div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Section Header - Enhanced with better spacing -->
		<div class="max-w-4xl mb-10 sm:mb-14">
			<span
				class="inline-block text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
			>
				{$_('services.title')}
			</span>
			<h2 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5 leading-tight tracking-tight text-white">
				{$_('services.titleHighlight')}
			</h2>
			<p class="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed font-light max-w-2xl">
				{@html $_('services.subtitle')}
			</p>
		</div>

		<!-- Services Grid - Improved spacing and visual hierarchy -->
		<div class="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-24">
			{#each services as service}
				<div class="service-card group relative">
					<!-- Custom Light follow inside Card's area -->
					<div
						class="card-light absolute w-[200px] h-[200px] bg-blue-500/15 blur-[60px] rounded-full opacity-0 pointer-events-none z-20"
					></div>

					<Card title={service.title} description={service.description} className="h-full">
						<div
							class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br {service.color} flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
						>
							{service.icon}
						</div>
					</Card>
				</div>
			{/each}
		</div>

		<!-- Benefits Section - Bold with depth -->
		<div class="border-t border-white/10 pt-16 sm:pt-20">
			<div class="text-center mb-10 sm:mb-12">
				<h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white tracking-tight">
					{$_('services.whyMe.title')}
				</h3>
				<p class="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-xl mx-auto">
					{$_('services.whyMe.subtitle')}
				</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{#each benefits as benefit, i}
					<div
						class="benefit-item group p-5 sm:p-6 rounded-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02]"
						style="transform-style: preserve-3d;"
					>
						<!-- Gradient border effect -->
						<div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-px pointer-events-none">
							<div class="absolute inset-px rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950/95"></div>
						</div>
						
						<!-- Hover glow -->
						<div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-500"></div>
						
						<!-- Content -->
						<div class="relative z-10">
							<div class="flex items-center gap-3 mb-3">
								<span class="text-2xl sm:text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{benefit.icon}</span>
								<h4 class="text-sm sm:text-base font-semibold text-white tracking-tight group-hover:text-blue-300 transition-colors duration-300">
									{benefit.title}
								</h4>
							</div>
							<p class="text-xs sm:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{benefit.description}</p>
						</div>
						
						<!-- Corner accents -->
						<div class="absolute top-3 right-3 w-2 h-2 border-r border-t border-blue-500/0 group-hover:border-blue-400/40 rounded-tr transition-all duration-500"></div>
						<div class="absolute bottom-3 left-3 w-2 h-2 border-l border-b border-blue-500/0 group-hover:border-blue-400/40 rounded-bl transition-all duration-500"></div>
					</div>
				{/each}
			</div>
		</div>

		<!-- CTA - Bold magnetic button style -->
		<div class="mt-16 sm:mt-20 text-center px-4">
			<a
				href="/contact"
				class="magnetic-btn cta-magnetic inline-flex items-center gap-3 px-6 py-4 sm:px-10 sm:py-5 relative overflow-hidden rounded-2xl group max-w-full"
			>
				<!-- Gradient background -->
				<div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] animate-gradient-shift opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
				
				<!-- Glass overlay -->
				<div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
				
				<!-- Shimmer on hover -->
				<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
				</div>
				
				<!-- Glow effect -->
				<div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
				
				<!-- Content -->
				<span class="relative z-10 text-base sm:text-lg font-bold text-white drop-shadow-lg text-center leading-tight">{$_('services.cta')}</span>
				<svg
					class="relative z-10 w-5 h-5 text-white group-hover:translate-x-2 transition-transform duration-300 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M17 8l4 4m0 0l-4 4m4-4H3"
					></path>
				</svg>
			</a>
		</div>
	</div>
</section>

<style>
	#services {
		perspective: 1500px;
	}

	.service-card {
		transform-style: preserve-3d;
		will-change: transform;
	}

	.cta-magnetic {
		box-shadow: 
			0 0 0 1px rgba(59, 130, 246, 0.2),
			0 10px 40px -10px rgba(59, 130, 246, 0.4),
			0 30px 60px -20px rgba(147, 51, 234, 0.3);
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.cta-magnetic:hover {
		transform: translateY(-4px) scale(1.02);
		box-shadow: 
			0 0 0 1px rgba(59, 130, 246, 0.4),
			0 20px 50px -10px rgba(59, 130, 246, 0.5),
			0 40px 80px -20px rgba(147, 51, 234, 0.4);
	}

	@keyframes gradient-shift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	.animate-gradient-shift {
		animation: gradient-shift 3s ease-in-out infinite;
	}

	.benefit-item {
		box-shadow: 
			0 4px 20px -5px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.03);
	}

	.benefit-item:hover {
		box-shadow: 
			0 8px 30px -5px rgba(0, 0, 0, 0.4),
			0 0 30px -10px rgba(59, 130, 246, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}
</style>
