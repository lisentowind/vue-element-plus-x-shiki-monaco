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
    :context-menu="{ enabled: true, items: 'full', variant: 'glass' }"
    :minimap-context-menu="{ enabled: true, items: 'basic', variant: 'glass' }"
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
- **Default**: `{ enabled: true, items: 'full', variant: 'glass' }`
- **Description**: Editor area custom context menu configuration

#### ContextMenuConfig Interface

```typescript
interface ContextMenuConfig {
  enabled?: boolean; // Whether to enable context menu
  items?: string[] | "minimal" | "basic" | "full"; // Menu item configuration
  customItems?: ContextMenuItem[]; // Custom menu items
  variant?: "classic" | "glass"; // Menu style variant
  teleportTarget?: string | HTMLElement; // Menu mount target
}
```

#### Preset Menu Configurations

```vue
<!-- Minimal menu: copy, paste, select all -->
<Monaco :context-menu="{ enabled: true, items: 'minimal', variant: 'glass' }" />

<!-- Basic menu: copy, cut, paste, select all, undo, redo -->
<Monaco :context-menu="{ enabled: true, items: 'basic', variant: 'glass' }" />

<!-- Full menu: all features -->
<Monaco :context-menu="{ enabled: true, items: 'full', variant: 'glass' }" />

<!-- Classic style menu -->
<Monaco :context-menu="{ enabled: true, items: 'full', variant: 'classic' }" />

<!-- Custom menu items -->
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
        label: 'Custom Action',
        shortcut: 'Ctrl+Shift+X',
        action: () => console.log('Custom action'),
      },
    ],
  }"
/>

<!-- Specify menu mount to specific DOM element -->
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

- **Type**: `string | HTMLElement`
- **Default**: `'.monaco-editor'`
- **Description**: Specify the mount target for the context menu to control where the menu is rendered

```vue
<!-- Mount to specific selector -->
<Monaco teleport-target=".my-container" />

<!-- Mount to DOM element -->
<Monaco :teleport-target="myElement" />
```

### minimapContextMenu

- **Type**: `MinimapContextMenuConfig`
- **Default**: `{ enabled: true, items: 'basic', variant: 'glass' }`
- **Description**: Minimap area specific context menu configuration

#### MinimapContextMenuConfig Interface

```typescript
interface MinimapContextMenuConfig {
  enabled?: boolean; // Whether to enable Minimap context menu
  items?: string[] | "minimal" | "basic" | "full"; // Menu item configuration
  customItems?: ContextMenuItem[]; // Custom menu items
  variant?: "classic" | "glass"; // Menu style variant
  teleportTarget?: string | HTMLElement; // Menu mount target
}
```

#### Minimap Menu Examples

```vue
<!-- Minimap basic menu -->
<Monaco
  :minimap-context-menu="{ enabled: true, items: 'basic', variant: 'glass' }"
/>

<!-- Minimap full menu -->
<Monaco
  :minimap-context-menu="{ enabled: true, items: 'full', variant: 'glass' }"
/>

<!-- Disable Minimap menu -->
<Monaco :minimap-context-menu="{ enabled: false }" />
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
const monacoRef = ref();

const getEditorInstance = () => {
  const editor = monacoRef.value?.getEditor();
  if (editor) {
    console.log("Editor instance:", editor);
  }
};
</script>
```

### setValue(value: string)

- **Parameters**: `value` - Code content to set
- **Description**: Set editor content

```vue
<script setup>
const monacoRef = ref();

const updateCode = () => {
  monacoRef.value?.setValue('console.log("New code")');
};
</script>
```

### getValue()

- **Returns**: `string`
- **Description**: Get current editor content

```vue
<script setup>
const monacoRef = ref();

const getCurrentCode = () => {
  const code = monacoRef.value?.getValue();
  console.log("Current code:", code);
};
</script>
```

### focus()

- **Description**: Give focus to the editor

```vue
<script setup>
const monacoRef = ref();

const focusEditor = () => {
  monacoRef.value?.focus();
};
</script>
```

### setTheme(theme: BundledTheme)

- **Parameters**: `theme` - Theme to switch to
- **Description**: Dynamically switch editor theme

```vue
<script setup>
const monacoRef = ref();

