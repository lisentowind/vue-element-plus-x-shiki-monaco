export interface TabInfo {
  name: string;
  path: string;
  content: string;
  modified: boolean;
}

export interface FullEditorProps {
  theme?: string;
  sidebarWidth?: number;
  monacoOptions?: Record<string, any>;
}

export interface FullEditorEmits {
  "folder-open": [path: string];
  "file-open": [path: string, content: string];
  "file-save": [path: string, content: string];
  "file-change": [path: string, content: string];
}

export interface FileSystemHandle {
  kind: "file" | "directory";
  name: string;
  getFile?: () => Promise<File>;
  entries?: () => AsyncIterableIterator<[string, FileSystemHandle]>;
}
