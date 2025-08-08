import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// 扩展 Window 接口以支持 File System Access API
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }

  interface FileSystemDirectoryHandle extends FileSystemHandle {
    entries: () => AsyncIterableIterator<[string, FileSystemHandle]>;
  }

  interface FileSystemHandle {
    readonly kind: "file" | "directory";
    readonly name: string;
  }

  interface FileSystemFileHandle extends FileSystemHandle {
    readonly kind: "file";
    getFile: () => Promise<File>;
  }
}

// 自定义错误类
class UseFolderException extends Error {
  code:
    | "BROWSER_NOT_SUPPORTED"
    | "USER_CANCELLED"
    | "PERMISSION_DENIED"
    | "NODE_ERROR"
    | "READ_ERROR";

  originalError?: Error | undefined;

  constructor(
    code: UseFolderException["code"],
    message: string,
    originalError?: Error,
  ) {
    super(message);
    this.name = "UseFolderException";
    this.code = code;
    this.originalError = originalError;
    // 修复继承 Error 的问题，确保 instanceof 工作正常
    Object.setPrototypeOf(this, UseFolderException.prototype);
  }
}

export interface FolderItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  lastModified?: Date;
  children?: FolderItem[];
}

export interface UseFolderError {
  code:
    | "BROWSER_NOT_SUPPORTED"
    | "USER_CANCELLED"
    | "PERMISSION_DENIED"
    | "NODE_ERROR"
    | "READ_ERROR";
  message: string;
  originalError?: Error;
}

export interface UseFolderOptions {
  startPath?: string | undefined;
  maxDepth?: number | undefined;
  excludePattern?: RegExp | undefined;
  includeHidden?: boolean;
  includeStats?: boolean;
}

export interface UseFolderReturn {
  readFolder: (options?: UseFolderOptions) => Promise<FolderItem[]>;
  isSupported: boolean;
  environment: "node" | "browser";
  error: UseFolderError | null;
}

function isNode(): boolean {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  );
}

class FolderCore {
  private _environment: "node" | "browser";
  private _isSupported: boolean;
  private _error: UseFolderError | null = null;

  constructor() {
    this._environment = isNode() ? "node" : "browser";
    this._isSupported = this._checkSupport();
  }

  private _throwError(
    code: UseFolderError["code"],
    message: string,
    originalError?: Error,
  ): never {
    // 直接抛出自定义异常实例，保证抛出的对象符合预期
    throw new UseFolderException(code, message, originalError);
  }

  private _checkSupport(): boolean {
    if (this._environment === "node") {
      try {
        return (
          typeof fs !== "undefined" && typeof fs.readdirSync === "function"
        );
      } catch {
        return false;
      }
    } else {
      return typeof window !== "undefined" && "showDirectoryPicker" in window;
    }
  }

  private _shouldExclude(name: string, options: UseFolderOptions): boolean {
    if (!options.includeHidden && name.startsWith(".")) {
      return true;
    }
    if (options.excludePattern && options.excludePattern.test(name)) {
      return true;
    }
    return false;
  }

  private async _readFolderNode(
    dirPath: string,
    options: UseFolderOptions,
    currentDepth = 0,
  ): Promise<FolderItem[]> {
    try {
      if (options.maxDepth !== undefined && currentDepth >= options.maxDepth) {
        return [];
      }

      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      const result: FolderItem[] = [];

      for (const entry of entries) {
        if (this._shouldExclude(entry.name, options)) {
          continue;
        }

        const fullPath = path.join(dirPath, entry.name);
        const item: FolderItem = {
          name: entry.name,
          path: fullPath,
          type: entry.isDirectory() ? "directory" : "file",
        };

        if (options.includeStats) {
          try {
            const stats = fs.statSync(fullPath);
            item.size = stats.size;
            item.lastModified = stats.mtime;
          } catch (error) {
            console.warn(`Failed to get stats for ${fullPath}:`, error);
          }
        }

        if (entry.isDirectory()) {
          try {
            item.children = await this._readFolderNode(
              fullPath,
              options,
              currentDepth + 1,
            );
          } catch (error) {
            console.warn(`Failed to read directory ${fullPath}:`, error);
            item.children = [];
          }
        }

        result.push(item);
      }

      return result;
    } catch (error) {
      this._throwError(
        "NODE_ERROR",
        `Failed to read directory: ${dirPath}`,
        error as Error,
      );
    }
  }

