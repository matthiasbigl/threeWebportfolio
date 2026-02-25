<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import Button from './Button.svelte';
	import Marquee from './Marquee.svelte';

	const processSteps = $derived([
		{
			id: 'consultation',
			number: '01',
			title: m['services.allInOne.process.consultation.title'](),
			desc: m['services.allInOne.process.consultation.desc']()
		},
		{
			id: 'design',
			number: '02',
			title: m['services.allInOne.process.design.title'](),
			desc: m['services.allInOne.process.design.desc']()
		},
		{
			id: 'development',
			number: '03',
			title: m['services.allInOne.process.development.title'](),
			desc: m['services.allInOne.process.development.desc']()
		},
		{
			id: 'launch',
			number: '04',
			title: m['services.allInOne.process.launch.title'](),
			desc: m['services.allInOne.process.launch.desc']()
		},
		{
			id: 'hosting',
			number: '05',
			title: m['services.allInOne.process.hosting.title'](),
			desc: m['services.allInOne.process.hosting.desc']()
		}
	]);

	const services = $derived([
		{
			id: 'websites',
			icon: '🌐',
			title: m['services.items.fullstack.title'](),
			description: m['services.items.fullstack.description'](),
			features: m['services.items.fullstack.features']().split('\n'),
			gradient: 'from-blue-500/10 via-cyan-500/10 to-blue-600/10',
			border: 'group-hover:border-blue-500/50',
			accent: '#3b82f6',
			accentGlow: 'rgba(59, 130, 246, 0.15)',
			colSpan: 'md:col-span-3 lg:col-span-3',
			delay: 0
		},
		{
			id: 'webshops',
			icon: '🛒',
			title: m['services.items.webshops.title'](),
			description: m['services.items.webshops.description'](),
			features: m['services.items.webshops.features']().split('\n'),
			gradient: 'from-purple-500/10 via-pink-500/10 to-purple-600/10',
			border: 'group-hover:border-purple-500/50',
			accent: '#a855f7',
			accentGlow: 'rgba(168, 85, 247, 0.15)',
			colSpan: 'md:col-span-3 lg:col-span-3',
			delay: 0.1
		},
		{
			id: 'seo',
			icon: '📈',
			title: m['services.items.seo.title'](),
			description: m['services.items.seo.description'](),
			features: m['services.items.seo.features']().split('\n'),
			gradient: 'from-orange-500/10 via-amber-500/10 to-orange-600/10',
			border: 'group-hover:border-orange-500/50',
			accent: '#f97316',
			accentGlow: 'rgba(249, 115, 22, 0.15)',
			colSpan: 'md:col-span-2',
			delay: 0.2
		},
		{
			id: 'custom',
			icon: '✨',
			title: m['services.items.experiences.title'](),
			description: m['services.items.experiences.description'](),
			features: m['services.items.experiences.features']().split('\n'),
			gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-600/10',
			border: 'group-hover:border-emerald-500/50',
			accent: '#10b981',
			accentGlow: 'rgba(16, 185, 129, 0.15)',
			colSpan: 'md:col-span-4',
			delay: 0.3
		}
	]);

	let hoveredStepIndex = $state(-1);
	let bentoScrollProgress = $state(0);
	let activeBentoIndex = $state(0);

	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
			: [0, 0, 0];
	}

	const morphedColor = $derived.by(() => {
		if (services.length < 2) return services[0]?.accent || '#3b82f6';
		const totalIntervals = services.length - 1;
		const exactPos = bentoScrollProgress * totalIntervals;
		const index1 = Math.floor(exactPos);
		const index2 = Math.min(Math.ceil(exactPos), totalIntervals);
		const factor = exactPos - index1;

		const rgb1 = hexToRgb(services[index1].accent);
		const rgb2 = hexToRgb(services[index2].accent);

		const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
		const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
		const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));

		return `rgb(${r}, ${g}, ${b})`;
	});

	function handleBentoScroll(e: Event) {
		const target = e.target as HTMLElement;
		if (!target) return;
		const scrollLeft = target.scrollLeft;
		const maxScroll = target.scrollWidth - target.clientWidth;

		if (maxScroll > 0) {
			bentoScrollProgress = scrollLeft / maxScroll;
			// Calculate active card index based on scroll position
			const cardWidth = target.scrollWidth / services.length;
			activeBentoIndex = Math.round(scrollLeft / cardWidth);
		}
	}

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
			title:
				(m as unknown as Record<string, (() => string) | undefined>)[
					`services.benefits.${key}.title`
				]?.() ?? ''
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
	class="relative pt-20 lg:pt-32 pb-12 lg:pb-20 overflow-hidden selection:bg-blue-500/30 selection:text-white"
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
				<span class="font-syne text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">
					{m['services.title']()}
				</span>
			</div>

			<h2
				class="text-3xl sm:text-5xl lg:text-7xl font-bold mb-5 sm:mb-8 tracking-tight leading-[0.95] sm:leading-[0.9]"
				style="color: var(--text-heading);"
			>
				{m['services.titleHighlight']()}
			</h2>

			<p
				class="text-base sm:text-xl font-light leading-relaxed max-w-2xl pl-4 sm:pl-6"
				style="color: var(--text-secondary); border-left: 2px solid var(--border-accent);"
			>
				{@html m['services.subtitle']()}
			</p>
		</div>

		<div
			class="all-in-one-card group relative rounded-2xl lg:rounded-3xl mb-8 lg:mb-12 border isolate backdrop-blur-md"
			style="border-color: var(--glass-border);"
		>
			<div
				class="absolute inset-0 rounded-2xl lg:rounded-3xl overflow-hidden transition-colors duration-500"
				style="background: var(--glass-bg);"
			></div>
			<div
				class="absolute inset-0 rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-cyan-500/15 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
			></div>

			<div
				class="card-spotlight absolute inset-0 rounded-2xl lg:rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
			></div>

			<div
				class="absolute inset-0 rounded-2xl lg:rounded-3xl border border-transparent group-hover:border-blue-500/50 transition-colors duration-500"
			></div>

			<div class="relative z-10 p-5 sm:p-6 lg:p-8">
				<div class="flex flex-col gap-5 lg:gap-6">
					<div class="flex items-start gap-3 sm:gap-4">
					<div
						class="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg mt-0.5"
						style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
					>
						🔧
					</div>
					<div class="flex-1 min-w-0">
						<h3
							class="font-syne text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-0.5"
							style="color: var(--text-heading);"
						>
							{m['services.allInOne.title']()}
						</h3>
						<p
							class="text-sm sm:text-base font-light"
							style="color: var(--text-secondary);"
						>
							{m['services.allInOne.tagline']()}
						</p>
					</div>
				</div>

				<!-- Feature chips — simple, flat, 2-col grid on mobile -->
				<div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
					{#each m['services.allInOne.features']().split('\n') as feature}
						<span
							class="all-in-one-feature-chip inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-[13px] font-medium rounded-full select-none"
							style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-primary);"
						>
							<span class="text-blue-400 font-bold">✓</span>
							{feature}
						</span>
					{/each}
				</div>

				<!-- Process steps -->
				<div class="relative rounded-lg">
					<div
						class="process-flow flex items-stretch gap-1 sm:gap-2 overflow-x-auto py-2 -mx-1 px-1 sm:-mx-2 sm:px-2"
					>
							{#each processSteps as step, i}
								{@const isHovered = hoveredStepIndex === i}
								{@const isNextOfHovered = hoveredStepIndex >= 0 && i === hoveredStepIndex + 1}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="process-step-item flex-shrink-0 flex-1 min-w-[140px] sm:min-w-[160px] lg:min-w-0 relative group/step"
									onmouseenter={() => (hoveredStepIndex = i)}
									onmouseleave={() => (hoveredStepIndex = -1)}
								>
									<!-- Step card -->
									<div
										class="process-step-card h-full p-3 sm:p-4 rounded-xl border cursor-default {isHovered
											? 'step-active'
											: ''} {isNextOfHovered ? 'step-next-lit' : ''}"
										style="background: var(--bg-surface); border-color: var(--border-primary);"
									>
										<div class="flex items-center gap-2 mb-2">
											<!-- Number badge -->
											<div
												class="process-step-number w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold {isHovered
													? 'step-number-active'
													: ''} {isNextOfHovered ? 'step-number-next' : ''}"
												style="background: var(--bg-inset); color: var(--text-heading); border: 1px solid var(--border-secondary);"
											>
												{step.number}
											</div>
											<!-- Connector arrow -->
											{#if i < processSteps.length - 1}
												<div class="hidden lg:flex items-center gap-1 flex-1 connector-wrapper">
													<div
														class="connector-track flex-1 h-[2px] rounded-full relative overflow-hidden"
														style="background: var(--border-primary);"
													>
														<div
															class="connector-fill absolute inset-y-0 left-0 rounded-full {isHovered
																? 'connector-active'
																: ''}"
														></div>
													</div>
													<svg
														class="w-3.5 h-3.5 flex-shrink-0 connector-chevron {isHovered
															? 'chevron-active'
															: ''}"
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
											class="process-step-title font-syne text-xs sm:text-sm font-semibold mb-1 {isHovered
												? 'step-title-active'
												: ''} {isNextOfHovered ? 'step-title-next' : ''}"
											style="color: var(--text-heading);"
										>
											{step.title}
										</h5>
										<p
											class="text-[10px] sm:text-xs leading-relaxed process-step-desc {isNextOfHovered
												? 'step-desc-next'
												: ''}"
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

		<!-- Round 2: Section divider label between all-in-one card and individual service cards -->
		<div class="flex items-center gap-3 mb-5 sm:mb-6">
			<div class="h-px flex-1" style="background: var(--border-primary);"></div>
			<span
				class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] px-1"
				style="color: var(--text-tertiary);"
			>Einzelne Leistungen</span>
			<div class="h-px flex-1" style="background: var(--border-primary);"></div>
		</div>

		<div
			class="bento-grid grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-5 mb-6 sm:mb-8 md:mb-10 lg:mb-12"
		>
			{#each services as service, i}
				<article
					class="bento-item group relative {service.colSpan} w-full rounded-2xl overflow-hidden border isolate backdrop-blur-md"
					style="border-color: var(--glass-border);"
				>
					<!-- Colored top accent line (visible always, stronger on mobile) -->
					<div
						class="absolute top-0 left-0 right-0 h-[2px] md:h-px z-20"
						style="background: linear-gradient(90deg, transparent, {service.accent}, transparent);"
					></div>

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

					<!-- Subtle top-corner glow on mobile -->
					<div
						class="absolute -top-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-30 md:opacity-0 pointer-events-none"
						style="background: {service.accentGlow};"
					></div>

					<div
						class="card-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
					></div>

					<div
						class="absolute inset-0 rounded-2xl border border-transparent {service.border} transition-colors duration-500"
					></div>

					<div
						class="relative z-10 h-full p-5 sm:p-6 lg:p-8 flex flex-col justify-between min-h-auto md:min-h-[300px] transition-transform duration-500 group-hover:scale-[1.01]"
					>
						<div>
							<!-- Icon + title inline on mobile, stacked on desktop -->
							<div class="flex items-start gap-3 md:block mb-2.5 sm:mb-3">
								<div
									class="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0 rounded-xl flex items-center justify-center text-lg sm:text-xl md:text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg md:mb-5"
									style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
								>
									{service.icon}
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center justify-between md:hidden">
										<h3
											class="font-syne text-lg font-bold tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300"
											style="color: var(--text-heading);"
										>
											{service.title}
										</h3>
									</div>
									<!-- Desktop-only title (hidden on mobile since it's shown inline above) -->
									<h3
										class="font-syne hidden md:block text-lg lg:text-xl font-bold mb-2.5 sm:mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300"
										style="color: var(--text-heading);"
									>
										{service.title}
									</h3>
								</div>
							</div>

							<p
								class="text-[13px] sm:text-sm font-light leading-relaxed mb-5 sm:mb-5 pl-3 sm:pl-4 transition-colors duration-500"
								style="color: var(--text-secondary); border-left: 2px solid {service.accent}40;"
							>
								{service.description}
							</p>
						</div>

						<Marquee gap={6} speed="fast" className="-mx-5 px-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
							{#each service.features as feature}
								<span
									class="flex-shrink-0 px-3 py-1.5 text-[10px] sm:text-[11px] font-medium rounded-full whitespace-nowrap transition-all duration-300"
									style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-primary);"
								>
									{feature}
								</span>
							{/each}
							{#each service.features as feature}
								<span
									class="flex-shrink-0 px-3 py-1.5 text-[10px] sm:text-[11px] font-medium rounded-full whitespace-nowrap transition-all duration-300"
									style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-primary);"
								>
									{feature}
								</span>
							{/each}
						</Marquee>
					</div>
				</article>
			{/each}
		</div>

		<!-- Mobile scroll indicators: hidden (cards now stack vertically) -->

		<div class="flex flex-col gap-10 lg:gap-12">
			<div class="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
				{#each benefits as benefit}
					<div
						class="rounded-lg sm:rounded-xl p-3 sm:p-5 flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2.5 transition-all duration-300 group hover:scale-[1.03] hover:shadow-sm"
						style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
					>
						<span
							class="text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-300"
							>{benefit.icon}</span
						>
						<span
							class="text-[11px] sm:text-xs font-medium transition-colors leading-tight"
							style="color: var(--text-secondary);">{benefit.title}</span
						>
					</div>
				{/each}
			</div>

			<div
				class="relative group rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-blue-500/10"
				style="border: 1px solid var(--glass-border); background: var(--bg-surface);"
			>
				<div
					class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700"
				></div>

				<div
					class="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-colors duration-700 pointer-events-none"
				></div>
				<div
					class="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"
				></div>

				<div
					class="relative h-full p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 isolate"
				>
					<div
						class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none mix-blend-overlay"
					></div>

					<div class="relative z-10 w-full md:max-w-2xl text-center md:text-left space-y-5">
						<div
							class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
						>
							<span
								class="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"
							></span>
							{m['services.pricingCard.badge']()}
						</div>

						<h3
							class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
							style="color: var(--text-heading);"
						>
							{m['services.pricingCard.title']()}
						</h3>

						<p
							class="text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-xl mx-auto md:mx-0"
							style="color: var(--text-secondary);"
						>
							{m['services.pricingCard.description']()}
						</p>
					</div>

					<Button
						href={localizeHref('/pricing')}
						variant="inverted"
						className="relative z-10 flex-shrink-0 !text-base sm:!text-lg !px-8 !py-4 sm:!px-10 sm:!py-5 transition-all duration-300 hover:scale-105 group/btn border border-white/10"
					>
						<span class="flex items-center gap-3">
							<span>{m['pricing.navTitle']()}</span>
							<svg
								class="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</span>
					</Button>
				</div>
			</div>
		</div>

		<div class="mt-16 md:mt-24 pt-8 border-t" style="border-color: var(--border-primary);">
			<div
				class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-5xl mx-auto"
			>
				<div class="text-center md:text-left self-center">
					<h2
						class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3"
						style="color: var(--text-heading);"
					>
						{m['services.finalCta.headline']()}
					</h2>
					<p class="text-base sm:text-lg font-light" style="color: var(--text-secondary);">
						{m['services.finalCta.subline']()}
					</p>
					<p class="text-xs mt-2 opacity-60" style="color: var(--text-tertiary);">
						{m['services.ctaSubtext']()}
					</p>
				</div>
				<Button
					href={localizeHref('/contact')}
					className="group cta-magnetic flex-shrink-0 inline-flex items-center justify-center gap-3 !px-8 !py-5 sm:!px-10 sm:!py-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 !text-lg"
					style="background: var(--bg-surface); border-color: var(--border-primary); color: var(--text-heading);"
				>
					<span class="font-medium">{m['services.cta']()}</span>
					<svg
						class="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Button>
			</div>
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

	@media (max-width: 767px) {
		.bento-item {
			box-shadow:
				0 4px 24px -4px rgba(0, 0, 0, 0.08),
				0 1px 4px rgba(0, 0, 0, 0.04);
		}
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

	/* ═══════════════════════════════════════════════
	   Process Step Card — base transitions
	   ═══════════════════════════════════════════════ */
	.process-step-card {
		transition:
			border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			background 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.process-step-number {
		transition:
			background 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.process-step-title {
		transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.process-step-desc {
		transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* ═══════════════════════════════════════════════
	   HOVERED step — glowing blue border, elevated
	   ═══════════════════════════════════════════════ */
	.step-active {
		border-color: rgb(59 130 246 / 0.5) !important;
		box-shadow:
			0 0 20px rgb(59 130 246 / 0.1),
			inset 0 1px 0 rgb(255 255 255 / 0.05);
	}

	.step-number-active {
		background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
		color: white !important;
		border-color: transparent !important;
		box-shadow: 0 0 14px rgb(59 130 246 / 0.35);
		transform: scale(1.08);
	}

	.step-title-active {
		color: #60a5fa !important;
	}

	/* ═══════════════════════════════════════════════
	   Connector: animated fill line + pulsing chevron
	   ═══════════════════════════════════════════════ */
	.connector-fill {
		width: 0%;
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		height: 100%;
		transition: width 0.01s;
		border-radius: inherit;
	}

	.connector-fill.connector-active {
		width: 100%;
		transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 0 8px rgb(59 130 246 / 0.4);
	}

	.connector-chevron {
		transition:
			color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.connector-chevron.chevron-active {
		color: #60a5fa !important;
		animation: chevron-pulse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		filter: drop-shadow(0 0 4px rgb(59 130 246 / 0.5));
	}

	@keyframes chevron-pulse {
		0%,
		100% {
			transform: translateX(0px);
			opacity: 1;
		}
		50% {
			transform: translateX(3px);
			opacity: 0.7;
		}
	}

	/* ═══════════════════════════════════════════════
	   NEXT STEP (n+1) — full illumination
	   ═══════════════════════════════════════════════ */
	.step-next-lit {
		border-color: rgb(59 130 246 / 0.35) !important;
		background: linear-gradient(
			135deg,
			rgb(59 130 246 / 0.08),
			rgb(139 92 246 / 0.06),
			transparent
		) !important;
		box-shadow:
			0 0 30px rgb(59 130 246 / 0.12),
			0 0 60px rgb(139 92 246 / 0.06),
			inset 0 1px 0 rgb(255 255 255 / 0.06);
		transform: scale(1.02);
		animation: next-step-glow 2s ease-in-out infinite;
	}

	@keyframes next-step-glow {
		0%,
		100% {
			box-shadow:
				0 0 30px rgb(59 130 246 / 0.12),
				0 0 60px rgb(139 92 246 / 0.06),
				inset 0 1px 0 rgb(255 255 255 / 0.06);
		}
		50% {
			box-shadow:
				0 0 35px rgb(59 130 246 / 0.18),
				0 0 70px rgb(139 92 246 / 0.1),
				inset 0 1px 0 rgb(255 255 255 / 0.08);
		}
	}

	.step-number-next {
		background: linear-gradient(135deg, rgb(59 130 246 / 0.8), rgb(168 85 247 / 0.8)) !important;
		color: white !important;
		border-color: transparent !important;
		box-shadow:
			0 0 16px rgb(59 130 246 / 0.35),
			0 0 32px rgb(139 92 246 / 0.15);
		transform: scale(1.1);
	}

	.step-title-next {
		color: #93c5fd !important;
	}

	.step-desc-next {
		color: var(--text-secondary) !important;
	}

	/* ═══════════════════════════════════════════════
	   Reduced motion
	   ═══════════════════════════════════════════════ */
	@media (prefers-reduced-motion: reduce) {
		.connector-fill.connector-active {
			transition: width 0.01s;
		}
		.connector-chevron.chevron-active {
			animation: none;
		}
		.step-next-lit {
			animation: none;
			transform: none;
		}
		.step-number-active,
		.step-number-next {
			transform: none;
		}
		.step-active {
			transform: none;
		}
	}

	@media (max-width: 767px) {
		.process-step-item:last-child {
			padding-right: 1rem;
		}
	}

	/* ═══════════════════════════════════════════════
	   Feature chip interactions
	   ═══════════════════════════════════════════════ */
	.all-in-one-feature-chip {
		transition:
			border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.all-in-one-feature-chip:hover {
		border-color: var(--border-accent) !important;
		box-shadow: 0 0 14px var(--blue-glow);
		transform: translateY(-1px);
	}

	.all-in-one-feature-chip:active {
		transform: scale(0.96);
		box-shadow: none;
	}

	/* ═══════════════════════════════════════════════
	   Focus-visible ring for keyboard nav
	   ═══════════════════════════════════════════════ */
	.process-step-item:focus-visible .process-step-card {
		outline: 2px solid var(--border-accent);
		outline-offset: 2px;
	}

	/* Reduced motion: disable chip animations */
	@media (prefers-reduced-motion: reduce) {
		.all-in-one-feature-chip:hover {
			transform: none;
		}
		.all-in-one-feature-chip:active {
			transform: none;
		}
	}
</style>
