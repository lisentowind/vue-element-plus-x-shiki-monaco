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
  direction?: 'down' | 'up'; // 添加方向信息
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
  const position = reactive({ x: 0, y: 0, direction: 'down' as 'down' | 'up' });
  const items = ref(options.items);

  // 显示菜单
  const show = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // 计算菜单尺寸（更精确的估算）
    const menuWidth = 200;
    const menuItemHeight = 28; // 进一步减小菜单项高度
    const separatorHeight = 6; // 进一步减小分隔符高度
    
    // 计算实际菜单高度
    let menuHeight = 8; // 容器padding (4px * 2)
    items.value.forEach(item => {
      if (item.type === 'separator') {
        menuHeight += separatorHeight;
      } else {
        menuHeight += menuItemHeight;
      }
    });

    // 获取窗口尺寸
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 设置最大菜单高度为窗口高度的80%
    const maxMenuHeight = Math.min(menuHeight, windowHeight * 0.8);
    
    // 初始位置
    let x = event.clientX;
    let y = event.clientY;
    let direction: 'down' | 'up' = 'down';

    // 检查右边界 - 如果菜单会超出右边，向左偏移
    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 10;
    }

    // 检查下边界 - 如果菜单会超出下边，向上显示
    if (y + maxMenuHeight > windowHeight) {
      // 优先尝试向上显示
      const upwardY = y - maxMenuHeight;
      if (upwardY >= 10) {
        // 向上有足够空间
        y = upwardY;
        direction = 'up';
      } else {
        // 上下都不够，显示在能容纳的最大位置
        y = Math.max(10, windowHeight - maxMenuHeight - 10);
        direction = 'down';
      }
    }

    // 检查左边界
    if (x < 10) {
      x = 10;
    }

    // 检查上边界
    if (y < 10) {
      y = 10;
    }

    position.x = x;
    position.y = y;
    position.direction = direction;
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
