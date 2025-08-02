import { BundledLanguage, BundledTheme } from 'shiki';
import { ContextMenuItem } from '../useContextMenu';
import * as monaco from 'monaco-editor-core';
export interface MonacoOptions {
    target: HTMLElement;
    languages: BundledLanguage[];
    codeValue: string;
    themes: BundledTheme[];
    defaultTheme: BundledTheme;
    defaultLanguage: BundledLanguage;
    contextMenu?: {
        enabled?: boolean;
        items?: string[] | 'minimal' | 'basic' | 'full';
        customItems?: ContextMenuItem[];
    };
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
    onContextMenu: (callback: (event: MouseEvent) => void) => void;
    offContextMenu: () => void;
}
export declare function useMonacoEdit(options: MonacoOptions): UseMonacoEditReturn;
