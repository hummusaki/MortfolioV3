import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.', // root of your project

  base: '/',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        files: resolve(__dirname, 'convert/index.html'),
        media: resolve(__dirname, 'convert/media/index.html'),
        // Add more pages here if needed
      },
    },
    outDir: 'dist', // Output folder
    emptyOutDir: true,
  },

  server: {
    open: '/',
  },
});
