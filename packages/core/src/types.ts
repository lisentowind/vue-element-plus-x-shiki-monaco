// 全局类型定义文件
import type { Plugin } from 'vue';

// Vue 应用扩展类型声明（必须在顶层）
declare module '@vue/runtime-core' {
  interface GlobalComponents {
    Monaco: typeof import('./components/Monaco/index.vue')['default'];
  }
}

// 导出组件实例类型
export type MonacoInstance = InstanceType<typeof import('./components/Monaco/index.vue')['default']>;

// 导出 hooks 相关类型
export type { EditInstance, MonacoOptions, UseMonacoEditReturn } from './hooks/useMonacoEdit';

// 导出插件类型
export interface VueElementPlusXShikiMonacoOptions {
  // 未来可能的配置选项
}

export type VueElementPlusXShikiMonacoPlugin = Plugin & {
  // 可能的额外方法
};

// 导出常用类型工具
export type ComponentProps<T> = T extends (...args: any) => any
  ? never
  : T extends new (...args: any) => any
    ? InstanceType<T>['$props']
    : never;

export type MonacoProps = ComponentProps<typeof import('./components/Monaco/index.vue')['default']>;