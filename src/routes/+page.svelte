<script lang="ts">
	import PhotoAvatar from '$lib/components/PhotoAvatar.svelte';
	import ParticleNetwork from '$lib/components/ParticleNetwork.svelte';
	import Card from '$lib/components/Card.svelte';
	import Services from '$lib/components/Services.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { projects } from '$lib/data/projects';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { reducedMotion } from '$lib/stores/reducedMotion';

	// Helper for dynamic project message keys
	const pm = m as unknown as Record<string, () => string>;
	const projectMsg = (slug: string, field: string) =>
		pm[`projects.items.${slug}.${field}`]?.() ?? '';

	const heroServices = $derived([
		{
			id: 'websites',
			icon: '🌐',
			title: m['heroNew.services.websites.title'](),
			tagline: m['heroNew.services.websites.tagline'](),
			hover: m['heroNew.services.websites.hover'](),
			gradient: 'from-blue-500/20 to-blue-600/10'
		},
		{
			id: 'webshops',
			icon: '🛒',
			title: m['heroNew.services.webshops.title'](),
			tagline: m['heroNew.services.webshops.tagline'](),
			hover: m['heroNew.services.webshops.hover'](),
			gradient: 'from-purple-500/20 to-purple-600/10'
		},
		{
			id: 'custom',
			icon: '✨',
			title: m['heroNew.services.custom.title'](),
			tagline: m['heroNew.services.custom.tagline'](),
			hover: m['heroNew.services.custom.hover'](),
			gradient: 'from-emerald-500/20 to-emerald-600/10'
		},
		{
			id: 'seo',
			icon: '📈',
			title: m['heroNew.services.seo.title'](),
			tagline: m['heroNew.services.seo.tagline'](),
			hover: m['heroNew.services.seo.hover'](),
			gradient: 'from-orange-500/20 to-orange-600/10'
		},
		{
			id: 'hosting',
			icon: '🛡️',
			title: m['heroNew.services.hosting.title'](),
			tagline: m['heroNew.services.hosting.tagline'](),
			hover: m['heroNew.services.hosting.hover'](),
			gradient: 'from-cyan-500/20 to-cyan-600/10'
		}
	]);

	const aboutDifferentiators = $derived([
		{
			id: 'partner',
			icon: '🤝',
			title: m['aboutCompact.differentiators.partner.title'](),
			desc: m['aboutCompact.differentiators.partner.desc'](),
			gradient: 'from-blue-500/10 via-blue-600/5 to-cyan-500/10'
		},
		{
			id: 'local',
			icon: '📍',
			title: m['aboutCompact.differentiators.local.title'](),
			desc: m['aboutCompact.differentiators.local.desc'](),
			gradient: 'from-purple-500/10 via-pink-500/5 to-purple-600/10'
		},
		{
			id: 'direct',
			icon: '⚡',
			title: m['aboutCompact.differentiators.direct.title'](),
			desc: m['aboutCompact.differentiators.direct.desc'](),
			gradient: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10'
		}
	]);

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

					// Project rows — staggered slide-in from alternating sides
					const projectList = document.querySelector('.project-list');
					if (projectList) {
						const rows = projectList.querySelectorAll('.project-row-item');
						rows.forEach((row, i) => {
							const fromLeft = i % 2 === 0;
							gsap.fromTo(
								row,
								{
									opacity: 0,
									x: fromLeft ? -80 : 80,
									rotateY: fromLeft ? -4 : 4
								},
								{
									opacity: 1,
									x: 0,
									rotateY: 0,
									duration: 0.7,
									ease: 'power3.out',
									scrollTrigger: {
										trigger: row,
										start: 'top 88%'
									}
								}
							);
						});

						// External CTA links — fade in after project rows
						const ctaLinks = document.querySelectorAll('.external-cta');
						gsap.fromTo(
							ctaLinks,
							{ opacity: 0, y: 20 },
							{
								opacity: 1,
								y: 0,
								duration: 0.5,
								stagger: 0.1,
								ease: 'power2.out',
								scrollTrigger: {
									trigger: ctaLinks[0],
									start: 'top 90%'
								}
							}
						);
					}

					const aboutSection = document.querySelector('.about-section');
					if (aboutSection) {
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
									trigger: aboutSection,
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
									trigger: aboutSection,
									start: 'top 70%'
								}
							}
						);
					}

					const pills = document.querySelectorAll('.service-pill');
					pills.forEach((pill: any) => {
						pill.addEventListener('mousemove', (e: MouseEvent) => {
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
						});

						pill.addEventListener('mouseleave', () => {
							gsap.to(pill, {
								rotationX: 0,
								rotationY: 0,
								duration: 0.5,
								ease: 'elastic.out(1, 0.5)'
							});
						});
					});
				}

				if (isMobile) {
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
							class="hero-headline-1 text-sm sm:text-base font-semibold uppercase tracking-[0.2em] mb-4 sm:mb-5"
							style="color: var(--text-tertiary);"
						>
							{m['heroNew.headline1']()}
						</p>

						<!-- Main headline — Poppins, solid color, accent on key words -->
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
							<div
								class="service-pill group relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 sm:hover:translate-y-[-2px]"
								style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); transform-style: preserve-3d;"
							>
								<div class="service-pill-shimmer"></div>
								<div class="service-pill-glow"></div>
								<span
									class="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300"
								>
									{service.icon}
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

	<section class="services-wrapper reveal-section glass-section relative gradient-bg-1">
		<Services />
	</section>

	<section
		id="about"
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
								<div
									class="about-pill inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
									style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
								>
									<div class="about-pill-glow"></div>
									<span class="text-base">{diff.icon}</span>
									<span class="text-sm font-medium" style="color: var(--text-secondary);"
										>{diff.title}</span
									>
								</div>
							{/each}
						</div>

						<div class="flex items-center gap-6">
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

		<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-14 lg:mb-20">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]"
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

			<!-- Project rows — editorial list layout -->
			<div class="project-list max-w-4xl mx-auto flex flex-col gap-2 sm:gap-3">
				{#each projects.filter((p) => !p.isExternal) as project, i}
					<Card
						tag="article"
						title={projectMsg(project.slug, 'title')}
						description={projectMsg(project.slug, 'description')}
						image={project.image}
						imageObjectFit="cover"
						imageAlt={m['a11y.projectImageAlt']({ project: projectMsg(project.slug, 'title') })}
						link={project.isExternal ? project.link : localizeHref(`/projects/${project.slug}`)}
						target={project.isExternal ? '_blank' : ''}
						rel={project.isExternal ? 'noopener noreferrer' : ''}
						color={project.color}
						year={project.year}
						category={project.category}
					/>
				{/each}
			</div>

			<!-- External links CTA row -->
			<div class="max-w-4xl mx-auto mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
				{#each projects.filter((p) => p.isExternal) as project}
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						class="external-cta group flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl flex-1 transition-all duration-300"
						style="--cta-accent: {project.color};"
					>
						<!-- Icon -->
						<div
							class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
							style="background: {project.color}15;"
						>
							{#if project.slug === 'blog'}
								<svg
									class="w-4 h-4 sm:w-5 sm:h-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke={project.color}
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							{:else}
								<svg class="w-4 h-4 sm:w-5 sm:h-5" fill={project.color} viewBox="0 0 24 24">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/>
								</svg>
							{/if}
						</div>

						<!-- Text -->
						<div class="flex-1 min-w-0">
							<span
								class="text-sm sm:text-base font-semibold block"
								style="color: var(--text-heading);"
							>
								{projectMsg(project.slug, 'title')}
							</span>
							<span class="text-[11px] sm:text-xs block" style="color: var(--text-secondary);">
								{projectMsg(project.slug, 'description')}
							</span>
						</div>

						<!-- External arrow -->
						<svg
							class="w-4 h-4 flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
							style="color: {project.color};"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>
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

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* External CTA links */
	.external-cta {
		background: var(--card-bg);
		border: 1px solid var(--glass-border);
	}

	.external-cta:hover {
		background: var(--card-bg-hover, var(--card-bg));
		border-color: var(--cta-accent);
		box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 1023px) {
		.about-avatar-container,
		.about-diff-card {
			transform-style: flat;
		}
	}
</style>