  private async _readFolderBrowser(
    options: UseFolderOptions,
  ): Promise<FolderItem[]> {
    const defaultOptions: UseFolderOptions = {
      maxDepth: undefined,
      excludePattern: undefined,
      includeHidden: false,
      includeStats: false,
      ...options,
    };

    try {
      if (!this._isSupported) {
        this._throwError(
          "BROWSER_NOT_SUPPORTED",
          "Current browser does not support File System Access API",
        );
      }

      if (!window.showDirectoryPicker) {
        this._throwError(
          "BROWSER_NOT_SUPPORTED",
          "showDirectoryPicker is not available",
        );
      }

      const dirHandle = await window.showDirectoryPicker();

      const walkDirectory = async (
        handle: FileSystemDirectoryHandle,
        currentPath = "",
        currentDepth = 0,
      ): Promise<FolderItem[]> => {
        if (
          defaultOptions.maxDepth !== undefined &&
          currentDepth >= defaultOptions.maxDepth
        ) {
          return [];
        }

        const result: FolderItem[] = [];

        for await (const [name, childHandle] of handle.entries()) {
          if (this._shouldExclude(name, defaultOptions)) {
            continue;
          }

          const itemPath = currentPath ? `${currentPath}/${name}` : name;
          const item: FolderItem = {
            name,
            path: itemPath,
            type: childHandle.kind === "directory" ? "directory" : "file",
          };

          if (childHandle.kind === "file" && defaultOptions.includeStats) {
            try {
              const file = await (
                childHandle as FileSystemFileHandle
              ).getFile();
              item.size = file.size;
              item.lastModified = new Date(file.lastModified);
            } catch (error) {
              console.warn(`Failed to get file stats for ${name}:`, error);
            }
          }

          if (childHandle.kind === "directory") {
            try {
              item.children = await walkDirectory(
                childHandle as FileSystemDirectoryHandle,
                itemPath,
                currentDepth + 1,
              );
            } catch (error) {
              console.warn(`Failed to read directory ${name}:`, error);
              item.children = [];
            }
          }

          result.push(item);
        }

        return result;
      };

      return await walkDirectory(dirHandle);
    } catch (error: any) {
      if (error.name === "AbortError") {
        this._throwError(
          "USER_CANCELLED",
          "User cancelled directory selection",
          error,
        );
      }
      if (error.name === "NotAllowedError") {
        this._throwError(
          "PERMISSION_DENIED",
          "Permission denied to access directory",
          error,
        );
      }
      if ((error as UseFolderError).code) {
        throw error;
      }
      this._throwError(
        "READ_ERROR",
        "Failed to read directory in browser",
        error as Error,
      );
    }
  }

  public async readFolder(
    options: UseFolderOptions = {},
  ): Promise<FolderItem[]> {
    this._error = null;

    const defaultOptions: UseFolderOptions = {
      startPath: this._environment === "node" ? process.cwd() : undefined,
      maxDepth: undefined,
      excludePattern: undefined,
      includeHidden: false,
      includeStats: false,
      ...options,
    };

    try {
      if (!this._isSupported) {
        const error: UseFolderError = {
          code: "BROWSER_NOT_SUPPORTED",
          message: `${this._environment} environment is not supported`,
        };
        throw new UseFolderException(error.code, error.message);
      }

      if (this._environment === "node") {
        const startPath = defaultOptions.startPath || process.cwd();
        return await this._readFolderNode(startPath, defaultOptions);
      } else {
        return await this._readFolderBrowser(defaultOptions);
      }
    } catch (error) {
      this._error = error as UseFolderError;
      throw error;
    }
  }

  public get isSupported(): boolean {
    return this._isSupported;
  }

  public get environment(): "node" | "browser" {
    return this._environment;
  }

  public get error(): UseFolderError | null {
    return this._error;
  }
}

export function createFolderCore(): UseFolderReturn {
  const core = new FolderCore();

  return {
    readFolder: core.readFolder.bind(core),
    isSupported: core.isSupported,
    environment: core.environment,
    error: core.error,
  };
}
