import type { UserConfig } from 'vite';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import buildConfig from './.build/build';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const __DEV__ = mode === 'development';

  const baseConfig: UserConfig = {
    plugins: [vue({
      script: {
        propsDestructure: true,
      },
    })],
    build: buildConfig,
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
      },
    },
  };

  if (!__DEV__) {
    baseConfig.esbuild = {
      drop: ['console', 'debugger'],
    };
  }

  return baseConfig;
});
