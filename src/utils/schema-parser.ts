import { buildSchema, GraphQLSchema, parse, GraphQLObjectType, GraphQLInputObjectType, GraphQLEnumType, GraphQLList, GraphQLNonNull } from 'graphql';
import { DocumentNode } from 'graphql/language';
import { FileSystem } from './file-system';

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
  // 所有类型
  types: TypeInfo[];
  // 按类型分类
  enums: TypeInfo[];
  models: TypeInfo[];
  inputs: TypeInfo[];
  // 操作
  queries: OperationInfo[];
  mutations: OperationInfo[];
  subscriptions: OperationInfo[];
  // 原始操作结构
  operations: {
    queries: OperationInfo[];
    mutations: OperationInfo[];
    subscriptions: OperationInfo[];
  };
  // 片段
  fragments?: any[];
}

export class SchemaParser {
  private schema!: GraphQLSchema;
  private document!: DocumentNode;

  constructor(private schemaPath: string) {}

  /**
   * 初始化解析器
   */
  public async initialize(): Promise<void> {
    try {
      const schemaContent = await FileSystem.readFile(this.schemaPath);
      this.schema = buildSchema(schemaContent);
      this.document = parse(schemaContent);
    } catch (error: any) {
      throw new Error(`初始化 Schema 解析器失败: ${error.message}`);
    }
  }

  /**
   * 解析 schema
   */
  public parse(): ParsedSchema {
    if (!this.schema || !this.document) {
      throw new Error('Schema 未初始化');
    }

    const types = this.parseTypes();
    const queries = this.parseOperations('query');
    const mutations = this.parseOperations('mutation');
    const subscriptions = this.parseOperations('subscription');
    
    // 按类型分类
    const enums = types.filter(type => type.kind === 'enum');
    const models = types.filter(type => type.kind === 'object');
    const inputs = types.filter(type => type.kind === 'input');

    return {
      types,
      enums,
      models,
      inputs,
      queries,
      mutations,
      subscriptions,
      operations: {
        queries,
        mutations,
        subscriptions,
      },
      fragments: [], // 默认空数组
    };
  }

  /**
   * 解析类型定义
   */
  private parseTypes(): TypeInfo[] {
    const types: TypeInfo[] = [];
    const typeMap = this.schema.getTypeMap();

    for (const [name, type] of Object.entries(typeMap)) {
      // 跳过内置类型
      if (name.startsWith('__') || ['String', 'Int', 'Float', 'Boolean', 'ID'].includes(name)) {
        continue;
      }

      if (type instanceof GraphQLObjectType || type instanceof GraphQLInputObjectType) {
        const fields = type.getFields();
        const parsedFields: FieldInfo[] = [];

        for (const [fieldName, field] of Object.entries(fields)) {
          const fieldType = field.type;
          let typeName = '';
          let required = false;

          if (fieldType instanceof GraphQLNonNull) {
            required = true;
            if (fieldType.ofType instanceof GraphQLList) {
              typeName = `[${this.getTypeName(fieldType.ofType.ofType)}]`;
            } else {
              typeName = this.getTypeName(fieldType.ofType);
            }
          } else if (fieldType instanceof GraphQLList) {
            typeName = `[${this.getTypeName(fieldType.ofType)}]`;
          } else {
            typeName = this.getTypeName(fieldType);
          }

          parsedFields.push({
            name: fieldName,
            type: typeName,
            required,
          });
        }

        types.push({
          name,
          kind: type instanceof GraphQLInputObjectType ? 'input' : 'object',
          fields: parsedFields,
        });
      } else if (type instanceof GraphQLEnumType) {
        types.push({
          name,
          kind: 'enum',
          values: type.getValues().map(v => v.name),
        });
      }
    }

    return types;
  }

  /**
   * 解析操作定义
   */
  private parseOperations(type: 'query' | 'mutation' | 'subscription'): OperationInfo[] {
    const operations: OperationInfo[] = [];
    const rootType = type === 'query' 
      ? this.schema.getQueryType() 
      : type === 'mutation' 
        ? this.schema.getMutationType()
        : this.schema.getSubscriptionType();

    if (!rootType) {
      return operations;
    }

    const fields = rootType.getFields();
    for (const [name, field] of Object.entries(fields)) {
      const args: FieldInfo[] = [];
      for (const arg of field.args) {
        const argType = arg.type;
        let typeName = '';
        let required = false;

        if (argType instanceof GraphQLNonNull) {
          required = true;
          if (argType.ofType instanceof GraphQLList) {
            typeName = `[${this.getTypeName(argType.ofType.ofType)}]`;
          } else {
            typeName = this.getTypeName(argType.ofType);
          }
        } else if (argType instanceof GraphQLList) {
          typeName = `[${this.getTypeName(argType.ofType)}]`;
        } else {
          typeName = this.getTypeName(argType);
        }

        args.push({
          name: arg.name,
          type: typeName,
          required,
        });
      }

      const returnType = field.type;
      let typeName = '';
      if (returnType instanceof GraphQLNonNull) {
        if (returnType.ofType instanceof GraphQLList) {
          typeName = `[${this.getTypeName(returnType.ofType.ofType)}]!`;
        } else {
          typeName = `${this.getTypeName(returnType.ofType)}!`;
        }
      } else if (returnType instanceof GraphQLList) {
        typeName = `[${this.getTypeName(returnType.ofType)}]`;
      } else {
        typeName = this.getTypeName(returnType);
      }

      operations.push({
        name,
        type,
        returnType: typeName,
        arguments: args,
      });
    }

    return operations;
  }

  /**
   * 获取类型名称
   */
  private getTypeName(type: any): string {
    return type.toString();
  }
}