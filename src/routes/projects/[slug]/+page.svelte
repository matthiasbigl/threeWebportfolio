<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
		import CustomCursor from '$lib/components/CustomCursor.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import Button from '$lib/components/Button.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import deLocale from '$lib/i18n/locales/de.json';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

// Helper for dynamic project message keys
function projectMsg(slug: string, field: string): string {
const key = `projects.items.${slug}.${field}`;
return (m as unknown as Record<string, (() => string) | undefined>)[key]?.() ?? '';
}

// Helper for array-valued project messages (newline-separated)
function projectMsgArray(slug: string, field: string): string[] {
const val = projectMsg(slug, field);
return val ? val.split('\n') : [];
}

	const project = data.project;

	let heroSection: HTMLElement | undefined = $state();
	let chapterIndex = $state(0);

	const statusKey = $derived(
		projectMsg(project.slug, "status") === 'live'
			? 'statusLive'
			: projectMsg(project.slug, "status") === 'prototype'
				? 'statusPrototype'
				: 'statusDevelopment'
	);

	onMount(async () => {
		if (!browser) return;

		if ($reducedMotion) return;

		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const mm = gsap.matchMedia();

		mm.add(
			{
				reduce: '(prefers-reduced-motion: reduce)'
			},
			(context) => {
				if (context.conditions?.reduce) return;

				// --- HERO entrance choreography ---
				const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

				heroTl
					.fromTo('.navbar-sub', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 })
					.fromTo(
						'.hero-overline',
						{ opacity: 0, y: 20, scale: 0.95 },
						{ opacity: 1, y: 0, scale: 1, duration: 0.8 },
						'-=0.3'
					)
					.fromTo(
						'.hero-title-main',
						{ opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
						{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.2 },
						'-=0.4'
					)
					.fromTo(
						'.hero-title-sub',
						{ opacity: 0, y: 30 },
						{ opacity: 1, y: 0, duration: 0.8 },
						'-=0.6'
					)
					.fromTo(
						'.hero-tagline',
						{ opacity: 0, y: 20 },
						{ opacity: 1, y: 0, duration: 0.9 },
						'-=0.4'
					)
					.fromTo(
						'.hero-meta-item',
						{ opacity: 0, y: 15 },
						{ opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
						'-=0.5'
					);

				// --- Parallax hero background ---
				if (heroSection) {
					gsap.to('.hero-accent-orb', {
						y: -80,
						scrollTrigger: {
							trigger: heroSection,
							start: 'top top',
							end: 'bottom top',
							scrub: 1.5
						}
					});
				}

				// --- Chapter reveals ---
				gsap.utils.toArray<HTMLElement>('.chapter-block').forEach((el, i) => {
					gsap.fromTo(
						el,
						{ opacity: 0, y: 50 },
						{
							opacity: 1,
							y: 0,
							duration: 1,
							ease: 'power3.out',
							scrollTrigger: {
								trigger: el,
								start: 'top 85%',
								end: 'top 45%',
								toggleActions: 'play none none reverse',
								onEnter: () => (chapterIndex = i + 1)
							}
						}
					);
				});

				// --- Feature cards stagger ---
				gsap.fromTo(
					'.feature-card',
					{ opacity: 0, y: 40, rotateX: 5 },
					{
						opacity: 1,
						y: 0,
						rotateX: 0,
						stagger: 0.1,
						duration: 0.8,
						ease: 'back.out(1.4)',
						scrollTrigger: {
							trigger: '.features-grid',
							start: 'top 85%'
						}
					}
				);

				// --- Tech stack entrance ---
				gsap.fromTo(
					'.tech-pill',
					{ opacity: 0, scale: 0.8 },
					{
						opacity: 1,
						scale: 1,
						stagger: 0.06,
						duration: 0.5,
						ease: 'back.out(2)',
						scrollTrigger: {
							trigger: '.tech-stack-row',
							start: 'top 90%'
						}
					}
				);

				// --- CTA section ---
				gsap.fromTo(
					'.cta-block',
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 1,
						ease: 'power3.out',
						scrollTrigger: { trigger: '.cta-block', start: 'top 88%' }
					}
				);

				// --- Project image reveal ---
				gsap.fromTo(
					'.project-image-section',
					{ opacity: 0, y: 40, scale: 0.98 },
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 1.2,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: '.project-image-section',
							start: 'top 90%'
						}
					}
				);
			}
		);

		return () => mm.revert();
	});

	// ─── Static German locale data for SEO (avoids duplicate <head> on hydration) ───
	const deProject = (deLocale.projects.items as Record<string, any>)[project.slug] ?? {};

	// ─── CreativeWork structured data for each project ───
	const projectSchema = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: deProject.title ?? project.slug,
		description: deProject.description ?? '',
		url: `https://bigls.net/projects/${project.slug}`,
		image:
			typeof project.image === 'string'
				? project.image.startsWith('http')
					? project.image
					: `https://bigls.net/${project.image}`
				: `https://bigls.net/assets/${project.slug}.png`,
		author: {
			'@type': 'Person',
			'@id': 'https://bigls.net/#person',
			name: 'Matthias Bigl'
		},
		creator: {
			'@type': 'Person',
			'@id': 'https://bigls.net/#person',
			name: 'Matthias Bigl'
		},
		dateCreated: project.year,
		genre: project.category,
		keywords: (deProject.tags ?? []).join(', '),
		isPartOf: {
			'@type': 'WebSite',
			'@id': 'https://bigls.net/#website'
		}
	};
