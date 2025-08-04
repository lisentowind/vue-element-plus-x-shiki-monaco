import type { ContextMenuItem } from "../useContextMenu";
import type { EditInstance } from "../useMonacoEdit";

export declare const DEFAULT_FONT_SIZE = 16;
export declare const MIN_FONT_SIZE = 8;
export declare const MAX_FONT_SIZE = 40;
export interface EditorContextMenuOptions {
  editor: EditInstance;
  enabledItems?: string[];
  customItems?: ContextMenuItem[];
}
export interface MinimapContextMenuOptions {
  editor: EditInstance;
  enabledItems?: string[];
  customItems?: ContextMenuItem[];
}
export declare function createEditorContextMenu(
  options: EditorContextMenuOptions,
): ContextMenuItem[];
export declare function createMinimapContextMenu(
  options: MinimapContextMenuOptions,
): ContextMenuItem[];
export declare const MENU_PRESETS: {
  readonly minimal: readonly ["copy", "paste", "selectAll"];
  readonly basic: readonly [
    "copy",
    "cut",
    "paste",
    "selectAll",
    "undo",
    "redo",
    "toggleMinimap",
  ];
  readonly full: readonly [
    "copy",
    "cut",
    "paste",
    "selectAll",
    "undo",
    "redo",
    "toggleMinimap",
    "increaseFontSize",
    "decreaseFontSize",
    "resetFontSize",
    "format",
    "find",
    "replace",
  ];
};
export declare const MINIMAP_MENU_PRESETS: {
  readonly minimal: readonly ["toggleMinimap"];
  readonly basic: readonly [
    "toggleMinimap",
    "minimapSide",
    "minimapShowSlider",
  ];
  readonly full: readonly ["toggleMinimap", "minimapSide", "minimapShowSlider"];
};