const switchTheme = () => {
  monacoRef.value?.setTheme("vitesse-dark");
};
</script>
```

### setLanguage(language: BundledLanguage)

- **Parameters**: `language` - Language to switch to
- **Description**: Dynamically switch editor language

```vue
<script setup>
const monacoRef = ref();

const switchLanguage = () => {
  monacoRef.value?.setLanguage("typescript");
};
</script>
```

### layout()

- **Description**: Manually trigger editor layout update

```vue
<script setup>
const monacoRef = ref();

const refreshLayout = () => {
  monacoRef.value?.layout();
};
</script>
```

### enableAutoResize()

- **Description**: Enable automatic size adjustment

```vue
<script setup>
const monacoRef = ref();

const enableResize = () => {
  monacoRef.value?.enableAutoResize();
};
</script>
```

### disableAutoResize()

- **Description**: Disable automatic size adjustment

```vue
<script setup>
const monacoRef = ref();

const disableResize = () => {
  monacoRef.value?.disableAutoResize();
};
</script>
```

### copyCode()

- **Description**: Copy current code to clipboard (supports multiple strategies)

```vue
<script setup>
const monacoRef = ref();

const copyCurrentCode = () => {
  monacoRef.value?.copyCode();
};
</script>
```

### pasteCode()

- **Description**: Paste content from clipboard to editor (supports multiple strategies)

```vue
<script setup>
const monacoRef = ref();

const pasteFromClipboard = () => {
  monacoRef.value?.pasteCode();
};
</script>
```

### formatCode()

- **Description**: Format current code

```vue
<script setup>
const monacoRef = ref();

const formatCurrentCode = () => {
  monacoRef.value?.formatCode();
};
</script>
```

## useMonacoEdit Hook

`useMonacoEdit` is the underlying editor initialization hook used for creating and managing Monaco Editor instances.

### Basic Usage

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

### Parameters

#### MonacoOptions

```typescript
interface MonacoOptions
  extends monaco.editor.IStandaloneEditorConstructionOptions {
  target: HTMLElement; // Target element to mount the editor
  languages: BundledLanguage[]; // List of supported languages
  codeValue: string; // Initial code content
  themes: BundledTheme[]; // List of supported themes
  defaultTheme: BundledTheme; // Default theme
  defaultLanguage: BundledLanguage; // Default language
  contextMenu?: {
    // Context menu configuration
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
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
  onContextMenu: (callback: (event: MouseEvent) => void) => void; // Editor context menu callback
  offContextMenu: () => void; // Remove editor context menu callback
  onMinimapContextMenu: (callback: (event: MouseEvent) => void) => void; // Minimap context menu callback
  offMinimapContextMenu: () => void; // Remove Minimap context menu callback
}
```

---

## MonacoDiff Component

`MonacoDiff` is a specialized component for displaying code difference comparisons, built on Monaco Editor's Diff Editor, providing powerful code comparison functionality.

### Basic Usage

```vue
<template>
  <MonacoDiff
    :old-model="oldCode"
    :new-model="newCode"
    language="typescript"
    theme="vitesse-light"
    height="500px"
    :show-toolbar="true"
    :auto-resize="true"
    :context-menu="{ enabled: true, items: 'full', variant: 'glass' }"
    :minimap-context-menu="{ enabled: true, items: 'basic', variant: 'glass' }"
    @change="handleChange"
    @ready="handleReady"
  />
</template>
```

### Props

#### oldModel

- **Type**: `string`
- **Required**: `true`
- **Description**: Original code content (displayed in left editor)

```vue
<MonacoDiff old-model="const a = 1;" />
```

#### newModel

- **Type**: `string`
- **Required**: `true`
- **Description**: Modified code content (displayed in right editor)

```vue
<MonacoDiff new-model="const a = 2;" />
```

#### diffViewType

- **Type**: `'default' | 'inline' | 'unified'`
- **Default**: `'default'`
- **Description**: Difference display mode

```vue
<!-- Default side-by-side mode -->
<MonacoDiff diff-view-type="default" />

<!-- Inline mode -->
<MonacoDiff diff-view-type="inline" />

<!-- Unified mode -->
<MonacoDiff diff-view-type="unified" />
```

#### currentLanguage

- **Type**: `BundledLanguage`
- **Default**: `'typescript'`
- **Description**: Code language mode

```vue
<MonacoDiff current-language="javascript" />
```

#### currentTheme

- **Type**: `BundledTheme`
- **Default**: `'vitesse-light'`
- **Description**: Editor theme

```vue
<MonacoDiff current-theme="vitesse-dark" />
```

#### languages

- **Type**: `BundledLanguage[]`
- **Default**: `['typescript']`
- **Description**: List of supported languages

```vue
<MonacoDiff :languages="['typescript', 'javascript', 'vue']" />
```

#### themes

- **Type**: `BundledTheme[]`
- **Default**: `['vitesse-light', 'vitesse-dark']`
- **Description**: List of supported themes

```vue
<MonacoDiff :themes="['vitesse-light', 'vitesse-dark', 'github-light']" />
```

#### height

- **Type**: `string`
- **Default**: `'400px'`
- **Description**: Editor height

```vue
<MonacoDiff height="600px" />
```

#### showToolbar

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the top toolbar (including diff navigation)

```vue
<MonacoDiff :show-toolbar="false" />
```

#### autoResize

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to enable automatic size adjustment

```vue
<MonacoDiff :auto-resize="false" />
```

#### fileName

- **Type**: `string`
- **Default**: `'Untitled'`
- **Description**: File name displayed in the toolbar

```vue
<MonacoDiff file-name="app.ts" />
```

#### contextMenu

- **Type**: `ContextMenuConfig`
- **Default**: `{ enabled: true, items: 'full', variant: 'glass' }`
- **Description**: Editor area context menu configuration

```vue
<!-- Original editor (left): copy, find/replace, font adjustment -->
<!-- Modified editor (right): full functionality menu -->
<MonacoDiff
  :context-menu="{
    enabled: true,
    items: 'full',
    variant: 'glass',
  }"
