import { GeneratorConfig } from '../../config';
import { SchemaParser } from '../../utils/schema-parser';
import { TypeScriptOptions } from './TypeScriptOptions';
/**
 * TypeScript生成器
 * 负责生成GraphQL客户端的TypeScript代码
 */
export declare class TypeScriptGenerator {
    private readonly config;
    private readonly schemaParser;
    private readonly fileManager;
    private readonly options;
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, options?: TypeScriptOptions);
    /**
     * 清理生成的文件
     */
    cleanupGeneratedFiles(): void;
    /**
     * 生成代码
     */
    generate(): Promise<string[]>;
}
