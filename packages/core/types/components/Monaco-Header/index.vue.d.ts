import type { BundledLanguage, BundledTheme } from "shiki";

interface Props {
  currentLanguage?: BundledLanguage;
  fileName?: string;
  showToolbar?: boolean;
  theme?: BundledTheme;
}
declare function __VLS_template(): {
  attrs: Partial<{}>;
  slots: {
    toolbar?: (_: {}) => any;
  };
  refs: {};
  rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import("vue").DefineComponent<
  Props,
  {
    getFileName: () => string;
    handleCopy: () => void;
    handleFormat: () => void;
  },
  {},
  {},
  {},
  import("vue").ComponentOptionsMixin,
  import("vue").ComponentOptionsMixin,
  {
    copy: () => any;
    format: () => any;
  },
  string,
  import("vue").PublicProps,
  Readonly<Props> &
    Readonly<{
      onCopy?: (() => any) | undefined;
      onFormat?: (() => any) | undefined;
    }>,
  {
    theme: BundledTheme;
    currentLanguage: BundledLanguage;
    showToolbar: boolean;
  },
  {},
  {},
  {},
  string,
  import("vue").ComponentProvideOptions,
  false,
  {},
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
