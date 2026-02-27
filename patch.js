const fs = require('fs');
const content = fs.readFileSync('src/lib/components/Services.svelte', 'utf-8');

const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('<!-- ALL IN ONE SERVICE BENTO CARD -->'));
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

const replacement = `		<!-- PRO MAX ALL IN ONE CARD -->
		<div class="relative w-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden group shadow-[0_20px_80px_-20px_rgba(147,51,234,0.3)] isolate bg-gray-950 border border-white/10 mb-12 lg:mb-20">
			<!-- Hyper-Vibrant Animated Background -->
			<div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-[0.85] transition-opacity duration-700 -z-20"></div>
			
			<!-- Noise Texture Overlay for Premium Feel -->
			<div class="absolute inset-0 bg-[url('/noise.svg')] opacity-40 mix-blend-overlay -z-10"></div>
			
			<!-- Massive Glowing Orbs for Depth -->
			<div class="absolute top-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-amber-400/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen -z-10 group-hover:scale-110 group-hover:bg-amber-400/40 transition-transform duration-1000"></div>
			<div class="absolute bottom-[-10%] left-[-20%] w-[40rem] h-[40rem] bg-cyan-400/40 rounded-full blur-[100px] pointer-events-none mix-blend-screen -z-10 group-hover:scale-110 group-hover:bg-cyan-400/50 transition-transform duration-1000"></div>

			<!-- Internal Border Glow (Glass reflection) -->
			<div class="absolute inset-0 rounded-[2rem] lg:rounded-[3rem] border-[1.5px] border-white/20 mix-blend-overlay pointer-events-none"></div>

			<div class="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 h-full">
				
				<!-- LEFT COLUMN: Sticky Hero Content -->
				<div class="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
					<div class="lg:sticky lg:top-32 flex flex-col items-start">
						<div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 mb-8 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
							<span class="relative flex h-2.5 w-2.5">
								<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
								<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
							</span>
							<span class="font-syne text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold text-white leading-none pt-0.5">
								Premium Value
							</span>
						</div>
						
						<h3 class="font-syne text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight mb-6 leading-[0.95] text-white drop-shadow-2xl" style="text-wrap: balance;">
							{m['services.allInOne.title']()}
						</h3>
						
						<p class="text-lg sm:text-xl font-medium text-white/80 leading-relaxed mb-12 max-w-sm drop-shadow-md">
							{m['services.allInOne.tagline']()}
						</p>

						<!-- Desktop Button -->
						<div class="hidden lg:block w-full max-w-sm relative group/btn cursor-pointer">
							<div class="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-[2rem] blur-md opacity-70 group-hover/btn:opacity-100 group-hover/btn:blur-xl transition-all duration-500"></div>
							<a href={localizeHref('/pricing')} class="relative flex items-center justify-between w-full bg-white/10 backdrop-blur-xl border border-white/40 text-white rounded-[2rem] px-8 py-5 font-syne font-bold text-xl hover:bg-white hover:text-purple-900 transition-all duration-300 overflow-hidden isolate">
								<span class="relative z-10">Start Your Project</span>
								<div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:bg-purple-100 group-hover/btn:-rotate-45 transition-all duration-300 relative z-10">
									<ChevronRight class="w-6 h-6" />
								</div>
							</a>
						</div>
					</div>
				</div>

				<!-- RIGHT COLUMN: Scrolling Glass Panel -->
				<div class="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex items-stretch">
					<div class="w-full bg-black/20 backdrop-blur-3xl rounded-[1.5rem] lg:rounded-[2.5rem] border border-white/15 shadow-[inset_0_0_80px_rgba(255,255,255,0.05)] p-6 sm:p-10 lg:p-14 relative overflow-hidden flex flex-col gap-16 lg:gap-20">
						
						<!-- Subtle Inner Highlight -->
						<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

						<!-- Features Section -->
						<div class="relative z-10">
							<div class="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
								<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg transform -rotate-6">
									<Sparkles class="w-6 h-6 text-white" />
								</div>
								<h4 class="font-syne text-3xl sm:text-4xl text-white font-bold tracking-tight">
									What's Included
								</h4>
							</div>
							
							<div class="flex flex-col gap-4">
								{@const featureIcons = [Rocket, Layers, Code, Zap, Target, Shield, Star]}
								{@const gradients = [
									'from-cyan-400 to-blue-500', 
									'from-fuchsia-400 to-purple-500', 
									'from-amber-400 to-orange-500', 
									'from-emerald-400 to-teal-500', 
									'from-rose-400 to-red-500', 
									'from-indigo-400 to-violet-500',
									'from-lime-400 to-green-500'
								]}
								
								{#each m['services.allInOne.features']().split('\n') as feature, i}
									{@const IconComponent = featureIcons[i % featureIcons.length]}
									{@const bgGrad = gradients[i % gradients.length]}
									
									<div class="group/feature relative overflow-hidden rounded-[1.25rem] bg-white/5 border border-white/10 p-5 sm:p-6 flex items-center gap-6 hover:bg-white/10 hover:border-white/30 transition-all duration-500 cursor-default shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 isolate">
										
										<div class="absolute inset-0 bg-gradient-to-r {bgGrad} opacity-0 group-hover/feature:opacity-[0.12] transition-opacity duration-500 -z-10"></div>
										
										<div class="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] bg-gradient-to-br {bgGrad} p-[1px] flex-shrink-0 shadow-xl group-hover/feature:scale-110 group-hover/feature:rotate-3 transition-transform duration-500">
											<div class="w-full h-full bg-black/20 backdrop-blur-xl rounded-[calc(1.25rem-1px)] flex items-center justify-center">
												<IconComponent class="w-7 h-7 text-white drop-shadow-md" />
											</div>
										</div>
										<span class="font-syne font-bold text-lg sm:text-xl lg:text-2xl text-white leading-tight drop-shadow-sm">
											{feature}
										</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Process Timeline Section -->
						<div class="relative z-10">
							<div class="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
								<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg transform rotate-6">
									<Target class="w-6 h-6 text-white" />
								</div>
								<h4 class="font-syne text-3xl sm:text-4xl text-white font-bold tracking-tight">
									The Process
								</h4>
							</div>

							<div class="relative pl-6 sm:pl-10">
								<!-- Glowing Vertical Track -->
								<div class="absolute left-0 top-6 bottom-6 w-1.5 bg-white/5 rounded-full overflow-hidden">
									<div class="w-full h-1/3 bg-gradient-to-b from-transparent via-white to-transparent opacity-60 animate-pulse absolute top-1/3"></div>
								</div>

								<div class="flex flex-col gap-12">
									{#each processSteps as step, i}
										<div class="relative group/step">
											<!-- Number Node -->
											<div class="absolute -left-[2.85rem] sm:-left-[3.85rem] top-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 border-2 border-white/20 flex items-
