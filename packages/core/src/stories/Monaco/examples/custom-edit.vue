<template>
  <div class="advanced-demo">
    <div class="demo-header">
      <h2>Shiki Monaco Editor 高级功能演示</h2>
      <div class="demo-controls">
        <button @click="resetDemo" class="btn">🔄 重置演示</button>
        <button @click="toggleFullscreen" class="btn">⛶ 全屏</button>
      </div>
    </div>

    <div class="demo-content" :class="{ fullscreen: isFullscreen }">
      <div class="demo-sidebar">
        <div class="feature-list">
          <h4>功能特性</h4>
          <div
            class="feature-item"
            v-for="feature in features"
            :key="feature.id"
          >
            <label>
              <input
                type="checkbox"
                v-model="feature.enabled"
                @change="toggleFeature(feature)"
              />
              {{ feature.name }}
            </label>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>

        <div class="stats">
          <h4>编辑器统计</h4>
          <div class="stat-item">
            <span>行数:</span>
            <span>{{ stats.lines }}</span>
          </div>
          <div class="stat-item">
            <span>字符数:</span>
            <span>{{ stats.characters }}</span>
          </div>
          <div class="stat-item">
            <span>选中:</span>
            <span>{{ stats.selection }}</span>
          </div>
        </div>
      </div>

      <div class="demo-editor">
        <Monaco
          ref="monacoRef"
          :current-language="currentLanguage"
          :current-theme="currentTheme"
          :value="demoCode"
          :height="editorHeight"
          :context-menu="contextMenuConfig"
          @change="handleCodeChange"
          @ready="handleEditorReady"
        >
          <template #toolbar>
            <div class="advanced-toolbar">
              <div class="toolbar-section">
                <select v-model="currentLanguage" @change="changeLanguage">
                  <option v-for="lang in languages" :key="lang" :value="lang">
                    {{ lang.toUpperCase() }}
                  </option>
                </select>
                <select v-model="currentTheme" @change="changeTheme">
                  <option v-for="theme in themes" :key="theme" :value="theme">
                    {{ formatThemeName(theme) }}
                  </option>
                </select>
              </div>

              <div class="toolbar-section">
                <button @click="insertSnippet" class="btn">
                  📝 插入代码片段
                </button>
                <button @click="findAndReplace" class="btn">🔍 查找替换</button>
                <button @click="goToLine" class="btn">📍 跳转行</button>
              </div>

              <div class="toolbar-section">
                <button @click="saveSnapshot" class="btn">📸 保存快照</button>
                <button
                  @click="loadSnapshot"
                  class="btn"
                  :disabled="!hasSnapshot"
                >
                  📁 恢复快照
                </button>
              </div>
            </div>
          </template>
        </Monaco>
      </div>
    </div>

    <!-- 演示结果 -->
    <div v-if="demoOutput" class="demo-output">
      <h4>演示输出</h4>
      <pre>{{ demoOutput }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from "vue";
import Monaco from "../../../components/Monaco/index.vue";

const monacoRef = ref();
const isFullscreen = ref(false);
const hasSnapshot = ref(false);
const snapshot = ref("");
const demoOutput = ref("");

const currentLanguage = ref<any>("javascript");
const currentTheme = ref<any>("vitesse-light");

const languages = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "json",
  "vue",
];
const themes = ["vitesse-light", "vitesse-dark", "github-light", "github-dark"];

const features = reactive([
  {
    id: "autocomplete",
    name: "智能补全",
    description: "提供智能的代码补全建议",
    enabled: true,
  },
  {
    id: "error-checking",
    name: "错误检查",
    description: "实时检查语法错误",
    enabled: true,
  },
  {
    id: "code-folding",
    name: "代码折叠",
    description: "折叠代码块以提高可读性",
    enabled: true,
  },
  {
    id: "bracket-matching",
    name: "括号匹配",
    description: "高亮显示匹配的括号",
    enabled: true,
  },
  {
    id: "word-highlight",
    name: "词汇高亮",
    description: "高亮相同的词汇",
    enabled: true,
  },
]);

const stats = reactive({
  lines: 0,
  characters: 0,
  selection: "无",
});

