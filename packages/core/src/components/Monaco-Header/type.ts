import type { BundledLanguage, BundledTheme } from "shiki";

export interface MonacoHeaderProps {
  currentLanguage?: BundledLanguage;
  fileName?: string;
  showToolbar?: boolean;
  theme?: BundledTheme; // 添加主题属性
}
