const fs = require('fs');
const file = fs.readFileSync('src/routes/about/+page.svelte', 'utf-8');

const newHTML = `
				<!-- Animated SVG connecting line for desktop -->
				<div class="absolute left-[2.5rem] top-8 bottom-8 w-20 hidden sm:block pointer-events-none z-0" bind:clientHeight={lineHeight}>
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
									<feGaussianBlur stdDeviation="2" result="coloredBlur"/>
									<feMerge>
										<feMergeNode in="coloredBlur"/>
										<feMergeNode in="SourceGraphic"/>
									</feMerge>
								</filter>
							</defs>

							<path
								d={pathData}
								fill="none"
								stroke="url(#line-gradient)"
								stroke-width="2"
								vector-effect="non-scaling-stroke"
							/>
							<!-- Spark/Diamond -->
							<g transform="translate(0, 0)">
								<polygon points="40,{sparkY - 15} 48,{sparkY} 40,{sparkY + 15} 32,{sparkY}" fill="none" stroke="rgb(168 85 247)" stroke-width="2" filter="url(#glow)"/>
								<circle cx="40" cy="{sparkY}" r="3" fill="rgb(168 85 247)" filter="url(#glow)"/>
							</g>
						</svg>
					</div>
				</div>
`;

console.log('Looks good');
