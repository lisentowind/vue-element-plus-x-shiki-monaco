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
  editInstance: EditInstance | null;
}

export function useMonacoEdit(options: MonacoOptions): UseMonacoEditReturn {
  let editInstance: EditInstance | null = null;

  async function initMonacoEdit(): Promise<EditInstance> {
    const { target, languages, themes, defaultTheme = 'vitesse-light', defaultLanguage = 'javascript' } = options;

    // 先注册语言
    languages.forEach((lang) => {
      monaco.languages.register({ id: lang });
    });

    //  注册 Shiki 主题，并为 Monaco 提供语法高亮

    const highlighter = await createShikiHighlighter(themes, languages);

    shikiToMonaco(highlighter, monaco);

    editInstance = monaco.editor.create(target, {
      value: options.codeValue,
      language: defaultLanguage,
      theme: defaultTheme,
    });

    return editInstance;
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

  function destroy() {
    if (editInstance) {
      editInstance.dispose();
    }
  }

  return {
    initMonacoEdit,
    destroy,
    registerLanguage,
    editInstance,
  };
}
