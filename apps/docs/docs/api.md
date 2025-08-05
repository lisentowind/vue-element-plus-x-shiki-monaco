---
sidebar_position: 3
title: API 参考
---

# API 参考

## Monaco 组件

`Monaco` 是核心的代码编辑器组件，基于 Monaco Editor 和 Shiki 构建，提供丰富的代码编辑功能。

### 基本用法

```vue
<template>
  <Monaco
    language="javascript"
    theme="vitesse-light"
    :value="code"
    height="400px"
    :show-toolbar="true"
    :auto-resize="true"
    :context-menu="{ enabled: true, items: 'full', variant: 'glass' }"
    :minimap-context-menu="{ enabled: true, items: 'basic', variant: 'glass' }"
    @change="handleChange"
    @ready="handleReady"
  />
</template>
```

## Props

### currentLanguage

- **类型**: `BundledLanguage`
- **默认值**: `'javascript'`
- **描述**: 设置编辑器的当前语言模式

支持的语言包括：`javascript`, `typescript`, `python`, `html`, `css`, `json`, `markdown`, `vue`, `react`, `go`, `rust`, `php`, `java`, `c`, `cpp`, `csharp` 等。

```vue
<Monaco current-language="typescript" />
```

### currentTheme

- **类型**: `BundledTheme`
- **默认值**: `'vitesse-light'`
- **描述**: 设置编辑器当前主题

支持的主题包括：`vitesse-light`, `vitesse-dark`, `github-light`, `github-dark`, `one-dark-pro`, `dracula`, `nord`, `material-theme` 等。

```vue
<Monaco current-theme="vitesse-dark" />
```

### languages

- **类型**: `BundledLanguage[]`
- **默认值**: `['javascript', 'typescript', 'python', 'html', 'css', 'json']`
- **描述**: 编辑器支持的语言列表

```vue
<Monaco :languages="['javascript', 'typescript', 'vue', 'go']" />
```

### themes

- **类型**: `BundledTheme[]`
- **默认值**: `['vitesse-light', 'vitesse-dark', 'github-light', 'github-dark']`
- **描述**: 编辑器支持的主题列表

```vue
<Monaco :themes="['vitesse-light', 'vitesse-dark', 'one-dark-pro']" />
```

### value

- **类型**: `string`
- **默认值**: `''`
- **描述**: 编辑器的初始内容

```vue
<Monaco :value="initialCode" />
```

### height

- **类型**: `string`
- **默认值**: `'400px'`
- **描述**: 编辑器的高度

```vue
<Monaco height="600px" />
```

### showToolbar

- **类型**: `boolean`
- **默认值**: `true`
- **描述**: 是否显示顶部工具栏

```vue
<Monaco :show-toolbar="false" />
```

### autoResize

- **类型**: `boolean`
- **默认值**: `true`
- **描述**: 是否启用自动尺寸调整

```vue
<Monaco :auto-resize="false" />
```

### monacoEditClass

- **类型**: `string`
- **默认值**: `undefined`
- **描述**: 编辑器容器的自定义 CSS 类名

```vue
<Monaco monaco-edit-class="my-custom-editor" />
```

### fileName

- **类型**: `string`
- **默认值**: `undefined`
- **描述**: 工具栏显示的文件名

```vue
<Monaco file-name="main.ts" />
```

### contextMenu

- **类型**: `ContextMenuConfig`
- **默认值**: `{ enabled: true, items: 'full', variant: 'glass' }`
- **描述**: 编辑器区域自定义右键菜单配置

#### ContextMenuConfig 接口

```typescript
interface ContextMenuConfig {
  enabled?: boolean; // 是否启用右键菜单
  items?: string[] | "minimal" | "basic" | "full"; // 菜单项配置
  customItems?: ContextMenuItem[]; // 自定义菜单项
  variant?: "classic" | "glass"; // 菜单样式变体
  teleportTarget?: string | HTMLElement; // 菜单的挂载目标
}
```

#### 预设菜单配置

```vue
<!-- 最小菜单：复制、粘贴、全选 -->
<Monaco :context-menu="{ enabled: true, items: 'minimal', variant: 'glass' }" />

<!-- 基础菜单：复制、剪切、粘贴、全选、撤销、重做 -->
<Monaco :context-menu="{ enabled: true, items: 'basic', variant: 'glass' }" />

<!-- 完整菜单：所有功能 -->
<Monaco :context-menu="{ enabled: true, items: 'full', variant: 'glass' }" />

<!-- 经典样式菜单 -->
<Monaco :context-menu="{ enabled: true, items: 'full', variant: 'classic' }" />

<!-- 自定义菜单项 -->
<Monaco
  :context-menu="{
    enabled: true,
    items: ['copy', 'paste', 'selectAll'],
    variant: 'glass',
    teleportTarget: '.my-menu-container',
    customItems: [
      {
        type: 'separator',
      },
      {
        type: 'item',
        id: 'custom-action',
        label: '自定义操作',
        shortcut: 'Ctrl+Shift+X',
        action: () => console.log('自定义操作'),
      },
    ],
  }"
/>

<!-- 指定菜单挂载到特定DOM元素 -->
<Monaco
  :context-menu="{
    enabled: true,
    items: 'full',
    variant: 'glass',
    teleportTarget: document.getElementById('menu-container'),
  }"
/>
```

