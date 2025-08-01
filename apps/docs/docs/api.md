---
sidebar_position: 2
title: API 参考
---

# Monaco 组件 API

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

## TypeScript 类型

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