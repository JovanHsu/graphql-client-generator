import { GeneratorConfig } from '../../config';
import { SchemaParser } from '../../utils/schema-parser';
import { TypeScriptGenerator } from '../typescript/TypeScriptGenerator';
import { TypeGenerator } from './type/TypeGenerator';
import { OperationGenerator } from './operation/OperationGenerator';
import { FileManager } from './util/FileManager';
import { TypeScriptOptions } from './TypeScriptOptions';
/**
 * TypeScript生成器工厂类
 * 负责创建各种生成器实例
 */
export declare class TypeScriptGeneratorFactory {
    /**
     * 创建TypeScript生成器
     */
    static createGenerator(config: GeneratorConfig, schemaParser: SchemaParser, options?: TypeScriptOptions): TypeScriptGenerator;
    /**
     * 创建类型生成器
     */
    static createTypeGenerators(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions): TypeGenerator[];
    /**
     * 创建操作生成器
     */
    static createOperationGenerators(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions): OperationGenerator[];
    /**
     * 创建工具生成器
     */
    static createUtilGenerators(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions): any[];
}