### teleportTarget

- **类型**: `string | HTMLElement`
- **默认值**: `'.monaco-editor'`
- **描述**: 指定右键菜单的挂载目标，用于控制菜单渲染的位置

```vue
<!-- 挂载到特定选择器 -->
<Monaco teleport-target=".my-container" />

<!-- 挂载到DOM元素 -->
<Monaco :teleport-target="myElement" />
```

### minimapContextMenu

- **类型**: `MinimapContextMenuConfig`
- **默认值**: `{ enabled: true, items: 'basic', variant: 'glass' }`
- **描述**: Minimap区域专用右键菜单配置

#### MinimapContextMenuConfig 接口

```typescript
interface MinimapContextMenuConfig {
  enabled?: boolean; // 是否启用Minimap右键菜单
  items?: string[] | "minimal" | "basic" | "full"; // 菜单项配置
  customItems?: ContextMenuItem[]; // 自定义菜单项
  variant?: "classic" | "glass"; // 菜单样式变体
  teleportTarget?: string | HTMLElement; // 菜单的挂载目标
}
```

#### Minimap菜单示例

```vue
<!-- Minimap基础菜单 -->
<Monaco
  :minimap-context-menu="{ enabled: true, items: 'basic', variant: 'glass' }"
/>

<!-- Minimap完整菜单 -->
<Monaco
  :minimap-context-menu="{ enabled: true, items: 'full', variant: 'glass' }"
/>

<!-- 禁用Minimap菜单 -->
<Monaco :minimap-context-menu="{ enabled: false }" />
```

## Events

### change

- **参数**: `(value: string) => void`
- **描述**: 当编辑器内容发生变化时触发

```vue
<Monaco @change="handleCodeChange" />
```

### ready

- **参数**: `(editor: EditInstance) => void`
- **描述**: 当编辑器初始化完成时触发

```vue
<Monaco @ready="handleEditorReady" />
```

## Slots

### toolbar

- **描述**: 自定义工具栏内容

```vue
<Monaco>
  <template #toolbar>
    <div class="custom-toolbar">
      <button @click="runCode">运行代码</button>
      <button @click="saveCode">保存</button>
      <button @click="shareCode">分享</button>
    </div>
  </template>
</Monaco>
```

## 暴露的方法

通过 `ref` 可以访问以下方法：

### getEditor()

- **返回**: `EditInstance | null`
- **描述**: 获取 Monaco Editor 实例

```vue
<script setup>
const monacoRef = ref();

const getEditorInstance = () => {
  const editor = monacoRef.value?.getEditor();
  if (editor) {
    console.log("编辑器实例:", editor);
  }
};
</script>
```

### setValue(value: string)

- **参数**: `value` - 要设置的代码内容
- **描述**: 设置编辑器内容

```vue
<script setup>
const monacoRef = ref();

const updateCode = () => {
  monacoRef.value?.setValue('console.log("新代码")');
};
</script>
```

### getValue()

- **返回**: `string`
- **描述**: 获取编辑器当前内容

```vue
<script setup>
const monacoRef = ref();

const getCurrentCode = () => {
  const code = monacoRef.value?.getValue();
  console.log("当前代码:", code);
};
</script>
```

### focus()

- **描述**: 让编辑器获得焦点

```vue
<script setup>
const monacoRef = ref();

const focusEditor = () => {
  monacoRef.value?.focus();
};
</script>
```

### setTheme(theme: BundledTheme)

- **参数**: `theme` - 要切换的主题
- **描述**: 动态切换编辑器主题

```vue
<script setup>
const monacoRef = ref();

const switchTheme = () => {
  monacoRef.value?.setTheme("vitesse-dark");
};
</script>
```

### setLanguage(language: BundledLanguage)

- **参数**: `language` - 要切换的语言
- **描述**: 动态切换编辑器语言

```vue
<script setup>
const monacoRef = ref();

const switchLanguage = () => {
  monacoRef.value?.setLanguage("typescript");
};
</script>
```

### layout()

- **描述**: 手动触发编辑器布局更新

```vue
<script setup>
const monacoRef = ref();

const refreshLayout = () => {
  monacoRef.value?.layout();
};
</script>
```

### enableAutoResize()

- **描述**: 启用自动尺寸调整

