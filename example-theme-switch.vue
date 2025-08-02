<template>
  <div class="theme-switch-example">
    <div class="controls">
      <h3>Monaco Editor 主题切换示例</h3>
      <div class="theme-selector">
        <label>选择主题:</label>
        <select v-model="currentTheme" @change="handleThemeChange">
          <option v-for="theme in availableThemes" :key="theme" :value="theme">
            {{ theme }}
          </option>
        </select>
      </div>
    </div>
    
    <Monaco
      ref="editorRef"
      :theme="currentTheme"
      :language="'typescript'"
      :value="codeValue"
      :height="'500px'"
      @change="handleCodeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Monaco } from 'vue-element-plus-x-shiki-monaco'
import type { BundledTheme } from 'shiki'

const editorRef = ref()
const currentTheme = ref<BundledTheme>('vitesse-light')

// 常用主题列表
const availableThemes: BundledTheme[] = [
  'vitesse-light',
  'vitesse-dark',
  'github-light',
  'github-dark',
  'ayu-dark',
  'nord',
  'one-dark-pro',
  'material-theme-darker',
  'dracula',
  'solarized-light',
  'solarized-dark'
]

const codeValue = ref(`
interface User {
  id: number;
  name: string;
  email: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
}

class UserManager {
  private users: Map<number, User> = new Map();

  constructor() {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      const response = await fetch('/api/users');
      const users: User[] = await response.json();
      
      users.forEach(user => {
        this.users.set(user.id, user);
      });
      
      console.log(\`Loaded \${users.length} users\`);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  getUserById(id: number): User | undefined {
    return this.users.get(id);
  }

  updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): boolean {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }

    user.preferences = { ...user.preferences, ...preferences };
    this.users.set(userId, user);
    return true;
  }
}

export { UserManager, type User, type UserPreferences };
`)

const handleThemeChange = async () => {
  // 通过 ref 调用组件方法切换主题
  if (editorRef.value) {
    try {
      await editorRef.value.setTheme(currentTheme.value)
      console.log(`主题已切换到: ${currentTheme.value}`)
    } catch (error) {
      console.error('主题切换失败:', error)
    }
  }
}

const handleCodeChange = (value: string) => {
  codeValue.value = value
}
</script>

<style scoped>
.theme-switch-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.controls h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.theme-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-selector label {
  font-weight: 500;
  color: #666;
}

.theme-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  min-width: 180px;
}

.theme-selector select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>