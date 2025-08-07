import type { Ref } from "vue";
import type {
  ContextMenuItem,
  ContextMenuPosition,
  MenuItem,
  UseContextMenuCoreOptions,
} from "./core";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { ContextMenuCore } from "./core";

export type {
  ContextMenuItem,
  ContextMenuPosition,
  MenuItem,
  MenuItemSeparator,
  UseContextMenuCoreOptions as UseContextMenuOptions,
} from "./core";

export interface UseContextMenuReturn {
  isVisible: Ref<boolean>;
  position: ContextMenuPosition;
  items: Ref<ContextMenuItem[]>;
  show: (
    event: MouseEvent,
    menuItems: ContextMenuItem[],
    target?: HTMLDivElement,
  ) => void;
  hide: () => void;
  handleItemClick: (item: MenuItem) => void;
  updateTarget: (target: HTMLDivElement) => void;
}

export function useContextMenu(
  options: UseContextMenuCoreOptions,
): UseContextMenuReturn {
  const isVisible = ref(false);
  const position = reactive({ x: 0, y: 0, direction: "down" as "down" | "up" });
  const items = ref<ContextMenuItem[]>(options.items || []);

  let contextMenuCore: ContextMenuCore;

  onMounted(() => {
    contextMenuCore = new ContextMenuCore(options);

    // 监听状态变化
    contextMenuCore.onStateChange((state) => {
      isVisible.value = state.isVisible;
      position.x = state.position.x;
      position.y = state.position.y;
      position.direction = state.position.direction || "down";
      items.value = state.items;
    });
  });

  onUnmounted(() => {
    contextMenuCore?.destroy();
  });

  const show = (
    event: MouseEvent,
    menuItems: ContextMenuItem[],
    target?: HTMLDivElement,
  ) => {
    contextMenuCore?.show(event, menuItems, target);
  };

  const hide = () => {
    contextMenuCore?.hide();
  };

  const handleItemClick = (item: MenuItem) => {
    contextMenuCore?.handleItemClick(item);
  };

  const updateTarget = (target: HTMLDivElement) => {
    contextMenuCore?.updateTarget(target);
  };

  return {
    isVisible,
    position,
    items: computed(() => items.value),
    show,
    hide,
    handleItemClick,
    updateTarget,
  };
}
