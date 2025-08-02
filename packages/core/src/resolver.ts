// 组件名与路径映射，支持 unplugin-vue-components 自动导入
export const resolverHelper = {
  // 组件解析器
  components: {
    Monaco: () => import('@vue-element-plus-x-shiki-monaco/core/Monaco'),
  },
  
  // 样式解析器
  styles: {
    Monaco: '@vue-element-plus-x-shiki-monaco/core/Monaco/style.css',
  },
  
  // 自定义解析器函数
  resolver: (componentName: string) => {
    const componentMap = {
      'Monaco': {
        name: 'Monaco',
        from: '@vue-element-plus-x-shiki-monaco/core/Monaco',
        sideEffects: '@vue-element-plus-x-shiki-monaco/core/Monaco/style.css'
      }
    };
    
    return componentMap[componentName as keyof typeof componentMap];
  }
};

export default resolverHelper;