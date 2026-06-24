import { defineConfig } from 'vite'

export default defineConfig({
  base: '/johns-burguer-sp/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0
  }
})
