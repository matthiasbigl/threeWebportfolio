<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import PhotoAvatar from '$lib/components/PhotoAvatar.svelte';
	import ParticleNetwork from '$lib/components/ParticleNetwork.svelte';
	import Cube from '$lib/components/Cube.svelte';
	import Mountains from '$lib/components/Mountains.svelte';
	import Resume from '$lib/components/Resume.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import Button from '$lib/components/Button.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import HorizontalScrollSection from '$lib/components/HorizontalScrollSection.svelte';
	import dumbbellImg from '$lib/assets/dumbbell.png';
	import surfingImg from '$lib/assets/surfing.JPG';

	const journeySteps = $derived([
		{
			title: m['aboutPage.journey.steps.beginning.title'](),
			text: m['aboutPage.journey.steps.beginning.text']()
		},
		{
			title: m['aboutPage.journey.steps.education.title'](),
			text: m['aboutPage.journey.steps.education.text']()
		},
		{
			title: m['aboutPage.journey.steps.professional.title'](),
			text: m['aboutPage.journey.steps.professional.text']()
		},
		{
			title: m['aboutPage.journey.steps.philosophy.title'](),
			text: m['aboutPage.journey.steps.philosophy.text']()
		}
	]);

	let journeyCardsElements = $state<HTMLElement[]>([]);
	let journeyBgNumElements = $state<HTMLElement[]>([]);

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
						gsap.utils.toArray('.parallax-text').forEach((text: any) => {
							gsap.to(text, {
								y: -100,
								ease: 'none',
								scrollTrigger: {
									trigger: text.parentElement,
									start: 'top bottom',
									end: 'bottom top',
									scrub: true
								}
							});
						});

						gsap.utils.toArray('.reveal-section').forEach((section: any) => {
							gsap.fromTo(
								section.querySelectorAll('.reveal-el'),
								{ opacity: 0, y: 60 },
								{
									opacity: 1,
									y: 0,
									duration: 1.2,
									ease: 'power3.out',
									stagger: 0.15,
									scrollTrigger: {
										trigger: section,
										start: 'top 80%'
									}
								}
							);
						});

						gsap.fromTo(
							'.hobby-item',
							{ opacity: 0, scale: 0.9, y: 30 },
							{
								opacity: 1,
								scale: 1,
								y: 0,
								duration: 1,
								stagger: 0.2,
								ease: 'back.out(1.5)',
								scrollTrigger: {
									trigger: '.hobbies-grid',
									start: 'top 80%'
								}
							}
						);
					}

					if (isMobile) {
						gsap.utils.toArray('.reveal-section').forEach((section: any) => {
							gsap.fromTo(
								section.querySelectorAll('.reveal-el, .hobby-item'),
								{ opacity: 0, y: 30 },
								{
									opacity: 1,
									y: 0,
									duration: 0.8,
									stagger: 0.1,
									scrollTrigger: { trigger: section, start: 'top 85%' }
								}
							);
						});
					}
				}
			);
		})();

		return () => mm?.revert();
	});
</script>

<SEO
	title={m['seo.about.title']()}
	description={m['seo.about.description']()}
	url="https://bigls.net/about"
	type="profile"
	image="https://bigls.net/headshot.png"
	keywords={[
		'Matthias Bigl',
		'Webdesigner Wien',
		'Full Stack Developer',
		'Portfolio',
		'About',
		'Freelancer Wien',
		'Webentwicklung'
	]}
	breadcrumbs={[
		{ name: 'Matthias Bigl', url: 'https://bigls.net' },
		{ name: m['nav.about'](), url: 'https://bigls.net/about' }
	]}
/>

<ScrollProgress />

