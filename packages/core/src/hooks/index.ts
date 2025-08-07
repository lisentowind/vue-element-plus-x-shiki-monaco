// ===== useContextMenu =====
// 核心类型和类（跨框架）
export type {
  ContextMenuItem,
  ContextMenuPosition,
  ContextMenuState,
  MenuItem,
  MenuItemSeparator,
  UseContextMenuCoreOptions,
} from "./useContextMenu/core";
export { ContextMenuCore } from "./useContextMenu/core";

// Editor 菜单相关
export type { EditorContextMenuOptions } from "./useContextMenu/editorMenu";
export {
  createEditorContextMenu,
  createMinimapContextMenu,
  MENU_PRESETS,
  MINIMAP_MENU_PRESETS,
} from "./useContextMenu/editorMenu";

// React hooks
export type { UseContextMenuReturn as UseContextMenuReactReturn } from "./useContextMenu/react";
export { useContextMenu as useContextMenuReact } from "./useContextMenu/react";

// Vue hooks
export type { UseContextMenuReturn as UseContextMenuVueReturn } from "./useContextMenu/vue";
export { useContextMenu as useContextMenuVue } from "./useContextMenu/vue";

// 向后兼容 - 默认导出 Vue 版本
export type { UseContextMenuReturn } from "./useContextMenu/vue";
export { useContextMenu } from "./useContextMenu/vue";

// ===== useMonacoDiffEdit =====
export type {
  CreateModelType,
  DefaultReturn,
  DiffEditInstance,
  DiffViewOptions,
  EditModelType,
  MonacoDiffOptions,
  UseMonacoDiffEditReturn,
} from "./useMonacoDiffEdit";
export type { useMonacoDiffEdit } from "./useMonacoDiffEdit";

// ===== useMonacoEdit =====
export type {
  EditInstance,
  MonacoOptions,
  UseMonacoEditReturn,
} from "./useMonacoEdit";
export { useMonacoEdit } from "./useMonacoEdit";
