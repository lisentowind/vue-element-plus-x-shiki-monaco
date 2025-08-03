---
sidebar_position: 3
title: API Reference
---

# API Reference

## Monaco Component

`Monaco` is the core code editor component built on Monaco Editor and Shiki, providing rich code editing functionality.

### Basic Usage

```vue
<template>
  <Monaco
    language="javascript"
    theme="vitesse-light"
    :value="code"
    height="400px"
    :show-toolbar="true"
    :auto-resize="true"
    :context-menu="{ enabled: true, items: 'full' }"
    @change="handleChange"
    @ready="handleReady"
  />
</template>
```

## Props

### currentLanguage

- **Type**: `BundledLanguage`
- **Default**: `'javascript'`
- **Description**: Set the current language mode of the editor

Supported languages include: `javascript`, `typescript`, `python`, `html`, `css`, `json`, `markdown`, `vue`, `react`, `go`, `rust`, `php`, `java`, `c`, `cpp`, `csharp`, etc.

```vue
<Monaco current-language="typescript" />
```

### currentTheme

- **Type**: `BundledTheme`
- **Default**: `'vitesse-light'`
- **Description**: Set the current theme of the editor

Supported themes include: `vitesse-light`, `vitesse-dark`, `github-light`, `github-dark`, `one-dark-pro`, `dracula`, `nord`, `material-theme`, etc.

```vue
<Monaco current-theme="vitesse-dark" />
```

### languages

- **Type**: `BundledLanguage[]`
- **Default**: `['javascript', 'typescript', 'python', 'html', 'css', 'json']`
- **Description**: List of languages supported by the editor

```vue
<Monaco :languages="['javascript', 'typescript', 'vue', 'go']" />
```

### themes

- **Type**: `BundledTheme[]`
- **Default**: `['vitesse-light', 'vitesse-dark', 'github-light', 'github-dark']`
- **Description**: List of themes supported by the editor

```vue
<Monaco :themes="['vitesse-light', 'vitesse-dark', 'one-dark-pro']" />
```

### value

- **Type**: `string`
- **Default**: `''`
- **Description**: Initial content of the editor

```vue
<Monaco :value="initialCode" />
```

### height

- **Type**: `string`
- **Default**: `'400px'`
- **Description**: Height of the editor

```vue
<Monaco height="600px" />
```

### showToolbar

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the top toolbar

```vue
<Monaco :show-toolbar="false" />
```

### autoResize

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to enable automatic size adjustment

```vue
<Monaco :auto-resize="false" />
```

### monacoEditClass

- **Type**: `string`
- **Default**: `undefined`
- **Description**: Custom CSS class name for the editor container

```vue
<Monaco monaco-edit-class="my-custom-editor" />
```

### fileName

- **Type**: `string`
- **Default**: `undefined`
- **Description**: File name displayed in the toolbar

```vue
<Monaco file-name="main.ts" />
```

### contextMenu

- **Type**: `ContextMenuConfig`
- **Default**: `{ enabled: true, items: 'full' }`
- **Description**: Custom context menu configuration

#### ContextMenuConfig Interface

```typescript
interface ContextMenuConfig {
  enabled?: boolean; // Whether to enable context menu
  items?: string[] | 'minimal' | 'basic' | 'full'; // Menu item configuration
  customItems?: ContextMenuItem[]; // Custom menu items
}
```

#### Preset Menu Configurations

```vue
<!-- Minimal menu: copy, paste, select all -->
<Monaco :context-menu="{ enabled: true, items: 'minimal' }" />

<!-- Basic menu: copy, cut, paste, select all, undo, redo -->
<Monaco :context-menu="{ enabled: true, items: 'basic' }" />

<!-- Full menu: all features -->
<Monaco :context-menu="{ enabled: true, items: 'full' }" />

<!-- Custom menu items -->
<Monaco :context-menu="{
  enabled: true,
  items: ['copy', 'paste', 'selectAll'],
  customItems: [
    {
      type: 'separator'
    },
    {
      type: 'item',
      id: 'custom-action',
      label: 'Custom Action',
      shortcut: 'Ctrl+Shift+X',
      action: () => console.log('Custom action')
    }
  ]
}" />
```

## Events

### change

- **Parameters**: `(value: string) => void`
- **Description**: Triggered when editor content changes

```vue
<Monaco @change="handleCodeChange" />
```

### ready

- **Parameters**: `(editor: EditInstance) => void`
- **Description**: Triggered when editor initialization is complete

```vue
<Monaco @ready="handleEditorReady" />
```

## Slots

### toolbar

- **Description**: Custom toolbar content

```vue
<Monaco>
  <template #toolbar>
    <div class="custom-toolbar">
      <button @click="runCode">Run Code</button>
      <button @click="saveCode">Save</button>
      <button @click="shareCode">Share</button>
    </div>
  </template>
</Monaco>
```

## Exposed Methods

The following methods can be accessed through `ref`:

### getEditor()

- **Returns**: `EditInstance | null`
- **Description**: Get Monaco Editor instance

```vue
<script setup>
const monacoRef = ref()

const getEditorInstance = () => {
  const editor = monacoRef.value?.getEditor()
  if (editor) {
    console.log('Editor instance:', editor)
  }
}
</script>
```

### setValue(value: string)

- **Parameters**: `value` - Code content to set
- **Description**: Set editor content

