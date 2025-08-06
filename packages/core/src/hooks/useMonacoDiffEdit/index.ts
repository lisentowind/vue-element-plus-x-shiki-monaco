import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";
import type { ContextMenuItem } from "../useContextMenu";
import { shikiToMonaco } from "@shikijs/monaco";
import * as monaco from "monaco-editor-core";
import { createHighlighter } from "shiki";
import type { UseMonacoEditReturn } from "../useMonacoEdit";

export interface MonacoDiffOptions
  extends monaco.editor.IStandaloneDiffEditorConstructionOptions {
  target: HTMLElement;
  languages: BundledLanguage[];
  themes: BundledTheme[];
  defaultTheme: BundledTheme;
  contextMenu?: {
    enabled?: boolean;
    items?: string[] | "minimal" | "basic" | "full";
    customItems?: ContextMenuItem[];
  };
  diffViewType?: "inline" | "multi" | "default";
}

export type DiffEditInstance = monaco.editor.IStandaloneDiffEditor;

export type DiffViewOptions = Pick<
  monaco.editor.IStandaloneDiffEditorConstructionOptions,
  | "enableSplitViewResizing"
  | "renderSideBySide"
  | "enableSplitViewResizing"
  | "originalEditable"
>;

export type EditModelType =
  | monaco.editor.IDiffEditorModel
  | monaco.editor.IDiffEditorViewModel
  | null;

export type DefaultReturn = Omit<
  UseMonacoEditReturn,
  | "initMonacoEdit"
  | "destroy"
  | "setLanguage"
  | "editInstance"
  | "onContextMenu"
  | "offContextMenu"
>;

export type CreateModelType = monaco.editor.ITextModel;

export interface UseMonacoDiffEditReturn extends DefaultReturn {
  initMonacoDiffEdit: () => Promise<DiffEditInstance>;
  destroy: (target: HTMLElement) => void;
  createModel: (code: string, language: BundledLanguage) => CreateModelType;
  setDiffModel: (model: EditModelType) => void;
  setDiffViewOptions: (type: MonacoDiffOptions["diffViewType"]) => void;
  diffEditInstance: DiffEditInstance | null;
  onOriginalContextMenu: (callback: (event: MouseEvent) => void) => void;
  onModifiedContextMenu: (callback: (event: MouseEvent) => void) => void;
  offOriginalContextMenu: () => void;
  offModifiedContextMenu: () => void;
  onMinimapContextMenu: (callback: (event: MouseEvent) => void) => void;
  offMinimapContextMenu: () => void;
}

