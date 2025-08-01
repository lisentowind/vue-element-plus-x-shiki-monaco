---
sidebar_position: 1
title: Introduction
slug: /
---

# Shiki Monaco Editor Vue Component

A modern Vue 3 code editor component built with Monaco Editor + Shiki, providing professional syntax highlighting and code editing experience.

## ✨ Key Features

### 🎨 **Beautiful Syntax Highlighting**
- Precise syntax highlighting powered by Shiki
- Multiple built-in themes (Vitesse, GitHub, etc.)
- Clean editor styling design
- Fully responsive layout

### 🛠️ **Powerful Editing Features**
- **Multi-language Support** - JavaScript, TypeScript, Python, HTML, CSS, etc.
- **Smart Code Completion** - Powered by Monaco Editor's robust features
- **Toolbar Customization** - Flexible slot system for custom toolbars
- **Quick Actions** - Built-in copy, format and other useful functions

### 🚀 **Developer Experience**
- **Native TypeScript Support** - Complete type definitions
- **Vue 3 Composition API** - Modern development approach
- **Lightweight Integration** - Simple installation and configuration
- **Rich API** - Complete editor instance control

## 🏃 Quick Start

### Installation

```bash
npm install @vue-element-plus-x-shiki-monaco/core
```

### Basic Usage

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
import Monaco from '@vue-element-plus-x-shiki-monaco/core'

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
Add professional code editing functionality to your applications with syntax highlighting, auto-completion, error detection, and more.

### 💻 **Online IDE**
Build browser-based development environments providing complete code editing and debugging experiences.

### 📚 **Documentation Display**
Display code examples in documentation websites with interactive features like copy and format.

### 🎓 **Educational Platforms**
Provide interactive code editing and demonstration features for programming education platforms.

## 🌟 Why Choose This Component?

### 🔥 **Modern Tech Stack**
- Built with Vue 3 Composition API
- Developed using TypeScript
- Monaco Editor + Shiki dual advantages
- Zero dependency conflicts

### 🎨 **Exquisite Highlighting Effects**
- VSCode-level syntax highlighting powered by Shiki
- Support for multiple theme styles
- Precise code coloring
- Excellent visual experience

### 🛡️ **Stable and Reliable**
- Built on mature Monaco Editor core
- Comprehensive error handling mechanisms
- Detailed documentation and examples
- Continuous maintenance and updates

### 🚀 **Excellent Performance**
- On-demand loading of languages and themes
- Virtual scrolling for large files
- Optimized memory usage
- Smooth editing experience

## 📊 Comparison Advantages

| Feature | This Component | Other Solutions |
|---------|----------------|-----------------|
| Vue 3 Support | ✅ Native support | ❌ Requires adaptation |
| TypeScript | ✅ Complete types | ⚠️ Partial support |
| Syntax Highlighting | ✅ Shiki (VSCode-level) | ⚠️ Basic highlighting |
| Toolbar Customization | ✅ Slot system | ❌ Complex configuration |
| Theme System | ✅ Multiple built-in themes | ⚠️ Style overrides |
| Documentation Quality | ✅ Detailed and complete | ⚠️ Missing documentation |

## 🎪 Live Demo

Want to experience it yourself? Check out our [Storybook Demo](http://localhost:6006) to explore all features!

- 🔗 **Basic Editor** - Clean code editing experience
- 🎨 **Theme Switching** - Multiple beautiful theme choices
- 🌈 **Multi-language Highlighting** - Support for various programming languages
- 📱 **Responsive Design** - Adapts to all screen sizes

## 🚀 Next Steps

Ready to get started?

- 📖 **[Quick Start](./getting-started)** - 5-minute setup guide
- 🛠️ **[API Reference](./api)** - Complete interface documentation
- 💡 **[Usage Examples](./examples)** - Rich practical use cases

## 🤝 Community

Join our community to get help and share experiences:

- 🐛 [Report Issues](https://github.com/your-org/monaco-editor/issues)
- 💬 [Join Discussions](https://github.com/your-org/monaco-editor/discussions)
- 📝 [Contribute Code](https://github.com/your-org/monaco-editor/pulls)
- ⭐ [GitHub Repository](https://github.com/your-org/monaco-editor)

---

**Make code editing better!** ✨