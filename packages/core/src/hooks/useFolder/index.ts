// 核心类型和函数
export type {
  FolderItem,
  UseFolderError,
  UseFolderOptions,
} from './core';
export { createFolderCore } from './core';

// 懒加载相关导出
export type {
  LazyFolderItem,
  UseLazyFolderOptions,
  UseLazyFolderReturn,
} from './lazyFolder';
export { createLazyFolder } from './lazyFolder';
export { useLazyFolder } from './lazyVue';

// React hooks
export { useFolder as useFolderReact } from './react';
export type { UseFolderReactReturn } from './react';

// Vue hooks
export { useFolder as useFolderVue } from './vue';
export type { UseFolderVueReturn } from './vue';

// 默认导出 Vue hooks
export { useFolder } from './vue';
export type { UseFolderVueReturn as UseFolderReturn } from './vue';
