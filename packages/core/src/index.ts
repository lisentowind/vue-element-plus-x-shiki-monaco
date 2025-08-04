import type { App, Plugin } from "vue";
import ContextMenu from "./components/ContextMenu/index.vue";
import MonacoHeader from "./components/Monaco-Header/index.vue";
import Monaco from "./components/Monaco/index.vue";

export * from "./components";
export * from "./hooks";

const VueShikiMonaco: Plugin = {
  install(app: App) {
    app.component("ContextMenu", ContextMenu);
    app.component("Monaco", Monaco);
    app.component("MonacoHeader", MonacoHeader);
  },
};

export default VueShikiMonaco;
