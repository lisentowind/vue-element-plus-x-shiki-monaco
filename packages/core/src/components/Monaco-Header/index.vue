<script lang="ts" setup>
import { BundledLanguage } from "shiki";

interface Props {
  currentLanguage?: BundledLanguage;
  fileName?: string;
  showToolbar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentLanguage: "javascript",
  showToolbar: true,
});

const emit = defineEmits<{
  copy: [];
  format: [];
}>();

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
</script>

<template>
  <div class="editor-toolbar">
    <slot name="toolbar">
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
          <button class="toolbar-btn" @click="handleCopy" title="复制代码">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              ></path>
            </svg>
          </button>
          <button class="toolbar-btn" @click="handleFormat" title="格式化代码">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </slot>
  </div>
</template>

<style src="./index.scss" scoped></style>