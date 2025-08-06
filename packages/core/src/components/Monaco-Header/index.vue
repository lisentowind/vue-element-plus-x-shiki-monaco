<script lang="ts" setup>
import { computed } from "vue";
import type { MonacoHeaderProps } from "./type";

const props = withDefaults(defineProps<MonacoHeaderProps>(), {
  currentLanguage: "javascript",
  showToolbar: true,
  theme: "vitesse-light",
});

const emit = defineEmits<{
  copy: [];
  format: [];
}>();

// 判断是否为暗色主题
const isDarkTheme = computed(() => {
  return props.theme && props.theme.toLowerCase().includes("dark");
});

// 计算主题类名
const themeClasses = computed(() => ({
  "theme-light": !isDarkTheme.value,
  "theme-dark": isDarkTheme.value,
}));

// 默认工具栏功能
const getFileName = () => {
  const extensions = {
    javascript: "main.js",
    typescript: "main.ts",
    python: "main.py",
    html: "index.html",
    css: "style.css",
    json: "data.json",
  };
  return (
    props.fileName ||
    extensions[props.currentLanguage as keyof typeof extensions] ||
    "untitled"
  );
};

const handleCopy = () => {
  emit("copy");
};

const handleFormat = () => {
  emit("format");
};

defineExpose({
  getFileName,
  handleCopy,
  handleFormat,
});
</script>

<template>
  <div class="editor-toolbar" :class="themeClasses">
    <div class="default-toolbar">
      <div class="toolbar-left">
        <div class="file-info">
          <span class="file-name">{{ getFileName() }}</span>
          <span class="file-language">{{
            currentLanguage?.toUpperCase()
          }}</span>
        </div>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar"> </slot>
        <button class="toolbar-btn" @click="handleCopy" title="复制代码">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path
              d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style src="./index.scss" scoped></style>
