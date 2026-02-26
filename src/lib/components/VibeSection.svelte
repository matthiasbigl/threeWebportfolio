<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages.js';

	let vibeActive = $state(false);
	let sectionEl: HTMLElement | undefined = $state();
	let vibeBgTextEl = $state<HTMLElement>();
	let vibeLabelEl = $state<HTMLElement>();
	let vibeSvgWrapEl = $state<HTMLElement>();
	let vibeSvgGlowEl = $state<HTMLElement>();
	let vibeTitleEl = $state<HTMLElement>();
	let vibeSubtitleEl = $state<HTMLElement>();
	let vibeDescEl = $state<HTMLElement>();

	onMount(async () => {
		if (!browser) return;
		if (!sectionEl) return;

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
					if (vibeBgTextEl) {
						gsap.fromTo(
							vibeBgTextEl,
							{ xPercent: 10 },
							{
								xPercent: -10,
								ease: 'none',
								scrollTrigger: {
									trigger: sectionEl,
									start: 'top bottom',
									end: 'bottom top',
									scrub: 1
								}
							}
						);
					}

					gsap.fromTo(
						vibeLabelEl,
						{ opacity: 0, x: -30 },
						{
							opacity: 1,
							x: 0,
							duration: 0.8,
							ease: 'power3.out',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);

					gsap.fromTo(
						vibeSvgWrapEl,
						{ opacity: 0, scale: 0.7, y: 40, rotation: -10 },
						{
							opacity: 1,
							scale: 1,
							y: 0,
							rotation: 0,
							duration: 1.8,
							ease: 'power3.out',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);

					gsap.fromTo(
						vibeSvgGlowEl,
						{ opacity: 0 },
						{
							opacity: 0.8,
							duration: 2,
							delay: 0.5,
							ease: 'power2.inOut',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);

					const paths = sectionEl.querySelectorAll('.vibe-path');
					paths.forEach((path: any) => {
						const length = path.getTotalLength ? path.getTotalLength() : 1000;
						gsap.fromTo(
							path,
							{ strokeDasharray: length, strokeDashoffset: length },
							{
								strokeDashoffset: 0,
								duration: 2.5,
								ease: 'power2.out',
								scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
							}
						);
					});

					gsap.fromTo(
						sectionEl.querySelectorAll('.vibe-spark'),
						{ opacity: 0, scale: 0, transformOrigin: 'center' },
						{
							opacity: 1,
							scale: 1,
							duration: 1,
							stagger: 0.1,
							delay: 1.5,
							ease: 'back.out(2)',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);

					gsap.fromTo(
						sectionEl.querySelectorAll('.vibe-ray'),
						{ opacity: 0, scale: 0, svgOrigin: '100 95' },
						{
							opacity: 0.6,
							scale: 1,
							duration: 1,
							delay: 2,
							ease: 'back.out(2)',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);

					gsap.fromTo(
						vibeTitleEl,
						{ opacity: 0, y: 30 },
						{
							opacity: 1,
							y: 0,
							duration: 1,
							delay: 0.3,
							ease: 'power3.out',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);
					gsap.fromTo(
						vibeSubtitleEl,
						{ opacity: 0, y: 30 },
						{
							opacity: 1,
							y: 0,
							duration: 1,
							delay: 0.5,
							ease: 'power3.out',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);
					gsap.fromTo(
						vibeDescEl,
						{ opacity: 0, y: 30 },
						{
							opacity: 1,
							y: 0,
							duration: 1,
							delay: 0.7,
							ease: 'power3.out',
							scrollTrigger: { trigger: sectionEl, start: 'top 75%' }
						}
					);
				}

				if (isMobile) {
					if (vibeBgTextEl) {
						gsap.fromTo(
							vibeBgTextEl,
							{ xPercent: 5 },
							{
								xPercent: -5,
								ease: 'none',
								scrollTrigger: {
									trigger: sectionEl,
									start: 'top bottom',
									end: 'bottom top',
									scrub: 1
								}
							}
						);
					}

					gsap.fromTo(
						vibeLabelEl,
						{ opacity: 0, x: -20 },
						{
							opacity: 1,
							x: 0,
							duration: 0.6,
							ease: 'power3.out',
							scrollTrigger: { trigger: sectionEl, start: 'top 85%' }
						}
					);

					gsap.fromTo(
						vibeSvgWrapEl,
						{ opacity: 0, scale: 0.85, y: 20 },
						{
							opacity: 1,
							scale: 1,
							y: 0,
							duration: 1,
							ease: 'power3.out',
							scrollTrigger: { trigger: sectionEl, start: 'top 85%' }
						}
					);
					gsap.fromTo(
						vibeTitleEl,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.8,
							delay: 0.2,
							scrollTrigger: { trigger: sectionEl, start: 'top 85%' }
						}
					);
					gsap.fromTo(
						vibeSubtitleEl,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.8,
							delay: 0.3,
							scrollTrigger: { trigger: sectionEl, start: 'top 85%' }
						}
					);
					gsap.fromTo(
						vibeDescEl,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.8,
							delay: 0.4,
							scrollTrigger: { trigger: sectionEl, start: 'top 85%' }
						}
					);

					const paths = sectionEl.querySelectorAll('.vibe-path');
					paths.forEach((path: any) => {
						const length = path.getTotalLength ? path.getTotalLength() : 1000;
						gsap.fromTo(
							path,
							{ strokeDasharray: length, strokeDashoffset: length },
							{
								strokeDashoffset: 0,
								duration: 2,
								ease: 'power2.out',
								scrollTrigger: { trigger: sectionEl, start: 'top 85%' }
							}
						);
					});

					gsap.fromTo(
						sectionEl.querySelectorAll('.vibe-ray'),
						{ opacity: 0, scale: 0, svgOrigin: '100 95' },
						{
							opacity: 0.6,
							scale: 1,
							duration: 1,
							delay: 1.5,
							ease: 'back.out(2)',
							scrollTrigger: { trigger: sectionEl, start: 'top 85%' }
						}
					);
				}
			}
		);

		return () => {
			mm.revert();
		};
	});
</script>

<!-- Vibe Section — pinned scroll reveal with parallax -->
<section
	bind:this={sectionEl}
	class="vibe-section relative overflow-hidden py-20 sm:py-28 lg:py-36"
>
	<!-- Large background text -->
	<div
		class="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-0 overflow-hidden"
	>
		<span
			bind:this={vibeBgTextEl}
			class="vibe-bg-text font-syne font-black text-[30vw] md:text-[20vw] tracking-tighter whitespace-nowrap"
			style="color: var(--text-heading); opacity: 0.03;"
		>
			VIBE
		</span>
	</div>

	<!-- Ambient glow blobs -->
	<div class="absolute inset-0 z-0 pointer-events-none">
		<div
			class="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-[120px]"
		></div>
		<div
			class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/6 blur-[100px]"
		></div>
	</div>

	<div class="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12">
		<!--
			Mobile layout (flex-col, DOM order):  1) header  2) SVG  3) body text
			Desktop layout (lg:grid 12-col):       left col (header + body), right col (SVG spans both rows)
		-->
		<div
			class="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-center lg:items-start max-w-6xl mx-auto"
		>
			<!-- Text Header: label + title -->
			<div class="lg:col-start-1 lg:col-span-7 lg:row-start-1 flex flex-col justify-center">
				<!-- Section label -->
				<div class="flex items-center gap-3 mb-6 vibe-label" bind:this={vibeLabelEl}>
					<div class="h-px w-10 md:w-12 bg-gradient-to-r from-blue-500 to-purple-500"></div>
					<span
						class="font-syne text-blue-500 text-xs md:text-sm font-bold uppercase tracking-[0.3em]"
					>
						{m['vibe.title']()}
					</span>
				</div>

				<h2
					bind:this={vibeTitleEl}
					class="vibe-title font-syne text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 tracking-tight leading-[1.1]"
					style="color: var(--text-heading);"
				>
					&bdquo;{m['vibe.titleHighlight']()}&ldquo;
				</h2>
			</div>

			<!-- SVG Container: mobile order 2, desktop col 8-12 spanning both text rows -->
			<div
				class="lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:row-span-2 flex flex-col items-center lg:items-end mt-0 lg:mt-0"
			>
				<div
					bind:this={vibeSvgWrapEl}
					class="vibe-svg-wrap relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex justify-center items-center"
					class:vibe-active={vibeActive}
					onclick={() => {
						if (window.matchMedia('(hover: none)').matches) vibeActive = !vibeActive;
					}}
					role="button"
					tabindex="0"
					onkeydown={(e) => {
						if ((e.key === 'Enter' || e.key === ' ') && window.matchMedia('(hover: none)').matches)
							vibeActive = !vibeActive;
					}}
					aria-label={m['vibe.hint.tap']()}
				>
					<!-- Glow effect behind SVG -->
					<div
						bind:this={vibeSvgGlowEl}
						class="vibe-svg-glow absolute inset-0 rounded-full blur-3xl opacity-0 bg-blue-500/40"
					></div>

					<!-- Swirly Lightbulb SVG -->
					<svg
						viewBox="-10 -10 220 220"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
						style="overflow: visible;"
					>
						<g class="vibe-bulb-group">
							<!-- Bulb outline -->
							<path
								class="vibe-path"
								d="M100 20 C 135 20, 160 50, 160 90 C 160 120, 140 140, 125 160 L 75 160 C 60 140, 40 120, 40 90 C 40 50, 65 20, 100 20 Z"
								stroke="url(#vibe-grad)"
								stroke-width="5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<!-- Base lines -->
							<path
								class="vibe-path"
								d="M85 168 L 115 168 M 88 178 L 112 178 M 95 188 L 105 188"
								stroke="url(#vibe-grad)"
								stroke-width="5"
								stroke-linecap="round"
							/>
							<!-- Swirly filament -->
							<path
								class="vibe-path vibe-filament"
								d="M90 150 C 90 120, 130 110, 110 80 C 90 50, 70 100, 110 110 C 130 115, 110 150, 110 150"
								stroke="url(#vibe-grad)"
								stroke-width="4"
								stroke-linecap="round"
							/>
							<!-- Small sparks/stars (inner ring) -->
							<g class="vibe-sparks-group">
								<path
									class="vibe-spark"
									d="M30 40 L 40 50 M 170 40 L 160 50 M 100 0 L 100 10 M 15 90 L 25 90 M 185 90 L 175 90"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
								/>
							</g>
							<!-- Outer light rays (wrapped in group for hover scale) -->
							<g class="vibe-rays-group">
								<path
									class="vibe-ray"
									d="M50 -10 L56 2"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
								<path
									class="vibe-ray"
									d="M150 -10 L144 2"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
								<path
									class="vibe-ray"
									d="M-2 55 L10 58"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
								<path
									class="vibe-ray"
									d="M202 55 L190 58"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
								<path
									class="vibe-ray"
									d="M8 130 L20 125"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
								<path
									class="vibe-ray"
									d="M192 130 L180 125"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
								<path
									class="vibe-ray"
									d="M55 155 L62 148"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
								<path
									class="vibe-ray"
									d="M145 155 L138 148"
									stroke="url(#vibe-grad)"
									stroke-width="3"
									stroke-linecap="round"
									opacity="0.6"
									fill="none"
								/>
							</g>
						</g>
						<defs>
							<linearGradient
								id="vibe-grad"
								x1="40"
								y1="20"
								x2="160"
								y2="188"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#3B82F6" />
								<stop offset="1" stop-color="#8B5CF6" />
							</linearGradient>
							<linearGradient
								id="vibe-warm"
								x1="90"
								y1="150"
								x2="110"
								y2="50"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#FDE68A" />
								<stop offset="0.5" stop-color="#FFFBEB" />
								<stop offset="1" stop-color="#FDE68A" />
							</linearGradient>
							<filter id="vibe-filament-glow" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
								<feMerge>
									<feMergeNode in="blur" />
									<feMergeNode in="blur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>
							<filter id="vibe-ray-glow" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
								<feMerge>
									<feMergeNode in="blur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>
						</defs>
					</svg>
				</div>
				<!-- Interaction hint -->
				<p class="vibe-hint mt-3 text-xs font-medium opacity-50 select-none pointer-events-none">
					<span class="vibe-hint-tap">{m['vibe.hint.tap']()}</span>
					<span class="vibe-hint-hover">{m['vibe.hint.hover']()}</span>
				</p>
			</div>

			<!-- Text Body: subtitle + description -->
			<div class="lg:col-start-1 lg:col-span-7 lg:row-start-2 flex flex-col justify-center">
				<p
					bind:this={vibeSubtitleEl}
					class="vibe-subtitle text-xl sm:text-2xl font-medium mb-6 leading-relaxed max-w-2xl"
					style="color: var(--text-heading);"
				>
					{m['vibe.subtitle']()}
				</p>

				<p
					bind:this={vibeDescEl}
					class="vibe-desc text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-2xl"
					style="color: var(--text-secondary);"
				>
					{m['vibe.description']()}
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	/* Vibe SVG hover — desktop only */
	@media (min-width: 1024px) {
		.vibe-rays-group {
			transform-origin: 100px 95px;
			transition:
				transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
				opacity 0.5s ease,
				filter 0.5s ease;
		}

		.vibe-svg-wrap:hover .vibe-rays-group {
			transform: scale(1.35);
			opacity: 1;
			filter: url(#vibe-ray-glow);
		}

		.vibe-sparks-group {
			transform-origin: 100px 95px;
			transition:
				transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
				filter 0.5s ease;
		}

		.vibe-svg-wrap:hover .vibe-sparks-group {
			transform: scale(1.2);
			filter: url(#vibe-ray-glow);
		}

		.vibe-filament {
			transition:
				stroke 0.4s ease,
				filter 0.4s ease,
				stroke-width 0.4s ease;
		}

		.vibe-svg-wrap:hover .vibe-filament {
			stroke: url(#vibe-warm);
			stroke-width: 5;
			filter: url(#vibe-filament-glow);
		}
	}

	/* Vibe SVG touch toggle — mobile */
	@media (hover: none) {
		.vibe-rays-group {
			transform-origin: 100px 95px;
			transition:
				transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
				opacity 0.5s ease,
				filter 0.5s ease;
		}

		.vibe-svg-wrap.vibe-active .vibe-rays-group {
			transform: scale(1.35);
			opacity: 1;
			filter: url(#vibe-ray-glow);
		}

		.vibe-sparks-group {
			transform-origin: 100px 95px;
			transition:
				transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
				filter 0.5s ease;
		}

		.vibe-svg-wrap.vibe-active .vibe-sparks-group {
			transform: scale(1.2);
			filter: url(#vibe-ray-glow);
		}

		.vibe-filament {
			transition:
				stroke 0.4s ease,
				filter 0.4s ease,
				stroke-width 0.4s ease;
		}

		.vibe-svg-wrap.vibe-active .vibe-filament {
			stroke: url(#vibe-warm);
			stroke-width: 5;
			filter: url(#vibe-filament-glow);
		}
	}

	/* Interaction hint visibility */
	.vibe-hint-hover {
		display: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.vibe-hint-tap {
			display: none;
		}

		.vibe-hint-hover {
			display: inline;
		}
	}
</style>
