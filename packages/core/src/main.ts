import type { App } from 'vue'
import * as components from './components'
import pkg from '../package.json'

// 导出所有组件
export * from './components'

// 导出 hooks 和类型
export { useMonacoEdit } from './components/Monaco/hooks/useMonacoEdit'
export type { EditInstance, MonacoOptions } from './components/Monaco/hooks/useMonacoEdit'
export type { MonacoProps, MonacoEmits, MonacoExpose } from './components/Monaco/index.d'

// 定义组件类型接口
interface ComponentWithInstall {
  install?: (app: App) => void
}

// 默认导出插件对象
export default {
  install(app: App) {
    // 遍历所有组件并安装
    Object.entries(components).forEach(([_componentName, component]) => {
      const typedComponent = component as ComponentWithInstall
      if (typeof typedComponent.install === 'function') {
        typedComponent.install(app)
      }
    })
  },
  // 导出版本号
  version: pkg.version,
}