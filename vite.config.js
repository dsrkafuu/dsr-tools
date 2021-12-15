import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import htmlEnv from 'vite-plugin-html-env';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    svgr({
      icon: true,
      typescript: true,
      svgProps: { className: 'g-icon' },
    }),
    react(),
    htmlEnv(process.env),
    visualizer(),
  ],

  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1024,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#8aa2d3', // antd custom theme
        },
      },
      scss: {
        additionalData: `@import '@/css/variables.scss';`, // auto variable inject
      },
    },
  },
});
