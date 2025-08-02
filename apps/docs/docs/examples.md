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
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

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

## 自定义工具栏

创建自定义的工具栏：

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
            {{ isModified ? '● 已修改' : '● 已保存' }}
          </span>
        </div>
        
        <div class="toolbar-right">
          <button @click="formatCode" class="btn" title="格式化代码">
            🎨 格式化
          </button>
          <button @click="copyCode" class="btn" title="复制代码">
            📋 复制
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
    <h4>输出结果：</h4>
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

const code = ref(`// 点击运行按钮执行代码
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算斐波那契数列前10项
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
    alert('代码已复制到剪贴板！')
  } catch (err) {
    console.error('复制失败:', err)
  }
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
    
    output.value = logs.join('\\n')
    isModified.value = false
    originalCode.value = code.value
  } catch (error) {
    output.value = `错误: ${error.message}`
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

## 响应式设计

适配不同屏幕尺寸：

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
const code = ref(`// 响应式编辑器示例
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
console.log('屏幕信息:', screenInfo);`)

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
  console.log('代码更新:', newValue)
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

## 实时协作示例

模拟实时协作编辑：

```vue
<template>
  <div class="collaboration-demo">
    <div class="users-panel">
      <h4>在线用户</h4>
      <div class="user-list">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="user-item"
          :style="{ borderColor: user.color }"
        >
          <div class="user-avatar" :style="{ backgroundColor: user.color }">
            {{ user.name.charAt(0) }}
          </div>
          <span>{{ user.name }}</span>
        </div>
      </div>
    </div>
    
    <Monaco 
      ref="monacoRef"
      language="javascript"
      :value="code"
      height="500px"
      @change="handleChange"
      @ready="handleReady"
    />
    
    <div class="activity-log">
      <h4>活动日志</h4>
      <div class="log-list">
        <div 
          v-for="(log, index) in activityLog" 
          :key="index"
          class="log-item"
        >
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="user" :style="{ color: log.user.color }">
            {{ log.user.name }}
          </span>
          <span class="action">{{ log.action }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

const monacoRef = ref()
const users = ref([
  { id: 1, name: '张三', color: '#007bff' },
  { id: 2, name: '李四', color: '#28a745' },
  { id: 3, name: '王五', color: '#ffc107' }
])

const activityLog = ref([])
const code = ref(`// 实时协作编辑器
class CollaborativeEditor {
  constructor() {
    this.users = new Map();
    this.changes = [];
    this.init();
  }
  
  init() {
    console.log('协作编辑器初始化完成');
    this.broadcastUserJoined('当前用户');
  }
  
  broadcastUserJoined(username) {
    console.log(\`用户 \${username} 加入了编辑会话\`);
  }
  
  handleTextChange(change) {
    // 处理文本变更
    this.changes.push({
      timestamp: Date.now(),
      change: change,
      user: 'current_user'
    });
    
    // 广播变更给其他用户
    this.broadcastChange(change);
  }
  
  broadcastChange(change) {
    console.log('广播变更:', change);
  }
}

const editor = new CollaborativeEditor();`)

const handleChange = (newValue) => {
  // 模拟其他用户的实时编辑
  const randomUser = users.value[Math.floor(Math.random() * users.value.length)]
  addActivityLog(\`编辑了代码\`, randomUser)
}

const handleReady = (editor) => {
  console.log('编辑器准备就绪')
  addActivityLog('加入了编辑会话', users.value[0])
}

const addActivityLog = (action, user) => {
  const timestamp = new Date().toLocaleTimeString()
  activityLog.value.unshift({
    timestamp,
    user,
    action
  })
  
  // 保持日志数量在合理范围内
  if (activityLog.value.length > 20) {
    activityLog.value = activityLog.value.slice(0, 20)
  }
}

// 模拟其他用户的活动
onMounted(() => {
  const activities = [
    '查看了代码',
    '添加了注释',
    '修复了bug', 
    '重构了函数',
    '更新了文档'
  ]
  
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% 概率触发活动
      const randomUser = users.value[Math.floor(Math.random() * users.value.length)]
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      addActivityLog(randomActivity, randomUser)
    }
  }, 3000)
})
</script>

<style scoped>
.collaboration-demo {
  display: grid;
  grid-template-columns: 200px 1fr 250px;
  gap: 1rem;
  height: 600px;
}

.users-panel, .activity-log {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  overflow-y: auto;
}

.users-panel h4, .activity-log h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.log-item {
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.75rem;
  line-height: 1.4;
}

.log-item:last-child {
  border-bottom: none;
}

.timestamp {
  color: #6c757d;
  display: block;
  margin-bottom: 0.25rem;
}

.user {
  font-weight: 600;
}

.action {
  color: #495057;
}

@media (max-width: 1024px) {
  .collaboration-demo {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: auto;
  }
  
  .users-panel, .activity-log {
    max-height: 200px;
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
import { useMonacoEdit } from '@vue-element-plus-x-shiki-monaco/core'

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
      languages: ['javascript', 'typescript'],
      themes: ['vitesse-light', 'vitesse-dark'],
      codeValue: `// 使用 useMonacoEdit Hook
function customEditor() {
  console.log('这是一个使用 hook 创建的编辑器');
  
  // 你可以在这里添加自定义逻辑
  const features = [
    '直接控制编辑器实例',
    '自定义初始化逻辑', 
    '精细的生命周期管理',
    '灵活的配置选项'
  ];
  
  return features;
}

const editor = customEditor();
console.log('编辑器特性:', editor);`,
      defaultTheme: 'vitesse-light',
      defaultLanguage: 'javascript'
    })
    
    // 初始化编辑器
    editorInstance = await monacoEditHook.initMonacoEdit()
    editorInitialized.value = true
    
    // 监听内容变化
    editorInstance.onDidChangeModelContent(() => {
      currentValue.value = editorInstance.getValue()
    })
    
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
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
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
}

.output pre {
  margin: 0;
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  font-size: 0.875rem;
  overflow-x: auto;
}
</style>
```

这个示例展示了如何直接使用 `useMonacoEdit` hook 来获得对编辑器更精细的控制，包括：

- 手动初始化和销毁编辑器
- 直接访问 Monaco Editor 实例
- 自定义编辑器配置
- 生命周期管理

这些示例展示了 Monaco 组件的各种使用场景，从基础用法到高级功能，帮助开发者快速上手并发挥组件的最大潜力。