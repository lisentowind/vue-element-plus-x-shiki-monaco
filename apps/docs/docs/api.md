---
sidebar_position: 3
title: API 参考
---

# API 参考

## Monaco 组件

`Monaco` 是核心的代码编辑器组件，基于 Monaco Editor 和 Shiki 构建。

### 基本用法

```vue
<template>
  <Monaco
    language="javascript"
    theme="vitesse-light"
    :value="code"
    height="400px"
    @change="handleChange"
    @ready="handleReady"
  />
</template>
```

## Props

### language
- **类型**: `BundledLanguage`
- **默认值**: `'javascript'`
- **描述**: 设置编辑器的语言模式

支持的语言包括：`javascript`, `typescript`, `python`, `html`, `css`, `json`, `markdown` 等。

```vue
<Monaco language="typescript" />
```

### theme
- **类型**: `BundledTheme`
- **默认值**: `'vitesse-light'`
- **描述**: 设置编辑器主题

支持的主题包括：`vitesse-light`, `vitesse-dark`, `github-light`, `github-dark` 等。

```vue
<Monaco theme="vitesse-dark" />
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
- **描述**: 是否显示工具栏

```vue
<Monaco :show-toolbar="false" />
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
    </div>
  </template>
</Monaco>
```

## 暴露的方法

通过 `ref` 可以访问以下方法：

### getEditor()
- **返回**: `EditInstance | null`
- **描述**: 获取 Monaco Editor 实例

### setValue(value: string)
- **参数**: `value` - 要设置的代码内容
- **描述**: 设置编辑器内容

### getValue()
- **返回**: `string`
- **描述**: 获取编辑器当前内容

### focus()
- **描述**: 让编辑器获得焦点

### copyCode()
- **描述**: 复制当前代码到剪贴板

### formatCode()
- **描述**: 格式化当前代码

## 使用示例

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
          <button @click="runCode">运行</button>
          <button @click="resetCode">重置</button>
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
  console.log('代码变更:', newValue)
}

const handleReady = (editor) => {
  console.log('编辑器就绪:', editor)
  editor.focus()
}

const runCode = () => {
  const currentCode = monacoRef.value?.getValue()
  console.log('运行代码:', currentCode)
}

const resetCode = () => {
  monacoRef.value?.setValue(code.value)
}
</script>
```

---

## useMonacoEdit Hook

`useMonacoEdit` 是底层的编辑器初始化钩子，用于创建和管理 Monaco Editor 实例。

### 基本用法

```typescript
import { useMonacoEdit } from '@vue-element-plus-x-shiki-monaco/core'

const { initMonacoEdit, destroy, registerLanguage } = useMonacoEdit({
  target: editorElement,
  languages: ['javascript', 'typescript'],
  themes: ['vitesse-light', 'vitesse-dark'],
  codeValue: 'console.log("Hello World")',
  defaultTheme: 'vitesse-light',
  defaultLanguage: 'javascript'
})
```

### 参数

#### MonacoOptions

```typescript
interface MonacoOptions {
  target: HTMLElement          // 编辑器挂载的目标元素
  languages: BundledLanguage[] // 支持的语言列表
  codeValue: string           // 初始代码内容
  themes: BundledTheme[]      // 支持的主题列表
  defaultTheme: BundledTheme  // 默认主题
  defaultLanguage: BundledLanguage // 默认语言
}
```

### 返回值

#### UseMonacoEditReturn

```typescript
interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>  // 初始化编辑器
  destroy: () => void                          // 销毁编辑器
  registerLanguage: (language: string) => void // 注册新语言
  editInstance: EditInstance | null            // 编辑器实例
}
```

### 方法详解

#### initMonacoEdit()
- **返回**: `Promise<EditInstance>`
- **描述**: 异步初始化 Monaco Editor 实例
- **用法**: 
  ```typescript
  const editor = await initMonacoEdit()
  ```

#### destroy()
- **描述**: 销毁编辑器实例，释放内存
- **用法**: 
  ```typescript
  destroy()
  ```

#### registerLanguage(language)
- **参数**: `language: string` - 要注册的语言ID
- **描述**: 动态注册新的编程语言支持
- **用法**: 
  ```typescript
  registerLanguage('rust')
  ```

---

## TypeScript 类型定义

### Monaco 组件类型

```typescript
import type { BundledLanguage, BundledTheme } from 'shiki'
import type { EditInstance } from '@vue-element-plus-x-shiki-monaco/core'

// 组件 Props
interface MonacoProps {
  language?: BundledLanguage
  theme?: BundledTheme
  value?: string
  height?: string
  showToolbar?: boolean
}

// 组件 Emits
interface MonacoEmits {
  change: [value: string]
  ready: [editor: EditInstance]
}

// 编辑器实例类型
type EditInstance = monaco.editor.IStandaloneCodeEditor
```

### Hook 类型

```typescript
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'
import type * as monaco from 'monaco-editor-core'

// Hook 选项
interface MonacoOptions {
  target: HTMLElement
  languages: BundledLanguage[]
  codeValue: string
  themes: BundledTheme[]
  defaultTheme: BundledTheme
  defaultLanguage: BundledLanguage
}

// Hook 返回值
interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>
  destroy: () => void
  registerLanguage: (language: string) => void
  editInstance: EditInstance | null
}

// 编辑器实例
type EditInstance = monaco.editor.IStandaloneCodeEditor
```