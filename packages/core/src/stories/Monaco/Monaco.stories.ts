import type { Meta, StoryObj } from '@storybook/vue3';

import type MonacoSource from '../../components/Monaco/index.vue';
import Monaco from './index.vue';

const meta: Meta<typeof MonacoSource> = {
  title: 'Example/Monaco Editor',
  component: Monaco,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: { type: 'select' },
      options: ['javascript', 'typescript', 'python', 'html', 'css', 'json'],
      description: '编程语言',
    },
    theme: {
      control: { type: 'select' },
      options: ['vitesse-light', 'vitesse-dark'],
      description: 'Monaco编辑器主题',
    },
    height: {
      control: { type: 'text' },
      description: '编辑器高度',
    },
    showToolbar: {
      control: { type: 'boolean' },
      description: '是否显示工具栏',
    },
    value: {
      control: { type: 'text' },
      description: '编辑器内容',
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
} satisfies Meta<typeof MonacoSource>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    language: 'javascript',
    theme: 'vitesse-light',
    height: '700px',
    showToolbar: true,
    value: `// Monaco Editor 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算斐波那契数列
const result = fibonacci(10);
console.log(\`斐波那契数列第10项: \${result}\`);

// 异步函数示例
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}`,
  },
  parameters: {
    docs: {
      description: {
        story: '默认配置的Monaco编辑器，包含工具栏和JavaScript代码示例',
      },
    },
  },
};
