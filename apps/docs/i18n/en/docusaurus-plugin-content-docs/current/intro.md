---
sidebar_position: 1
title: Introduction
---

# Vue Shiki Monaco Editor Component

A modern Vue 3 code editor component built on Monaco Editor + Shiki, providing professional syntax highlighting and code editing experience.

## ✨ Key Features

### 🎨 **Beautiful Syntax Highlighting**
- Precise syntax highlighting based on Shiki
- Support for multiple built-in themes (Vitesse, GitHub, etc.)
- Clean editor styling design
- Fully responsive layout

### 🛠️ **Powerful Editing Features**
- **Multi-language Support** - JavaScript, TypeScript, Python, HTML, CSS, etc.
- **Smart Code Completion** - Powerful features based on Monaco Editor
- **Toolbar Customization** - Flexible slot system, supports custom toolbar
- **Quick Actions** - Built-in copy, format, and other practical functions
- **Smart Context Menu** - Independent context menus for editor and Minimap areas
- **Multiple Style Themes** - Glass effect and classic style context menus

### 🚀 **Development Experience**
- **Native TypeScript Support** - Complete type definitions
- **Vue 3 Composition API** - Modern development approach
- **Lightweight Integration** - Simple installation and configuration
- **Rich API** - Complete editor instance control

## 🏃 Quick Start

### Installation

```bash
npm install vue-shiki-monaco
```

### Basic Usage

```vue
<template>
  <Monaco
    language="javascript"
    theme="vitesse-light"
    height="400px"
    :value="code"
    :context-menu="{ enabled: true, items: 'full', variant: 'glass' }"
    :minimap-context-menu="{ enabled: true, items: 'basic', variant: 'glass' }"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { Monaco } from 'vue-shiki-monaco'

const code = ref(`// Hello Monaco Editor with Shiki!
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`)

const handleChange = (newValue) => {
  console.log('Code updated:', newValue)
}
</script>
```

That's it! 🎉

## 🎯 Use Cases

### 📝 **Code Editor**
Add professional code editing functionality to your application with syntax highlighting, auto-completion, error detection, etc.

### 💻 **Online IDE**
Build browser-based development environments with complete code editing and debugging experience.

### 📚 **Documentation Display**
Display code examples in documentation websites with interactive features like copy and format.

### 🎓 **Educational Platform**
Provide interactive code editing and demonstration features for programming education platforms.

## 🌟 Why Choose This Component?

### 🔥 **Modern Tech Stack**
- Based on Vue 3 Composition API
- Developed with TypeScript
- Dual advantages of Monaco Editor + Shiki
- Zero dependency conflicts

### 🎨 **Exquisite Highlighting Effects**
- VSCode-level syntax highlighting provided by Shiki
- Support for multiple theme styles
- Precise code coloring
- Excellent visual experience

### 🛡️ **Stable and Reliable**
- Based on mature Monaco Editor core
- Complete error handling mechanism
- Detailed documentation and examples
- Continuous maintenance and updates

### 🚀 **Excellent Performance**
- On-demand loading of languages and themes
- Virtual scrolling supports large files
- Memory usage optimization
- Smooth editing experience

## 📊 Comparative Advantages

| Feature | This Component | Other Solutions |
|---------|----------------|----------------|
| Vue 3 Support | ✅ Native Support | ❌ Needs Adaptation |
| TypeScript | ✅ Complete Types | ⚠️ Partial Support |
| Syntax Highlighting | ✅ Shiki (VSCode Level) | ⚠️ Basic Highlighting |
| Toolbar Customization | ✅ Slot System | ❌ Complex Configuration |
| Theme System | ✅ Multiple Built-in Themes | ⚠️ Style Overrides |
| Documentation Quality | ✅ Detailed and Complete | ⚠️ Missing Documentation |

## 🎪 Online Demo

Want to experience it yourself? Check out our [Storybook Demo](http://localhost:6006) to explore all features!

- 🔗 **Basic Editor** - Clean code editing experience
- 🎨 **Theme Switching** - Multiple beautiful theme options
- 🌈 **Multi-language Highlighting** - Various programming language support
- 📱 **Responsive Design** - Adapts to various screen sizes

## 🚀 Next Steps

Ready to get started?

- 📖 **[Getting Started](./getting-started)** - 5-minute setup guide
- 🛠️ **[API Documentation](./api)** - Complete interface description
- 💡 **[Usage Examples](./examples)** - Rich practical cases

## 🤝 Community

Join our community for help and experience sharing:

- 🐛 [Report Issues](https://github.com/lisentowind/vue-shiki-monaco/issues)
- 💬 [Join Discussions](https://github.com/lisentowind/vue-shiki-monaco/discussions)
- 📝 [Contribute Code](https://github.com/lisentowind/vue-shiki-monaco/pulls)
- ⭐ [GitHub Repository](https://github.com/lisentowind/vue-shiki-monaco)

---

**Make code editing better!** ✨