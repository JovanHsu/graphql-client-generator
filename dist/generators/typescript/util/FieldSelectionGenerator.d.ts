import { ParsedSchema } from '../interfaces';
import { TypeUtils } from './TypeUtils';
/**
 * 字段选择项接口，包含字段名和缩进级别
 */
interface FieldSelectionItem {
    name: string;
    depth: number;
    isObjectStart?: boolean;
    isObjectEnd?: boolean;
}
/**
 * 用于生成字段选择的工具类
 */
export declare class FieldSelectionGenerator {
    private readonly schema;
    private readonly typeUtils;
    constructor(schema: ParsedSchema, typeUtils?: TypeUtils);
    /**
     * 生成字段选择项数组
     * @param typeName 类型名称
     * @returns 字段选择项数组
     */
    generateFieldSelectionItems(typeName: string): FieldSelectionItem[];
    /**
     * 生成格式化的字段选择字符串
     * @param typeName 类型名称
     * @param baseIndent 基础缩进级别
     * @returns 格式化的字段选择字符串
     */
    generateFieldSelection(typeName: string, baseIndent?: number): string;
    /**
     * 递归收集字段选择项
     * @param typeName 类型名称
     * @param depth 当前深度
     * @param maxDepth 最大深度
     * @param items 收集的字段选择项数组
     */
    private collectFieldSelectionItems;
    /**
     * 获取基本类型名称（去除数组和非空标记）
     * @param type 类型字符串
     * @returns 基本类型名称
     */
    private getBaseTypeName;
    /**
     * 在schema中查找类型
     * @param typeName 类型名称
     * @returns 类型信息
     */
    private findType;
}
export {};
