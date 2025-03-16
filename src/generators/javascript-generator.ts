import { FieldInfo, OperationInfo, TypeInfo } from '../utils/schema-parser';
import { BaseGenerator } from './base-generator';

export class JavaScriptGenerator extends BaseGenerator {
  /**
   * 生成所有代码
   */
  public async generate(): Promise<void> {
    // 生成类型定义 (JSDoc)
    await this.generateTypes();
    
    // 生成查询操作
    await this.generateQueries();
    
    // 生成变更操作
    await this.generateMutations();
    
    // 生成订阅操作
    await this.generateSubscriptions();
    
    // 生成客户端类
    await this.generateClient();
  }

  /**
   * 生成类型定义文件 (JSDoc)
   */
  private async generateTypes(): Promise<void> {
    const typeDefinitions: string[] = [];

    // 生成枚举类型
    const enumTypes = this.schema.types.filter(t => t.kind === 'enum');
    for (const type of enumTypes) {
      typeDefinitions.push(this.generateEnumDefinition(type));
    }

    // 生成接口类型
    const objectTypes = this.schema.types.filter(t => t.kind === 'object' || t.kind === 'input');
    for (const type of objectTypes) {
      typeDefinitions.push(this.generateInterfaceDefinition(type));
    }

    const content = `/**
 * @fileoverview Generated GraphQL types
 * @generated
 */

${typeDefinitions.join('\n\n')}
`;

    await this.writeFile('types.js', await this.formatCode(content));
  }

  /**
   * 生成查询操作文件
   */
  private async generateQueries(): Promise<void> {
    const content = this.generateOperationsFile(
      this.schema.operations.queries,
      'Query',
      'query'
    );
    await this.writeFile('queries.js', await this.formatCode(content));
  }

  /**
   * 生成变更操作文件
   */
  private async generateMutations(): Promise<void> {
    const content = this.generateOperationsFile(
      this.schema.operations.mutations,
      'Mutation',
      'mutation'
    );
    await this.writeFile('mutations.js', await this.formatCode(content));
  }

  /**
   * 生成订阅操作文件
   */
  private async generateSubscriptions(): Promise<void> {
    const content = this.generateOperationsFile(
      this.schema.operations.subscriptions,
      'Subscription',
      'subscription'
    );
    await this.writeFile('subscriptions.js', await this.formatCode(content));
  }

  /**
   * 生成客户端类文件
   */
  private async generateClient(): Promise<void> {
    const content = `import { GraphQLClient } from 'graphql-request';
import { QueryClient } from './queries';
import { MutationClient } from './mutations';
import { SubscriptionClient } from './subscriptions';

/**
 * GraphQL API 客户端
 */
export class GraphQLApiClient {
  /**
   * @param {string} endpoint - GraphQL API 端点
   */
  constructor(endpoint) {
    const client = new GraphQLClient(endpoint);
    this.queryClient = new QueryClient(client);
    this.mutationClient = new MutationClient(client);
    this.subscriptionClient = new SubscriptionClient(endpoint);
  }

  /**
   * @returns {QueryClient} 查询客户端
   */
  get query() {
    return this.queryClient;
  }

  /**
   * @returns {MutationClient} 变更客户端
   */
  get mutation() {
    return this.mutationClient;
  }

  /**
   * @returns {SubscriptionClient} 订阅客户端
   */
  get subscription() {
    return this.subscriptionClient;
  }
}`;

    await this.writeFile('client.js', await this.formatCode(content));
  }

  /**
   * 生成操作文件内容
   */
  private generateOperationsFile(
    operations: OperationInfo[],
    clientName: string,
    operationType: string
  ): string {
    const operationDefinitions: string[] = [];

    for (const operation of operations) {
      operationDefinitions.push(this.generateOperationMethod(operation));
    }

    return `import { GraphQLClient } from 'graphql-request';

/**
 * ${clientName} 操作客户端
 */
export class ${clientName}Client {
  /**
   * @param {GraphQLClient} client - GraphQL 客户端实例
   */
  constructor(client) {
    this.client = client;
  }

${operationDefinitions.join('\n\n')}
}`;
  }

