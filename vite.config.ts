import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit(),"https://github.com/ChromeDevTools/vite-plugin-devtools-json"],
  ssr: {
    noExternal: ['three']
  }
})