```vue
<script setup>
const monacoRef = ref();

const enableResize = () => {
  monacoRef.value?.enableAutoResize();
};
</script>
```

### disableAutoResize()

- **描述**: 禁用自动尺寸调整

```vue
<script setup>
const monacoRef = ref();

const disableResize = () => {
  monacoRef.value?.disableAutoResize();
};
</script>
```

### copyCode()

- **描述**: 复制当前代码到剪贴板（支持多种策略）

```vue
<script setup>
const monacoRef = ref();

const copyCurrentCode = () => {
  monacoRef.value?.copyCode();
};
</script>
```

### pasteCode()

- **描述**: 从剪贴板粘贴内容到编辑器（支持多种策略）

```vue
<script setup>
const monacoRef = ref();

const pasteFromClipboard = () => {
  monacoRef.value?.pasteCode();
};
</script>
```

### formatCode()

- **描述**: 格式化当前代码

```vue
<script setup>
const monacoRef = ref();

const formatCurrentCode = () => {
  monacoRef.value?.formatCode();
};
</script>
```

## useMonacoEdit Hook

`useMonacoEdit` 是底层的编辑器初始化钩子，用于创建和管理 Monaco Editor 实例。

### 基本用法

```typescript
import { useMonacoEdit } from "vue-shiki-monaco";

const { initMonacoEdit, destroy, setTheme, setLanguage } = useMonacoEdit({
  target: editorElement,
  languages: ["javascript", "typescript"],
  themes: ["vitesse-light", "vitesse-dark"],
  codeValue: 'console.log("Hello World")',
  defaultTheme: "vitesse-light",
  defaultLanguage: "javascript",
  contextMenu: {
    enabled: true,
    items: "full",
  },
});
```

### 参数

#### MonacoOptions

```typescript
interface MonacoOptions
  extends monaco.editor.IStandaloneEditorConstructionOptions {
  target: HTMLElement; // 编辑器挂载的目标元素
  languages: BundledLanguage[]; // 支持的语言列表
  codeValue: string; // 初始代码内容
  themes: BundledTheme[]; // 支持的主题列表
  defaultTheme: BundledTheme; // 默认主题
  defaultLanguage: BundledLanguage; // 默认语言
  contextMenu?: {
    // 右键菜单配置
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
  };
}
```

### 返回值

#### UseMonacoEditReturn

```typescript
interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>; // 初始化编辑器
  destroy: () => void; // 销毁编辑器
  registerLanguage: (language: string) => void; // 注册新语言
  setTheme: (theme: BundledTheme) => Promise<void>; // 切换主题
  setLanguage: (language: BundledLanguage) => Promise<void>; // 切换语言
  layout: () => void; // 重新布局
  enableAutoResize: () => void; // 启用自动调整
  disableAutoResize: () => void; // 禁用自动调整
  editInstance: EditInstance | null; // 编辑器实例
  onContextMenu: (callback: (event: MouseEvent) => void) => void; // 编辑器右键菜单回调
  offContextMenu: () => void; // 移除编辑器右键菜单回调
  onMinimapContextMenu: (callback: (event: MouseEvent) => void) => void; // Minimap右键菜单回调
  offMinimapContextMenu: () => void; // 移除Minimap右键菜单回调
}
```

### 方法详解

#### initMonacoEdit()

- **返回**: `Promise<EditInstance>`
- **描述**: 异步初始化 Monaco Editor 实例
- **用法**:
  ```typescript
  const editor = await initMonacoEdit();
  ```

#### destroy()

- **描述**: 销毁编辑器实例，释放内存和事件监听器
- **用法**:
  ```typescript
  destroy();
  ```

#### setTheme(theme)

- **参数**: `theme: BundledTheme` - 要切换的主题
- **返回**: `Promise<void>`
- **描述**: 动态切换编辑器主题
- **用法**:
  ```typescript
  await setTheme("vitesse-dark");
  ```

#### setLanguage(language)

- **参数**: `language: BundledLanguage` - 要切换的语言
- **返回**: `Promise<void>`
- **描述**: 动态切换编辑器语言
- **用法**:
  ```typescript
  await setLanguage("typescript");
  ```

#### enableAutoResize() / disableAutoResize()

- **描述**: 启用或禁用编辑器自动尺寸调整
- **用法**:
  ```typescript
  enableAutoResize(); // 启用
  disableAutoResize(); // 禁用
  ```

#### onContextMenu(callback) / offContextMenu()

- **描述**: 注册或移除编辑器区域右键菜单事件回调
- **用法**:

  ```typescript
  onContextMenu((event) => {
    console.log("编辑器右键菜单事件:", event);
  });

  offContextMenu(); // 移除回调
  ```

#### onMinimapContextMenu(callback) / offMinimapContextMenu()