const contextMenuConfig = ref<any>({
  enabled: true,
  items: "full",
  customItems: [
    { type: "separator" },
    {
      type: "item",
      id: "insert-comment",
      label: "💬 插入注释",
      action: () => insertComment(),
    },
    {
      type: "item",
      id: "wrap-selection",
      label: "🎁 包装选择",
      action: () => wrapSelection(),
    },
  ],
});

const editorHeight = computed(() => (isFullscreen.value ? "80vh" : "500px"));

const demoCode = ref(`
// Monaco Editor 高级功能演示
class AdvancedDemo {
  constructor() {
    this.features = new Map();
    this.setupDemo();
  }

  setupDemo() {
    console.log('初始化高级功能演示...');

    // 演示智能补全
    this.demonstrateAutoComplete();

    // 演示语法高亮
    this.demonstrateSyntaxHighlighting();

    // 演示右键菜单
    this.demonstrateContextMenu();
  }

  demonstrateAutoComplete() {
    // 尝试输入 console. 来体验自动补全
    const suggestions = [
      'log', 'warn', 'error', 'info', 'debug'
    ];

    return suggestions;
  }

  demonstrateSyntaxHighlighting() {
    // 不同类型的语法元素
    const string = "这是字符串";
    const number = 42;
    const boolean = true;
    const array = [1, 2, 3, 4, 5];
    const object = { key: 'value' };

    return { string, number, boolean, array, object };
  }

  demonstrateContextMenu() {
    // 右键点击文本体验自定义菜单
    console.log('右键点击体验自定义菜单功能');
    return '体验复制、粘贴、查找替换等功能';
  }

  // 演示错误检查（故意的语法错误，可以尝试修复）
  demonstrateErrorChecking() {
    // 取消注释下面的行查看错误检查
    // console.log('missing semicolon')
    // undeclaredVariable = 'error';
    // return [1, 2, 3,]; // 尾随逗号
  }

  // 演示代码格式化
  demonstrateFormatting(){const unformatted={method:function(param){return param*2;}};return unformatted;}

  // 演示代码折叠
  demonstrateCodeFolding() {
    if (true) {
      if (true) {
        if (true) {
          console.log('深层嵌套的代码块');
          console.log('可以折叠以提高可读性');
          console.log('点击行号旁的折叠按钮试试');
        }
      }
    }
  }
}

// 创建演示实例
const demo = new AdvancedDemo();

// 体验以下功能：
// 1. 智能补全：输入 demo. 查看建议
// 2. 语法高亮：观察不同颜色的语法元素
// 3. 右键菜单：右键点击体验自定义菜单
// 4. 错误检查：取消注释错误代码查看检查结果
// 5. 代码格式化：选择 demonstrateFormatting 方法并格式化
// 6. 代码折叠：点击行号旁的箭头折叠代码块

console.log('高级功能演示准备就绪！');`);

const handleCodeChange = (newValue: any) => {
  updateStats(newValue);
};

const handleEditorReady = (editor: any) => {
  console.log("编辑器准备就绪");
  updateStats(demoCode.value);

  // 设置编辑器选项
  editor.updateOptions({
    fontSize: 14,
    lineHeight: 1.5,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    wordWrap: "on",
  });

  // 监听选择变化
  editor.onDidChangeCursorSelection((e: any) => {
    const model = editor.getModel();
    if (model) {
      const selection = model.getValueInRange(e.selection);
      stats.selection = selection ? `${selection.length} 字符` : "无";
    }
  });
};

const updateStats = (code: any) => {
  stats.lines = code.split("\\n").length;
  stats.characters = code.length;
};

const changeLanguage = () => {
  if (monacoRef.value) {
    monacoRef.value.setLanguage(currentLanguage.value);
  }
};

const changeTheme = () => {
  if (monacoRef.value) {
    monacoRef.value.setTheme(currentTheme.value);
  }
};