<div class="relative pt-16 selection:bg-blue-500/20">
	<div class="fixed inset-0 z-0 opacity-[0.05] pointer-events-none grid-lines"></div>
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<!-- HERO -->
	<section
		id="hero"
		class="relative min-h-dvh flex items-center overflow-hidden py-20 sm:py-24 lg:py-32"
	>
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0"
				style="background: radial-gradient(ellipse 100% 80% at 20% 50%, rgba(59,130,246,0.06) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 80% 80%, rgba(139,92,246,0.04) 0%, transparent 50%), var(--bg-body);"
			></div>
			<ParticleNetwork count={60} connectionDistance={130} speed={0.2} mouseRadius={160} />
		</div>

		<!-- Ambient decorative elements -->
		<div
			class="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none hidden lg:block"
		></div>
		<div
			class="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none hidden lg:block"
		></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-6xl mx-auto">
				<div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
					<!-- Left content -->
					<div class="flex-grow text-center lg:text-left order-2 lg:order-1">
						<div class="flex items-center gap-3 mb-6 justify-center lg:justify-start">
							<div class="h-px w-8 bg-gradient-to-r from-blue-500 to-purple-500"></div>
							<span class="text-blue-400/80 text-xs font-bold uppercase tracking-[0.25em]">
								{m['aboutPage.hero.label']()}
							</span>
						</div>

						<h1
							class="font-syne text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 tracking-tight leading-[1.1]"
							style="color: var(--text-heading);"
						>
							{m['aboutPage.hero.name']()}
						</h1>

						<p
							class="text-xl sm:text-2xl lg:text-3xl mb-6 font-light tracking-tight"
							style="color: var(--text-secondary);"
						>
							{m['aboutPage.hero.role']()}
						</p>

						<div
							class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8 mx-auto lg:mx-0"
						></div>

						<p
							class="text-base sm:text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
							style="color: var(--text-tertiary);"
						>
							{m['aboutPage.hero.tagline']()}
						</p>

						<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
							<Button href={localizeHref('/contact')} variant="primary" class="group">
								<span class="flex items-center gap-2">
									{m['aboutPage.hero.cta']()}
									<svg
										class="w-4 h-4 group-hover:translate-x-1 transition-transform"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/></svg
									>
								</span>
							</Button>
							<Button href={localizeHref('/#services')} variant="secondary">
								{m['aboutPage.hero.ctaSecondary']()}
							</Button>
						</div>
					</div>

					<!-- Right content (Avatar) -->
					<div class="relative order-1 lg:order-2 shrink-0 group">
						<div class="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
							<PhotoAvatar />
							<!-- Floating badge -->
							<div
								class="absolute -bottom-4 -right-4 glass-card px-4 py-2 rounded-full shadow-lg"
								style="background: var(--glass-bg); border-color: var(--glass-border);"
							>
								<span class="text-xs font-semibold" style="color: var(--text-heading);"
									>Wien / Korneuburg</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- PHILOSOPHY SECTION -->
	<section id="philosophy" class="reveal-section relative py-32 sm:py-48 overflow-hidden">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
			<div class="max-w-4xl">
				<div class="flex items-center gap-3 mb-8 reveal-el">
					<div class="h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
					<span class="text-blue-400/80 text-sm font-bold uppercase tracking-[0.3em]">
						{m['aboutPageNew.philosophy.label']()}
					</span>
				</div>
				<h2
					class="reveal-el font-syne text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight"
					style="color: var(--text-heading);"
				>
					{m['aboutPageNew.philosophy.title']()}
				</h2>
				<p
					class="reveal-el text-xl sm:text-2xl font-light leading-relaxed max-w-3xl"
					style="color: var(--text-secondary);"
				>
					{m['aboutPageNew.philosophy.text']()}
				</p>
			</div>
		</div>

		<!-- Background decorations -->
		<div
			class="absolute -right-32 -bottom-32 opacity-[0.03] pointer-events-none select-none hidden lg:block"
		>
			<span class="font-syne font-black text-[20rem] leading-none text-blue-500">UX</span>
		</div>
		<div
			class="absolute top-20 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"
		></div>
		<div
			class="absolute bottom-20 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"
		></div>
	</section>

	<!-- SKILLS AS A STATEMENT -->
	<section id="skills" class="reveal-section relative py-24 sm:py-36 gradient-bg-2 overflow-hidden">
		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
			<!-- Section Header -->
			<div class="flex flex-col items-center mb-16 reveal-el text-center">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-12 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
					<span class="text-cyan-400/80 text-sm font-bold uppercase tracking-[0.3em]">
						{m['skills.title']()}
					</span>
					<div class="h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
				</div>
				<h2
					class="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
					style="color: var(--text-heading);"
				>
					{m['skills.titleHighlight']()}
				</h2>
				<div class="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6"></div>
				<p class="text-lg font-light max-w-2xl" style="color: var(--text-secondary);">
					{m['skills.languagesDescription']()}
				</p>
			</div>

			<!-- Skills Grid with Two Cubes -->
			<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
				<!-- Programming Languages Cube -->
				<div class="reveal-el">
					<div
						class="glass-card p-8 rounded-3xl relative overflow-hidden group"
						style="background: var(--glass-bg); border-color: var(--glass-border);"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
						></div>

						<div class="flex items-center gap-3 mb-6">
							<div
								class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
							>
								<svg
									class="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
									/>
								</svg>
							</div>
							<h3 class="text-xl font-bold" style="color: var(--text-heading);">
								{m['skills.languages']()}
							</h3>
						</div>

						<div class="relative aspect-square max-w-sm mx-auto w-full mb-6">
							<div
								class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"
							></div>
							<div class="cube-container cube-glow w-full h-full relative z-10">
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
									ariaLabel={m['skills.languagesAriaLabel']()}
								/>
							</div>
						</div>

						<div class="flex flex-wrap gap-2 justify-center">
							{#each m['skills.languagesList']().split(',') as skill}
								<span
									class="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
									style="background: var(--bg-surface); color: var(--text-heading); border: 1px solid var(--border-primary);"
								>
									{skill.trim()}
								</span>
							{/each}
						</div>
					</div>
				</div>

				<!-- Professional Strengths Cube -->
				<div class="reveal-el">
					<div
						class="glass-card p-8 rounded-3xl relative overflow-hidden group"
						style="background: var(--glass-bg); border-color: var(--glass-border);"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
						></div>

						<div class="flex items-center gap-3 mb-6">
							<div
								class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
							>
								<svg
									class="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 class="text-xl font-bold" style="color: var(--text-heading);">
								{m['skills.strengths']()}
							</h3>
						</div>

						<div class="relative aspect-square max-w-sm mx-auto w-full mb-6">
							<div
								class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl"
							></div>
							<div class="cube-container cube-glow w-full h-full relative z-10">
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
									ariaLabel={m['skills.strengthsAriaLabel']()}
								/>
							</div>
						</div>

						<div class="flex flex-wrap gap-2 justify-center">
							{#each m['skills.strengthsList']().split(',') as strength}
								<span
									class="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
									style="background: var(--bg-surface); color: var(--text-heading); border: 1px solid var(--border-primary);"
								>
									{strength.trim()}
								</span>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Hint Text -->
			<div class="mt-12 text-center reveal-el">
				<p
					class="text-sm font-medium inline-flex items-center gap-2 px-4 py-2 rounded-full"
					style="background: var(--bg-surface); color: var(--text-tertiary); border: 1px solid var(--border-primary);"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
						/>
					</svg>
					{m['skills.hint']()}
				</p>
			</div>
		</div>
	</section>

	<!-- TIMELINE / JOURNEY (Horizontal Scroll — all breakpoints) -->
	{#snippet journeyIntroSlide()}
		<div class="flex items-center gap-3 mb-4 md:mb-6">
			<div class="h-px w-10 md:w-12 bg-gradient-to-r from-blue-500 to-purple-500"></div>
			<span class="text-blue-500 text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
				{m['aboutPage.journey.label']()}
			</span>
		</div>
		<h2
			class="font-syne text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1]"
			style="color: var(--text-heading);"
		>
			{m['aboutPage.journey.title']()}
		</h2>
		<div class="flex items-center gap-4">
			<div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			<span
				class="text-sm font-medium uppercase tracking-widest"
				style="color: var(--text-tertiary);">{m['aboutPage.journey.scrollHint']()}</span
			>
			<svg
				class="w-5 h-5 animate-bounce-x"
				style="color: var(--text-tertiary);"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 8l4 4m0 0l-4 4m4-4H3"
				/>
			</svg>
		</div>
	{/snippet}

	{#snippet journeyCards()}
		{#each journeySteps as step, i}
			{@const accentColors = [
				{
					gradient: 'from-blue-500 to-cyan-400',
					bg: 'from-blue-500/8 to-cyan-500/8',
					border: 'border-blue-500/15',
					dot: 'bg-blue-500'
				},
				{
					gradient: 'from-cyan-500 to-emerald-400',
					bg: 'from-cyan-500/8 to-emerald-500/8',
					border: 'border-cyan-500/15',
					dot: 'bg-cyan-500'
				},
				{
					gradient: 'from-purple-500 to-pink-400',
					bg: 'from-purple-500/8 to-pink-500/8',
					border: 'border-purple-500/15',
					dot: 'bg-purple-500'
				},
				{
					gradient: 'from-pink-500 to-orange-400',
					bg: 'from-pink-500/8 to-orange-500/8',
					border: 'border-pink-500/15',
					dot: 'bg-pink-500'
				}
			]}
			{@const accent = accentColors[i % accentColors.length]}

			<div
				bind:this={journeyCardsElements[i]}
				class="w-[82vw] sm:w-[75vw] md:w-[55vw] lg:w-[45vw] max-w-[560px] shrink-0 h-[65dvh] md:h-[70dvh] flex items-center relative group"
			>
				<div
					class="hscroll-card w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between isolate border {accent.border}"
				>
					<!-- Top accent bar -->
					<div
						class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r {accent.gradient} rounded-full"
					></div>

					<!-- Inset highlight (top edge glow) -->
					<div
						class="absolute inset-x-0 top-0 h-px pointer-events-none"
						style="background: var(--glass-inset-highlight);"
					></div>

					<!-- Background Number — centered, visible -->
					<div
						class="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden"
					>
						<span
							bind:this={journeyBgNumElements[i]}
							class="font-syne font-black text-[14rem] sm:text-[18rem] md:text-[22rem] leading-none select-none"
							style="color: var(--text-heading); opacity: 0.07;"
						>
							0{i + 1}
						</span>
					</div>

					<!-- Soft gradient wash inside card -->
					<div class="absolute inset-0 bg-gradient-to-br {accent.bg} -z-10"></div>

					<!-- Top Row: Number badge + line -->
					<div class="flex items-center gap-3 md:gap-4">
						<div
							class="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center"
							style="background: var(--bg-inset); border: 1px solid var(--border-primary);"
						>
							<span
								class="font-syne font-bold text-sm md:text-base bg-clip-text text-transparent bg-gradient-to-br {accent.gradient}"
							>
								0{i + 1}
							</span>
						</div>
						<div class="h-px flex-1 bg-gradient-to-r {accent.gradient} opacity-20"></div>
					</div>

					<!-- Bottom: Title + Text -->
					<div class="relative z-10">
						<h3
							class="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 tracking-tight leading-[1.2]"
							style="color: var(--text-heading);"
						>
							{step.title}
						</h3>
						<p
							class="text-sm sm:text-base lg:text-lg font-light leading-relaxed"
							style="color: var(--text-secondary);"
						>
							{step.text}
						</p>
					</div>
				</div>
			</div>
		{/each}
	{/snippet}

	<HorizontalScrollSection
		id="journey"
		watermark="JOURNEY"
		introSlide={journeyIntroSlide}
		cards={journeyCards}
		cardElements={journeyCardsElements}
		bgNumElements={journeyBgNumElements}
	/>

	<!-- RESUME SECTION -->
	<section id="resume" class="reveal-section relative py-24 sm:py-36 overflow-hidden">
		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
			<div class="flex flex-col items-center mb-16 reveal-el">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
					<span class="text-blue-400/80 text-sm font-bold uppercase tracking-[0.3em]">
						{m['resume.title']()}
					</span>
					<div class="h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
				</div>
				<h2
					class="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-center tracking-tight mb-4"
					style="color: var(--text-heading);"
				>
					{m['resume.titleHighlight']()}
				</h2>
				<div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
			</div>

			<div class="reveal-el">
				<Resume />
			</div>
		</div>
	</section>

	<!-- HOBBIES: THE MOUNTAIN EXPERIENCE -->
	<section id="hobbies" class="reveal-section relative py-24 sm:py-36 overflow-hidden">
		<!-- Background -->
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0 bg-gradient-to-b from-[var(--bg-body)] via-[var(--bg-inset)] to-[var(--bg-body)] opacity-50"
			></div>
			<div
				class="absolute top-1/4 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"
			></div>
			<div
				class="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
			></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
			<!-- Section Header -->
			<div class="flex flex-col items-center mb-16 reveal-el text-center">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
					<span class="text-blue-400/80 text-sm font-bold uppercase tracking-[0.3em]">
						{m['aboutPageNew.hobbiesNew.label']()}
					</span>
					<div class="h-px w-12 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
				</div>

				<h2
					class="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
					style="color: var(--text-heading);"
				>
					{m['aboutPageNew.hobbiesNew.title']()}
				</h2>

				<div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6"></div>

				<p class="text-lg font-light max-w-2xl" style="color: var(--text-secondary);">
					{m['aboutPageNew.hobbiesNew.desc']()}
				</p>
			</div>

			<!-- Hobby Cards Grid -->
			<div class="hobbies-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				<!-- Skiing -->
				<div
					class="hobby-item group relative overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2"
				>
					<div
						class="glass-card rounded-[2rem] h-full relative overflow-hidden isolate"
						style="background: var(--glass-bg); border-color: var(--glass-border); box-shadow: var(--card-shadow);"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
						></div>

						<!-- Mountain 3D as card header visual -->
						<div class="w-full h-48 sm:h-56 overflow-hidden relative">
							<div
								class="absolute inset-0 bg-gradient-to-t from-[var(--glass-bg)] via-transparent to-transparent z-10 pointer-events-none"
							></div>
							<Mountains />
						</div>

						<div class="p-8 sm:p-10 pt-4 sm:pt-4">
							<div
								class="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-5"
							>
								<svg
									class="w-6 h-6 text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M3 17l4-4 4 4 4-8 5 8"
									/>
								</svg>
							</div>
							<h3
								class="text-2xl sm:text-3xl font-bold mb-4 leading-tight"
								style="color: var(--text-heading);"
							>
								{m['hobbies.items.skiing.title']()}
							</h3>
							<p
								class="text-base sm:text-lg font-light leading-relaxed"
								style="color: var(--text-secondary);"
							>
								{m['hobbies.items.skiing.description']()}
							</p>
						</div>
					</div>
				</div>

				<!-- Surfing -->
				<div
					class="hobby-item group relative overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2"
				>
					<div
						class="glass-card rounded-[2rem] h-full relative overflow-hidden isolate"
						style="background: var(--glass-bg); border-color: var(--glass-border); box-shadow: var(--card-shadow);"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
						></div>

						<!-- Surfing image as card header visual -->
						<div class="w-full h-48 sm:h-56 overflow-hidden relative">
							<div
								class="absolute inset-0 bg-gradient-to-t from-[var(--glass-bg)] via-transparent to-transparent z-10 pointer-events-none"
							></div>
							<img
								src={surfingImg}
								alt=""
								class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>

						<div class="p-8 sm:p-10 pt-4 sm:pt-4">
							<div
								class="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mb-5"
							>
								<svg
									class="w-6 h-6 text-teal-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M3 15c2.483 0 4.345-3 6-3s3.517 3 6 3 4.345-3 6-3"
									/>
								</svg>
							</div>
							<h3
								class="text-2xl sm:text-3xl font-bold mb-4 leading-tight"
								style="color: var(--text-heading);"
							>
								{m['hobbies.items.surfing.title']()}
							</h3>
							<p
								class="text-base sm:text-lg font-light leading-relaxed"
								style="color: var(--text-secondary);"
							>
								{m['hobbies.items.surfing.description']()}
							</p>
						</div>
					</div>
				</div>

				<!-- Gym -->
				<div
					class="hobby-item group relative overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2 sm:col-span-2 lg:col-span-1"
				>
					<div
						class="glass-card rounded-[2rem] h-full relative overflow-hidden isolate"
						style="background: var(--glass-bg); border-color: var(--glass-border); box-shadow: var(--card-shadow);"
					>
						<div
							class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
						></div>

						<!-- Gym image as card header visual -->
						<div class="w-full h-48 sm:h-56 overflow-hidden relative">
							<div
								class="absolute inset-0 bg-gradient-to-t from-[var(--glass-bg)] via-transparent to-transparent z-10 pointer-events-none"
							></div>
							<img
								src={dumbbellImg}
								alt=""
								class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>

						<div class="p-8 sm:p-10 pt-4 sm:pt-4">
							<div
								class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-5"
							>
								<svg
									class="w-6 h-6 text-emerald-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
									/>
								</svg>
							</div>
							<h3
								class="text-2xl sm:text-3xl font-bold mb-4 leading-tight"
								style="color: var(--text-heading);"
							>
								{m['hobbies.items.gym.title']()}
							</h3>
							<p
								class="text-base sm:text-lg font-light leading-relaxed"
								style="color: var(--text-secondary);"
							>
								{m['hobbies.items.gym.description']()}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="reveal-section relative py-32 sm:py-48 text-center overflow-hidden">
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"
			></div>
			<div
				class="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"
			></div>
			<div
				class="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]"
			></div>
		</div>
		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div
				class="max-w-3xl mx-auto reveal-el glass-card p-12 sm:p-16 lg:p-20 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
				style="background: var(--glass-bg); border-color: var(--glass-border);"
			>
				<div
					class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"
				></div>
				<div
					class="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
				></div>
				<div
					class="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
					style="animation-delay: 1s;"
				></div>

				<div class="relative z-10">
					<div class="flex items-center justify-center gap-2 mb-6">
						<div class="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/50"></div>
						<span class="text-blue-400/80 text-xs font-bold uppercase tracking-[0.3em]"
							>Let's Connect</span
						>
						<div class="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/50"></div>
					</div>

					<h2
						class="font-syne text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
						style="color: var(--text-heading);"
					>
						{m['aboutPage.cta.title']()}
					</h2>
					<p
						class="text-lg sm:text-xl font-light mb-10 leading-relaxed max-w-xl mx-auto"
						style="color: var(--text-secondary);"
					>
						{m['aboutPage.cta.subtitle']()}
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Button href={localizeHref('/contact')} variant="primary" class="group">
							<span class="flex items-center gap-2">
								{m['aboutPage.cta.button']()}
								<svg
									class="w-4 h-4 group-hover:translate-x-1 transition-transform"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/></svg
								>
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
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

	.cube-glow {
		filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.3));
		transition: filter 0.3s ease;
	}

	.cube-glow:hover {
		filter: drop-shadow(0 0 50px rgba(59, 130, 246, 0.5));
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.4;
		}
	}

	.animate-pulse {
		animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
