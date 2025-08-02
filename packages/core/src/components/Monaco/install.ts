import type { App } from 'vue';
import MonacoComponent from './index.vue';

// 为组件添加 install 方法，支持单独安装
const Monaco = MonacoComponent as typeof MonacoComponent & {
  install: (app: App) => void;
};

Monaco.install = (app: App) => {
  app.component('Monaco', Monaco);
};

// 添加组件名称，便于插件安装时使用
Monaco.name = 'Monaco';

export default Monaco;
