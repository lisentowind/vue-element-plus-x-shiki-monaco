import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import vue from 'rollup-plugin-vue';

const entries = {
  index: './src/index.ts',
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
      chunkFileNames: '[name].mjs',
      sourcemap: true,
      minify: true,
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
      chunkFileNames: '[name].cjs',
      sourcemap: true,
      minify: true,
    },
  },
  // Types generation (skip Vue files)
  {
    input: {
      index: './src/hooks-only.ts', // 临时创建一个只包含 hooks 的入口文件
    },
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
      dir: 'types',
      format: 'esm',
    },
    plugins: [
      dts({
        emitDtsOnly: true,
      }),
    ],
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
    },
  },
]);
