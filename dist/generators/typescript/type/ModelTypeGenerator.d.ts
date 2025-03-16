import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';
/**
 * 模型类型生成器
 * 负责生成GraphQL对象类型的TypeScript代码
 */
export declare class ModelTypeGenerator extends BaseTypeScriptGenerator {
    private enumImports;
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 生成模型类型内容
     */
    private generateModelTypeContent;
    /**
     * 生成模型类型
     */
    generate(): Promise<void>;
}
