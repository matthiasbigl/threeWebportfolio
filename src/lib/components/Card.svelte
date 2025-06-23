<script lang="ts">
    import Mountains from "./Mountains.svelte";
    
    export let title: string;
    export let description: string;
    export let image: string = "";
    export let link: string = "";
    export let isSpecialComponent: boolean = false; // For Mountains component
    export let imageObjectFit: "contain" | "cover" = "contain";
</script>

<div class="stagger-item h-full overflow-visible ">
    {#if link}
        <a href={link} class="card-wrapper magnetic-btn">
            <div class="card-content">
                <div class="image-container">
                    {#if isSpecialComponent && title === "Skiing"}
                        <Mountains/>
                    {:else}
                        <img 
                            src={image} 
                            alt={title}
                            class="card-image object-{imageObjectFit}"
                            loading="lazy"
                        />
                    {/if}
                </div>
                
                <h3 class="card-title">
                    {title}
                </h3>
                
                <p class="card-description">
                    {description}
                </p>
            </div>
        </a>
    {:else}
        <div class="card-wrapper magnetic-btn">
            <div class="card-content ">
                <div class="image-container">
                    {#if isSpecialComponent && title === "Skiing"}
                        <Mountains/>
                    {:else}
                        <img 
                            src={image} 
                            alt={title}
                            class="card-image object-{imageObjectFit}"
                            loading="lazy"
                        />
                    {/if}
                </div>
                
                <h3 class="card-title">
                    {title}
                </h3>
                
                <p class="card-description">
                    {description}
                </p>
            </div>
        </div>
    {/if}
</div>

<style>    .card-wrapper {
        @apply block glass-card glass-card-hover h-full transition-all duration-300 rounded-xl;
        @apply p-4 sm:p-6 text-center;
        @apply relative;
        z-index: 1;
        will-change: transform, box-shadow;
        perspective: 1000px;
    }
    
    .card-content  {
        @apply h-full flex flex-col;
    }
    
    .image-container {
        @apply aspect-square mb-4 sm:mb-6 rounded-xl overflow-hidden bg-white/5 p-3 sm:p-4;
        @apply flex-shrink-0;
    }
    
    .card-image {
        @apply w-full h-full rounded-lg;
    }
    
    .card-title {
        @apply text-lg sm:text-xl font-bold mb-3 sm:mb-4 blue-gradient_text;
        @apply flex-shrink-0;
    }
    
    .card-description {
        @apply text-gray-300 text-sm leading-relaxed;
        @apply flex-grow;
        @apply sm:text-base;
    }
    
    /* Ensure proper z-index stacking on hover */
    .card-wrapper:hover {
        z-index: 50;
    }
    
    /* Optimize shadow rendering */
    .stagger-item {
        transform-style: preserve-3d;
    }
</style>
