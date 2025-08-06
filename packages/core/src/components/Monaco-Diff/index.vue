<script lang="ts" setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  onBeforeUnmount,
  computed,
} from "vue";
import MonacoHeader from "../Monaco-Header/index.vue";
import ContextMenu from "../ContextMenu/index.vue";
import type { ContextMenuItem, MenuItem } from "../../hooks/useContextMenu";
import { useContextMenu } from "../../hooks/useContextMenu";
import "../../assets/style/global.scss";
import { MonacoDiffProps } from "./types";
import {
  DiffEditInstance,
  useMonacoDiffEdit,
} from "../../hooks/useMonacoDiffEdit";
import type { BundledTheme } from "shiki";
import {
  createEditorContextMenu,
  createMinimapContextMenu,
  EditInstance,
  MENU_PRESETS,
  MINIMAP_MENU_PRESETS,
} from "../../hooks";

const props = withDefaults(defineProps<MonacoDiffProps>(), {
  currentLanguage: "typescript",
  currentTheme: "vitesse-light",
  languages: () => ["typescript"],
  themes: () => ["vitesse-light", "vitesse-dark"],
  diffViewType: "default",
  height: "400px",
  showToolbar: true,
  autoResize: true,
  contextMenu: () => ({
    enabled: true,
    items: "full",
    variant: "glass",
  }),
  minimapContextMenu: () => ({
    enabled: true,
    items: "basic",
    variant: "glass",
  }),
});

const emit = defineEmits<{
  change: [value: string];
  ready: [editor: DiffEditInstance];
}>();

const diffEditorRef = ref<HTMLDivElement>();
let diffEditorInstance: DiffEditInstance | null = null;
let diffMonacoEditHook: ReturnType<typeof useMonacoDiffEdit> | null = null;
let diffOriginalEditor: EditInstance | null = null;
let diffModifiedEditor: EditInstance | null = null;

// Diff 导航相关状态
const currentDiffIndex = ref(0);
const totalDiffs = ref(0);
const isCollapsed = ref(false); // 默认展开所有区域

// 用于管理事件监听器的清理
const disposables: any[] = [];

// 右键菜单相关
const originalContextMenuItems = ref<ContextMenuItem[]>([]);
const modifiedContextMenuItems = ref<ContextMenuItem[]>([]);
const contextMenuItems = ref<ContextMenuItem[]>([]);
const contextMenu = useContextMenu({
  items: contextMenuItems.value,
  target: diffEditorRef.value as HTMLDivElement,
});

// Minimap右键菜单相关
const minimapContextMenuItems = ref<ContextMenuItem[]>([]);
const minimapContextMenu = useContextMenu({
  items: minimapContextMenuItems.value,
  target: diffEditorRef.value as HTMLDivElement,
});

watch(
  () => props.currentTheme,
  async (newTheme) => {
    if (diffMonacoEditHook && diffEditorInstance) {
      try {
        await diffMonacoEditHook.setTheme(newTheme);
      } catch (error) {
        console.error("主题切换失败:", error);
      }
    }
  }
);

// 初始化编辑器
const initializeEditor = async () => {
  if (!diffEditorRef.value) return;

  diffMonacoEditHook = useMonacoDiffEdit({
    target: diffEditorRef.value,
    languages: props.languages,
    themes: props.themes,
    defaultTheme: props.currentTheme,
    contextMenu: props.contextMenu,
  });

  try {
    diffEditorInstance = await diffMonacoEditHook.initMonacoDiffEdit();

    // 创建model
    const oldModel = diffMonacoEditHook.createModel(
      props.oldModel,
      props.currentLanguage
    );
    const newModel = diffMonacoEditHook.createModel(
      props.newModel,
      props.currentLanguage
    );
    // 设置模型
    diffMonacoEditHook.setDiffModel({
      original: oldModel,
      modified: newModel,
    });

    emit("ready", diffEditorInstance);

    // 设置右键菜单
    if (props.contextMenu?.enabled !== false) {
      diffOriginalEditor = diffEditorInstance.getOriginalEditor();
      diffModifiedEditor = diffEditorInstance.getModifiedEditor();
      setupContextMenu();
    }

    // 初始化 diff 导航
    setupDiffNavigation();

    // 启用自动尺寸调整
    if (props.autoResize) {
      diffMonacoEditHook.enableAutoResize();
    }
  } catch (error) {
    console.error("Monaco Editor 初始化失败:", error);
    throw error;
  }
};

