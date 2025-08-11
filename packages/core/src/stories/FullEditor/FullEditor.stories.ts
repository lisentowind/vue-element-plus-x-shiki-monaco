import type { Meta, StoryObj } from "@storybook/vue3";
import FullEditor from "../../components/FullEditor/index.vue";

const meta: Meta<typeof FullEditor> = {
  title: "Example/FullEditor",
  component: FullEditor,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# FullEditor 组件

一个完整的代码编辑器组件，结合了文件树和Monaco编辑器，提供类似VSCode的编辑体验。

## 主要功能

- **文件树管理**: 左侧显示文件夹结构，支持展开/收起
- **多标签页编辑**: 支持同时打开多个文件进行编辑
- **Monaco编辑器**: 完整的代码编辑功能，支持语法高亮
- **文件操作**: 打开、编辑、保存文件，实时内容变化监听
- **界面交互**: 可调整侧边栏宽度，支持主题切换

## 使用方式

1. 点击"打开文件夹"按钮选择本地文件夹
2. 在左侧文件树中点击文件进行编辑
3. 支持多个文件同时打开，使用标签页切换
4. 拖拽调整左侧边栏宽度
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: [
        "vitesse-light",
        "vitesse-dark",
        "github-light",
        "github-dark",
        "dracula",
        "ayu-dark",
        "catppuccin-mocha",
      ],
      description: "编辑器主题",
    },
  },
  args: {
    theme: "vitesse-dark",
    sidebarWidth: 280,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 默认故事
export const Default: Story = {
  args: {
    theme: "vitesse-dark",
    sidebarWidth: 280,
  },
  parameters: {
    docs: {
      description: {
        story: '默认的FullEditor组件，使用深色主题。点击"打开文件夹"开始使用。',
      },
    },
  },
};
