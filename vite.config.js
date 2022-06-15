import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import htmlEnv from 'vite-plugin-html-env';
// import { VitePWA as pwa } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    htmlEnv(process.env),
    svgLoader(),
    // pwa({
    //   manifest: {
    //     name: 'DSRTOOLS',
    //     short_name: 'DSRTOOLS',
    //     description: 'DSR 实用工具及资源发布站。',
    //     includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: 'pwa-512x512',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    //   workbox: {
    //     runtimeCaching: [
    //       // google fonts css
    //       {
    //         urlPattern: /^https?:\/\/fonts\.googleapis\.com\/.*/i,
    //         handler: 'StaleWhileRevalidate',
    //         options: {
    //           cacheName: 'googleapis-fonts-cache',
    //           expiration: { maxEntries: 10, maxAgeSeconds: 604800 }, // only one css loaded
    //           cacheableResponse: { statuses: [0, 200] },
    //         },
    //       },
    //       // google fonts webfonts
    //       {
    //         urlPattern: /^https?:\/\/fonts\.gstatic\.com\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'gstatic-fonts-cache',
    //           expiration: { maxEntries: 1000, maxAgeSeconds: 31536000 }, // google's css has 600+ files
    //           cacheableResponse: { statuses: [0, 200] },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/styles/variables';`,
      },
    },
  },
  build: {
    emptyOutDir: true,
    target: ['chrome90', 'firefox90', 'safari14'],
  },
});
