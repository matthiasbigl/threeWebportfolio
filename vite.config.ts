import { sveltekit } from '@sveltejs/kit/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    enhancedImages(),
    sveltekit()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split GSAP into its own chunk (shared across many components)
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          // Split svelte-i18n into its own chunk
          if (id.includes('node_modules/svelte-i18n') || id.includes('node_modules/intl-messageformat')) {
            return 'vendor-i18n';
          }
        }
      }
    }
  }
})
