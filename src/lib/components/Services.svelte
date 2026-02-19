<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { _, locale } from 'svelte-i18n';
	import Button from './Button.svelte';

	const processSteps = $derived([
		{
			id: 'consultation',
			number: '01',
			title: $_('services.allInOne.process.consultation.title'),
			desc: $_('services.allInOne.process.consultation.desc')
		},
		{
			id: 'design',
			number: '02',
			title: $_('services.allInOne.process.design.title'),
			desc: $_('services.allInOne.process.design.desc')
		},
		{
			id: 'development',
			number: '03',
			title: $_('services.allInOne.process.development.title'),
			desc: $_('services.allInOne.process.development.desc')
		},
		{
			id: 'launch',
			number: '04',
			title: $_('services.allInOne.process.launch.title'),
			desc: $_('services.allInOne.process.launch.desc')
		},
		{
			id: 'hosting',
			number: '05',
			title: $_('services.allInOne.process.hosting.title'),
			desc: $_('services.allInOne.process.hosting.desc')
		}
	]);

	const services = $derived([
		{
			id: 'websites',
			icon: '🌐',
			title: $_('services.items.fullstack.title'),
			description: $_('services.items.fullstack.description'),
			features: $_('services.items.fullstack.features') as unknown as string[],
			gradient: 'from-blue-500/10 via-cyan-500/10 to-blue-600/10',
			border: 'group-hover:border-blue-500/50',
			colSpan: 'md:col-span-3 lg:col-span-3',
			delay: 0
		},
		{
			id: 'webshops',
			icon: '🛒',
			title: $_('services.items.webshops.title'),
			description: $_('services.items.webshops.description'),
			features: $_('services.items.webshops.features') as unknown as string[],
			gradient: 'from-purple-500/10 via-pink-500/10 to-purple-600/10',
			border: 'group-hover:border-purple-500/50',
			colSpan: 'md:col-span-3 lg:col-span-3',
			delay: 0.1
		},
		{
			id: 'seo',
			icon: '📈',
			title: $_('services.items.seo.title'),
			description: $_('services.items.seo.description'),
			features: $_('services.items.seo.features') as unknown as string[],
			gradient: 'from-orange-500/10 via-amber-500/10 to-orange-600/10',
			border: 'group-hover:border-orange-500/50',
			colSpan: 'md:col-span-4',
			delay: 0.2
		},
		{
			id: 'custom',
			icon: '✨',
			title: $_('services.items.experiences.title'),
			description: $_('services.items.experiences.description'),
			features: $_('services.items.experiences.features') as unknown as string[],
			gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-600/10',
			border: 'group-hover:border-emerald-500/50',
			colSpan: 'md:col-span-2',
			delay: 0.3
		}
	]);

	const benefitIcons: Record<string, string> = {
		allInOne: '🛡️',
		personal: '🤝',
		local: '📍',
		prices: '💰',
		tech: '⚡',
		detail: '🎯'
	};

	const benefitOrder = ['allInOne', 'personal', 'local', 'prices', 'tech', 'detail'];

	const benefits = $derived(
		benefitOrder.map((key) => ({
			id: key,
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

					if (reduceMotion) return;

					if (isDesktop) {
						gsap.fromTo(
							'.all-in-one-card',
							{
								opacity: 0,
								y: 40,
								scale: 0.95,
								filter: 'blur(8px)'
							},
							{
								opacity: 1,
								y: 0,
								scale: 1,
								filter: 'blur(0px)',
								duration: 0.8,
								ease: 'power3.out',
								scrollTrigger: {
									trigger: '.all-in-one-card',
									start: 'top 90%'
								}
							}
						);

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
									start: 'top 90%'
								}
							}
						);

						gsap.fromTo(
							'.process-step-item',
							{
								opacity: 0,
								y: 30,
								scale: 0.95
							},
							{
								opacity: 1,
								y: 0,
								scale: 1,
								duration: 0.6,
								stagger: 0.08,
								ease: 'power3.out',
								scrollTrigger: {
									trigger: '.process-flow',
									start: 'top 95%'
								}
							}
						);

						const cards = document.querySelectorAll('.bento-item');
						cards.forEach((card: any) => {
							card.addEventListener('mousemove', (e: MouseEvent) => {
								const rect = card.getBoundingClientRect();
								const x = e.clientX - rect.left;
								const y = e.clientY - rect.top;

								const centerX = rect.width / 2;
								const centerY = rect.height / 2;

								const rotateX = ((y - centerY) / centerY) * -5;
								const rotateY = ((x - centerX) / centerX) * 5;

								gsap.to(card, {
									rotationX: rotateX,
									rotationY: rotateY,
									duration: 0.4,
									ease: 'power2.out',
									transformPerspective: 1000
								});

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

					if (isMobile) {
						gsap.fromTo(
							'.all-in-one-card',
							{ opacity: 0, y: 30 },
							{
								opacity: 1,
								y: 0,
								duration: 0.7,
								ease: 'power2.out',
								scrollTrigger: {
									trigger: '.all-in-one-card',
									start: 'top 95%'
								}
							}
						);

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
									start: 'top 95%'
								}
							}
						);

						gsap.fromTo(
							'.process-step-item',
							{ opacity: 0, x: -15, scale: 0.95 },
							{
								opacity: 1,
								x: 0,
								scale: 1,
								duration: 0.5,
								stagger: 0.06,
								ease: 'power2.out',
								scrollTrigger: {
									trigger: '.process-flow',
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
	<div class="absolute inset-0 pointer-events-none">
		<div
			class="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full animate-blob"
		></div>
		<div
			class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full animate-blob animation-delay-2000"
		></div>
		<div
			class="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')] invert filter contrast-125"
		></div>
	</div>

	<div class="container mx-auto px-4 sm:px-6 relative z-10">
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

		<div
			class="all-in-one-card group relative rounded-2xl lg:rounded-3xl overflow-hidden mb-8 lg:mb-12 border isolate backdrop-blur-md"
			style="border-color: var(--glass-border);"
		>
			<div
				class="absolute inset-0 transition-colors duration-500"
				style="background: var(--glass-bg);"
			></div>
			<div
				class="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-cyan-500/15 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
			></div>

			<div
				class="card-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
			></div>

			<div
				class="absolute inset-0 rounded-2xl lg:rounded-3xl border border-transparent group-hover:border-blue-500/50 transition-colors duration-500"
			></div>

			<div class="relative z-10 p-5 sm:p-6 lg:p-8">
				<div class="flex flex-col gap-5 lg:gap-6">
					<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
								style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
							>
								🔧
							</div>
							<div>
								<h3
									class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
									style="color: var(--text-heading);"
								>
									{$_('services.allInOne.title')}
								</h3>
								<p
									class="text-sm sm:text-base font-light mt-0.5"
									style="color: var(--text-secondary);"
								>
									{$_('services.allInOne.tagline')}
								</p>
							</div>
						</div>

						<div class="flex flex-wrap gap-1.5 sm:gap-2 sm:justify-end">
							{#each $_('services.allInOne.features') as feature}
								<span
									class="px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-300"
									style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-primary);"
								>
									✓ {feature}
								</span>
							{/each}
						</div>
					</div>

					<div class="relative">
						<div
							class="process-flow flex items-stretch gap-1 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:-mx-2 sm:px-2"
						>
							{#each processSteps as step, i}
								<div
									class="process-step-item flex-shrink-0 flex-1 min-w-[140px] sm:min-w-[160px] lg:min-w-0 relative group/step"
								>
									<div
										class="h-full p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-default hover:border-blue-500/40"
										style="background: var(--bg-surface); border-color: var(--border-primary);"
									>
										<div class="flex items-center gap-2 mb-2">
											<div
												class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover/step:bg-gradient-to-br group-hover/step:from-blue-500 group-hover/step:to-purple-500 group-hover/step:text-white"
												style="background: var(--bg-inset); color: var(--text-heading); border: 1px solid var(--border-secondary);"
											>
												{step.number}
											</div>
											{#if i < processSteps.length - 1}
												<div class="hidden lg:flex items-center gap-1 flex-1">
													<div
														class="flex-1 h-[2px] rounded-full"
														style="background: var(--border-primary);"
													></div>
													<svg
														class="w-3 h-3 flex-shrink-0"
														style="color: var(--text-tertiary);"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fill-rule="evenodd"
															d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
															clip-rule="evenodd"
														/>
													</svg>
												</div>
											{/if}
										</div>
										<h5
											class="text-xs sm:text-sm font-semibold mb-1 transition-colors duration-300 group-hover/step:text-blue-400"
											style="color: var(--text-heading);"
										>
											{step.title}
										</h5>
										<p
											class="text-[10px] sm:text-xs leading-relaxed"
											style="color: var(--text-tertiary);"
										>
											{step.desc}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="bento-grid grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 lg:gap-5 mb-10 sm:mb-12">
			{#each services as service}
				<article
					class="bento-item group relative {service.colSpan} rounded-xl sm:rounded-2xl overflow-hidden border isolate backdrop-blur-md"
					style="border-color: var(--glass-border);"
				>
					<div
						class="absolute inset-0 transition-colors duration-500"
						style="background: var(--glass-bg);"
					></div>
					<div
						class="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none dark:from-white/[0.04] from-black/[0.02]"
					></div>

					<div
						class="absolute inset-0 bg-gradient-to-br {service.gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-50"
					></div>

					<div
						class="card-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
					></div>

					<div
						class="absolute inset-0 rounded-2xl border border-transparent {service.border} transition-colors duration-500"
					></div>

					<div
						class="relative z-10 h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[300px] transition-transform duration-500 group-hover:scale-[1.01]"
					>
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

						<div class="flex flex-col h-full justify-between">
							<p
								class="text-xs sm:text-sm font-light leading-relaxed mb-3 sm:mb-5 pl-3 sm:pl-4 transition-colors duration-500"
								style="color: var(--text-secondary); border-left: 1px solid var(--border-primary);"
							>
								{service.description}
							</p>

							<div class="flex items-center justify-between">
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
					</div>
				</article>
			{/each}
		</div>

		<div class="flex flex-col gap-10 lg:gap-12">
			<div class="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
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

			<div
				class="relative group rounded-2xl overflow-hidden"
				style="border: 1px solid var(--glass-border);"
			>
				<div class="absolute inset-0" style="background: var(--glass-bg);"></div>
				<div
					class="absolute inset-0 bg-gradient-to-r from-blue-600/[0.06] via-purple-600/[0.04] to-blue-600/[0.06]"
				></div>

				<div
					class="relative h-full p-5 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8"
				>
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

	.all-in-one-card {
		transform-style: preserve-3d;
	}

	.process-flow {
		scrollbar-width: none;
		-ms-overflow-style: none;
		scroll-snap-type: x mandatory;
	}
	.process-flow::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 1023px) {
		.process-flow {
			mask-image: linear-gradient(to right, black 85%, transparent 100%);
			-webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
		}
	}

	.process-step-item {
		scroll-snap-align: start;
	}

	@media (max-width: 767px) {
		.process-step-item:last-child {
			padding-right: 1rem;
		}
	}
</style>
