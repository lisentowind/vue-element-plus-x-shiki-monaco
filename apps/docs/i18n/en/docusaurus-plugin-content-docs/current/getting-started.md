---
sidebar_position: 4
title: Getting Started
---

# Getting Started

## Installation

Install the component using npm, yarn, or pnpm:

```bash
# npm
npm install @vue-element-plus-x-shiki-monaco/core

# yarn
yarn add @vue-element-plus-x-shiki-monaco/core

# pnpm
pnpm add @vue-element-plus-x-shiki-monaco/core
```

## Basic Usage

### 1. Import Component

```vue
<script setup>
import Monaco from '@vue-element-plus-x-shiki-monaco/core'
</script>
```

### 2. Use in Template

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
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const code = ref(`// Your code
function hello(name) {
  return \`Hello, \${name}!\`;
}

console.log(hello('World'));`)

const handleChange = (newValue) => {
  console.log('Code updated:', newValue)
}
</script>
```

## Complete Example

Here's a fully-featured code editor example:

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
        <option value="vitesse-light">Light Theme</option>
        <option value="vitesse-dark">Dark Theme</option>
        <option value="github-light">GitHub Light</option>
        <option value="github-dark">GitHub Dark</option>
      </select>
      
      <button @click="formatCode">Format Code</button>
      <button @click="copyCode">Copy Code</button>
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
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const monacoRef = ref()
const selectedLanguage = ref('javascript')
const selectedTheme = ref('vitesse-light')

// Code templates for different languages
const codeTemplates = reactive({
  javascript: \`// JavaScript Example
function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

const numbers = [1, 2, 3, 4, 5];
const result = calculateSum(numbers);
console.log('Sum:', result);\`,

  typescript: \`// TypeScript Example
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

  python: \`# Python Example
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
print("History:", calc.get_history())\`,

  html: \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
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
                <li>🎨 Syntax Highlighting</li>
                <li>🔧 Code Completion</li>
                <li>📝 Error Detection</li>
                <li>🚀 High Performance</li>
            </ul>
        </section>
    </main>
</body>
</html>\`,

  css: \`/* CSS Example - Modern Card Design */
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

/* Responsive Design */
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
  console.log('Editor ready:', editor)
  // Can perform some initialization here
  editor.focus()
}

const changeLanguage = () => {
  currentCode.value = codeTemplates[selectedLanguage.value]
}

const changeTheme = () => {
  // Theme will be applied automatically
  console.log('Theme switched to:', selectedTheme.value)
}

const formatCode = () => {
  if (monacoRef.value) {
    monacoRef.value.formatCode()
  }
}

const copyCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.copyCode()
    alert('Code copied to clipboard!')
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

## Next Steps

Now you've successfully set up the Monaco editor component! You can:

- 📖 Check the [API Documentation](./api) to learn about all available properties and methods
- 💡 Browse [Usage Examples](./examples) for more inspiration
- 🎨 Learn how to customize themes and styles

## FAQ

### Q: How to use in Nuxt.js?

A: In Nuxt.js, you need to render on client-side:

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

### Q: How to preload languages and themes?

A: The component automatically loads required languages and themes, but you can also preload:

```vue
<script setup>
import { onMounted } from 'vue'
import { preloadLanguages, preloadThemes } from '@vue-element-plus-x-shiki-monaco/core'

onMounted(async () => {
  await preloadLanguages(['javascript', 'typescript', 'python'])
  await preloadThemes(['vitesse-light', 'vitesse-dark'])
})
</script>
```

### Q: How to handle large files?

A: For large files, it's recommended to use virtual scrolling and lazy loading:

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