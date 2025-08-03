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
import { Monaco } from 'vue-shiki-monaco'

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
      <option value="vue">Vue</option>
      <option value="go">Go</option>
      <option value="rust">Rust</option>
    </select>

    <Monaco
      :current-language="currentLanguage"
      :value="codeExamples[currentLanguage]"
      height="400px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Monaco } from 'vue-shiki-monaco'

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
}`,

  vue: `<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('Hello Vue!')
const count = ref(0)

const increment = () => {
  count.value++
}
</script>`,

  go: `package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    message := greet("World")
    fmt.Println(message)
}`,

  rust: `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    let message = greet("World");
    println!("{}", message);
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
      :current-theme="isDark ? 'vitesse-dark' : 'vitesse-light'"
      :value="code"
      height="500px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Monaco } from 'vue-shiki-monaco'

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

## Custom Context Menu

Creating powerful custom context menus:

```vue
<template>
  <div>
    <div class="menu-controls">
      <label>
        <input type="radio" v-model="menuType" value="minimal" />
        Minimal Menu
      </label>
      <label>
        <input type="radio" v-model="menuType" value="basic" />
        Basic Menu
      </label>
      <label>
        <input type="radio" v-model="menuType" value="full" />
        Full Menu
      </label>
      <label>
        <input type="radio" v-model="menuType" value="custom" />
        Custom Menu
      </label>
    </div>

    <Monaco
      language="javascript"
      :value="code"
      :context-menu="contextMenuConfig"
      height="400px"
      @change="handleChange"
    />

    <div v-if="actionLog.length" class="action-log">
      <h4>Action Log</h4>
      <ul>
        <li v-for="(action, index) in actionLog" :key="index">
          {{ action }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Monaco } from 'vue-shiki-monaco'

const menuType = ref('full')
const actionLog = ref([])

const code = ref(`// Context menu example
function demonstrateContextMenu() {
  // Right-click in the editor to experience different menu configurations:

  // 1. Minimal menu: only copy, paste, select all
  // 2. Basic menu: includes basic editing operations
  // 3. Full menu: all features available
  // 4. Custom menu: added special functions

  const features = [
    'Smart copy paste',
    'Multi-level fallback strategy',
    'Custom menu items',
    'Keyboard shortcut support',
    'Separator organization'
  ];

  console.log('Context menu features:', features);
  return 'Experience powerful context menu functionality!';
}

// Right-click after selecting text, or right-click in empty space
demonstrateContextMenu();`)

const contextMenuConfig = computed(() => {
  const baseConfig = {
    enabled: true,
    items: menuType.value === 'custom' ? ['copy', 'paste', 'selectAll'] : menuType.value
  }

  if (menuType.value === 'custom') {
    baseConfig.customItems = [
      { type: 'separator' },
      {
        type: 'item',
        id: 'beautify',
        label: '🎨 Beautify Code',
        shortcut: 'Ctrl+Shift+B',
        action: () => logAction('Beautify Code')
      },
      {
        type: 'item',
        id: 'run-code',
        label: '▶️ Run Code',
        shortcut: 'F5',
        action: () => logAction('Run Code')
      },
      {
        type: 'item',
        id: 'save-snippet',
        label: '💾 Save Code Snippet',
        shortcut: 'Ctrl+S',
        action: () => logAction('Save Code Snippet')
      },
      { type: 'separator' },
      {
        type: 'item',
        id: 'share',
        label: '📤 Share Code',
        action: () => logAction('Share Code')
      }
    ]
  }

  return baseConfig
})

const logAction = (action) => {
  const timestamp = new Date().toLocaleTimeString()
  actionLog.value.unshift(`[${timestamp}] ${action}`)

  // Keep log length
  if (actionLog.value.length > 10) {
    actionLog.value = actionLog.value.slice(0, 10)
  }
}

const handleChange = (newValue) => {
  // Code change handling
}
</script>

<style scoped>
.menu-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.menu-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.action-log {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.action-log h4 {
  margin: 0 0 0.5rem 0;
  color: #495057;
}

.action-log ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.action-log li {
  padding: 0.25rem 0;
  font-family: monospace;
  font-size: 0.875rem;
  color: #6c757d;
}
</style>
```

