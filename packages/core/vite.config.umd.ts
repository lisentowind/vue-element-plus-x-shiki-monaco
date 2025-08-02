import path, { resolve } from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vite';
import plugins from './.build/plugins';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ...plugins, // 基础插件配置
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  build: {
    lib: {
      name: 'ElementPlusXShikiMonaco',
      entry: resolve(__dirname, './src/index.ts'),
      formats: ['umd'],
      fileName: (format) => {
        return `${format}/index.js`;
      },
      cssFileName: 'styles.css',
    },
    rollupOptions: {
      // 外部依赖配置，这些依赖不会被打包，需要用户自行提供
      external: [
        'vue', // Vue 3 核心库
        'vue/jsx-runtime', // Vue JSX 运行时
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    emptyOutDir: false,
    sourcemap: true,
    minify: 'terser',
    cssCodeSplit: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
});