  /**
   * 生成枚举定义
   */
  private generateEnumDefinition(type: TypeInfo): string {
    const enumName = this.getEnumName(type.name);
    const values = type.values || [];
    
    const valueDefinitions = values.map(value => `  ${value}: '${value}'`).join(',\n');
    
    return `/**
 * @enum {string}
 */
export const ${enumName} = {
${valueDefinitions}
};

/**
 * @typedef {keyof typeof ${enumName}} ${enumName}Type
 */`;
  }

  /**
   * 生成接口定义
   */
  private generateInterfaceDefinition(type: TypeInfo): string {
    const fields = type.fields || [];
    const fieldDefinitions = fields.map(field => {
      const fieldType = this.convertType(field.type);
      return ` * @property {${fieldType}} ${field.name}${field.required ? '' : '='}`;
    });

    return `/**
 * @typedef {Object} ${this.getTypeName(type.name)}
${fieldDefinitions.join('\n')}
 */`;
  }

  /**
   * 生成操作方法
   */
  private generateOperationMethod(operation: OperationInfo): string {
    const methodName = operation.name;
    const returnType = this.convertType(operation.returnType);
    
    const args = operation.arguments.map(arg => {
      const argType = this.convertType(arg.type);
      return `${arg.name}${arg.required ? '' : '='}: ${argType}`;
    });

    const queryVariables = operation.arguments.map(arg => arg.name).join(', ');
    const jsdocParams = operation.arguments.map(arg => 
      ` * @param {${this.convertType(arg.type)}} ${arg.name}${arg.required ? '' : '='}`
    );

    return `  /**
   * ${methodName} 操作
${jsdocParams.join('\n')}
   * @returns {Promise<${returnType}>}
   */
  async ${methodName}(${operation.arguments.map(arg => arg.name).join(', ')}) {
    const query = \`
      ${operation.type} ${methodName}${args.length ? `(${args.join(', ')})` : ''} {
        ${methodName}${args.length ? `(${queryVariables})` : ''} {
          # TODO: Add field selection
        }
      }
    \`;
    
    const response = await this.client.request(query${args.length ? `, { ${queryVariables} }` : ''});
    return response.${methodName};
  }`;
  }

  /**
   * 转换 GraphQL 类型到 JavaScript 类型
   */
  protected convertType(type: string): string {
    const typeMap: Record<string, string> = {
      'String': 'string',
      'Int': 'number',
      'Float': 'number',
      'Boolean': 'boolean',
      'ID': 'string',
    };

    return typeMap[type] || this.getTypeName(type);
  }

  /**
   * 生成类型导入语句
   */
  protected generateImports(types: string[]): string {
    if (types.length === 0) return '';
    return `// Types: ${types.join(', ')}`;
  }

  /**
   * 生成类型定义
   */
  protected generateTypeDefinition(name: string, fields: FieldInfo[]): string {
    const fieldDefinitions = fields.map(field => 
      ` * @property {${this.convertType(field.type)}} ${field.name}${field.required ? '' : '='}`
    );

    return `/**
 * @typedef {Object} ${this.getTypeName(name)}
${fieldDefinitions.join('\n')}
 */`;
  }

  /**
   * 生成操作代码
   */
  protected generateOperation(operation: OperationInfo): string {
    const args = operation.arguments.map(arg => 
      `${arg.name}${arg.required ? '' : '='}`
    );

    const jsdocParams = operation.arguments.map(arg => 
      ` * @param {${this.convertType(arg.type)}} ${arg.name}${arg.required ? '' : '='}`
    );

    return `  /**
   * ${operation.name} 操作
${jsdocParams.join('\n')}
   * @returns {Promise<${this.convertType(operation.returnType)}>}
   */
  async ${operation.name}(${args.join(', ')}) {
    // TODO: Implement operation
  }`;
  }
}