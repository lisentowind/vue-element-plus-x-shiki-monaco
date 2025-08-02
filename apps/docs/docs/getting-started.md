---
sidebar_position: 2
title: 快速开始
---

# 快速开始

## 安装

使用 npm、yarn 或 pnpm 安装组件：

```bash
# npm
npm install vue-shiki-monaco

# yarn
yarn add vue-shiki-monaco

# pnpm
pnpm add vue-shiki-monaco
```

## 基础使用

### 1. 导入组件

```vue
<script setup>
import Monaco from 'vue-shiki-monaco'
</script>
```

### 2. 在模板中使用

```vue
<template>
  <Monaco
    language="javascript"
    :value="code"
    height="400px"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import Monaco from 'vue-shiki-monaco'

const code = ref(`// 你的代码
function hello(name) {
  return \`Hello, \${name}!\`;
}

console.log(hello('World'));`)

const handleChange = (newValue) => {
  console.log('代码已更新:', newValue)
}
</script>
```

## 完整示例

这是一个功能完整的代码编辑器示例：

```vue
<template>
  <div class="editor-container">
    <div class="controls">
      <select v-model="selectedLanguage" @change="changeLanguage">
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
      </select>

      <select v-model="selectedTheme" @change="changeTheme">
        <option value="vitesse-light">浅色主题</option>
        <option value="vitesse-dark">深色主题</option>
        <option value="github-light">GitHub 浅色</option>
        <option value="github-dark">GitHub 深色</option>
      </select>

      <button @click="formatCode">格式化代码</button>
      <button @click="copyCode">复制代码</button>
    </div>

    <Monaco
      ref="monacoRef"
      :language="selectedLanguage"
      :theme="selectedTheme"
      :value="currentCode"
      height="500px"
      @change="handleCodeChange"
      @ready="handleEditorReady"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Monaco from 'vue-shiki-monaco'

const monacoRef = ref()
const selectedLanguage = ref('javascript')
const selectedTheme = ref('vitesse-light')

// 不同语言的示例代码
const codeTemplates = reactive({
  javascript: \`// JavaScript 示例
function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);
console.log('Sum:', result);\`,

  typescript: \`// TypeScript 示例
interface User {
  id: number;
  name: string;
  email: string;
}

class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  findUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}

const manager = new UserManager();
manager.addUser({ id: 1, name: 'John', email: 'john@example.com' });\`,

  python: \`# Python 示例
class Calculator:
    def __init__(self):
        self.history = []

    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

    def get_history(self):
        return self.history

calc = Calculator()
result = calc.add(10, 20)
print(f"结果: {result}")
print("历史记录:", calc.get_history())\`,

  html: \`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
        }
        .highlight {
            background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <header>
        <h1>欢迎使用 Monaco Editor</h1>
        <p class="highlight">现代化的代码编辑器组件</p>
    </header>

    <main>
        <section>
            <h2>功能特点</h2>
            <ul>
                <li>🎨 语法高亮</li>
                <li>🔧 代码补全</li>
                <li>📝 错误检测</li>
                <li>🚀 高性能</li>
            </ul>
        </section>
    </main>
</body>
</html>\`,

  css: \`/* CSS 示例 - 现代化卡片设计 */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-content {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}\`
})

const currentCode = ref(codeTemplates.javascript)

const handleCodeChange = (newValue) => {
  currentCode.value = newValue
}

const handleEditorReady = (editor) => {
  console.log('编辑器已准备就绪:', editor)
  // 可以在这里进行一些初始化操作
  editor.focus()
}

const changeLanguage = () => {
  currentCode.value = codeTemplates[selectedLanguage.value]
}

const changeTheme = () => {
  // 主题会自动应用
  console.log('主题已切换到:', selectedTheme.value)
}

const formatCode = () => {
  if (monacoRef.value) {
    monacoRef.value.formatCode()
  }
}

const copyCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.copyCode()
    alert('代码已复制到剪贴板！')
  }
}
</script>

<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.controls select,
.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.controls button {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transition: background-color 0.2s ease;
}

.controls button:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }

  .controls select,
  .controls button {
    width: 100%;
  }
}
</style>
```

## 下一步

现在你已经成功设置了 Monaco 编辑器组件！你可以：

- 📖 查看 [API 文档](./api) 了解所有可用的属性和方法
- 💡 浏览 [使用示例](./examples) 获取更多灵感
- 🎨 学习如何自定义主题和样式

## 常见问题

### Q: 如何在 Nuxt.js 中使用？

A: 在 Nuxt.js 中使用时，需要在客户端渲染：

```vue
<template>
  <ClientOnly>
    <Monaco
      language="javascript"
      :value="code"
      @change="handleChange"
    />
  </ClientOnly>
</template>
```

### Q: 如何预加载语言和主题？

A: 组件会自动加载所需的语言和主题。Monaco 编辑器通过 Shiki 自动管理语言和主题的加载，你只需要指定需要的 `languages` 和 `themes` 参数即可：

```vue
<script setup>
import { ref } from 'vue'
import Monaco from 'vue-shiki-monaco'

// 组件会自动处理多语言和主题的加载
const languages = ['javascript', 'typescript', 'python']
const themes = ['vitesse-light', 'vitesse-dark']
</script>
```

### Q: 如何处理大文件？

A: 对于大文件，建议使用虚拟滚动和懒加载：

```vue
<Monaco
  language="javascript"
  :value="largeFileContent"
  height="600px"
  :options="{
    scrollBeyondLastLine: false,
    readOnly: false,
    minimap: { enabled: false },
    wordWrap: 'on'
  }"
/>
```