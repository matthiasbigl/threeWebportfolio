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
					// Hero — cinematic staggered entrance
					const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

					heroTl
						.fromTo('.hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
						.fromTo('.hero-title', { opacity: 0, y: 80, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.out' }, 0.3)
						.fromTo('.hero-description', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9 }, 0.7)
						.fromTo('.hero-cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.9)
						.fromTo('.hero-photo-wrap', { opacity: 0, scale: 0.85, rotationY: -15 }, { opacity: 1, scale: 1, rotationY: 0, duration: 1.4, ease: 'back.out(1.4)' }, 0.4)
						.fromTo('.hero-badge', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, 1.2)
						.fromTo('.hero-step', { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12 }, 1.1)
						.fromTo('.hero-orb-1', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 2, ease: 'power2.out' }, 0)
						.fromTo('.hero-orb-2', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 0.5, duration: 2.5, ease: 'power2.out' }, 0.3);

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

	<!-- Hero Section — Cinematic value-first design -->
	<section
		id="hero"
		class="hero-cinema relative min-h-screen flex items-center overflow-hidden"
	>
		<!-- Dramatic background layers -->
		<div class="absolute inset-0 z-0">
			<div class="absolute inset-0" style="background: var(--hero-bg);"></div>
			<!-- Big cinematic glow orbs -->
			<div class="hero-orb-1 absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[120px] opacity-60" style="background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);"></div>
			<div class="hero-orb-2 absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-50" style="background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);"></div>
			<div class="hero-orb-3 css-floating-2 absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-40" style="background: radial-gradient(circle, rgba(0,198,255,0.1) 0%, transparent 70%);"></div>
			<!-- Subtle noise texture -->
			<div class="absolute inset-0 opacity-[0.03] grid-lines"></div>
		</div>

		<div class="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 py-28 sm:py-32 lg:py-0">
			<!-- Two-column asymmetric layout -->
			<div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-6 xl:gap-10">
				<!-- LEFT — Copy & CTA -->
				<div class="flex-1 max-w-2xl lg:max-w-none lg:flex-[1.15] text-center lg:text-left order-2 lg:order-1">
					<!-- Eyebrow -->
					<div class="hero-eyebrow mb-5 sm:mb-6">
						<span
							class="inline-flex items-center gap-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full border"
							style="color: var(--text-secondary); background: var(--glass-bg); border-color: var(--glass-border); backdrop-filter: blur(12px);"
						>
							<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
							{$_('hero.trustLine')}
						</span>
					</div>

					<!-- Big dramatic headline -->
					<h1
						class="hero-title font-syne font-extrabold text-[2rem] sm:text-[2.75rem] md:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] mb-5 sm:mb-7 leading-[1.05] tracking-[-0.02em]"
						style="color: var(--text-heading);"
					>
						{@html $_('hero.headline')}
					</h1>

					<!-- Description -->
					<p
						class="hero-description text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 leading-[1.7] max-w-xl mx-auto lg:mx-0"
						style="color: var(--text-secondary);"
					>
						{@html $_('hero.description')}
					</p>

					<!-- CTAs -->
					<div class="hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-12 sm:mb-14 lg:mb-16">
						<Button href="/contact" variant="primary">
							{$_('hero.cta')}
						</Button>
						<Button href="#services" variant="secondary">
							{$_('hero.ctaServices')}
						</Button>
					</div>

					<!-- 3-Step Journey — Horizontal flowing timeline -->
					<div class="hero-journey">
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-0">
							<!-- Step 1 -->
							<div class="hero-step group relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 py-4 sm:py-0 sm:px-3">
								<!-- Step number + connector -->
								<div class="flex sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
									<div class="hero-step-num w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-syne font-extrabold text-sm sm:text-base transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20" style="background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(0,198,255,0.1)); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2);">
										01
									</div>
									<!-- Connector line (horizontal on mobile, vertical dot on desktop) -->
									<div class="h-px flex-1 sm:h-0 sm:flex-none sm:w-0 bg-gradient-to-r from-blue-500/30 to-transparent sm:hidden"></div>
								</div>
								<div class="flex-1 sm:mt-3 sm:text-center">
									<h3 class="font-poppins font-bold text-sm sm:text-base mb-0.5 tracking-tight" style="color: var(--text-heading);">
										{$_('hero.steps.idea.title')}
									</h3>
									<p class="text-xs leading-relaxed" style="color: var(--text-tertiary);">
										{$_('hero.steps.idea.description')}
									</p>
								</div>
								<!-- Connector between steps (desktop) -->
								<div class="hidden sm:block absolute top-[22px] right-0 w-[calc(50%-28px)] h-px translate-x-full z-0" style="background: linear-gradient(90deg, rgba(59,130,246,0.3), rgba(139,92,246,0.2));"></div>
							</div>

							<!-- Step 2 -->
							<div class="hero-step group relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 py-4 sm:py-0 sm:px-3">
								<div class="flex sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
									<div class="hero-step-num w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-syne font-extrabold text-sm sm:text-base transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20" style="background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(168,85,247,0.1)); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2);">
										02
									</div>
									<div class="h-px flex-1 sm:h-0 sm:flex-none sm:w-0 bg-gradient-to-r from-purple-500/30 to-transparent sm:hidden"></div>
								</div>
								<div class="flex-1 sm:mt-3 sm:text-center">
									<h3 class="font-poppins font-bold text-sm sm:text-base mb-0.5 tracking-tight" style="color: var(--text-heading);">
										{$_('hero.steps.build.title')}
									</h3>
									<p class="text-xs leading-relaxed" style="color: var(--text-tertiary);">
										{$_('hero.steps.build.description')}
									</p>
								</div>
								<div class="hidden sm:block absolute top-[22px] right-0 w-[calc(50%-28px)] h-px translate-x-full z-0" style="background: linear-gradient(90deg, rgba(139,92,246,0.2), rgba(16,185,129,0.3));"></div>
							</div>

							<!-- Step 3 -->
							<div class="hero-step group relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 py-4 sm:py-0 sm:px-3">
								<div class="flex sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
									<div class="hero-step-num w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-syne font-extrabold text-sm sm:text-base transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20" style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.1)); color: #34d399; border: 1px solid rgba(16,185,129,0.2);">
										03
									</div>
									<div class="h-px flex-1 sm:h-0 sm:flex-none sm:w-0 bg-gradient-to-r from-emerald-500/30 to-transparent sm:hidden"></div>
								</div>
								<div class="flex-1 sm:mt-3 sm:text-center">
									<h3 class="font-poppins font-bold text-sm sm:text-base mb-0.5 tracking-tight" style="color: var(--text-heading);">
										{$_('hero.steps.grow.title')}
									</h3>
									<p class="text-xs leading-relaxed" style="color: var(--text-tertiary);">
										{$_('hero.steps.grow.description')}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- RIGHT — Photo with dramatic treatment -->
				<div class="hero-photo-wrap flex-shrink-0 order-1 lg:order-2 relative flex items-center justify-center lg:flex-[0.85]">
					<!-- Glow backdrop behind photo -->
					<div class="absolute inset-0 scale-110" aria-hidden="true">
						<div class="absolute inset-0 rounded-[2rem] blur-[60px] opacity-40" style="background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.2), rgba(0,198,255,0.15));"></div>
					</div>

					<!-- Photo container with animated gradient border -->
					<div class="hero-photo-card relative w-56 h-64 sm:w-64 sm:h-72 lg:w-[20rem] lg:h-[24rem] xl:w-[22rem] xl:h-[26rem] rounded-[1.5rem] overflow-hidden" style="box-shadow: 0 25px 60px -12px rgba(0,0,0,0.3), 0 0 80px rgba(59,130,246,0.08);">
						<!-- Animated gradient border -->
						<div class="absolute inset-0 rounded-[1.5rem] p-[2px] z-10 pointer-events-none hero-glow-border">
							<div class="absolute inset-0 rounded-[1.5rem] hero-gradient-border-inner"></div>
							<div class="absolute inset-[2px] rounded-[calc(1.5rem-2px)]" style="background: var(--bg-body);"></div>
						</div>
						<PhotoAvatar />
					</div>

					<!-- Floating badge — social proof -->
					<div
						class="hero-badge absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-left-6 xl:-left-8 z-20 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl border whitespace-nowrap"
						style="background: var(--glass-bg); border-color: var(--glass-border); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.12);"
					>
						<p class="font-poppins font-semibold text-xs sm:text-sm" style="color: var(--text-heading);">
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

	:global(.font-syne) {
		font-family: 'Syne', sans-serif;
	}

	.aurora-bg {
		background:
			radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
			radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%);
		filter: blur(80px);
	}

	/* Animated gradient border for hero photo */
	@keyframes heroGradientBorder {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	:global(.hero-gradient-border-inner) {
		background: linear-gradient(135deg, rgba(0,198,255,0.5), rgba(59,130,246,0.3), rgba(139,92,246,0.5), rgba(0,198,255,0.3));
		background-size: 400% 400%;
		animation: heroGradientBorder 6s ease-in-out infinite;
	}

	:global(.hero-glow-border > div:first-child) {
		animation: heroGradientBorder 6s ease-in-out infinite;
		background-size: 400% 400%;
	}

	/* Hero cinema section */
	:global(.hero-cinema) {
		min-height: 100vh;
	}

	/* Photo card premium shadow */
	:global(.hero-photo-card) {
		transform-style: preserve-3d;
	}
</style>
