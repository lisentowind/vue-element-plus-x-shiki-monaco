<script lang="ts" setup>
import MonacoDiff from "../../components/Monaco-Diff/index.vue";

// 重复一千次
const mockCode = `
export type {
  ContextMenuItem,
  ContextMenuPosition,
  MenuItem,
  MenuItemSeparator,
  UseContextMenuOptions,
  UseContextMenuReturn,
} from "./useContextMenu";
export { useContextMenu } from "./useContextMenu";

export type { EditorContextMenuOptions } from "./useContextMenu/editorMenu";
export {
  createEditorContextMenu,
  MENU_PRESETS,
} from "./useContextMenu/editorMenu";

// 直接从具体hook导出，避免中间层
export type {
  EditInstance,
  MonacoOptions,
  UseMonacoEditReturn,
} from "./useMonacoEdit";
export { useMonacoEdit } from "./useMonacoEdit";


`;

const mockCodeUpperCase = `
export type {
  ContextMenuItem,
  ContextMenuPosition,
  MenuItem,
  MenuItemSeparator,
  UseContextMenuOptions,
  UseContextMenuReturn,
} from "./useContextMenu";
export { useContextMenu } from "./useContextMenu";

export type { EditorContextMenuOptions } from "./useContextMenu/editorMenu";
export {
  createEditorContextMenu,
  createMinimapContextMenu,
  MENU_PRESETS,
  MINIMAP_MENU_PRESETS,
} from "./useContextMenu/editorMenu";

export type {
  CreateModelType,
  DiffEditInstance,
  DiffViewOptions,
  EditModelType,
  MonacoDiffOptions,
  UseMonacoDiffEditReturn,
} from "./useMonacoDiffEdit";
export type { useMonacoDiffEdit } from "./useMonacoDiffEdit";

// 直接从具体hook导出，避免中间层
export type {
  EditInstance,
  MonacoOptions,
  UseMonacoEditReturn,
} from "./useMonacoEdit";

export { useMonacoEdit } from "./useMonacoEdit";

  `;
</script>

<template>
  <MonacoDiff
    v-bind="$attrs"
    :oldModel="mockCode"
    :newModel="mockCodeUpperCase"
  >
  </MonacoDiff>
</template>
