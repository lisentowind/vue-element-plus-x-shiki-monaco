import { defineConfig } from 'rolldown';
import postcss from 'rollup-plugin-postcss';
import vue from 'rollup-plugin-vue';

const entries = {
  'index': './src/index.ts',
  'components': './src/components.ts',
  'hooks': './src/hooks.ts',
};

export default defineConfig([
  // ESM build
  {
    input: entries,
    plugins: [
      vue(),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
    external: [
      'vue',
      'monaco-editor-core',
      '@shikijs/monaco',
      'shiki',
      /\.ttf$/,
      /\.woff$/,
      /\.woff2$/,
      /\.eot$/,
    ],
    output: {
      dir: 'dist/es',
      format: 'esm',
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name]-[hash].mjs',
      sourcemap: true,
      minify: true,
      exports: 'named',
      // 防止生成不必要的chunk
      manualChunks: undefined,
    },
  },
  // CJS build
  {
    input: entries,
    plugins: [
      vue(),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
    external: [
      'vue',
      'monaco-editor-core',
      '@shikijs/monaco',
      'shiki',
      /\.ttf$/,
      /\.woff$/,
      /\.woff2$/,
      /\.eot$/,
    ],
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      entryFileNames: '[name].cjs',
      chunkFileNames: '[name]-[hash].cjs',
      sourcemap: true,
      minify: true,
      exports: 'named',
      // 防止生成不必要的chunk
      manualChunks: undefined,
    },
  },
  // UMD build
  {
    input: './src/index.ts',
    plugins: [
      vue(),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
    external: [
      'vue',
      'monaco-editor-core',
      '@shikijs/monaco',
      'shiki',
    ],
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'VueElementPlusXShikiMonaco',
      sourcemap: true,
      minify: true,
      exports: 'named',
      globals: {
        'vue': 'Vue',
        'monaco-editor-core': 'monaco',
        '@shikijs/monaco': 'ShikiMonaco',
        'shiki': 'Shiki',
      },
    },
  },
]);
