import type {
  ContextMenuItem,
  ContextMenuPosition,
  MenuItem,
  UseContextMenuCoreOptions,
} from "./core";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContextMenuCore } from "./core";

export type {
  ContextMenuItem,
  ContextMenuPosition,
  MenuItem,
  MenuItemSeparator,
  UseContextMenuCoreOptions as UseContextMenuOptions,
} from "./core";

export interface UseContextMenuReturn {
  isVisible: boolean;
  position: ContextMenuPosition;
  items: ContextMenuItem[];
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
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({
    x: 0,
    y: 0,
    direction: "down",
  });
  const [items, setItems] = useState<ContextMenuItem[]>(options.items || []);

  const contextMenuCoreRef = useRef<ContextMenuCore | null>(null);

  useEffect(() => {
    const core = new ContextMenuCore(options);
    contextMenuCoreRef.current = core;

    // 监听状态变化
    core.onStateChange((state) => {
      setIsVisible(state.isVisible);
      setPosition(state.position);
      setItems(state.items);
    });

    return () => {
      core.destroy();
    };
  }, []);

  const show = useCallback(
    (
      event: MouseEvent,
      menuItems: ContextMenuItem[],
      target?: HTMLDivElement,
    ) => {
      contextMenuCoreRef.current?.show(event, menuItems, target);
    },
    [],
  );

  const hide = useCallback(() => {
    contextMenuCoreRef.current?.hide();
  }, []);

  const handleItemClick = useCallback((item: MenuItem) => {
    contextMenuCoreRef.current?.handleItemClick(item);
  }, []);

  const updateTarget = useCallback((target: HTMLDivElement) => {
    contextMenuCoreRef.current?.updateTarget(target);
  }, []);

  return {
    isVisible,
    position,
    items,
    show,
    hide,
    handleItemClick,
    updateTarget,
  };
}
