<script lang="ts">
	import PhotoAvatar from '$lib/components/PhotoAvatar.svelte';
	import ParticleNetwork from '$lib/components/ParticleNetwork.svelte';
	import Card from '$lib/components/Card.svelte';
	import ProjectRow from '$lib/components/ProjectRow.svelte';
	import Services from '$lib/components/Services.svelte';
	import VibeSection from '$lib/components/VibeSection.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import Button from '$lib/components/Button.svelte';
	import Marquee from '$lib/components/Marquee.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { projects } from '$lib/data/projects';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import {
		Globe,
		ShoppingCart,
		Sparkles,
		TrendingUp,
		Shield,
		Handshake,
		MapPin,
		Zap
	} from 'lucide-svelte';

	// Helper for dynamic project message keys
	const pm = m as unknown as Record<string, () => string>;
	const projectMsg = (slug: string, field: string) =>
		pm[`projects.items.${slug}.${field}`]?.() ?? '';

	const heroServices = $derived([
		{
			id: 'websites',
			icon: Globe,
			title: m['heroNew.services.websites.title'](),
			tagline: m['heroNew.services.websites.tagline'](),
			hover: m['heroNew.services.websites.hover'](),
			gradient: 'from-blue-500/20 to-blue-600/10'
		},
		{
			id: 'webshops',
			icon: ShoppingCart,
			title: m['heroNew.services.webshops.title'](),
			tagline: m['heroNew.services.webshops.tagline'](),
			hover: m['heroNew.services.webshops.hover'](),
			gradient: 'from-purple-500/20 to-purple-600/10'
		},
		{
			id: 'custom',
			icon: Sparkles,
			title: m['heroNew.services.custom.title'](),
			tagline: m['heroNew.services.custom.tagline'](),
			hover: m['heroNew.services.custom.hover'](),
			gradient: 'from-emerald-500/20 to-emerald-600/10'
		},
		{
			id: 'seo',
			icon: TrendingUp,
			title: m['heroNew.services.seo.title'](),
			tagline: m['heroNew.services.seo.tagline'](),
			hover: m['heroNew.services.seo.hover'](),
			gradient: 'from-orange-500/20 to-orange-600/10'
		},
		{
			id: 'hosting',
			icon: Shield,
			title: m['heroNew.services.hosting.title'](),
			tagline: m['heroNew.services.hosting.tagline'](),
			hover: m['heroNew.services.hosting.hover'](),
			gradient: 'from-cyan-500/20 to-cyan-600/10'
		}
	]);

	const aboutDifferentiators = $derived([
		{
			id: 'partner',
			icon: Handshake,
			title: m['aboutCompact.differentiators.partner.title'](),
			desc: m['aboutCompact.differentiators.partner.desc'](),
			gradient: 'from-blue-500/10 via-blue-600/5 to-cyan-500/10'
		},
		{
			id: 'local',
			icon: MapPin,
			title: m['aboutCompact.differentiators.local.title'](),
			desc: m['aboutCompact.differentiators.local.desc'](),
			gradient: 'from-purple-500/10 via-pink-500/5 to-purple-600/10'
		},
		{
			id: 'direct',
			icon: Zap,
			title: m['aboutCompact.differentiators.direct.title'](),
			desc: m['aboutCompact.differentiators.direct.desc'](),
			gradient: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10'
		}
	]);

	const marqueeRow1 = $derived([
		m['marquee.row1_0'](),
		m['marquee.row1_1'](),
		m['marquee.row1_2'](),
		m['marquee.row1_3'](),
		m['marquee.row1_4'](),
		m['marquee.row1_5'](),
		m['marquee.row1_6'](),
		m['marquee.row1_7'](),
		m['marquee.row1_8'](),
		m['marquee.row1_9'](),
		m['marquee.row1_10'](),
		m['marquee.row1_11']()
	]);

	const marqueeRow2 = $derived([
		m['marquee.row2_0'](),
		m['marquee.row2_1'](),
		m['marquee.row2_2'](),
		m['marquee.row2_3'](),
		m['marquee.row2_4'](),
		m['marquee.row2_5'](),
		m['marquee.row2_6'](),
		m['marquee.row2_7'](),
		m['marquee.row2_8'](),
		m['marquee.row2_9'](),
		m['marquee.row2_10'](),
		m['marquee.row2_11']()
	]);

	let heroBgTextEl = $state<HTMLElement | undefined>(undefined);
	let projectListEl = $state<HTMLElement | undefined>(undefined);
	let aboutSectionEl = $state<HTMLElement | undefined>(undefined);

	async function handlePillMouseMove(e: MouseEvent) {
		const { gsap } = await import('gsap');
		const pill = e.currentTarget as HTMLElement;
		if (!pill) return;
		const rect = pill.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const rotateX = ((y - centerY) / centerY) * -8;
		const rotateY = ((x - centerX) / centerX) * 8;
		gsap.to(pill, {
			rotationX: rotateX,
			rotationY: rotateY,
			duration: 0.3,
			ease: 'power2.out',
			transformPerspective: 800
		});
	}

	async function handlePillMouseLeave(e: MouseEvent) {
		const { gsap } = await import('gsap');
		const pill = e.currentTarget as HTMLElement;
		gsap.to(pill, {
			rotationX: 0,
			rotationY: 0,
			duration: 0.5,
			ease: 'elastic.out(1, 0.5)'
		});
	}

	onMount(async () => {
		if (!browser) return;

		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const mm = gsap.matchMedia();

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
					// Hero watermark parallax — drifts left on scroll
					if (heroBgTextEl) {
						gsap.fromTo(
							heroBgTextEl,
							{ xPercent: 15 },
							{
								xPercent: -40,
								ease: 'none',
								force3D: true,
								scrollTrigger: {
									trigger: '#hero',
									start: 'top bottom',
									end: 'bottom top',
									scrub: 1.5
								}
							}
						);
					}

					// Accent line grows in
					gsap.fromTo(
						'.hero-accent-line',
						{ scaleY: 0, transformOrigin: 'top center' },
						{ scaleY: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
					);

					gsap.fromTo(
						'.hero-headline-1',
						{ opacity: 0, x: -20 },
						{ opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 }
					);

					gsap.fromTo(
						'.hero-headline-2',
						{ opacity: 0, y: 40 },
						{
							opacity: 1,
							y: 0,
							duration: 1,
							ease: 'power3.out',
							delay: 0.5
						}
					);

					gsap.fromTo(
						'.hero-subheadline',
						{ opacity: 0, y: 20 },
						{ opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.9 }
					);

					gsap.fromTo(
						'.service-pill',
						{ opacity: 0, y: 20, scale: 0.95 },
						{
							opacity: 1,
							y: 0,
							scale: 1,
							duration: 0.5,
							stagger: 0.06,
							ease: 'power2.out',
							delay: 1.1
						}
					);

					gsap.fromTo(
						'.hero-cta',
						{ opacity: 0, y: 20 },
						{ opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 1.5 }
					);

					gsap.utils.toArray('.reveal-section').forEach((section: any) => {
						gsap.fromTo(
							section.querySelector('.section-title'),
							{ opacity: 0, y: 60 },
							{
								opacity: 1,
								y: 0,
								duration: 1,
								ease: 'power2.out',
								scrollTrigger: {
									trigger: section,
									start: 'top 80%'
								}
							}
						);
					});

					gsap.utils.toArray('.stagger-cards').forEach((container: any) => {
						const cards = container.querySelectorAll('.stagger-item');
						gsap.fromTo(
							cards,
							{ opacity: 0, y: 60, scale: 0.8 },
							{
								opacity: 1,
								y: 0,
								scale: 1,
								duration: 0.8,
								ease: 'back.out(1.7)',
								stagger: 0.1,
								scrollTrigger: {
									trigger: container,
									start: 'top 85%'
								}
							}
						);
					});

					// Project rows — direct slide-up for bold typography
					if (projectListEl) {
						const rows = projectListEl.querySelectorAll('.project-row-item');
						rows.forEach((row, i) => {
							gsap.fromTo(
								row,
								{
									opacity: 0,
									y: 40
								},
								{
									opacity: 1,
									y: 0,
									duration: 0.6,
									ease: 'power3.out',
									scrollTrigger: {
										trigger: row,
										start: 'top 90%'
									}
								}
							);
						});
					}

					if (aboutSectionEl) {
						gsap.fromTo(
							'.about-avatar-wrap',
							{
								opacity: 0,
								scale: 0.85,
								rotateY: -15
							},
							{
								opacity: 1,
								scale: 1,
								rotateY: 0,
								duration: 1.2,
								ease: 'power3.out',
								scrollTrigger: {
									trigger: aboutSectionEl,
									start: 'top 80%'
								}
							}
						);

						gsap.fromTo(
							'.about-pill',
							{
								opacity: 0,
								y: 20,
								scale: 0.9
							},
							{
								opacity: 1,
								y: 0,
								scale: 1,
								duration: 0.6,
								stagger: 0.08,
								ease: 'back.out(1.4)',
								scrollTrigger: {
									trigger: aboutSectionEl,
									start: 'top 70%'
								}
							}
						);
					}
				}

				if (isMobile) {
					// Hero watermark parallax on mobile too (subtler)
					if (heroBgTextEl) {
						gsap.fromTo(
							heroBgTextEl,
							{ xPercent: 12 },
							{
								xPercent: -25,
								ease: 'none',
								force3D: true,
								scrollTrigger: {
									trigger: '#hero',
									start: 'top bottom',
									end: 'bottom top',
									scrub: 1.5
								}
							}
						);
					}

					gsap.fromTo(
						'.hero-headline-1',
						{ opacity: 0, y: 10 },
						{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 }
					);

					gsap.fromTo(
						'.hero-headline-2',
						{ opacity: 0, y: 15 },
						{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 }
					);

					gsap.fromTo(
						'.hero-subheadline',
						{ opacity: 0, y: 10 },
						{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.5 }
					);

					gsap.fromTo(
						'.service-pill',
						{ opacity: 0, x: -20 },
						{
							opacity: 1,
							x: 0,
							duration: 0.5,
							stagger: 0.06,
							ease: 'power2.out',
							delay: 0.6,
							overwrite: 'auto'
						}
					);

					gsap.fromTo(
						'.hero-cta',
						{ opacity: 0, y: 10 },
						{ opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 1 }
					);

					gsap.utils.toArray('.reveal-section').forEach((section: any) => {
						gsap.fromTo(
							section,
							{ opacity: 0, y: 20 },
							{
								opacity: 1,
								y: 0,
								duration: 0.8,
								scrollTrigger: { trigger: section, start: 'top 90%' }
							}
						);
					});
				}
			}
		);

		return () => {
			mm.revert();
		};
	});
