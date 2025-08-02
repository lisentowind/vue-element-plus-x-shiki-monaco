import type { DefineComponent } from 'vue';
import type { BundledLanguage, BundledTheme } from 'shiki';
import type { EditInstance } from '../../hooks/useMonacoEdit';

export interface MonacoProps {
  language?: BundledLanguage;
  theme?: BundledTheme;
  value?: string;
  height?: string;
  showToolbar?: boolean;
}

export interface MonacoEmits {
  change: (value: string) => void;
  ready: (editor: EditInstance) => void;
}

export interface MonacoExpose {
  getEditor: () => EditInstance | null;
  setValue: (value: string) => void;
  getValue: () => string;
  focus: () => void;
  copyCode: () => Promise<void>;
  formatCode: () => void;
}

declare const Monaco: DefineComponent<MonacoProps, {}, {}, {}, {}, {}, {}, MonacoEmits, string, {}, string, MonacoExpose>;

export default Monaco;