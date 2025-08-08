<template>
  <div class="demo-container">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <label>主题:</label>
        <select v-model="currentTheme" @change="updateTheme">
          <option value="vitesse-light">Vitesse Light</option>
          <option value="vitesse-dark">Vitesse Dark</option>
          <option value="github-light">GitHub Light</option>
          <option value="github-dark">GitHub Dark</option>
          <option value="dracula">Dracula</option>
          <option value="ayu-dark">Ayu Dark</option>
          <option value="catppuccin-mocha">Catppuccin Mocha</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>侧边栏宽度:</label>
        <input 
          type="range" 
          v-model="sidebarWidth" 
          min="200" 
          max="500" 
          step="10"
        />
        <span>{{ sidebarWidth }}px</span>
      </div>
      
      <div class="control-group">
        <button @click="clearLogs" class="clear-btn">清空日志</button>
      </div>
    </div>

    <!-- 编辑器 -->
    <div class="editor-wrapper">
      <FullEditor
        :theme="currentTheme"
        :sidebar-width="sidebarWidth"
        @folder-open="handleFolderOpen"
        @file-open="handleFileOpen"
        @file-save="handleFileSave"
        @file-change="handleFileChange"
      />
    </div>
    
    <!-- 事件日志 -->
    <div class="logs-panel" v-if="logs.length > 0">
      <div class="logs-header">
        <h3>事件日志</h3>
        <button @click="clearLogs" class="clear-btn">清空</button>
      </div>
      <div class="logs-content">
        <div 
          v-for="(log, index) in logs" 
          :key="index" 
          class="log-item"
          :class="log.type"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
          <span class="log-data">{{ log.data }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BundledTheme } from 'shiki'
import FullEditor from '../../components/FullEditor/index.vue'

// 响应式数据
const currentTheme = ref<BundledTheme>('vitesse-dark')
const sidebarWidth = ref(280)
const logs = ref<Array<{
  time: string
  event: string
  data: string
  type: string
}>>([])

// 添加日志
const addLog = (event: string, data: any, type: string = 'info') => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event,
    data: typeof data === 'string' ? data : JSON.stringify(data),
    type
  })
  
  // 只保留最近50条日志
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

// 清空日志
const clearLogs = () => {
  logs.value = []
}

// 更新主题
const updateTheme = () => {
  addLog('主题切换', currentTheme.value, 'theme')
}

// 事件处理器
const handleFolderOpen = (path: string) => {
  addLog('文件夹打开', path, 'folder')
}

const handleFileOpen = (path: string, content: string) => {
  addLog('文件打开', `${path} (${content.length} 字符)`, 'file')
}

const handleFileSave = (path: string, content: string) => {
  addLog('文件保存', `${path} (${content.length} 字符)`, 'save')
}

const handleFileChange = (path: string, content: string) => {
  addLog('文件修改', `${path} (${content.length} 字符)`, 'change')
}
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.control-panel {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  min-width: 60px;
}

.control-group select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
}

.control-group input[type="range"] {
  width: 120px;
}

.control-group span {
  font-size: 12px;
  color: #666;
  min-width: 50px;
}

.clear-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
}

.clear-btn:hover {
  background: #f0f0f0;
}

.editor-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.logs-panel {
  max-height: 200px;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.logs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.logs-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.logs-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  border-bottom: 1px solid #eee;
  border-left: 3px solid transparent;
}

.log-item.folder {
  border-left-color: #007acc;
}

.log-item.file {
  border-left-color: #28a745;
}

.log-item.save {
  border-left-color: #ffc107;
}

.log-item.change {
  border-left-color: #17a2b8;
}

.log-item.theme {
  border-left-color: #6f42c1;
}

.log-time {
  color: #666;
  min-width: 80px;
}

.log-event {
  color: #0066cc;
  min-width: 80px;
  font-weight: 600;
}

.log-data {
  color: #333;
  flex: 1;
  word-break: break-all;
}
</style>