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
import { Monaco } from "vue-shiki-monaco";
</script>
```

### 2. 在模板中使用

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Monaco } from "vue-shiki-monaco";

// 重复10次
const mockCode = `
  function helloWorld() {
    console.log("Hello, World!");
  }

  helloWorld();
  `.repeat(10);

const timer = ref();
const index = ref(0);
function start() {
  timer.value = setInterval(() => {
    index.value += 250;
    if (index.value > mockCode.length) {
      clearInterval(timer.value);
      index.value = mockCode.length;
    }
  }, 100);
}

const content = computed(() => {
  return mockCode.slice(0, index.value);
});

const handleChange = (value: string) => {
  console.log('handleChange');
};

onMounted(() => {
  start();
});
</script>

<template>
  <div>
    <Monaco
      :language="'javascript'"
      :theme="'github-dark'"
      :value="content"
      :show-toolbar="true"
      @change="handleChange"
    />
  </div>
</template>

```

## 完整示例

这是一个功能完整的代码编辑器示例，展示了组件的主要特性：

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
        <option value="vue">Vue</option>
        <option value="json">JSON</option>
      </select>

      <select v-model="selectedTheme" @change="changeTheme">
        <option value="vitesse-light">浅色主题</option>
        <option value="vitesse-dark">深色主题</option>
        <option value="github-light">GitHub 浅色</option>
        <option value="github-dark">GitHub 深色</option>
      </select>

      <button @click="formatCode">🎨 格式化代码</button>
      <button @click="copyCode">📋 复制代码</button>
      <button @click="pasteCode">📄 粘贴代码</button>
    </div>

    <Monaco
      ref="monacoRef"
      :current-language="selectedLanguage"
      :current-theme="selectedTheme"
      :value="currentCode"
      :file-name="fileName"
      height="500px"
      :show-toolbar="true"
      :auto-resize="true"
      :context-menu="contextMenuConfig"
      @change="handleCodeChange"
      @ready="handleEditorReady"
    />

    <!-- 状态栏 -->
    <div class="status-bar">
      <span>语言: {{ selectedLanguage.toUpperCase() }}</span>
      <span>主题: {{ formatThemeName(selectedTheme) }}</span>
      <span>行数: {{ stats.lines }}</span>
      <span>字符数: {{ stats.characters }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { Monaco } from "vue-shiki-monaco";

const monacoRef = ref<InstanceType<typeof Monaco>>();
const selectedLanguage = ref("javascript");
const selectedTheme = ref("vitesse-light");

const stats = reactive({
  lines: 0,
  characters: 0,
});

// 不同语言的示例代码
const codeTemplates = reactive({
  javascript: `// JavaScript 示例
function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);
console.log('Sum:', result);`,

  typescript: `
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
manager.addUser({ id: 1, name: 'John', email: 'john@example.com' });`,

  python: `# Python 示例
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
print("历史记录:", calc.get_history())`,

  html: `<!DOCTYPE html>
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
                <li>📋 智能剪贴板</li>
                <li>🎯 自定义右键菜单</li>
            </ul>
        </section>
    </main>
</body>
</html>`,

  css: `/* CSS 示例 - 现代化卡片设计 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}`,
  vue: `<template>
  <div class="todo-app">
    <h1>Vue.js Todo 应用</h1>

    <form @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        placeholder="添加新任务..."
        required
      />
      <button type="submit">添加</button>
    </form>

    <ul class="todo-list">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          v-model="todo.completed"
        />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">删除</button>
      </li>
    </ul>

    <p>
      剩余任务: {{ remainingTodos }} / 总计: {{ todos.length }}
    </p>
  </div>
</template>

<\script setup>
import { ref, computed } from 'vue'

const newTodo = ref('')
const todos = ref([
  { id: 1, text: '学习 Vue.js', completed: false },
  { id: 2, text: '使用 Monaco Editor', completed: true }
])

const remainingTodos = computed(() =>
  todos.value.filter(todo => !todo.completed).length
)

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}

const removeTodo = (id) => {
  todos.value = todos.value.filter(todo => todo.id !== id)
}
<\/script>

<style scoped>
.todo-app {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.completed span {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>`,

  json: `{
  "name": "vue-shiki-monaco",
  "version": "1.0.0",
  "description": "现代化的 Vue.js Monaco Editor 组件",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "keywords": [
    "vue",
    "monaco",
    "editor",
    "code",
    "syntax-highlighting",
    "typescript"
  ],
  "dependencies": {
    "vue": "^3.3.0",
    "monaco-editor-core": "^0.44.0",
    "shiki": "^0.14.0",
    "@shikijs/monaco": "^0.14.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.4.0",
    "typescript": "^5.2.0",
    "vite": "^4.5.0"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/vue-shiki-monaco.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/vue-shiki-monaco/issues"
  },
  "homepage": "https://vue-shiki-monaco.netlify.app"
}`,
});

const currentCode = ref(codeTemplates.javascript);

// 文件名映射
const fileName = computed(() => {
  const extensions = {
    javascript: "example.js",
    typescript: "example.ts",
    python: "example.py",
    html: "index.html",
    css: "styles.css",
    vue: "App.vue",
    json: "package.json",
  };
  return extensions[selectedLanguage.value] || "untitled.txt";
});

// 右键菜单配置
const contextMenuConfig = reactive({
  enabled: true,
  items: "full",
  customItems: [
    { type: "separator" },
    {
      type: "item",
      id: "run-code",
      label: "▶️ 运行代码",
      shortcut: "F5",
      action: () => {
        console.log("运行代码:", currentCode.value);
        alert("代码运行功能（演示）");
      },
    },
    {
      type: "item",
      id: "save-file",
      label: "💾 保存文件",
      shortcut: "Ctrl+S",
      action: () => {
        console.log("保存文件:", fileName.value);
        alert(`文件 ${fileName.value} 已保存（演示）`);
      },
    },
  ],
});

const handleCodeChange = (newValue) => {
  currentCode.value = newValue;
  updateStats(newValue);
};

const handleEditorReady = (editor) => {
  console.log("编辑器已准备就绪:", editor);
  updateStats(currentCode.value);

  // 聚焦编辑器
  editor.focus();
};

const updateStats = (code) => {
  stats.lines = code.split("\\n").length;
  stats.characters = code.length;
};

const changeLanguage = () => {
  // 切换语言时加载对应的示例代码
  currentCode.value = codeTemplates[selectedLanguage.value];
};

const changeTheme = () => {
  // 主题会自动应用
  console.log("主题已切换到:", selectedTheme.value);
};

const formatCode = () => {
  if (monacoRef.value) {
    monacoRef.value.formatCode();
    console.log("代码已格式化");
  }
};

const copyCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.copyCode();
    console.log("代码已复制到剪贴板");
  }
};

const pasteCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.pasteCode();
    console.log("已从剪贴板粘贴内容");
  }
};

const formatThemeName = (theme) => {
  return theme
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

watch(
  () => currentCode.value,
  (v) => {
    monacoRef.value.setValue(v);
  }
);
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
  align-items: center;
}

.controls select,
.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.controls button {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.controls button:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.controls select:hover {
  border-color: #adb5bd;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 8px 8px;
  font-size: 0.875rem;
  color: #6c757d;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .controls select,
  .controls button {
    width: 100%;
  }

  .status-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

```

## 核心特性

### 🎨 语法高亮

基于 Shiki 提供精确的语法高亮，支持 100+ 编程语言：

- **JavaScript/TypeScript** - 完整的 ES2023+ 语法支持
- **Python** - Python 3.x 语法高亮
- **HTML/CSS** - Web 前端语言支持
- **Vue/React** - 现代前端框架支持
- **Go/Rust/Java** - 系统编程语言支持
- **更多语言** - 支持几乎所有主流编程语言

### 📋 编辑器实例

强大的剪贴板功能，支持多种策略：

```vue
<script setup lang="ts">
import { Monaco, type EditInstance } from "vue-shiki-monaco";

// 重复10次
const mockCode = `
  function helloWorld() {
    console.log("Hello, World!");
  }

  helloWorld();
  `.repeat(10);
const handleReady = (editor: EditInstance) => {
  console.log(editor);
};
</script>

<template>
  <div>
    <Monaco
      :value="mockCode"
      :context-menu="{
        enabled: true,
        items: 'minimal',
      }"
      @ready="handleReady"
    />
  </div>
</template>

```

### 🎯 自定义右键菜单

灵活的右键菜单配置：

```vue
<template>
  <Monaco
    :context-menu="{
      enabled: true,
      items: ['copy', 'paste', 'selectAll'],
      customItems: [
        { type: 'separator' },
        {
          type: 'item',
          id: 'custom-action',
          label: '自定义操作',
          shortcut: 'Ctrl+Shift+X',
          action: () => console.log('自定义操作')
        }
      ]
    }"
  />
