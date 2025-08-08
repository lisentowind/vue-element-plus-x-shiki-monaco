<script lang="ts" setup>
import "@assets/style/global.scss";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import type { FolderTreeProps, FolderTreeItem } from "./types";

const props = withDefaults(defineProps<FolderTreeProps>(), {
  isLoading: false,
  error: null,
  theme: "light",
  width: "300px",
  height: "100%",
  showHidden: false,
  expandByDefault: true,
  variant: "vscode",
});

const emit = defineEmits<{
  fileSelect: [item: FolderTreeItem];
  folderToggle: [item: FolderTreeItem, isExpanded: boolean];
  refresh: [];
}>();

const treeContainer = ref<HTMLElement>();
const expandedItems = ref(new Set<string>());
const selectedItem = ref<string>("");

const isDarkTheme = computed(() => {
  return props.theme && props.theme.toLowerCase().includes("dark");
});

const treeClasses = computed(() => ({
  "folder-tree": true,
  "folder-tree--vscode": props.variant === "vscode",
  "folder-tree--classic": props.variant === "classic",
  "theme-light": !isDarkTheme.value,
  "theme-dark": isDarkTheme.value,
}));

const containerStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height,
}));

// 过滤隐藏文件
const filteredItems = computed(() => {
  if (!props.folderItems) return [];

  const filterItems = (items: any[]): any[] => {
    return items
      .filter((item) => props.showHidden || !item.name.startsWith("."))
      .map((item) => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined,
      }));
  };

  return filterItems(props.folderItems);
});

// 将嵌套结构扁平化并添加展开状态
const flattenedItems = computed(() => {
  if (!filteredItems.value) return [];

  const flatten = (items: any[], level = 0): FolderTreeItem[] => {
    const result: FolderTreeItem[] = [];

    for (const item of items) {
      const treeItem: FolderTreeItem = {
        ...item,
        isExpanded: expandedItems.value.has(item.path),
        level,
      };

      result.push(treeItem);

      if (
        item.type === "directory" &&
        item.children &&
        expandedItems.value.has(item.path)
      ) {
        result.push(...flatten(item.children, level + 1));
      }
    }

    return result;
  };

  return flatten(filteredItems.value);
});

// 初始化展开状态
const initializeExpandedState = () => {
  if (!props.expandByDefault || !filteredItems.value) return;

  const collectPaths = (items: any[]) => {
    for (const item of items) {
      if (item.type === "directory") {
        expandedItems.value.add(item.path);
        if (item.children) {
          collectPaths(item.children);
        }
      }
    }
  };

  collectPaths(filteredItems.value);
};

// 切换文件夹展开/收起状态
const toggleFolder = (item: FolderTreeItem) => {
  if (item.type !== "directory") return;

  if (expandedItems.value.has(item.path)) {
    expandedItems.value.delete(item.path);
    item.isExpanded = false;
  } else {
    expandedItems.value.add(item.path);
    item.isExpanded = true;
  }

  emit("folderToggle", item, item.isExpanded);
};

// 选择文件
const selectItem = (item: FolderTreeItem) => {
  if (item.type === "file") {
    selectedItem.value = item.path;
    emit("fileSelect", item);
  } else {
    toggleFolder(item);
  }
};

// 获取文件图标
const getFileIcon = (item: FolderTreeItem) => {
  if (item.type === "directory") {
    return item.isExpanded
      ? "vscode-icons:default-folder-opened"
      : "vscode-icons:default-folder";
  }

  const ext = item.name.split(".").pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    js: "vscode-icons:file-type-js",
    ts: "vscode-icons:file-type-typescript",
    vue: "vscode-icons:file-type-vue",
    jsx: "vscode-icons:file-type-reactjs",
    tsx: "vscode-icons:file-type-reactts",
    json: "vscode-icons:file-type-json",
    html: "vscode-icons:file-type-html",
    css: "vscode-icons:file-type-css",
    scss: "vscode-icons:file-type-sass",
    sass: "vscode-icons:file-type-sass",
    less: "vscode-icons:file-type-less",
    md: "vscode-icons:file-type-markdown",
    txt: "vscode-icons:file-type-text",
    png: "vscode-icons:file-type-image",
    jpg: "vscode-icons:file-type-image",
    jpeg: "vscode-icons:file-type-image",
    gif: "vscode-icons:file-type-image",
    svg: "vscode-icons:file-type-svg",
    pdf: "vscode-icons:file-type-pdf",
    zip: "vscode-icons:file-type-zip",
  };

  return iconMap[ext || ""] || "vscode-icons:file-type-default";
};

