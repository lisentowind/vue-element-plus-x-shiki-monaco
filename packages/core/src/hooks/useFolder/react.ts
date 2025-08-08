import type { FolderItem, UseFolderError, UseFolderOptions } from "./core";
import { useCallback, useRef, useState } from "react";
import { createFolderCore } from "./core";

export interface UseFolderReactReturn {
  readFolder: (options?: UseFolderOptions) => Promise<FolderItem[]>;
  folders: FolderItem[];
  isLoading: boolean;
  error: UseFolderError | null;
  isSupported: boolean;
  environment: "node" | "browser";
  refresh: (options?: UseFolderOptions) => Promise<void>;
}

export function useFolder(
  initialOptions?: UseFolderOptions,
): UseFolderReactReturn {
  const coreRef = useRef(createFolderCore());
  const core = coreRef.current;

  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UseFolderError | null>(null);

  const readFolder = useCallback(
    async (options?: UseFolderOptions): Promise<FolderItem[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await core.readFolder({ ...initialOptions, ...options });
        setFolders(result);
        return result;
      } catch (err) {
        const folderError = err as UseFolderError;
        setError(folderError);
        throw folderError;
      } finally {
        setIsLoading(false);
      }
    },
    [core, initialOptions],
  );

  const refresh = useCallback(
    async (options?: UseFolderOptions): Promise<void> => {
      await readFolder(options);
    },
    [readFolder],
  );

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
