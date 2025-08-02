import { BundledLanguage, BundledTheme } from 'shiki';
import * as monaco from 'monaco-editor-core';
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
export declare function useMonacoEdit(options: MonacoOptions): UseMonacoEditReturn;
