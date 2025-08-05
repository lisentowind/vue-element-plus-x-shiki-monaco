import type {
  ContextMenuItem,
  ContextMenuPosition,
} from "../../hooks/useContextMenu";

export interface ContextMenuProps {
  visible?: boolean;
  position?: ContextMenuPosition;
  items?: ContextMenuItem[];
  variant?: "classic" | "glass";
  theme?: string; // 添加主题属性用于判断亮暗色
  teleportTarget?: string | HTMLElement; // 添加 teleportTarget 属性 用于指定菜单的挂载目标
}