/>
```

#### minimapContextMenu

- **Type**: `MinimapContextMenuConfig`
- **Default**: `{ enabled: true, items: 'basic', variant: 'glass' }`
- **Description**: Minimap area context menu configuration

```vue
<MonacoDiff
  :minimap-context-menu="{
    enabled: true,
    items: 'basic',
    variant: 'glass',
  }"
/>
```

### Events

#### change

- **Parameters**: `(value: string) => void`
- **Description**: Triggered when the modified editor (right) content changes

```vue
<MonacoDiff @change="handleDiffChange" />
```

#### ready

- **Parameters**: `(editor: DiffEditInstance) => void`
- **Description**: Triggered when the diff editor initialization is complete

```vue
<MonacoDiff @ready="handleDiffEditorReady" />
```

### Exposed Methods

The following methods can be accessed through `ref`:

#### getEditor()

- **Returns**: `DiffEditInstance | null`
- **Description**: Get Monaco Diff Editor instance

```vue
<script setup>
const diffRef = ref();

const getDiffEditorInstance = () => {
  const editor = diffRef.value?.getEditor();
  if (editor) {
    console.log("Diff editor instance:", editor);
    // Access getOriginalEditor() and getModifiedEditor()
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();
  }
};
</script>
```

#### focus()

- **Description**: Give focus to the modified editor (right)

```vue
<script setup>
const diffRef = ref();

const focusDiffEditor = () => {
  diffRef.value?.focus();
};
</script>
```

#### setTheme(theme: BundledTheme)

- **Parameters**: `theme` - Theme to switch to
- **Description**: Dynamically switch editor theme

```vue
<script setup>
const diffRef = ref();

const switchTheme = () => {
  diffRef.value?.setTheme("vitesse-dark");
};
</script>
```

#### layout()

- **Description**: Manually trigger editor layout update

```vue
<script setup>
const diffRef = ref();

const refreshLayout = () => {
  diffRef.value?.layout();
};
</script>
```

#### enableAutoResize() / disableAutoResize()

- **Description**: Enable or disable automatic size adjustment

```vue
<script setup>
const diffRef = ref();

