<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { _, locale } from 'svelte-i18n';
	import PhotoAvatar from '$lib/components/PhotoAvatar.svelte';
	import ParticleNetwork from '$lib/components/ParticleNetwork.svelte';
	import Cube from '$lib/components/Cube.svelte';
	import Mountains from '$lib/components/Mountains.svelte';
	import Card from '$lib/components/Card.svelte';
	import Resume from '$lib/components/Resume.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import Button from '$lib/components/Button.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import deLocale from '$lib/i18n/locales/de.json';
	import dumbbellImg from '$lib/assets/dumbbell.png?enhanced';
	import surfingImg from '$lib/assets/surfing.JPG?enhanced';

	const differentiators = $derived([
		{
			id: 'partner',
			icon: '🤝',
			title: $_('aboutPage.differentiators.partner.title'),
			desc: $_('aboutPage.differentiators.partner.desc'),
			gradient: 'from-blue-500/10 via-cyan-500/10 to-blue-600/10',
			colSpan: 'md:col-span-2 lg:col-span-2'
		},
		{
			id: 'local',
			icon: '📍',
			title: $_('aboutPage.differentiators.local.title'),
			desc: $_('aboutPage.differentiators.local.desc'),
			gradient: 'from-purple-500/10 via-pink-500/10 to-purple-600/10',
			colSpan: 'md:col-span-2 lg:col-span-2'
		},
		{
			id: 'direct',
			icon: '⚡',
			title: $_('aboutPage.differentiators.direct.title'),
			desc: $_('aboutPage.differentiators.direct.desc'),
			gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-600/10',
			colSpan: 'md:col-span-2 lg:col-span-2'
		}
	]);

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
									start: 'top 85%'
								}
							}
						);

						gsap.fromTo(
							'.stagger-cards .stagger-item',
							{ opacity: 0, y: 60, scale: 0.8 },
							{
								opacity: 1,
								y: 0,
								scale: 1,
								duration: 0.8,
								ease: 'back.out(1.7)',
								stagger: 0.1,
								scrollTrigger: {
									trigger: '.stagger-cards',
									start: 'top 85%'
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
					}

					if (isMobile) {
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

<SEO
	title={deLocale.seo?.about?.title ?? 'Über Matthias Bigl | About'}
	description={deLocale.seo?.about?.description ?? 'Learn more about Matthias Bigl'}
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
		{ name: 'Über mich', url: 'https://bigls.net/about' }
	]}
/>

<ScrollProgress />

<div class="relative pt-16 selection:bg-blue-500/20">
	<div class="fixed inset-0 z-0 opacity-[0.05] pointer-events-none grid-lines"></div>
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>

	<section
		id="hero"
		class="relative min-h-screen flex items-center overflow-hidden py-20 sm:py-24 lg:py-32"
	>
		<div class="absolute inset-0 z-0">
			<div
				class="absolute inset-0"
				style="background: radial-gradient(ellipse 80% 60% at 30% 40%, rgba(59,130,246,0.05) 0%, transparent 70%), var(--bg-body);"
			></div>
			<ParticleNetwork count={70} connectionDistance={140} speed={0.25} mouseRadius={180} />
		</div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-6xl mx-auto">
				<div class="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
					<div class="flex-shrink-0">
						<div
							class="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl"
						>
							<PhotoAvatar />
						</div>
					</div>

					<div class="flex-grow text-center lg:text-left">
						<div class="flex items-center gap-3 mb-4 justify-center lg:justify-start">
							<div class="h-px w-6 bg-blue-500/40"></div>
							<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]">
								{$_('aboutPage.hero.label')}
							</span>
							<div class="h-px w-6 bg-blue-500/40"></div>
						</div>

						<h1
							class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 tracking-tight"
							style="color: var(--text-heading);"
						>
							{$_('aboutPage.hero.name')}
						</h1>

						<p
							class="text-lg sm:text-xl lg:text-2xl mb-6 font-light"
							style="color: var(--text-secondary);"
						>
							{$_('aboutPage.hero.role')}
						</p>

						<p
							class="text-sm sm:text-base mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
							style="color: var(--text-tertiary);"
						>
							{$_('aboutPage.hero.tagline')}
						</p>

						<div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
							<Button href="/contact" variant="primary">
								{$_('aboutPage.hero.cta')}
							</Button>
							<Button href="/#services" variant="secondary">
								{$_('aboutPage.hero.ctaSecondary')}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section
		id="differentiators"
		class="reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-1"
	>
		<div class="parallax-bg parallax-bg-1"></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center mb-12 sm:mb-16">
				<div class="flex items-center gap-3 mb-5">
					<div class="h-px w-8 bg-blue-500/40"></div>
					<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]">
						{$_('aboutPage.differentiators.label')}
					</span>
					<div class="h-px w-8 bg-blue-500/40"></div>
				</div>
				<h2
					class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 tracking-tight"
					style="color: var(--text-heading);"
				>
					{$_('aboutPage.differentiators.title')}
				</h2>
				<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
			</div>

			<div class="bento-grid grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5 max-w-5xl mx-auto">
				{#each differentiators as diff}
					<article
						class="bento-item group relative {diff.colSpan} rounded-xl sm:rounded-2xl overflow-hidden border isolate backdrop-blur-md"
						style="border-color: var(--glass-border);"
					>
						<div
							class="absolute inset-0 transition-colors duration-500"
							style="background: var(--glass-bg);"
						></div>
						<div
							class="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none dark:from-white/[0.04] from-black/[0.02]"
						></div>
						<div
							class="absolute inset-0 bg-gradient-to-br {diff.gradient} opacity-20 transition-opacity duration-500 group-hover:opacity-50"
						></div>
						<div
							class="card-spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
						></div>

						<div
							class="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-center min-h-[180px] sm:min-h-[220px]"
						>
							<div
								class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg"
								style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
							>
								{diff.icon}
							</div>
							<h3
								class="text-xl sm:text-2xl font-bold mb-2 tracking-tight"
								style="color: var(--text-heading);"
							>
								{diff.title}
							</h3>
							<p
								class="text-sm sm:text-base font-light leading-relaxed"
								style="color: var(--text-secondary);"
							>
								{diff.desc}
							</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section
		id="skills"
		class="reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-2"
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

				<div class="text-center">
					<h3
						id="skills-languages"
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 uppercase tracking-wider"
						style="color: var(--text-secondary);"
					>
						{$_('skills.languages')}
					</h3>
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
					<p
						class="lg:hidden text-gray-500 text-xs sm:text-sm mt-4 opacity-60 hover:opacity-100 transition-opacity duration-300"
					>
						{$_('skills.hint')}
					</p>

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

				<div class="text-center">
					<h3
						id="skills-strengths"
						class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 uppercase tracking-wider"
						style="color: var(--text-secondary);"
					>
						{$_('skills.strengths')}
					</h3>
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

	<section
		id="journey"
		class="reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-1"
	>
		<div class="parallax-bg parallax-bg-1"></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-4xl mx-auto">
				<div class="flex flex-col items-center mb-12 sm:mb-16">
					<div class="flex items-center gap-3 mb-5">
						<div class="h-px w-8 bg-blue-500/40"></div>
						<span class="text-blue-400/70 text-xs font-bold uppercase tracking-[0.2em]">
							{$_('aboutPage.journey.label')}
						</span>
						<div class="h-px w-8 bg-blue-500/40"></div>
					</div>
					<h2
						class="section-title font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-5 tracking-tight"
						style="color: var(--text-heading);"
					>
						{$_('aboutPage.journey.title')}
					</h2>
					<div class="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
				</div>

				<div
					class="relative rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12"
					style="background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px);"
				>
					<div class="prose-about">
						{#each $_('aboutPage.journey.paragraphs') as paragraph}
							<p class="mb-6 last:mb-0">{paragraph}</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section
		class="reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-2 overflow-hidden"
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

	<section
		class="reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-1 overflow-hidden"
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

	<section class="reveal-section glass-section relative py-20 sm:py-24 lg:py-32 gradient-bg-2">
		<div class="parallax-bg parallax-bg-2"></div>

		<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-3xl mx-auto text-center">
				<h2
					class="section-title font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-tight"
					style="color: var(--text-heading);"
				>
					{$_('aboutPage.cta.title')}
				</h2>
				<p
					class="text-base sm:text-lg font-light mb-8 max-w-xl mx-auto leading-relaxed"
					style="color: var(--text-secondary);"
				>
					{$_('aboutPage.cta.subtitle')}
				</p>
				<Button href="/contact" variant="primary">
					{$_('aboutPage.cta.button')}
				</Button>
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

	.prose-about :global(p) {
		color: var(--text-secondary);
		font-size: 1rem;
		line-height: 1.85;
		font-weight: 300;
	}

	@media (min-width: 640px) {
		.prose-about :global(p) {
			font-size: 1.1rem;
		}
	}
</style>
