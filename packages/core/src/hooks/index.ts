// 直接从具体hook导出，避免中间层
export type { EditInstance, MonacoOptions, UseMonacoEditReturn } from './useMonacoEdit';
export { useMonacoEdit } from './useMonacoEdit';

export type { 
  ContextMenuItem, 
  MenuItem, 
  MenuItemSeparator, 
  ContextMenuPosition, 
  UseContextMenuOptions, 
  UseContextMenuReturn 
} from './useContextMenu';
export { useContextMenu } from './useContextMenu';

export type { EditorContextMenuOptions } from './useContextMenu/editorMenu';
export { createEditorContextMenu, MENU_PRESETS } from './useContextMenu/editorMenu';
