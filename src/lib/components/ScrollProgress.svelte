<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';

    let progressBar: HTMLDivElement = $state();
    let scrollTween: gsap.core.Tween;

    if (browser) {
        onMount(() => {
            const updateProgress = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / scrollHeight) * 100;
                
                gsap.to(progressBar, {
                    scaleX: progress / 100,
                    duration: 0.1,
                    ease: "none"
                });
            };

            window.addEventListener('scroll', updateProgress);
            updateProgress();

            return () => {
                window.removeEventListener('scroll', updateProgress);
                if (scrollTween) scrollTween.kill();
            };
        });
    }
</script>

<div class="scroll-progress-container">
    <div bind:this={progressBar} class="scroll-progress-bar"></div>
</div>

<style>
    .scroll-progress-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        z-index: 1000;
        backdrop-filter: blur(10px);
    }

    .scroll-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #00c6ff, #0072ff, #7b68ee, #ff6b6b);
        background-size: 200% 100%;
        animation: gradient-flow 3s ease-in-out infinite;
        transform-origin: left;
        transform: scaleX(0);
        border-radius: 0 2px 2px 0;
        box-shadow: 0 0 20px rgba(0, 198, 255, 0.5);
    }

    @keyframes gradient-flow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
</style>
