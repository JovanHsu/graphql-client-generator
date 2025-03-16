import { OperationInfo } from '../../../utils/schema-parser';
import { OperationGenerator } from './OperationGenerator';
import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { FileManager } from '../util/FileManager';
import { TypeScriptOptions } from '../TypeScriptOptions';
/**
 * 变更操作生成器
 * 负责生成GraphQL变更操作的TypeScript代码
 */
export declare class MutationGenerator extends OperationGenerator {
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, fileManager: FileManager, options: TypeScriptOptions);
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 获取操作类型
     */
    protected getOperationType(): string;
    /**
     * 获取客户端名称
     */
    protected getClientName(): string;
    /**
     * 获取文件名
     */
    protected getFileName(): string;
    /**
     * 获取变更操作列表
     */
    protected getOperations(): OperationInfo[];
}
