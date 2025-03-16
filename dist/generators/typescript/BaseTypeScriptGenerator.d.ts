import { GeneratorConfig } from '../../config';
import { ParsedSchema, SchemaParser } from '../../utils/schema-parser';
import { TemplateManager } from './template/TemplateManager';
import { TypeScriptOptions } from './TypeScriptOptions';
import { FileManager } from './util/FileManager';
import { TypeUtils } from './util/TypeUtils';
/**
 * TypeScript生成器基类
 * 所有TypeScript生成器的基类
 */
export declare abstract class BaseTypeScriptGenerator {
    protected readonly config: GeneratorConfig;
    protected readonly schema: ParsedSchema;
    protected readonly fileManager: FileManager;
    protected readonly options: TypeScriptOptions;
    protected readonly typeUtils: TypeUtils;
    protected readonly templateManager: TemplateManager;
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    abstract getName(): string;
    /**
     * 生成代码
     */
    abstract generate(): Promise<void>;
}
