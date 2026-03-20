declare module 'unplugin-auto-import/vite' {
  import { Plugin } from 'vite';
  
  interface AutoImportOptions {
    resolvers?: any[];
    imports?: string[];
    dts?: string | boolean;
  }
  
  export default function AutoImport(options?: AutoImportOptions): Plugin;
}

declare module 'unplugin-vue-components/vite' {
  import { Plugin } from 'vite';
  
  interface ComponentsOptions {
    resolvers?: any[];
    dts?: string | boolean;
    dirs?: string[];
    extensions?: string[];
    deep?: boolean;
    directoryAsNamespace?: boolean;
    globalNamespaces?: string[];
  }
  
  export default function Components(options?: ComponentsOptions): Plugin;
}

declare module 'unplugin-vue-components/resolvers' {
  export function ElementPlusResolver(): any;
}