import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dtsPlugin from './dts';

const plugins: PluginOption[] = [
  vue({
    script: {
      propsDestructure: true,
    },
  }) as PluginOption,
  dtsPlugin as PluginOption,
  libInjectCss() as PluginOption,
];

export default plugins;
