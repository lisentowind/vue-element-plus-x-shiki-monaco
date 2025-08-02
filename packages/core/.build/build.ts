import type { BuildEnvironmentOptions } from 'vite';
import { extname, join, relative, resolve } from 'node:path';
import fg from 'fast-glob';

const root = resolve(__dirname, '../');

const entries = fg.globSync('src/components/*/*.(tsx|ts|vue)', {
  ignore: ['src/components/**/*.d.ts', 'src/components/**/*.types.ts'],
});

const hooksEntries = fg.globSync('src/hooks/*.(ts|tsx)', {
  ignore: ['src/hooks/**/*.d.ts', 'src/hooks/**/*.types.ts'],
});

const entriesObj = Object.fromEntries(
  entries.map((f) => {
    return [
      relative('src/components', f.slice(0, f.length - extname(f).length)),
      join(root, f),
    ];
  }),
);

const hooksEntriesObj = Object.fromEntries(
  hooksEntries.map((f) => {
    return [
      `hooks/${relative('src/hooks', f.slice(0, f.length - extname(f).length))}`,
      join(root, f),
    ];
  }),
);

const buildConfig: BuildEnvironmentOptions = {
  lib: {
    name: 'ElementPlusX',
    entry: {
      index: resolve(__dirname, '../src/index.ts'),
      components: resolve(__dirname, '../src/components.ts'),
      ...entriesObj,
      ...hooksEntriesObj,
    },
    fileName: (format, entryName) => {
      return `${format}/${entryName}.js`;
    },
    formats: ['es'],
  },
  rollupOptions: {
    external: [
      'vue', // Vue 3 核心库
      'vue/jsx-runtime', // Vue JSX 运行时
    ],
    output: {
      globals: {
        vue: 'Vue',
      },
      exports: 'named', // 确保有命名导出
      // 将CSS提取到单独的文件中
      assetFileNames: (assetInfo) => {
        if (assetInfo.name && assetInfo.name.endsWith('.css')) {
          return 'es/[name][extname]';
        }
        return 'es/[name]-[hash][extname]';
      },
    },
  },
  sourcemap: true,
  // 减少文件大小
  minify: 'terser',
  // CSS 处理 - 禁用 CSS 代码分割，将所有CSS合并到一个文件
  cssCodeSplit: false,
  // 确保只生成一个CSS文件
  emptyOutDir: false,
};

export default buildConfig;
