<script lang="ts">
    import { browser } from '$app/environment';

    interface Props {
        pdfUrl?: string;
    }

    let { pdfUrl = '/assets/resume.pdf' }: Props = $props();

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'MatthiasBigl-Resume.pdf';
        link.click();
    };

    const openInNewTab = () => {
        window.open(pdfUrl, '_blank');
    };
</script>

<div class="w-full max-w-5xl mx-auto">
    <!-- Glass Card Container -->
    <div class="pdf-viewer-card relative overflow-hidden rounded-2xl lg:rounded-3xl">
        <!-- Animated Background Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 opacity-50"></div>
        <div class="absolute inset-0 backdrop-blur-xl"></div>

        <!-- Inner Content -->
        <div class="relative z-10 p-3 sm:p-4 lg:p-6">
            <!-- Header -->
            <div class="flex items-center gap-3 mb-4">
                <div class="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center shadow-lg shadow-blue-500/25">
                    <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Resume</h3>
                    <p class="text-xs sm:text-sm text-gray-400">PDF Document</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 ml-auto">
                    <button
                        onclick={openInNewTab}
                        class="p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 transition-all"
                        title="Open in New Tab"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </button>
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

            <!-- PDF iframe -->
            <div class="pdf-container rounded-xl overflow-hidden">
                <iframe
                    src={`${pdfUrl}#view=FitH`}
                    title="Resume PDF"
                    class="w-full h-full border-0 bg-white rounded-lg"
                ></iframe>
            </div>
        </div>
    </div>
</div>

<style>
    .pdf-viewer-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow:
            0 20px 48px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.04) inset,
            0 -16px 32px -16px rgba(59, 130, 246, 0.08) inset;
    }

    .pdf-container {
        height: 75vh;
        min-height: 500px;
    }

    @media (max-width: 640px) {
        .pdf-container {
            height: 60vh;
            min-height: 400px;
        }
    }
</style>