## Custom Toolbar

Creating feature-rich custom toolbars:

```vue
<template>
  <Monaco
    ref="monacoRef"
    language="javascript"
    :value="code"
    :file-name="fileName"
    @change="handleChange"
    @ready="handleReady"
  >
    <template #toolbar>
      <div class="custom-toolbar">
        <div class="toolbar-left">
          <div class="file-info">
            <input
              v-model="fileName"
              class="file-name-input"
              @blur="updateFileName"
            />
            <span class="status" :class="{ modified: isModified }">
              {{ isModified ? '● Modified' : '● Saved' }}
            </span>
          </div>
        </div>

        <div class="toolbar-center">
          <select v-model="selectedLanguage" @change="changeLanguage" class="language-select">
            <option v-for="lang in languages" :key="lang" :value="lang">
              {{ lang.toUpperCase() }}
            </option>
          </select>
        </div>

        <div class="toolbar-right">
          <button @click="formatCode" class="btn" title="Format code">
            🎨 Format
          </button>
          <button @click="copyCode" class="btn" title="Copy code">
            📋 Copy
          </button>
          <button @click="pasteCode" class="btn" title="Paste code">
            📄 Paste
          </button>
          <button @click="saveCode" class="btn" title="Save code">
            💾 Save
          </button>
          <button @click="runCode" class="btn primary" title="Run code">
            ▶️ Run
          </button>
        </div>
      </div>
    </template>
  </Monaco>

  <!-- Output panel -->
  <div v-if="output" class="output-panel">
    <div class="output-header">
      <h4>Output Result</h4>
      <button @click="clearOutput" class="btn-clear">Clear</button>
    </div>
    <pre class="output-content">{{ output }}</pre>
  </div>

  <!-- Save status notification -->
  <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
    {{ saveStatus.message }}
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Monaco } from 'vue-shiki-monaco'

const monacoRef = ref()
const fileName = ref('example.js')
const selectedLanguage = ref('javascript')
const isModified = ref(false)
const output = ref('')
const saveStatus = ref(null)

const languages = ['javascript', 'typescript', 'python', 'html', 'css', 'json']

const code = ref(`// Feature-rich code editor
class CodeEditor {
  constructor(config) {
    this.config = config;
    this.features = [
      'Smart syntax highlighting',
      'Code auto-completion',
      'Real-time error detection',
      'Multi-theme support',
      'Custom context menu',
      'Powerful clipboard functionality'
    ];
  }

  execute() {
    console.log('Editor features:');
    this.features.forEach((feature, index) => {
      console.log(\`\${index + 1}. \${feature}\`);
    });
    return 'Code editor ready!';
  }

  // Format code
  format() {
    return 'Code formatted';
  }

  // Save code
  save() {
    return 'Code saved';
  }
}

// Create editor instance
const editor = new CodeEditor({
  language: 'javascript',
  theme: 'vitesse-light'
});

// Execute code
const result = editor.execute();
console.log(result);`)

const originalCode = ref(code.value)

const handleChange = (newValue) => {
  code.value = newValue
  isModified.value = newValue !== originalCode.value
}

const handleReady = (editor) => {
  console.log('Editor ready:', editor)
}

const updateFileName = () => {
  if (!fileName.value.trim()) {
    fileName.value = 'untitled'
  }
}

const changeLanguage = () => {
  if (monacoRef.value) {
    monacoRef.value.setLanguage(selectedLanguage.value)
  }
}

const formatCode = () => {
  if (monacoRef.value) {
    monacoRef.value.formatCode()
    showStatus('Code formatted', 'success')
  }
}

const copyCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.copyCode()
    showStatus('Code copied to clipboard', 'success')
  }
}

const pasteCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.pasteCode()
    showStatus('Content pasted from clipboard', 'success')
  }
}

const saveCode = () => {
  // Simulate save operation
  setTimeout(() => {
    isModified.value = false
    originalCode.value = code.value
    showStatus('Code saved', 'success')
  }, 500)
}

