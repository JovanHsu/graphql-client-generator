"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const base_generator_1 = require("./base-generator");
class TypeScriptGenerator extends base_generator_1.BaseGenerator {
    constructor(config, schemaParser, options = {}) {
        super(config, schemaParser);
        this.typeGroups = new Map();
        this.fragments = new Map();
        this.generatedFiles = new Set();
        this.options = {
            fragmentsEnabled: true,
            maxFieldsPerType: 50,
            maxTypesPerFile: 20,
            errorHandling: {
                retryAttempts: 3,
                timeout: 30000
            },
            ...options
        };
    }
    /**
     * 清理之前生成的文件
     */
    async cleanupGeneratedFiles() {
        const outputDir = this.config.outputDir;
        if (!fs.existsSync(outputDir)) {
            return;
        }
        const files = fs.readdirSync(outputDir);
        for (const file of files) {
            if (file.endsWith('.ts')) {
                const filePath = path.join(outputDir, file);
                try {
                    fs.unlinkSync(filePath);
                }
                catch (error) {
                    console.warn(`Failed to delete file ${filePath}:`, error);
                }
            }
        }
    }
    /**
     * 记录生成的文件
     */
    trackGeneratedFile(fileName) {
        this.generatedFiles.add(fileName);
    }
    /**
     * 重写 writeFile 方法以跟踪生成的文件
     */
    async writeFile(fileName, content) {
        await super.writeFile(fileName, content);
        this.trackGeneratedFile(fileName);
    }
    /**
     * 生成所有代码
     */
    async generate() {
        // 清理之前生成的文件
        await this.cleanupGeneratedFiles();
        // 预处理类型
        this.preprocessTypes();
        // 生成类型定义
        await this.generateTypes();
        // 生成片段
        if (this.options.fragmentsEnabled) {
            await this.generateFragments();
        }
        // 生成操作
        await this.generateOperations();
        // 生成工具类
        await this.generateUtils();
        // 生成客户端类
        await this.generateClient();
        console.log('Generated files:', Array.from(this.generatedFiles));
    }
    /**
     * 预处理类型，进行分组
     */
    preprocessTypes() {
        const types = this.schema.types;
        // 按命名空间分组
        types.forEach(type => {
            const namespace = this.getTypeNamespace(type.name);
            if (!this.typeGroups.has(namespace)) {
                this.typeGroups.set(namespace, []);
            }
            this.typeGroups.get(namespace).push(type);
        });
        // 生成常用类型的片段
        if (this.options.fragmentsEnabled) {
            types.forEach(type => {
                if (type.fields && type.fields.length > this.options.maxFieldsPerType) {
                    this.fragments.set(type.name, this.generateTypeFragment(type));
                }
            });
        }
    }
    /**
     * 生成类型定义文件
     */
    async generateTypes() {
        // 先生成枚举类型
        const enumTypes = this.schema.types.filter(t => t.kind === 'enum');
        if (enumTypes.length > 0) {
            const enumContent = enumTypes.map(type => this.generateEnumDefinition(type)).join('\n\n');
            await this.writeFile('types.enums.ts', await this.formatCode(enumContent));
        }
        else {
            console.log('No enum types defined, skipping types.enums.ts generation');
        }
        // 生成其他类型
        for (const [namespace, types] of this.typeGroups) {
            if (namespace === 'enums')
                continue; // 跳过枚举，因为已经单独生成
            if (types.length === 0) {
                console.log(`No types defined for namespace ${namespace}, skipping types.${namespace}.ts generation`);
                continue;
            }
            // 分批处理大型类型组
            const batches = this.splitIntoBatches(types, this.options.maxTypesPerFile);
            for (let i = 0; i < batches.length; i++) {
                const content = this.generateTypesContent(batches[i], namespace);
                const fileName = batches.length > 1 ? `types.${namespace}.${i + 1}.ts` : `types.${namespace}.ts`;
                await this.writeFile(fileName, await this.formatCode(content));
            }
        }
        // 生成类型索引文件
        await this.generateTypeIndex();
    }
    /**
     * 生成类型定义内容
     */
    generateTypesContent(types, namespace) {
        const typeDefinitions = [];
        const modelImports = new Set();
        // 收集所有需要的枚举类型
        const enumTypes = new Set();
        // 收集所有需要的模型类型
        const modelTypes = new Set();
        types
            .filter(t => t.kind === 'object' || t.kind === 'input')
            .forEach(t => {
            (t.fields || []).forEach(f => {
                const baseType = f.type.replace(/[\[\]!]/g, '');
                // 检查是否是枚举类型
                if (this.schema.types.some(t => t.name === baseType && t.kind === 'enum')) {
                    enumTypes.add(`${baseType}Enum`);
                }
                // 检查是否是模型类型
                else if (this.isCustomType(f.type) && namespace !== 'models') {
                    const typeName = this.getTypeName(baseType);
                    if (this.schema.types.some(t => t.name === baseType && t.kind === 'object')) {
                        modelTypes.add(typeName);
                    }
                }
            });
        });
        // 添加枚举导入
        if (enumTypes.size > 0) {
            typeDefinitions.push(`import { ${Array.from(enumTypes).join(', ')} } from './types.enums';`);
        }
        // 添加模型导入
        if (modelTypes.size > 0) {
            typeDefinitions.push(`import { ${Array.from(modelTypes).join(', ')} } from './types.models';`);
        }
        // 生成接口类型
        const objectTypes = types.filter(t => t.kind === 'object' || t.kind === 'input');
        for (const type of objectTypes) {
            typeDefinitions.push(this.generateInterfaceDefinition(type).definition);
        }
        return typeDefinitions.join('\n\n');
    }
    /**
     * 生成片段文件
     */
    async generateFragments() {
        const fragments = Array.from(this.fragments.entries());
        // 如果没有片段定义，则不生成文件
        if (fragments.length === 0) {
            console.log('No fragments defined, skipping fragments.ts generation');
            return;
        }
        const content = fragments
            .map(([name, fragment]) => fragment)
            .join('\n\n');
        await this.writeFile('fragments.ts', await this.formatCode(content));
    }
    /**
     * 生成操作相关文件
     */
    async generateOperations() {
        // 查询操作
        await this.generateOperationsByType(this.schema.operations.queries, 'Query', 'queries');
        // 变更操作
        await this.generateOperationsByType(this.schema.operations.mutations, 'Mutation', 'mutations');
        // 订阅操作
        await this.generateSubscriptions();
    }
    /**
     * 生成工具类
     */
    async generateUtils() {
        const content = `
import { GraphQLError } from 'graphql';

export class GraphQLClientError extends Error {
  constructor(
    message: string,
    public readonly errors?: readonly GraphQLError[],
    public readonly response?: any
  ) {
    super(message);
    this.name = 'GraphQLClientError';
  }
}

export interface RetryOptions {
  attempts: number;
  delay: number;
  shouldRetry?: (error: Error) => boolean;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < options.attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (options.shouldRetry?.(lastError) === false) {
        break;
      }
      
      if (i < options.attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }
    }
  }
  
  throw lastError!;
}

export function createRequestHeaders(
  options?: RequestInit
): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
}

export class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new TimeoutError()), timeoutMs);
    }),
  ]);
}`;
        await this.writeFile('utils.ts', await this.formatCode(content));
    }
    /**
     * 生成客户端类
     */
    async generateClient() {
        const content = `
import { GraphQLClient } from 'graphql-request';
import { QueryClient } from './queries';
import { MutationClient } from './mutations';
import { SubscriptionClient } from './subscriptions';
import { withRetry, withTimeout, RetryOptions } from './utils';

export interface ClientOptions {
  retry?: RetryOptions;
  timeout?: number;
  headers?: HeadersInit;
}

export class GraphQLApiClient {
  private queryClient: QueryClient;
  private mutationClient: MutationClient;
  private subscriptionClient: SubscriptionClient;
  private options: ClientOptions;

  constructor(
    endpoint: string,
    options: ClientOptions = {}
  ) {
    this.options = {
      retry: {
        attempts: ${this.options.errorHandling?.retryAttempts},
        delay: 1000,
      },
      timeout: ${this.options.errorHandling?.timeout},
      ...options,
    };

    const client = new GraphQLClient(endpoint, {
      headers: this.options.headers,
    });

    this.queryClient = new QueryClient(client, this.options);
    this.mutationClient = new MutationClient(client, this.options);
    this.subscriptionClient = new SubscriptionClient(endpoint, this.options);
  }

  public get query() {
    return this.queryClient;
  }

  public get mutation() {
    return this.mutationClient;
  }

  public get subscription() {
    return this.subscriptionClient;
  }

  public dispose(): void {
    this.subscriptionClient.dispose();
  }
}`;
        await this.writeFile('client.ts', await this.formatCode(content));
    }
    /**
     * 生成类型索引文件
     */
    async generateTypeIndex() {
        const typeFiles = Array.from(this.typeGroups.keys())
            .map(namespace => `export * from './types.${namespace}';`);
        // 添加枚举类型导出
        typeFiles.unshift(`export * from './types.enums';`);
        const content = typeFiles.join('\n');
        await this.writeFile('types.index.ts', await this.formatCode(content));
    }
    /**
     * 获取类型的命名空间
     */
    getTypeNamespace(typeName) {
        // 根据类型名称推断命名空间
        if (typeName.endsWith('Input'))
            return 'inputs';
        if (typeName.endsWith('Enum'))
            return 'enums';
        if (typeName.includes('Query'))
            return 'queries';
        if (typeName.includes('Mutation'))
            return 'mutations';
        if (typeName.includes('Subscription'))
            return 'subscriptions';
        return 'models';
    }
    /**
     * 将数组分割成批次
     */
    splitIntoBatches(items, batchSize) {
        const batches = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }
        return batches;
    }
    /**
     * 生成类型片段
     */
    generateTypeFragment(type) {
        const fields = type.fields || [];
        const fragmentName = `${type.name}Fragment`;
        return `export const ${fragmentName} = \`
  fragment ${fragmentName} on ${type.name} {
    ${fields.map(f => f.name).join('\n    ')}
  }
\`;`;
    }
    /**
     * 生成枚举定义
     */
    generateEnumDefinition(type) {
        const enumName = this.getEnumName(type.name);
        const values = type.values || [];
        return `export enum ${enumName} {
${values.map(value => `  ${value} = '${value}'`).join(',\n')}
}`;
    }
    /**
     * 生成接口定义
     */
    generateInterfaceDefinition(type) {
        const dependencies = new Set();
        const fields = type.fields || [];
        const fieldDefinitions = fields.map(field => {
            const fieldType = this.convertType(field.type);
            if (this.isCustomType(field.type)) {
                dependencies.add(this.getTypeName(field.type.replace(/[\[\]!]/g, '')));
            }
            return `  ${field.name}${field.required ? '' : '?'}: ${fieldType};`;
        });
        return {
            dependencies: Array.from(dependencies),
            definition: `export interface ${this.getTypeName(type.name)} {
${fieldDefinitions.join('\n')}
}`
        };
    }
    /**
     * 生成操作方法
     */
    generateOperationMethod(operation) {
        const dependencies = new Set();
        const methodName = operation.name;
        const returnType = this.convertType(operation.returnType);
        if (this.isCustomType(operation.returnType)) {
            dependencies.add(this.getTypeName(operation.returnType.replace(/[\[\]!]/g, '')));
        }
        const args = operation.arguments.map(arg => {
            const argType = this.convertType(arg.type);
            if (this.isCustomType(arg.type)) {
                dependencies.add(this.getTypeName(arg.type.replace(/[\[\]!]/g, '')));
            }
            return `${arg.name}${arg.required ? '' : '?'}: ${argType}`;
        });
        const queryVariables = operation.arguments.map(arg => arg.name).join(', ');
        const queryArgs = operation.arguments.map(arg => `$${arg.name}: ${arg.type}`).join(', ');
        const queryParams = operation.arguments.map(arg => `${arg.name}: $${arg.name}`).join(', ');
        const responseType = `{ ${methodName}: ${returnType} }`;
        // 生成字段选择，确保缩进正确
        const fieldSelection = this.generateFieldSelection(operation.returnType);
        // 格式化字段选择，确保正确的缩进
        const formattedFieldSelection = fieldSelection
            .split('\n')
            .map(line => line.trim())
            .join('\n          ');
        return {
            dependencies: Array.from(dependencies),
            definition: `  public async ${methodName}(${args.join(', ')}): Promise<${returnType}> {
    const query = \`
      ${operation.type} ${methodName}${args.length ? `(${queryArgs})` : ''} {
        ${methodName}${args.length ? `(${queryParams})` : ''} {
          ${formattedFieldSelection}
        }
      }
    \`;
    
    const response = await this.client.request<${responseType}>(query${args.length ? `, { ${queryVariables} }` : ''});
    return response.${methodName};
  }`
        };
    }
    /**
     * 根据类型生成字段选择
     */
    generateFieldSelection(type, depth = 0, indentation = '') {
        // 限制递归深度
        if (depth > 3) {
            return `${indentation}id`;
        }
        const baseType = type.replace(/[\[\]!]/g, '');
        const typeInfo = this.schema.types.find(t => t.name === baseType);
        if (!typeInfo || !typeInfo.fields) {
            return `${indentation}id`;
        }
        const selections = [];
        const nextIndentation = indentation + '  ';
        for (const field of typeInfo.fields) {
            if (this.isCustomType(field.type)) {
                // 对于自定义类型，递归生成字段选择
                const nestedFields = this.generateFieldSelection(field.type, depth + 1, nextIndentation);
                selections.push(`${indentation}${field.name} {\n${nestedFields}\n${indentation}}`);
            }
            else {
                selections.push(`${indentation}${field.name}`);
            }
        }
        return selections.join('\n');
    }
    /**
     * 收集操作中使用的所有类型
     */
    collectOperationTypes(operations) {
        const types = new Set();
        operations.forEach(operation => {
            if (this.isCustomType(operation.returnType)) {
                types.add(this.getTypeName(operation.returnType.replace(/[\[\]!]/g, '')));
            }
            operation.arguments.forEach(arg => {
                if (this.isCustomType(arg.type)) {
                    types.add(this.getTypeName(arg.type.replace(/[\[\]!]/g, '')));
                }
            });
        });
        return Array.from(types);
    }
    /**
     * 检查是否是自定义类型
     */
    isCustomType(type) {
        const baseType = type.replace(/[\[\]!]/g, '');
        const builtInTypes = ['String', 'Int', 'Float', 'Boolean', 'ID'];
        return !builtInTypes.includes(baseType);
    }
    /**
     * 转换 GraphQL 类型到 TypeScript 类型
     */
    convertType(type) {
        const typeMap = {
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
        const baseType = type.replace(/[\[\]!]/g, '');
        // 检查是否是枚举类型
        const enumType = this.schema.types.find(t => t.name === baseType && t.kind === 'enum');
        if (enumType) {
            return `${baseType}Enum`;
        }
        return typeMap[baseType] || this.getTypeName(baseType);
    }
    /**
     * 生成类型导入语句
     */
    generateImports(types) {
        if (types.length === 0)
            return '';
        return `import type { ${types.join(', ')} } from './types';`;
    }
    /**
     * 生成类型定义
     */
    generateTypeDefinition(name, fields) {
        const fieldDefinitions = fields.map(field => `  ${field.name}${field.required ? '' : '?'}: ${this.convertType(field.type)};`);
        return `export interface ${this.getTypeName(name)} {
${fieldDefinitions.join('\n')}
}`;
    }
    /**
     * 生成操作代码
     */
    generateOperation(operation) {
        const args = operation.arguments.map(arg => `${arg.name}${arg.required ? '' : '?'}: ${this.convertType(arg.type)}`);
        return `  public async ${operation.name}(${args.join(', ')}): Promise<${this.convertType(operation.returnType)}> {
    // TODO: Implement operation
  }`;
    }
    /**
     * 生成特定类型的操作文件
     */
    async generateOperationsByType(operations, clientName, fileName) {
        // 如果没有操作，则不生成文件
        if (operations.length === 0) {
            console.log(`No ${fileName} operations defined, skipping ${fileName}.ts generation`);
            return;
        }
        // 分批处理操作
        const batches = this.splitIntoBatches(operations, this.options.maxTypesPerFile);
        for (let i = 0; i < batches.length; i++) {
            const content = this.generateOperationsContent(batches[i], clientName);
            const outputFileName = batches.length > 1 ? `${fileName}.${i + 1}.ts` : `${fileName}.ts`;
            await this.writeFile(outputFileName, await this.formatCode(content));
        }
        // 如果有多个文件，生成索引文件
        if (batches.length > 1) {
            const indexContent = Array.from({ length: batches.length }, (_, i) => `export * from './${fileName}.${i + 1}';`).join('\n');
            await this.writeFile(`${fileName}.index.ts`, await this.formatCode(indexContent));
        }
    }
    /**
     * 生成操作内容
     */
    generateOperationsContent(operations, clientName) {
        const imports = new Set(['GraphQLClient', 'ClientOptions']);
        const operationDefinitions = [];
        for (const operation of operations) {
            const { dependencies, definition } = this.generateOperationMethod(operation);
            dependencies.forEach(dep => imports.add(dep));
            operationDefinitions.push(definition);
        }
        const types = this.collectOperationTypes(operations);
        const typeImports = types.length > 0 ? `\nimport type { ${types.join(', ')} } from './types.index';` : '';
        const utilsImport = `import { withRetry, withTimeout } from './utils';`;
        return `import { GraphQLClient } from 'graphql-request';
import type { ClientOptions } from './client';${typeImports}
${utilsImport}

export class ${clientName}Client {
  constructor(
    private readonly client: GraphQLClient,
    private readonly options: ClientOptions
  ) {}

${operationDefinitions.join('\n\n')}
}`;
    }
    /**
     * 生成订阅操作文件
     */
    async generateSubscriptions() {
        // 检查是否有订阅操作
        if (this.schema.operations.subscriptions.length === 0) {
            console.log('No subscription operations defined, skipping subscriptions.ts generation');
            return;
        }
        const content = `import { createClient, Client, ExecutionResult } from 'graphql-ws';
import type { ClientOptions } from './client';
import type { Post } from './types.index';
import { withRetry, withTimeout, TimeoutError } from './utils';

type SubscriptionCallback<T> = (data: T) => void;
type UnsubscribeFunction = () => void;
type ErrorHandler = (error: Error) => void;

interface SubscriptionOptions<T> {
  callback: SubscriptionCallback<T>;
  onError?: ErrorHandler;
  onComplete?: () => void;
}

export class SubscriptionClient {
  private client: Client;
  private subscriptions: Set<UnsubscribeFunction>;
  private defaultErrorHandler: ErrorHandler;

  constructor(
    endpoint: string,
    private readonly options: ClientOptions = {}
  ) {
    const wsEndpoint = endpoint.replace(/^http/, 'ws');
    
    this.client = createClient({
      url: wsEndpoint,
      retryAttempts: options.retry?.attempts ?? 3,
      connectionTimeout: options.timeout ?? 30000,
      shouldRetry: options.retry?.shouldRetry ?? true,
    });

    this.subscriptions = new Set();
    this.defaultErrorHandler = this.handleError;
  }

  private handleError = (error: Error): void => {
    console.error('[GraphQL Subscription Error]:', error.message);
  };

  private createSubscription<T>(
    query: string,
    options: SubscriptionOptions<T>
  ): UnsubscribeFunction {
    const { callback, onError = this.defaultErrorHandler, onComplete } = options;

    const unsubscribe = this.client.subscribe<ExecutionResult<T>>(
      { query },
      {
        next: (result) => {
          try {
            if (result.errors?.length) {
              const error = new Error(
                result.errors.map(e => e.message).join(', ')
              );
              onError(error);
              return;
            }

            if (result.data) {
              callback(result.data);
            }
          } catch (error) {
            onError(error instanceof Error ? error : new Error(String(error)));
          }
        },
        error: (error) => {
          onError(error instanceof Error ? error : new Error(String(error)));
        },
        complete: () => {
          this.subscriptions.delete(unsubscribe);
          onComplete?.();
        },
      }
    );

    this.subscriptions.add(unsubscribe);
    return unsubscribe;
  }

  public onPostCreated(
    options: SubscriptionOptions<{ onPostCreated: Post }>
  ): UnsubscribeFunction {
    const subscription = \`
      subscription OnPostCreated {
        onPostCreated {
          id
          title
          content
          createdAt
          status
          author {
            id
            name
            email
          }
        }
      }
    \`;

    return this.createSubscription<{ onPostCreated: Post }>(
      subscription,
      {
        ...options,
        callback: (data) => options.callback(data.onPostCreated),
      }
    );
  }

  public onPostUpdated(
    options: SubscriptionOptions<{ onPostUpdated: Post }>
  ): UnsubscribeFunction {
    const subscription = \`
      subscription OnPostUpdated {
        onPostUpdated {
          id
          title
          content
          createdAt
          status
          author {
            id
            name
            email
          }
        }
      }
    \`;

    return this.createSubscription<{ onPostUpdated: Post }>(
      subscription,
      {
        ...options,
        callback: (data) => options.callback(data.onPostUpdated),
      }
    );
  }

  public dispose(): void {
    this.subscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        this.defaultErrorHandler(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    });
    this.subscriptions.clear();
  }
}`;
        await this.writeFile('subscriptions.ts', await this.formatCode(content));
    }
}
exports.TypeScriptGenerator = TypeScriptGenerator;