watch(
  () => props.diffViewType,
  (v) => {
    diffMonacoEditHook?.setDiffViewOptions(v);
  }
);

onMounted(async () => {
  await initializeEditor();
});

onUnmounted(() => {
  // 清理事件监听器
  disposables.forEach((disposable) => {
    try {
      disposable?.dispose?.();
    } catch (error) {
      console.debug("Error disposing listener:", error);
    }
  });
  disposables.length = 0;

  if (diffMonacoEditHook) {
    diffEditorRef.value && diffMonacoEditHook.destroy(diffEditorRef.value);
  }
});

// 设置右键菜单
const setupContextMenu = () => {
  if (
    !diffEditorInstance ||
    !diffMonacoEditHook ||
    !diffOriginalEditor ||
    !diffModifiedEditor
  )
    return;

  // 设置编辑器右键菜单
  if (props.contextMenu?.enabled !== false) {
    // 获取菜单项配置
    let enabledItems: string[] = [];
    if (typeof props.contextMenu?.items === "string") {
      enabledItems = MENU_PRESETS[props.contextMenu.items] as any;
    } else if (Array.isArray(props.contextMenu?.items)) {
      enabledItems = props.contextMenu.items;
    }

    // 为原始编辑器创建简化菜单（复制 + 查找替换 + 字体调整）
    originalContextMenuItems.value = createEditorContextMenu({
      editor: diffOriginalEditor,
      enabledItems: [
        "copy",
        "find",
        "replace",
        "increaseFontSize",
        "decreaseFontSize",
        "resetFontSize",
      ],
      customItems: [],
    });

    // 为修改编辑器创建完整菜单
    modifiedContextMenuItems.value = createEditorContextMenu({
      editor: diffModifiedEditor,
      enabledItems,
      customItems: props.contextMenu?.customItems ?? [],
    });

    // 绑定原始编辑器右键菜单事件
    diffMonacoEditHook.onOriginalContextMenu(async (event) => {
      // 隐藏minimap菜单（如果正在显示）
      if (minimapContextMenu.isVisible.value) {
        minimapContextMenu.hide();
      }

      // 设置当前菜单项为原始编辑器的菜单项
      contextMenuItems.value = originalContextMenuItems.value;
      contextMenu.show(event, originalContextMenuItems.value);
    });

    // 绑定修改编辑器右键菜单事件
    diffMonacoEditHook.onModifiedContextMenu(async (event) => {
      // 隐藏minimap菜单（如果正在显示）
      if (minimapContextMenu.isVisible.value) {
        minimapContextMenu.hide();
      }

      // 尝试预先请求剪贴板权限（可选）
      try {
        if ("permissions" in navigator) {
          await (navigator as any).permissions.query({
            name: "clipboard-read",
          });
        }
      } catch (error) {
        // 忽略权限检查错误
      }

      // 设置当前菜单项为修改编辑器的菜单项
      contextMenuItems.value = modifiedContextMenuItems.value;
      contextMenu.show(event, modifiedContextMenuItems.value);
    });
  }

  // 设置Minimap右键菜单
  if (props.minimapContextMenu?.enabled !== false) {
    // 获取minimap菜单项配置
    let minimapEnabledItems: string[] = [];
    if (typeof props.minimapContextMenu?.items === "string") {
      minimapEnabledItems = MINIMAP_MENU_PRESETS[
        props.minimapContextMenu.items
      ] as any;
    } else if (Array.isArray(props.minimapContextMenu?.items)) {
      minimapEnabledItems = props.minimapContextMenu.items;
    }

    // 创建minimap菜单项
    minimapContextMenuItems.value = createMinimapContextMenu({
      editor: diffModifiedEditor, // 使用修改编辑器
      enabledItems: minimapEnabledItems,
      customItems: props.minimapContextMenu?.customItems ?? [],
    });

    // 绑定minimap右键菜单事件
    diffMonacoEditHook.onMinimapContextMenu(async (event) => {
      // 隐藏编辑器菜单（如果正在显示）
      if (contextMenu.isVisible.value) {
        contextMenu.hide();
      }

      minimapContextMenu.show(event, minimapContextMenuItems.value);
    });
  }
};

