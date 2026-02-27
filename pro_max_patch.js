import fs from 'fs';
const content = fs.readFileSync('src/lib/components/Services.svelte', 'utf-8');

const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('<!-- ALL IN ONE SERVICE BENTO CARD -->') || l.includes('<!-- PRO MAX ALL IN ONE CARD -->'));
let endIdx = -1;
for (let i = startIdx + 1; i < lines.length; i++) {
	if (lines[i].includes('</section>')) {
		endIdx = i - 1;
		break;
	}
}

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find boundaries.", startIdx, endIdx);
  process.exit(1);
}

const replacement = `		<!-- ULTRA PRO MAX HYPER CARD -->
		<div class="all-in-one-card relative w-full min-h-[800px] lg:min-h-[900px] rounded-[3rem] lg:rounded-[4.5rem] overflow-hidden group mb-16 lg:mb-28 isolate bg-black border border-white/5 transition-all duration-700 hover:scale-[1.01] hover:shadow-[0_40px_120px_-20px_rgba(168,85,247,0.4)]">
			
			<!-- HYPER BACKGROUND SYSTEM -->
			<div class="absolute inset-0 -z-30 overflow-hidden">
				<!-- Core Neon Gradients -->
				<div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#1e1b4b_0%,#000000_60%)]"></div>
				<div class="absolute -top-[20%] -right-[10%] w-[70rem] h-[70rem] bg-purple-600/30 blur-[140px] rounded-full animate-pulse"></div>
				<div class="absolute -bottom-[20%] -left-[10%] w-[60rem] h-[60rem] bg-blue-600/30 blur-[130px] rounded-full animate-pulse" style="animation-delay: 2s;"></div>
				<div class="absolute top-[40%] left-[20%] w-[40rem] h-[40rem] bg-pink-600/20 blur-[120px] rounded-full animate-pulse" style="animation-delay: 4s;"></div>
				
				<!-- Animated Mesh Grid -->
				<div class="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
					<div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
				</div>

				<!-- Noise and Grain -->
				<div class="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.4] mix-blend-overlay"></div>
			</div>

			<!-- FLOATING BACKGROUND CHIPS -->
			<div class="absolute inset-0 -z-20 pointer-events-none hidden lg:block">
				{#each floatingFeatures as feat, i}
					<div 
						class="floating-feature absolute px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 shadow-2xl"
						style="left: \${[10, 80, 15, 75, 45, 85, 5][i]}%; top: \${[15, 10, 75, 85, 5, 45, 60][i]}%;"
					>
						<feat.icon class="w-5 h-5 \${feat.color}" />
						<span class="font-syne text-xs font-bold text-white/60 tracking-wider uppercase">\${feat.text}</span>
					</div>
				{/each}
			</div>

			<!-- MAIN CONTENT GRID -->
			<div class="relative z-10 flex flex-col items-center justify-center h-full p-8 sm:p-12 lg:p-24 text-center">
				
				<!-- TOP BADGE -->
				<div class="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 mb-12 shadow-2xl group-hover:border-purple-500/50 transition-colors duration-500">
					<div class="flex -space-x-2">
						{#each [Rocket, Zap, Sparkles] as Icon}
							<div class="w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center">
								<Icon class="w-4 h-4 text-purple-400" />
							</div>
						{/each}
					</div>
					<span class="font-syne text-[11px] sm:text-xs uppercase tracking-[0.3em] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
						Professional Elite Tier
					</span>
				</div>

				<!-- MAIN HEADLINE -->
				<h3 class="font-syne text-6xl sm:text-8xl lg:text-[10rem] font-black tracking-tighter text-white leading-[0.85] mb-12 uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
					{m['services.allInOne.title']()}
				</h3>

				<p class="font-syne text-xl sm:text-2xl lg:text-3xl font-bold text-white/70 max-w-4xl mb-16 leading-tight tracking-tight">
					{m['services.allInOne.tagline']()}
				</p>

				<!-- CENTERED ACTION PANEL -->
				<div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
					
					<!-- FEATURES PANEL -->
					<div class="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-10 lg:p-14 text-left relative overflow-hidden group/panel shadow-2xl">
						<div class="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full"></div>
						
						<h4 class="font-syne text-4xl font-black text-white mb-10 flex items-center gap-5 uppercase tracking-tighter">
							<Eye class="w-10 h-10 text-purple-400" />
							Features
						</h4>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{#each m['services.allInOne.features']().split('\n') as feature, i}
								<div class="flex items-center gap-5 group/item">
									<div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white/10 group-hover/item:border-purple-500/50 transition-all duration-300">
										<Check class="w-6 h-6 text-purple-400" />
									</div>
									<span class="font-syne text-lg font-bold text-white/80 group-hover/item:text-white transition-colors">
										{feature}
									</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- PROCESS PANEL -->
					<div class="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-10 lg:p-14 text-left relative overflow-hidden group/panel shadow-2xl">
						<div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>

						<h4 class="font-syne text-4xl font-black text-white mb-10 flex items-center gap-5 uppercase tracking-tighter">
							<Layers class="w-10 h-10 text-blue-400" />
							The Flow
						</h4>

						<div class="space-y-8 relative">
							<!-- Vertical Line -->
							<div class="absolute left-6 top-0 bottom-0 w-px bg-white/10"></div>

							{#each processSteps as step, i}
								<div class="relative pl-16 group/step">
									<!-- Step Icon Node -->
									<div class="absolute left-0 top-0 w-12 h-12 rounded-full bg-black border-2 border-white/10 flex items-center justify-center group-hover/step:border-blue-400 group-hover/step:scale-110 transition-all duration-300 z-10">
										<step.icon class="w-5 h-5 text-white/40 group-hover/step:text-blue-400" />
									</div>
									
									<h5 class="font-syne text-xl font-black text-white group-hover/step:text-blue-400 transition-colors uppercase tracking-tight">
										{step.title}
									</h5>
									<p class="font-syne text-sm font-bold text-white/50 leading-snug">
										{step.desc}
									</p>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- FLOATING CTA BUTTON -->
				<div class="mt-20 relative group/btn">
					<div class="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 group-hover/btn:opacity-100 transition-opacity duration-700 animate-pulse"></div>
					<a 
						href={localizeHref('/contact')} 
						class="relative flex items-center gap-8 bg-white text-black px-12 py-8 rounded-full font-syne font-black text-3xl uppercase tracking-tighter hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.3)] isolate overflow-hidden"
					>
						<span class="relative z-10">Ignite Your Vision</span>
						<div class="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white transition-transform duration-500 group-hover:rotate-[360deg] relative z-10">
							<ChevronRight class="w-8 h-8" />
						</div>
						
						<!-- Hover Shine Effect -->
						<div class="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45 group-hover:left-full transition-all duration-1000 ease-in-out"></div>
					</a>
				</div>
			</div>
		</div>`;

const newLines = [
  ...lines.slice(0, startIdx),
  replacement,
  ...lines.slice(endIdx + 1)
];

fs.writeFileSync('src/lib/components/Services.svelte', newLines.join('\n'));
console.log('Replaced successfully');
