<script lang="ts">
	import PhotoAvatar from '$lib/components/PhotoAvatar.svelte';
	import Cube from '$lib/components/Cube.svelte';
	import Mountains from '$lib/components/Mountains.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import Card from '$lib/components/Card.svelte';
	import Resume from '$lib/components/Resume.svelte';
	import Services from '$lib/components/Services.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { projects } from '$lib/data/projects';
	import { _, locale } from 'svelte-i18n';

	if (browser) {
		gsap.registerPlugin(ScrollTrigger);
	}

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

		// Parallax backgrounds
		gsap.to('.parallax-bg-1', {
			yPercent: -50,
			ease: 'none',
			scrollTrigger: {
				trigger: '.skills-section',
				start: 'top bottom',
				end: 'bottom top',
				scrub: true
			}
		});

		gsap.to('.parallax-bg-2', {
			yPercent: -30,
			ease: 'none',
			scrollTrigger: {
				trigger: '.projects-section',
				start: 'top bottom',
				end: 'bottom top',
				scrub: true
			}
		});

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
						start: 'top 80%',
						end: 'bottom 20%'
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
					stagger: 0.15,
					scrollTrigger: {
						trigger: container,
						start: 'top 85%',
						end: 'bottom 15%'
					}
				}
			);
		});

		// Cube animations
		gsap.utils.toArray('.cube-container').forEach((cube: any) => {
			gsap.fromTo(
				cube,
				{ opacity: 0, scale: 0.5, rotationY: -180 },
				{
					opacity: 1,
					scale: 1,
					rotationY: 0,
					duration: 1.5,
					ease: 'back.out(1.7)',
					scrollTrigger: {
						trigger: cube,
						start: 'top 80%'
					}
				}
			);
		});

		// Magnetic effect for buttons
		document.querySelectorAll('.magnetic-btn').forEach((btn: any) => {
			btn.addEventListener('mouseenter', () => {
				gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' });
			});

			btn.addEventListener('mouseleave', () => {
				gsap.to(btn, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
			});

			btn.addEventListener('mousemove', (e: MouseEvent) => {
				const rect = btn.getBoundingClientRect();
				const x = e.clientX - rect.left - rect.width / 2;
				const y = e.clientY - rect.top - rect.height / 2;

				gsap.to(btn, {
					x: x * 0.3,
					y: y * 0.3,
					duration: 0.3,
					ease: 'power2.out'
				});
			});
		});

		// Floating animation for avatar
		gsap.to('.floating-avatar', {
			y: -20,
			duration: 3,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: -1
		});
		// Floating animations for hero background elements
		gsap.to('.hero-floating-1', {
			y: -30,
			rotation: 10,
			duration: 6,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: -1
		});

		gsap.to('.hero-floating-2', {
			y: -20,
			rotation: -5,
			duration: 8,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: -1,
			delay: 1
		});

		gsap.to('.hero-floating-3', {
			y: -40,
			x: 20,
			duration: 10,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: -1,
			delay: 2
		});
	});
</script>

<SEO
	title={$_('seo.home.title')}
	description={$_('seo.home.description')}
	url="https://bigls.net"
	type="profile"
	image="https://bigls.net/headshot.png"
	keywords={[
		'Webdesign Wien',
		'Webentwicklung Wien',
		'Webdesign Korneuburg',
		'Website erstellen lassen',
		'Webshop erstellen',
		'Webdesigner Österreich',
		'Freelancer Webentwicklung',
		'Homepage erstellen Wien',
		'Full Stack Developer Wien',
		'Matthias Bigl',
		'Webentwickler Niederösterreich',
		'Website Wien günstig',
		'Responsive Webdesign',
		'SvelteKit',
		'React',
		'TypeScript',
		'Webdesign Agentur Alternative',
		'Austrian Developer'
	]}
/>

