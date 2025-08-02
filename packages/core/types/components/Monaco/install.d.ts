import { App } from 'vue';
import { default as MonacoComponent } from './index.vue';
declare const Monaco: typeof MonacoComponent & {
    install: (app: App) => void;
};
export default Monaco;
