<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let progressBar: HTMLDivElement = $state();

    if (browser) {
        onMount(() => {
            // Use plain JS for scroll progress — no need for GSAP here
            const updateProgress = () => {
                if (!progressBar) return;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = scrollTop / scrollHeight;
                progressBar.style.transform = `scaleX(${progress})`;
            };

            window.addEventListener('scroll', updateProgress, { passive: true });
            updateProgress();

            return () => {
                window.removeEventListener('scroll', updateProgress);
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
        height: 3px;
        background: var(--scrollbar-track);
        z-index: 1000;
    }

    .scroll-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #00c6ff, #0072ff, #7b68ee);
        background-size: 200% 100%;
        animation: gradient-flow 4s ease-in-out infinite;
        transform-origin: left;
        transform: scaleX(0);
        border-radius: 0 1.5px 1.5px 0;
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
    }

    @keyframes gradient-flow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
</style>
