import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';


export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // Copia las fuentes de Bootstrap Icons a la carpeta dist/assets/fonts
          src: 'node_modules/bootstrap-icons/font/fonts/*',
          dest: 'assets/fonts',
        },
        {
        src: 'public/*',
        dest: 'assets'
        },
        {
          src: 'views/*',
          dest: 'views'
        },
        { src: 'robots.txt', 
          dest: '.' }
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        index: path.resolve('src/main.jsx'), // Punto de entrada React
        scripts: path.resolve('src/files/scripts.js'), // Script adicional para Pug
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: ({ name }) => {
          if (/\.(woff2?|eot|ttf|otf)$/.test(name ?? '')) {
            // Coloca las fuentes en assets/fonts
            return 'assets/fonts/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
    manifest: true,
    write: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@files': path.resolve('src/files'), // Alias para facilitar la importación
    },
  },
});