import type { ContextMenuItem } from '../useContextMenu';
import type { EditInstance } from '../useMonacoEdit';

export interface EditorContextMenuOptions {
  editor: EditInstance;
  enabledItems?: string[];
  customItems?: ContextMenuItem[];
}

export function createEditorContextMenu(
  options: EditorContextMenuOptions,
): ContextMenuItem[] {
  const { editor, enabledItems, customItems = [] } = options;

  const defaultItems: ContextMenuItem[] = [
    {
      type: 'item',
      id: 'copy',
      label: '复制',
      shortcut: 'Ctrl+C',
      action: () => {
        // 完全依赖Monaco的内置复制命令
        const copyAction = editor.getAction('editor.action.clipboardCopyAction');
        if (copyAction) {
          copyAction.run();
        }
        else {
          // 备选方案：触发copy事件
          editor.trigger('copy', 'copy', null);
        }
      },
    },
    {
      type: 'item',
      id: 'cut',
      label: '剪切',
      shortcut: 'Ctrl+X',
      action: () => {
        // 完全依赖Monaco的内置剪切命令
        const cutAction = editor.getAction('editor.action.clipboardCutAction');
        if (cutAction) {
          cutAction.run();
        }
        else {
          // 备选方案：触发cut事件
          editor.trigger('cut', 'cut', null);
        }
      },
    },
    {
      type: 'item',
      id: 'paste',
      label: '粘贴',
      shortcut: 'Ctrl+V',
      action: () => {
        // 完全依赖Monaco的内置粘贴命令，它有最好的权限处理
        const pasteAction = editor.getAction('editor.action.clipboardPasteAction');
        if (pasteAction) {
          pasteAction.run();
        }
        else {
          // 如果没有粘贴动作，直接触发键盘事件
          editor.trigger('keyboard', 'type', { text: '' });
          editor.trigger('paste', 'paste', null);
        }
      },
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'selectAll',
      label: '全选',
      shortcut: 'Ctrl+A',
      action: () => {
        const model = editor.getModel();
        if (model) {
          const fullRange = model.getFullModelRange();
          editor.setSelection(fullRange);
        }
      },
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'undo',
      label: '撤销',
      shortcut: 'Ctrl+Z',
      action: () => {
        editor.trigger('context-menu', 'undo', null);
      },
    },
    {
      type: 'item',
      id: 'redo',
      label: '重做',
      shortcut: 'Ctrl+Y',
      action: () => {
        editor.trigger('context-menu', 'redo', null);
      },
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'format',
      label: '格式化代码',
      shortcut: 'Shift+Alt+F',
      disabled: true,
      action: () => {
        editor.getAction('editor.action.formatDocument')?.run();
      },
    },
    {
      type: 'item',
      id: 'find',
      label: '查找',
      shortcut: 'Ctrl+F',
      action: () => {
        editor.getAction('actions.find')?.run();
      },
    },
    {
      type: 'item',
      id: 'replace',
      label: '替换',
      shortcut: 'Ctrl+H',
      action: () => {
        editor.getAction('editor.action.startFindReplaceAction')?.run();
      },
    },
  ];

  // 如果指定了启用的菜单项，则过滤
  let filteredItems = defaultItems;
  if (enabledItems && enabledItems.length > 0) {
    filteredItems = defaultItems.filter(
      item => item.type === 'separator' || enabledItems.includes(item.id),
    );
  }

  // 添加自定义菜单项
  if (customItems.length > 0) {
    if (filteredItems.length > 0) {
      filteredItems.push({ type: 'separator' });
    }
    filteredItems.push(...customItems);
  }

  return filteredItems;
}

// 预定义的菜单项组合
export const MENU_PRESETS = {
  minimal: ['copy', 'paste', 'selectAll'],
  basic: ['copy', 'cut', 'paste', 'selectAll', 'undo', 'redo'],
  full: [
    'copy',
    'cut',
    'paste',
    'selectAll',
    'undo',
    'redo',
    'format',
    'find',
    'replace',
  ],
} as const;
