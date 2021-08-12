import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from '@svgr/rollup';
import imp from 'vite-plugin-imp';
import { visualizer } from 'rollup-plugin-visualizer';
import antd from './src/css/antd';

/**
 * https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    reactRefresh(),
    imp({
      libList: [{ libName: 'antd', style: (name) => `antd/es/${name}/style` }],
    }),
    svgr(),
    visualizer({
      filename: 'dist/bundle.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd'],
          icons: ['@ant-design/icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1024,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    preprocessorOptions: {
      // antd custom theme
      less: {
        javascriptEnabled: true,
        modifyVars: { ...antd },
      },
      // auto variable inject
      scss: {
        additionalData: `@import '@/css/variables.scss';`,
      },
    },
  },
});
