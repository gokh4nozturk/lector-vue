import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'LectorVue',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue', 'pdfjs-dist', /^pdfjs-dist\/.*/],
      output: {
        globals: {
          vue: 'Vue',
          'pdfjs-dist': 'pdfjsLib'
        }
      }
    }
  }
}) 