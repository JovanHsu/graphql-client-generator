import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';
/**
 * 工具函数生成器
 * 负责生成GraphQL客户端所需的工具函数
 */
export declare class UtilsGenerator extends BaseTypeScriptGenerator {
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 生成工具函数内容
     */
    private generateUtilsContent;
    /**
     * 生成工具函数
     */
    generate(): Promise<void>;
}
