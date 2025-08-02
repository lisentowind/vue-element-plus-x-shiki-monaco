// oxlint-disable no-console
import { exec } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

interface ComponentInfo {
  name: string;
  path: string;
  dirName: string;  // 添加目录名
  hasInstall?: boolean;
}

interface HookInfo {
  name: string;
  path: string;
  types: string[];
}

async function generateTypes() {
  console.log('🔄 Generating TypeScript declaration files...');
  
  try {
    const cwd = process.cwd();
    const typesDir = resolve(cwd, 'types');
    
    // 1. 清理types目录
    if (existsSync(typesDir)) {
      rmSync(typesDir, { recursive: true });
    }
    mkdirSync(typesDir, { recursive: true });
    
    // 2. 使用TypeScript编译器生成基础类型结构
    console.log('📝 Generating types from TypeScript...');
    try {
      await execAsync('npx tsc -p tsconfig.types.json --allowJs false');
      console.log('✅ TypeScript compilation completed');
    } catch (error) {
      console.warn('⚠️ TypeScript compilation had issues, proceeding with manual generation...');
    }
    
    // 3. 扫描组件和hooks信息
    const components = await scanComponents(cwd);
    const hooks = await scanHooks(cwd);
    
    // 4. 生成Vue组件的类型定义
    console.log('🎨 Generating Vue component types...');
    await generateComponentTypes(cwd, components, typesDir);
    
    // 5. 确保hooks类型完整性
    console.log('🔧 Ensuring hooks types completeness...');
    await ensureHooksTypes(cwd, hooks, typesDir);
    
    // 6. 生成聚合导出类型文件
    console.log('📦 Generating export type files...');
    await generateExportTypes(components, hooks, typesDir);
    
    console.log('✅ TypeScript declaration files generated successfully!');
    console.log(`📁 Generated files:`);
    console.log(`   - types/index.d.ts (complete types)`);
    console.log(`   - types/components.d.ts (component types)`);
    console.log(`   - types/hooks.d.ts (hooks types)`);
    console.log(`   - types/components/ (individual component types)`);
    console.log(`   - types/hooks/ (individual hook types)`);
    
  } catch (error) {
    console.error('❌ Error generating types:', error);
    process.exit(1);
  }
}

// 扫描组件信息
async function scanComponents(cwd: string): Promise<ComponentInfo[]> {
  const componentsDir = resolve(cwd, 'src/components');
  const components: ComponentInfo[] = [];

  if (!existsSync(componentsDir)) return components;
  
  const dirs = readdirSync(componentsDir);
  
  for (const dir of dirs) {
    if (dir === 'index.ts') continue;
    
    const compPath = resolve(componentsDir, dir, 'index.vue');
    const installPath = resolve(componentsDir, dir, 'install.ts');
    
    if (existsSync(compPath)) {
      const compName = dir.replace(/(^\w|-\w)/g, (m: string) =>
        m.replace('-', '').toUpperCase());
      
      components.push({
        name: compName,
        dirName: dir,  // 存储原始目录名
        path: `./components/${dir}/index.vue`,
        hasInstall: existsSync(installPath),
      });
    }
  }
  
  return components;
}

// 扫描hooks信息
async function scanHooks(cwd: string): Promise<HookInfo[]> {
  const hooksDir = resolve(cwd, 'src/hooks');
  const hooks: HookInfo[] = [];

  if (!existsSync(hooksDir)) return hooks;
  
  const dirs = readdirSync(hooksDir);
  
  for (const dir of dirs) {
    if (dir === 'index.ts') continue;
    
    const hookPath = resolve(hooksDir, dir, 'index.ts');
    
    if (existsSync(hookPath)) {
      const content = readFileSync(hookPath, 'utf-8');
      const types = extractExportedTypes(content);
      
      hooks.push({
        name: dir,
        path: `./hooks/${dir}`,
        types,
      });
    }
  }
  
  return hooks;
}

// 提取导出的类型
function extractExportedTypes(content: string): string[] {
  const typeExports = content.match(/export\s+(?:type\s+)?\{\s*([^}]+)\s*\}/g) || [];
  const types: string[] = [];

  typeExports.forEach((exp) => {
    const match = exp.match(/\{\s*([^}]+)\s*\}/);
    if (match) {
      const exports = match[1].split(',').map(e => e.trim().replace(/^type\s+/, ''));
      types.push(...exports);
    }
  });

  return types;
}