</script>

<SEO
	title="Matthias Bigl | Webdesigner & Full Stack Developer Wien & Korneuburg"
	description="Matthias Bigl – Ihr Webdesigner & Full Stack Developer aus Wien/Korneuburg. Professionelle Websites, Webshops & interaktive 3D Web-Erlebnisse für KMU & Selbstständige. Keine Agentur-Preise, in 1–2 Wochen online. Jetzt kostenloses Erstgespräch!"
	url="https://bigls.net"
	type="profile"
	image="https://bigls.net/headshot.png"
	keywords={[
		'Matthias Bigl',
		'Matthias Bigl Webdesign',
		'Matthias Bigl Wien',
		'Matthias Bigl Portfolio',
		'bigls.net',
		'Webdesign Wien',
		'Webdesigner Wien',
		'Webentwicklung Wien',
		'Website erstellen lassen Wien',
		'Webshop erstellen Österreich',
		'Homepage erstellen Wien',
		'Webdesign Korneuburg',
		'Webdesign Niederösterreich',
		'Website Kosten Österreich',
		'Was kostet eine Website',
		'Webdesign günstig Wien',
		'Freelancer Webdesign Wien',
		'Webdesign ohne Agentur',
		'Website für KMU',
		'Website für Selbstständige',
		'Website für kleine Unternehmen',
		'Website für Startups Wien',
		'Full Stack Developer Wien',
		'SvelteKit Developer',
		'Three.js Developer',
		'Responsive Webdesign',
		'SEO optimierte Website',
		'moderne Website erstellen',
		'web developer Vienna',
		'freelance web developer Austria',
		'web designer Vienna Austria'
	]}
	showFaq={true}
	breadcrumbs={[{ name: 'Matthias Bigl', url: 'https://bigls.net' }]}
