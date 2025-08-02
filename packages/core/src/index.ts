import type { App, Plugin } from 'vue';
import Monaco from './components/Monaco/index.vue';

export * from './components';
export * from './hooks';

const VueElementPlusXShikiMonaco: Plugin = {
  install(app: App) {
    app.component('Monaco', Monaco);
  }
};

export default VueElementPlusXShikiMonaco;