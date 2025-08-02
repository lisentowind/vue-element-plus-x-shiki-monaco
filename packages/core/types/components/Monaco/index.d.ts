import type { DefineComponent, App } from 'vue';
import type { BundledLanguage, BundledTheme } from 'shiki';
import type * as monaco from 'monaco-editor-core';

// Re-export hook types needed by components
export type EditInstance = monaco.editor.IStandaloneCodeEditor;

// Monaco Component Props
export interface MonacoProps {language?: BundledLanguage theme?: BundledTheme value?: string height?: string showToolbar?: boolean}

// Monaco Component Emits
export interface MonacoEmits {change: [value: string] ready: [editor: EditInstance]}

// Monaco Component Type
export declare const Monaco: DefineComponent<MonacoProps, {}, {}, {}, {}, {}, {}, MonacoEmits>;

// Monaco With Install Type
export interface MonacoWithInstallType extends DefineComponent<MonacoProps, {}, {}, {}, {}, {}, {}, MonacoEmits> {
  install: (app: App) => void;
  name: string;
}

export declare const MonacoWithInstall: MonacoWithInstallType;

// Default export
export default Monaco;
