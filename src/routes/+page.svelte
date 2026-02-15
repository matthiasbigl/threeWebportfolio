<script lang="ts">
	import PhotoAvatar from '$lib/components/PhotoAvatar.svelte';
	import Cube from '$lib/components/Cube.svelte';
	import Mountains from '$lib/components/Mountains.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import Card from '$lib/components/Card.svelte';
	import Resume from '$lib/components/Resume.svelte';
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
	import dumbbellImg from '$lib/assets/dumbbell.png?enhanced';
	import surfingImg from '$lib/assets/surfing.JPG?enhanced';

	// Track scroll position for scroll indicator visibility
	let showScrollIndicator = $state(true);

	// Reactive hobbies based on locale
	const hobbies = $derived([
		{
			title: $_('hobbies.items.gym.title'),
			description: $_('hobbies.items.gym.description'),
			image: dumbbellImg,
			imageAlt: $_('hobbies.items.gym.alt')
		},
		{
			title: $_('hobbies.items.skiing.title'),
			description: $_('hobbies.items.skiing.description'),
			image: '',
			isSpecialComponent: true,
			imageAlt: $_('hobbies.items.skiing.alt')
		},
		{
			title: $_('hobbies.items.surfing.title'),
			description: $_('hobbies.items.surfing.description'),
			image: surfingImg,
			imageObjectFit: 'cover' as const,
			imageAlt: $_('hobbies.items.surfing.alt')
		}
	]);

	onMount(async () => {
		if (!browser) return;

		// Dynamically import GSAP to reduce initial chunk size
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Handle scroll indicator visibility
		const handleScroll = () => {
			showScrollIndicator = window.scrollY < 100;
		};
		window.addEventListener('scroll', handleScroll);

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
					// Hero section animations
					gsap.fromTo(
						'.hero-title',
						{ opacity: 0, y: 100, scale: 0.8 },
						{ opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)', delay: 0.3 }
					);

					gsap.fromTo(
						'.hero-description',
						{ opacity: 0, y: 50 },
						{ opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.6 }
					);

					gsap.fromTo(
						'.hero-cta',
						{ opacity: 0, y: 30 },
						{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
					);

					// Journey steps stagger
					gsap.fromTo(
						'.hero-step',
						{ opacity: 0, y: 60, scale: 0.9 },
						{
							opacity: 1,
							y: 0,
							scale: 1,
							duration: 0.8,
							ease: 'back.out(1.7)',
							stagger: 0.15,
							delay: 1.0
						}
					);

					gsap.fromTo(
						'.hero-trust',
						{ opacity: 0, y: 20 },
						{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.5 }
					);

					// Section reveal animations
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

					// Staggered card animations
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

					// Magnetic effect handles by Button component now
				}

				if (isMobile) {
					// Simpler reveals for mobile
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
			window.removeEventListener('scroll', handleScroll);
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
		// Brand dominance
		'Matthias Bigl',
		'Matthias Bigl Webdesign',
		'Matthias Bigl Wien',
		'Matthias Bigl Portfolio',
		'bigls.net',
		// Local + transactional
		'Webdesign Wien',
		'Webdesigner Wien',
		'Webentwicklung Wien',
		'Website erstellen lassen Wien',
		'Webshop erstellen Österreich',
		'Homepage erstellen Wien',
		'Webdesign Korneuburg',
		'Webdesign Niederösterreich',
		// Commercial intent
		'Website Kosten Österreich',
		'Was kostet eine Website',
		'Webdesign günstig Wien',
		'Freelancer Webdesign Wien',
		'Webdesign ohne Agentur',
		// Target audience
		'Website für KMU',
		'Website für Selbstständige',
		'Website für kleine Unternehmen',
		'Website für Startups Wien',
		// Tech/quality
		'Full Stack Developer Wien',
		'SvelteKit Developer',
		'Three.js Developer',
		'Responsive Webdesign',
		'SEO optimierte Website',
		'moderne Website erstellen',
		// English
		'web developer Vienna',
		'freelance web developer Austria',
		'web designer Vienna Austria'
	]}
	showFaq={true}
	breadcrumbs={[{ name: 'Matthias Bigl', url: 'https://bigls.net' }]}
/>

<ScrollProgress />

<div class="relative pt-16 selection:bg-blue-500/20">
	<!-- UI Layers for consistency with project pages -->
	<div class="fixed inset-0 z-0 opacity-[0.05] pointer-events-none grid-lines"></div>
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<!-- Hero Section — Value-first design -->
	<section
		id="hero"
		class="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24"
	>
		<!-- Enhanced Hero Background -->
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0"
				style="background: linear-gradient(135deg, rgba(59,130,246,0.06) 0%, var(--bg-body) 50%, rgba(139,92,246,0.06) 100%);"
			></div>

			<!-- Floating geometric shapes -->
			<div
				class="hero-floating-1 css-floating-1 absolute top-[15%] left-[10%] w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"
			></div>
			<div
				class="hero-floating-2 css-floating-2 absolute bottom-[20%] right-[15%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]"
			></div>
			<div
				class="hero-floating-3 css-floating-3 absolute top-[40%] right-[25%] w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px]"
			></div>

			<div class="absolute inset-0 opacity-[0.02] grid-lines"></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Main Value Headline -->
			<div class="text-center max-w-5xl mx-auto mb-10 sm:mb-16">
				<h1
					class="hero-title font-poppins font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 sm:mb-8 leading-[1.08] tracking-tight"
					style="color: var(--text-heading);"
				>
					{@html $_('hero.headline')}
				</h1>

				<p
					class="hero-description text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed font-light max-w-3xl mx-auto"
					style="color: var(--text-secondary);"
				>
					{@html $_('hero.description')}
				</p>

				<div
					class="hero-cta flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4 sm:px-0"
				>
					<Button href="/contact" variant="primary">
						{$_('hero.cta')}
					</Button>
					<Button href="#services" variant="secondary">
						{$_('hero.ctaServices')}
					</Button>
				</div>
			</div>

			<!-- 3-Step Journey -->
			<div class="hero-journey relative max-w-5xl mx-auto mb-12 sm:mb-16">
				<!-- Connecting line (desktop) -->
				<div class="hidden lg:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px -translate-y-1/2 z-0" aria-hidden="true">
					<div class="w-full h-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-emerald-500/30"></div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-10">
					<!-- Step 1: Idea -->
					<div
						class="hero-step group relative rounded-2xl overflow-hidden border backdrop-blur-md p-5 sm:p-7 text-center transition-all duration-500 hover:scale-[1.02]"
						style="background: var(--glass-bg); border-color: var(--glass-border);"
					>
						<div class="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] to-cyan-500/[0.03] opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
						<div class="relative z-10">
							<div
								class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
								style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
							>
								💡
							</div>
							<p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/70 mb-1">{$_('hero.steps.idea.label')}</p>
							<h3 class="font-poppins font-bold text-lg sm:text-xl mb-2 tracking-tight" style="color: var(--text-heading);">
								{$_('hero.steps.idea.title')}
							</h3>
							<p class="text-xs sm:text-sm font-light leading-relaxed" style="color: var(--text-secondary);">
								{$_('hero.steps.idea.description')}
							</p>
						</div>
					</div>

					<!-- Step 2: Build -->
					<div
						class="hero-step group relative rounded-2xl overflow-hidden border backdrop-blur-md p-5 sm:p-7 text-center transition-all duration-500 hover:scale-[1.02]"
						style="background: var(--glass-bg); border-color: var(--glass-border);"
					>
						<div class="absolute inset-0 bg-gradient-to-br from-purple-500/[0.06] to-pink-500/[0.03] opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
						<div class="relative z-10">
							<div
								class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
								style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
							>
								🛠️
							</div>
							<p class="text-xs font-bold uppercase tracking-[0.2em] text-purple-400/70 mb-1">{$_('hero.steps.build.label')}</p>
							<h3 class="font-poppins font-bold text-lg sm:text-xl mb-2 tracking-tight" style="color: var(--text-heading);">
								{$_('hero.steps.build.title')}
							</h3>
							<p class="text-xs sm:text-sm font-light leading-relaxed" style="color: var(--text-secondary);">
								{$_('hero.steps.build.description')}
							</p>
						</div>
					</div>

					<!-- Step 3: Grow -->
					<div
						class="hero-step group relative rounded-2xl overflow-hidden border backdrop-blur-md p-5 sm:p-7 text-center transition-all duration-500 hover:scale-[1.02]"
						style="background: var(--glass-bg); border-color: var(--glass-border);"
					>
						<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] to-teal-500/[0.03] opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
						<div class="relative z-10">
							<div
								class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
								style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
							>
								📈
							</div>
							<p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/70 mb-1">{$_('hero.steps.grow.label')}</p>
							<h3 class="font-poppins font-bold text-lg sm:text-xl mb-2 tracking-tight" style="color: var(--text-heading);">
								{$_('hero.steps.grow.title')}
							</h3>
							<p class="text-xs sm:text-sm font-light leading-relaxed" style="color: var(--text-secondary);">
								{$_('hero.steps.grow.description')}
							</p>
						</div>
					</div>
				</div>

			</div>

			<!-- Trust Strip — Photo + Name + Credibility -->
			<div class="hero-trust flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
				<div class="flex items-center gap-4">
					<div class="hero-avatar w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-blue-500/20 shadow-lg flex-shrink-0">
						<PhotoAvatar />
					</div>
					<div class="text-left">
						<p class="font-poppins font-semibold text-sm sm:text-base" style="color: var(--text-heading);">
							{$_('hero.trustLine')}
						</p>
						<p class="text-xs sm:text-sm font-light" style="color: var(--text-secondary);">
							{$_('hero.socialProof')}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Services Section -->
	<section class="services-wrapper reveal-section glass-section relative gradient-bg-1">
		<Services />
	</section>

	<!-- Skills Section -->
	<section
		id="skills"
		class="skills-section reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-2"
		aria-labelledby="skills-heading"
	>
		<div class="parallax-bg parallax-bg-2"></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-14 lg:mb-20">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]"
						>{$_('skills.title')}</span
					>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					id="skills-heading"
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 tracking-tight"
					style="color: var(--text-heading);"
				>
					{$_('skills.titleHighlight')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<div class="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 relative">
				<!-- Visual divider with hint between cubes (desktop only) -->
				<div
					class="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 z-10"
					aria-hidden="true"
				>
					<div
						class="w-px h-16 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
					></div>
					<p
						class="text-gray-500 text-xs whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 rounded-full backdrop-blur-sm border"
						style="background: var(--bg-inset); border-color: var(--border-secondary);"
					>
						{$_('skills.hint')}
					</p>
					<div
						class="w-px h-16 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
					></div>
				</div>

				<!-- Languages -->
				<div class="text-center">
					<h3
						id="skills-languages"
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 uppercase tracking-wider"
						style="color: var(--text-secondary);"
					>
						{$_('skills.languages')}
					</h3>
					<!-- Screen reader description for SEO -->
					<p class="sr-only">{$_('skills.languagesDescription')}</p>

					<div class="cube-container cube-glow max-w-lg mx-auto aspect-square">
						<Cube
							images={[
								'assets/python.png',
								'assets/java.png',
								'assets/svelte.png',
								'assets/typescript.png',
								'assets/kotlin.png'
							]}
							normalMaps={[
								'assets/pythonNormal.png',
								'assets/javaNormal.png',
								'assets/svelteNormal.png',
								'assets/typescriptNormal.png',
								'assets/kotlinNormal.png'
							]}
							ariaLabel={$_('skills.languagesAriaLabel')}
						/>
					</div>
					<!-- Mobile hint (shown below first cube on mobile) -->
					<p
						class="lg:hidden text-gray-500 text-xs sm:text-sm mt-4 opacity-60 hover:opacity-100 transition-opacity duration-300"
					>
						{$_('skills.hint')}
					</p>

					<!-- Skill labels -->
					<div class="mt-4 flex justify-center gap-2 flex-wrap">
						{#each $_('skills.languagesList').split(',') as skill}
							<span
								class="text-xs px-3 py-1.5 rounded-full border hover:border-blue-500/30 transition-all duration-200"
								style="background: var(--bg-surface); color: var(--text-secondary); border-color: var(--border-primary);"
								>{skill.trim()}</span
							>
						{/each}
					</div>
				</div>

				<!-- Strengths -->
				<div class="text-center">
					<h3
						id="skills-strengths"
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 uppercase tracking-wider"
						style="color: var(--text-secondary);"
					>
						{$_('skills.strengths')}
					</h3>
					<!-- Screen reader description for SEO -->
					<p class="sr-only">{$_('skills.strengthsDescription')}</p>

					<div class="cube-container cube-glow max-w-lg mx-auto aspect-square">
						<Cube
							images={[
								'assets/backend.png',
								'assets/UI.png',
								'assets/graphic.png',
								'assets/Teamwork.png',
								'assets/project.png'
							]}
							normalMaps={[
								'assets/backendNormal.png',
								'assets/UINormal.png',
								'assets/graphicNormal.png',
								'assets/TeamworkNormal.png',
								'assets/projectNormal.png'
							]}
							ariaLabel={$_('skills.strengthsAriaLabel')}
						/>
					</div>

					<!-- Skill labels -->
					<div class="mt-4 flex justify-center gap-2 flex-wrap">
						{#each $_('skills.strengthsList').split(',') as skill}
							<span
								class="text-xs px-3 py-1.5 rounded-full border hover:border-purple-500/30 transition-all duration-200"
								style="background: var(--bg-surface); color: var(--text-secondary); border-color: var(--border-primary);"
								>{skill.trim()}</span
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- Projects Section -->
	<section
		id="projects"
		class="projects-section reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-1 overflow-hidden"
	>
		<div class="parallax-bg parallax-bg-1"></div>

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

	<!-- Resume Section -->
	<section
		class="resume-section reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-2 overflow-hidden"
	>
		<div class="parallax-bg parallax-bg-2"></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-12 sm:mb-14">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]"
						>{$_('resume.title')}</span
					>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 tracking-tight"
					style="color: var(--text-heading);"
				>
					{$_('resume.titleHighlight')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<Resume />
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="faq-wrapper reveal-section glass-section relative gradient-bg-2">
		<div class="parallax-bg parallax-bg-2"></div>
		<FAQ />
	</section>
	<!-- Hobbies Section -->
	<section
		class="hobbies-section reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-1 overflow-hidden"
	>
		<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-12 sm:mb-16">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]"
						>{$_('hobbies.title')}</span
					>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 tracking-tight"
					style="color: var(--text-heading);"
				>
					{$_('hobbies.titleHighlight')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<div
				class="stagger-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
			>
				{#each hobbies as hobby}
					{#if hobby.isSpecialComponent && hobby.title === $_('hobbies.items.skiing.title')}
						<Card
							title={hobby.title}
							description={hobby.description}
							image={hobby.image}
							imageAlt={hobby.imageAlt}
							imageObjectFit={hobby.imageObjectFit || 'contain'}
						>
							<Mountains />
						</Card>
					{:else}
						<Card
							title={hobby.title}
							description={hobby.description}
							image={hobby.image}
							imageAlt={hobby.imageAlt}
							imageObjectFit={hobby.imageObjectFit || 'contain'}
						/>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- Scroll Down Indicator -->
	{#if showScrollIndicator}
		<div
			class="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-20 hidden md:flex transition-all duration-500"
			style="opacity: {showScrollIndicator
				? 0.4
				: 0}; transform: translateX(-50%) translateY({showScrollIndicator ? 0 : 20}px);"
			onclick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
			onkeydown={(e) =>
				e.key === 'Enter' && window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
			role="button"
			tabindex="0"
			aria-label={$_('a11y.scrollDown')}
		>
			<span class="text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-500">Scroll</span>
			<div
				class="w-4 h-7 rounded-full flex items-start justify-center p-1"
				style="border: 1px solid var(--border-primary);"
			>
				<div
					class="w-0.5 h-1.5 rounded-full animate-bounce"
					style="background: var(--text-tertiary);"
				></div>
			</div>
		</div>
	{/if}
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
</style>