const toggleAutoResize = () => {
  diffRef.value?.enableAutoResize();
  // or
  diffRef.value?.disableAutoResize();
};
</script>
```

### Toolbar Features

The MonacoDiff component toolbar includes the following diff navigation features:

- **Diff Counter**: Shows current diff position and total count (e.g., "2 / 5")
- **Previous Diff Button**: Jump to previous diff location
- **Next Diff Button**: Jump to next diff location
- **Collapse/Expand Button**: Collapse or expand unchanged code regions

### Special Features

#### Diff Navigation

- Automatically detects code difference count
- Supports circular navigation (jump from last diff to first)
- Auto-scroll to diff position and center display

#### Context Menu Hierarchy

- **Original Editor (Left)**: Read-only mode, provides copy, find/replace, font adjustment
- **Modified Editor (Right)**: Full editing functionality, supports all menu items

#### Copy Functionality

- Toolbar copy button defaults to copying modified content (right editor)
- Supports modern clipboard API and fallback solutions

---

## useMonacoDiffEdit Hook

`useMonacoDiffEdit` is a specialized hook for creating and managing Monaco Diff Editor instances.

### Basic Usage

```typescript
import { useMonacoDiffEdit } from "vue-shiki-monaco";

const diffHook = useMonacoDiffEdit({
  target: diffEditorElement,
  languages: ["typescript", "javascript"],
  themes: ["vitesse-light", "vitesse-dark"],
  defaultTheme: "vitesse-light",
  contextMenu: {
    enabled: true,
    items: "full",
  },
});

// Initialize diff editor
const diffEditor = await diffHook.initMonacoDiffEdit();

// Create models
const originalModel = diffHook.createModel(oldCode, "typescript");
const modifiedModel = diffHook.createModel(newCode, "typescript");

// Set diff model
diffHook.setDiffModel({
  original: originalModel,
  modified: modifiedModel,
});
```

### Parameters

#### MonacoDiffOptions

```typescript
interface MonacoDiffOptions {
  target: HTMLElement; // Target element to mount the editor
  languages: BundledLanguage[]; // List of supported languages
  themes: BundledTheme[]; // List of supported themes
  defaultTheme: BundledTheme; // Default theme
  diffViewType?: "default" | "inline" | "unified"; // Diff display mode
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
  };
}
```

### Return Value

#### UseMonacoDiffEditReturn

```typescript
interface UseMonacoDiffEditReturn {
  initMonacoDiffEdit: () => Promise<DiffEditInstance>; // Initialize diff editor
  createModel: (content: string, language: string) => any; // Create model
  setDiffModel: (models: { original: any; modified: any }) => void; // Set diff model
  setDiffViewOptions: (viewType: string) => void; // Set diff view type
  setTheme: (theme: BundledTheme) => Promise<void>; // Switch theme
  layout: () => void; // Re-layout
  enableAutoResize: () => void; // Enable auto resize
  disableAutoResize: () => void; // Disable auto resize
  destroy: (target: HTMLElement) => void; // Destroy editor
  onOriginalContextMenu: (callback: (event: MouseEvent) => void) => void; // Original editor context menu
  onModifiedContextMenu: (callback: (event: MouseEvent) => void) => void; // Modified editor context menu
  onMinimapContextMenu: (callback: (event: MouseEvent) => void) => void; // Minimap context menu
}
```

---

## useContextMenu Hook

`useContextMenu` is a hook for managing custom context menus.

### Basic Usage

```typescript
import { useContextMenu } from "vue-shiki-monaco";

