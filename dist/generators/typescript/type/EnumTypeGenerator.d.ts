import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';
/**
 * 枚举类型生成器
 * 负责生成GraphQL枚举类型的TypeScript代码
 */
export declare class EnumTypeGenerator extends BaseTypeScriptGenerator {
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 生成枚举类型内容
     */
    private generateEnumTypeContent;
    /**
     * 生成枚举类型
     */
    generate(): Promise<void>;
}