const formatThemeName = (theme: any) => {
  return theme
    .split("-")
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const toggleFeature = (feature: any) => {
  const editor = monacoRef.value?.getEditor();
  if (!editor) return;

  switch (feature.id) {
    case "autocomplete":
      editor.updateOptions({
        suggestOnTriggerCharacters: feature.enabled,
        quickSuggestions: feature.enabled,
      });
      break;
    case "code-folding":
      editor.updateOptions({
        folding: feature.enabled,
      });
      break;
    case "bracket-matching":
      editor.updateOptions({
        matchBrackets: feature.enabled ? "always" : "never",
      });
      break;
    case "word-highlight":
      editor.updateOptions({
        occurrencesHighlight: feature.enabled,
      });
      break;
  }

  demoOutput.value = `${feature.name} ${feature.enabled ? "已启用" : "已禁用"}`;
  setTimeout(() => (demoOutput.value = ""), 2000);
};

const insertSnippet = () => {
  const editor = monacoRef.value?.getEditor();
  if (editor) {
    const position = editor.getPosition();
    const snippet = `
// 插入的代码片段
function newFunction() {
  console.log('这是插入的代码片段');
  return 'success';
}
`;
    editor.executeEdits("insert-snippet", [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        text: snippet,
      },
    ]);
  }
};

const findAndReplace = () => {
  const editor = monacoRef.value?.getEditor();
  if (editor) {
    // 触发查找替换对话框
    editor.getAction("editor.action.startFindReplaceAction")?.run();
  }
};

const goToLine = () => {
  const editor = monacoRef.value?.getEditor();
  if (editor) {
    // 触发跳转到行对话框
    editor.getAction("editor.action.gotoLine")?.run();
  }
};

const saveSnapshot = () => {
  snapshot.value = monacoRef.value?.getValue() || "";
  hasSnapshot.value = true;
  demoOutput.value = "代码快照已保存";
  setTimeout(() => (demoOutput.value = ""), 2000);
};

const loadSnapshot = () => {
  if (hasSnapshot.value && snapshot.value) {
    monacoRef.value?.setValue(snapshot.value);
    demoOutput.value = "代码快照已恢复";
    setTimeout(() => (demoOutput.value = ""), 2000);
  }
};

const insertComment = () => {
  const editor = monacoRef.value?.getEditor();
  if (editor) {
    const selection = editor.getSelection();
    const comment = "// 自定义注释\\n";
    editor.executeEdits("insert-comment", [
      {
        range: selection,
        text: comment,
      },
    ]);
  }
};

const wrapSelection = () => {
  const editor = monacoRef.value?.getEditor();
  if (editor) {
    const selection = editor.getSelection();
    const selectedText = editor.getModel()?.getValueInRange(selection) || "";

    if (selectedText) {
      const wrappedText = `console.log(${selectedText});`;
      editor.executeEdits("wrap-selection", [
        {
          range: selection,
          text: wrappedText,
        },
      ]);
    }
  }
};

const resetDemo = () => {
  monacoRef.value?.setValue(demoCode.value);
  features.forEach((feature) => (feature.enabled = true));
  demoOutput.value = "演示已重置";
  setTimeout(() => (demoOutput.value = ""), 2000);
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => {
    monacoRef.value?.layout();
  });
};
</script>

<style scoped>
.advanced-demo {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.demo-header h2 {
  margin: 0;
  color: #495057;
}

.demo-controls {
  display: flex;
  gap: 0.5rem;
}

.demo-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.demo-content.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: white;
  padding: 1rem;
  grid-template-columns: 250px 1fr;
}

.demo-sidebar {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
}

.feature-list h4,
.stats h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.feature-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.feature-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.feature-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.feature-desc {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  line-height: 1.4;
}

.stats {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.stat-item span:first-child {
  color: #6c757d;
}

.stat-item span:last-child {
  font-weight: 500;
  color: #495057;
}

.demo-editor {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.advanced-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  gap: 1rem;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-section select {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

.toolbar-section .btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.toolbar-section .btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.toolbar-section .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-output {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.demo-output h4 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
}

.demo-output pre {
  margin: 0;
  font-family: "Consolas", "Monaco", monospace;
  font-size: 0.875rem;
  color: #495057;
  white-space: pre-wrap;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  color: #495057;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

@media (max-width: 1024px) {
  .demo-content {
    grid-template-columns: 1fr;
  }

  .demo-sidebar {
    order: 2;
  }

  .demo-editor {
    order: 1;
  }

  .advanced-toolbar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toolbar-section {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