</template>
```

### 🔧 动态配置

支持运行时动态切换语言和主题：

```vue
<script setup>
const monacoRef = ref()

// 动态切换语言
const switchLanguage = (language) => {
  monacoRef.value?.setLanguage(language)
}

// 动态切换主题
const switchTheme = (theme) => {
  monacoRef.value?.setTheme(theme)
}
</script>
```

### 📱 响应式设计

自动适配不同屏幕尺寸：

```vue
<template>
  <Monaco
    :height="isMobile ? '300px' : '500px'"
    :show-toolbar="!isMobile"
    :auto-resize="true"
  />
</template>
```

## 下一步

现在你已经成功设置了 Monaco 编辑器组件！你可以：

- 📖 查看 [API 文档](./api) 了解所有可用的属性和方法
- 💡 浏览 [使用示例](./examples) 获取更多灵感
- 🎨 学习如何自定义主题和样式
- 🔌 了解如何使用 `useMonacoEdit` hook 进行高级定制

## 常见问题

### Q: 如何在 Nuxt.js 中使用？

A: 在 Nuxt.js 中使用时，需要在客户端渲染：

```vue
<template>
  <ClientOnly>
    <Monaco
      current-language="javascript"
      :value="code"
      @change="handleChange"
    />
  </ClientOnly>
</template>
```

### Q: 如何预加载语言和主题？

A: 组件会自动加载所需的语言和主题。你只需要在 `languages` 和 `themes` 参数中指定需要的选项：

```vue
<template>
  <Monaco
    :languages="['javascript', 'typescript', 'python']"
    :themes="['vitesse-light', 'vitesse-dark']"
    current-language="javascript"
    current-theme="vitesse-light"
  />
</template>
```

### Q: 如何处理大文件？

A: 对于大文件，建议禁用一些性能消耗较大的功能：

```vue
<script setup>
const handleReady = (editor) => {
  editor.updateOptions({
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    wordWrap: 'on',
    readOnly: false,
    // 对于大文件，可以禁用一些功能以提升性能
    quickSuggestions: false,
    parameterHints: { enabled: false }
  })
}
</script>
```

### Q: 如何自定义快捷键？

A: 可以通过监听编辑器实例来添加自定义快捷键：

```vue
<script setup>
const handleReady = (editor) => {
  // 添加自定义快捷键
  editor.addAction({
    id: 'custom-save',
    label: 'Save File',
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS
    ],
    run: () => {
      console.log('保存文件')
    }
  })
}
</script>
```

### Q: 如何集成到现有项目中？

A: 组件设计为即插即用，可以轻松集成到任何 Vue 3 项目中：

1. **安装依赖**：`npm install vue-shiki-monaco`
2. **导入组件**：`import Monaco from 'vue-shiki-monaco'`
3. **使用组件**：在模板中使用 `<Monaco />` 标签
4. **配置选项**：根据需要设置 props 和事件监听器

组件与主流的 Vue 3 生态系统兼容，包括 Vite、Nuxt.js、Quasar 等框架。

```

```
