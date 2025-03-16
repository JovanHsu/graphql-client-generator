import { GeneratorConfig } from '../config';
import { FieldInfo, OperationInfo, SchemaParser } from '../utils/schema-parser';
import { BaseGenerator } from './base-generator';
interface TypeScriptOptions {
    fragmentsEnabled?: boolean;
    maxFieldsPerType?: number;
    maxTypesPerFile?: number;
    errorHandling?: {
        retryAttempts?: number;
        timeout?: number;
    };
}
export declare class TypeScriptGenerator extends BaseGenerator {
    private readonly options;
    private readonly typeGroups;
    private readonly fragments;
    private readonly generatedFiles;
    constructor(config: GeneratorConfig, schemaParser: SchemaParser, options?: TypeScriptOptions);
    /**
     * 清理之前生成的文件
     */
    private cleanupGeneratedFiles;
    /**
     * 记录生成的文件
     */
    private trackGeneratedFile;
    /**
     * 重写 writeFile 方法以跟踪生成的文件
     */
    protected writeFile(fileName: string, content: string): Promise<void>;
    /**
     * 生成所有代码
     */
    generate(): Promise<void>;
    /**
     * 预处理类型，进行分组
     */
    private preprocessTypes;
    /**
     * 生成类型定义文件
     */
    private generateTypes;
    /**
     * 生成类型定义内容
     */
    private generateTypesContent;
    /**
     * 生成片段文件
     */
    private generateFragments;
    /**
     * 生成操作相关文件
     */
    private generateOperations;
    /**
     * 生成工具类
     */
    private generateUtils;
    /**
     * 生成客户端类
     */
    private generateClient;
    /**
     * 生成类型索引文件
     */
    private generateTypeIndex;
    /**
     * 获取类型的命名空间
     */
    private getTypeNamespace;
    /**
     * 将数组分割成批次
     */
    private splitIntoBatches;
    /**
     * 生成类型片段
     */
    private generateTypeFragment;
    /**
     * 生成枚举定义
     */
    private generateEnumDefinition;
    /**
     * 生成接口定义
     */
    private generateInterfaceDefinition;
    /**
     * 生成操作方法
     */
    private generateOperationMethod;
    /**
     * 根据类型生成字段选择
     */
    private generateFieldSelection;
    /**
     * 收集操作中使用的所有类型
     */
    private collectOperationTypes;
    /**
     * 检查是否是自定义类型
     */
    private isCustomType;
    /**
     * 转换 GraphQL 类型到 TypeScript 类型
     */
    protected convertType(type: string): string;
    /**
     * 生成类型导入语句
     */
    protected generateImports(types: string[]): string;
    /**
     * 生成类型定义
     */
    protected generateTypeDefinition(name: string, fields: FieldInfo[]): string;
    /**
     * 生成操作代码
     */
    protected generateOperation(operation: OperationInfo): string;
    /**
     * 生成特定类型的操作文件
     */
    private generateOperationsByType;
    /**
     * 生成操作内容
     */
    private generateOperationsContent;
    /**
     * 生成订阅操作文件
     */
    private generateSubscriptions;
}
export {};
