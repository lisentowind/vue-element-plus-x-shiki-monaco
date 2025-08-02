import type { App, Plugin } from 'vue';
import Monaco from './components/Monaco/index.vue';

// 全量导出（保持向后兼容）
export * from './components';
// 组件导出
export { default as Monaco } from './components/Monaco/index.vue';

export { default as MonacoWithInstall } from './components/Monaco/install';

// Hooks 导出
export * from './hooks';

// 全局插件
const VueElementPlusXShikiMonaco: Plugin = {
  install(app: App) {
    app.component('Monaco', Monaco);
  },
};

export { VueElementPlusXShikiMonaco };
export default VueElementPlusXShikiMonaco;