- **描述**: 注册或移除Minimap区域右键菜单事件回调
- **用法**:

  ```typescript
  onMinimapContextMenu((event) => {
    console.log("Minimap右键菜单事件:", event);
  });

  offMinimapContextMenu(); // 移除回调
  ```

---

## useContextMenu Hook

`useContextMenu` 是用于管理自定义右键菜单的钩子。

### 基本用法

```typescript
import { useContextMenu } from "vue-shiki-monaco";

const contextMenu = useContextMenu({
  items: [
    {
      type: "item",
      id: "copy",
      label: "复制",
      shortcut: "Ctrl+C",
      action: () => console.log("复制"),
    },
    { type: "separator" },
    {
      type: "item",
      id: "paste",
      label: "粘贴",
      shortcut: "Ctrl+V",
      action: () => console.log("粘贴"),
    },
  ],
  target: ".monaco-editor", // 指定菜单的目标容器
});
```

### 参数和返回值

#### UseContextMenuOptions

```typescript
interface UseContextMenuOptions {
  items: ContextMenuItem[]; // 菜单项列表
  target?: string | HTMLDivElement; // 菜单的目标容器
  onShow?: () => void; // 显示时回调
  onHide?: () => void; // 隐藏时回调
}
```

#### UseContextMenuReturn

```typescript
interface UseContextMenuReturn {
  isVisible: Ref<boolean>; // 菜单可见性
  position: ContextMenuPosition; // 菜单位置
  items: Ref<ContextMenuItem[]>; // 菜单项
  show: (event: MouseEvent) => void; // 显示菜单
  hide: () => void; // 隐藏菜单
  handleItemClick: (item: MenuItem) => void; // 处理菜单项点击
}
```

#### ContextMenuItem 类型

```typescript
// 菜单项
interface MenuItem {
  type: "item";
  id: string; // 唯一标识
  label: string; // 显示文本
  icon?: string; // 图标类名
  shortcut?: string; // 快捷键文本
  disabled?: boolean; // 是否禁用
  action: () => void; // 点击回调
}

// 分隔符
interface MenuItemSeparator {
  type: "separator";
}

type ContextMenuItem = MenuItem | MenuItemSeparator;
```

---

## TypeScript 类型定义

### Monaco 组件类型

```typescript
import type { BundledLanguage, BundledTheme } from "shiki";
import type { EditInstance } from "vue-shiki-monaco";

// 组件 Props
interface MonacoProps {
  currentLanguage?: BundledLanguage;
  currentTheme?: BundledTheme;
  languages?: BundledLanguage[];
  themes?: BundledTheme[];
  value?: string;
  height?: string;
  showToolbar?: boolean;
  autoResize?: boolean;
  monacoEditClass?: string;
  fileName?: string;
  teleportTarget?: string | HTMLElement; // 菜单的挂载目标
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    teleportTarget?: string | HTMLElement; // 菜单的挂载目标
  };
  minimapContextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    variant?: "classic" | "glass";
    teleportTarget?: string | HTMLElement; // 菜单的挂载目标
  };
}

// 组件 Emits
interface MonacoEmits {
  change: [value: string];
  ready: [editor: EditInstance];
}

// 编辑器实例类型
type EditInstance = monaco.editor.IStandaloneCodeEditor;
```

### Hook 类型

```typescript
import type * as monaco from "monaco-editor-core";
import type { BundledLanguage, BundledTheme } from "shiki";

// Hook 选项
interface MonacoOptions
  extends monaco.editor.IStandaloneEditorConstructionOptions {
  target: HTMLElement;
  languages: BundledLanguage[];
  codeValue: string;
  themes: BundledTheme[];
  defaultTheme: BundledTheme;
  defaultLanguage: BundledLanguage;
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
  };
}

// Hook 返回值
interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>;
  destroy: () => void;
  registerLanguage: (language: string) => void;
  setTheme: (theme: BundledTheme) => Promise<void>;
  setLanguage: (language: BundledLanguage) => Promise<void>;
  layout: () => void;
  enableAutoResize: () => void;
  disableAutoResize: () => void;
  editInstance: EditInstance | null;
  onContextMenu: (callback: (event: MouseEvent) => void) => void;
  offContextMenu: () => void;
}

// 编辑器实例
type EditInstance = monaco.editor.IStandaloneCodeEditor;
```

### 右键菜单类型

```typescript
// 菜单位置
interface ContextMenuPosition {
  x: number;
  y: number;
  direction?: "down" | "up"; // 菜单显示方向
}

// 菜单项
interface MenuItem {
  type: "item";
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  action: () => void;
}

// 分隔符
interface MenuItemSeparator {
  type: "separator";
}

// 联合类型
type ContextMenuItem = MenuItem | MenuItemSeparator;

// 菜单预设
type MenuPreset = "minimal" | "basic" | "full";
```
