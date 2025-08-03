---
sidebar_position: 2
title: Getting Started
---

# Getting Started

## Installation

Install the component using npm, yarn, or pnpm:

```bash
# npm
npm install vue-shiki-monaco

# yarn
yarn add vue-shiki-monaco

# pnpm
pnpm add vue-shiki-monaco
```

## Basic Usage

### 1. Import Component

```vue
<script setup>
import { Monaco } from "vue-shiki-monaco";
</script>
```

### 2. Use in Template

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Monaco } from "vue-shiki-monaco";

// Repeat 10 times
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

## Complete Example

This is a fully functional code editor example showcasing the main features of the component:

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
        <option value="vitesse-light">Light Theme</option>
        <option value="vitesse-dark">Dark Theme</option>
        <option value="github-light">GitHub Light</option>
        <option value="github-dark">GitHub Dark</option>
      </select>

      <button @click="formatCode">🎨 Format Code</button>
      <button @click="copyCode">📋 Copy Code</button>
      <button @click="pasteCode">📄 Paste Code</button>
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

    <!-- Status bar -->
    <div class="status-bar">
      <span>Language: {{ selectedLanguage.toUpperCase() }}</span>
      <span>Theme: {{ formatThemeName(selectedTheme) }}</span>
      <span>Lines: {{ stats.lines }}</span>
      <span>Characters: {{ stats.characters }}</span>
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

// Code templates for different languages
const codeTemplates = reactive({
  javascript: `// JavaScript Example
function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);
console.log('Sum:', result);`,

  typescript: `interface User {
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

  python: `# Python Example
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
print(f"Result: {result}")
print("History:", calc.get_history())`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Page</title>
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
        <h1>Welcome to Monaco Editor</h1>
        <p class="highlight">Modern code editor component</p>
    </header>

    <main>
        <section>
            <h2>Features</h2>
            <ul>
                <li>🎨 Syntax highlighting</li>
                <li>🔧 Code completion</li>
                <li>📝 Error detection</li>
                <li>🚀 High performance</li>
                <li>📋 Smart clipboard</li>
                <li>🎯 Custom context menu</li>
            </ul>
        </section>
    </main>
</body>
</html>`,

  css: `/* CSS Example - Modern card design */
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

/* Responsive design */
@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}`,

  vue: `<template>
  <div class="todo-app">
    <h1>Vue.js Todo App</h1>

    <form @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        placeholder="Add new task..."
        required
      />
      <button type="submit">Add</button>
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
        <button @click="removeTodo(todo.id)">Delete</button>
      </li>
    </ul>

    <p>
      Remaining tasks: {{ remainingTodos }} / Total: {{ todos.length }}
    </p>
  </div>
</template>

<\script setup>
import { ref, computed } from 'vue'

const newTodo = ref('')
const todos = ref([
  { id: 1, text: 'Learn Vue.js', completed: false },
  { id: 2, text: 'Use Monaco Editor', completed: true }
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
  "description": "Modern Vue.js Monaco Editor component",
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

// File name mapping
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

// Context menu configuration
const contextMenuConfig = reactive({
  enabled: true,
  items: "full",
  customItems: [
    { type: "separator" },
    {
      type: "item",
      id: "run-code",
      label: "▶️ Run Code",
      shortcut: "F5",
      action: () => {
        console.log("Run code:", currentCode.value);
        alert("Code run function (demo)");
      },
    },
    {
      type: "item",
      id: "save-file",
      label: "💾 Save File",
      shortcut: "Ctrl+S",
      action: () => {
        console.log("Save file:", fileName.value);
        alert(`File ${fileName.value} saved (demo)`);
      },
    },
  ],
});

const handleCodeChange = (newValue) => {
  currentCode.value = newValue;
  updateStats(newValue);
};

const handleEditorReady = (editor) => {
  console.log("Editor ready:", editor);
  updateStats(currentCode.value);

  // Focus editor
  editor.focus();
};

const updateStats = (code) => {
  stats.lines = code.split("\\n").length;
  stats.characters = code.length;
};

const changeLanguage = () => {
  // Load corresponding example code when switching language
  currentCode.value = codeTemplates[selectedLanguage.value];
};

const changeTheme = () => {
  // Theme will be applied automatically
  console.log("Theme switched to:", selectedTheme.value);
};

const formatCode = () => {
  if (monacoRef.value) {
    monacoRef.value.formatCode();
    console.log("Code formatted");
  }
};

const copyCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.copyCode();
    console.log("Code copied to clipboard");
  }
};

const pasteCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.pasteCode();
    console.log("Content pasted from clipboard");
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

## Core Features

### 🎨 Syntax Highlighting

Provides precise syntax highlighting based on Shiki, supporting 100+ programming languages:

- **JavaScript/TypeScript** - Complete ES2023+ syntax support
- **Python** - Python 3.x syntax highlighting
- **HTML/CSS** - Web frontend language support
- **Vue/React** - Modern frontend framework support
- **Go/Rust/Java** - System programming language support
- **More Languages** - Supports almost all mainstream programming languages

### 📋 Editor Instance

Powerful clipboard functionality with multiple strategy support:

```vue
<script setup lang="ts">
import { Monaco, type EditInstance } from "vue-shiki-monaco";

// Repeat 10 times
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

### 🎯 Custom Context Menu

Flexible context menu configuration:

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
          label: 'Custom Action',
          shortcut: 'Ctrl+Shift+X',
          action: () => console.log('Custom action')
        }
      ]
    }"
  />
