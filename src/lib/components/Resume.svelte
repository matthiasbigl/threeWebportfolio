<script lang="ts">    
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import type { PdfLoadSuccessContent, PdfPageContent } from 'svelte-pdf-simple';

    interface Props {
        pdfUrl?: string;
    }

    let { pdfUrl = '/assets/resume.pdf' }: Props = $props();
      let PdfViewer: any = $state(null);
    let pdfViewer: any = $state(null);
    let isLoading = $state(true);
    let isPdfLoaded = $state(false);
    let pageNumber = $state(1);
    let totalPages = $state(1);      
    let scale = $state(0.8);
    let minScale = 0.4;
    let maxScale = 3.0;
    let containerElement: HTMLDivElement = $state();
    let pdfContainer: HTMLDivElement = $state();

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'MatthiasBigl-Resume.pdf';
        link.click();
    };    const navigatePages = (forward: boolean = false) => {
        if (forward) {
            pageNumber = pageNumber === totalPages ? 1 : pageNumber + 1;
        } else {
            pageNumber = pageNumber === 1 ? totalPages : pageNumber - 1;
        }
        pdfViewer?.goToPage(pageNumber);
    };

    const zoomIn = () => {
        const newScale = Math.min(scale + 0.2, maxScale);
        scale = newScale;
        pdfViewer?.resize(newScale);
    };

    const zoomOut = () => {
        const newScale = Math.max(scale - 0.2, minScale);
        scale = newScale;
        pdfViewer?.resize(newScale);
    };    const resetZoom = () => {
        const newScale = calculateScale();
        scale = newScale;
        pdfViewer?.resize(newScale);
    };

    // Zoom with mouse wheel
    const handleWheel = (event: WheelEvent) => {
        // Only zoom if Ctrl key is held down (like in browsers)
        if (event.ctrlKey) {
            event.preventDefault();
            
            const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.max(minScale, Math.min(maxScale, scale + zoomDelta));
            
            if (newScale !== scale) {
                scale = newScale;
                pdfViewer?.resize(newScale);
            }
        }
    };

    // Touch zoom gestures
    let initialPinchDistance = 0;
    let startingScale = 1;

    const getTouchDistance = (touch1: Touch, touch2: Touch) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };    const handleTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 2) {
            // Only prevent default for pinch gestures, allow scrolling for single touch
            event.preventDefault();
            initialPinchDistance = getTouchDistance(event.touches[0], event.touches[1]);
            startingScale = scale;
        }
    };

    const handleTouchMove = (event: TouchEvent) => {
        if (event.touches.length === 2 && initialPinchDistance > 0) {
            // Only prevent default for pinch gestures, allow scrolling for single touch
            event.preventDefault();
            
            const currentDistance = getTouchDistance(event.touches[0], event.touches[1]);
            const scaleChange = currentDistance / initialPinchDistance;
            const newScale = Math.max(minScale, Math.min(maxScale, startingScale * scaleChange));
            
            if (Math.abs(newScale - scale) > 0.01) {
                scale = newScale;
                pdfViewer?.resize(newScale);
            }
        }
        // Single touch events are allowed to bubble up for normal scrolling
    };

    const handleTouchEnd = (event: TouchEvent) => {
        if (event.touches.length < 2) {
            initialPinchDistance = 0;
            startingScale = 1;
        }
    };

    const handleLoadSuccess = (event: CustomEvent<PdfLoadSuccessContent>) => {
        totalPages = event.detail.totalPages;
        pageNumber = 1;
        isPdfLoaded = true;
        isLoading = false;
    };

    const handleLoadFailure = (event: CustomEvent) => {
        console.error('PDF loading failed:', event.detail);
        isLoading = false;
    };

    const handlePageChange = (event: CustomEvent<PdfPageContent>) => {
        pageNumber = event.detail.pageNumber;
    };    // Calculate responsive scale
    const calculateScale = () => {
        if (!containerElement) return 0.8;
        const containerWidth = containerElement.clientWidth;
        // Start with a scale that ensures the PDF width fits completely
        // Assuming standard PDF width of ~612px, scale down to fit container with some padding
        const availableWidth = containerWidth - 32; // Account for padding
        const baseScale = Math.min(availableWidth / 612, 1.0);
        
        // Adjust for different screen sizes
        if (containerWidth < 640) return Math.max(baseScale, 0.6); // Mobile
        if (containerWidth < 1024) return Math.max(baseScale, 0.8); // Tablet
        return Math.max(baseScale, 0.9); // Desktop
    };const updateScale = () => {
        const newScale = calculateScale();
        if (Math.abs(scale - newScale) > 0.1) { // Only update if significant change
            scale = newScale;
            // Use setTimeout to ensure the scale state is updated before calling resize
            setTimeout(() => {
                pdfViewer?.resize(newScale);
            }, 10);
        }
    };

    onMount(async () => {
        if (!browser) return;

        try {
            // Dynamic import for SSR compatibility
            const module = await import('svelte-pdf-simple');
            PdfViewer = module.PdfViewer;
            
            // Calculate initial scale
            scale = calculateScale();
        } catch (error) {
            console.error('Failed to load PDF viewer:', error);
            isLoading = false;
        }        // Handle window resize with debouncing
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateScale();
            }, 150); // Debounce resize events
        };

        window.addEventListener('resize', handleResize);        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
        };
    });
