import { FieldInfo, OperationInfo } from '../utils/schema-parser';
import { BaseGenerator } from './base-generator';
export declare class JavaScriptGenerator extends BaseGenerator {
    /**
     * 生成所有代码
     */
    generate(): Promise<void>;
    /**
     * 生成类型定义文件 (JSDoc)
     */
    private generateTypes;
    /**
     * 生成查询操作文件
     */
    private generateQueries;
    /**
     * 生成变更操作文件
     */
    private generateMutations;
    /**
     * 生成订阅操作文件
     */
    private generateSubscriptions;
    /**
     * 生成客户端类文件
     */
    private generateClient;
    /**
     * 生成操作文件内容
     */
    private generateOperationsFile;
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
     * 转换 GraphQL 类型到 JavaScript 类型
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
}
