<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { EditInstance } from "../../hooks/useMonacoEdit";
import { useMonacoEdit } from "../../hooks/useMonacoEdit";
import { BundledLanguage, BundledTheme } from "shiki";
import MonacoHeader from "../Monaco-Header/index.vue";
import ContextMenu from "../ContextMenu/index.vue";
import type { ContextMenuItem, MenuItem } from "../../hooks/useContextMenu";
import { useContextMenu } from "../../hooks/useContextMenu";
import {
  createEditorContextMenu,
  MENU_PRESETS,
} from "../../hooks/useContextMenu/editorMenu";
import "../../assets/style/global.scss";

interface Props {
  currentLanguage?: BundledLanguage;
  currentTheme?: BundledTheme;
  languages?: BundledLanguage[];
  themes?: BundledTheme[];
  value?: string;
  height?: string;
  showToolbar?: boolean;
  autoResize?: boolean;
  monacoEditClass?: string;
  fileName?: string;
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
  };
}

const props = withDefaults(defineProps<Props>(), {
  currentLanguage: "javascript",
  currentTheme: "vitesse-light",
  languages: () => [
    "javascript",
    "typescript",
    "python",
    "html",
    "css",
    "json",
  ],
  themes: () => [
    "vitesse-light",
    "vitesse-dark",
    "github-light",
    "github-dark",
  ],
  value: "",
  height: "400px",
  showToolbar: true,
  autoResize: true,
  contextMenu: () => ({
    enabled: true,
    items: "full",
  }),
});

const emit = defineEmits<{
  change: [value: string];
  ready: [editor: EditInstance];
}>();

const editorRef = ref<HTMLDivElement>();
let editorInstance: EditInstance | null = null;
let monacoEditHook: ReturnType<typeof useMonacoEdit> | null = null;

// 右键菜单相关
const contextMenuItems = ref<ContextMenuItem[]>([]);
const contextMenu = useContextMenu({
  items: contextMenuItems.value,
});

watch(
  () => props.value,
  (value) => {
    if (editorInstance) {
      editorInstance.setValue(value);
    }
  },
  { deep: 1 }
);

watch(
  () => props.currentTheme,
  async (newTheme) => {
    if (monacoEditHook && editorInstance) {
      try {
        await monacoEditHook.setTheme(newTheme);
      } catch (error) {
        console.error("主题切换失败:", error);
      }
    }
  }
);

watch(
  () => props.currentLanguage,
  async (newLanguage) => {
    if (monacoEditHook && editorInstance) {
      try {
        await monacoEditHook.setLanguage(newLanguage);
      } catch (error) {
        console.error("语言切换失败:", error);
      }
    }
  }
);

// 初始化编辑器
const initializeEditor = async () => {
  if (!editorRef.value) return;

  monacoEditHook = useMonacoEdit({
    target: editorRef.value,
    languages: props.languages,
    themes: props.themes,
    codeValue: props.value,
    defaultTheme: props.currentTheme,
    defaultLanguage: props.currentLanguage,
    contextMenu: props.contextMenu,
  });

  try {
    editorInstance = await monacoEditHook.initMonacoEdit();

    // 监听内容变化
    editorInstance.onDidChangeModelContent(() => {
      const value = editorInstance?.getValue() || "";
      emit("change", value);
    });

    emit("ready", editorInstance);

    // 设置右键菜单
    if (props.contextMenu?.enabled !== false) {
      setupContextMenu();
    }

    // 启用自动尺寸调整
    if (props.autoResize) {
      monacoEditHook.enableAutoResize();
    }
  } catch (error) {
    console.error("Monaco Editor 初始化失败:", error);
    throw error;
  }
};

onMounted(async () => {
  await initializeEditor();
});

onUnmounted(() => {
  if (monacoEditHook) {
    monacoEditHook.destroy();
  }
});

// 头部工具栏事件处理
const handleCopy = async () => {
  if (editorInstance) {
    const code = editorInstance.getValue();
    try {
      await navigator.clipboard.writeText(code);
      // 这里可以添加成功提示
    } catch (err) {
      console.error("复制失败:", err);
    }
  }
};

const handleFormat = () => {
  if (editorInstance) {
    editorInstance.getAction("editor.action.formatDocument")?.run();
  }
};

// 设置右键菜单
const setupContextMenu = () => {
  if (!editorInstance || !monacoEditHook) return;

  // 获取菜单项配置
  let enabledItems: string[] = [];
  if (typeof props.contextMenu?.items === "string") {
    enabledItems = MENU_PRESETS[props.contextMenu.items] as any;
  } else if (Array.isArray(props.contextMenu?.items)) {
    enabledItems = props.contextMenu.items;
  }

  // 创建菜单项
  contextMenuItems.value = createEditorContextMenu({
    editor: editorInstance,
    enabledItems,
    customItems: props.contextMenu?.customItems ?? [],
  });

  // 绑定右键菜单事件
  monacoEditHook.onContextMenu(async (event) => {
    // 尝试预先请求剪贴板权限（可选）
    try {
      if ('permissions' in navigator) {
        await (navigator as any).permissions.query({ name: 'clipboard-read' });
      }
    } catch (error) {
      // 忽略权限检查错误
    }
    
    contextMenu.show(event);
  });
};

// 处理菜单项点击
const handleContextMenuItemClick = (item: ContextMenuItem) => {
  if (item.type === "item") {
    // 直接调用菜单项的action
    (item as MenuItem).action();
    contextMenu.hide();
  }
};

// 暴露方法给父组件
defineExpose({
  getEditor: () => editorInstance,
  setValue: (value: string) => editorInstance?.setValue(value),
  getValue: () => editorInstance?.getValue() || "",
  focus: () => editorInstance?.focus(),
  setTheme: (theme: BundledTheme) => monacoEditHook?.setTheme(theme),
  setLanguage: (language: BundledLanguage) =>
    monacoEditHook?.setLanguage(language),
  layout: () => monacoEditHook?.layout(),
  enableAutoResize: () => monacoEditHook?.enableAutoResize(),
  disableAutoResize: () => monacoEditHook?.disableAutoResize(),
  copyCode: handleCopy,
  formatCode: handleFormat,
});
</script>

<template>
  <div class="monaco-editor-wrapper" :class="props.monacoEditClass">
    <MonacoHeader
      v-if="props.showToolbar"
      :current-language="props.currentLanguage"
      :file-name="props.fileName ?? 'Untitled'"
      @copy="handleCopy"
      @format="handleFormat"
    >
      <template #toolbar>
        <slot name="toolbar"></slot>
      </template>
    </MonacoHeader>
    <div
      ref="editorRef"
      class="monaco-editor"
      :style="{ height: props.height }"
    ></div>

    <!-- 自定义右键菜单 -->
    <ContextMenu
      :visible="contextMenu.isVisible.value"
      :position="contextMenu.position"
      :items="contextMenuItems"
      @item-click="handleContextMenuItemClick"
      @hide="contextMenu.hide"
    />
  </div>
</template>

<style src="./index.scss" scoped></style>
