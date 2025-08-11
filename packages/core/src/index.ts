import type { App, Plugin } from "vue";
import ContextMenu from "./components/ContextMenu/index.vue";
import FolderTree from "./components/FolderTree/index.vue";
import FullEditor from "./components/FullEditor/index.vue";
import MonacoDiff from "./components/Monaco-Diff/index.vue";
import MonacoHeader from "./components/Monaco-Header/index.vue";
import Monaco from "./components/Monaco/index.vue";

export * from "./components";
export * from "./hooks";

const VueShikiMonaco: Plugin = {
  install(app: App) {
    app.component("ContextMenu", ContextMenu);
    app.component("FolderTree", FolderTree);
    app.component("FullEditor", FullEditor);
    app.component("Monaco", Monaco);
    app.component("MonacoDiff", MonacoDiff);
    app.component("MonacoHeader", MonacoHeader);
  },
};

export default VueShikiMonaco;
