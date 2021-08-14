import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from '@svgr/rollup';
import imp from 'vite-plugin-imp';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    reactRefresh(),
    imp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
    svgr(),
    // visualizer({
    //   filename: 'dist/bundle.html',
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/antd\/(.*)\/style(.*)\.(c|le)ss/i.exec(id)) {
            return 'antd-style';
          } else if (/node_modules\/@ant-design\/icons/i.exec(id)) {
            return 'antd-icon';
          } else if (/node_modules\/antd/i.exec(id)) {
            return 'antd-lib';
          }
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