// 设置 Diff 导航
const setupDiffNavigation = () => {
  if (!diffEditorInstance || !diffOriginalEditor || !diffModifiedEditor) return;

  // 计算总的差异数量
  const updateDiffCount = () => {
    if (!diffEditorInstance) return;

    // 使用 requestAnimationFrame 确保 DOM 更新后再计算
    requestAnimationFrame(() => {
      const changes = diffEditorInstance?.getLineChanges();
      const newTotalDiffs = changes?.length || 0;

      // 只在数量真正变化时更新
      if (totalDiffs.value !== newTotalDiffs) {
        totalDiffs.value = newTotalDiffs;

        // 调整当前索引，确保不超出范围
        if (
          totalDiffs.value > 0 &&
          currentDiffIndex.value >= totalDiffs.value
        ) {
          currentDiffIndex.value = Math.max(0, totalDiffs.value - 1);
        } else if (totalDiffs.value === 0) {
          currentDiffIndex.value = 0;
        }
      }
    });
  };

  // 立即更新一次差异计数
  updateDiffCount();

  // 监听两个编辑器的内容变化
  const originalModel = diffOriginalEditor.getModel();
  const modifiedModel = diffModifiedEditor.getModel();

  // 监听原始编辑器内容变化
  if (originalModel) {
    const originalDisposable = originalModel.onDidChangeContent(() => {
      updateDiffCount();
    });

    // 保存 disposable 以便清理
    disposables.push(originalDisposable);
  }

  // 监听修改编辑器内容变化
  if (modifiedModel) {
    const modifiedDisposable = modifiedModel.onDidChangeContent(() => {
      updateDiffCount();
    });

    // 保存 disposable 以便清理
    disposables.push(modifiedDisposable);
  }

  // 监听 diff 编辑器本身的变化事件
  try {
    if (diffEditorInstance.onDidUpdateDiff) {
      const diffUpdateDisposable = diffEditorInstance.onDidUpdateDiff(() => {
        updateDiffCount();
      });

      disposables.push(diffUpdateDisposable);
    }
  } catch (error) {
    // Monaco 版本可能不支持此事件，忽略错误
    console.debug("onDidUpdateDiff not available:", error);
  }
};

// 跳转到上一个差异
const goToPreviousDiff = () => {
  if (!diffEditorInstance || totalDiffs.value === 0) return;

  currentDiffIndex.value =
    currentDiffIndex.value > 0
      ? currentDiffIndex.value - 1
      : totalDiffs.value - 1;
  goToCurrentDiff();
};

// 跳转到下一个差异
const goToNextDiff = () => {
  if (!diffEditorInstance || totalDiffs.value === 0) return;

  currentDiffIndex.value = (currentDiffIndex.value + 1) % totalDiffs.value;
  goToCurrentDiff();
};

// 跳转到当前差异
const goToCurrentDiff = () => {
  if (!diffEditorInstance || totalDiffs.value === 0) return;

  const changes = diffEditorInstance.getLineChanges();
  if (changes && changes[currentDiffIndex.value]) {
    const change = changes[currentDiffIndex.value];
    const lineNumber =
      change?.modifiedStartLineNumber || change?.originalStartLineNumber;

    // 滚动到该差异位置
    diffModifiedEditor?.revealLineInCenter(lineNumber ?? 0);
    diffOriginalEditor?.revealLineInCenter(
      (change?.originalStartLineNumber || lineNumber) ?? 0
    );
  }
};

// 切换折叠未更改区域
const toggleUnchangedRegions = () => {
  if (!diffEditorInstance) return;

  isCollapsed.value = !isCollapsed.value;

  // 使用 Monaco Editor 的 API 来折叠/展开未更改的区域
  try {
    diffEditorInstance.updateOptions({
      hideUnchangedRegions: {
        enabled: isCollapsed.value,
        minimumLineCount: 3, // 最小显示行数
        contextLineCount: 3, // 上下文行数
      },
    });
  } catch (error) {
    // 如果 API 不支持，降级使用其他方法
    console.debug("hideUnchangedRegions not supported:", error);

    // 可以尝试使用编辑器的 fold/unfold 功能
    // 这里暂时只更新状态
  }
};
// 处理头部复制按钮点击
const handleHeaderCopy = async () => {
  try {
    // 对于 diff 编辑器，默认复制修改后的内容（右侧编辑器）
    const modifiedModel = diffModifiedEditor?.getModel();
    if (!modifiedModel) {
      console.warn("无法获取编辑器内容");
      return;
    }

    const content = modifiedModel.getValue();
    await navigator.clipboard.writeText(content);

    // 可以添加复制成功的提示
    console.log("代码已复制到剪贴板");
  } catch (error) {
    console.error("复制失败:", error);

    // 降级方案：使用传统的复制方法
    try {
      const modifiedModel = diffModifiedEditor?.getModel();
      if (modifiedModel) {
        const content = modifiedModel.getValue();
        // 创建临时文本区域
        const textArea = document.createElement("textarea");
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        console.log("代码已复制到剪贴板（降级方案）");
      }
    } catch (fallbackError) {
      console.error("降级复制方案也失败:", fallbackError);
    }
  }
};

