export interface GeneratorConfig {
  schemaPath?: string;         // GraphQL schema 文件路径（与 endpoint 二选一）
  endpoint?: string;          // GraphQL 端点 URL（与 schemaPath 二选一）
  schemaFormat?: 'file' | 'endpoint';  // schema 获取方式，默认为 'file'
  documents?: string[];       // GraphQL 操作文件路径（查询和变更），可选
  outputDir: string;         // 输出目录
  language: 'typescript' | 'javascript';  // 目标语言
  framework?: 'react' | 'vue' | 'none';   // 框架支持，可选
  prettier?: {              // 代码格式化选项，可选
    semi?: boolean;
    singleQuote?: boolean;
    tabWidth?: number;
    trailingComma?: 'none' | 'es5' | 'all';
  };
  naming?: {               // 命名约定，可选
    typePrefix?: string;
    typeSuffix?: string;
    enumPrefix?: string;
    enumSuffix?: string;
  };
  plugins?: {             // 插件配置，可选
    [key: string]: any;
  };
}

export const defaultConfig: Partial<GeneratorConfig> = {
  schemaFormat: 'file',
  language: 'typescript',
  framework: 'none',
  prettier: {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
  },
  naming: {
    typePrefix: '',
    typeSuffix: '',
    enumPrefix: '',
    enumSuffix: 'Enum',
  },
};