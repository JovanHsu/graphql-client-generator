import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';
/**
 * 类型索引生成器
 * 负责生成类型索引文件
 */
export declare class TypeIndexGenerator extends BaseTypeScriptGenerator {
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 生成类型索引内容
     */
    private generateTypeIndexContent;
    /**
     * 生成类型索引
     */
    generate(): Promise<void>;
}
