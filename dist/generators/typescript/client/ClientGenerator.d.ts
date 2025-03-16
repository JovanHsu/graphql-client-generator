import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';
/**
 * 客户端生成器
 * 负责生成GraphQL客户端类
 */
export declare class ClientGenerator extends BaseTypeScriptGenerator {
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 生成客户端内容
     */
    private generateClientContent;
    /**
     * 生成客户端
     */
    generate(): Promise<void>;
}
