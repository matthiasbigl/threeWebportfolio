<script lang="ts">
	import PhotoAvatar from '$lib/components/PhotoAvatar.svelte';
	import ParticleNetwork from '$lib/components/ParticleNetwork.svelte';
	import Card from '$lib/components/Card.svelte';
	import Services from '$lib/components/Services.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import deLocale from '$lib/i18n/locales/de.json';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { projects } from '$lib/data/projects';
	import { _, locale } from 'svelte-i18n';
	import { reducedMotion } from '$lib/stores/reducedMotion';

	const heroServices = $derived([
		{
			id: 'websites',
			icon: '🌐',
			title: $_('heroNew.services.websites.title'),
			tagline: $_('heroNew.services.websites.tagline'),
			hover: $_('heroNew.services.websites.hover'),
			gradient: 'from-blue-500/20 to-blue-600/10'
		},
		{
			id: 'webshops',
			icon: '🛒',
			title: $_('heroNew.services.webshops.title'),
			tagline: $_('heroNew.services.webshops.tagline'),
			hover: $_('heroNew.services.webshops.hover'),
			gradient: 'from-purple-500/20 to-purple-600/10'
		},
		{
			id: 'custom',
			icon: '✨',
			title: $_('heroNew.services.custom.title'),
			tagline: $_('heroNew.services.custom.tagline'),
			hover: $_('heroNew.services.custom.hover'),
			gradient: 'from-emerald-500/20 to-emerald-600/10'
		},
		{
			id: 'seo',
			icon: '📈',
			title: $_('heroNew.services.seo.title'),
			tagline: $_('heroNew.services.seo.tagline'),
			hover: $_('heroNew.services.seo.hover'),
			gradient: 'from-orange-500/20 to-orange-600/10'
		},
		{
			id: 'hosting',
			icon: '🛡️',
			title: $_('heroNew.services.hosting.title'),
			tagline: $_('heroNew.services.hosting.tagline'),
			hover: $_('heroNew.services.hosting.hover'),
			gradient: 'from-cyan-500/20 to-cyan-600/10'
		},
		{
			id: 'support',
			icon: '💬',
			title: $_('heroNew.services.support.title'),
			tagline: $_('heroNew.services.support.tagline'),
			hover: $_('heroNew.services.support.hover'),
			gradient: 'from-pink-500/20 to-pink-600/10'
		}
	]);

	const aboutDifferentiators = $derived([
		{
			id: 'partner',
			icon: '🤝',
			title: $_('aboutCompact.differentiators.partner.title'),
			desc: $_('aboutCompact.differentiators.partner.desc'),
			gradient: 'from-blue-500/10 via-blue-600/5 to-cyan-500/10'
		},
		{
			id: 'local',
			icon: '📍',
			title: $_('aboutCompact.differentiators.local.title'),
			desc: $_('aboutCompact.differentiators.local.desc'),
			gradient: 'from-purple-500/10 via-pink-500/5 to-purple-600/10'
		},
		{
			id: 'direct',
			icon: '⚡',
			title: $_('aboutCompact.differentiators.direct.title'),
			desc: $_('aboutCompact.differentiators.direct.desc'),
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
	title={deLocale.seo.home.title}
	description={deLocale.seo.home.description}
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
		class="relative min-h-screen flex items-start sm:items-center overflow-hidden pb-16 pt-24 sm:pt-20 sm:pb-28"
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
							{$_('heroNew.headline1')}
						</p>

						<!-- Main headline — Poppins, solid color, accent on key words -->
						<h1
							class="hero-headline-2 font-poppins font-extrabold text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem] mb-6 sm:mb-8 leading-[1.08] tracking-tight"
							style="color: var(--text-heading);"
						>
							{@html $_('heroNew.headline2')}
						</h1>

						<!-- Subheadline — clean, no border-left gimmick -->
						<p
							class="hero-subheadline text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed font-light"
							style="color: var(--text-secondary);"
						>
							{$_('heroNew.subheadline')}
						</p>
					</div>
				</div>

				<!-- Service pills — tight horizontal strip -->
				<div class="mb-10 sm:mb-12">
					<div class="flex flex-wrap gap-2 sm:gap-3 max-w-4xl" style="perspective: 1000px;">
						{#each heroServices as service}
							<div
								class="service-pill group relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95"
								style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); transform-style: preserve-3d;"
								role="button"
								tabindex="0"
							>
								<!-- Hover gradient overlay -->
								<div
									class="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br {service.gradient} pointer-events-none"
								></div>

								<!-- Tooltip -->
								<div
									class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50"
									style="background: var(--bg-surface); border: 1px solid var(--border-primary); color: var(--text-heading); box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
								>
									{service.hover}
									<div
										class="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2 h-2 rotate-45"
										style="background: var(--bg-surface); border-right: 1px solid var(--border-primary); border-bottom: 1px solid var(--border-primary);"
									></div>
								</div>

								<span
									class="relative z-10 text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300"
								>
									{service.icon}
								</span>
								<div class="relative z-10 flex flex-col">
									<span
										class="text-xs sm:text-sm font-semibold leading-tight transition-colors duration-300"
										style="color: var(--text-heading);"
									>
										{service.title}
									</span>
									<span
										class="text-[9px] sm:text-[10px] leading-tight transition-colors duration-300"
										style="color: var(--text-tertiary);"
									>
										{service.tagline}
									</span>
								</div>

								<!-- Shine effect -->
								<div
									class="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
									style="background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%); background-size: 200% 200%; animation: shine 2s infinite;"
								></div>
							</div>
						{/each}
					</div>
				</div>

				<!-- CTAs -->
				<div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<div class="hero-cta group relative">
						<div
							class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-70 blur-lg transition-opacity duration-300"
						></div>
						<Button href="/contact" variant="primary" className="relative">
							{$_('hero.cta')}
						</Button>
					</div>
					<div class="hero-cta group relative">
						<div
							class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"
						></div>
						<Button href="/pricing" variant="secondary" className="relative">
							{$_('pricing.navTitle')}
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
								{$_('aboutCompact.title')}
							</span>
						</div>

						<h2
							id="about-heading"
							class="section-title font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.02em] leading-[1.1] mb-6"
							style="color: var(--text-heading);"
						>
							{$_('aboutCompact.name')}
						</h2>

						<p
							class="text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-8 max-w-xl"
							style="color: var(--text-secondary);"
						>
							{$_('aboutCompact.bio')}
						</p>

						<div class="flex flex-wrap gap-3 mb-8">
							{#each aboutDifferentiators as diff}
								<div
									class="about-pill group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg active:scale-95 cursor-pointer"
									style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
									role="button"
									tabindex="0"
								>
									<!-- Gradient overlay on hover -->
									<div
										class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br {diff.gradient} pointer-events-none"
									></div>

									<span class="relative z-10 text-base group-hover:scale-110 transition-transform duration-300"
										>{diff.icon}</span
									>
									<span
										class="relative z-10 text-sm font-medium transition-colors duration-300 group-hover:text-blue-500"
										style="color: var(--text-secondary);">{diff.title}</span
									>

									<!-- Pulse effect on hover -->
									<div
										class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
										style="box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"
									></div>
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
									{$_('aboutCompact.availability')}
								</span>
							</div>

							<Button href="/about" variant="primary" className="!px-6 !py-3">
								<span>{$_('aboutCompact.cta')}</span>
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
						>{$_('projects.title')}</span
					>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 tracking-tight"
					style="color: var(--text-heading);"
				>
					{$_('projects.titleHighlight')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<div class="stagger-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{#each projects as project}
					<Card
						tag="article"
						title={$_(`projects.items.${project.slug}.title`)}
						description={$_(`projects.items.${project.slug}.description`)}
						image={project.image}
						imageAlt={$_('a11y.projectImageAlt', {
							values: { project: $_(`projects.items.${project.slug}.title`) }
						})}
						link={project.isExternal ? project.link : `/projects/${project.slug}`}
						target={project.isExternal ? '_blank' : ''}
						rel={project.isExternal ? 'noopener noreferrer' : ''}
					/>
				{/each}
			</div>

			<p class="text-center mt-10 text-base sm:text-lg" style="color: var(--text-secondary);">
				{$_('projects.moreOnGithub')}
				<a
					href="https://github.com/matthiasbigl"
					target="_blank"
					rel="noopener noreferrer"
					class="blue-gradient_text hover:underline font-medium">GitHub</a
				>!
			</p>
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
		position: relative;
		overflow: visible;
	}

	.service-pill:hover {
		border-color: var(--border-accent);
	}

	@keyframes shine {
		0% {
			background-position: 200% 200%;
		}
		100% {
			background-position: -200% -200%;
		}
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

	.about-pill {
		transform-style: preserve-3d;
		will-change: transform;
		position: relative;
		overflow: visible;
	}

	.about-pill:hover {
		border-color: var(--border-accent);
		box-shadow: 0 8px 24px -8px rgba(59, 130, 246, 0.25);
	}

	@keyframes pulse-ring {
		0% {
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
		}
		100% {
			box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
		}
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 1023px) {
		.about-avatar-container,
		.about-diff-card {
			transform-style: flat;
		}
	}
</style>
