# Vue Shiki Monaco Editor  组件

一个基于 Monaco Editor + Shiki 构建的现代化 Vue 3 代码编辑器组件，提供专业的语法高亮和代码编辑体验。

## ✨ 特性亮点

### 🎨 **美观的语法高亮**
- 基于 Shiki 的精准语法高亮
- 支持多种内置主题（Vitesse、GitHub 等）
- 清新的编辑器样式设计
- 完全响应式布局

### 🛠️ **强大的编辑功能**
- **多语言支持** - JavaScript、TypeScript、Python、HTML、CSS 等
- **智能代码补全** - 基于 Monaco Editor 的强大功能
- **工具栏定制** - 灵活的插槽系统，支持自定义工具栏
- **快捷操作** - 内置复制、格式化等实用功能

### 🚀 **开发体验**
- **TypeScript 原生支持** - 完整的类型定义
- **Vue 3 组合式API** - 现代化的开发方式
- **轻量级集成** - 简单的安装和配置
- **丰富的API** - 完整的编辑器实例控制

## 🏃 快速开始

### 安装

```bash
npm install vue-shiki-monaco
```

### 基础使用

```vue
<template>
  <Monaco
    language="javascript"
    theme="vitesse-light"
    height="400px"
    :value="code"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import Monaco from 'vue-shiki-monaco'

const code = ref(`// Hello Monaco Editor with Shiki!
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`)

const handleChange = (newValue) => {
  console.log('代码更新:', newValue)
}
</script>
```

就这么简单！🎉

## 🎯 使用场景

### 📝 **代码编辑器**
为你的应用添加专业的代码编辑功能，支持语法高亮、自动补全、错误检测等。

### 💻 **在线IDE**
构建基于浏览器的开发环境，提供完整的代码编辑和调试体验。

### 📚 **文档展示**
在文档网站中展示代码示例，支持复制、格式化等交互功能。

### 🎓 **教育平台**
为编程教学平台提供交互式的代码编辑和演示功能。

## 🌟 为什么选择这个组件？

### 🔥 **现代化技术栈**
- 基于 Vue 3 Composition API
- 使用 TypeScript 开发
- Monaco Editor + Shiki 双重优势
- 零依赖冲突

### 🎨 **精致的高亮效果**
- Shiki 提供的 VSCode 级别语法高亮
- 支持多种主题风格
- 精准的代码着色
- 优秀的视觉体验

### 🛡️ **稳定可靠**
- 基于成熟的 Monaco Editor 内核
- 完善的错误处理机制
- 详细的文档和示例
- 持续的维护更新

### 🚀 **性能优异**
- 按需加载语言和主题
- 虚拟滚动支持大文件
- 内存占用优化
- 流畅的编辑体验

## 📊 对比优势

| 特性 | 本组件 | 其他方案 |
|------|--------|----------|
| Vue 3 支持 | ✅ 原生支持 | ❌ 需要适配 |
| TypeScript | ✅ 完整类型 | ⚠️ 部分支持 |
| 语法高亮 | ✅ Shiki (VSCode级) | ⚠️ 基础高亮 |
| 工具栏定制 | ✅ 插槽系统 | ❌ 配置复杂 |
| 主题系统 | ✅ 多种内置主题 | ⚠️ 样式覆盖 |
| 文档质量 | ✅ 详细完整 | ⚠️ 文档缺失 |

## 🎪 在线演示

想要亲自体验？查看我们的 [Storybook 演示](http://localhost:6006) 来探索所有功能！

- 🔗 **基础编辑器** - 简洁的代码编辑体验
- 🎨 **主题切换** - 多种精美主题选择
- 🌈 **多语言高亮** - 各种编程语言支持
- 📱 **响应式设计** - 适配各种屏幕尺寸

## 🚀 下一步

准备开始了吗？

- 📖 **[快速开始](./getting-started)** - 5分钟上手指南
- 🛠️ **[API 文档](./api)** - 完整的接口说明
- 💡 **[使用示例](./examples)** - 丰富的实战案例

## 🤝 社区

加入我们的社区，获取帮助和分享经验：

- 🐛 [报告问题](https://github.com/lisentowind/vue-shiki-monaco/issues)
- 💬 [参与讨论](https://github.com/lisentowind/vue-shiki-monaco/discussions)
- 📝 [贡献代码](https://github.com/lisentowind/vue-shiki-monaco/pulls)
- ⭐ [GitHub 仓库](https://github.com/lisentowind/vue-shiki-monaco)

---

**让代码编辑变得更美好！** ✨
