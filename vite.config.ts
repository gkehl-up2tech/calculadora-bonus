import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const embedded = process.env.VITE_EMBEDDED === 'true'

// BASE_PATH permite publicar em subcaminho (ex.: GitHub Pages em /calculadora-bonus/).
// VITE_EMBEDDED=true gera um build para páginas hospedadas: fontes e imagens embutidas no CSS.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: embedded ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false } : undefined,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
