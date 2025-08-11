<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import FolderTree from "../FolderTree/index.vue";
import Monaco from "../Monaco/index.vue";
import type { FolderItem, FolderTreeItem } from "../FolderTree/types";
import type { BundledLanguage, BundledTheme } from "shiki";
import { useLazyFolder } from "../../hooks/useFolder";
import type { LazyFolderItem } from "../../hooks/useFolder/lazyFolder";
import "@assets/style/global.scss";

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

// 使用懒加载文件夹hook
const { folderData, readFolder, loadSubdirectory } = useLazyFolder();

// 响应式数据
const selectedFile = ref<string>("");
const openTabs = ref<TabInfo[]>([]);
const activeTab = ref<string>("");
const currentFileContent = ref<string | null>(null);
const sidebarWidth = ref(props.sidebarWidth);
const isResizing = ref(false);
const monacoRef = ref<any>(null); // Monaco编辑器实例引用

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
    // 使用懒加载hook读取文件夹
    await readFolder({
      initialDepth: 1, // 只加载第一层目录
      maxEntries: 10000, // 限制最大条目数，避免性能问题
      includeHidden: false, // 不包含隐藏文件
    });

    // 如果成功读取到文件夹，发出事件
    if (
      folderData.value &&
      folderData.value.length > 0 &&
      folderData.value[0]?.path
    ) {
      const pathParts = folderData.value[0].path.split("/");
      const folderName =
        pathParts.length > 0 ? pathParts[0] : "selected-folder";
      emit("folder-open", folderName ?? "未知文件夹");
    }
  } catch (error) {
    console.error("打开文件夹失败:", error);
  }
};

