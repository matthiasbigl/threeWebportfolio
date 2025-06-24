<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from 'gsap';

    let cursor: HTMLDivElement = $state();
    let follower: HTMLDivElement = $state();
    let isHovering = false;
    let isMobile = $state(false);

    if (browser) {
        onMount(() => {
            // Check if device is mobile/touch
            isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches || 
                      window.innerWidth <= 768;
            
            if (isMobile) {
                // Don't show custom cursor on mobile
                return;
            }

            const handleMouseMove = (e: MouseEvent) => {
                gsap.to(cursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: "power2.out"
                });
                
                gsap.to(follower, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.3,
                    ease: "power2.out"
                });
            };

            const handleMouseEnter = () => {
                isHovering = true;
                gsap.to(cursor, {
                    scale: 1.5,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                gsap.to(follower, {
                    scale: 0.8,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            };

            const handleMouseLeave = () => {
                isHovering = false;
                gsap.to(cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                gsap.to(follower, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            };

            document.addEventListener('mousemove', handleMouseMove);
            
            // Add event listeners to interactive elements
            const interactiveElements = document.querySelectorAll('a, button, [role="button"], .magnetic-btn');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                interactiveElements.forEach(el => {
                    el.removeEventListener('mouseenter', handleMouseEnter);
                    el.removeEventListener('mouseleave', handleMouseLeave);
                });
            };
        });
    }
</script>

{#if !isMobile}
    <div bind:this={cursor} class="cursor-dot"></div>
    <div bind:this={follower} class="cursor-follower"></div>
{/if}

<style>
    @media (hover: hover) and (pointer: fine) {
        :global(body) {
            cursor: none;
        }
    }

    .cursor-dot {
        position: fixed;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
    }

    .cursor-follower {
        position: fixed;
        top: 0;
        left: 0;
        width: 30px;
        height: 30px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
    }
</style>