// 处理菜单项点击
const handleContextMenuItemClick = (item: ContextMenuItem) => {
  if (item.type === "item") {
    // 直接调用菜单项的action
    (item as MenuItem).action();
    contextMenu.hide();
  }
};

// 处理minimap菜单项点击
const handleMinimapContextMenuItemClick = (item: ContextMenuItem) => {
  if (item.type === "item") {
    // 直接调用菜单项的action
    (item as MenuItem).action();
    minimapContextMenu.hide();
  }
};

// 判断是否为暗色主题
const isDarkTheme = computed(() => {
  return (
    props.currentTheme && props.currentTheme.toLowerCase().includes("dark")
  );
});

// 计算主题类名
const themeClasses = computed(() => ({
  "theme-light": !isDarkTheme.value,
  "theme-dark": isDarkTheme.value,
}));

onBeforeUnmount(() => {
  if (diffMonacoEditHook) {
    diffEditorRef.value && diffMonacoEditHook.destroy(diffEditorRef.value);
  }
});

// 暴露方法给父组件
defineExpose({
  getEditor: () => diffEditorInstance,
  focus: () => diffEditorInstance?.focus(),
  setTheme: (theme: BundledTheme) => diffMonacoEditHook?.setTheme(theme),
  layout: () => diffMonacoEditHook?.layout(),
  enableAutoResize: () => diffMonacoEditHook?.enableAutoResize(),
  disableAutoResize: () => diffMonacoEditHook?.disableAutoResize(),
});
</script>

<template>
  <div
    class="monaco-editor-wrapper monaco-editor-diff-wrapper"
    :class="[props.monacoEditClass, themeClasses]"
  >
    <MonacoHeader
      v-if="props.showToolbar"
      :current-language="props.currentLanguage"
      :file-name="props.fileName ?? 'Untitled'"
      :theme="props.currentTheme"
      @copy="handleHeaderCopy"
    >
      <template #toolbar>
        <!-- Diff 导航工具栏 -->
        <div class="file-language diff-info">
          {{
            totalDiffs > 0
              ? `${currentDiffIndex + 1} / ${totalDiffs}`
              : "0 个不同点"
          }}
        </div>
        <button
          class="toolbar-btn"
          :disabled="totalDiffs === 0"
          @click="goToPreviousDiff"
          title="上一个差异"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 18l-6-6 6-6"
            />
          </svg>
        </button>
        <button
          class="toolbar-btn"
          :disabled="totalDiffs === 0"
          @click="goToNextDiff"
          title="下一个差异"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 18l6-6-6-6"
            />
          </svg>
        </button>
        <button
          class="toolbar-btn"
          @click="toggleUnchangedRegions"
          :title="isCollapsed ? '展开未更改区域' : '折叠未更改区域'"
        >
          <svg
            v-if="isCollapsed"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 14l-7-7-7 7"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 10l7 7 7-7"
            />
          </svg>
        </button>
      </template>
    </MonacoHeader>
    <div
      ref="diffEditorRef"
      class="monaco-editor monaco-diff-editor"
      :class="{ noHeader: !props.showToolbar }"
      :style="{ height: props.height }"
    ></div>

    <!-- 自定义右键菜单 -->
    <ContextMenu
      v-if="diffEditorRef"
      :visible="contextMenu.isVisible.value"
      :position="contextMenu.position"
      :items="contextMenuItems"
      :variant="props.contextMenu?.variant || 'glass'"
      :theme="props.currentTheme"
      @item-click="handleContextMenuItemClick"
      @hide="contextMenu.hide"
    />

    <!-- Minimap右键菜单 -->
    <ContextMenu
      v-if="diffEditorRef && props.minimapContextMenu?.enabled !== false"
      :visible="minimapContextMenu.isVisible.value"
      :position="minimapContextMenu.position"
      :items="minimapContextMenuItems"
      :variant="props.minimapContextMenu?.variant || 'glass'"
      :theme="props.currentTheme"
      @item-click="handleMinimapContextMenuItemClick"
      @hide="minimapContextMenu.hide"
    />
  </div>
</template>

<style src="./index.scss" scoped></style>