// 生成Vue组件类型定义
async function generateComponentTypes(cwd: string, components: ComponentInfo[], typesDir: string): Promise<void> {
  const componentsTypesDir = resolve(typesDir, 'components');
  
  // 确保components类型目录存在
  if (!existsSync(componentsTypesDir)) {
    mkdirSync(componentsTypesDir, { recursive: true });
  }
  
  for (const component of components) {
    const componentDir = resolve(cwd, 'src/components', component.dirName);  // 使用dirName
    const vueFilePath = resolve(componentDir, 'index.vue');
    
    if (existsSync(vueFilePath)) {
      const vueContent = readFileSync(vueFilePath, 'utf-8');
      
      // 提取Props接口
      let propsInterface = '';
      const propsMatch = vueContent.match(/interface\s+Props\s*\{([^}]+)\}/s);
      if (propsMatch) {
        const propsContent = propsMatch[1]
          .replace(/\s*\/\/.*$/gm, '') // 移除注释
          .replace(/\s+/g, ' ') // 压缩空白
          .trim();
        propsInterface = `export interface ${component.name}Props {${propsContent}}`;
      } else {
        propsInterface = `export interface ${component.name}Props {\n  [key: string]: any;\n}`;
      }
      
      // 提取Emits接口  
      let emitsInterface = '';
      const emitsMatch = vueContent.match(/defineEmits<\{([^}]+)\}>/s);
      if (emitsMatch) {
        const emitsContent = emitsMatch[1]
          .replace(/\s*\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();
        emitsInterface = `export interface ${component.name}Emits {${emitsContent}}`;
      } else {
        emitsInterface = `export interface ${component.name}Emits {\n  [key: string]: any;\n}`;
      }
      
      // 生成组件类型文件
      const componentTypeContent = `import type { DefineComponent, App } from 'vue';
import type { BundledLanguage, BundledTheme } from 'shiki';
import type * as monaco from 'monaco-editor-core';

// Re-export hook types needed by components
export type EditInstance = monaco.editor.IStandaloneCodeEditor;

// ${component.name} Component Props
${propsInterface}

// ${component.name} Component Emits
${emitsInterface}

// ${component.name} Component Type
export declare const ${component.name}: DefineComponent<${component.name}Props, {}, {}, {}, {}, {}, {}, ${component.name}Emits>;

// ${component.name} With Install Type
export interface ${component.name}WithInstallType extends DefineComponent<${component.name}Props, {}, {}, {}, {}, {}, {}, ${component.name}Emits> {
  install: (app: App) => void;
  name: string;
}

export declare const ${component.name}WithInstall: ${component.name}WithInstallType;

// Default export
export default ${component.name};
`;
      
      // 创建组件类型文件目录
      const componentTypeDir = resolve(componentsTypesDir, component.dirName);  // 使用dirName
      if (!existsSync(componentTypeDir)) {
        mkdirSync(componentTypeDir, { recursive: true });
      }
      
      // 写入组件类型文件
      writeFileSync(resolve(componentTypeDir, 'index.d.ts'), componentTypeContent);
      
      // 如果有install.ts，生成对应类型
      if (component.hasInstall) {
        const installTypeContent = `import type { App } from 'vue';
import type { ${component.name}, ${component.name}WithInstallType } from './index';

declare const ${component.name}WithInstall: ${component.name}WithInstallType;

export default ${component.name}WithInstall;
`;
        writeFileSync(resolve(componentTypeDir, 'install.d.ts'), installTypeContent);
      }
    }
  }
  
  // 生成components/index.d.ts
  const componentsIndexContent = components.map(c => 
    `export * from './${c.dirName}';`  // 使用dirName
  ).join('\n') + '\n';
  
  writeFileSync(resolve(componentsTypesDir, 'index.d.ts'), componentsIndexContent);
}

// 确保hooks类型完整性
async function ensureHooksTypes(cwd: string, hooks: HookInfo[], typesDir: string): Promise<void> {
  const hooksTypesDir = resolve(typesDir, 'hooks');
  
  // 如果TypeScript编译已经生成了hooks类型，确保index.d.ts存在
  if (existsSync(hooksTypesDir)) {
    // 生成hooks/index.d.ts
    const hooksIndexContent = hooks.map(h => 
      `export * from './${h.name}';`
    ).join('\n') + '\n';
    
    writeFileSync(resolve(hooksTypesDir, 'index.d.ts'), hooksIndexContent);
  } else {
    // 如果没有生成，手动创建
    mkdirSync(hooksTypesDir, { recursive: true });
    
    for (const hook of hooks) {
      const hookDir = resolve(hooksTypesDir, hook.name);
      mkdirSync(hookDir, { recursive: true });
      
      // 读取原始hook文件并生成类型
      const hookFilePath = resolve(cwd, 'src/hooks', hook.name, 'index.ts');
      const hookContent = readFileSync(hookFilePath, 'utf-8');
      
      // 简单的类型提取（这里可以进一步优化）
      const typeContent = hookContent
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?/g, '') // 移除import
        .replace(/^(?!export\s).*$/gm, '') // 只保留export行
        .replace(/export\s+function/g, 'export declare function')
        .replace(/\{[\s\S]*?\}/g, ';'); // 简化函数体
        
      writeFileSync(resolve(hookDir, 'index.d.ts'), typeContent);
    }
    
    // 生成hooks/index.d.ts
    const hooksIndexContent = hooks.map(h => 
      `export * from './${h.name}';`
    ).join('\n') + '\n';
    
    writeFileSync(resolve(hooksTypesDir, 'index.d.ts'), hooksIndexContent);
  }
}

// 生成聚合导出类型文件
async function generateExportTypes(components: ComponentInfo[], hooks: HookInfo[], typesDir: string): Promise<void> {
  // 生成components.d.ts
  const componentsTypesContent = `// Component exports for tree-shaking support
export * from './components';

// Individual component exports
${components.map(c => `export type { ${c.name}Props, ${c.name}Emits, ${c.name}WithInstallType } from './components/${c.dirName}';`).join('\n')}
${components.map(c => `export type { default as ${c.name} } from './components/${c.dirName}';`).join('\n')}
${components.filter(c => c.hasInstall).map(c => `export type { default as ${c.name}WithInstall } from './components/${c.dirName}/install';`).join('\n')}
`;

  // 生成hooks.d.ts
  const hooksTypesContent = `// Hook exports for tree-shaking support
export * from './hooks';
`;

  // 生成index.d.ts
  const indexTypesContent = `import type { App, Plugin } from 'vue';

// Re-export all component types
export * from './components';

// Re-export all hook types
export * from './hooks';

// Plugin type
export declare const VueElementPlusXShikiMonaco: Plugin;
export default VueElementPlusXShikiMonaco;
`;

  // 写入文件
  writeFileSync(resolve(typesDir, 'components.d.ts'), componentsTypesContent);
  writeFileSync(resolve(typesDir, 'hooks.d.ts'), hooksTypesContent);
  writeFileSync(resolve(typesDir, 'index.d.ts'), indexTypesContent);
}

// 执行类型生成
generateTypes();