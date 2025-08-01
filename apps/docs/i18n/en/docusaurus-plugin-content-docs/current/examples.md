---
sidebar_position: 4
title: Usage Examples
---

# Usage Examples

## Basic Usage

The simplest way to use:

```vue
<template>
  <Monaco 
    language="javascript"
    :value="code"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const code = ref(`console.log('Hello Monaco!')`)

const handleChange = (newValue) => {
  code.value = newValue
}
</script>
```

## Multi-language Support

Support for multiple programming languages:

```vue
<template>
  <div>
    <select @change="changeLanguage">
      <option value="javascript">JavaScript</option>
      <option value="typescript">TypeScript</option>
      <option value="python">Python</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
    </select>
    
    <Monaco 
      :language="currentLanguage"
      :value="codeExamples[currentLanguage]"
      height="400px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const currentLanguage = ref('javascript')

const codeExamples = {
  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
  
  typescript: `interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return \`Hello, \${person.name}!\`;
}

const user: Person = { name: 'Alice', age: 30 };
console.log(greet(user));`,
  
  python: `def greet(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is an HTML example</p>
</body>
</html>`,
  
  css: `/* Modern styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}`
}

const changeLanguage = (event) => {
  currentLanguage.value = event.target.value
}
</script>
```

## Theme Switching

Support for light and dark themes:

```vue
<template>
  <div>
    <div class="theme-switcher">
      <button 
        @click="toggleTheme"
        class="theme-btn"
        :class="{ dark: isDark }"
      >
        {{ isDark ? '🌙' : '☀️' }} {{ isDark ? 'Dark Mode' : 'Light Mode' }}
      </button>
    </div>
    
    <Monaco 
      language="typescript"
      :theme="isDark ? 'vitesse-dark' : 'vitesse-light'"
      :value="code"
      height="500px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const isDark = ref(false)
const code = ref(`// Theme switching example
class ThemeManager {
  private currentTheme: 'light' | 'dark' = 'light';
  
  constructor() {
    this.initTheme();
  }
  
  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.currentTheme = savedTheme;
      this.applyTheme();
    }
  }
  
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this.currentTheme);
  }
  
  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }
}

const themeManager = new ThemeManager();`)

const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<style scoped>
.theme-switcher {
  margin-bottom: 1rem;
}

.theme-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  background: #f5f5f5;
}

.theme-btn.dark {
  background: #333;
  color: white;
  border-color: #555;
}

.theme-btn.dark:hover {
  background: #444;
}
</style>
```

## Custom Toolbar

Create a custom toolbar:

```vue
<template>
  <Monaco 
    language="javascript"
    :value="code"
    @change="handleChange"
    @ready="handleReady"
  >
    <template #toolbar>
      <div class="custom-toolbar">
        <div class="toolbar-left">
          <span class="file-name">{{ fileName }}</span>
          <span class="status" :class="{ modified: isModified }">
            {{ isModified ? '● Modified' : '● Saved' }}
          </span>
        </div>
        
        <div class="toolbar-right">
          <button @click="formatCode" class="btn" title="Format Code">
            🎨 Format
          </button>
          <button @click="copyCode" class="btn" title="Copy Code">
            📋 Copy
          </button>
          <button @click="runCode" class="btn primary" title="Run Code">
            ▶️ Run
          </button>
        </div>
      </div>
    </template>
  </Monaco>
  
  <!-- Output panel -->
  <div v-if="output" class="output-panel">
    <h4>Output:</h4>
    <pre>{{ output }}</pre>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const fileName = ref('example.js')
const isModified = ref(false)
const output = ref('')
const editorRef = ref()

const code = ref(`// Click run button to execute code
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}`)

const originalCode = ref(code.value)

const handleChange = (newValue) => {
  code.value = newValue
  isModified.value = newValue !== originalCode.value
}

const handleReady = (editor) => {
  editorRef.value = editor
}

const formatCode = () => {
  editorRef.value?.getAction('editor.action.formatDocument')?.run()
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(code.value)
    alert('Code copied to clipboard!')
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const runCode = () => {
  try {
    // Simple code execution example (use safer methods in production)
    const logs = []
    const originalLog = console.log
    console.log = (...args) => {
      logs.push(args.join(' '))
    }
    
    // Execute code
    eval(code.value)
    
    // Restore console.log
    console.log = originalLog
    
    output.value = logs.join('\\n')
    isModified.value = false
    originalCode.value = code.value
  } catch (error) {
    output.value = `Error: ${error.message}`
  }
}
</script>

<style scoped>
.custom-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-name {
  font-weight: 600;
  color: #495057;
}

.status {
  font-size: 0.875rem;
  color: #28a745;
}

.status.modified {
  color: #ffc107;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  color: #495057;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn.primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.output-panel {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.output-panel h4 {
  margin: 0 0 0.5rem 0;
  color: #495057;
}

.output-panel pre {
  margin: 0;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #495057;
  overflow-x: auto;
}
</style>
```

## Responsive Design

Adapt to different screen sizes:

```vue
<template>
  <div class="responsive-editor">
    <Monaco 
      language="javascript"
      :value="code"
      :height="editorHeight"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const editorHeight = ref('400px')
const code = ref(`// Responsive editor example
function getScreenSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  };
}

const screenInfo = getScreenSize();
console.log('Screen info:', screenInfo);`)

const updateEditorHeight = () => {
  const vh = window.innerHeight
  const isMobile = window.innerWidth < 768
  
  if (isMobile) {
    editorHeight.value = Math.min(vh * 0.4, 300) + 'px'
  } else {
    editorHeight.value = Math.min(vh * 0.6, 600) + 'px'
  }
}

const handleChange = (newValue) => {
  console.log('Code updated:', newValue)
}

onMounted(() => {
  updateEditorHeight()
  window.addEventListener('resize', updateEditorHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateEditorHeight)
})
</script>

<style scoped>
.responsive-editor {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .responsive-editor {
    padding: 0.5rem;
  }
}

@media (min-width: 769px) {
  .responsive-editor {
    padding: 1rem;
  }
}

@media (min-width: 1200px) {
  .responsive-editor {
    max-width: 1200px;
  }
}
</style>
```

These examples showcase various use cases of the Monaco component, from basic usage to advanced features, helping developers quickly get started and maximize the component's potential.