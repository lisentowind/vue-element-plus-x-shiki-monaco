<script lang='ts' setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { EditInstance } from './hooks/useMonacoEdit'
import { useMonacoEdit } from './hooks/useMonacoEdit'
import { BundledLanguage, BundledTheme } from 'shiki'

interface Props {
  language?: BundledLanguage
  theme?: BundledTheme
  value?: string
  height?: string
  showToolbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  theme: 'vitesse-light',
  value: '',
  height: '400px',
  showToolbar: true
})

const emit = defineEmits<{
  change: [value: string]
  ready: [editor: EditInstance]
}>()

const editorRef = ref<HTMLDivElement>()
let editorInstance: EditInstance | null = null

onMounted(async () => {
  if (!editorRef.value) return

  const { initMonacoEdit } = useMonacoEdit({
    target: editorRef.value,
    languages: [props.language],
    themes: [props.theme],
    codeValue: props.value,
    defaultTheme: props.theme as any,
    defaultLanguage: props.language as any
  })

  try {
    editorInstance = await initMonacoEdit()

    if (props.value) {
      editorInstance.setValue(props.value)
    }

    // 监听内容变化
    editorInstance.onDidChangeModelContent(() => {
      const value = editorInstance?.getValue() || ''
      emit('change', value)
    })

    emit('ready', editorInstance)
  } catch (error) {
    console.error('Monaco Editor 初始化失败:', error)
  }
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.dispose()
  }
})

// 默认工具栏功能
const getFileName = () => {
  const extensions = {
    javascript: 'main.js',
    typescript: 'main.ts',
    python: 'main.py',
    html: 'index.html',
    css: 'style.css',
    json: 'data.json'
  }
  return extensions[props.language as keyof typeof extensions] || 'untitled'
}

const copyCode = async () => {
  if (editorInstance) {
    const code = editorInstance.getValue()
    try {
      await navigator.clipboard.writeText(code)
      // 这里可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}

const formatCode = () => {
  if (editorInstance) {
    editorInstance.getAction('editor.action.formatDocument')?.run()
  }
}

// 暴露方法给父组件
defineExpose({
  getEditor: () => editorInstance,
  setValue: (value: string) => editorInstance?.setValue(value),
  getValue: () => editorInstance?.getValue() || '',
  focus: () => editorInstance?.focus(),
  copyCode,
  formatCode
})
</script>

<template>
  <div class="monaco-editor-wrapper">
    <div v-if="showToolbar || $slots['toolbar']" class="editor-toolbar">
      <slot name="toolbar">
        <div class="default-toolbar">
          <div class="toolbar-left">
            <div class="file-info">
              <span class="file-name">{{ getFileName() }}</span>
              <span class="file-language">{{ language.toUpperCase() }}</span>
            </div>
          </div>
          <div class="toolbar-right">
            <button class="toolbar-btn" @click="copyCode" title="复制代码">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="toolbar-btn" @click="formatCode" title="格式化代码">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </slot>
    </div>
    <div
      ref="editorRef"
      class="monaco-editor"
      :style="{ height: props.height }"
    ></div>
  </div>
</template>

<style src="./index.scss" scoped></style>