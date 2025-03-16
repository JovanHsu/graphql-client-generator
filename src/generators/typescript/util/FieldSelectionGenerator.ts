import { ParsedSchema, TypeInfo } from '../interfaces';
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
export class FieldSelectionGenerator {
  private readonly typeUtils: TypeUtils;

  constructor(
    private readonly schema: ParsedSchema,
    typeUtils?: TypeUtils
  ) {
    this.typeUtils = typeUtils || new TypeUtils(schema);
  }

  /**
   * 生成字段选择项数组
   * @param typeName 类型名称
   * @returns 字段选择项数组
   */
  public generateFieldSelectionItems(typeName: string): FieldSelectionItem[] {
    const items: FieldSelectionItem[] = [];
    this.collectFieldSelectionItems(typeName, 0, 3, items);
    return items;
  }

  /**
   * 生成格式化的字段选择字符串
   * @param typeName 类型名称
   * @param baseIndent 基础缩进级别
   * @returns 格式化的字段选择字符串
   */
  public generateFieldSelection(typeName: string, baseIndent: number = 0): string {
    const items = this.generateFieldSelectionItems(typeName);
    
    // 将字段选择项数组转换为格式化字符串
    return items.map(item => {
      const indent = ' '.repeat(baseIndent + item.depth * 2);
      return `${indent}${item.name}`;
    }).join('\n');
  }

  /**
   * 递归收集字段选择项
   * @param typeName 类型名称
   * @param depth 当前深度
   * @param maxDepth 最大深度
   * @param items 收集的字段选择项数组
   */
  private collectFieldSelectionItems(
    typeName: string,
    depth: number,
    maxDepth: number,
    items: FieldSelectionItem[]
  ): void {
    // 防止无限递归
    if (depth > maxDepth) {
      return;
    }

    // 获取基本类型名称（去除数组和非空标记）
    const baseTypeName = this.getBaseTypeName(typeName);
    
    // 查找类型定义
    const type = this.findType(baseTypeName);
    if (!type || !type.fields) {
      return;
    }

    // 遍历类型的所有字段
    for (const field of type.fields) {
      const fieldName = field.name;
      
      // 添加字段名
      items.push({
        name: fieldName,
        depth: depth
      });

      // 如果字段是对象类型，递归获取其字段
      const fieldType = this.getBaseTypeName(field.type);
      const fieldTypeInfo = this.findType(fieldType);
      
      if (
        fieldTypeInfo &&
        fieldTypeInfo.kind === 'object' &&
        fieldType !== baseTypeName // 避免循环引用
      ) {
        // 不再添加重复的字段名和开始括号，而是直接添加带括号的字段名
        items.pop(); // 移除前面添加的字段名
        items.push({
          name: `${fieldName} {`,
          depth: depth,
          isObjectStart: true
        });
        
        // 递归收集嵌套字段
        this.collectFieldSelectionItems(
          fieldType,
          depth + 1,
          maxDepth,
          items
        );
        
        // 添加嵌套字段的结束括号
        items.push({
          name: '}',
          depth: depth,
          isObjectEnd: true
        });
      }
    }
  }

  /**
   * 获取基本类型名称（去除数组和非空标记）
   * @param type 类型字符串
   * @returns 基本类型名称
   */
  private getBaseTypeName(type: string): string {
    // 处理数组类型
    if (type.startsWith('[') && type.endsWith(']')) {
      return this.getBaseTypeName(type.slice(1, -1));
    }
    
    // 处理非空类型
    if (type.endsWith('!')) {
      return this.getBaseTypeName(type.slice(0, -1));
    }
    
    return type;
  }

  /**
   * 在schema中查找类型
   * @param typeName 类型名称
   * @returns 类型信息
   */
  private findType(typeName: string): TypeInfo | undefined {
    return this.schema.types.find(t => t.name === typeName);
  }
}