export function useMonacoDiffEdit(
  options: MonacoDiffOptions,
): UseMonacoDiffEditReturn {
  let diffEditInstance: DiffEditInstance | null = null;
  let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> | null =
    null;

  // 缓存已加载的主题和语言，避免重复创建 highlighter
  const loadedThemes = new Set<BundledTheme>();
  const loadedLanguages = new Set<BundledLanguage>();

  // 自动尺寸调整相关
  let resizeObserver: ResizeObserver | null = null;
  let autoResizeEnabled = false;

  // 右键菜单相关
  let originalContextMenuCallback: ((event: MouseEvent) => void) | null = null;
  let modifiedContextMenuCallback: ((event: MouseEvent) => void) | null = null;
  let minimapContextMenuCallback: ((event: MouseEvent) => void) | null = null;

  async function initMonacoDiffEdit(): Promise<DiffEditInstance> {
    const {
      target,
      languages,
      themes,
      defaultTheme = "vitesse-light",
      diffViewType = "default",
    } = options;

    try {
      // 先注册语言
      languages.forEach((lang) => {
        monaco.languages.register({ id: lang });
        loadedLanguages.add(lang);
      });

      //  注册 Shiki 主题，并为 Monaco 提供语法高亮
      highlighter = await createShikiHighlighter(themes, languages);

      // 缓存已加载的主题
      themes.forEach((theme) => loadedThemes.add(theme));

      shikiToMonaco(highlighter, monaco);

      const diffViewOptions = getDiffViewOptions(diffViewType);

      diffEditInstance = monaco.editor.createDiffEditor(target, {
        theme: defaultTheme,
        contextmenu: !options.contextMenu, // 禁用默认右键菜单
        automaticLayout: true, // 启用自动布局
        minimap: { enabled: true },
        fontSize: 16,
        ...diffViewOptions,
        ...options,
      });

      // 如果启用了自定义右键菜单，添加事件监听
      if (options.contextMenu?.enabled !== false) {
        setupCustomContextMenu(target);
      }

      return diffEditInstance;
    } catch (error) {
      console.error("Failed to initialize Monaco Editor:", error);
      throw error;
    }
  }

  async function createShikiHighlighter(
    themes: BundledTheme[],
    langs: BundledLanguage[],
  ): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
    // 创建一个可复用的语法高亮器
    return await createHighlighter({
      themes,
      langs,
    });
  }

  function registerLanguage(language: string) {
    monaco.languages.register({ id: language });
  }

  async function setTheme(theme: BundledTheme): Promise<void> {
    if (!diffEditInstance) {
      throw new Error("Editor instance not initialized");
    }

    try {
      // 检查主题是否已经加载
      if (!loadedThemes.has(theme)) {
        // 添加新主题到缓存
        loadedThemes.add(theme);

        // 更新主题列表并重新创建 highlighter
        const newThemes = Array.from(loadedThemes);
        options.themes = newThemes;

        if (highlighter) {
          highlighter = await createShikiHighlighter(
            newThemes,
            Array.from(loadedLanguages),
          );
          shikiToMonaco(highlighter, monaco);
        }
      }

      // 切换 Monaco 编辑器主题
      monaco.editor.setTheme(theme);
    } catch (error) {
      console.error(`Failed to set theme to ${theme}:`, error);
      throw error;
    }
  }

  function createModel(
    code: string,
    language: BundledLanguage,
  ): CreateModelType {
    return monaco.editor.createModel(code, language);
  }

  function getDiffViewOptions(
    type: MonacoDiffOptions["diffViewType"],
  ): DiffViewOptions {
    switch (type) {
      case "default":
        return { originalEditable: true };

      case "inline":
        return {
          // You can optionally disable the resizing
          enableSplitViewResizing: false,

          // Render the diff inline
          renderSideBySide: false,
        };

      default:
        return {
          // You can optionally disable the resizing
          enableSplitViewResizing: false,
        };
    }
  }

  function setDiffModel(model: EditModelType) {
    if (!diffEditInstance) return;
    diffEditInstance.setModel(model);
  }

  function destroy(target: HTMLElement) {
    if (diffEditInstance) {
      // 清理右键菜单事件监听器
      if (target) {
        target.removeEventListener("contextmenu", handleContextMenu);
      }

      diffEditInstance.dispose();
    }

    // 清理 ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    // 清理右键菜单回调
    originalContextMenuCallback = null;
    modifiedContextMenuCallback = null;
    minimapContextMenuCallback = null;
  }

  function layout(): void {
    if (diffEditInstance) {
      diffEditInstance.layout();
    }
  }

  function enableAutoResize(): void {
    if (!diffEditInstance || autoResizeEnabled) return;

    try {
      resizeObserver = new ResizeObserver(() => {
        if (diffEditInstance) {
          // 使用 requestAnimationFrame 优化性能
          requestAnimationFrame(() => {
            diffEditInstance?.layout();
          });
        }
      });

      resizeObserver.observe(options.target);
      autoResizeEnabled = true;
    } catch (error) {
      console.error("Failed to enable auto resize:", error);
    }
  }

  function disableAutoResize(): void {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
      autoResizeEnabled = false;
    }
  }

  function setDiffViewOptions(type: MonacoDiffOptions["diffViewType"]) {
    if (!diffEditInstance) return;
    //  更新diffEditInstance 的配置
    const getOptions = getDiffViewOptions(type);
    diffEditInstance.updateOptions({
      ...getOptions,
    });
  }

  // 设置自定义右键菜单
  function setupCustomContextMenu(target: HTMLElement): void {
    if (!diffEditInstance) return;

    if (target) {
      target.addEventListener("contextmenu", handleContextMenu);
    }
  }

  // 处理右键菜单事件
  function handleContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // 检查是否点击在minimap区域
    const target = event.target as HTMLElement;
    const isMinimapClick =
      target &&
      (target.closest(".minimap") ||
        target.closest(".minimap-slider") ||
        target.closest(".minimap-decorations-layer") ||
        target.closest(".minimap-shadow-visible") ||
        target.classList.contains("minimap"));

    // 根据点击位置确定使用哪个编辑器的菜单
    const clickedEditor = getClickedEditor(target, event);

    if (isMinimapClick && minimapContextMenuCallback) {
      // 右键点击在minimap区域，调用minimap专用菜单
      minimapContextMenuCallback(event);
    } else if (clickedEditor === "original" && originalContextMenuCallback) {
      // 右键点击在原始编辑器，调用原始编辑器菜单
      originalContextMenuCallback(event);
    } else if (clickedEditor === "modified" && modifiedContextMenuCallback) {
      // 右键点击在修改编辑器，调用修改编辑器菜单
      modifiedContextMenuCallback(event);
    }
  }

  // 判断点击发生在哪个编辑器上
  function getClickedEditor(
    _target: HTMLElement,
    event: MouseEvent,
  ): "original" | "modified" {
    const clickTarget = event.target as HTMLElement;

    // 查找最近的编辑器容器
    const editorContainer = clickTarget.closest(".monaco-editor");
    if (!editorContainer) {
      return "modified";
    }

    // 检查点击目标本身是否在 original 编辑器区域
    if (clickTarget.closest(".original-in-monaco-diff-editor")) {
      return "original";
    }

    // 默认返回 modified
    return "modified";
  }

  // 注册原始编辑器右键菜单回调
  function onOriginalContextMenu(callback: (event: MouseEvent) => void): void {
    originalContextMenuCallback = callback;
  }

  // 注册修改编辑器右键菜单回调
  function onModifiedContextMenu(callback: (event: MouseEvent) => void): void {
    modifiedContextMenuCallback = callback;
  }

  // 注册minimap右键菜单回调
  function onMinimapContextMenu(callback: (event: MouseEvent) => void): void {
    minimapContextMenuCallback = callback;
  }

  // 取消原始编辑器右键菜单回调
  function offOriginalContextMenu(): void {
    originalContextMenuCallback = null;
  }

  // 取消修改编辑器右键菜单回调
  function offModifiedContextMenu(): void {
    modifiedContextMenuCallback = null;
  }

  // 取消minimap右键菜单回调
  function offMinimapContextMenu(): void {
    minimapContextMenuCallback = null;
  }

  return {
    initMonacoDiffEdit,
    destroy,
    registerLanguage,
    setTheme,
    createModel,
    setDiffModel,
    setDiffViewOptions,
    layout,
    enableAutoResize,
    disableAutoResize,
    diffEditInstance,
    onOriginalContextMenu,
    onModifiedContextMenu,
    offOriginalContextMenu,
    offModifiedContextMenu,
    onMinimapContextMenu,
    offMinimapContextMenu,
  };
}
