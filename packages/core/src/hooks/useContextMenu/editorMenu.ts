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
          // 优先使用Monaco的内置复制命令
          const copyAction = editor.getAction(
            "editor.action.clipboardCopyAction"
          );
          if (copyAction) {
            copyAction.run();
            return;
          }

          // 备选方案1: 使用trigger触发内置命令
          try {
            editor.trigger("source", "editor.action.clipboardCopyAction", null);
            return;
          } catch (triggerError) {
            console.warn("Monaco内置复制命令触发失败:", triggerError);
          }

          // 备选方案2: 自定义复制实现
          const selection = editor.getSelection();
          let textToCopy = "";

          if (selection && !selection.isEmpty()) {
            // 复制选中的文本
            textToCopy = editor.getModel()?.getValueInRange(selection) || "";
          } else {
            // 如果没有选中内容，复制当前行
            const position = editor.getPosition();
            if (position) {
              const lineContent =
                editor.getModel()?.getLineContent(position.lineNumber) || "";
              textToCopy = lineContent;
            }
          }

          if (textToCopy) {
            await navigator.clipboard.writeText(textToCopy);
          }
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
      disabled: true,
      action: async () => {
        try {
          // 优先使用Monaco的内置剪切命令
          const cutAction = editor.getAction(
            "editor.action.clipboardCutAction"
          );
          if (cutAction) {
            cutAction.run();
            return;
          }

          // 备选方案1: 使用trigger触发内置命令
          try {
            editor.trigger("source", "editor.action.clipboardCutAction", null);
            return;
          } catch (triggerError) {
            console.warn("Monaco内置剪切命令触发失败:", triggerError);
          }

          // 备选方案2: 自定义剪切实现
          const selection = editor.getSelection();
          let textToCut = "";

          if (selection && !selection.isEmpty()) {
            // 剪切选中的文本
            textToCut = editor.getModel()?.getValueInRange(selection) || "";
            if (textToCut) {
              await navigator.clipboard.writeText(textToCut);
              editor.executeEdits("cut", [
                {
                  range: selection,
                  text: "",
                  forceMoveMarkers: true,
                },
              ]);
            }
          } else {
            // 如果没有选中内容，剪切当前行
            const position = editor.getPosition();
            if (position) {
              const lineNumber = position.lineNumber;
              const lineContent =
                editor.getModel()?.getLineContent(lineNumber) || "";
              const fullRange = {
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber + 1,
                endColumn: 1,
              };

              await navigator.clipboard.writeText(`${lineContent} \n`);
              editor.executeEdits("cut", [
                {
                  range: fullRange,
                  text: "",
                  forceMoveMarkers: true,
                },
              ]);
            }
          }
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
      disabled: true,
      action: async () => {
        try {
          // 优先使用Monaco的内置粘贴命令
          const pasteAction = editor.getAction(
            "editor.action.clipboardPasteAction"
          );
          if (pasteAction) {
            pasteAction.run();
            return;
          }

          // 备选方案1: 使用trigger触发内置命令
          try {
            editor.trigger(
              "source",
              "editor.action.clipboardPasteAction",
              null
            );
            return;
          } catch (triggerError) {
            console.warn("Monaco内置粘贴命令触发失败:", triggerError);
          }

          // 备选方案2: 自定义粘贴实现
          try {
            const text = await navigator.clipboard.readText();
            if (text) {
              const selection = editor.getSelection();
              if (selection) {
                editor.executeEdits("paste", [
                  {
                    range: selection,
                    text,
                    forceMoveMarkers: true,
                  },
                ]);

                // 聚焦编辑器
                editor.focus();
              }
            }
          } catch (clipboardError) {
            console.warn("剪贴板读取失败:", clipboardError);

            // 备选方案3: 使用document.execCommand (已废弃但某些情况下仍可用)
            try {
              editor.focus();
              document.execCommand("paste");
            } catch (execError) {
              console.error("所有粘贴方案都失败了:", execError);
            }
          }
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
      label: "格式化代码",
      shortcut: "Shift+Alt+F",
      disabled: true,
      action: () => {
        editor.getAction("editor.action.formatDocument")?.run();
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
