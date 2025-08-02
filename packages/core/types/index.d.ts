import { BundledLanguage, BundledTheme } from "shiki";
import * as monaco from "monaco-editor-core";

//#region src/hooks/useMonacoEdit/index.d.ts
interface MonacoOptions {
  target: HTMLElement;
  languages: BundledLanguage[];
  codeValue: string;
  themes: BundledTheme[];
  defaultTheme: BundledTheme;
  defaultLanguage: BundledLanguage;
}
type EditInstance = monaco.editor.IStandaloneCodeEditor;
interface UseMonacoEditReturn {
  initMonacoEdit: () => Promise<EditInstance>;
  destroy: () => void;
  registerLanguage: (language: string) => void;
  editInstance: EditInstance | null;
}
declare function useMonacoEdit(options: MonacoOptions): UseMonacoEditReturn;
//#endregion
export { type EditInstance, type MonacoOptions, type UseMonacoEditReturn, useMonacoEdit };