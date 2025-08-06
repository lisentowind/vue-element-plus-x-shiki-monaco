import type { BundledLanguage, BundledTheme } from "shiki";
import type { MonacoDiffOptions } from "../../hooks";
import type { ContextMenuItem } from "../../hooks/useContextMenu";

export interface MonacoDiffProps {
  oldModel: string;
  newModel: string;
  diffViewType?: MonacoDiffOptions["diffViewType"];
  currentLanguage?: BundledLanguage;
  currentTheme?: BundledTheme;
  languages?: BundledLanguage[];
  themes?: BundledTheme[];
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

  teleportTarget?: string | HTMLElement; // 添加 teleportTarget 属性 用于指定菜单的挂载目标
}
