import type { FolderItem, UseFolderError, UseFolderOptions } from './core';

// 扩展 FolderItem 接口以支持懒加载
export interface LazyFolderItem extends FolderItem {
    loaded?: boolean;
    loading?: boolean;
    handle?: any;
}

export interface UseLazyFolderOptions extends UseFolderOptions {
    initialDepth?: number; // 初始加载的深度
    batchSize?: number; // 每批处理的条目数
    maxEntries?: number; // 最大条目数，超过则截断
}

export interface UseLazyFolderReturn {
    readFolder: (options?: UseLazyFolderOptions) => Promise<LazyFolderItem[]>;
    loadSubdirectory: (item: LazyFolderItem) => Promise<LazyFolderItem[]>;
    isSupported: boolean;
    environment: 'node' | 'browser';
    error: UseFolderError | null;
}

// 检查是否在浏览器环境
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

// 检查是否支持 File System Access API
function isFileSystemApiSupported(): boolean {
    return isBrowser() && 'showDirectoryPicker' in window;
}

/**
 * 创建支持懒加载的文件夹读取 hook
 */
export function createLazyFolder(): UseLazyFolderReturn {
    let _error: UseFolderError | null = null;
    const _environment = isBrowser() ? 'browser' : 'node';
    const _isSupported = isFileSystemApiSupported();

    /**
     * 读取目录结构 - 使用懒加载方式
     * @param dirHandle 目录句柄
     * @param options 选项
     * @param currentPath 当前路径
     * @param currentDepth 当前深度
     */
    async function readDirectoryLazy(
        dirHandle: any,
        options: UseLazyFolderOptions = {},
        currentPath = '',
        currentDepth = 0,
    ): Promise<LazyFolderItem[]> {
        const {
            initialDepth = 1,
            maxEntries = 10000,
            excludePattern,
            includeHidden = false,
        } = options;

        const entries: LazyFolderItem[] = [];
        let count = 0;

        try {
            // 收集所有条目
            const allEntries: [string, any][] = [];
            for await (const entry of dirHandle.entries()) {
                allEntries.push(entry);
                count++;

                // 如果文件数量过多，提前中断以避免性能问题
                if (count > maxEntries) {
                    console.warn(`文件夹包含过多文件(${count}个)，已截断显示`);
                    break;
                }
            }

            // 先处理文件，再处理目录，提高响应速度
            const files = allEntries.filter(([name, handle]) => {
                // 排除隐藏文件
                if (!includeHidden && name.startsWith('.'))
                    return false;
                // 应用排除模式
                if (excludePattern && excludePattern.test(name))
                    return false;
                return handle.kind === 'file';
            });

            const directories = allEntries.filter(([name, handle]) => {
                // 排除隐藏目录
                if (!includeHidden && name.startsWith('.'))
                    return false;
                // 应用排除模式
                if (excludePattern && excludePattern.test(name))
                    return false;
                return handle.kind === 'directory';
            });

            // 处理文件
            for (const [name, handle] of files) {
                const itemPath = currentPath ? `${currentPath}/${name}` : name;
                entries.push({
                    name,
                    path: itemPath,
                    type: 'file',
                    handle,
                });
            }

            // 处理目录
            for (const [name, handle] of directories) {
                const itemPath = currentPath ? `${currentPath}/${name}` : name;

                if (currentDepth < initialDepth) {
                    // 如果未达到初始深度，则加载子目录
                    const children = await readDirectoryLazy(
                        handle,
                        options,
                        itemPath,
                        currentDepth + 1,
                    );

                    entries.push({
                        name,
                        path: itemPath,
                        type: 'directory',
                        children,
                        handle,
                        loaded: true, // 标记为已加载
                    });
                }
                else {
                    // 达到初始深度，创建占位符
                    entries.push({
                        name,
                        path: itemPath,
                        type: 'directory',
                        children: [], // 空数组作为占位符
                        handle,
                        loaded: false, // 标记为未加载
                    });
                }
            }
        }
        catch (error) {
            console.error('读取目录失败:', error);
            _error = {
                code: 'READ_ERROR',
                message: `Failed to read directory: ${currentPath || '/'}`,
                originalError: error as Error,
            };
        }

        // 排序：目录在前，文件在后，按名称字母顺序排序
        return entries.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
    }

    /**
     * 读取文件夹
     * @param options 选项
     */
    async function readFolder(
        options: UseLazyFolderOptions = {},
    ): Promise<LazyFolderItem[]> {
        _error = null;

        try {
            if (!_isSupported) {
                _error = {
                    code: 'BROWSER_NOT_SUPPORTED',
                    message: 'Current browser does not support File System Access API',
                };
                throw new Error(_error.message);
            }

            // 安全检查
            if (typeof window === 'undefined' || !window.showDirectoryPicker) {
                _error = {
                    code: 'BROWSER_NOT_SUPPORTED',
                    message: 'showDirectoryPicker is not available',
                };
                throw new Error(_error.message);
            }

            const dirHandle = await window.showDirectoryPicker();
            return await readDirectoryLazy(dirHandle, options);
        }
        catch (error: any) {
            if (error.name === 'AbortError') {
                _error = {
                    code: 'USER_CANCELLED',
                    message: 'User cancelled directory selection',
                    originalError: error,
                };
            }
            else if (error.name === 'NotAllowedError') {
                _error = {
                    code: 'PERMISSION_DENIED',
                    message: 'Permission denied to access directory',
                    originalError: error,
                };
            }
            else if ((error as UseFolderError).code) {
                _error = error as UseFolderError;
            }
            else {
                _error = {
                    code: 'READ_ERROR',
                    message: 'Failed to read directory in browser',
                    originalError: error,
                };
            }
            // @ts-ignore
            throw new Error(_error);
        }
    }

    /**
     * 懒加载子目录
     * @param item 文件夹项
     */
    async function loadSubdirectory(
        item: LazyFolderItem,
    ): Promise<LazyFolderItem[]> {
        if (item.type !== 'directory' || item.loaded || !item.handle) {
            return item.children || [];
        }

        try {
            // 标记为加载中
            item.loading = true;

            // 加载子目录内容
            const children = await readDirectoryLazy(
                item.handle,
                { initialDepth: 1 },
                item.path,
                0,
            );

            // 更新子目录内容
            item.children = children;
            item.loaded = true;

            return children;
        }
        catch (error) {
            console.error('加载子目录失败:', error);
            return [];
        }
        finally {
            item.loading = false;
        }
    }

    return {
        readFolder,
        loadSubdirectory,
        isSupported: _isSupported,
        environment: _environment,
        error: _error,
    };
}
