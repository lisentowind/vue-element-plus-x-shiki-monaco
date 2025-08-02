// oxlint-disable no-console
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src');
const componentsDir = path.join(srcDir, 'components');
const indexPath = path.join(srcDir, 'index.ts');

interface Component {
  name: string;
  path: string;
  type: 'component';
}

interface Hook {
  name: string;
  path: string;
  exports: {
    functions: string[];
    types: string[];
    interfaces: string[];
  };
  type: 'hook';
}

/**
 * 递归扫描目录，查找所有组件
 */
function scanComponents(dir: string, basePath = ''): Component[] {
  const components: Component[] = [];

  if (!fs.existsSync(dir))
    return components;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // 递归扫描子目录
      const subComponents = scanComponents(itemPath, path.join(basePath, item));
      components.push(...subComponents);
    }
    else if (item === 'index.vue') {
      // 找到组件文件
      const componentName = path.basename(basePath) || path.basename(path.dirname(itemPath));
      const relativePath = path.relative(srcDir, itemPath).replace(/\\/g, '/');

      components.push({
        name: componentName,
        path: `./${relativePath}`,
        type: 'component',
      });
    }
  }

  return components;
}

/**
 * 递归扫描所有 hooks 文件
 */
function scanHooks(dir: string, basePath = ''): Hook[] {
  const hooks: Hook[] = [];

  if (!fs.existsSync(dir))
    return hooks;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && item === 'hooks') {
      // 扫描 hooks 目录
      const hookFiles = fs.readdirSync(itemPath);

      for (const hookFile of hookFiles) {
        if (hookFile.endsWith('.ts') && !hookFile.endsWith('.d.ts')) {
          const hookPath = path.join(itemPath, hookFile);
          const relativePath = path.relative(srcDir, hookPath).replace(/\\/g, '/');
          const hookName = path.basename(hookFile, '.ts');

          // 读取文件内容来提取导出
          const content = fs.readFileSync(hookPath, 'utf-8');
          const exports = extractExports(content);

          hooks.push({
            name: hookName,
            path: `./${relativePath.replace('.ts', '')}`,
            exports,
            type: 'hook',
          });
        }
      }
    }
    else if (stat.isDirectory()) {
      // 递归扫描子目录
      const subHooks = scanHooks(itemPath, path.join(basePath, item));
      hooks.push(...subHooks);
    }
  }

  return hooks;
}

/**
 * 从文件内容中提取导出的函数和类型
 */
function extractExports(content: string) {
  const exports = {
    functions: [] as string[],
    types: [] as string[],
    interfaces: [] as string[],
  };

  // 匹配 export function
  const functionMatches = content.match(/export\s+function\s+(\w+)/g);
  if (functionMatches) {
    exports.functions.push(...functionMatches
      .map(m => m.match(/export\s+function\s+(\w+)/)?.[1])
      .filter((name): name is string => name !== undefined));
  }

  // 匹配 export const/let/var (通常是 hooks)
  const constMatches = content.match(/export\s+(?:const|let|var)\s+(\w+)/g);
  if (constMatches) {
    exports.functions.push(...constMatches
      .map(m => m.match(/export\s+(?:const|let|var)\s+(\w+)/)?.[1])
      .filter((name): name is string => name !== undefined));
  }

  // 匹配 export type
  const typeMatches = content.match(/export\s+type\s+(\w+)/g);
  if (typeMatches) {
    exports.types.push(...typeMatches
      .map(m => m.match(/export\s+type\s+(\w+)/)?.[1])
      .filter((name): name is string => name !== undefined));
  }

  // 匹配 export interface
  const interfaceMatches = content.match(/export\s+interface\s+(\w+)/g);
  if (interfaceMatches) {
    exports.interfaces.push(...interfaceMatches
      .map(m => m.match(/export\s+interface\s+(\w+)/)?.[1])
      .filter((name): name is string => name !== undefined));
  }

  return exports;
}

/**
 * 生成导出代码
 */
function generateExports(components: Component[], hooks: Hook[]): string {
  let exportCode = '';

  // 收集所有导出项
  const allExports: Array<{
    path: string;
    type: 'component' | 'function' | 'type';
    content: string;
  }> = [];

  // 添加组件导出
  for (const component of components) {
    // 导出组件本身
    allExports.push({
      path: component.path,
      type: 'component',
      content: `export { default as ${component.name} } from '${component.path}';`,
    });

    // 导出组件类型（如果存在 .d.ts 文件）
    const typePath = component.path.replace(/\.vue$/, '.d');
    if (fs.existsSync(path.join(srcDir, `${typePath.slice(2)}.ts`))) {
      allExports.push({
        path: typePath,
        type: 'type',
        content: `export type { ${component.name}Emits, ${component.name}Expose, ${component.name}Props } from '${typePath}';`,
      });
    }
  }

  // 添加 hooks 导出
  for (const hook of hooks) {
    // 导出函数
    if (hook.exports.functions.length > 0) {
      const functions = hook.exports.functions.sort().join(', ');
      allExports.push({
        path: hook.path,
        type: 'function',
        content: `export { ${functions} } from '${hook.path}';`,
      });
    }

    // 导出类型和接口
    const types = [...hook.exports.types, ...hook.exports.interfaces];
    if (types.length > 0) {
      const typeList = types.sort().join(', ');
      allExports.push({
        path: hook.path,
        type: 'type',
        content: `export type { ${typeList} } from '${hook.path}';`,
      });
    }
  }

  // 按路径排序所有导出
  allExports.sort((a, b) => a.path.localeCompare(b.path));

  // 生成导出代码
  if (allExports.length > 0) {
    exportCode += '// 自动生成的导出\n';
    for (const exportItem of allExports) {
      exportCode += `${exportItem.content}\n`;
    }
  }

  return exportCode;
}

/**
 * 更新 index.ts 文件 - 完全重新生成
 */
function updateIndexFile(exportCode: string): void {
  // 直接写入新内容，完全替换原有文件
  const template = `import type { App } from 'vue'
import pkg from '../package.json'
import * as components from './components'

// 导出所有组件
export * from './components'

// 导出 hooks 和类型
${exportCode}

// 定义组件类型接口
interface ComponentWithInstall {
  install?: (app: App) => void
}

// 默认导出插件对象
export default {
  install(app: App) {
    // 遍历所有组件并安装
    Object.entries(components).forEach(([_componentName, component]) => {
      const typedComponent = component as ComponentWithInstall
      if (typeof typedComponent.install === 'function') {
        typedComponent.install(app)
      }
    })
  },
  // 导出版本号
  version: pkg.version,
}`;

  fs.writeFileSync(indexPath, template);
}

/**
 * 主函数
 */
function main(): void {
  console.log('🔍 扫描组件和 hooks...');

  // 扫描组件
  const components = scanComponents(componentsDir);
  console.log(`✅ 找到 ${components.length} 个组件:`, components.map(c => c.name));

  // 扫描 hooks
  const hooks = scanHooks(srcDir);
  console.log(`✅ 找到 ${hooks.length} 个 hook 文件:`, hooks.map(h => h.name));

  // 生成导出代码
  const exportCode = generateExports(components, hooks);
  console.log('📝 生成的导出代码:');
  console.log(exportCode);

  // 更新 index.ts
  updateIndexFile(exportCode);
  console.log('✅ 已更新 index.ts 文件');

  console.log('🎉 导出生成完成!');
}

// 直接执行 main 函数
main();

export { generateExports, scanComponents, scanHooks, updateIndexFile };
