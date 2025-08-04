import type { BundledLanguage, BundledTheme } from "shiki";
import type { ContextMenuItem } from "../../hooks/useContextMenu";

interface Props {
  currentLanguage?: BundledLanguage;
  currentTheme?: BundledTheme;
  languages?: BundledLanguage[];
  themes?: BundledTheme[];
  value?: string;
  height?: string;
  showToolbar?: boolean;
  autoResize?: boolean;
  monacoEditClass?: string;
  fileName?: string;
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    variant?: "classic" | "glass";
  };
  minimapContextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
    variant?: "classic" | "glass";
  };
}
declare function __VLS_template(): {
  attrs: Partial<{}>;
  slots: {
    toolbar?: (_: {}) => any;
  };
  refs: {
    editorRef: HTMLDivElement;
  };
  rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import("vue").DefineComponent<
  Props,
  {
    getEditor: () =>
      | import("monaco-editor-core").editor.IStandaloneCodeEditor
      | null;
    setValue: (value: string) => void | undefined;
    getValue: () => string;
    focus: () => void | undefined;
    setTheme: (theme: BundledTheme) => Promise<void> | undefined;
    setLanguage: (language: BundledLanguage) => Promise<void> | undefined;
    layout: () => void | undefined;
    enableAutoResize: () => void | undefined;
    disableAutoResize: () => void | undefined;
    copyCode: () => Promise<void>;
    pasteCode: () => Promise<void>;
    formatCode: () => void;
  },
  {},
  {},
  {},
  import("vue").ComponentOptionsMixin,
  import("vue").ComponentOptionsMixin,
  {
    change: (value: string) => any;
    ready: (
      editor: import("monaco-editor-core").editor.IStandaloneCodeEditor,
    ) => any;
  },
  string,
  import("vue").PublicProps,
  Readonly<Props> &
    Readonly<{
      onChange?: ((value: string) => any) | undefined;
      onReady?:
        | ((
            editor: import("monaco-editor-core").editor.IStandaloneCodeEditor,
          ) => any)
        | undefined;
    }>,
  {
    currentLanguage: BundledLanguage;
    showToolbar: boolean;
    height: string;
    languages: BundledLanguage[];
    themes: BundledTheme[];
    contextMenu: {
      enabled?: boolean;
      items?: string[] | "minimal" | "basic" | "full";
      customItems?: ContextMenuItem[];
      variant?: "classic" | "glass";
    };
    value: string;
    currentTheme: BundledTheme;
    autoResize: boolean;
    minimapContextMenu: {
      enabled?: boolean;
      items?: string[] | "minimal" | "basic" | "full";
      customItems?: ContextMenuItem[];
      variant?: "classic" | "glass";
    };
  },
  {},
  {},
  {},
  string,
  import("vue").ComponentProvideOptions,
  false,
  {
    editorRef: HTMLDivElement;
  },
  HTMLDivElement
>;
declare const _default: __VLS_WithTemplateSlots<
  typeof __VLS_component,
  __VLS_TemplateResult["slots"]
>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
  new (): {
    $slots: S;
  };
};
