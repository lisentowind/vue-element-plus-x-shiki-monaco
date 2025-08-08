import type { FolderItem } from "../../components/FolderTree/types";

export const sampleData: FolderItem[] = [
  {
    name: "src",
    path: "/src",
    type: "directory",
    children: [
      {
        name: "components",
        path: "/src/components",
        type: "directory",
        children: [
          {
            name: "Button.vue",
            path: "/src/components/Button.vue",
            type: "file",
            size: 2048,
            lastModified: new Date("2025-08-08"),
          },
          {
            name: "Input.vue",
            path: "/src/components/Input.vue",
            type: "file",
            size: 1536,
            lastModified: new Date("2025-08-07"),
          },
        ],
      },
      {
        name: "assets",
        path: "/src/assets",
        type: "directory",
        children: [
          {
            name: "logo.png",
            path: "/src/assets/logo.png",
            type: "file",
            size: 15360,
            lastModified: new Date("2025-08-06"),
          },
          {
            name: "style.scss",
            path: "/src/assets/style.scss",
            type: "file",
            size: 4096,
            lastModified: new Date("2025-08-05"),
          },
        ],
      },
      {
        name: ".env",
        path: "/src/.env",
        type: "file",
        size: 256,
        lastModified: new Date("2025-08-04"),
      },
    ],
  },
  {
    name: "package.json",
    path: "/package.json",
    type: "file",
    size: 1024,
    lastModified: new Date("2025-08-03"),
  },
  {
    name: "README.md",
    path: "/README.md",
    type: "file",
    size: 512,
    lastModified: new Date("2025-08-02"),
  },
];
