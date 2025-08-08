import type { Meta, StoryObj } from "@storybook/vue3";
import FullEditor from "../../components/FullEditor/index.vue";
import DemoComponent from "./demo.vue";

const meta: Meta<typeof FullEditor> = {
  title: "Example/FullEditor/Advanced",
  component: FullEditor,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# FullEditor 高级演示

展示FullEditor组件的高级功能和使用场景。
                `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 完整演示
export const CompleteDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 完整功能演示

这个演示包含了：
- 主题切换控制
- 侧边栏宽度调整
- 实时事件日志
- 完整的文件操作流程

**使用说明：**
1. 使用顶部控制面板调整设置
2. 点击"打开文件夹"选择本地文件夹
3. 在文件树中点击文件进行编辑
4. 查看底部的事件日志了解组件行为
                `,
      },
    },
  },
  render: () => ({
    components: { DemoComponent },
    template: "<DemoComponent />",
  }),
};

// 事件监听演示
export const EventHandling: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 事件处理演示

展示如何监听和处理FullEditor的各种事件。
                `,
      },
    },
  },
  render: () => ({
    components: { FullEditor },
    setup() {
      const handleFolderOpen = (path: string) => {
        console.log("🚀 ~ handleFolderOpen ~ path:", path);
        // alert(`文件夹已打开: ${path}`)
      };

      const handleFileOpen = (path: string, content: string) => {
        console.log("文件打开事件:", { path, contentLength: content.length });
      };

      const handleFileSave = (path: string, content: string) => {
        console.log("文件保存事件:", { path, contentLength: content.length });
        // alert(`文件已保存: ${path}`)
      };

      const handleFileChange = (path: string, content: string) => {
        console.log("文件修改事件:", { path, contentLength: content.length });
      };

      return {
        handleFolderOpen,
        handleFileOpen,
        handleFileSave,
        handleFileChange,
      };
    },
    template: `
            <div style="height: 100vh;">
                <FullEditor
                    theme="vitesse-dark"
                    :sidebar-width="300"
                    @folder-open="handleFolderOpen"
                    @file-open="handleFileOpen"
                    @file-save="handleFileSave"
                    @file-change="handleFileChange"
                />
            </div>
        `,
  }),
};

// 自定义配置演示
export const CustomConfiguration: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 自定义配置演示

展示如何使用自定义配置来定制FullEditor的行为。
                `,
      },
    },
  },
  render: () => ({
    components: { FullEditor },
    setup() {
      const customMonacoOptions = {
        fontSize: 16,
        lineHeight: 24,
        minimap: { enabled: false },
        wordWrap: "on",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderWhitespace: "selection",
        cursorBlinking: "smooth",
      };

      return {
        customMonacoOptions,
      };
    },
    template: `
            <div style="height: 100vh;">
                <FullEditor
                    theme="github-light"
                    :sidebar-width="350"
                    :monaco-options="customMonacoOptions"
                />
            </div>
        `,
  }),
};
