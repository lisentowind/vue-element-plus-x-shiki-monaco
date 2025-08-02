<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { EditInstance } from "../../hooks/useMonacoEdit";
import { useMonacoEdit } from "../../hooks/useMonacoEdit";
import { BundledLanguage, BundledTheme } from "shiki";
import MonacoHeader from "../Monaco-Header/index.vue";
import "../../assets/style/global.scss"

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
});

const emit = defineEmits<{
  change: [value: string];
  ready: [editor: EditInstance];
}>();

const editorRef = ref<HTMLDivElement>();
let editorInstance: EditInstance | null = null;
let monacoEditHook: ReturnType<typeof useMonacoEdit> | null = null;

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
  });

  try {
    editorInstance = await monacoEditHook.initMonacoEdit();

    // 监听内容变化
    editorInstance.onDidChangeModelContent(() => {
      const value = editorInstance?.getValue() || "";
      emit("change", value);
    });

    emit("ready", editorInstance);

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
  </div>
</template>

<style src="./index.scss" scoped></style>
