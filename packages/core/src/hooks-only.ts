// 只导出 hooks 和类型，用于类型生成
export { useMonacoEdit } from './components/Monaco/hooks/useMonacoEdit';
export type { EditInstance, MonacoOptions } from './components/Monaco/hooks/useMonacoEdit';

// 导出 Vue 组件类型
export type { MonacoEmits, MonacoExpose, MonacoProps } from './components/Monaco/index.d';
export type { default as Monaco } from './components/Monaco/index.d';
