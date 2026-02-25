import re

with open('src/routes/about/+page.svelte', 'r') as f:
    content = f.read()

# 1. Add state variables
state_vars = """		}
	]);

	let lineHeight = $state(0);
	let sparkY = $derived(lineHeight - 20);
	let pathData = $derived(
		lineHeight > 0
			? `M 40,0 C 20,${lineHeight * 0.2} 20,${lineHeight * 0.3} 40,${lineHeight * 0.5} C 60,${lineHeight * 0.7} 60,${lineHeight * 0.8} 40,${sparkY - 20} L 40,${sparkY - 15}`
			: ''
	);

	onMount(() => {"""
content = content.replace("		}\n	]);\n\n	onMount(() => {", state_vars)

# 2. Add GSAP code
gsap_code = """								}
							}
						);

						gsap.fromTo(
							'.timeline-svg-wrapper',
							{ height: '0%' },
							{
								height: '100%',
								ease: 'none',
								scrollTrigger: {
									trigger: '.timeline-container',
									start: 'top 50%',
									end: 'bottom 75%',
									scrub: true
								}
							}
						);
					}

					if (isMobile) {"""
content = content.replace("								}\n							}\n						);\n					}\n\n					if (isMobile) {", gsap_code)

# 3. Replace HTML
old_html = """				<!-- Elegant connecting line for desktop -->
				<div
					class="absolute left-[2.5rem] top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-purple-500/0 hidden sm:block"
				></div>"""

new_html = """				<!-- Animated SVG connecting line for desktop -->
				<div 
					class="absolute left-0 top-8 bottom-8 w-20 hidden sm:block pointer-events-none z-0" 
					bind:clientHeight={lineHeight}
				>
					<div class="timeline-svg-wrapper w-full absolute top-0 left-0 overflow-hidden" style="height: 0%;">
						<svg class="w-full" style="height: {lineHeight}px;" viewBox="0 0 80 {lineHeight}">
							<defs>
								<linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="rgb(59 130 246 / 0)" />
									<stop offset="10%" stop-color="rgb(59 130 246 / 0.8)" />
									<stop offset="80%" stop-color="rgb(168 85 247 / 0.8)" />
									<stop offset="100%" stop-color="rgb(168 85 247 / 1)" />
								</linearGradient>
								<filter id="glow">
									<feGaussianBlur stdDeviation="2" result="coloredBlur" />
									<feMerge>
										<feMergeNode in="coloredBlur" />
										<feMergeNode in="SourceGraphic" />
									</feMerge>
								</filter>
							</defs>

							<path
								d={pathData}
								fill="none"
								stroke="url(#line-gradient)"
								stroke-width="2"
							/>
							
							<!-- Spark/Diamond -->
							<g transform="translate(0, 0)">
								<polygon 
									points="40,{sparkY - 15} 48,{sparkY} 40,{sparkY + 15} 32,{sparkY}" 
									fill="none" 
									stroke="rgb(168 85 247)" 
									stroke-width="2" 
									filter="url(#glow)"
								/>
								<circle 
									cx="40" 
									cy="{sparkY}" 
									r="3" 
									fill="rgb(168 85 247)" 
									filter="url(#glow)"
								/>
							</g>
						</svg>
					</div>
				</div>"""
content = content.replace(old_html, new_html)

with open('src/routes/about/+page.svelte', 'w') as f:
    f.write(content)

