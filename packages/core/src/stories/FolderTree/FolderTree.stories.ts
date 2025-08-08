import type { Meta, StoryObj } from "@storybook/vue3";
import Basic from "./index.vue";

const meta = {
  title: "Example/FolderTree",
  component: Basic,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "主题风格",
    },
    variant: {
      control: "select",
      options: ["vscode", "classic"],
      description: "组件变体",
    },
    width: {
      control: "text",
      description: "组件宽度",
    },
    height: {
      control: "text",
      description: "组件高度",
    },
    showHidden: {
      control: "boolean",
      description: "是否显示隐藏文件",
    },
    expandByDefault: {
      control: "boolean",
      description: "是否默认展开所有目录",
    },
  },
} as Meta<typeof Basic>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {};