```vue
<script setup>
const monacoRef = ref()

const updateCode = () => {
  monacoRef.value?.setValue('console.log("New code")')
}
</script>
```

### getValue()

- **Returns**: `string`
- **Description**: Get current editor content

```vue
<script setup>
const monacoRef = ref()

const getCurrentCode = () => {
  const code = monacoRef.value?.getValue()
  console.log('Current code:', code)
}
</script>
```

### focus()

- **Description**: Give focus to the editor

```vue
<script setup>
const monacoRef = ref()

const focusEditor = () => {
  monacoRef.value?.focus()
}
</script>
```

### setTheme(theme: BundledTheme)

- **Parameters**: `theme` - Theme to switch to
- **Description**: Dynamically switch editor theme

```vue
<script setup>
const monacoRef = ref()

const switchTheme = () => {
  monacoRef.value?.setTheme('vitesse-dark')
}
</script>
```

### setLanguage(language: BundledLanguage)

- **Parameters**: `language` - Language to switch to
- **Description**: Dynamically switch editor language

```vue
<script setup>
const monacoRef = ref()

const switchLanguage = () => {
  monacoRef.value?.setLanguage('typescript')
}
</script>
```

### layout()

- **Description**: Manually trigger editor layout update

```vue
<script setup>
const monacoRef = ref()

const refreshLayout = () => {
  monacoRef.value?.layout()
}
</script>
```

### enableAutoResize()

- **Description**: Enable automatic size adjustment

```vue
<script setup>
const monacoRef = ref()

const enableResize = () => {
  monacoRef.value?.enableAutoResize()
}
</script>
```

### disableAutoResize()

- **Description**: Disable automatic size adjustment

```vue
<script setup>
const monacoRef = ref()

const disableResize = () => {
  monacoRef.value?.disableAutoResize()
}
</script>
```

### copyCode()

- **Description**: Copy current code to clipboard (supports multiple strategies)

```vue
<script setup>
const monacoRef = ref()

const copyCurrentCode = () => {
  monacoRef.value?.copyCode()
}
</script>
```

### pasteCode()

- **Description**: Paste content from clipboard to editor (supports multiple strategies)

```vue
<script setup>
const monacoRef = ref()

const pasteFromClipboard = () => {
  monacoRef.value?.pasteCode()
}
</script>
```

### formatCode()

- **Description**: Format current code

```vue
<script setup>
const monacoRef = ref()

const formatCurrentCode = () => {
  monacoRef.value?.formatCode()
}
</script>
```

## useMonacoEdit Hook

`useMonacoEdit` is the underlying editor initialization hook used for creating and managing Monaco Editor instances.

### Basic Usage

```typescript
import { useMonacoEdit } from 'vue-shiki-monaco';

const { initMonacoEdit, destroy, setTheme, setLanguage } = useMonacoEdit({
  target: editorElement,
  languages: ['javascript', 'typescript'],
  themes: ['vitesse-light', 'vitesse-dark'],
  codeValue: 'console.log("Hello World")',
  defaultTheme: 'vitesse-light',
  defaultLanguage: 'javascript',
  contextMenu: {
    enabled: true,
    items: 'full'
  }
});
```

### Parameters

#### MonacoOptions

```typescript
interface MonacoOptions {
  target: HTMLElement; // Target element to mount the editor
  languages: BundledLanguage[]; // List of supported languages
  codeValue: string; // Initial code content
  themes: BundledTheme[]; // List of supported themes
  defaultTheme: BundledTheme; // Default theme
  defaultLanguage: BundledLanguage; // Default language
  contextMenu?: { // Context menu configuration
    enabled?: boolean;
    items?: string[] | 'minimal' | 'basic' | 'full';
    customItems?: ContextMenuItem[];
  };
}
```

### Return Value

#### UseMonacoEditReturn

```typescript
interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>; // Initialize editor
  destroy: () => void; // Destroy editor
  registerLanguage: (language: string) => void; // Register new language
  setTheme: (theme: BundledTheme) => Promise<void>; // Switch theme
  setLanguage: (language: BundledLanguage) => Promise<void>; // Switch language
  layout: () => void; // Re-layout
  enableAutoResize: () => void; // Enable auto resize
  disableAutoResize: () => void; // Disable auto resize
  editInstance: EditInstance | null; // Editor instance
  onContextMenu: (callback: (event: MouseEvent) => void) => void; // Context menu callback
  offContextMenu: () => void; // Remove context menu callback
}
```

## TypeScript Type Definitions

### Monaco Component Types

```typescript
import type { BundledLanguage, BundledTheme } from 'shiki';
import type { EditInstance } from 'vue-shiki-monaco';

// Component Props
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
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | 'minimal' | 'basic' | 'full';
    customItems?: ContextMenuItem[];
  };
}

// Component Emits
interface MonacoEmits {
  change: [value: string];
  ready: [editor: EditInstance];
}

// Editor instance type
type EditInstance = monaco.editor.IStandaloneCodeEditor;
```

### Context Menu Types

```typescript
// Menu position
interface ContextMenuPosition {
  x: number;
  y: number;
}

// Menu item
interface MenuItem {
  type: 'item';
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  action: () => void;
}

// Separator
interface MenuItemSeparator {
  type: 'separator';
}

// Union type
type ContextMenuItem = MenuItem | MenuItemSeparator;

// Menu preset
type MenuPreset = 'minimal' | 'basic' | 'full';
```