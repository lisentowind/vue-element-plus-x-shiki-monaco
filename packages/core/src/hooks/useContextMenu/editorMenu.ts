import type { ContextMenuItem } from "../useContextMenu";
import type { EditInstance } from "../useMonacoEdit";

export interface EditorContextMenuOptions {
  editor: EditInstance;
  enabledItems?: string[];
  customItems?: ContextMenuItem[];
}

export function createEditorContextMenu(
  options: EditorContextMenuOptions
): ContextMenuItem[] {
  const { editor, enabledItems, customItems = [] } = options;

  const defaultItems: ContextMenuItem[] = [
    {
      type: "item",
      id: "copy",
      label: "复制",
      shortcut: "Ctrl+C",
      action: async () => {
        try {
          editor.trigger("source", "editor.action.clipboardCopyAction", null);
        } catch (error) {
          console.error("复制失败:", error);
        }
      },
    },
    {
      type: "item",
      id: "cut",
      label: "剪切",
      shortcut: "Ctrl+X",
      action: async () => {
        try {
          const selection = editor.getSelection();
          const model = editor.getModel();
          if (!selection || !model) return;

          const text = model.getValueInRange(selection);

          // 写入剪贴板（需要用户交互环境）
          await navigator.clipboard.writeText(text);

          // 删除选中的文本
          editor.executeEdits("cut", [
            {
              range: selection,
              text: "",
              forceMoveMarkers: true,
            },
          ]);
        } catch (error) {
          console.error("剪切失败:", error);
        }
      },
    },
    {
      type: "item",
      id: "paste",
      label: "粘贴",
      shortcut: "Ctrl+V",
      action: async () => {
        try {
          const text = await navigator.clipboard.readText();
          const selection = editor.getSelection();

          editor.executeEdits("paste", [
            {
              range: selection!,
              text,
              forceMoveMarkers: true,
            },
          ]);
        } catch (error) {
          console.error("粘贴失败:", error);
        }
      },
    },
    { type: "separator" },
    {
      type: "item",
      id: "selectAll",
      label: "全选",
      shortcut: "Ctrl+A",
      action: () => {
        const model = editor.getModel();
        if (model) {
          const fullRange = model.getFullModelRange();
          editor.setSelection(fullRange);
        }
      },
    },
    { type: "separator" },
    {
      type: "item",
      id: "undo",
      label: "撤销",
      shortcut: "Ctrl+Z",
      action: () => {
        editor.trigger("context-menu", "undo", null);
      },
    },
    {
      type: "item",
      id: "redo",
      label: "重做",
      shortcut: "Ctrl+Y",
      action: () => {
        editor.trigger("context-menu", "redo", null);
      },
    },
    { type: "separator" },
    {
      type: "item",
      id: "format",
      label: "格式化代码(需自行实现)",
      shortcut: "Shift+Alt+F",
      disabled: true,
      action: () => {
        editor.trigger("source", "editor.action.formatDocument", null);
      },
    },
    {
      type: "item",
      id: "find",
      label: "查找",
      shortcut: "Ctrl+F",
      action: () => {
        editor.getAction("actions.find")?.run();
      },
    },
    {
      type: "item",
      id: "replace",
      label: "替换",
      shortcut: "Ctrl+H",
      action: () => {
        editor.getAction("editor.action.startFindReplaceAction")?.run();
      },
    },
  ];

  // 如果指定了启用的菜单项，则过滤
  let filteredItems = defaultItems;
  if (enabledItems && enabledItems.length > 0) {
    filteredItems = defaultItems.filter(
      (item) => item.type === "separator" || enabledItems.includes(item.id)
    );
  }

  // 添加自定义菜单项
  if (customItems.length > 0) {
    if (filteredItems.length > 0) {
      filteredItems.push({ type: "separator" });
    }
    filteredItems.push(...customItems);
  }

  return cleanupSeparators(filteredItems);
}

// 清理多余的分隔符
function cleanupSeparators(items: ContextMenuItem[]): ContextMenuItem[] {
  const result: ContextMenuItem[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // 跳过开头的分隔符
    if (item?.type === "separator" && result.length === 0) {
      continue;
    }

    // 跳过连续的分隔符
    if (
      item?.type === "separator" &&
      result[result.length - 1]?.type === "separator"
    ) {
      continue;
    }

    item && result.push(item);
  }

  // 移除末尾的分隔符
  while (result.length > 0 && result[result.length - 1]?.type === "separator") {
    result.pop();
  }

  return result;
}

// 预定义的菜单项组合
export const MENU_PRESETS = {
  minimal: ["copy", "paste", "selectAll"],
  basic: ["copy", "cut", "paste", "selectAll", "undo", "redo"],
  full: [
    "copy",
    "cut",
    "paste",
    "selectAll",
    "undo",
    "redo",
    "format",
    "find",
    "replace",
  ],
} as const;
