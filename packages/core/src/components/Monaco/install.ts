import type { App } from 'vue'
import MonacoComponent from './index.vue'

// 为组件添加 install 方法
const Monaco = MonacoComponent as typeof MonacoComponent & {
  install: (app: App) => void
}

Monaco.install = (app: App) => {
  app.component('Monaco', Monaco)
}

export default Monaco