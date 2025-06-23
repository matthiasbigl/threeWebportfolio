<script lang="ts">
    import Avatar from "$lib/components/Avatar.svelte";
    import Cube from "$lib/components/Cube.svelte";
    import Mountains from "$lib/components/Mountains.svelte";
    import CustomCursor from "$lib/components/CustomCursor.svelte";
    import ScrollProgress from "$lib/components/ScrollProgress.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    if (browser) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const projects = [
        {
            title: "Unleashed",
            description: "A Social Media App without any ads or tracking",
            image: "https://unleashed-coral.vercel.app/_next/image?url=https%3A%2F%2Funleashed-images.s3.eu-central-1.amazonaws.com%2Fuser_2Oe6VaszvuPGmbbzyaBvQTbwiZu%2Fb4189c45-d379-4d17-80d5-76e38bc03c56%2Flogofinal.png&w=3840&q=30",
            link: "https://unleashed-coral.vercel.app/"
        },
        {
            title: "Grading Bot",
            description: "WORK IN PROGRESS: An automated System for grading Students coding Assignments",
            image: "assets/gradingbot.png",
            link: "https://gradingbot.htl-hl.ac.at"
        },
        {
            title: "Bigls Blog",
            description: "A Blog about my Projects and Experiences",
            image: "https://media.graphassets.com/f0f4hXrHQ2yNB85Dj2ou",
            link: "https://bigls-blog.vercel.app/"
        },
        {
            title: "... and many more",
            description: "Check out my Github for more Projects",
            image: "https://web.imt-atlantique.fr/x-info/atlanmod/images/d/d1/Github.jpg",
            link: "https://github.com/matthiasbigl"
        }
    ];

    onMount(() => {
        if (!browser) return;

        // Hero section animations
        gsap.fromTo(".hero-title", 
            { opacity: 0, y: 100, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.7)", delay: 0.5 }
        );

        gsap.fromTo(".hero-subtitle", 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.8 }
        );

        gsap.fromTo(".hero-avatar", 
            { opacity: 0, x: -100, rotation: -10 },
            { opacity: 1, x: 0, rotation: 0, duration: 1.5, ease: "back.out(1.7)", delay: 0.3 }
        );

        // Parallax backgrounds
        gsap.to(".parallax-bg-1", {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(".parallax-bg-2", {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: ".projects-section",
                start: "top bottom", 
                end: "bottom top",
                scrub: true
            }
        });

        // Section reveal animations
        gsap.utils.toArray(".reveal-section").forEach((section: any) => {
            gsap.fromTo(section.querySelector(".section-title"), 
                { opacity: 0, y: 60 },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                    }
                }
            );
        });

        // Staggered card animations
        gsap.utils.toArray(".stagger-cards").forEach((container: any) => {
            const cards = container.querySelectorAll(".stagger-item");
            gsap.fromTo(cards,
                { opacity: 0, y: 60, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: container,
                        start: "top 85%",
                        end: "bottom 15%",
                    }
                }
            );
        });

        // Cube animations
        gsap.utils.toArray(".cube-container").forEach((cube: any) => {
            gsap.fromTo(cube,
                { opacity: 0, scale: 0.5, rotationY: -180 },
                {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 1.5,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: cube,
                        start: "top 80%",
                    }
                }
            );
        });

        // Magnetic effect for buttons
        document.querySelectorAll('.magnetic-btn').forEach((btn: any) => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { scale: 1, x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });
            
            btn.addEventListener('mousemove', (e: MouseEvent) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Floating animation for avatar
        gsap.to(".floating-avatar", {
            y: -20,
            duration: 3,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    });
</script>


<svelte:head>
    <title>Matthias Bigl</title>
    <meta name="description" content="Matthias Bigl - Software Engineer from Austria"/>
    <meta name="keywords" content="Matthias Bigl, Software Engineer, Web Developer, Web, Developer, Matthias, Bigl, matthiasbigl, matthias, bigl, matthiasbigl.at, matthiasbigl.com, matthiasbigl.dev, matthiasbigl.me, matthiasbigl.xyz, matthiasbigl.tech, matthiasbigl.online, matthiasbigl.website, matthiasbigl.blog, matthiasbigl.work, matthiasbigl.fun, matthiasbigl.live, matthiasbigl.page, matthiasbigl.cloud, matthiasbigl.app, matthiasbigl.site, matthiasbigl.space, matthiasbigl.design, matthiasbigl.digital, matthiasbigl.news, matthiasbigl.store, matthiasbigl.online, matthiasbigl.shop, matthiasbigl.club, matthiasbigl.de, matthiasbigl.eu, matthiasbigl.at, matthiasbigl.ch, matthiasbigl.li, matthiasbigl.net, nextjs, svelte, htl hollabrunn, htl, hollabrunn, htl-hl, gradingbot, unleashed"/>
</svelte:head>

<CustomCursor />
<ScrollProgress />

<main class="relative overflow-hidden pt-16">
    
    <!-- Hero Section -->
    <section class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        <div class="parallax-bg parallax-bg-hero aurora-bg"></div>
        
        <div class="relative z-10 container mx-auto p-6 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20">
                  <!-- Avatar -->
                <div class="hero-avatar floating-avatar relative">
                    <div class="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 glass-card glow-border p-4 sm:p-6 lg:p-8 floating">
                        <Avatar/>
                    </div>
                </div>
                
                <!-- Hero Text -->
                <div class="text-center lg:text-left max-w-2xl px-4">
                    <h1 class="hero-title font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 text-glow leading-tight">
                        Hey I am <span class="blue-gradient_text">Matthias Bigl</span>
                    </h1>
                    
                    <p class="hero-subtitle text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                        I am a <span class="blue-gradient_text font-semibold">Software Engineer</span> from Austria 🇦🇹.<br/>
                        I love developing new and exciting <span class="blue-gradient_text font-semibold">Web-Experiences</span><br/>
                        Let's get to know each other!
                    </p>
                    
                    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">                        <a href="/contact" class="magnetic-btn glass-card glass-card-hover px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white text-center rounded-xl">
                            Get In Touch
                        </a>
                        <a href="/assets/resume.pdf" download="MatthiasBigl-Resume.pdf" class="magnetic-btn glass-card glass-card-hover px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white text-center border border-white/20 rounded-xl">
                            Download Resume
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>    <!-- Skills Section -->
    <section class="skills-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-1">
        <div class="parallax-bg parallax-bg-1"></div>
        
        <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 text-glow">
                My <span class="blue-gradient_text">Skills</span>
            </h2>
            
            <div class="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
                  <!-- Languages -->
                <div class="text-center">
                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-gray-300 uppercase tracking-wider">
                        Languages
                    </h3>
                    
                    <div class="cube-container max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square">
                        <Cube
                            images={[
                                "assets/python.png",
                                "assets/java.png", 
                                "assets/svelte.png",
                                "assets/typescript.png",
                                "assets/kotlin.png",
                            ]}
                            normalMaps={[
                                "assets/pythonNormal.png",
                                "assets/javaNormal.png",
                                "assets/svelteNormal.png",
                                "assets/typescriptNormal.png",
                                "assets/kotlinNormal.png",
                            ]}
                        />
                    </div>
                </div>
                
                <!-- Strengths -->
                <div class="text-center">
                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-gray-300 uppercase tracking-wider">
                        Strengths
                    </h3>
                    
                    <div class="cube-container max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square">
                        <Cube
                            images={[
                                "assets/backend.png",
                                "assets/UI.png",
                                "assets/graphic.png", 
                                "assets/Teamwork.png",
                                "assets/project.png",
                            ]}
                            normalMaps={[
                                "assets/backendNormal.png",
                                "assets/UINormal.png",
                                "assets/graphicNormal.png",
                                "assets/TeamworkNormal.png", 
                                "assets/projectNormal.png",
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>    <!-- Projects Section -->
    <section class="projects-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-2">
        <div class="parallax-bg parallax-bg-2"></div>
        
        <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 text-glow">
                My <span class="blue-gradient_text">Projects</span>
            </h2>
            
            <div class="stagger-cards grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">                {#each projects as project, index}
                    <div class="stagger-item magnetic-btn">
                        <a href={project.link} class="block glass-card glass-card-hover p-4 sm:p-6 h-full transition-all duration-300 rounded-xl">
                            <div class="aspect-square mb-4 sm:mb-6 rounded-xl overflow-hidden bg-white/5 p-3 sm:p-4">
                                <img 
                                    src={project.image} 
                                    alt={project.title}
                                    class="w-full h-full object-contain rounded-lg"
                                />
                            </div>
                            
                            <h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 blue-gradient_text">
                                {project.title}
                            </h3>
                            
                            <p class="text-gray-300 text-sm leading-relaxed">
                                {project.description}
                            </p>
                        </a>
                    </div>
                {/each}
            </div>
        </div>
    </section>    <!-- Hobbies Section -->
    <section class="hobbies-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-3">
        <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 text-glow">
                My <span class="blue-gradient_text">Hobbies</span>
            </h2>
            
            <div class="stagger-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                  <!-- GYM -->
                <div class="stagger-item magnetic-btn">
                    <div class="glass-card glass-card-hover p-4 sm:p-6 h-full text-center rounded-xl">
                        <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 blue-gradient_text">GYM</h3>
                        
                        <div class="aspect-square mb-4 sm:mb-6 rounded-xl overflow-hidden bg-white/5 p-3 sm:p-4">
                            <img 
                                src="assets/dumbbell.png" 
                                alt="GYM"
                                class="w-full h-full object-contain rounded-lg"
                            />
                        </div>
                        
                        <p class="text-gray-300 leading-relaxed text-sm sm:text-base">
                            I am always trying to push my limits in the gym 💪
                        </p>
                    </div>
                </div>
                
                <!-- Skiing -->
                <div class="stagger-item magnetic-btn">
                    <div class="glass-card glass-card-hover p-4 sm:p-6 h-full text-center rounded-xl">
                        <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 blue-gradient_text">Skiing</h3>
                        
                        <div class="aspect-square mb-4 sm:mb-6 rounded-xl overflow-hidden">
                            <Mountains/>
                        </div>
                        
                        <p class="text-gray-300 leading-relaxed text-sm sm:text-base">
                            Carving down the slopes is one of my favorite things to do in winter 🎿
                        </p>
                    </div>
                </div>
                
                <!-- Surfing -->
                <div class="stagger-item magnetic-btn">
                    <div class="glass-card glass-card-hover p-4 sm:p-6 h-full text-center rounded-xl">
                        <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 blue-gradient_text">Surfing</h3>
                        
                        <div class="aspect-square mb-4 sm:mb-6 rounded-xl overflow-hidden bg-white/5 p-3 sm:p-4">
                            <img 
                                src="assets/surfing.JPG" 
                                alt="Surfing"
                                class="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        
                        <p class="text-gray-300 leading-relaxed text-sm sm:text-base">
                            Been Surfing since I was 6 years old 🤙
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>