const contextMenu = useContextMenu({
  items: [
    {
      type: "item",
      id: "copy",
      label: "Copy",
      shortcut: "Ctrl+C",
      action: () => console.log("Copy"),
    },
    { type: "separator" },
    {
      type: "item",
      id: "paste",
      label: "Paste",
      shortcut: "Ctrl+V",
      action: () => console.log("Paste"),
    },
  ],
  target: ".monaco-editor", // Specify menu target container
});
```

### Parameters and Return Values

#### UseContextMenuOptions

```typescript
interface UseContextMenuOptions {
  items: ContextMenuItem[]; // Menu item list
  target?: string | HTMLDivElement; // Menu target container
  onShow?: () => void; // Show callback
  onHide?: () => void; // Hide callback
}
```

#### UseContextMenuReturn

```typescript
interface UseContextMenuReturn {
  isVisible: Ref<boolean>; // Menu visibility
  position: ContextMenuPosition; // Menu position
  items: Ref<ContextMenuItem[]>; // Menu items
  show: (
    event: MouseEvent,
    menuItems: ContextMenuItem[],
    target?: HTMLDivElement,
  ) => void; // Show menu, supports dynamic target specification
  hide: () => void; // Hide menu
  handleItemClick: (item: MenuItem) => void; // Handle menu item click
  updateTarget: (target: HTMLDivElement) => void; // Update target element
}
```

### Context Menu Refactoring Improvements

In the latest version, the `useContextMenu` hook has undergone important refactoring optimizations:

#### Smart Target Finding

- **Automatic Container Finding**: Added intelligent finding functionality in the `show` method. When no target element is specified, it automatically searches up for the nearest `.monaco-editor` or `.monaco-diff-editor` container
- **Dynamic Target Specification**: The `show` method adds a `target` parameter, allowing dynamic specification of target elements when displaying the menu
- **Update Target Method**: Added `updateTarget` method, allowing target element updates before displaying the menu

#### Usage Examples

```typescript
import { useContextMenu } from "vue-shiki-monaco";

const contextMenu = useContextMenu({
  items: menuItems,
});

// Method 1: Let system automatically find nearest editor container
contextMenu.show(event, menuItems);

// Method 2: Dynamically specify target container
const targetElement = document.querySelector(".my-editor-container");
contextMenu.show(event, menuItems, targetElement);

// Method 3: Update target then show
contextMenu.updateTarget(myEditorElement);
contextMenu.show(event, menuItems);
```

#### Improvement Effects

- **More Accurate Positioning**: Menu can automatically find the correct editor container, ensuring menu displays at appropriate position
- **More Flexible Usage**: Supports dynamic target switching in multi-editor scenarios
- **Better Compatibility**: Supports both Monaco Editor and Monaco Diff Editor containers

---

## TypeScript Type Definitions

### Monaco Component Types

```typescript
import type { BundledLanguage, BundledTheme } from "shiki";
import type { EditInstance } from "vue-shiki-monaco";

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
  teleportTarget?: string | HTMLElement; // Menu mount target
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    teleportTarget?: string | HTMLElement; // Menu mount target
  };
  minimapContextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    variant?: "classic" | "glass";
    teleportTarget?: string | HTMLElement; // Menu mount target
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

### MonacoDiff Component Types

```typescript
import type { BundledLanguage, BundledTheme } from "shiki";
import type { DiffEditInstance } from "vue-shiki-monaco";

// MonacoDiff Component Props
interface MonacoDiffProps {
  oldModel: string; // Original code content
  newModel: string; // Modified code content
  diffViewType?: "default" | "inline" | "unified"; // Diff display mode
  currentLanguage?: BundledLanguage;
  currentTheme?: BundledTheme;
  languages?: BundledLanguage[];
  themes?: BundledTheme[];
  height?: string;
  showToolbar?: boolean;
  autoResize?: boolean;
  monacoEditClass?: string;
  fileName?: string;
  teleportTarget?: string | HTMLElement;
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    variant?: "classic" | "glass";
  };
  minimapContextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    variant?: "classic" | "glass";
  };
}

// MonacoDiff Component Emits
interface MonacoDiffEmits {
  change: [value: string]; // Modified editor content change
  ready: [editor: DiffEditInstance]; // Diff editor ready
}

// Diff editor instance type
type DiffEditInstance = monaco.editor.IStandaloneDiffEditor;
```

### Hook Types

```typescript
import type * as monaco from "monaco-editor-core";
import type { BundledLanguage, BundledTheme } from "shiki";

// Hook options
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

// Hook return value
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

// Editor instance
type EditInstance = monaco.editor.IStandaloneCodeEditor;
```

### Context Menu Types

```typescript
// Menu position
interface ContextMenuPosition {
  x: number;
  y: number;
  direction?: "down" | "up"; // Menu display direction
}

// Menu item
interface MenuItem {
  type: "item";
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  action: () => void;
}

// Separator
interface MenuItemSeparator {
  type: "separator";
}

// Union type
type ContextMenuItem = MenuItem | MenuItemSeparator;

// Menu preset
type MenuPreset = "minimal" | "basic" | "full";
```
