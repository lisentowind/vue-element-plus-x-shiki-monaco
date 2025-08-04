import type { Ref } from "vue";
import { onMounted, onUnmounted, reactive, ref } from "vue";

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

export function useContextMenu(
  options: UseContextMenuOptions
): UseContextMenuReturn {
  const isVisible = ref(false);
  const position = reactive({ x: 0, y: 0 });
  const items = ref(options.items);

  // 显示菜单
  const show = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // 计算菜单位置，避免超出屏幕边界
    const menuWidth = 200; // 预估菜单宽度
    const menuHeight = items.value.length * 32; // 预估菜单高度

    let x = event.clientX;
    let y = event.clientY;

    // 检查右边界
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }

    // 检查下边界
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    // 确保不超出左上边界
    x = Math.max(10, x);
    y = Math.max(10, y);

    position.x = x;
    position.y = y;
    isVisible.value = true;

    options.onShow?.();
  };

  // 隐藏菜单
  const hide = () => {
    isVisible.value = false;
    options.onHide?.();
  };

  // 处理菜单项点击
  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.action();
      hide();
    }
  };

  // 监听点击外部区域隐藏菜单
  const handleClickOutside = (_event: MouseEvent) => {
    if (isVisible.value) {
      hide();
    }
  };

  // 监听ESC键隐藏菜单
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isVisible.value) {
      hide();
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("contextmenu", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
  });

  return {
    isVisible,
    position,
    items,
    show,
    hide,
    handleItemClick,
  };
}
