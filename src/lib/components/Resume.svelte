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
    let scale = $state(1.2);
    let containerElement: HTMLDivElement = $state();

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'MatthiasBigl-Resume.pdf';
        link.click();
    };

    const navigatePages = (forward: boolean = false) => {
        if (forward) {
            pageNumber = pageNumber === totalPages ? 1 : pageNumber + 1;
        } else {
            pageNumber = pageNumber === 1 ? totalPages : pageNumber - 1;
        }
        pdfViewer?.goToPage(pageNumber);
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
    };

    // Calculate responsive scale
    const calculateScale = () => {
        if (!containerElement) return 1.2;
        const containerWidth = containerElement.clientWidth;
        // Adjust scale based on container width
        if (containerWidth < 640) return 0.8; // Mobile
        if (containerWidth < 1024) return 1.0; // Tablet
        return 1.2; // Desktop
    };

    const updateScale = () => {
        const newScale = calculateScale();
        scale = newScale;
        pdfViewer?.resize(newScale);
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
        }

        // Handle window resize
        const handleResize = () => {
            updateScale();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<div bind:this={containerElement} class="w-full mx-auto">
    <div class="glass-card p-6 sm:p-8 rounded-2xl">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 class="text-2xl sm:text-3xl font-bold blue-gradient_text text-center sm:text-left">
                Resume Preview
            </h3>
            <div class="flex items-center gap-3">
                {#if isPdfLoaded}
                    <div class="flex items-center gap-2 glass-card px-3 py-1 rounded-lg text-sm text-gray-300">
                        <span>{pageNumber} / {totalPages}</span>
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
                <div class="flex flex-col items-center">                    <!-- PDF Container -->
                    <div class="w-full max-w-full overflow-hidden rounded-lg shadow-2xl bg-white">
                        {#if PdfViewer}
                            <PdfViewer
                                bind:this={pdfViewer}
                                props={{
                                    path: pdfUrl,
                                    scale: scale,
                                    page: pageNumber,
                                    withAnnotations: true,
                                    withTextContent: false
                                }}
                                style="display: block; max-width: 100%; height: auto;"
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