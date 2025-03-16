import { GeneratorConfig } from '../../../config';
import { OperationInfo, SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FieldSelectionGenerator } from '../util/FieldSelectionGenerator';
import { FileManager } from '../util/FileManager';
/**
 * 操作生成器接口
 * 所有操作生成器的基类
 */
export declare abstract class OperationGenerator extends BaseTypeScriptGenerator {
    protected readonly fieldSelectionGenerator: FieldSelectionGenerator;
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    abstract getName(): string;
    /**
     * 获取操作类型
     */
    protected abstract getOperationType(): string;
    /**
     * 获取客户端名称
     */
    protected abstract getClientName(): string;
    /**
     * 获取文件名
     */
    protected abstract getFileName(): string;
    /**
     * 获取操作列表
     */
    protected abstract getOperations(): OperationInfo[];
    /**
     * 生成操作方法
     */
    protected generateOperationMethod(operation: OperationInfo): {
        dependencies: string[];
        definition: string;
    };
    /**
     * 收集操作中使用的所有类型
     */
    protected collectOperationTypes(operations: OperationInfo[]): string[];
    /**
     * 生成操作内容
     */
    protected generateOperationsContent(operations: OperationInfo[]): string;
    /**
     * 生成操作
     */
    generate(): Promise<void>;
}
