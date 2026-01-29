<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const project = data.project;

	onMount(() => {
		if (!browser) return;
		gsap.registerPlugin(ScrollTrigger);

		// Entry animations
		const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

		tl.fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
			.fromTo('.hero-tagline', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.7')
			.fromTo(
				'.hero-description',
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.8 },
				'-=0.6'
			)
			.fromTo(
				'.stagger-card',
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.1,
					duration: 0.8,
					scrollTrigger: {
						trigger: '.technical-narrative',
						start: 'top 85%'
					}
				},
				'-=0.2'
			);
	});
</script>

<SEO
	title="{$_(`projects.items.${project.slug}.title`)} | Matthias Bigl Portfolio"
	description={$_(`projects.items.${project.slug}.description`)}
	url="https://bigls.net/projects/{project.slug}"
	type="article"
	keywords={($_(`projects.items.${project.slug}.tags`) as any) ?? [
		project.slug,
		'Webdesign',
		'Matthias Bigl'
	]}
/>

<CustomCursor />
<ScrollProgress />

<div
	class="relative min-h-screen pt-32 pb-32 overflow-hidden selection:bg-blue-500/20 bg-[#0a0a0f]"
>
	<!-- UI Layers -->
	<div class="fixed inset-0 z-0 opacity-10 pointer-events-none grain-overlay"></div>
	<div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
		<div class="aurora-bg w-full h-full"></div>
	</div>
	<div class="fixed inset-0 z-0 opacity-[0.03] pointer-events-none grid-lines"></div>

	<div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
		<!-- Navigation Header -->
		<nav class="flex justify-between items-center mb-16 lg:mb-24 px-4">
			<a
				href="/#projects"
				class="group flex items-center gap-3 text-gray-400 hover:text-white transition-all font-medium"
			>
				<div
					class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors"
				>
					<svg
						class="w-4 h-4 transition-transform group-hover:-translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</div>
				<span class="text-sm tracking-widest uppercase">All Projects</span>
			</a>
		</nav>

		<!-- CENTERED HERO SECTION -->
		<header class="text-center max-w-5xl mx-auto mb-20 lg:mb-32">
			<div
				class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-12"
			>
				<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
				Case Study — {project.slug}
			</div>

			<h1
				class="hero-title font-poppins text-5xl sm:text-8xl lg:text-[10rem] font-black text-white leading-[0.9] tracking-tighter mb-12 text-glow-soft break-words"
			>
				{$_(`projects.items.${project.slug}.title`)}
			</h1>

			<p
				class="hero-tagline text-xl lg:text-4xl font-poppins font-bold text-blue-400 max-w-3xl mx-auto mb-12 leading-tight tracking-tight italic px-4"
			>
				"{$_(`projects.items.${project.slug}.tagline`)}"
			</p>

			<p
				class="hero-description text-lg lg:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light px-4"
			>
				{$_(`projects.items.${project.slug}.description`)}
			</p>
		</header>

		<!-- STRUCTURED NARRATIVE GRID -->
		<div
			class="technical-narrative grid lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32 lg:mb-48"
		>
			<!-- Left Pillar: The Technical Truth (Problem/Solution) -->
			<div class="lg:col-span-8 space-y-20 lg:space-y-32">
				<!-- Structured Narrative Section -->
				{#if $_(`projects.items.${project.slug}.sections`)}
					<!-- Large Context Block -->
					<section
						class="stagger-card p-6 sm:p-10 lg:p-16 rounded-[2rem] lg:rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl relative overflow-hidden group"
					>
						<div
							class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"
						>
							<svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M14.017 21L14.017 18C14.017 16.8954 14.9125 16 16.0171 16H19.0171V14.0171C19.0171 11.8023 17.2148 10 15 10V8C18.3137 8 21 10.6863 21 14V21H14.017ZM3 21V14C3 10.6863 5.68629 8 9 8V10C6.78528 10 4.98292 11.8023 4.98292 14.0171V16H7.98292C9.08749 16 9.98292 16.8954 9.98292 18V21H3Z"
								/>
							</svg>
						</div>
						<h3
							class="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 flex items-center gap-3 mb-10"
						>
							<span class="w-12 h-px bg-blue-500/50"></span> Project Vision
						</h3>
						<p
							class="font-poppins text-xl sm:text-2xl lg:text-4xl font-medium text-white leading-[1.2] tracking-tight"
						>
							{$_(`projects.items.${project.slug}.sections.context`)}
						</p>
					</section>

					<!-- Problem & Solution Group -->
					<div class="grid md:grid-cols-2 gap-12 lg:gap-16">
						<section
							class="stagger-card space-y-8 p-6 sm:p-10 rounded-[1.5rem] lg:rounded-[2rem] bg-white/[0.02] border border-white/5"
						>
							<h3
								class="text-xs font-bold uppercase tracking-[0.3em] text-red-500 flex items-center gap-3"
							>
								<span class="w-8 h-px bg-red-500/50"></span> 01. Challenge
							</h3>
							<p class="text-xl sm:text-2xl font-bold text-gray-100 leading-tight">
								{$_(`projects.items.${project.slug}.sections.problem`)}
							</p>
						</section>

						<section
							class="stagger-card space-y-8 p-6 sm:p-10 rounded-[1.5rem] lg:rounded-[2rem] bg-white/[0.02] border border-white/5"
						>
							<h3
								class="text-xs font-bold uppercase tracking-[0.3em] text-green-500 flex items-center gap-3"
							>
								<span class="w-8 h-px bg-green-500/50"></span> 02. Execution
							</h3>
							<p class="text-base sm:text-xl text-gray-400 leading-relaxed">
								{$_(`projects.items.${project.slug}.sections.solution`)}
							</p>
						</section>
					</div>
				{/if}
			</div>

			<!-- Right Pillar: The Technical Stack & Meta -->
			<aside class="lg:col-span-4 space-y-16 lg:sticky lg:top-32">
				<!-- Tag Cloud -->
				<div class="stagger-card space-y-8 px-6">
					<h3 class="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
						Technologies Used
					</h3>
					<div class="flex flex-wrap gap-3">
						{#each ($_(`projects.items.${project.slug}.technologies`) as any) ?? [] as tech}
							<span
								class="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 text-sm font-medium hover:border-blue-500/30 hover:text-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all ease-expo cursor-default translate-y-0 hover:-translate-y-1"
							>
								{tech}
							</span>
						{/each}
					</div>
				</div>

				<!-- Quick Specs -->
				<div class="stagger-card glass-card p-8 rounded-3xl border-white/5 font-poppins">
					<div class="space-y-6">
						<div class="flex justify-between items-center py-5 border-b border-white/5">
							<span class="text-xs uppercase tracking-widest text-gray-500">Type</span>
							<span class="text-sm font-bold text-gray-200"
								>{project.slug === 'robotics'
									? 'Public Safety / Defence'
									: 'Software Engineering'}</span
							>
						</div>
						<div class="flex justify-between items-center py-5 border-b border-white/5">
							<span class="text-xs uppercase tracking-widest text-gray-500">Timeline</span>
							<span class="text-sm font-bold text-gray-200">2024 — Present</span>
						</div>
						<div class="flex justify-between items-center py-5">
							<span class="text-xs uppercase tracking-widest text-gray-500">Role</span>
							<span class="text-sm font-bold text-gray-200">Lead Architect</span>
						</div>
					</div>
				</div>
			</aside>
		</div>

		<!-- INNOVATIONS SECTION (Full Width) -->
		{#if $_(`projects.items.${project.slug}.features`)}
			<section class="mb-32 lg:mb-48 space-y-16">
				<div class="flex flex-col items-center text-center space-y-4 px-4">
					<h2 class="text-4xl lg:text-7xl font-black text-white tracking-tighter">
						Key Innovations
					</h2>
					<div class="h-1 w-24 bg-blue-500 rounded-full"></div>
				</div>

				<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{#each ($_(`projects.items.${project.slug}.features`) as any) ?? [] as feature}
						<div
							class="stagger-card group p-8 lg:p-12 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all duration-700 ease-expo relative overflow-hidden"
						>
							<div
								class="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full group-hover:bg-blue-500/10 transition-colors"
							></div>

							<div
								class="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg"
							>
								<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>

							<h4
								class="text-2xl font-bold text-gray-100 mb-6 group-hover:text-blue-400 transition-colors leading-tight"
							>
								{feature}
							</h4>

							<div
								class="h-px w-12 bg-blue-500/30 group-hover:w-full group-hover:bg-blue-500 transition-all duration-1000 ease-expo"
							></div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- NEW: CINEMATIC IMPACT SECTION (Full Width) -->
		<section class="stagger-card mb-32 lg:mb-48">
			<div
				class="relative p-8 lg:p-24 rounded-[2.5rem] lg:rounded-[4rem] bg-gradient-to-br from-blue-600/10 to-blue-900/20 border border-blue-500/20 backdrop-blur-3xl overflow-hidden group shadow-2xl"
			>
				<!-- Background motion detail -->
				<div
					class="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"
				></div>
				<div
					class="absolute -left-20 -top-20 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full"
				></div>

				<div class="relative z-10 max-w-4xl">
					<h3
						class="text-xs font-bold uppercase tracking-[0.5em] text-blue-400 mb-12 flex items-center gap-4"
					>
						<span class="w-12 h-px bg-blue-500/50"></span>
						Project Results
					</h3>
					<p
						class="font-poppins text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-12"
					>
						{$_(`projects.items.${project.slug}.sections.impact`)}
					</p>

					<div class="flex flex-wrap gap-8 items-center">
						<div class="flex items-center gap-3">
							<div class="w-2 h-2 rounded-full bg-blue-500"></div>
							<span class="text-sm font-bold uppercase tracking-widest text-gray-400"
								>Technical Result</span
							>
						</div>
						<div class="flex items-center gap-3">
							<div class="w-2 h-2 rounded-full bg-blue-500"></div>
							<span class="text-sm font-bold uppercase tracking-widest text-gray-400"
								>Production Ready</span
							>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- BALANCED CTA SECTION -->
		<footer class="text-center max-w-4xl mx-auto pt-32 lg:pt-48 border-t border-white/5">
			<h2 class="text-4xl lg:text-6xl font-black text-white mb-12">Impressed by the depth?</h2>
			<div class="flex flex-col sm:flex-row gap-6 justify-center">
				{#if project.link && project.link !== '#'}
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						class="magnetic-btn px-12 py-6 bg-blue-600 hover:bg-blue-500 text-xl font-bold text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all"
					>
						Launch Live Application
					</a>
				{/if}
				<a
					href="/contact"
					class="magnetic-btn px-12 py-6 glass-card border-white/10 hover:border-white/30 text-xl font-bold text-white rounded-2xl transition-all"
				>
					Start Your Project
				</a>
			</div>
		</footer>
	</div>
</div>

<style>
	:global(.font-poppins) {
		font-family: 'Poppins', sans-serif;
	}

	.text-glow-soft {
		text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
	}

	.glass-card {
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.aurora-bg {
		background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
			radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%);
		filter: blur(80px);
	}

	.grain-overlay {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
		filter: contrast(150%) brightness(100%);
	}

	.grid-lines {
		background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
		background-size: 50px 50px;
	}

	@media (max-width: 640px) {
		.hero-title {
			font-size: 15vw;
		}
	}
</style>
