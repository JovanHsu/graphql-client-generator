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
export class TypeUtils {
  private readonly schema: ParsedSchema;

  constructor(schema: ParsedSchema) {
    this.schema = schema;
  }

  /**
   * 获取类型的命名空间
   */
  public getTypeNamespace(typeName: string): string {
    // 根据类型名称推断命名空间
    if (typeName.endsWith('Input')) return 'inputs';
    if (typeName.endsWith('Enum')) return 'enums';
    if (typeName.includes('Query')) return 'queries';
    if (typeName.includes('Mutation')) return 'mutations';
    if (typeName.includes('Subscription')) return 'subscriptions';
    return 'models';
  }

  /**
   * 获取枚举名称
   */
  public getEnumName(typeName: string): string {
    return `${typeName}Enum`;
  }

  /**
   * 获取类型名称
   */
  public getTypeName(typeName: string): string {
    return typeName;
  }

  /**
   * 检查是否是自定义类型
   */
  public isCustomType(type: string): boolean {
    const baseType = type.replace(/[\\[\\]!]/g, '');
    const builtInTypes = ['String', 'Int', 'Float', 'Boolean', 'ID'];
    return !builtInTypes.includes(baseType);
  }

  /**
   * 转换 GraphQL 类型到 TypeScript 类型
   */
  public convertType(type: string): string {
    const typeMap: Record<string, string> = {
      'String': 'string',
      'Int': 'number',
      'Float': 'number',
      'Boolean': 'boolean',
      'ID': 'string',
    };

    // 处理数组类型
    if (type.startsWith('[') && type.endsWith(']')) {
      const innerType = type.slice(1, -1).replace('!', '');
      const convertedInnerType = this.convertType(innerType);
      return `${convertedInnerType}[]`;
    }

    // 处理必需类型
    if (type.endsWith('!')) {
      return this.convertType(type.slice(0, -1));
    }

    // 处理基本类型
    const baseType = type.replace(/[\\[\\]!]/g, '');
    
    // 检查是否是枚举类型
    const enumType = (this.schema.enums || []).find(e => e.name === baseType);
    if (enumType) {
      return baseType;
    }

    return typeMap[baseType] || this.getTypeName(baseType);
  }

  /**
   * 将数组分割成批次
   */
  public splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * 获取类型信息
   * @param type 类型字符串
   * @returns 类型信息
   */
  public getTypeInfo(type: string): TypeInfo {
    // 处理数组类型
    const isArray = type.startsWith('[') && type.endsWith(']');
    // 处理必需类型
    const isRequired = type.endsWith('!');
    
    // 获取基本类型名称
    let name = type;
    if (isArray) {
      name = name.slice(1, -1);
    }
    if (isRequired) {
      name = name.slice(0, -1);
    }
    
    // 如果仍然是数组或必需类型，递归处理
    if (name.startsWith('[') || name.endsWith('!')) {
      const innerInfo = this.getTypeInfo(name);
      return {
        name: innerInfo.name,
        isArray: isArray || innerInfo.isArray,
        isRequired: isRequired || innerInfo.isRequired
      };
    }
    
    return {
      name,
      isArray,
      isRequired
    };
  }

  /**
   * 检查是否是基本类型
   * @param typeName 类型名称
   * @returns 是否是基本类型
   */
  public isBasicType(typeName: string): boolean {
    const basicTypes = ['String', 'Int', 'Float', 'Boolean', 'ID'];
    return basicTypes.includes(typeName);
  }

  /**
   * 检查是否是枚举类型
   * @param typeName 类型名称
   * @returns 是否是枚举类型
   */
  public isEnumType(typeName: string): boolean {
    const enumType = this.schema.types.find(t => t.name === typeName && t.kind === 'enum');
    return !!enumType;
  }
}