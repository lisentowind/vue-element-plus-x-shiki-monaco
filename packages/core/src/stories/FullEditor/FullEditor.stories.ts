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
    sidebarWidth: {
      control: { type: "range", min: 200, max: 600, step: 10 },
      description: "侧边栏初始宽度",
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

// 亮色主题
export const LightTheme: Story = {
  args: {
    theme: "vitesse-light",
    sidebarWidth: 280,
  },
  parameters: {
    docs: {
      description: {
        story: "使用亮色主题的FullEditor组件。",
      },
    },
  },
};

// GitHub深色主题
export const GitHubDark: Story = {
  args: {
    theme: "github-dark",
    sidebarWidth: 300,
  },
  parameters: {
    docs: {
      description: {
        story: "使用GitHub深色主题，侧边栏稍宽一些。",
      },
    },
  },
};

// Dracula主题
export const DraculaTheme: Story = {
  args: {
    theme: "dracula",
    sidebarWidth: 250,
  },
  parameters: {
    docs: {
      description: {
        story: "使用流行的Dracula主题。",
      },
    },
  },
};

// 窄侧边栏
export const NarrowSidebar: Story = {
  args: {
    theme: "vitesse-dark",
    sidebarWidth: 200,
  },
  parameters: {
    docs: {
      description: {
        story: "使用最小侧边栏宽度的配置。",
      },
    },
  },
};

// 宽侧边栏
export const WideSidebar: Story = {
  args: {
    theme: "vitesse-dark",
    sidebarWidth: 400,
  },
  parameters: {
    docs: {
      description: {
        story: "使用较宽侧边栏的配置，适合显示更多文件信息。",
      },
    },
  },
};

// 交互式演示
export const Interactive: Story = {
  args: {
    theme: "vitesse-dark",
    sidebarWidth: 280,
  },
  parameters: {
    docs: {
      description: {
        story: `
### 交互式演示

这个故事展示了FullEditor的完整功能：

1. **打开文件夹**: 点击左上角的文件夹图标或欢迎页面的按钮
2. **文件操作**: 
   - 点击文件名打开文件
   - 支持多个文件同时打开
   - 使用标签页切换文件
3. **编辑功能**:
   - 完整的Monaco编辑器功能
   - 语法高亮
   - 代码补全
   - 查找替换等
4. **界面调整**:
   - 拖拽中间分割线调整侧边栏宽度
   - 响应式布局

### 事件监听

组件会触发以下事件：
- \`folder-open\`: 文件夹打开时
- \`file-open\`: 文件打开时  
- \`file-save\`: 文件保存时
- \`file-change\`: 文件内容变化时
        `,
      },
    },
  },
  render: (args) => ({
    components: { FullEditor },
    setup() {
      const handleFolderOpen = (path: string) => {
        console.log("文件夹打开:", path);
      };

      const handleFileOpen = (path: string, content: string) => {
        console.log("文件打开:", path, `(${content.length} 字符)`);
      };

      const handleFileSave = (path: string, content: string) => {
        console.log("文件保存:", path, `(${content.length} 字符)`);
      };

      const handleFileChange = (path: string, content: string) => {
        console.log("文件修改:", path, `(${content.length} 字符)`);
      };

      return {
        args,
        handleFolderOpen,
        handleFileOpen,
        handleFileSave,
        handleFileChange,
      };
    },
    template: `
      <div style="height: 100vh; width: 100vw;">
        <FullEditor 
          v-bind="args"
          @folder-open="handleFolderOpen"
          @file-open="handleFileOpen"
          @file-save="handleFileSave"
          @file-change="handleFileChange"
        />
      </div>
    `,
  }),
};