const runCode = () => {
  try {
    // Simple code execution example (real projects need safer methods)
    const logs = []
    const originalLog = console.log
    console.log = (...args) => {
      logs.push(args.join(' '))
    }

    // Execute code
    eval(code.value)

    // Restore console.log
    console.log = originalLog

    output.value = logs.length > 0 ? logs.join('\\n') : 'Code executed successfully, no output'
    showStatus('Code executed successfully', 'success')
  } catch (error) {
    output.value = `Error: ${error.message}`
    showStatus('Code execution failed', 'error')
  }
}

const clearOutput = () => {
  output.value = ''
}

const showStatus = (message, type) => {
  saveStatus.value = { message, type }
  setTimeout(() => {
    saveStatus.value = null
  }, 3000)
}

// Listen for file name changes, automatically set language
watch(fileName, (newName) => {
  const ext = newName.split('.').pop()
  const langMap = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    html: 'html',
    css: 'css',
    json: 'json'
  }

  if (langMap[ext] && langMap[ext] !== selectedLanguage.value) {
    selectedLanguage.value = langMap[ext]
    changeLanguage()
  }
})
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
  gap: 1rem;
}

.toolbar-left {
  flex: 1;
}

.toolbar-center {
  flex: 0 0 auto;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
  flex: 0 0 auto;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-name-input {
  border: none;
  background: transparent;
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.file-name-input:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 2px #007bff;
}

.status {
  font-size: 0.875rem;
  color: #28a745;
  font-weight: 500;
}

.status.modified {
  color: #ffc107;
}

.language-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
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
  white-space: nowrap;
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
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.output-header h4 {
  margin: 0;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-clear {
  padding: 0.25rem 0.5rem;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background: white;
  color: #dc3545;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #dc3545;
  color: white;
}

.output-content {
  margin: 0;
  padding: 1rem;
  background: white;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #495057;
  overflow-x: auto;
  white-space: pre-wrap;
}

.save-status {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.save-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.save-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .custom-toolbar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toolbar-right {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
```

## Responsive Design

Adapting to different screen sizes:

```vue
<template>
  <div class="responsive-editor">
    <div class="editor-controls" v-if="!isMobile">
      <button @click="toggleSettings" class="settings-btn">
        ⚙️ Settings
      </button>
    </div>

    <!-- Settings panel -->
    <div v-if="showSettings" class="settings-panel">
      <h4>Editor Settings</h4>
      <div class="setting-group">
        <label>
          <input type="checkbox" v-model="settings.minimap" @change="updateSettings" />
          Show Code Map
        </label>
        <label>
          <input type="checkbox" v-model="settings.lineNumbers" @change="updateSettings" />
          Show Line Numbers
        </label>
        <label>
          <input type="checkbox" v-model="settings.wordWrap" @change="updateSettings" />
          Word Wrap
        </label>
      </div>
    </div>

    <Monaco
      ref="monacoRef"
      language="javascript"
      :value="code"
      :height="editorHeight"
      :show-toolbar="!isMobile"
      @change="handleChange"
      @ready="handleReady"
    />

    <!-- Mobile toolbar -->
    <div v-if="isMobile" class="mobile-toolbar">
      <button @click="formatCode" class="mobile-btn">🎨</button>
      <button @click="copyCode" class="mobile-btn">📋</button>
      <button @click="runCode" class="mobile-btn">▶️</button>
      <button @click="toggleSettings" class="mobile-btn">⚙️</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Monaco } from 'vue-shiki-monaco'

const monacoRef = ref()
const editorHeight = ref('400px')
const showSettings = ref(false)
const windowWidth = ref(window.innerWidth)

const settings = ref({
  minimap: true,
  lineNumbers: true,
  wordWrap: false
})

const isMobile = computed(() => windowWidth.value < 768)

const code = ref(`// Responsive editor example
class ResponsiveEditor {
  constructor() {
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    };

    this.init();
  }

  init() {
    this.setupResponsiveLayout();
    this.bindEvents();
  }

  setupResponsiveLayout() {
    const screenType = this.getScreenType();

    switch (screenType) {
      case 'mobile':
        this.enableMobileMode();
        break;
      case 'tablet':
        this.enableTabletMode();
        break;
      case 'desktop':
        this.enableDesktopMode();
        break;
    }
  }

  getScreenType() {
    const width = window.innerWidth;

    if (width < this.breakpoints.mobile) {
      return 'mobile';
    } else if (width < this.breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  enableMobileMode() {
    console.log('Enable mobile mode');
    // Hide toolbar, use bottom buttons
    // Adjust editor height
    // Enable touch-friendly interactions
  }

  enableTabletMode() {
    console.log('Enable tablet mode');
    // Adjust toolbar layout
    // Optimize touch interactions
  }

  enableDesktopMode() {
    console.log('Enable desktop mode');
    // Show full toolbar
    // Enable keyboard shortcuts
    // Show sidebar
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.setupResponsiveLayout();
    });
  }
}

const editor = new ResponsiveEditor();`)

const updateEditorHeight = () => {
  const vh = window.innerHeight
  const isMobileDevice = windowWidth.value < 768
  const isTablet = windowWidth.value >= 768 && windowWidth.value < 1024

  if (isMobileDevice) {
    // Mobile: use more vertical space, consider virtual keyboard
    editorHeight.value = Math.min(vh * 0.5, 400) + 'px'
  } else if (isTablet) {
    // Tablet: medium height
    editorHeight.value = Math.min(vh * 0.6, 500) + 'px'
  } else {
    // Desktop: large size
    editorHeight.value = Math.min(vh * 0.7, 600) + 'px'
  }
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
  updateEditorHeight()
}

const handleChange = (newValue) => {
  console.log('Code updated:', newValue)
}

const handleReady = (editor) => {
  updateSettings()
}

const updateSettings = () => {
  if (monacoRef.value) {
    const editor = monacoRef.value.getEditor()
    if (editor) {
      editor.updateOptions({
        minimap: { enabled: settings.value.minimap },
        lineNumbers: settings.value.lineNumbers ? 'on' : 'off',
        wordWrap: settings.value.wordWrap ? 'on' : 'off'
      })
    }
  }
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const formatCode = () => {
  monacoRef.value?.formatCode()
}

const copyCode = () => {
  monacoRef.value?.copyCode()
}

const runCode = () => {
  console.log('Run code:', monacoRef.value?.getValue())
}

onMounted(() => {
  updateEditorHeight()
  window.addEventListener('resize', updateWindowWidth)

  // Listen for screen orientation changes (mobile)
  if (screen.orientation) {
    screen.orientation.addEventListener('change', updateEditorHeight)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)

  if (screen.orientation) {
    screen.orientation.removeEventListener('change', updateEditorHeight)
  }
})
</script>

<style scoped>
.responsive-editor {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
}

.editor-controls {
  margin-bottom: 1rem;
  text-align: right;
}

.settings-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.settings-btn:hover {
  background: #f5f5f5;
}

.settings-panel {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.settings-panel h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 0.875rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.setting-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.mobile-toolbar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 6px 6px;
}

.mobile-btn {
  width: 48px;
  height: 48px;
  border: 1px solid #dee2e6;
  border-radius: 50%;
  background: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-btn:hover {
  background: #e9ecef;
  transform: scale(1.05);
}

.mobile-btn:active {
  transform: scale(0.95);
}

/* Responsive styles */
@media (max-width: 768px) {
  .responsive-editor {
    padding: 0.5rem;
  }

  .settings-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 280px;
    max-width: 90vw;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .responsive-editor {
    padding: 1rem;
  }
}

@media (min-width: 1025px) {
  .responsive-editor {
    max-width: 1200px;
    padding: 1rem;
  }
}

/* High resolution screen optimization */
@media (min-width: 1400px) {
  .responsive-editor {
    max-width: 1400px;
  }
}

/* Landscape mobile devices */
@media (max-width: 768px) and (orientation: landscape) {
  .mobile-toolbar {
    padding: 0.5rem;
  }

  .mobile-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}
</style>
```

These examples showcase various usage scenarios of the Monaco component, from basic usage to advanced features, helping developers quickly get started and maximize the component's potential.