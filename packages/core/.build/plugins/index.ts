import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import dtsPlugin from './dts';

const plugins: PluginOption[] = [
  vue({
    script: {
      propsDestructure: true,
    },
  }) as PluginOption,
  monacoEditorPlugin({
    languageWorkers: ['css', 'html', 'json', 'typescript', 'editorWorkerService'],
  }),
  dtsPlugin as PluginOption,
  libInjectCss() as PluginOption,
];

export default plugins;
