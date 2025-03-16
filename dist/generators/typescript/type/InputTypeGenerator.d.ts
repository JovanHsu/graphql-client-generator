import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';
/**
 * 输入类型生成器
 * 负责生成GraphQL输入类型的TypeScript代码
 */
export declare class InputTypeGenerator extends BaseTypeScriptGenerator {
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 生成输入类型内容
     */
    private generateInputTypeContent;
    /**
     * 生成输入类型
     */
    generate(): Promise<void>;
}
