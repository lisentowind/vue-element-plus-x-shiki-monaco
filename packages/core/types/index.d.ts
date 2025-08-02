import { BundledLanguage, BundledTheme } from "shiki";
import * as monaco from "monaco-editor-core";
import { DefineComponent } from "vue";

//#region src/components/Monaco/hooks/useMonacoEdit.d.ts
interface MonacoOptions {
  target: HTMLElement;
  languages: BundledLanguage[];
  codeValue: string;
  themes: BundledTheme[];
  defaultTheme: BundledTheme;
  defaultLanguage: BundledLanguage;
}
type EditInstance = monaco.editor.IStandaloneCodeEditor;
declare function useMonacoEdit(options: MonacoOptions): {
  initMonacoEdit: () => Promise<EditInstance>;
  destroy: () => void;
  registerLanguage: (language: string) => void;
  editInstance: null;
};
//#endregion
//#region src/components/Monaco/index.d.ts
interface MonacoProps {
  language?: BundledLanguage;
  theme?: BundledTheme;
  value?: string;
  height?: string;
  showToolbar?: boolean;
}
interface MonacoEmits {
  change: (value: string) => void;
  ready: (editor: EditInstance) => void;
}
interface MonacoExpose {
  getEditor: () => EditInstance | null;
  setValue: (value: string) => void;
  getValue: () => string;
  focus: () => void;
  copyCode: () => Promise<void>;
  formatCode: () => void;
}
declare const Monaco: DefineComponent<MonacoProps, {}, {}, {}, {}, {}, {}, MonacoEmits, string, {}, string, MonacoExpose>;
//#endregion
export { type EditInstance, type Monaco, type MonacoEmits, type MonacoExpose, type MonacoOptions, type MonacoProps, useMonacoEdit };