</template>
```

### 🔧 Dynamic Configuration

Supports runtime dynamic language and theme switching:

```vue
<script setup>
const monacoRef = ref()

// Dynamic language switching
const switchLanguage = (language) => {
  monacoRef.value?.setLanguage(language)
}

// Dynamic theme switching
const switchTheme = (theme) => {
  monacoRef.value?.setTheme(theme)
}
</script>
```

### 📱 Responsive Design

Automatically adapts to different screen sizes:

```vue
<template>
  <Monaco
    :height="isMobile ? '300px' : '500px'"
    :show-toolbar="!isMobile"
    :auto-resize="true"
  />
</template>
```

## Next Steps

Now you have successfully set up the Monaco editor component! You can:

- 📖 Check [API Documentation](./api) to learn about all available properties and methods
- 💡 Browse [Usage Examples](./examples) for more inspiration
- 🎨 Learn how to customize themes and styles
- 🔌 Learn how to use the `useMonacoEdit` hook for advanced customization

## Frequently Asked Questions

### Q: How to use in Nuxt.js?

A: When using in Nuxt.js, it needs to be rendered on the client side:

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

### Q: How to preload languages and themes?

A: The component will automatically load required languages and themes. You just need to specify the needed options in the `languages` and `themes` parameters:

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

### Q: How to handle large files?

A: For large files, it's recommended to disable some performance-intensive features:

```vue
<script setup>
const handleReady = (editor) => {
  editor.updateOptions({
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    wordWrap: 'on',
    readOnly: false,
    // For large files, disable some features to improve performance
    quickSuggestions: false,
    parameterHints: { enabled: false }
  })
}
</script>
```

### Q: How to customize keyboard shortcuts?

A: You can add custom keyboard shortcuts by listening to the editor instance:

```vue
<script setup>
const handleReady = (editor) => {
  // Add custom keyboard shortcuts
  editor.addAction({
    id: 'custom-save',
    label: 'Save File',
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS
    ],
    run: () => {
      console.log('Save file')
    }
  })
}
</script>
```

### Q: How to integrate into existing projects?

A: The component is designed to be plug-and-play and can be easily integrated into any Vue 3 project:

1. **Install dependencies**: `npm install vue-shiki-monaco`
2. **Import component**: `import Monaco from 'vue-shiki-monaco'`
3. **Use component**: Use `<Monaco />` tag in template
4. **Configure options**: Set props and event listeners as needed

The component is compatible with mainstream Vue 3 ecosystem, including Vite, Nuxt.js, Quasar, and other frameworks.