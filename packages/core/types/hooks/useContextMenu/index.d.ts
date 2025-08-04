import type { Ref } from "vue";

export interface MenuItemSeparator {
  type: "separator";
}
export interface MenuItem {
  type: "item";
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  action: () => void;
}
export type ContextMenuItem = MenuItem | MenuItemSeparator;
export interface ContextMenuPosition {
  x: number;
  y: number;
  direction?: "down" | "up";
}
export interface UseContextMenuOptions {
  items: ContextMenuItem[];
  onShow?: () => void;
  onHide?: () => void;
}
export interface UseContextMenuReturn {
  isVisible: Ref<boolean>;
  position: ContextMenuPosition;
  items: Ref<ContextMenuItem[]>;
  show: (event: MouseEvent) => void;
  hide: () => void;
  handleItemClick: (item: MenuItem) => void;
}
export declare function useContextMenu(
  options: UseContextMenuOptions,
): UseContextMenuReturn;
