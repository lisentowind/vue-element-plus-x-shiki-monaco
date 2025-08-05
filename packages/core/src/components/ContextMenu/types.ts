import type {
  ContextMenuItem,
  ContextMenuPosition,
} from "../../hooks/useContextMenu";

export interface ContextMenuProps {
  visible?: boolean;
  position?: ContextMenuPosition;
  items?: ContextMenuItem[];
  variant?: 'classic' | 'glass';
  theme?: string; // 添加主题属性用于判断亮暗色
}
