<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import FolderTree from "../FolderTree/index.vue";
import Monaco from "../Monaco/index.vue";
import type { FolderItem, FolderTreeItem } from "../FolderTree/types";
import { BundledLanguage, BundledTheme } from "shiki";

// 直接定义类型，避免导入问题
interface TabInfo {
  name: string;
  path: string;
  content: string;
  modified: boolean;
}

interface FullEditorProps {
  theme?: BundledTheme;
  sidebarWidth?: number;
  monacoOptions?: Record<string, any>;
}

const props = withDefaults(defineProps<FullEditorProps>(), {
  theme: "vitesse-light",
  sidebarWidth: 250,
  monacoOptions: () => ({
    fontSize: 14,
    minimap: { enabled: true },
    wordWrap: "on",
    automaticLayout: true,
  }),
});

const emit = defineEmits<{
  "folder-open": [path: string];
  "file-open": [path: string, content: string];
  "file-save": [path: string, content: string];
  "file-change": [path: string, content: string];
}>();

// 响应式数据
const folderData = ref<FolderItem[]>([]);
const selectedFile = ref<string>("");
const openTabs = ref<TabInfo[]>([]);
const activeTab = ref<string>("");
const currentFileContent = ref<string | null>(null);
const sidebarWidth = ref(props.sidebarWidth);
const isResizing = ref(false);

// 计算属性
const themeClass = computed(() => {
  return props.theme.includes("dark") ? "theme-dark" : "theme-light";
});

const currentLanguage = computed(() => {
  if (!activeTab.value) return "javascript";
  const ext = activeTab.value.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, BundledLanguage> = {
    js: "javascript",
    ts: "typescript",
    vue: "vue",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    md: "markdown",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    sh: "shell",
    sql: "sql",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
  };
  return languageMap[ext || ""] || "javascript";
});

// 打开文件夹
const openFolder = async () => {
  try {
    // 使用文件系统API选择文件夹
    if ("showDirectoryPicker" in window) {
      const dirHandle = await (window as any).showDirectoryPicker();
      const folderStructure = await readDirectory(dirHandle);
      folderData.value = folderStructure;
      emit("folder-open", dirHandle.name);
    } else {
      // 降级方案：使用input元素
      const input = document.createElement("input");
      input.type = "file";
      input.webkitdirectory = true;
      input.multiple = true;
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          const structure = buildFolderStructure(Array.from(files));
          folderData.value = structure;
          emit("folder-open", "selected-folder");
        }
      };
      input.click();
    }
  } catch (error) {
    console.error("打开文件夹失败:", error);
  }
};

// 读取目录结构
const readDirectory = async (dirHandle: any): Promise<FolderItem[]> => {
  const entries: FolderItem[] = [];

  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === "file") {
      entries.push({
        name,
        path: handle.name,
        type: "file",
        handle,
      } as any);
    } else if (handle.kind === "directory") {
      const children = await readDirectory(handle);
      entries.push({
        name,
        path: handle.name,
        type: "directory",
        children,
        handle,
      } as any);
    }
  }

  return entries.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
};

