import type { Ref } from "vue";
import type { FolderItem, UseFolderError, UseFolderOptions } from "./core";
import { ref } from "vue";
import { createFolderCore } from "./core";

export interface UseFolderVueReturn {
  readFolder: (options?: UseFolderOptions) => Promise<FolderItem[]>;
  folders: Ref<FolderItem[]>;
  isLoading: Ref<boolean>;
  error: Ref<UseFolderError | null>;
  isSupported: boolean;
  environment: "node" | "browser";
  refresh: (options?: UseFolderOptions) => Promise<void>;
}

export function useFolder(
  initialOptions?: UseFolderOptions,
): UseFolderVueReturn {
  const core = createFolderCore();

  const folders = ref<FolderItem[]>([]);
  const isLoading = ref(false);
  const error = ref<UseFolderError | null>(null);

  const readFolder = async (
    options?: UseFolderOptions,
  ): Promise<FolderItem[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await core.readFolder({ ...initialOptions, ...options });
      folders.value = result;
      return result;
    } catch (err) {
      error.value = err as UseFolderError;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const refresh = async (options?: UseFolderOptions): Promise<void> => {
    await readFolder(options);
  };

  return {
    readFolder,
    folders,
    isLoading,
    error,
    isSupported: core.isSupported,
    environment: core.environment,
    refresh,
  };
}
