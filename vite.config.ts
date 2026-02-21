import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url']
		}),
		enhancedImages(),
		sveltekit()
	],
	build: {
		// Target modern browsers only — smaller output, no legacy polyfills
		target: 'es2020',
		// Enable CSS code-splitting so each route only loads its own CSS
		cssCodeSplit: true,
		// Increase the chunk warning limit (Three.js is large but lazy-loaded)
		chunkSizeWarningLimit: 600,
		rollupOptions: {
			output: {
				// Optimised chunk splitting — keeps initial bundle tiny
				manualChunks(id) {
					// Three.js is the heaviest dep (~600 KB) — always lazy-loaded
					if (id.includes('node_modules/three')) {
						return 'vendor-three';
					}
					// GSAP shared across many components — lazy-loaded in each
					if (id.includes('node_modules/gsap')) {
						return 'vendor-gsap';
					}
					// Markdown parser — only used on pricing page
					if (id.includes('node_modules/marked')) {
						return 'vendor-marked';
					}
					// Zod — only used on contact form
					if (id.includes('node_modules/zod')) {
						return 'vendor-zod';
					}
				}
			}
		},
		// Better minification
		minify: 'esbuild',
		// Inline small assets (<4KB) to reduce HTTP requests
		assetsInlineLimit: 4096
	},
	// Optimise dependency pre-bundling
	optimizeDeps: {
		exclude: ['three']
	}
});
