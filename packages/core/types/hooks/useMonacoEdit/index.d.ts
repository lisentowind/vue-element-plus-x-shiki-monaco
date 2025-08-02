import type * as monaco from 'monaco-editor-core';
import type { BundledLanguage, BundledTheme } from 'shiki';

export interface MonacoOptions {
  target: HTMLElement;
  languages: BundledLanguage[];
  codeValue: string;
  themes: BundledTheme[];
  defaultTheme: BundledTheme;
  defaultLanguage: BundledLanguage;
}

export interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>;
  destroy: () => void;
  registerLanguage: (language: string) => void;
  editInstance: EditInstance | null;
}

export type EditInstance = monaco.editor.IStandaloneCodeEditor;

export declare function useMonacoEdit(options: MonacoOptions): UseMonacoEditReturn;
