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

export interface FolderItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  lastModified?: Date;
  children?: FolderItem[];
  isExpanded?: boolean;
  level?: number;
}

export interface FolderTreeItem extends FolderItem {
  isExpanded: boolean;
  level: number;
}

export interface FolderTreeProps {
  folderItems?: FolderItem[];
  isLoading?: boolean;
  error?: UseFolderError | null;
  theme?: "light" | "dark";
  width?: string | number;
  height?: string | number;
  showHidden?: boolean;
  expandByDefault?: boolean;
  variant?: "vscode" | "classic";
}