// 获取文件大小显示
const formatFileSize = (size?: number) => {
  if (!size) return "";

  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
};

// 监听数据变化
watch(
  () => props.folderItems,
  () => {
    if (props.folderItems) {
      initializeExpandedState();
    }
  },
  { immediate: true }
);

onMounted(() => {
  initializeExpandedState();
});

// 折叠全部
const handleCollapseAll = () => {
  expandedItems.value.clear();
  // 更新所有目录项的展开状态
  flattenedItems.value.forEach((item) => {
    if (item.type === "directory") {
      item.isExpanded = false;
      emit("folderToggle", item, false);
    }
  });
};

// 刷新
const handleRefresh = () => {
  expandedItems.value.clear();
  selectedItem.value = "";
  emit("refresh");
  nextTick(() => {
    initializeExpandedState();
  });
};
</script>

<template>
  <div :class="treeClasses" :style="containerStyle" ref="treeContainer">
    <!-- 头部工具栏 -->
    <div class="folder-tree-header">
      <div class="header-title">
        <Icon icon="vscode-icons:default-folder" />
        <span>文件资源管理器</span>
      </div>
      <div class="header-actions">
        <button
          class="action-btn"
          @click="handleCollapseAll"
          :disabled="isLoading"
          title="折叠全部"
        >
          <Icon icon="codicon:collapse-all" />
        </button>
        <button
          class="action-btn"
          @click="handleRefresh"
          :disabled="isLoading"
          title="刷新"
        >
          <Icon :icon="isLoading ? 'eos-icons:loading' : 'codicon:refresh'" />
        </button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="folder-tree-content">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-state">
        <Icon icon="eos-icons:loading" />
        <span>正在加载...</span>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <Icon icon="codicon:error" />
        <div class="error-content">
          <div class="error-message">{{ error.message }}</div>
          <div class="error-code">错误码: {{ error.code }}</div>
          <button class="retry-btn" @click="handleRefresh">
            <Icon icon="codicon:refresh" />
            重试
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!flattenedItems.length" class="empty-state">
        <Icon icon="vscode-icons:default-folder" />
        <span>暂无文件</span>
      </div>

      <!-- 文件树 -->
      <div v-else class="tree-list">
        <div
          v-for="item in flattenedItems"
          :key="item.path"
          :class="{
            'tree-item': true,
            'tree-item--selected': selectedItem === item.path,
            'tree-item--directory': item.type === 'directory',
            'tree-item--file': item.type === 'file',
          }"
          :style="{ paddingLeft: `${item.level * 16 + 8}px` }"
          @click="selectItem(item)"
        >
          <!-- 展开/收起箭头 -->
          <div
            v-if="item.type === 'directory'"
            class="tree-arrow"
            :class="{ 'tree-arrow--expanded': item.isExpanded }"
          >
            <Icon
              :icon="
                item.isExpanded
                  ? 'codicon:chevron-down'
                  : 'codicon:chevron-right'
              "
            />
          </div>
          <div v-else class="tree-arrow-placeholder"></div>

          <!-- 文件图标 -->
          <div class="tree-icon">
            <Icon :icon="getFileIcon(item)" />
          </div>

          <!-- 文件名 -->
          <div class="tree-label">{{ item.name }}</div>

          <!-- 文件信息 -->
          <div v-if="item.type === 'file' && item.size" class="tree-meta">
            {{ formatFileSize(item.size) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./index.scss" scoped></style>
