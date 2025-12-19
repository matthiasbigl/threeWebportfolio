<script lang="ts">    
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import type { PdfLoadSuccess, PdfPageContent } from 'svelte-pdf-simple';

    /**
     * @fileoverview Premium Resume PDF Viewer Component v3.0
     * 
     * A visually stunning, immersive PDF viewer with floating document design,
     * smooth animations, fullscreen mode, and professional presentation.
     */

    interface Props {
        pdfUrl?: string;
    }

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    
    let { pdfUrl = '/assets/resume.pdf' }: Props = $props();
    
    let PdfViewer: any = $state(null);
    let pdfViewer: any = $state(null);
    let isLoading = $state(true);
    let isPdfLoaded = $state(false);
    let pageNumber = $state(1);
    let totalPages = $state(1);
    
    // RENDER SCALE: Fixed high value for crisp PDF rendering (internal canvas resolution)
    // This is multiplied by devicePixelRatio for HiDPI displays
    const RENDER_SCALE = 2.0;
    
    // VISUAL ZOOM: CSS transform scale for actual zoom in/out (what user sees)
    let visualZoom = $state(1.0);
    const minZoom = 0.75;  // Don't allow zooming out too far
    const maxZoom = 2.5;   // Reasonable max zoom
    
    // Legacy scale variable for compatibility (maps to visualZoom for display)
    let scale = $derived(visualZoom);
    
    let isFullscreen = $state(false);
    let showControls = $state(true);
    let controlsTimeout: ReturnType<typeof setTimeout> | null = null;
    
    // DOM References
    let containerElement: HTMLDivElement | undefined = $state();
    let pdfContainer: HTMLDivElement | undefined = $state();
    let scrollWrapper: HTMLDivElement | undefined = $state();
    let fullscreenContainer: HTMLDivElement | undefined = $state();

    // Touch & Zoom State
    let initialPinchDistance = 0;
    let startingScale = 1;
    let isZooming = $state(false);
    let isIOS = false;

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'MatthiasBigl-Resume.pdf';
        link.click();
    };

    const openInNewTab = () => {
        window.open(pdfUrl, '_blank');
    };

    const toggleFullscreen = async () => {
        if (!fullscreenContainer) return;
        
        try {
            if (!document.fullscreenElement) {
                await fullscreenContainer.requestFullscreen();
                isFullscreen = true;
            } else {
                await document.exitFullscreen();
                isFullscreen = false;
            }
        } catch (err) {
            console.warn('Fullscreen not supported:', err);
        }
    };

    const handleMouseMove = () => {
        showControls = true;
        if (controlsTimeout) clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (isFullscreen) showControls = false;
        }, 3000);
    };
    
    const getTouchDistance = (touch1: Touch, touch2: Touch) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // ========================================================================
    // NAVIGATION & ZOOM CONTROLS
    // ========================================================================

    const navigatePages = (forward: boolean = false) => {
        if (forward) {
            pageNumber = pageNumber === totalPages ? 1 : pageNumber + 1;
        } else {
            pageNumber = pageNumber === 1 ? totalPages : pageNumber - 1;
        }
        pdfViewer?.goToPage(pageNumber);
    };
    
    // Simple zoom functions - just update CSS transform, no re-rendering needed
    const zoomIn = () => {
        visualZoom = Math.min(visualZoom + 0.15, maxZoom);
    };
    
    const zoomOut = () => {
        visualZoom = Math.max(visualZoom - 0.15, minZoom);
    };

    const resetZoom = () => {
        visualZoom = 1.0;
    };

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================
    
    // Zoom with mouse wheel - CSS transform only, no re-render needed
    const handleWheel = (event: WheelEvent) => {
        // Only zoom if Ctrl key is held down (like in browsers)
        if (event.ctrlKey) {
            event.preventDefault();
            
            const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
            visualZoom = Math.max(minZoom, Math.min(maxZoom, visualZoom + zoomDelta));
        }
    };
    
    // Touch gesture handlers
    const handleTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 2) {
            // Prevent all browser gestures for reliable pinch-zoom handling
            event.preventDefault();
            event.stopPropagation();
            initialPinchDistance = getTouchDistance(event.touches[0], event.touches[1]);
            startingScale = visualZoom;
            isZooming = true;
            
            // Disable iOS Safari zoom during our custom zoom
            if (pdfContainer) {
                pdfContainer.style.touchAction = 'none';
                // iOS specific: prevent document zoom
                if (isIOS) {
                    document.body.style.touchAction = 'none';
                }
            }
        } else if (isIOS && event.touches.length === 1) {
            // Allow single touch scrolling on iOS
            if (pdfContainer) {
                pdfContainer.style.touchAction = 'pan-y';
            }
        }
    };
    
    const handleTouchMove = (event: TouchEvent) => {
        if (event.touches.length === 2 && initialPinchDistance > 0 && isZooming) {
            // Prevent all browser gestures during pinch-zoom
            event.preventDefault();
            event.stopPropagation();
            
            const currentDistance = getTouchDistance(event.touches[0], event.touches[1]);
            const scaleChange = currentDistance / initialPinchDistance;
            // Update visual zoom directly - no re-render needed, just CSS transform
            visualZoom = Math.max(minZoom, Math.min(maxZoom, startingScale * scaleChange));
        }
        // Single touch events are allowed to bubble up for normal scrolling
    };
    
    const handleTouchEnd = (event: TouchEvent) => {
        if (event.touches.length < 2) {
            initialPinchDistance = 0;
            startingScale = 1;
            isZooming = false;
            
            // Re-enable normal touch interactions for iOS
            if (pdfContainer) {
                pdfContainer.style.touchAction = 'auto';
                // iOS specific: re-enable document interactions
                if (isIOS) {
                    document.body.style.touchAction = 'auto';
                }
            }
        }
    };

    // PDF event handlers
    const handleLoadSuccess = (event: CustomEvent<PdfLoadSuccess>) => {
        totalPages = event.detail.totalPages;
        pageNumber = 1;
        isPdfLoaded = true;
        isLoading = false;
    };

    const handleLoadFailure = (event: CustomEvent) => {
        console.error('PDF loading failed:', event.detail);
        isLoading = false;
    };    const handlePageChange = (event: CustomEvent<PdfPageContent>) => {
        pageNumber = event.detail.pageNumber;
    };    
      // ========================================================================
    // COMPONENT LIFECYCLE
    // ========================================================================

    onMount(() => {
        if (!browser) return;
        
        // Detect iOS for specific handling
        isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        
        // Add viewport meta tag if missing (important for iOS zoom)
        if (isIOS && !document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
            document.head.appendChild(viewport);
        }        // PDF Viewer Setup
        (async () => {
            try {
                // Dynamic import for SSR compatibility
                const module = await import('svelte-pdf-simple');
                PdfViewer = module.PdfViewer;
            } catch (error) {
                console.error('Failed to load PDF viewer:', error);
                isLoading = false;
            }
        })();

        // Fullscreen change listener
        const handleFullscreenChange = () => {
            isFullscreen = !!document.fullscreenElement;
            if (!isFullscreen) showControls = true;
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Cleanup
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (controlsTimeout) {
                clearTimeout(controlsTimeout);
            }
        };
    });

