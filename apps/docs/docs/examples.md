---
sidebar_position: 4
title: 使用示例
---

# 使用示例

## 基础用法

最简单的使用方式：

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
import Monaco from 'vue-shiki-monaco'

const code = ref(`console.log('Hello Monaco!')`)

const handleChange = (newValue) => {
  code.value = newValue
}
</script>
```

## 多语言支持

支持多种编程语言：

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
import Monaco from 'vue-shiki-monaco'

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
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>这是一个 HTML 示例</p>
</body>
</html>`,

  css: `/* 现代化样式 */
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

## 主题切换

支持浅色和深色主题：

```vue
<template>
  <div>
    <div class="theme-switcher">
      <button
        @click="toggleTheme"
        class="theme-btn"
        :class="{ dark: isDark }"
      >
        {{ isDark ? '🌙' : '☀️' }} {{ isDark ? '深色模式' : '浅色模式' }}
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
import Monaco from 'vue-shiki-monaco'

const isDark = ref(false)
const code = ref(`// 主题切换示例
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

## 自定义右键菜单

创建强大的自定义右键菜单：

```vue
<template>
  <div>
    <div class="menu-controls">
      <label>
        <input type="radio" v-model="menuType" value="minimal" />
        最小菜单
      </label>
      <label>
        <input type="radio" v-model="menuType" value="basic" />
        基础菜单
      </label>
      <label>
        <input type="radio" v-model="menuType" value="full" />
        完整菜单
      </label>
      <label>
        <input type="radio" v-model="menuType" value="custom" />
        自定义菜单
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
      <h4>操作日志</h4>
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
import Monaco from 'vue-shiki-monaco'

const menuType = ref('full')
const actionLog = ref([])

const code = ref(`// 右键菜单示例
function demonstrateContextMenu() {
  // 在编辑器中右键点击，体验不同的菜单配置：
  
  // 1. 最小菜单：只有复制、粘贴、全选
  // 2. 基础菜单：包含基本的编辑操作
  // 3. 完整菜单：所有功能齐全
  // 4. 自定义菜单：添加了特殊功能
  
  const features = [
    '智能复制粘贴',
    '多级降级策略',
    '自定义菜单项',
    '快捷键支持',
    '分隔符组织'
  ];
  
  console.log('右键菜单功能:', features);
  return '体验强大的右键菜单功能！';
}

// 选择文本后右键，或在空白处右键
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
        label: '🎨 美化代码',
        shortcut: 'Ctrl+Shift+B',
        action: () => logAction('美化代码')
      },
      {
        type: 'item',
        id: 'run-code',
        label: '▶️ 运行代码',
        shortcut: 'F5',
        action: () => logAction('运行代码')
      },
      {
        type: 'item',
        id: 'save-snippet',
        label: '💾 保存代码片段',
        shortcut: 'Ctrl+S',
        action: () => logAction('保存代码片段')
      },
      { type: 'separator' },
      {
        type: 'item',
        id: 'share',
        label: '📤 分享代码',
        action: () => logAction('分享代码')
      }
    ]
  }

  return baseConfig
})

const logAction = (action) => {
  const timestamp = new Date().toLocaleTimeString()
  actionLog.value.unshift(`[${timestamp}] ${action}`)
  
  // 保持日志长度
  if (actionLog.value.length > 10) {
    actionLog.value = actionLog.value.slice(0, 10)
  }
}

const handleChange = (newValue) => {
  // 代码变更处理
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

## 自定义工具栏

创建功能丰富的自定义工具栏：

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
              {{ isModified ? '● 已修改' : '● 已保存' }}
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
          <button @click="formatCode" class="btn" title="格式化代码">
            🎨 格式化
          </button>
          <button @click="copyCode" class="btn" title="复制代码">
            📋 复制
          </button>
          <button @click="pasteCode" class="btn" title="粘贴代码">
            📄 粘贴
          </button>
          <button @click="saveCode" class="btn" title="保存代码">
            💾 保存
          </button>
          <button @click="runCode" class="btn primary" title="运行代码">
            ▶️ 运行
          </button>
        </div>
      </div>
    </template>
  </Monaco>

  <!-- 输出面板 -->
  <div v-if="output" class="output-panel">
    <div class="output-header">
      <h4>输出结果</h4>
      <button @click="clearOutput" class="btn-clear">清除</button>
    </div>
    <pre class="output-content">{{ output }}</pre>
  </div>

  <!-- 保存状态提示 -->
  <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
    {{ saveStatus.message }}
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Monaco from 'vue-shiki-monaco'

const monacoRef = ref()
const fileName = ref('example.js')
const selectedLanguage = ref('javascript')
const isModified = ref(false)
const output = ref('')
const saveStatus = ref(null)

const languages = ['javascript', 'typescript', 'python', 'html', 'css', 'json']

const code = ref(`// 功能丰富的代码编辑器
class CodeEditor {
  constructor(config) {
    this.config = config;
    this.features = [
      '智能语法高亮',
      '代码自动补全',
      '错误实时检测',
      '多主题支持',
      '自定义右键菜单',
      '强大的剪贴板功能'
    ];
  }

  execute() {
    console.log('编辑器功能:');
    this.features.forEach((feature, index) => {
      console.log(\`\${index + 1}. \${feature}\`);
    });
    return '代码编辑器就绪！';
  }

  // 格式化代码
  format() {
    return '代码已格式化';
  }

  // 保存代码
  save() {
    return '代码已保存';
  }
}

// 创建编辑器实例
const editor = new CodeEditor({
  language: 'javascript',
  theme: 'vitesse-light'
});

// 执行代码
const result = editor.execute();
console.log(result);`)

const originalCode = ref(code.value)

const handleChange = (newValue) => {
  code.value = newValue
  isModified.value = newValue !== originalCode.value
}

const handleReady = (editor) => {
  console.log('编辑器已准备就绪:', editor)
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
    showStatus('代码已格式化', 'success')
  }
}

const copyCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.copyCode()
    showStatus('代码已复制到剪贴板', 'success')
  }
}

const pasteCode = async () => {
  if (monacoRef.value) {
    await monacoRef.value.pasteCode()
    showStatus('已从剪贴板粘贴内容', 'success')
  }
}

const saveCode = () => {
  // 模拟保存操作
  setTimeout(() => {
    isModified.value = false
    originalCode.value = code.value
    showStatus('代码已保存', 'success')
  }, 500)
}

const runCode = () => {
  try {
    // 简单的代码执行示例（实际项目中需要更安全的方式）
    const logs = []
    const originalLog = console.log
    console.log = (...args) => {
      logs.push(args.join(' '))
    }

    // 执行代码
    eval(code.value)

    // 恢复 console.log
    console.log = originalLog

    output.value = logs.length > 0 ? logs.join('\\n') : '代码执行完成，无输出'
    showStatus('代码执行成功', 'success')
  } catch (error) {
    output.value = `错误: ${error.message}`
    showStatus('代码执行失败', 'error')
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

// 监听文件名变化，自动设置语言
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

## 响应式设计

适配不同屏幕尺寸：

```vue
<template>
  <div class="responsive-editor">
    <div class="editor-controls" v-if="!isMobile">
      <button @click="toggleSettings" class="settings-btn">
        ⚙️ 设置
      </button>
    </div>

    <!-- 设置面板 -->
    <div v-if="showSettings" class="settings-panel">
      <h4>编辑器设置</h4>
      <div class="setting-group">
        <label>
          <input type="checkbox" v-model="settings.minimap" @change="updateSettings" />
          显示代码地图
        </label>
        <label>
          <input type="checkbox" v-model="settings.lineNumbers" @change="updateSettings" />
          显示行号
        </label>
        <label>
          <input type="checkbox" v-model="settings.wordWrap" @change="updateSettings" />
          自动换行
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

    <!-- 移动端工具栏 -->
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
import Monaco from 'vue-shiki-monaco'

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

const code = ref(`// 响应式编辑器示例
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
    console.log('启用移动端模式');
    // 隐藏工具栏，使用底部按钮
    // 调整编辑器高度
    // 启用触摸友好的交互
  }

  enableTabletMode() {
    console.log('启用平板模式');
    // 调整工具栏布局
    // 优化触摸交互
  }

  enableDesktopMode() {
    console.log('启用桌面模式');
    // 显示完整工具栏
    // 启用键盘快捷键
    // 显示侧边栏
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
    // 移动端：占用更多垂直空间，考虑虚拟键盘
    editorHeight.value = Math.min(vh * 0.5, 400) + 'px'
  } else if (isTablet) {
    // 平板：中等高度
    editorHeight.value = Math.min(vh * 0.6, 500) + 'px'
  } else {
    // 桌面：大尺寸
    editorHeight.value = Math.min(vh * 0.7, 600) + 'px'
  }
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
  updateEditorHeight()
}

const handleChange = (newValue) => {
  console.log('代码更新:', newValue)
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
  console.log('运行代码:', monacoRef.value?.getValue())
}

onMounted(() => {
  updateEditorHeight()
  window.addEventListener('resize', updateWindowWidth)
  
  // 监听屏幕方向变化（移动端）
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

/* 响应式样式 */
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

/* 高分辨率屏幕优化 */
@media (min-width: 1400px) {
  .responsive-editor {
    max-width: 1400px;
  }
}

/* 横屏移动设备 */
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

## 高级功能演示

综合展示编辑器的高级功能：

```vue
<template>
  <div class="advanced-demo">
    <div class="demo-header">
      <h2>Monaco Editor 高级功能演示</h2>
      <div class="demo-controls">
        <button @click="resetDemo" class="btn">🔄 重置演示</button>
        <button @click="toggleFullscreen" class="btn">⛶ 全屏</button>
      </div>
    </div>

    <div class="demo-content" :class="{ fullscreen: isFullscreen }">
      <div class="demo-sidebar">
        <div class="feature-list">
          <h4>功能特性</h4>
          <div class="feature-item" v-for="feature in features" :key="feature.id">
            <label>
              <input 
                type="checkbox" 
                v-model="feature.enabled" 
                @change="toggleFeature(feature)"
              />
              {{ feature.name }}
            </label>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>

        <div class="stats">
          <h4>编辑器统计</h4>
          <div class="stat-item">
            <span>行数:</span>
            <span>{{ stats.lines }}</span>
          </div>
          <div class="stat-item">
            <span>字符数:</span>
            <span>{{ stats.characters }}</span>
          </div>
          <div class="stat-item">
            <span>选中:</span>
            <span>{{ stats.selection }}</span>
          </div>
        </div>
      </div>

      <div class="demo-editor">
        <Monaco
          ref="monacoRef"
          :current-language="currentLanguage"
          :current-theme="currentTheme"
          :value="demoCode"
          :height="editorHeight"
          :context-menu="contextMenuConfig"
          @change="handleCodeChange"
          @ready="handleEditorReady"
        >
          <template #toolbar>
            <div class="advanced-toolbar">
              <div class="toolbar-section">
                <select v-model="currentLanguage" @change="changeLanguage">
                  <option v-for="lang in languages" :key="lang" :value="lang">
                    {{ lang.toUpperCase() }}
                  </option>
                </select>
                <select v-model="currentTheme" @change="changeTheme">
                  <option v-for="theme in themes" :key="theme" :value="theme">
                    {{ formatThemeName(theme) }}
                  </option>
                </select>
              </div>

              <div class="toolbar-section">
                <button @click="insertSnippet" class="btn">📝 插入代码片段</button>
                <button @click="findAndReplace" class="btn">🔍 查找替换</button>
                <button @click="goToLine" class="btn">📍 跳转行</button>
              </div>

              <div class="toolbar-section">
                <button @click="saveSnapshot" class="btn">📸 保存快照</button>
                <button @click="loadSnapshot" class="btn" :disabled="!hasSnapshot">📁 恢复快照</button>
              </div>
            </div>
          </template>
        </Monaco>
      </div>
    </div>

    <!-- 演示结果 -->
    <div v-if="demoOutput" class="demo-output">
      <h4>演示输出</h4>
      <pre>{{ demoOutput }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import Monaco from 'vue-shiki-monaco'

const monacoRef = ref()
const isFullscreen = ref(false)
const hasSnapshot = ref(false)
const snapshot = ref('')
const demoOutput = ref('')

const currentLanguage = ref('javascript')
const currentTheme = ref('vitesse-light')

const languages = ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'vue']
const themes = ['vitesse-light', 'vitesse-dark', 'github-light', 'github-dark']

const features = reactive([
  {
    id: 'autocomplete',
    name: '智能补全',
    description: '提供智能的代码补全建议',
    enabled: true
  },
  {
    id: 'error-checking',
    name: '错误检查',
    description: '实时检查语法错误',
    enabled: true
  },
  {
    id: 'code-folding',
    name: '代码折叠',
    description: '折叠代码块以提高可读性',
    enabled: true
  },
  {
    id: 'bracket-matching',
    name: '括号匹配',
    description: '高亮显示匹配的括号',
    enabled: true
  },
  {
    id: 'word-highlight',
    name: '词汇高亮',
    description: '高亮相同的词汇',
    enabled: true
  }
])

const stats = reactive({
  lines: 0,
  characters: 0,
  selection: '无'
})

const contextMenuConfig = ref({
  enabled: true,
  items: 'full',
  customItems: [
    { type: 'separator' },
    {
      type: 'item',
      id: 'insert-comment',
      label: '💬 插入注释',
      action: () => insertComment()
    },
    {
      type: 'item',
      id: 'wrap-selection',
      label: '🎁 包装选择',
      action: () => wrapSelection()
    }
  ]
})

const editorHeight = computed(() => isFullscreen.value ? '80vh' : '500px')

const demoCode = ref(`// Monaco Editor 高级功能演示
class AdvancedDemo {
  constructor() {
    this.features = new Map();
    this.setupDemo();
  }

  setupDemo() {
    console.log('初始化高级功能演示...');
    
    // 演示智能补全
    this.demonstrateAutoComplete();
    
    // 演示语法高亮
    this.demonstrateSyntaxHighlighting();
    
    // 演示右键菜单
    this.demonstrateContextMenu();
  }

  demonstrateAutoComplete() {
    // 尝试输入 console. 来体验自动补全
    const suggestions = [
      'log', 'warn', 'error', 'info', 'debug'
    ];
    
    return suggestions;
  }

  demonstrateSyntaxHighlighting() {
    // 不同类型的语法元素
    const string = "这是字符串";
    const number = 42;
    const boolean = true;
    const array = [1, 2, 3, 4, 5];
    const object = { key: 'value' };
    
    return { string, number, boolean, array, object };
  }

  demonstrateContextMenu() {
    // 右键点击文本体验自定义菜单
    console.log('右键点击体验自定义菜单功能');
    return '体验复制、粘贴、查找替换等功能';
  }

  // 演示错误检查（故意的语法错误，可以尝试修复）
  demonstrateErrorChecking() {
    // 取消注释下面的行查看错误检查
    // console.log('missing semicolon')
    // undeclaredVariable = 'error';
    // return [1, 2, 3,]; // 尾随逗号
  }

  // 演示代码格式化
  demonstrateFormatting(){const unformatted={method:function(param){return param*2;}};return unformatted;}

  // 演示代码折叠
  demonstrateCodeFolding() {
    if (true) {
      if (true) {
        if (true) {
          console.log('深层嵌套的代码块');
          console.log('可以折叠以提高可读性');
          console.log('点击行号旁的折叠按钮试试');
        }
      }
    }
  }
}

// 创建演示实例
const demo = new AdvancedDemo();

// 体验以下功能：
// 1. 智能补全：输入 demo. 查看建议
// 2. 语法高亮：观察不同颜色的语法元素
// 3. 右键菜单：右键点击体验自定义菜单
// 4. 错误检查：取消注释错误代码查看检查结果
// 5. 代码格式化：选择 demonstrateFormatting 方法并格式化
// 6. 代码折叠：点击行号旁的箭头折叠代码块

console.log('高级功能演示准备就绪！');`)

const handleCodeChange = (newValue) => {
  updateStats(newValue)
}

const handleEditorReady = (editor) => {
  console.log('编辑器准备就绪')
  updateStats(demoCode.value)
  
  // 设置编辑器选项
  editor.updateOptions({
    fontSize: 14,
    lineHeight: 1.5,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: 'on'
  })

  // 监听选择变化
  editor.onDidChangeCursorSelection((e) => {
    const model = editor.getModel()
    if (model) {
      const selection = model.getValueInRange(e.selection)
      stats.selection = selection ? `${selection.length} 字符` : '无'
    }
  })
}

const updateStats = (code) => {
  stats.lines = code.split('\\n').length
  stats.characters = code.length
}

const changeLanguage = () => {
  if (monacoRef.value) {
    monacoRef.value.setLanguage(currentLanguage.value)
  }
}

const changeTheme = () => {
  if (monacoRef.value) {
    monacoRef.value.setTheme(currentTheme.value)
  }
}

const formatThemeName = (theme) => {
  return theme.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const toggleFeature = (feature) => {
  const editor = monacoRef.value?.getEditor()
  if (!editor) return

  switch (feature.id) {
    case 'autocomplete':
      editor.updateOptions({
        suggestOnTriggerCharacters: feature.enabled,
        quickSuggestions: feature.enabled
      })
      break
    case 'code-folding':
      editor.updateOptions({
        folding: feature.enabled
      })
      break
    case 'bracket-matching':
      editor.updateOptions({
        matchBrackets: feature.enabled ? 'always' : 'never'
      })
      break
    case 'word-highlight':
      editor.updateOptions({
        occurrencesHighlight: feature.enabled
      })
      break
  }

  demoOutput.value = `${feature.name} ${feature.enabled ? '已启用' : '已禁用'}`
  setTimeout(() => demoOutput.value = '', 2000)
}

const insertSnippet = () => {
  const editor = monacoRef.value?.getEditor()
  if (editor) {
    const position = editor.getPosition()
    const snippet = `
// 插入的代码片段
function newFunction() {
  console.log('这是插入的代码片段');
  return 'success';
}
`
    editor.executeEdits('insert-snippet', [{
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      },
      text: snippet
    }])
  }
}

const findAndReplace = () => {
  const editor = monacoRef.value?.getEditor()
  if (editor) {
    // 触发查找替换对话框
    editor.getAction('editor.action.startFindReplaceAction')?.run()
  }
}

const goToLine = () => {
  const editor = monacoRef.value?.getEditor()
  if (editor) {
    // 触发跳转到行对话框
    editor.getAction('editor.action.gotoLine')?.run()
  }
}

const saveSnapshot = () => {
  snapshot.value = monacoRef.value?.getValue() || ''
  hasSnapshot.value = true
  demoOutput.value = '代码快照已保存'
  setTimeout(() => demoOutput.value = '', 2000)
}

const loadSnapshot = () => {
  if (hasSnapshot.value && snapshot.value) {
    monacoRef.value?.setValue(snapshot.value)
    demoOutput.value = '代码快照已恢复'
    setTimeout(() => demoOutput.value = '', 2000)
  }
}

const insertComment = () => {
  const editor = monacoRef.value?.getEditor()
  if (editor) {
    const selection = editor.getSelection()
    const comment = '// 自定义注释\\n'
    editor.executeEdits('insert-comment', [{
      range: selection,
      text: comment
    }])
  }
}

const wrapSelection = () => {
  const editor = monacoRef.value?.getEditor()
  if (editor) {
    const selection = editor.getSelection()
    const selectedText = editor.getModel()?.getValueInRange(selection) || ''
    
    if (selectedText) {
      const wrappedText = \`console.log(\${selectedText});\`
      editor.executeEdits('wrap-selection', [{
        range: selection,
        text: wrappedText
      }])
    }
  }
}

const resetDemo = () => {
  monacoRef.value?.setValue(demoCode.value)
  features.forEach(feature => feature.enabled = true)
  demoOutput.value = '演示已重置'
  setTimeout(() => demoOutput.value = '', 2000)
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  nextTick(() => {
    monacoRef.value?.layout()
  })
}
</script>

<style scoped>
.advanced-demo {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.demo-header h2 {
  margin: 0;
  color: #495057;
}

.demo-controls {
  display: flex;
  gap: 0.5rem;
}

.demo-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.demo-content.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: white;
  padding: 1rem;
  grid-template-columns: 250px 1fr;
}

.demo-sidebar {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
}

.feature-list h4,
.stats h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.feature-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.feature-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.feature-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.feature-desc {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  line-height: 1.4;
}

.stats {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.stat-item span:first-child {
  color: #6c757d;
}

.stat-item span:last-child {
  font-weight: 500;
  color: #495057;
}

.demo-editor {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.advanced-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  gap: 1rem;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-section select {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

.toolbar-section .btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.toolbar-section .btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.toolbar-section .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-output {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.demo-output h4 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
}

.demo-output pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  color: #495057;
  white-space: pre-wrap;
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

@media (max-width: 1024px) {
  .demo-content {
    grid-template-columns: 1fr;
  }

  .demo-sidebar {
    order: 2;
  }

  .demo-editor {
    order: 1;
  }

  .advanced-toolbar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toolbar-section {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
```

## 直接使用 useMonacoEdit Hook

对于需要更精细控制的场景，可以直接使用底层的 `useMonacoEdit` hook：

```vue
<template>
  <div>
    <div class="controls">
      <button @click="initEditor" :disabled="editorInitialized">
        初始化编辑器
      </button>
      <button @click="destroyEditor" :disabled="!editorInitialized">
        销毁编辑器
      </button>
      <button @click="getValue" :disabled="!editorInitialized">
        获取内容
      </button>
      <button @click="addCustomMenu" :disabled="!editorInitialized">
        添加自定义菜单
      </button>
    </div>

    <div ref="editorContainer" class="editor-container"></div>

    <div v-if="currentValue" class="output">
      <h4>当前编辑器内容：</h4>
      <pre>{{ currentValue }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMonacoEdit } from 'vue-shiki-monaco'

const editorContainer = ref()
const editorInitialized = ref(false)
const currentValue = ref('')

let monacoEditHook = null
let editorInstance = null

const initEditor = async () => {
  if (!editorContainer.value || editorInitialized.value) return

  try {
    // 使用 useMonacoEdit hook
    monacoEditHook = useMonacoEdit({
      target: editorContainer.value,
      languages: ['javascript', 'typescript', 'python'],
      themes: ['vitesse-light', 'vitesse-dark', 'github-light'],
      codeValue: `// 使用 useMonacoEdit Hook 直接控制编辑器
function customEditorDemo() {
  console.log('这是一个使用 hook 创建的编辑器');

  // 你可以在这里添加自定义逻辑
  const features = [
    '直接控制编辑器实例',
    '自定义初始化逻辑', 
    '精细的生命周期管理',
    '灵活的配置选项',
    '自定义右键菜单',
    '完整的剪贴板功能'
  ];

  return features;
}

const editor = customEditorDemo();
console.log('编辑器特性:', editor);

// 尝试右键点击体验自定义菜单
// 或使用 Ctrl+C、Ctrl+V 体验剪贴板功能`,
      defaultTheme: 'vitesse-light',
      defaultLanguage: 'javascript',
      contextMenu: {
        enabled: true,
        items: 'basic',
        customItems: [
          { type: 'separator' },
          {
            type: 'item',
            id: 'log-selection',
            label: '🔍 输出选中内容',
            action: () => {
              const selection = editorInstance.getSelection()
              const selectedText = editorInstance.getModel()?.getValueInRange(selection)
              if (selectedText) {
                console.log('选中内容:', selectedText)
                currentValue.value = selectedText
              }
            }
          }
        ]
      }
    })

    // 初始化编辑器
    editorInstance = await monacoEditHook.initMonacoEdit()
    editorInitialized.value = true

    // 监听内容变化
    editorInstance.onDidChangeModelContent(() => {
      currentValue.value = editorInstance.getValue()
    })

    // 设置自定义右键菜单回调
    monacoEditHook.onContextMenu((event) => {
      console.log('右键菜单事件:', event)
    })

    // 启用自动调整大小
    monacoEditHook.enableAutoResize()

    console.log('编辑器初始化成功:', editorInstance)
  } catch (error) {
    console.error('编辑器初始化失败:', error)
  }
}

const destroyEditor = () => {
  if (monacoEditHook && editorInitialized.value) {
    monacoEditHook.destroy()
    editorInstance = null
    editorInitialized.value = false
    currentValue.value = ''
    console.log('编辑器已销毁')
  }
}

const getValue = () => {
  if (editorInstance) {
    currentValue.value = editorInstance.getValue()
  }
}

const addCustomMenu = () => {
  if (!editorInstance) return
  
  // 动态添加自定义菜单功能
  monacoEditHook.onContextMenu((event) => {
    console.log('自定义右键菜单处理:', event)
    // 这里可以实现更复杂的菜单逻辑
  })
}

// 组件卸载时清理
onUnmounted(() => {
  destroyEditor()
})
</script>

<style scoped>
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.controls button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-container {
  height: 400px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.output {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.output h4 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 1rem;
}

.output pre {
  margin: 0;
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
```

这个示例展示了如何直接使用 `useMonacoEdit` hook 来获得对编辑器更精细的控制，包括：

- 手动初始化和销毁编辑器
- 直接访问 Monaco Editor 实例
- 自定义编辑器配置
- 生命周期管理
- 自定义右键菜单处理
- 剪贴板功能集成

这些示例展示了 Monaco 组件的各种使用场景，从基础用法到高级功能，帮助开发者快速上手并发挥组件的最大潜力。