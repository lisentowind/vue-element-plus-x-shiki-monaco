// 导出核心类型和类
export type {
  ContextMenuItem,
  ContextMenuPosition,
  ContextMenuState,
  MenuItem,
  MenuItemSeparator,
  UseContextMenuCoreOptions,
} from "./core";
export { ContextMenuCore } from "./core";

// 导出 React hooks
export type { UseContextMenuReturn as UseContextMenuReactReturn } from "./react";
export { useContextMenu as useContextMenuReact } from "./react";

// 导出 Vue hooks
export type { UseContextMenuReturn as UseContextMenuVueReturn } from "./vue";
export { useContextMenu as useContextMenuVue } from "./vue";

// 为了保持向后兼容性，默认导出 Vue 版本
export type { UseContextMenuReturn } from "./vue";
export { useContextMenu } from "./vue";