/>

<div class="relative pt-16 selection:bg-blue-500/20">
	<div class="fixed inset-0 z-0 opacity-[0.05] pointer-events-none grid-lines"></div>
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<section
		id="hero"
		class="relative min-h-dvh flex items-start sm:items-center overflow-hidden pb-16 pt-24 sm:pt-20 sm:pb-28"
	>
		<!-- Parallax watermark text — bottom-right, very subtle, partially clipped -->
		<div
			bind:this={heroBgTextEl}
			class="hero-bg-text absolute bottom-[-16%] right-[-15%] pointer-events-none select-none z-[1] will-change-transform"
		>
			<span
				class="font-syne font-black text-[28vw] md:text-[18vw] tracking-tighter whitespace-nowrap"
				style="color: var(--text-heading); opacity: 0.035;"
			>
				DIGITAL
			</span>
		</div>

		<!-- Background: particle network + subtle radial glow -->
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0"
				style="background: radial-gradient(ellipse 80% 60% at 30% 40%, rgba(59,130,246,0.05) 0%, transparent 70%), var(--bg-body);"
			></div>
			<ParticleNetwork count={70} connectionDistance={140} speed={0.25} mouseRadius={180} />
		</div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-6xl">
				<!-- Editorial left-aligned layout -->
				<div class="flex items-stretch gap-6 sm:gap-8 mb-10 sm:mb-14">
					<!-- Vertical accent line -->
					<div
						class="hero-accent-line hidden sm:block w-[3px] rounded-full flex-shrink-0 self-stretch"
						style="background: linear-gradient(180deg, #3b82f6 0%, #7b68ee 100%); opacity: 0.6;"
					></div>

					<div>
						<!-- Opening line -->
						<p
							class="hero-headline-1 font-syne text-sm sm:text-base font-semibold uppercase tracking-[0.2em] mb-4 sm:mb-5"
							style="color: var(--text-tertiary);"
						>
							{m['heroNew.headline1']()}
						</p>

						<!-- Main headline — Syne display font, solid color, accent on key words -->
						<h1
							class="hero-headline-2 font-poppins font-extrabold text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] mb-6 sm:mb-8 leading-[1.08] tracking-tight"
							style="color: var(--text-heading);"
						>
							{@html m['heroNew.headline2']()}
						</h1>

						<!-- Subheadline — clean, no border-left gimmick -->
						<p
							class="hero-subheadline text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed font-light"
							style="color: var(--text-secondary);"
						>
							{m['heroNew.subheadline']()}
						</p>
					</div>
				</div>

				<!-- Service pills — tight horizontal strip -->
				<div class="mb-10 sm:mb-12">
					<div class="flex flex-wrap gap-2 sm:gap-3 max-w-4xl" style="perspective: 1000px;">
						{#each heroServices as service}
							{@const IconComponent = service.icon}
							<div
								class="service-pill group relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 sm:hover:translate-y-[-2px]"
								style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); transform-style: preserve-3d;"
								role="button"
								tabindex="0"
								onmousemove={handlePillMouseMove}
								onmouseleave={handlePillMouseLeave}
							>
								<div class="service-pill-shimmer"></div>
								<div class="service-pill-glow"></div>
								<span
									class="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"
								>
									<IconComponent
										class="w-5 h-5 sm:w-6 sm:h-6"
										style="color: var(--text-secondary);"
									/>
								</span>
								<div class="flex flex-col">
									<span
										class="text-xs sm:text-sm font-semibold leading-tight"
										style="color: var(--text-heading);"
									>
										{service.title}
									</span>
									<span
										class="text-[9px] sm:text-[10px] leading-tight"
										style="color: var(--text-tertiary);"
									>
										{service.tagline}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- CTAs -->
				<div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<div class="hero-cta">
						<Button href={localizeHref('/contact')} variant="primary">
							{m['hero.cta']()}
						</Button>
					</div>
					<div class="hero-cta">
						<Button href={localizeHref('/pricing')} variant="secondary">
							{m['pricing.navTitle']()}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Trust Marquee Strip — double-row infinite scroll between hero and services -->
	<!-- <div class="trust-marquee-wrap relative overflow-hidden py-5 sm:py-6" aria-hidden="true">
		<div class="absolute inset-x-0 top-0 h-px" style="background: var(--border-primary);"></div>
		<div class="absolute inset-x-0 bottom-0 h-px" style="background: var(--border-primary);"></div>

		<div class="mb-3">
			<Marquee speed="slow" gap={24} className="trust-marquee-row">
				{#snippet children()}
					{#each [...marqueeRow1, ...marqueeRow1] as item}
						<span class="trust-marquee-item">
							<span class="trust-dot" aria-hidden="true"></span>
							{item}
						</span>
					{/each}
				{/snippet}
			</Marquee>
		</div>

		<div>
			<Marquee
				speed="fast"
				gap={24}
				direction="rtl"
				className="trust-marquee-row trust-marquee-row--rtl"
			>
				{#snippet children()}
					{#each [...marqueeRow2, ...marqueeRow2] as item}
						<span class="trust-marquee-item trust-marquee-item--alt">
							<span class="trust-dot trust-dot--alt" aria-hidden="true"></span>
							{item}
						</span>
					{/each}
				{/snippet}
			</Marquee>
		</div>
	</div> -->

	<Services />

	<VibeSection />

	<section
		id="about"
		bind:this={aboutSectionEl}
		class="about-section reveal-section relative overflow-hidden py-16 sm:py-20 lg:py-24"
		aria-labelledby="about-heading"
	>
		<div class="absolute inset-0 z-0">
			<ParticleNetwork count={50} connectionDistance={130} speed={0.18} mouseRadius={160} />
		</div>

		<div class="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12">
			<div class="max-w-6xl mx-auto">
				<div class="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
					<div class="lg:col-span-5 flex justify-center lg:justify-end">
						<div class="about-avatar-wrap relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
							<div class="absolute -inset-4 rounded-3xl opacity-40 blur-3xl avatar-glow"></div>
							<PhotoAvatar />
						</div>
					</div>

					<div class="lg:col-span-7">
						<div class="mb-3">
							<span
								class="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em]"
								style="color: var(--text-tertiary);"
							>
								<span class="w-5 h-px bg-blue-500/60"></span>
								{m['aboutCompact.title']()}
							</span>
						</div>

						<h2
							id="about-heading"
							class="section-title font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.02em] leading-[1.1] mb-6"
							style="color: var(--text-heading);"
						>
							{m['aboutCompact.name']()}
						</h2>

						<p
							class="text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-8 max-w-xl"
							style="color: var(--text-secondary);"
						>
							{m['aboutCompact.bio']()}
						</p>

						<div class="flex flex-wrap gap-3 mb-8">
							{#each aboutDifferentiators as diff}
								{@const IconComponent = diff.icon}
								<div
									class="about-pill inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
									style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
								>
									<div class="about-pill-glow"></div>
									<IconComponent
										class="w-4 h-4 flex-shrink-0"
										style="color: var(--text-secondary);"
									/>
									<span class="text-sm font-medium" style="color: var(--text-secondary);"
										>{diff.title}</span
									>
								</div>
							{/each}
						</div>

						<div class="flex flex-col sm:flex-row sm:items-center gap-6 items-start">
							<div class="flex items-center gap-2.5">
								<span class="relative flex h-2.5 w-2.5">
									<span
										class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
									></span>
									<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
								</span>
								<span class="text-sm font-medium" style="color: var(--text-secondary);">
									{m['aboutCompact.availability']()}
								</span>
							</div>

							<Button href={localizeHref('/about')} variant="primary" className="!px-6 !py-3">
								<span>{m['aboutCompact.cta']()}</span>
								<svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
		</div>
	</section>

	<section
		id="projects"
		class="projects-section reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-2 overflow-hidden"
	>
		<div class="parallax-bg parallax-bg-2"></div>

		<div class="relative mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 max-w-[100rem]">
			<div class="flex flex-col items-center mb-14 lg:mb-20">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="font-syne text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]"
						>{m['projects.title']()}</span
					>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 tracking-tight"
					style="color: var(--text-heading);"
				>
					{m['projects.titleHighlight']()}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<!-- Project rows — brutalist typography layout -->
			<div
				bind:this={projectListEl}
				class="project-list border-t border-[var(--border-primary)] flex flex-col"
			>
				{#each projects as project, i}
					<ProjectRow
						title={projectMsg(project.slug, 'title')}
						description={projectMsg(project.slug, 'description')}
						category={project.category}
						year={project.year}
						link={project.isExternal ? project.link : localizeHref(`/projects/${project.slug}`)}
						isExternal={project.isExternal}
						image={project.image}
						imageAlt={m['a11y.projectImageAlt']({ project: projectMsg(project.slug, 'title') })}
					/>
				{/each}
			</div>
		</div>
	</section>

	<section class="faq-wrapper reveal-section glass-section relative gradient-bg-2">
		<div class="parallax-bg parallax-bg-2"></div>
		<FAQ />
	</section>
</div>

<style>
	:global(.font-poppins) {
		font-family: 'Poppins', sans-serif;
	}

	.aurora-bg {
		background:
			radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
			radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%);
		filter: blur(80px);
	}

	.service-pill {
		transform-style: preserve-3d;
		will-change: transform;
	}

	/* Hero accent — underline highlight, no gradient text */
	:global(.hero-accent) {
		color: #3b82f6;
		-webkit-text-fill-color: #3b82f6;
		position: relative;
		display: inline;
		text-decoration: underline;
		text-decoration-color: rgba(59, 130, 246, 0.3);
		text-underline-offset: 0.15em;
		text-decoration-thickness: 0.06em;
	}

	/* About Section Styles */
	.about-avatar-wrap {
		transform-style: preserve-3d;
		will-change: transform;
	}

	.avatar-glow {
		background: radial-gradient(
			ellipse 60% 60%,
			rgba(59, 130, 246, 0.25) 0%,
			rgba(139, 92, 246, 0.15) 50%,
			transparent 70%
		);
	}

	.service-pill {
		transform-style: preserve-3d;
		will-change: transform;
		position: relative;
		overflow: hidden;
	}

	.service-pill-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(59, 130, 246, 0.08) 25%,
			rgba(139, 92, 246, 0.06) 50%,
			rgba(59, 130, 246, 0.08) 75%,
			transparent 100%
		);
		background-size: 200% 100%;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		border-radius: inherit;
	}

	.service-pill:hover .service-pill-shimmer {
		opacity: 1;
		animation: shimmer-slide 1.5s ease-in-out infinite;
	}

	.service-pill-glow {
		position: absolute;
		inset: -1px;
		border-radius: inherit;
		padding: 1px;
		background: linear-gradient(
			135deg,
			rgba(59, 130, 246, 0.3),
			rgba(139, 92, 246, 0.2),
			rgba(59, 130, 246, 0.3)
		);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
	}

	.service-pill:hover .service-pill-glow {
		opacity: 1;
	}

	.service-pill:hover {
		box-shadow: 0 8px 24px -8px rgba(59, 130, 246, 0.12);
	}

	@keyframes shimmer-slide {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.about-pill {
		transform-style: preserve-3d;
		will-change: transform;
		position: relative;
		overflow: hidden;
	}

	.about-pill-glow {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
	}

	.about-pill:hover .about-pill-glow {
		opacity: 1;
	}

	.about-pill:hover {
		border-color: var(--border-accent);
		box-shadow:
			0 8px 24px -8px rgba(59, 130, 246, 0.15),
			0 0 0 1px rgba(59, 130, 246, 0.1);
	}

	:global(.trust-marquee-row) {
		height: 28px;
	}

	:global(.trust-marquee-item) {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		white-space: nowrap;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-tertiary);
		transition: color 0.2s ease;
		cursor: default;
		padding: 0 4px;
	}

	:global(.trust-marquee-item:hover) {
		color: var(--text-secondary);
	}

	:global(.trust-marquee-item--alt) {
		color: var(--text-tertiary);
		opacity: 0.75;
	}

	:global(.trust-marquee-item--alt:hover) {
		opacity: 1;
		color: var(--text-secondary);
	}

	:global(.trust-dot) {
		display: inline-block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #3b82f6;
		opacity: 0.45;
		flex-shrink: 0;
	}

	:global(.trust-dot--alt) {
		background: #7b68ee;
		opacity: 0.35;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.trust-marquee-item) {
			animation: none;
		}
	}
</style>
