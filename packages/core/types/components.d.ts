// Component exports for tree-shaking support
export * from './components';

// Individual component exports
export type { MonacoProps, MonacoEmits, MonacoWithInstallType } from './components/Monaco';
export type { default as Monaco } from './components/Monaco';
export type { default as MonacoWithInstall } from './components/Monaco/install';
