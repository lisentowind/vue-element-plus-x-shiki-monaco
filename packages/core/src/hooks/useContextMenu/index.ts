import type { Ref } from "vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";

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
  direction?: "down" | "up"; // 添加方向信息
}

export interface UseContextMenuOptions {
  items: ContextMenuItem[];
  target?: string | HTMLDivElement;
  onShow?: () => void;
  onHide?: () => void;
}

export interface UseContextMenuReturn {
  isVisible: Ref<boolean>;
  position: ContextMenuPosition;
  items: Ref<ContextMenuItem[]>;
  show: (event: MouseEvent, menuItems: ContextMenuItem[]) => void;
  hide: () => void;
  handleItemClick: (item: MenuItem) => void;
}

export function useContextMenu(
  options: UseContextMenuOptions,
): UseContextMenuReturn {
  const isVisible = ref(false);
  const position = reactive({ x: 0, y: 0, direction: "down" as "down" | "up" });
  const items = computed(() => options.items);

  // 显示菜单
  const show = (event: MouseEvent, menuItems: ContextMenuItem[]) => {
    let target;
    if (options.target instanceof HTMLDivElement) {
      target = options.target;
    } else {
      target = document.querySelector(".monaco-editor");
    }
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const menuWidth = 200;
    const menuItemHeight = 28;
    const separatorHeight = 6;

    let menuHeight = 8; // padding
    menuItems.forEach((item) => {
      if (item.type === "separator") {
        menuHeight += separatorHeight;
      } else {
        menuHeight += menuItemHeight;
      }
    });

    // 获取编辑器容器相对视口的位置
    const rect = target.getBoundingClientRect();
    const containerTop = rect.top;
    const containerLeft = rect.left;
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    console.log("🚀 ~ show ~ containerHeight:", containerHeight);

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    console.log("mouseY", mouseY);
    console.log("menuHeight", menuHeight);

    const horizontalMargin = 10;
    const verticalMargin = 20;

    // 判断上下方向：基于点击位置是否超过容器中线
    let direction: "down" | "up" = "down";
    let x = mouseX;
    let y = mouseY;
    console.log(
      "mouseY - containerTop > containerHeight / 2",
      mouseY - containerTop > containerHeight / 2,
    );
    if (mouseY - containerTop > containerHeight / 2) {
      // 点击在下半部分，向上显示
      direction = "up";
      y = mouseY - menuHeight;
    } else {
      // 点击在上半部分，向下显示
      direction = "down";
      y = mouseY;
    }

    // 边界修正：横向
    if (x + menuWidth > containerLeft + containerWidth - horizontalMargin) {
      x = containerLeft + containerWidth - menuWidth - horizontalMargin;
    }

    if (x < containerLeft + horizontalMargin) {
      x = containerLeft + horizontalMargin;
    }

    // 边界修正：纵向
    const maxY = containerTop + containerHeight - menuHeight - verticalMargin;
    const minY = containerTop + verticalMargin;
    y = Math.max(minY, Math.min(y, maxY));

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