</script>

<SEO
	title="{deProject.title ?? project.slug} – Case Study | Matthias Bigl"
	description={`${deProject.description ?? ''} – Ein Projekt von Matthias Bigl, Webdesigner & Full Stack Developer aus Wien/Korneuburg.`}
	url="https://bigls.net/projects/{project.slug}"
	type="article"
	keywords={[
		...(deProject.tags ?? []),
		'Matthias Bigl',
		'Matthias Bigl Projekt',
		'Matthias Bigl Portfolio',
		'Case Study',
		project.slug,
		project.category
	]}
	breadcrumbs={[
		{ name: 'Matthias Bigl', url: 'https://bigls.net' },
		{ name: 'Portfolio', url: 'https://bigls.net/#projects' },
		{ name: deProject.title ?? project.slug, url: `https://bigls.net/projects/${project.slug}` }
	]}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(projectSchema)}</script>`}
</svelte:head>

<CustomCursor />
<ScrollProgress />

<article
	class="project-detail-page relative min-h-dvh overflow-hidden selection:bg-blue-500/20"
	style="background: var(--bg-body); color: var(--text-primary);"
>
	<!-- Atmospheric layers -->
	<div class="fixed inset-0 z-0 pointer-events-none page-grain"></div>
	<div class="fixed inset-0 z-0 pointer-events-none opacity-[0.02] dot-grid"></div>

	<!-- HERO — Full-viewport editorial opener -->
	<section
		bind:this={heroSection}
		class="relative flex flex-col px-5 sm:px-8 lg:px-16 pb-10 sm:pb-16 lg:pb-24 pt-24 sm:pt-32 lg:pt-40"
	>
		<!-- Accent orbs -->
		<div
			class="hero-accent-orb absolute -top-32 -right-32 sm:-top-40 sm:-right-40 w-[400px] sm:w-[600px] lg:w-[700px] h-[400px] sm:h-[600px] lg:h-[700px] rounded-full blur-[120px] sm:blur-[180px] opacity-20 pointer-events-none bg-gradient-to-br from-blue-500/30 via-blue-600/15 to-indigo-500/10"
		></div>
		<div
			class="hero-accent-orb absolute -bottom-20 -left-32 sm:-left-60 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[160px] opacity-10 pointer-events-none bg-gradient-to-tr from-blue-400/20 to-purple-500/10"
		></div>

		<!-- Hero content -->
		<div class="relative z-10 max-w-6xl mx-auto w-full">
			<!-- Overline -->
			<div class="hero-overline flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
				<span class="hidden sm:inline-block w-10 sm:w-12 h-px bg-blue-500/30"></span>
				<span
					class="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-blue-400/60 font-syne"
					>{project.category}</span
				>
				<span
					class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
					{(m as unknown as Record<string, (() => string) | undefined>)[`projectDetail.${statusKey}`]?.() ?? ""}
				</span>
			</div>

			<!-- Title cluster -->
			<h1
				class="hero-title-main font-syne text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold leading-[0.9] tracking-[-0.03em] mb-1 sm:mb-2 break-words"
				style="color: var(--text-heading);"
			>
				{projectMsg(project.slug, "title")}
			</h1>
			<h2
				class="hero-title-sub font-syne text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-blue-400/40 tracking-[-0.02em] mb-6 sm:mb-10"
			>
				{projectMsg(project.slug, "subtitle")}
			</h2>

			<!-- Tagline -->
			<p
				class="hero-tagline max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed font-light mb-8 sm:mb-12 lg:mb-16"
				style="color: var(--text-secondary);"
			>
				{projectMsg(project.slug, "tagline")}
			</p>

			<!-- Meta row -->
			<div
				class="flex flex-wrap gap-x-6 sm:gap-x-10 lg:gap-x-12 gap-y-4 pt-6 sm:pt-8"
				style="border-top: 1px solid var(--border-primary);"
			>
				<div class="hero-meta-item min-w-0">
					<span
						class="block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-blue-500/40 mb-1 sm:mb-1.5 font-syne"
						>{m["projectDetail.metaRole"]()}</span
					>
					<span class="text-xs sm:text-sm font-medium" style="color: var(--text-secondary);"
						>{projectMsg(project.slug, "role")}</span
					>
				</div>
				<div class="hero-meta-item">
					<span
						class="block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-blue-500/40 mb-1 sm:mb-1.5 font-syne"
						>{m["projectDetail.metaTimeline"]()}</span
					>
					<span class="text-xs sm:text-sm font-medium" style="color: var(--text-secondary);">
						<time>{projectMsg(project.slug, "timeline")}</time>
					</span>
				</div>
				<div class="hero-meta-item">
					<span
						class="block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-blue-500/40 mb-1 sm:mb-1.5 font-syne"
						>{m["projectDetail.metaType"]()}</span
					>
					<span class="text-xs sm:text-sm font-medium" style="color: var(--text-secondary);"
						>{projectMsg(project.slug, "type")}</span
					>
				</div>
			</div>
		</div>
	</section>

	<!-- PROJECT IMAGE — Cinematic visual showcase -->
	{#if project.image}
		<figure
			class="project-image-section relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16"
		>
			<div
				class="relative group rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden"
				style="border: 1px solid var(--border-primary); background: var(--bg-surface);"
			>
				<!-- Subtle reflection glow -->
				<div
					class="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)] via-transparent to-transparent z-10 pointer-events-none opacity-40"
				></div>

				{#if typeof project.image === 'object'}
					<enhanced:img
						src={project.image}
						alt={m["a11y.projectImageAlt"]({ project: projectMsg(project.slug, "title") })}
						class="w-full aspect-video object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
						style="background: var(--bg-inset);"
						loading="eager"
					/>
				{:else}
					<img
						src={project.image}
						alt={m["a11y.projectImageAlt"]({ project: projectMsg(project.slug, "title") })}
						class="w-full aspect-video object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
						style="background: var(--bg-inset);"
						loading="eager"
					/>
				{/if}

				<!-- Corner accent -->
				<div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
					<div
						class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center backdrop-blur-md"
						style="border: 1px solid var(--border-primary); background: var(--glass-bg);"
					>
						<svg
							class="w-3.5 h-3.5 sm:w-4 sm:h-4"
							style="color: var(--text-tertiary);"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</figure>
	{/if}

	<!-- NARRATIVE CHAPTERS — Alternating editorial layout -->
	{#if projectMsg(project.slug, "sections")}
		<div class="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">
			<!-- Chapter 01 — Vision -->
			<article
				class="chapter-block py-16 sm:py-24 lg:py-32"
				style="border-top: 1px solid var(--border-primary);"
			>
				<div class="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start">
					<header class="lg:col-span-4 flex lg:flex-col items-center lg:items-start gap-3 sm:gap-4">
						<span
							class="text-5xl sm:text-7xl lg:text-[100px] font-syne font-black leading-none select-none shrink-0"
							style="color: var(--text-heading); opacity: 0.10;">01</span
						>
						<h3
							class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-blue-400 font-syne"
						>
							{m["projectDetail.chapterVision"]()}
						</h3>
					</header>
					<div class="lg:col-span-8">
						<p
							class="font-syne text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-[1.25] tracking-tight"
							style="color: var(--text-heading); opacity: 0.9;"
						>
							{projectMsg(project.slug, "sections.context")}
						</p>
					</div>
				</div>
			</article>

			<!-- Chapter 02 — Challenge -->
			<article
				class="chapter-block py-16 sm:py-24 lg:py-32"
				style="border-top: 1px solid var(--border-primary);"
			>
				<div class="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start">
					<header
						class="lg:col-span-4 lg:order-2 flex lg:flex-col items-center lg:items-end gap-3 sm:gap-4"
					>
						<span
							class="text-5xl sm:text-7xl lg:text-[100px] font-syne font-black leading-none select-none shrink-0"
							style="color: var(--text-heading); opacity: 0.10;">02</span
						>
						<h3
							class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-blue-400 font-syne lg:text-right"
						>
							{m["projectDetail.chapterChallenge"]()}
						</h3>
					</header>
					<div class="lg:col-span-8 lg:order-1">
						<p
							class="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold leading-snug tracking-tight"
							style="color: var(--text-heading); opacity: 0.8;"
						>
							{projectMsg(project.slug, "sections.problem")}
						</p>
					</div>
				</div>
			</article>

			<!-- Chapter 03 — Craft -->
			<article
				class="chapter-block py-16 sm:py-24 lg:py-32"
				style="border-top: 1px solid var(--border-primary);"
			>
				<div class="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start">
					<header class="lg:col-span-4 flex lg:flex-col items-center lg:items-start gap-3 sm:gap-4">
						<span
							class="text-5xl sm:text-7xl lg:text-[100px] font-syne font-black leading-none select-none shrink-0"
							style="color: var(--text-heading); opacity: 0.10;">03</span
						>
						<h3
							class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-blue-400 font-syne"
						>
							{m["projectDetail.chapterCraft"]()}
						</h3>
					</header>
					<div class="lg:col-span-8">
						<p
							class="text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed"
							style="color: var(--text-secondary);"
						>
							{projectMsg(project.slug, "sections.solution")}
						</p>
					</div>
				</div>
			</article>

			<!-- Chapter 04 — Outcome -->
			<article
				class="chapter-block py-20 sm:py-28 lg:py-36"
				style="border-top: 1px solid var(--border-primary);"
			>
				<section
					class="relative p-8 sm:p-12 lg:p-20 xl:p-28 rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600/[0.08] via-blue-500/[0.04] to-indigo-600/[0.06] border border-blue-500/10"
				>
					<!-- Glow -->
					<div
						class="absolute -right-16 -bottom-16 sm:-right-24 sm:-bottom-24 w-60 sm:w-96 h-60 sm:h-96 rounded-full blur-[100px] sm:blur-[160px] opacity-25 pointer-events-none bg-blue-500"
					></div>
					<div
						class="absolute -left-16 -top-16 sm:-left-24 sm:-top-24 w-48 sm:w-72 h-48 sm:h-72 rounded-full blur-[80px] sm:blur-[130px] opacity-15 pointer-events-none bg-indigo-500"
					></div>

					<div class="relative z-10">
						<!-- Number + Label -->
						<header class="flex items-end gap-4 sm:gap-6 mb-6 sm:mb-8">
							<span
								class="text-5xl sm:text-7xl lg:text-[100px] font-syne font-black leading-none select-none"
								style="color: var(--text-heading); opacity: 0.12;">04</span
							>
							<h3
								class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-blue-400 font-syne pb-2 sm:pb-3 lg:pb-5"
							>
								{m["projectDetail.chapterOutcome"]()}
							</h3>
						</header>

						<!-- Divider -->
						<div
							class="w-16 sm:w-24 h-px bg-gradient-to-r from-blue-500/40 to-transparent mb-8 sm:mb-12 lg:mb-16"
						></div>

						<!-- Impact text -->
						<p
							class="font-syne text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium leading-[1.35] sm:leading-[1.3] tracking-tight max-w-4xl"
							style="color: var(--text-heading); opacity: 0.9;"
						>
							{projectMsg(project.slug, "sections.impact")}
						</p>
					</div>
				</section>
			</article>
		</div>
	{/if}

	<!-- TECH STACK — Horizontal ribbon -->
	<section
		class="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24"
		style="border-top: 1px solid var(--border-primary);"
	>
		<div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 lg:gap-16">
			<h3
				class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] font-syne whitespace-nowrap shrink-0"
				style="color: var(--text-tertiary);"
			>
				{m["projectDetail.techStackLabel"]()}
			</h3>
			<div class="tech-stack-row flex flex-wrap gap-2 sm:gap-3">
				{#each projectMsgArray(project.slug, "technologies") as tech}
					<span
						class="tech-pill px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-500/[0.06] text-blue-400/80 border border-blue-500/10 transition-all duration-300 cursor-default hover:-translate-y-0.5 hover:border-blue-500/25 hover:text-blue-400 hover:shadow-[0_0_16px_rgba(59,130,246,0.1)]"
					>
						{tech}
					</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- FEATURES — Cards grid -->
	{#if projectMsg(project.slug, "features")}
		<section class="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 pb-20 sm:pb-32 lg:pb-40">
			<div class="mb-10 sm:mb-16 lg:mb-20">
				<h2
					class="font-syne text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight"
					style="color: var(--text-heading);"
				>
					{m["projectDetail.featuresTitle"]()}
				</h2>
			</div>

			<div
				class="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
			>
				{#each projectMsgArray(project.slug, "features") as feature, i}
					<article
						class="feature-card group relative p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl transition-all duration-500 overflow-hidden"
						style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
						class:sm:row-span-2={i === 0}
					>
						<!-- Hover glow -->
						<div
							class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl sm:rounded-2xl bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.06)_0%,_transparent_70%)]"
						></div>

						<!-- Number -->
						<span
							class="relative z-10 block text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6 font-syne text-blue-500/70"
						>
							{String(i + 1).padStart(2, '0')}
						</span>

						<h4
							class="relative z-10 text-base sm:text-lg lg:text-xl xl:text-2xl font-bold group-hover:text-blue-400 leading-tight transition-colors duration-300 mb-4 sm:mb-6"
							style="color: var(--text-heading); opacity: 0.8;"
						>
							{feature}
						</h4>

						<!-- Animated bar -->
						<div
							class="relative z-10 h-px w-8 bg-blue-500/40 group-hover:w-full group-hover:bg-blue-500 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
						></div>
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<!-- CTA FOOTER -->
	<footer
		class="cta-block relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 pb-20 sm:pb-32 lg:pb-40"
	>
		<div style="border-top: 1px solid var(--border-primary);" class="pt-12 sm:pt-16 lg:pt-24">
			<div
				class="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 lg:items-end lg:justify-between"
			>
				<div class="max-w-xl">
					<h2
						class="font-syne text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1] mb-4 sm:mb-6"
						style="color: var(--text-heading);"
					>
						{m["projectDetail.ctaTitle"]()}
					</h2>
				</div>
				<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
					{#if project.link && project.link !== '#'}
						<Button
							href={project.link}
							external
							variant="primary"
							className="!px-6 sm:!px-8 !py-3.5 sm:!py-4 !text-sm sm:!text-base !rounded-full !font-syne !tracking-wide"
						>
							{m["projectDetail.ctaLaunch"]()} →
						</Button>
					{/if}
					<Button
						href="/contact"
						variant="secondary"
						className="!px-6 sm:!px-8 !py-3.5 sm:!py-4 !text-sm sm:!text-base !rounded-full !font-syne !tracking-wide hover:!border-blue-500/30"
					>
						{m["projectDetail.ctaContact"]()}
					</Button>
				</div>
			</div>
		</div>
	</footer>
</article>

<style>
	.page-grain {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		opacity: 0.035;
		mix-blend-mode: overlay;
	}

	.dot-grid {
		background-image: radial-gradient(
			circle,
			var(--grid-dot-color, rgba(255, 255, 255, 0.4)) 0.5px,
			transparent 0.5px
		);
		background-size: 32px 32px;
	}

	/* Chapter number watermark effect */
	.chapter-block {
		perspective: 800px;
	}

	/* Feature card hover lift */
	.feature-card:hover {
		transform: translateY(-4px);
		border-color: var(--border-accent) !important;
	}

	/* Tech pill hover */
	.tech-pill:hover {
		filter: brightness(1.2);
	}

	/* Project image cinematic frame */
	.project-image-section img {
		transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.project-image-section:hover img {
		transform: scale(1.02);
	}
</style>
