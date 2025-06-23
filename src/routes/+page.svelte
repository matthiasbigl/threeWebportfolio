<script lang="ts">    
    import Avatar from "$lib/components/Avatar.svelte";
    import Cube from "$lib/components/Cube.svelte";
    import Mountains from "$lib/components/Mountains.svelte";
    import CustomCursor from "$lib/components/CustomCursor.svelte";
    import ScrollProgress from "$lib/components/ScrollProgress.svelte";
    import Card from "$lib/components/Card.svelte";    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { projects } from '$lib/data/projects';    
    
    if (browser) {
        gsap.registerPlugin(ScrollTrigger);
    }    

    const hobbies = [
        {
            title: "GYM",
            description: "I am always trying to push my limits in the gym 💪",
            image: "assets/dumbbell.png"
        },
        {
            title: "Skiing",
            description: "Carving down the slopes is one of my favorite things to do in winter 🎿",
            image: "",
            isSpecialComponent: true
        },
        {
            title: "Surfing",
            description: "Been Surfing since I was 6 years old 🤙",
            image: "assets/surfing.JPG",
            imageObjectFit: "cover"
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

<main class="relative pt-16">
    
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
                    
                    <div class="cube-container max-w-lg mx-auto aspect-square">
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
                    
                    <div class="cube-container  max-w-lg mx-auto aspect-square">
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
    <section class="projects-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-2 overflow-visible">
        <div class="parallax-bg parallax-bg-2"></div>
        
        <div class="relative container mx-auto px-4 lg:px-6">
            <h2 class="section-title text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 text-glow">
                My <span class="blue-gradient_text">Projects</span>
            </h2>
            
            <div class="stagger-cards grid grid-cols-2 lg:grid-cols-4 gap-6 overflow-visible">
                {#each projects as project, index}
                    <Card 
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        link={project.link}
                    />
                {/each}
            </div>
        </div>
    </section>    <!-- Hobbies Section -->
    <section class="hobbies-section reveal-section glass-section relative py-16 sm:py-20 lg:py-32 gradient-bg-3 overflow-visible">
        <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="section-title text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 text-glow">
                My <span class="blue-gradient_text">Hobbies</span>
            </h2>
            
            <div class="stagger-cards grid grid-cols-1 md:grid-cols-3 gap-6  max-w-6xl mx-auto p-4 overflow-visible">
                {#each hobbies as hobby}
                    <Card 
                        title={hobby.title}
                        description={hobby.description}
                        image={hobby.image}
                        isSpecialComponent={hobby.isSpecialComponent || false}
                        imageObjectFit={hobby.imageObjectFit || "contain"}
                    />
                {/each}
            </div>
        </div>
    </section>
</main>



