# Vue Element Plus X Shiki Monaco 使用指南

## 安装

```bash
npm install @vue-element-plus-x-shiki-monaco/core
```

## 自动化导出生成

本包使用自动化脚本生成所有导出文件，确保一致性和完整性：

```bash
npm run generate:exports  # 自动生成所有导出文件
npm run build            # 构建前会自动运行导出生成
```

### 自动生成的文件

- `src/index.ts` - 主入口文件
- `src/components.ts` - 仅组件导出
- `src/hooks.ts` - 仅hooks导出  
- `src/types.ts` - 类型定义文件
- `src/resolver.ts` - 自动导入解析器
- `types/` 目录下的所有类型声明文件

## 导入方式

### 全量导入

```typescript
import VueElementPlusXShikiMonaco from '@vue-element-plus-x-shiki-monaco/core';
import type { MonacoProps } from '@vue-element-plus-x-shiki-monaco/core';

app.use(VueElementPlusXShikiMonaco);
```

### 按需导入组件

```typescript
// 导入单个组件
import { Monaco } from '@vue-element-plus-x-shiki-monaco/core';
// 或使用 MonacoWithInstall 获得安装能力
import { MonacoWithInstall } from '@vue-element-plus-x-shiki-monaco/core';

// 仅导入组件（不包含插件）
import { Monaco } from '@vue-element-plus-x-shiki-monaco/core/components';
```

### 按需导入 Hooks

```typescript
// 导入 hooks
import { useMonacoEdit } from '@vue-element-plus-x-shiki-monaco/core';
import type { UseMonacoEditReturn } from '@vue-element-plus-x-shiki-monaco/core';

// 仅导入 hooks
import { useMonacoEdit } from '@vue-element-plus-x-shiki-monaco/core/hooks';
```

### 导入类型

```typescript
import type { 
  MonacoInstance, 
  MonacoProps, 
  EditInstance, 
  MonacoOptions, 
  UseMonacoEditReturn 
} from '@vue-element-plus-x-shiki-monaco/core';
```

## 自动导入配置

### 使用 unplugin-vue-components

```typescript
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { resolverHelper } from '@vue-element-plus-x-shiki-monaco/core/resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [resolverHelper.resolver],
    }),
  ],
});
```

### 使用 unplugin-auto-import

```typescript
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        {
          '@vue-element-plus-x-shiki-monaco/core': ['useMonacoEdit'],
        },
      ],
    }),
  ],
});
```

## Tree-shaking 支持

包已配置为支持 Tree-shaking：

- ✅ ES 模块格式
- ✅ 标记为无副作用 (`"sideEffects": false`)
- ✅ 组件和 hooks 可单独导入
- ✅ 类型定义完善
- ✅ 自动化生成确保一致性

## 模块格式支持

| 格式 | 入口文件 | 用途 |
|------|----------|------|
| ESM | `dist/es/index.mjs` | 现代打包工具 (Vite, Rollup) |
| CommonJS | `dist/cjs/index.cjs` | Node.js 和旧版打包工具 |
| UMD | `dist/umd/index.js` | 浏览器直接引入 |
| TypeScript | `types/index.d.ts` | 类型定义 |

## 导出路径一览

- `/` - 主入口，包含所有功能
- `/components` - 所有组件
- `/hooks` - 所有 hooks
- `/Monaco` - Monaco 组件
- `/types` - 类型定义
- `/resolver` - 自动导入解析器

## 开发工作流

1. 添加新组件/hooks后，运行 `npm run generate:exports` 自动更新导出
2. 脚本会自动扫描 `src/components/` 和 `src/hooks/` 目录
3. 生成对应的索引文件和类型声明
4. 更新 `package.json` 的 `exports` 字段以支持新的导出路径