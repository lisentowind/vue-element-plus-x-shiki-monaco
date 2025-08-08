import type { LazyFolderItem, UseLazyFolderOptions } from './lazyFolder';
import { computed, ref } from 'vue';
import { createLazyFolder } from './lazyFolder';

export function useLazyFolder() {
    const folderCore = createLazyFolder();

    const folderData = ref<LazyFolderItem[]>([]);
    const isLoading = ref(false);
    const error = ref(folderCore.error);

    /**
     * 读取文件夹
     * @param options 选项
     */
    async function readFolder(options: UseLazyFolderOptions = {}) {
        isLoading.value = true;
        error.value = null;

        try {
            folderData.value = await folderCore.readFolder(options);
            return folderData.value;
        }
        catch (err) {
            error.value = err as any;
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    }

    /**
     * 加载子目录
     * @param item 文件夹项
     */
    async function loadSubdirectory(item: LazyFolderItem) {
        if (item.type !== 'directory' || item.loaded) {
            return item.children || [];
        }

        item.loading = true;

        try {
            const children = await folderCore.loadSubdirectory(item);
            item.children = children;
            item.loaded = true;
            return children;
        }
        catch (err) {
            console.error('加载子目录失败:', err);
            return [];
        }
        finally {
            item.loading = false;
        }
    }

    return {
        folderData,
        isLoading,
        error,
        readFolder,
        loadSubdirectory,
        isSupported: computed(() => folderCore.isSupported),
        environment: computed(() => folderCore.environment),
    };
}
