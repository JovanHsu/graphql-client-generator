import { ParsedSchema } from '../interfaces';
/**
 * 类型信息接口
 */
export interface TypeInfo {
    name: string;
    isArray: boolean;
    isRequired: boolean;
}
/**
 * 类型工具类
 * 提供类型处理相关的工具方法
 */
export declare class TypeUtils {
    private readonly schema;
    constructor(schema: ParsedSchema);
    /**
     * 获取类型的命名空间
     */
    getTypeNamespace(typeName: string): string;
    /**
     * 获取枚举名称
     */
    getEnumName(typeName: string): string;
    /**
     * 获取类型名称
     */
    getTypeName(typeName: string): string;
    /**
     * 检查是否是自定义类型
     */
    isCustomType(type: string): boolean;
    /**
     * 转换 GraphQL 类型到 TypeScript 类型
     */
    convertType(type: string): string;
    /**
     * 将数组分割成批次
     */
    splitIntoBatches<T>(items: T[], batchSize: number): T[][];
    /**
     * 获取类型信息
     * @param type 类型字符串
     * @returns 类型信息
     */
    getTypeInfo(type: string): TypeInfo;
    /**
     * 检查是否是基本类型
     * @param typeName 类型名称
     * @returns 是否是基本类型
     */
    isBasicType(typeName: string): boolean;
    /**
     * 检查是否是枚举类型
     * @param typeName 类型名称
     * @returns 是否是枚举类型
     */
    isEnumType(typeName: string): boolean;
}
