---
sidebar_position: 2
title: API Reference
---

# Monaco Component API

## Props

### language
- **Type**: `BundledLanguage`
- **Default**: `'javascript'`
- **Description**: Sets the editor's language mode

Supported languages include: `javascript`, `typescript`, `python`, `html`, `css`, `json`, `markdown`, etc.

```vue
<Monaco language="typescript" />
```

### theme
- **Type**: `BundledTheme`
- **Default**: `'vitesse-light'`
- **Description**: Sets the editor theme

Supported themes include: `vitesse-light`, `vitesse-dark`, `github-light`, `github-dark`, etc.

```vue
<Monaco theme="vitesse-dark" />
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
- **Description**: Whether to show the toolbar

```vue
<Monaco :show-toolbar="false" />
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
    </div>
  </template>
</Monaco>
```

## Exposed Methods

Access these methods through `ref`:

### getEditor()
- **Returns**: `EditInstance | null`
- **Description**: Get Monaco Editor instance

### setValue(value: string)
- **Parameters**: `value` - Code content to set
- **Description**: Set editor content

### getValue()
- **Returns**: `string`
- **Description**: Get current editor content

### focus()
- **Description**: Focus the editor

### copyCode()
- **Description**: Copy current code to clipboard

### formatCode()
- **Description**: Format current code

## Usage Example

```vue
<template>
  <div>
    <Monaco
      ref="monacoRef"
      language="typescript"
      theme="vitesse-dark"
      :value="code"
      height="500px"
      @change="handleChange"
      @ready="handleReady"
    >
      <template #toolbar>
        <div class="custom-toolbar">
          <button @click="runCode">Run</button>
          <button @click="resetCode">Reset</button>
        </div>
      </template>
    </Monaco>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const monacoRef = ref()
const code = ref(`function hello(name: string) {
  return \`Hello, \${name}!\`;
}`)

const handleChange = (newValue) => {
  console.log('Code changed:', newValue)
}

const handleReady = (editor) => {
  console.log('Editor ready:', editor)
  editor.focus()
}

const runCode = () => {
  const currentCode = monacoRef.value?.getValue()
  console.log('Running code:', currentCode)
}

const resetCode = () => {
  monacoRef.value?.setValue(code.value)
}
</script>
```

## TypeScript Types

```typescript
import type { BundledLanguage, BundledTheme } from 'shiki'

interface Props {
  language?: BundledLanguage
  theme?: BundledTheme
  value?: string
  height?: string
  showToolbar?: boolean
}

interface MonacoEmits {
  change: [value: string]
  ready: [editor: EditInstance]
}
```