</script>

<div bind:this={containerElement} class="w-full mx-auto">
    <div class="glass-card p-2 lg:p-6 sm:p-8 rounded-2xl">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 class="text-2xl sm:text-3xl font-bold blue-gradient_text text-center sm:text-left">
                Resume Preview
            </h3>            <div class="flex items-center gap-3">

                {#if isPdfLoaded}
                    <div class="flex items-center gap-1 glass-card px-2 min-w-14 justify-center py-1 rounded-lg text-xs lg:text-sm text-gray-300">
                        <span>{pageNumber} / {totalPages}</span>
                    </div>
                    
                    <div></div>
                    <!-- Zoom Controls -->
                    <div class="flex items-center gap-1 glass-card px-2 py-1 rounded-lg">
                        <button 
                            onclick={zoomOut}
                            disabled={scale <= minScale}
                            class="p-1 text-white hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Zoom Out"
                            aria-label="Zoom Out"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                            </svg>
                        </button>
                        
                        <span class="text-xs text-gray-300 min-w-[40px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        
                        <button 
                            onclick={zoomIn}
                            disabled={scale >= maxScale}
                            class="p-1 text-white hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Zoom In"
                            aria-label="Zoom In"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </button>
                        
                        <button 
                            onclick={resetZoom}
                            class="p-1 text-white hover:text-blue-400 transition-colors ml-1"
                            title="Reset Zoom"
                            aria-label="Reset Zoom"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                {/if}
                <button 
                    onclick={downloadPDF}
                    class="magnetic-btn glass-card glass-card-hover px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                </button>
            </div>
        </div>

        <!-- PDF Viewer -->
        <div class="relative">
            {#if PdfViewer}
                <div class="flex flex-col items-center">                    <!-- PDF Container -->                      <div 
                        bind:this={pdfContainer}
                        class="w-full max-w-full rounded-lg shadow-2xl bg-white overflow-auto"
                        style="touch-action: pan-x pan-y pinch-zoom; max-height: 80vh; -webkit-overflow-scrolling: touch;"
                        onwheel={handleWheel}
                        ontouchstart={handleTouchStart}
                        ontouchmove={handleTouchMove}
                        ontouchend={handleTouchEnd}
                    >{#if PdfViewer}
                            <PdfViewer
                                bind:this={pdfViewer}
                                props={{
                                    path: pdfUrl,
                                    scale: scale,
                                    page: pageNumber,
                                    withAnnotations: true,
                                    withTextContent: false
                                }}
                                style="display: block; width: auto; height: auto; min-width: 100%;"
                                on:load_success={handleLoadSuccess}
                                on:load_failure={handleLoadFailure}
                                on:page_changed={handlePageChange}
                            >
                                <svelte:fragment slot="loading">
                                    <div class="flex flex-col items-center justify-center p-12 text-center">
                                        <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p class="text-gray-600 text-lg">Loading Resume...</p>
                                    </div>
                                </svelte:fragment>
                                
                                <svelte:fragment slot="loading-failed">
                                    <div class="flex flex-col items-center justify-center p-12 text-center">
                                        <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p class="text-red-600 text-lg mb-2">Failed to Load PDF</p>
                                        <p class="text-gray-500 text-sm">Please check if the file exists and try again</p>
                                    </div>
                                </svelte:fragment>
                            </PdfViewer>
                        {/if}
                    </div>
                    
                    <!-- Navigation Controls -->
                    {#if isPdfLoaded && totalPages > 1}
                        <div class="flex items-center justify-center gap-4 mt-6">
                            <button 
                                onclick={() => navigatePages(false)}
                                disabled={pageNumber === 1}
                                class="magnetic-btn glass-card glass-card-hover px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                            
                            <div class="glass-card px-4 py-2 rounded-lg text-sm text-gray-300 min-w-[80px] text-center">
                                Page {pageNumber}
                            </div>
                            
                            <button 
                                onclick={() => navigatePages(true)}
                                disabled={pageNumber === totalPages}
                                class="magnetic-btn glass-card glass-card-hover px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Next
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="flex flex-col items-center justify-center p-12 text-center">
                    <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p class="text-gray-300 text-lg">Loading PDF Viewer...</p>
                </div>
            {/if}
        </div>
    </div>
</div>