</script>

<!-- Fullscreen Container -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    bind:this={fullscreenContainer}
    class="resume-viewer-wrapper"
    class:fullscreen-mode={isFullscreen}
    onmousemove={handleMouseMove}
>
    <div bind:this={containerElement} class="w-full max-w-5xl mx-auto">
        <!-- Premium Glass Card Container -->
        <div class="pdf-viewer-card relative overflow-hidden rounded-2xl lg:rounded-3xl">
            <!-- Animated Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 opacity-50"></div>
            <div class="absolute inset-0 backdrop-blur-xl"></div>
            
            <!-- Inner Content -->
            <div class="relative z-10 p-3 sm:p-4 lg:p-6">
                <!-- Header with Controls -->
                <div 
                    class="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4 transition-opacity duration-300"
                    class:opacity-0={isFullscreen && !showControls}
                    class:pointer-events-none={isFullscreen && !showControls}
                >
                    <div class="flex items-center gap-3">
                        <!-- Document Icon -->
                        <div class="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center shadow-lg shadow-blue-500/25">
                            <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                                Resume
                            </h3>
                            {#if isPdfLoaded}
                                <p class="text-xs sm:text-sm text-gray-400">
                                    Page {pageNumber} of {totalPages} • {Math.round(scale * 100)}% zoom
                                </p>
                            {/if}
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                        {#if isPdfLoaded}
                            <!-- Zoom Controls -->
                            <div class="flex items-center gap-1 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-white/10">
                                <button 
                                    onclick={zoomOut}
                                    disabled={visualZoom <= minZoom}
                                    class="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
                                    title="Zoom Out (Ctrl + Scroll)"
                                    aria-label="Zoom Out"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                    </svg>
                                </button>
                                
                                <div class="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div 
                                        class="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-200"
                                        style="width: {((visualZoom - minZoom) / (maxZoom - minZoom)) * 100}%"
                                    ></div>
                                </div>
                                
                                <button 
                                    onclick={zoomIn}
                                    disabled={visualZoom >= maxZoom}
                                    class="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
                                    title="Zoom In (Ctrl + Scroll)"
                                    aria-label="Zoom In"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                
                                <button 
                                    onclick={resetZoom}
                                    class="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 transition-all rounded-lg ml-1"
                                    title="Fit to Width"
                                    aria-label="Reset Zoom"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </button>
                            </div>
                            
                            <!-- Navigation for multi-page -->
                            {#if totalPages > 1}
                                <div class="flex items-center gap-1 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-white/10">
                                    <button 
                                        onclick={() => navigatePages(false)}
                                        disabled={pageNumber === 1}
                                        class="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
                                        aria-label="Previous Page"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span class="text-xs text-gray-300 min-w-[40px] text-center font-medium">{pageNumber}/{totalPages}</span>
                                    <button 
                                        onclick={() => navigatePages(true)}
                                        disabled={pageNumber === totalPages}
                                        class="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
                                        aria-label="Next Page"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            {/if}
                        {/if}
                        
                        <!-- Fullscreen Button -->
                        <button 
                            onclick={toggleFullscreen}
                            class="p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {#if isFullscreen}
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            {:else}
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            {/if}
                        </button>
                        
                        <!-- Open in New Tab -->
                        <button 
                            onclick={openInNewTab}
                            class="p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all"
                            title="Open in New Tab"
                            aria-label="Open in New Tab"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </button>
                        
                        <!-- Download Button -->
                        <button 
                            onclick={downloadPDF}
                            class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-sm"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span class="hidden sm:inline">Download</span>
                        </button>
                    </div>
                </div>

                <!-- PDF Document Display -->
                <div class="relative">
                    {#if PdfViewer}
                        <!-- Document Shadow & Frame -->
                        <div class="pdf-document-frame relative">
                            <!-- Decorative corner accents -->
                            <div class="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-blue-400/50 rounded-tl-lg"></div>
                            <div class="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-purple-400/50 rounded-tr-lg"></div>
                            <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-blue-400/50 rounded-bl-lg"></div>
                            <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-purple-400/50 rounded-br-lg"></div>
                            
                            <!-- Scroll Container -->
                            <div 
                                bind:this={scrollWrapper}
                                class="pdf-scroll-container relative overflow-auto rounded-lg"
                                class:fullscreen-scroll={isFullscreen}
                            >
                                <!-- PDF Container - sized to account for zoom -->
                                <div 
                                    bind:this={pdfContainer}
                                    class="pdf-content-wrapper relative bg-white"
                                    class:zooming={isZooming}
                                    onwheel={handleWheel}
                                    ontouchstart={handleTouchStart}
                                    ontouchmove={handleTouchMove}
                                    ontouchend={handleTouchEnd}
                                >
                                    <!-- 
                                        Zoom container that expands to show full scaled content.
                                        We use a wrapper that grows with the zoom level so scrolling works properly.
                                    -->
                                    <div 
                                        class="pdf-zoom-container"
                                        style="width: calc(100% * {visualZoom}); height: auto;"
                                    >
                                        <div 
                                            class="pdf-zoom-wrapper"
                                            style="transform: scale({visualZoom}); transform-origin: top left; width: calc(100% / {visualZoom});"
                                        >
                                            <PdfViewer
                                                bind:this={pdfViewer}
                                                props={{
                                                    url: pdfUrl,
                                                    scale: RENDER_SCALE,
                                                    page: pageNumber,
                                                    withAnnotations: true,
                                                    withTextContent: true
                                                }}
                                                class="pdf-viewer-element"
                                                style="display: block;"
                                                on:load_success={handleLoadSuccess}
                                                on:load_failure={handleLoadFailure}
                                                on:page_changed={handlePageChange}
                                            >
                                        <svelte:fragment slot="loading">
                                            <div class="pdf-skeleton">
                                                <div class="skeleton-header"></div>
                                                <div class="skeleton-line w-3/4"></div>
                                                <div class="skeleton-line w-full"></div>
                                                <div class="skeleton-line w-5/6"></div>
                                                <div class="skeleton-section"></div>
                                                <div class="skeleton-line w-2/3"></div>
                                                <div class="skeleton-line w-full"></div>
                                                <div class="skeleton-line w-4/5"></div>
                                                <div class="skeleton-section"></div>
                                                <div class="skeleton-line w-1/2"></div>
                                                <div class="skeleton-line w-full"></div>
                                                <div class="skeleton-line w-3/4"></div>
                                            </div>
                                        </svelte:fragment>
                                        
                                        <svelte:fragment slot="loading-failed">
                                            <div class="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                                                <div class="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                                                    <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <h4 class="text-xl font-semibold text-gray-800 mb-2">Unable to Load Resume</h4>
                                                <p class="text-gray-500 mb-6 max-w-sm">The PDF file couldn't be loaded. Please try downloading it directly.</p>
                                                <button 
                                                    onclick={downloadPDF}
                                                    class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    Download Resume
                                                </button>
                                            </div>
                                        </svelte:fragment>
                                    </PdfViewer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <!-- Initial Loading State - only shown before PdfViewer loads -->
                        <div class="pdf-document-frame">
                            <div class="pdf-scroll-container rounded-lg overflow-hidden">
                                <div class="pdf-skeleton">
                                    <div class="skeleton-header"></div>
                                    <div class="skeleton-line w-3/4"></div>
                                    <div class="skeleton-line w-full"></div>
                                    <div class="skeleton-line w-5/6"></div>
                                    <div class="skeleton-section"></div>
                                    <div class="skeleton-line w-2/3"></div>
                                    <div class="skeleton-line w-full"></div>
                                    <div class="skeleton-line w-4/5"></div>
                                    <div class="skeleton-section"></div>
                                    <div class="skeleton-line w-1/2"></div>
                                    <div class="skeleton-line w-full"></div>
                                    <div class="skeleton-line w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
                
                <!-- Keyboard Shortcuts Hint (Desktop only) -->
                <div class="hidden lg:flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                    <span class="flex items-center gap-1.5">
                        <kbd class="px-1.5 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-[10px]">Ctrl</kbd>
                        <span>+</span>
                        <kbd class="px-1.5 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-[10px]">Scroll</kbd>
                        <span class="ml-1">to zoom</span>
                    </span>
                    <span class="flex items-center gap-1.5">
                        <kbd class="px-1.5 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-[10px]">←</kbd>
                        <kbd class="px-1.5 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-[10px]">→</kbd>
                        <span class="ml-1">to navigate pages</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Main Container */
    .resume-viewer-wrapper {
        @apply w-full;
    }
    
    .resume-viewer-wrapper.fullscreen-mode {
        @apply fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4;
    }
    
    /* Premium Card Styling */
    .pdf-viewer-card {
        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 -20px 40px -20px rgba(59, 130, 246, 0.1) inset;
    }
    
    /* Document Frame */
    .pdf-document-frame {
        @apply relative p-2;
    }
    
    /* Scroll Container */
    .pdf-scroll-container {
        max-height: 70vh;
        overflow-y: auto;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        scrollbar-width: thin;
        scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
        box-shadow: 
            0 10px 40px -10px rgba(0,0,0,0.3),
            0 0 0 1px rgba(0,0,0,0.05);
    }
    
    .pdf-scroll-container.fullscreen-scroll {
        max-height: calc(100vh - 180px);
    }
    
    .pdf-scroll-container::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    .pdf-scroll-container::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.1);
        border-radius: 4px;
    }
    
    .pdf-scroll-container::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 4px;
    }
    
    .pdf-scroll-container::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
    }
    
    /* PDF Content */
    .pdf-content-wrapper {
        @apply min-h-[400px];
        /* Allow text selection */
        user-select: text;
        -webkit-user-select: text;
    }

    /* Container that expands to match zoomed content size for proper scrolling */
    .pdf-zoom-container {
        display: inline-block;
        min-width: 100%;
    }

    /* Zoom wrapper for CSS transform-based zoom */
    .pdf-zoom-wrapper {
        display: inline-block;
        transition: transform 0.15s ease-out;
        transform-origin: top left;
        /* Ensure text selection works through transform */
        user-select: text;
        -webkit-user-select: text;
    }

    /* Improve canvas rendering quality - allow pointer events for text selection */
    .pdf-content-wrapper :global(canvas) {
        image-rendering: auto;
    }
    
    /* Ensure text layer is selectable and positioned above canvas */
    .pdf-content-wrapper :global(.textLayer) {
        user-select: text !important;
        -webkit-user-select: text !important;
        pointer-events: auto !important;
        z-index: 2;
    }

    /* Annotation layer should also be interactive */
    .pdf-content-wrapper :global(.annotationLayer) {
        pointer-events: auto !important;
        z-index: 3;
    }
    
    .pdf-content-wrapper.zooming {
        touch-action: none !important;
        /* Only disable selection during active pinch gesture */
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
    }
    
    /* Skeleton Loading Animation */
    .pdf-skeleton {
        @apply bg-white p-8 min-h-[600px] space-y-4;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
    }
    
    .skeleton-header {
        @apply h-8 w-1/3 bg-gray-200 rounded mb-6;
    }
    
    .skeleton-line {
        @apply h-4 bg-gray-200 rounded;
    }
    
    .skeleton-section {
        @apply h-6 w-1/4 bg-gray-200 rounded mt-8 mb-4;
    }
    
    @keyframes skeleton-pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.6;
        }
    }
    
    /* Shimmer effect for skeleton */
    .pdf-skeleton::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.4),
            transparent
        );
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
    
    /* iOS Compatibility */
    @supports (-webkit-touch-callout: none) {
        .pdf-scroll-container {
            scroll-behavior: auto;
        }
        
        .pdf-content-wrapper:not(.zooming) {
            -webkit-user-select: text;
            user-select: text;
        }
    }
    
    /* Keyboard shortcuts hint styling */
    kbd {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
</style>