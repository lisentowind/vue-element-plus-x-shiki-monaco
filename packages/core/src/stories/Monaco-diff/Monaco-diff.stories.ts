import type { Meta, StoryObj } from "@storybook/vue3";

import type MonacoDiffSource from "../../components/Monaco-Diff/index.vue";

import MonacoDiff from "./diff-edit.vue";

const meta: Meta<typeof MonacoDiffSource> = {
  title: "Example/MonacoDiff Editor",
  component: MonacoDiff,
  tags: ["autodocs"],
  argTypes: {
    currentLanguage: {
      control: { type: "select" },
      options: ["typescript"],
      description: "当前编程语言",
    },
    currentTheme: {
      control: { type: "select" },
      options: ["vitesse-light", "vitesse-dark", "github-dark", "github-light"],
      description: "当前Monaco编辑器主题",
    },
    languages: {
      control: { type: "object" },
      description: "编程语言",
    },
    themes: {
      control: { type: "object" },
      description: "所有可用的主题列表",
    },
    height: {
      control: { type: "text" },
      description: "编辑器高度",
    },
    showToolbar: {
      control: { type: "boolean" },
      description: "是否显示工具栏",
    },
    oldModel: {
      control: { type: "text" },
    },
    newModel: {
      control: { type: "text" },
    },
    diffViewType: {
      control: { type: "select" },
      options: ["inline", "multi", "default"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
# Monaco Editor 组件

一个简洁美观的Monaco编辑器组件，具有以下特点：

## ✨ 设计特色
- **简洁边框** - 1px灰色边框，8px圆角
- **清新工具栏** - 浅灰背景，包含文件名和操作按钮
- **微妙阴影** - 悬停时增强阴影效果
- **完全自定义** - 支持工具栏插槽

## 🛠️ 默认工具栏功能
- **文件信息** - 显示文件名和语言标签
- **复制代码** - 一键复制编辑器内容
- **格式化代码** - 自动格式化代码

## 📱 插槽支持
通过 \`toolbar\` 插槽可以完全自定义工具栏内容，或通过 \`showToolbar\` 控制是否显示。
        `,
      },
    },
  },
} satisfies Meta<typeof MonacoDiffSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentLanguage: "javascript",
    currentTheme: "vitesse-light",
    languages: ["typescript"],
    themes: ["vitesse-light", "vitesse-dark", "github-dark", "github-light"],
    height: "700px",
    showToolbar: true,
    diffViewType: "inline",
  },
  parameters: {
    docs: {
      description: {
        story: "默认配置的Monaco编辑器，包含工具栏和JavaScript代码示例",
      },
    },
  },
};
