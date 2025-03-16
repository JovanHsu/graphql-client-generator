export { GeneratorConfig } from './config';
export * from './generators';
export * from './utils/file-system';
export * from './utils/schema-parser';
import { GeneratorConfig } from './config';
/**
 * 生成 GraphQL 客户端代码
 * @param config 生成器配置
 */
export declare function generateClient(config: GeneratorConfig): Promise<void>;