<CustomCursor />
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
		class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
	>
		<!-- Enhanced Hero Background -->
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black/80 to-purple-900/10"
			></div>

			<!-- Floating geometric shapes -->
			<div
				class="hero-floating-1 absolute top-[15%] left-[10%] w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"
			></div>
			<div
				class="hero-floating-2 absolute bottom-[20%] right-[15%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]"
			></div>
			<div
				class="hero-floating-3 absolute top-[40%] right-[25%] w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px]"
			></div>

			<!-- Optional subtle grid overlay for hero specifically -->
			<div class="absolute inset-0 opacity-[0.02] grid-lines"></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16">
				<!-- Avatar -->
				<div class="hero-avatar floating-avatar relative">
					<div class="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 floating">
						<PhotoAvatar />
					</div>
				</div>

				<!-- Hero Text -->
				<div class="text-center lg:text-left max-w-3xl px-4">
					<p
						class="hero-intro font-poppins text-lg sm:text-xl font-medium text-blue-400 mb-4 tracking-wider uppercase"
					>
						{$_('hero.greeting')}
						{$_('hero.name')}
					</p>

					<h1
						class="hero-title font-poppins font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 text-white leading-[1.1] tracking-tight text-glow-soft"
					>
						{@html $_('hero.subtitle')}
					</h1>

					<p
						class="hero-description text-lg sm:text-xl lg:text-2xl text-gray-300 mb-10 leading-relaxed font-light"
					>
						{@html $_('hero.description')}
					</p>

					<div
						class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-4 sm:px-0"
					>
						<a
							href="/contact"
							class="magnetic-btn glass-card glass-card-hover px-10 py-5 text-lg font-bold text-white text-center rounded-[2rem] shadow-xl shadow-blue-500/10"
						>
							{$_('hero.cta')}
						</a>
						<a
							href="#services"
							class="magnetic-btn glass-card glass-card-hover px-10 py-5 text-lg font-bold text-white text-center border border-white/10 rounded-[2rem]"
						>
							{$_('hero.ctaServices')}
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Services Section -->
	<section class="services-wrapper reveal-section glass-section relative gradient-bg-1">
		<div class="parallax-bg parallax-bg-1"></div>
		<Services />
	</section>

	<!-- Skills Section -->
	<section
		class="skills-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-2"
	>
		<div class="parallax-bg parallax-bg-2"></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-12 lg:mb-20">
				<h2
					class="section-title font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-6 text-white tracking-tight"
				>
					{$_('skills.title')} <span class="blue-gradient_text">{$_('skills.titleHighlight')}</span>
				</h2>
				<div class="h-1 w-24 bg-blue-500 rounded-full"></div>
			</div>

			<div class="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
				<!-- Languages -->
				<div class="text-center">
					<h3
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-gray-300 uppercase tracking-wider"
					>
						{$_('skills.languages')}
					</h3>

					<div class="cube-container max-w-lg mx-auto aspect-square">
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
						/>
					</div>
				</div>

				<!-- Strengths -->
				<div class="text-center">
					<h3
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-gray-300 uppercase tracking-wider"
					>
						{$_('skills.strengths')}
					</h3>

					<div class="cube-container max-w-lg mx-auto aspect-square">
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
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- Projects Section -->
	<section
		class="projects-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-1 overflow-visible"
	>
		<div class="parallax-bg parallax-bg-1"></div>

		<div class="relative container mx-auto px-4 lg:px-6">
			<div class="flex flex-col items-center mb-12 lg:mb-20">
				<h2
					class="section-title font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-6 text-white tracking-tight"
				>
					{$_('projects.title')}
					<span class="blue-gradient_text">{$_('projects.titleHighlight')}</span>
				</h2>
				<div class="h-1 w-24 bg-blue-500 rounded-full"></div>
			</div>

			<div class="stagger-cards grid grid-cols-2 lg:grid-cols-4 gap-6 overflow-visible">
				{#each projects as project}
					<Card
						title={$_(`projects.items.${project.slug}.title`)}
						description={$_(`projects.items.${project.slug}.description`)}
						image={project.image}
						link="/projects/{project.slug}"
					/>
				{/each}
			</div>

			<p class="text-center text-gray-400 mt-8 text-lg">
				{$_('projects.moreOnGithub')}
				<a
					href="https://github.com/matthiasbigl"
					target="_blank"
					rel="noopener noreferrer"
					class="blue-gradient_text hover:underline">GitHub</a
				>!
			</p>
		</div>
	</section>

	<!-- Resume Section -->
	<section
		class="resume-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-2 overflow-visible"
	>
		<div class="parallax-bg parallax-bg-2"></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<h2
				class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-12 text-glow"
			>
				{$_('resume.title')} <span class="blue-gradient_text">{$_('resume.titleHighlight')}</span>
			</h2>

			<Resume />
		</div>
	</section>

	<!-- Hobbies Section -->
	<section
		class="hobbies-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-1 overflow-visible"
	>
		<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
			<h2
				class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-12 text-glow"
			>
				{$_('hobbies.title')} <span class="blue-gradient_text">{$_('hobbies.titleHighlight')}</span>
			</h2>

			<div
				class="stagger-cards grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-4 overflow-visible"
			>
				{#each hobbies as hobby}
					<Card
						title={hobby.title}
						description={hobby.description}
						image={hobby.image}
						isSpecialComponent={hobby.isSpecialComponent || false}
						imageObjectFit={hobby.imageObjectFit || 'contain'}
					/>
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
	<div
		class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer z-20"
		onclick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
	>
		<span class="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">Scroll</span>
		<div class="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
	</div>
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
