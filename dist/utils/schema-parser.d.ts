export interface FieldInfo {
    name: string;
    type: string;
    required: boolean;
}
export interface TypeInfo {
    name: string;
    kind: 'object' | 'input' | 'enum';
    fields?: FieldInfo[];
    values?: string[];
}
export interface OperationInfo {
    name: string;
    type: 'query' | 'mutation' | 'subscription';
    returnType: string;
    arguments: FieldInfo[];
}
export interface ParsedSchema {
    types: TypeInfo[];
    enums: TypeInfo[];
    models: TypeInfo[];
    inputs: TypeInfo[];
    queries: OperationInfo[];
    mutations: OperationInfo[];
    subscriptions: OperationInfo[];
    operations: {
        queries: OperationInfo[];
        mutations: OperationInfo[];
        subscriptions: OperationInfo[];
    };
    fragments?: any[];
}
export declare class SchemaParser {
    private schemaPath;
    private schema;
    private document;
    constructor(schemaPath: string);
    /**
     * 初始化解析器
     */
    initialize(): Promise<void>;
    /**
     * 解析 schema
     */
    parse(): ParsedSchema;
    /**
     * 解析类型定义
     */
    private parseTypes;
    /**
     * 解析操作定义
     */
    private parseOperations;
    /**
     * 获取类型名称
     */
    private getTypeName;
}
