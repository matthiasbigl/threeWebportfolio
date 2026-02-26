<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import Button from './Button.svelte';
	import HorizontalScrollSection from './HorizontalScrollSection.svelte';
	import {
		Globe,
		ShoppingCart,
		TrendingUp,
		Sparkles,
		Shield,
		Handshake,
		MapPin,
		Banknote,
		Zap,
		Target,
		Star,
		Wrench,
		Check
	} from 'lucide-svelte';

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
			icon: Globe,
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
			icon: ShoppingCart,
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
			icon: TrendingUp,
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
			icon: Sparkles,
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
	let ctaMagnetic = $state<HTMLElement>();

	async function handleCtaMouseEnter() {
		if (!ctaMagnetic) return;
		const { gsap } = await import('gsap');
		gsap.to(ctaMagnetic, { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' });
	}

	async function handleCtaMouseLeave() {
		if (!ctaMagnetic) return;
		const { gsap } = await import('gsap');
		gsap.to(ctaMagnetic, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
	}

	async function handleCtaMouseMove(e: MouseEvent) {
		if (!ctaMagnetic) return;
		const { gsap } = await import('gsap');
		const rect = ctaMagnetic.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;
		gsap.to(ctaMagnetic, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
	}

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
	style="background: var(--bg-inset); border-top: 1px solid var(--border-secondary); border-bottom: 1px solid var(--border-secondary);"
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
							class="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg mt-0.5"
							style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
						>
							<Wrench class="w-5 h-5 sm:w-6 sm:h-6" style="color: var(--text-secondary);" />
						</div>
						<div class="flex-1 min-w-0">
							<h3
								class="font-syne text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-0.5"
								style="color: var(--text-heading);"
							>
								{m['services.allInOne.title']()}
							</h3>
							<p class="text-sm sm:text-base font-light" style="color: var(--text-secondary);">
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
								<Check class="w-3 h-3 text-blue-400 flex-shrink-0" />
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
	</div>
</section>

{#snippet servicesIntroSlide()}
	<div class="flex items-center gap-3 mb-4 md:mb-6">
		<div class="h-px w-10 md:w-12 bg-gradient-to-r from-blue-500 to-purple-500"></div>
		<span class="text-blue-500 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
			{m['services.scrollSectionLabel']()}
		</span>
	</div>
	<h2
		class="font-syne text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1]"
		style="color: var(--text-heading);"
	>
		{m['services.scrollSectionHeadline']()}
	</h2>
	<div class="flex items-center gap-4">
		<div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
		<span class="animate-bounce-x" style="color: var(--text-tertiary);">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 8l4 4m0 0l-4 4m4-4H3"
				/>
			</svg>
		</span>
	</div>
{/snippet}

{#snippet servicesCards()}
	{#each services as service, i}
		{@const accentConfigs = [
			{
				gradient: 'from-blue-500 to-cyan-400',
				bg: 'from-blue-500/8 to-cyan-500/8',
				border: 'border-blue-500/15',
				dot: 'bg-blue-500'
			},
			{
				gradient: 'from-purple-500 to-pink-400',
				bg: 'from-purple-500/8 to-pink-500/8',
				border: 'border-purple-500/15',
				dot: 'bg-purple-500'
			},
			{
				gradient: 'from-orange-500 to-amber-400',
				bg: 'from-orange-500/8 to-amber-500/8',
				border: 'border-orange-500/15',
				dot: 'bg-orange-500'
			},
			{
				gradient: 'from-emerald-500 to-teal-400',
				bg: 'from-emerald-500/8 to-teal-500/8',
				border: 'border-emerald-500/15',
				dot: 'bg-emerald-500'
			}
		]}
		{@const accentCfg = accentConfigs[i % accentConfigs.length]}
		{@const IconComponent = service.icon}

		<div
			class="services-cards-horizontal-card w-[82vw] sm:w-[75vw] md:w-[55vw] lg:w-[45vw] max-w-[560px] shrink-0 h-[65dvh] md:h-[70dvh] flex items-center relative group"
		>
			<div
				class="hscroll-card w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between isolate border {accentCfg.border}"
			>
				<!-- Top accent bar -->
				<div
					class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r {accentCfg.gradient} rounded-full"
				></div>

				<!-- Gradient wash -->
				<div class="absolute inset-0 bg-gradient-to-br {accentCfg.bg} -z-10"></div>

				<!-- Big background number -->
				<div
					class="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden"
				>
					<span
						class="services-cards-bg-number font-syne font-black text-[14rem] sm:text-[18rem] md:text-[22rem] leading-none select-none"
						style="color: var(--text-heading); opacity: 0.07;"
					>
						0{i + 1}
					</span>
				</div>

				<!-- Top row: icon badge + line -->
				<div class="flex items-center gap-3 md:gap-4 p-6 sm:p-8 md:p-10 lg:p-14 pb-0">
					<div
						class="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center"
						style="background: var(--bg-inset); border: 1px solid var(--border-primary);"
					>
						<IconComponent class="w-5 h-5 md:w-6 md:h-6" style="color: var(--text-secondary);" />
					</div>
					<div class="h-px flex-1 bg-gradient-to-r {accentCfg.gradient} opacity-20"></div>
				</div>

				<!-- Bottom: title + desc + features -->
				<div
					class="relative z-10 p-6 sm:p-8 md:p-10 lg:p-14 pt-4 flex flex-col gap-4 flex-1 justify-end"
				>
					<div>
						<h3
							class="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-tight leading-[1.2]"
							style="color: var(--text-heading);"
						>
							{service.title}
						</h3>
						<p
							class="text-sm sm:text-base font-light leading-relaxed pl-3 sm:pl-4"
							style="color: var(--text-secondary); border-left: 2px solid {service.accent}60;"
						>
							{service.description}
						</p>
					</div>

					<!-- Feature chips — single row, horizontally scrollable -->
					<div class="chips-wrapper">
						<div class="flex gap-2 overflow-x-auto pb-1 chips-row">
							{#each service.features as feature}
								<span
									class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] shrink-0"
									style="background: {service.accent}18; color: {service.accent}; border: 1px solid {service.accent}30;"
								>
									{feature}
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
{/snippet}

{#snippet servicesPricingCta()}
	<div
		class="services-cards-horizontal-card w-[82vw] sm:w-[70vw] md:w-[50vw] lg:w-[42vw] max-w-[520px] shrink-0 h-[65dvh] md:h-[70dvh] flex items-center"
	>
		<div
			class="hscroll-card w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between isolate border"
			style="border-color: var(--glass-border);"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/5 to-transparent -z-10"
			></div>
			<div
				class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-purple-500"
			></div>

			<div class="p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col h-full justify-between">
				<div>
					<div
						class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6"
						style="background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2);"
					>
						<span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
						{m['services.pricingCard.badge']()}
					</div>
					<h3
						class="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-[1.2]"
						style="color: var(--text-heading);"
					>
						{m['services.pricingCard.title']()}
					</h3>
					<p
						class="text-sm sm:text-base font-light leading-relaxed"
						style="color: var(--text-secondary);"
					>
						{m['services.pricingCard.description']()}
					</p>
				</div>

				<Button
					href={localizeHref('/pricing')}
					variant="inverted"
					className="w-full !text-sm sm:!text-base !px-6 !py-4 transition-all duration-300 hover:scale-[1.02]"
				>
					<span class="flex items-center justify-center gap-3">
						<span>{m['pricing.navTitle']()}</span>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
{/snippet}

<HorizontalScrollSection
	id="services-cards"
	watermark="SERVICES"
	introSlide={servicesIntroSlide}
	cards={servicesCards}
	trailingSlide={servicesPricingCta}
/>

<section
	id="services-cta"
	class="relative pt-16 lg:pt-24 pb-12 lg:pb-20 overflow-hidden"
	style="background: var(--bg-body);"
>
	<div class="container mx-auto px-4 sm:px-6 relative z-10">
		<div class="pt-8 border-t" style="border-color: var(--border-primary);">
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
				<div
					bind:this={ctaMagnetic}
					onmouseenter={handleCtaMouseEnter}
					onmouseleave={handleCtaMouseLeave}
					onmousemove={handleCtaMouseMove}
				>
					<Button
						href={localizeHref('/contact')}
						className="group flex-shrink-0 inline-flex items-center justify-center gap-3 !px-8 !py-5 sm:!px-10 sm:!py-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 !text-lg"
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
	</div>
</section>

<style>
	/* Hide scrollbar on chip rows — still scrollable via touch/mouse */
	.chips-row {
		scrollbar-width: none;
		mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 2rem,
			black calc(100% - 2rem),
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 2rem,
			black calc(100% - 2rem),
			transparent 100%
		);
	}
	.chips-row::-webkit-scrollbar {
		display: none;
	}

	/* Wrapper only needs relative positioning for any future use */
	.chips-wrapper {
		position: relative;
	}

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
