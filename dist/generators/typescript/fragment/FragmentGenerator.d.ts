import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';
/**
 * 片段生成器
 * 负责生成GraphQL片段的TypeScript代码
 */
export declare class FragmentGenerator extends BaseTypeScriptGenerator {
    private readonly fieldSelectionGenerator;
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 获取片段列表
     */
    private getFragments;
    /**
     * 生成片段内容
     */
    private generateFragmentContent;
    /**
     * 生成片段
     */
    generate(): Promise<void>;
}
