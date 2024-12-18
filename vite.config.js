import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: '/',
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve('src/main.jsx'), // Punto de entrada React
        scripts: path.resolve('src/files/scripts.js'), // Script adicional para Pug
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
    manifest: true,
    write: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
})
