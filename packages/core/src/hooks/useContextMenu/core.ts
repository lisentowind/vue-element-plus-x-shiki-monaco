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

export interface UseContextMenuCoreOptions {
  items: ContextMenuItem[];
  target?: string | HTMLDivElement;
  onShow?: () => void;
  onHide?: () => void;
}

export interface ContextMenuState {
  isVisible: boolean;
  position: ContextMenuPosition;
  items: ContextMenuItem[];
}

export class ContextMenuCore {
  private state: ContextMenuState;
  private options: UseContextMenuCoreOptions;
  private listeners: {
    onStateChange?: (state: ContextMenuState) => void;
  } = {};

  constructor(options: UseContextMenuCoreOptions) {
    this.options = options;
    this.state = {
      isVisible: false,
      position: { x: 0, y: 0, direction: "down" },
      items: options.items || [],
    };

    // 绑定事件监听器
    this.bindEvents();
  }

  private bindEvents() {
    document.addEventListener("click", this.handleClickOutside);
    document.addEventListener("contextmenu", this.handleClickOutside);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  private unbindEvents() {
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("contextmenu", this.handleClickOutside);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleClickOutside = (_event: MouseEvent) => {
    if (this.state.isVisible) {
      this.hide();
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.state.isVisible) {
      this.hide();
    }
  };

  private updateState(updates: Partial<ContextMenuState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.onStateChange?.(this.state);
  }

  public show = (
    event: MouseEvent,
    menuItems: ContextMenuItem[],
    target?: HTMLDivElement,
  ) => {
    const targetElement = this.resolveTarget(event, target);
    if (!targetElement) return;

    event.preventDefault();
    event.stopPropagation();

    const position = this.calculatePosition(event, menuItems, targetElement);

    this.updateState({
      isVisible: true,
      position,
      items: menuItems,
    });

    this.options.onShow?.();
  };

  public hide = () => {
    this.updateState({ isVisible: false });
    this.options.onHide?.();
  };

  public handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.action();
      this.hide();
    }
  };

  public updateTarget = (target: HTMLDivElement) => {
    this.options.target = target;
  };

  public getState = () => ({ ...this.state });

  public onStateChange = (callback: (state: ContextMenuState) => void) => {
    this.listeners.onStateChange = callback;
  };

  public destroy = () => {
    this.unbindEvents();
    this.listeners = {};
  };

  private resolveTarget(
    event: MouseEvent,
    target?: HTMLDivElement,
  ): HTMLDivElement | null {
    if (target) {
      return target;
    }

    if (this.options.target instanceof HTMLDivElement) {
      return this.options.target;
    }

    if (typeof this.options.target === "string") {
      return document.querySelector(this.options.target) as HTMLDivElement;
    }

    // 自动查找 Monaco 编辑器容器
    let currentElement = event.target as Element;
    while (currentElement && currentElement !== document.body) {
      if (
        currentElement.classList.contains("monaco-editor") ||
        currentElement.classList.contains("monaco-diff-editor")
      ) {
        return currentElement as HTMLDivElement;
      }
      currentElement = currentElement.parentElement!;
    }

    // 默认查找
    return document.querySelector(".monaco-editor") as HTMLDivElement;
  }

  private calculatePosition(
    event: MouseEvent,
    menuItems: ContextMenuItem[],
    targetElement: HTMLDivElement,
  ): ContextMenuPosition {
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

    const rect = targetElement.getBoundingClientRect();
    const containerTop = rect.top;
    const containerLeft = rect.left;
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const horizontalMargin = 10;
    const verticalMargin = 20;

    // 判断显示方向
    let direction: "down" | "up" = "down";
    let x = mouseX;
    let y = mouseY;

    if (mouseY - containerTop > containerHeight / 2) {
      direction = "up";
      y = mouseY - menuHeight;
    } else {
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

    return { x, y, direction };
  }
}