// 构建文件夹结构（降级方案）
const buildFolderStructure = (files: File[]): FolderItem[] => {
  const root: Record<string, any> = {};

  files.forEach((file) => {
    const parts = file.webkitRelativePath.split("/");
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        if (index === parts.length - 1) {
          // 文件
          current[part] = {
            name: part,
            path: file.webkitRelativePath,
            type: "file",
            size: file.size,
            lastModified: new Date(file.lastModified),
            file,
          };
        } else {
          // 文件夹
          current[part] = {
            name: part,
            path: parts.slice(0, index + 1).join("/"),
            type: "directory",
            children: {},
          };
        }
      }
      if (index < parts.length - 1) {
        current = current[part].children;
      }
    });
  });

  const convertToArray = (obj: any): FolderItem[] => {
    return Object.values(obj)
      .map((item: any) => {
        if (item.type === "directory" && item.children) {
          return {
            ...item,
            children: convertToArray(item.children),
          };
        }
        return item;
      })
      .sort((a: any, b: any) => {
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  };

  return convertToArray(root);
};

// 处理文件点击
const handleFileClick = async (item: FolderTreeItem) => {
  if (item.type !== "file") return;

  selectedFile.value = item.path;

  // 检查是否已经打开
  const existingTab = openTabs.value.find(
    (tab: { path: string }) => tab.path === item.path
  );
  if (existingTab) {
    switchTab(item.path);
    return;
  }

  try {
    let content = "";

    if ((item as any).handle) {
      // 使用文件系统API读取文件
      const file = await (item as any).handle.getFile();
      content = await file.text();
    } else if ((item as any).file) {
      // 降级方案：直接读取File对象
      content = await (item as any).file.text();
    }

    // 添加新标签页
    const newTab: TabInfo = {
      name: item.name,
      path: item.path,
      content,
      modified: false,
    };

    openTabs.value.push(newTab);
    activeTab.value = item.path;
    currentFileContent.value = content;

    emit("file-open", item.path, content);
  } catch (error) {
    console.error("读取文件失败:", error);
  }
};

// 处理文件夹点击
const handleFolderClick = (item: FolderTreeItem, isExpanded: boolean) => {
  // FolderTree组件内部会处理展开/收起
  console.log("文件夹点击:", item.name, "展开状态:", isExpanded);
};

// 处理FolderTree的刷新事件
const handleFolderTreeRefresh = () => {
  // 当FolderTree触发刷新时，重新读取文件夹但不重置展开状态
  refreshFolder();
};

// 切换标签页
const switchTab = (path: string) => {
  const tab = openTabs.value.find((t: { path: string }) => t.path === path);
  if (tab) {
    activeTab.value = path;
    currentFileContent.value = tab.content;
    selectedFile.value = path;
  }
};

// 关闭标签页
const closeTab = (path: string) => {
  const index = openTabs.value.findIndex(
    (tab: { path: string }) => tab.path === path
  );
  if (index === -1) return;

  openTabs.value.splice(index, 1);

  if (activeTab.value === path) {
    if (openTabs.value.length > 0) {
      const newActiveIndex = Math.min(index, openTabs.value.length - 1);
      // @ts-ignore
      switchTab(openTabs.value[newActiveIndex].path);
    } else {
      activeTab.value = "";
      currentFileContent.value = null;
      selectedFile.value = "";
    }
  }
};

// 处理内容变化
const handleContentChange = (value: string) => {
  const tab = openTabs.value.find(
    (t: { path: string }) => t.path === activeTab.value
  );
  if (tab) {
    tab.content = value;
    tab.modified = true;
    currentFileContent.value = value;
    emit("file-change", activeTab.value, value);
  }
};

// 处理保存
const handleSave = () => {
  const tab = openTabs.value.find(
    (t: { path: string }) => t.path === activeTab.value
  );
  if (tab) {
    tab.modified = false;
    emit("file-save", activeTab.value, tab.content);
  }
};

// 刷新文件夹
const refreshFolder = () => {
  // 重新读取文件夹结构，但不重置展开状态
  if (folderData.value.length > 0) {
    // 如果已经有文件夹数据，重新读取但保持状态
    openFolder();
  }
};

// 调整侧边栏宽度
const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = sidebarWidth.value;

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(200, Math.min(600, startWidth + deltaX));
    sidebarWidth.value = newWidth;
  };

  const handleMouseUp = () => {
    isResizing.value = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

// 监听activeTab变化
watch(activeTab, (newTab) => {
  if (newTab) {
    selectedFile.value = newTab;
  }
});

onMounted(() => {
  // 初始化
});

onUnmounted(() => {
  // 清理
});
</script>

<template>
  <div class="full-editor" :class="themeClass">
    <!-- 左侧文件树区域 -->
    <div class="sidebar" :style="{ width: sidebarWidth + 'px' }">
      <div class="sidebar-header">
        <span class="title">文件资源管理器</span>
        <div class="actions">
          <button
            class="action-btn"
            @click="openFolder"
            title="打开文件夹"
            v-if="!folderData || folderData.length === 0"
          >
            📁
          </button>
          <button
            class="action-btn"
            @click="refreshFolder"
            title="刷新"
            v-if="folderData && folderData.length > 0"
          >
            🔄
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!folderData || folderData.length === 0" class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">📂</div>
          <p class="empty-text">尚未打开文件夹</p>
          <button class="open-folder-btn" @click="openFolder">
            打开文件夹
          </button>
        </div>
      </div>

      <!-- 文件树 -->
      <div v-else class="folder-tree-container">
        <FolderTree
          :folder-items="folderData"
          :theme="theme.includes('dark') ? 'dark' : 'light'"
          :expand-by-default="false"
          @file-select="handleFileClick"
          @folder-toggle="handleFolderClick"
          @refresh="handleFolderTreeRefresh"
        />
      </div>
    </div>

    <!-- 分割线 -->
    <div
      class="resizer"
      @mousedown="startResize"
      :class="{ resizing: isResizing }"
    ></div>

    <!-- 右侧编辑器区域 -->
    <div class="editor-area">
      <!-- 标签页 -->
      <div class="tabs" v-if="openTabs.length > 0">
        <div
          v-for="tab in openTabs"
          :key="tab.path"
          class="tab"
          :class="{ active: tab.path === activeTab }"
          @click="switchTab(tab.path)"
        >
          <span class="tab-name">{{ tab.name }}</span>
          <button
            class="tab-close"
            @click.stop="closeTab(tab.path)"
            v-if="openTabs.length > 1"
          >
            ×
          </button>
        </div>
      </div>

      <!-- 编辑器内容 -->
      <div class="editor-content">
        <!-- 欢迎页面 -->
        <div v-if="openTabs.length === 0" class="welcome-screen">
          <div class="welcome-content">
            <h2>欢迎使用编辑器</h2>
            <p>选择左侧文件开始编辑，或者打开一个文件夹</p>
            <button class="welcome-btn" @click="openFolder">打开文件夹</button>
          </div>
        </div>

        <!-- Monaco编辑器 -->
        <div v-else class="monaco-container">
          <Monaco
            v-if="currentFileContent !== null"
            :value="currentFileContent"
            :current-language="currentLanguage"
            :current-theme="theme"
            :show-toolbar="false"
            :height="'99%'"
            @change="handleContentChange"
          />
          <div v-else class="loading">加载中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
