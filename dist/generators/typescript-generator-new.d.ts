import { GeneratorConfig } from '../config';
import { SchemaParser } from '../utils/schema-parser';
import { BaseGenerator } from './base-generator';
import { TypeScriptOptions } from './typescript/TypeScriptOptions';
/**
 * TypeScript生成器
 * 使用模块化设计，将功能拆分为多个小型模块
 */
export declare class TypeScriptGenerator extends BaseGenerator {
    private readonly options;
    private readonly fileManager;
    private readonly typeGenerators;
    private readonly operationGenerators;
    private readonly utilGenerators;
    private readonly fragmentGenerator;
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, options?: TypeScriptOptions);
    /**
     * 生成所有代码
     */
    generate(): Promise<void>;
}
