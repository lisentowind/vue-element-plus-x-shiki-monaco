import { ContextMenuItem } from '../useContextMenu';
import { EditInstance } from '../useMonacoEdit';
export interface EditorContextMenuOptions {
    editor: EditInstance;
    enabledItems?: string[];
    customItems?: ContextMenuItem[];
}
export declare function createEditorContextMenu(options: EditorContextMenuOptions): ContextMenuItem[];
export declare const MENU_PRESETS: {
    readonly minimal: readonly ["copy", "paste", "selectAll"];
    readonly basic: readonly ["copy", "cut", "paste", "selectAll", "undo", "redo"];
    readonly full: readonly ["copy", "cut", "paste", "selectAll", "undo", "redo", "format", "find", "replace"];
};
