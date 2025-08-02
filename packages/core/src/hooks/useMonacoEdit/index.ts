import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';
import * as monaco from 'monaco-editor-core';
import { createHighlighter } from 'shiki';

export interface MonacoOptions {
  target: HTMLElement;
  languages: BundledLanguage[];
  codeValue: string;
  themes: BundledTheme[];
  defaultTheme: BundledTheme;
  defaultLanguage: BundledLanguage;
}

export type EditInstance = monaco.editor.IStandaloneCodeEditor;

export interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>;
  destroy: () => void;
  registerLanguage: (language: string) => void;
  setTheme: (theme: BundledTheme) => Promise<void>;
  setLanguage: (language: BundledLanguage) => Promise<void>;
  layout: () => void;
  enableAutoResize: () => void;
  disableAutoResize: () => void;
  editInstance: EditInstance | null;
}

export function useMonacoEdit(options: MonacoOptions): UseMonacoEditReturn {
  let editInstance: EditInstance | null = null;
  let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null = null;

  // 缓存已加载的主题和语言，避免重复创建 highlighter
  const loadedThemes = new Set<BundledTheme>();
  const loadedLanguages = new Set<BundledLanguage>();

  // 自动尺寸调整相关
  let resizeObserver: ResizeObserver | null = null;
  let autoResizeEnabled = false;

  async function initMonacoEdit(): Promise<EditInstance> {
    const { target, languages, themes, defaultTheme = 'vitesse-light', defaultLanguage = 'javascript' } = options;

    try {
      // 先注册语言
      languages.forEach((lang) => {
        monaco.languages.register({ id: lang });
        loadedLanguages.add(lang);
      });

      //  注册 Shiki 主题，并为 Monaco 提供语法高亮
      highlighter = await createShikiHighlighter(themes, languages);

      // 缓存已加载的主题
      themes.forEach(theme => loadedThemes.add(theme));

      shikiToMonaco(highlighter, monaco);

      editInstance = monaco.editor.create(target, {
        value: options.codeValue,
        language: defaultLanguage,
        theme: defaultTheme,
      });

      return editInstance;
    }
    catch (error) {
      console.error('Failed to initialize Monaco Editor:', error);
      throw error;
    }
  }

  async function createShikiHighlighter(themes: BundledTheme[], langs: BundledLanguage[]): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
    // 创建一个可复用的语法高亮器
    return await createHighlighter({
      themes,
      langs,
    });
  }

  function registerLanguage(language: string) {
    monaco.languages.register({ id: language });
  }

  async function setLanguage(language: BundledLanguage): Promise<void> {
    if (!editInstance) {
      throw new Error('Editor instance not initialized');
    }

    try {
      // 检查语言是否已经加载
      if (!loadedLanguages.has(language)) {
        // 注册新语言
        monaco.languages.register({ id: language });
        loadedLanguages.add(language);

        // 更新语言列表并重新创建 highlighter
        const newLanguages = Array.from(loadedLanguages);
        options.languages = newLanguages;

        if (highlighter) {
          highlighter = await createShikiHighlighter(Array.from(loadedThemes), newLanguages);
          shikiToMonaco(highlighter, monaco);
        }
      }

      // 切换编辑器语言
      const model = editInstance.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
    catch (error) {
      console.error(`Failed to set language to ${language}:`, error);
      throw error;
    }
  }

  async function setTheme(theme: BundledTheme): Promise<void> {
    if (!editInstance) {
      throw new Error('Editor instance not initialized');
    }

    try {
      // 检查主题是否已经加载
      if (!loadedThemes.has(theme)) {
        // 添加新主题到缓存
        loadedThemes.add(theme);

        // 更新主题列表并重新创建 highlighter
        const newThemes = Array.from(loadedThemes);
        options.themes = newThemes;

        if (highlighter) {
          highlighter = await createShikiHighlighter(newThemes, Array.from(loadedLanguages));
          shikiToMonaco(highlighter, monaco);
        }
      }

      // 切换 Monaco 编辑器主题
      monaco.editor.setTheme(theme);
    }
    catch (error) {
      console.error(`Failed to set theme to ${theme}:`, error);
      throw error;
    }
  }

  function destroy() {
    if (editInstance) {
      editInstance.dispose();
    }

    // 清理 ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }

  function layout(): void {
    if (editInstance) {
      editInstance.layout();
    }
  }

  function enableAutoResize(): void {
    if (!editInstance || autoResizeEnabled)
      return;

    try {
      resizeObserver = new ResizeObserver(() => {
        if (editInstance) {
          // 使用 requestAnimationFrame 优化性能
          requestAnimationFrame(() => {
            editInstance?.layout();
          });
        }
      });

      resizeObserver.observe(options.target);
      autoResizeEnabled = true;
    }
    catch (error) {
      console.error('Failed to enable auto resize:', error);
    }
  }

  function disableAutoResize(): void {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
      autoResizeEnabled = false;
    }
  }

  return {
    initMonacoEdit,
    destroy,
    registerLanguage,
    setTheme,
    setLanguage,
    layout,
    enableAutoResize,
    disableAutoResize,
    editInstance,
  };
}