// 读取目录结构 - 这个函数已经不再使用，保留是为了兼容性
const readDirectory = async (
  dirHandle: any,
  parentPath = ""
): Promise<FolderItem[]> => {
  const entries: FolderItem[] = [];

  for await (const [name, handle] of dirHandle.entries()) {
    // 构建完整路径
    const path = parentPath ? `${parentPath}/${name}` : name;

    if (handle.kind === "file") {
      entries.push({
        name,
        path, // 使用完整路径
        type: "file",
        handle,
      } as any);
    } else if (handle.kind === "directory") {
      const children = await readDirectory(handle, path);
      entries.push({
        name,
        path, // 使用完整路径
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
// const buildFolderStructure = (files: File[]): FolderItem[] => {
//   const root: Record<string, any> = {};

//   files.forEach((file) => {
//     const parts = file.webkitRelativePath.split("/");
//     let current = root;

//     parts.forEach((part, index) => {
//       if (!current[part]) {
//         if (index === parts.length - 1) {
//           // 文件
//           current[part] = {
//             name: part,
//             path: file.webkitRelativePath,
//             type: "file",
//             size: file.size,
//             lastModified: new Date(file.lastModified),
//             file,
//           };
//         } else {
//           // 文件夹
//           current[part] = {
//             name: part,
//             path: parts.slice(0, index + 1).join("/"),
//             type: "directory",
//             children: {},
//           };
//         }
//       }
//       if (index < parts.length - 1) {
//         current = current[part].children;
//       }
//     });
//   });

//   const convertToArray = (obj: any): FolderItem[] => {
//     return Object.values(obj)
//       .map((item: any) => {
//         if (item.type === "directory" && item.children) {
//           return {
//             ...item,
//             children: convertToArray(item.children),
//           };
//         }
//         return item;
//       })
//       .sort((a: any, b: any) => {
//         if (a.type !== b.type) {
//           return a.type === "directory" ? -1 : 1;
//         }
//         return a.name.localeCompare(b.name);
//       });
//   };

//   return convertToArray(root);
// };

// 处理文件点击
const handleFileClick = async (item: FolderTreeItem) => {
  if (item.type !== "file") return;

  console.log("文件点击:", item.name, "路径:", item.path);
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
    let fileHandle = null;

    // 查找对应的懒加载文件项
    const lazyItem = findLazyFileItem(item.path);
    console.log("找到的懒加载文件项:", lazyItem?.path);

    if (lazyItem && lazyItem.handle) {
      // 使用懒加载项的文件句柄
      fileHandle = lazyItem.handle;
      console.log("使用懒加载项的文件句柄");
    } else if ((item as any).handle) {
      // 使用传入项的文件句柄
      fileHandle = (item as any).handle;
      console.log("使用传入项的文件句柄");
    }

    if (fileHandle) {
      // 使用文件系统API读取文件
      console.log("使用文件句柄读取文件:", item.path);
      const file = await fileHandle.getFile();
      content = await file.text();
    } else if ((item as any).file) {
      // 降级方案：直接读取File对象
      console.log("使用File对象读取文件:", item.path);
      content = await (item as any).file.text();
    } else {
      console.warn("无法获取文件内容，找不到文件句柄:", item.path);

      // 尝试通过名称查找文件
      console.log("尝试通过名称查找文件:", item.name);
      const fileByName = findFileByName(item.name);
      if (fileByName && fileByName.handle) {
        console.log("通过名称找到文件:", fileByName.path);
        const file = await fileByName.handle.getFile();
        content = await file.text();
      } else {
        console.error("无法找到文件:", item.name);
      }
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
    console.error("读取文件失败:", error, "文件路径:", item.path);
  }
};

// 通过名称查找文件
const findFileByName = (name: string): LazyFolderItem | undefined => {
  const findInItems = (
    items: LazyFolderItem[] | undefined
  ): LazyFolderItem | undefined => {
    if (!items) return undefined;

    for (const item of items) {
      if (item.type === "file" && item.name === name) {
        return item;
      }

      if (item.type === "directory" && item.children) {
        const found = findInItems(item.children as LazyFolderItem[]);
        if (found) return found;
      }
    }

    return undefined;
  };

  return folderData.value
    ? findInItems(folderData.value as LazyFolderItem[])
    : undefined;
};

// 根据路径查找懒加载文件项
const findLazyFileItem = (path: string): LazyFolderItem | undefined => {
  // 递归查找函数
  const findInItems = (
    items: LazyFolderItem[] | undefined,
    targetPath: string
  ): LazyFolderItem | undefined => {
    if (!items) return undefined;

    for (const item of items) {
      // 检查路径是否匹配
      if (item.path === targetPath) {
        console.log("找到匹配项:", item.path, item.type);
        return item;
      }

      // 检查名称是否匹配（作为备选方案）
      if (item.name === targetPath.split("/").pop()) {
        console.log("通过名称找到可能匹配项:", item.path, item.type);
      }

      // 递归检查子目录
      if (item.type === "directory" && item.children) {
        const found = findInItems(
          item.children as LazyFolderItem[],
          targetPath
        );
        if (found) return found;
      }
    }

    return undefined;
  };

  // 确保 folderData.value 存在
  if (!folderData.value) {
    console.warn("folderData 为空，无法查找文件:", path);
    return undefined;
  }

  console.log("开始查找文件:", path);
  const result = findInItems(folderData.value as LazyFolderItem[], path);

  if (!result) {
    console.warn("未找到文件:", path);
  }

  return result;
};

// 处理文件夹点击
const handleFolderClick = async (item: FolderTreeItem, isExpanded: boolean) => {
  console.log(
    "文件夹点击:",
    item.name,
    "路径:",
    item.path,
    "展开状态:",
    isExpanded
  );

  // 如果是展开操作，则尝试加载子目录
  if (isExpanded && item.type === "directory" && item.path) {
    try {
      // 查找对应的懒加载项
      const lazyItem = findLazyFolderItem(item.path);
      console.log("找到的懒加载项:", lazyItem?.path, lazyItem?.type);

      if (lazyItem) {
        // 使用懒加载hook加载子目录
        console.log("开始加载子目录:", lazyItem.path);
        const children = await loadSubdirectory(lazyItem);
        console.log("子目录加载完成，数量:", children.length);
      } else {
        console.warn("未找到对应的懒加载项，无法加载子目录:", item.path);
      }
    } catch (error) {
      console.error("加载子目录失败:", error);
    }
  }
};

// 根据路径查找懒加载文件夹项
const findLazyFolderItem = (path: string): LazyFolderItem | undefined => {
  // 递归查找函数
  const findInItems = (
    items: LazyFolderItem[] | undefined,
    targetPath: string
  ): LazyFolderItem | undefined => {
    if (!items) return undefined;

    for (const item of items) {
      // 检查路径是否匹配
      if (item.path === targetPath) {
        console.log("找到匹配的文件夹:", item.path, item.type);
        return item;
      }

      // 检查名称是否匹配（作为备选方案）
      const pathParts = targetPath.split("/");
      if (
        pathParts.length > 0 &&
        item.name === pathParts[pathParts.length - 1]
      ) {
        console.log("通过名称找到可能匹配的文件夹:", item.path, item.type);
      }

      // 递归检查子目录
      if (item.type === "directory" && item.children) {
        const found = findInItems(
          item.children as LazyFolderItem[],
          targetPath
        );
        if (found) return found;
      }
    }

    return undefined;
  };

  // 确保 folderData.value 存在
  if (!folderData.value) {
    console.warn("folderData 为空，无法查找文件夹:", path);
    return undefined;
  }

  console.log("开始查找文件夹:", path);
  const result = findInItems(folderData.value as LazyFolderItem[], path);

  if (!result) {
    console.warn("未找到文件夹:", path);

    // 尝试通过名称查找
    const pathParts = path.split("/");
    if (pathParts.length > 0) {
      const name = pathParts[pathParts.length - 1];
      console.log("尝试通过名称查找文件夹:", name);

      // 查找具有相同名称的文件夹
      const findByName = (
        items: LazyFolderItem[] | undefined
      ): LazyFolderItem | undefined => {
        if (!items) return undefined;

        for (const item of items) {
          if (item.type === "directory" && item.name === name) {
            console.log("通过名称找到文件夹:", item.path);
            return item;
          }

          if (item.type === "directory" && item.children) {
            const found = findByName(item.children as LazyFolderItem[]);
            if (found) return found;
          }
        }

        return undefined;
      };

      return findByName(folderData.value as LazyFolderItem[]);
    }
  }

  return result;
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

    // 确保Monaco编辑器使用当前主题，防止主题重置
    ensureMonacoTheme();
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
// const handleSave = () => {
//   const tab = openTabs.value.find(
//     (t: { path: string }) => t.path === activeTab.value
//   );
//   if (tab) {
//     tab.modified = false;
//     emit("file-save", activeTab.value, tab.content);
//   }
// };

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

// 确保Monaco编辑器使用正确的主题
const ensureMonacoTheme = async () => {
  // 等待DOM更新
  await nextTick();

  // 如果Monaco编辑器实例存在，设置主题
  if (monacoRef.value) {
    try {
      monacoRef.value.setTheme(props.theme);
    } catch (error) {
      console.error("设置Monaco主题失败:", error);
    }
  }
};

// 监听currentFileContent变化，确保主题正确
watch(currentFileContent, () => {
  if (currentFileContent.value !== null) {
    ensureMonacoTheme();
  }
});

// 监听主题变化，确保Monaco编辑器使用正确的主题
watch(
  () => props.theme,
  () => {
    ensureMonacoTheme();
  }
);

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
          :theme="(theme || '').includes('dark') ? 'dark' : 'light'"
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
            ref="monacoRef"
            :value="currentFileContent"
            :current-language="currentLanguage"
            :current-theme="theme || 'vitesse-light'"
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
