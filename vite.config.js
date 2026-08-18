import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react()],
  build: {
    outDir: 'sdscrackers',
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('lucide-react')) {
              return 'lucide-react';
            }
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('scheduler') ||
              id.includes('use-sync-external-store') ||
              id.includes('object-assign')
            ) {
              return 'react-vendor';
            }
            return 'vendor';  
          }
        },
      },
    },
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/offer360-api': {
        target: 'https://offer360.in',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/offer360-api/, ''),
        headers: {
          origin: 'https://offer360.in',
          referer: 'https://offer360.in/',
        },
      },
      '/fireworks': {
        target: 'https://offer360.in',
        changeOrigin: true,
        secure: false,
        headers: {
          origin: 'https://offer360.in',
          referer: 'https://offer360.in/',
        },
      },
    },
  },
});
