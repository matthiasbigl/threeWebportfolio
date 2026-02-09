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
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { projects } from '$lib/data/projects';
	import { _, locale } from 'svelte-i18n';

	if (browser) {
		gsap.registerPlugin(ScrollTrigger);
	}

	// Track scroll position for scroll indicator visibility
	let showScrollIndicator = $state(true);

	// Reactive hobbies based on locale
	const hobbies = $derived([
		{
			title: $_('hobbies.items.gym.title'),
			description: $_('hobbies.items.gym.description'),
			image: 'assets/dumbbell.png'
		},
		{
			title: $_('hobbies.items.skiing.title'),
			description: $_('hobbies.items.skiing.description'),
			image: '',
			isSpecialComponent: true
		},
		{
			title: $_('hobbies.items.surfing.title'),
			description: $_('hobbies.items.surfing.description'),
			image: 'assets/surfing.JPG',
			imageObjectFit: 'cover' as const
		}
	]);

	onMount(() => {
		if (!browser) return;

		// Handle scroll indicator visibility
		const handleScroll = () => {
			showScrollIndicator = window.scrollY < 100;
		};
		window.addEventListener('scroll', handleScroll);

		const mm = gsap.matchMedia();

		mm.add('(min-width: 768px)', () => {
			// Hero section animations
			gsap.fromTo(
				'.hero-title',
				{ opacity: 0, y: 100, scale: 0.8 },
				{ opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)', delay: 0.5 }
			);

			gsap.fromTo(
				'.hero-subtitle',
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.8 }
			);

			gsap.fromTo(
				'.hero-avatar',
				{ opacity: 0, x: -100, rotation: -10 },
				{ opacity: 1, x: 0, rotation: 0, duration: 1.5, ease: 'back.out(1.7)', delay: 0.3 }
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
		});

		mm.add('(max-width: 767px)', () => {
			// Simpler reveals for mobile
			gsap.utils.toArray('.reveal-section').forEach((section: any) => {
				gsap.fromTo(
					section,
					{ opacity: 0, y: 20 },
					{ opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: section, start: 'top 90%' } }
				);
			});
		});

		return () => {
			mm.revert();
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<SEO
	title={$_('seo.home.title')}
	description={$_('seo.home.description')}
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
	faqItems={Object.keys(deLocale.faq.items).map(key => ({
		question: $_(`faq.items.${key}.question`),
		answer: $_(`faq.items.${key}.answer`)
	}))}
	breadcrumbs={[
		{ name: 'Matthias Bigl', url: 'https://bigls.net' }
	]}
/>

<ScrollProgress />

<div class="relative pt-16 selection:bg-blue-500/20">
	<!-- UI Layers for consistency with project pages -->
	<div class="fixed inset-0 z-0 opacity-[0.05] pointer-events-none grid-lines"></div>
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<!-- Hero Section -->
	<section
		id="hero"
		class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20 sm:pb-28"
	>
		<!-- Enhanced Hero Background -->
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black/80 to-purple-900/10"
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

			<!-- Optional subtle grid overlay for hero specifically -->
			<div class="absolute inset-0 opacity-[0.02] grid-lines"></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16">
				<!-- Avatar -->
				<div class="hero-avatar floating-avatar relative">
					<div class="w-56 h-56 sm:w-72 sm:h-72 lg:w-[22rem] lg:h-[22rem] floating">
						<PhotoAvatar />
					</div>
				</div>

				<!-- Hero Text -->
				<div class="text-center lg:text-left max-w-3xl px-4">
					<p
						class="hero-intro font-poppins text-xs sm:text-sm font-semibold text-blue-400/80 mb-6 tracking-[0.15em] uppercase"
					>
						{$_('hero.greeting')}
						<span class="text-white/90">{$_('hero.name')}</span>
					</p>

					<h1
						class="hero-title font-poppins font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 text-white leading-[1.1] tracking-tight"
					>
						{@html $_('hero.subtitle')}
					</h1>

					<p
						class="hero-description text-base sm:text-lg lg:text-xl text-gray-400 mb-12 leading-relaxed font-light max-w-2xl"
					>
						{@html $_('hero.description')}
					</p>

					<div
						class="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start px-4 sm:px-0"
					>
						<Button href="/contact" variant="primary">
							{$_('hero.cta')}
						</Button>
						<Button href="#services" variant="secondary">
							{$_('hero.ctaServices')}
						</Button>
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
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]">{$_('skills.title')}</span>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					id="skills-heading"
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 text-white tracking-tight"
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
						class="text-gray-500 text-xs whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/5"
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
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-gray-300 uppercase tracking-wider"
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
								class="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:border-blue-500/30 hover:text-gray-300 transition-all duration-200"
								>{skill.trim()}</span
							>
						{/each}
					</div>
				</div>

				<!-- Strengths -->
				<div class="text-center">
					<h3
						id="skills-strengths"
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-gray-300 uppercase tracking-wider"
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
								class="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/30 hover:text-gray-300 transition-all duration-200"
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
		class="projects-section reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-1 overflow-hidden"
	>
		<div class="parallax-bg parallax-bg-1"></div>

		<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-14 lg:mb-20">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]">{$_('projects.title')}</span>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 text-white tracking-tight"
				>
					{$_('projects.titleHighlight')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<div
				class="stagger-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
			>
				{#each projects as project}
					<Card
						title={$_(`projects.items.${project.slug}.title`)}
						description={$_(`projects.items.${project.slug}.description`)}
						image={project.image}
						link={project.isExternal ? project.link : `/projects/${project.slug}`}
						target={project.isExternal ? '_blank' : ''}
						rel={project.isExternal ? 'noopener noreferrer' : ''}
					/>
				{/each}
			</div>

			<p class="text-center text-gray-400 mt-10 text-base sm:text-lg">
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
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]">{$_('resume.title')}</span>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 text-white tracking-tight"
				>
					{$_('resume.titleHighlight')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<Resume />
		</div>
	</section>

	<!-- Hobbies Section -->
	<section
		class="hobbies-section reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-1 overflow-hidden"
	>
		<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-12 sm:mb-16">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]">{$_('hobbies.title')}</span>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 text-white tracking-tight"
				>
					{$_('hobbies.titleHighlight')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<div
				class="stagger-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
			>
				{#each hobbies as hobby}
					<Card
						title={hobby.title}
						description={hobby.description}
						image={hobby.image}
						imageObjectFit={hobby.imageObjectFit || 'contain'}
					>
						{#if hobby.isSpecialComponent && hobby.title === $_('hobbies.items.skiing.title')}
							<Mountains />
						{/if}
					</Card>
				{/each}
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="faq-wrapper reveal-section glass-section relative gradient-bg-2">
		<div class="parallax-bg parallax-bg-2"></div>
		<FAQ />
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
			aria-label="Scroll down"
		>
			<span class="text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-500"
				>Scroll</span
			>
			<div
				class="w-4 h-7 rounded-full border border-white/15 flex items-start justify-center p-1"
			>
				<div class="w-0.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.font-poppins) {
		font-family: 'Poppins', sans-serif;
	}

	.aurora-bg {
		background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
			radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%);
		filter: blur(80px);
	}
</style>
