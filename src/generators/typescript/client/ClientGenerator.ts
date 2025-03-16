import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';

/**
 * 客户端生成器
 * 负责生成GraphQL客户端类
 */
export class ClientGenerator extends BaseTypeScriptGenerator {
  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    super(config, schemaParser, fileManager, options);
    
    // 加载客户端模板
    try {
      this.templateManager.loadTemplate('client');
    } catch (error: any) {
      console.error(`Error loading client template: ${error.message}`);
    }
  }

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'ClientGenerator';
  }

  /**
   * 生成客户端内容
   */
  private generateClientContent(): string {
    const hasQueries = (this.schema.queries || []).length > 0;
    const hasMutations = (this.schema.mutations || []).length > 0;
    const hasSubscriptions = (this.schema.subscriptions || []).length > 0;

    const imports: string[] = [
      'import { GraphQLClient } from \'graphql-request\';'
    ];

    if (hasQueries) {
      imports.push('import { QueryClient } from \'./queries\';');
    }

    if (hasMutations) {
      imports.push('import { MutationClient } from \'./mutations\';');
    }

    if (hasSubscriptions) {
      imports.push('import { SubscriptionClient } from \'./subscriptions\';');
    }

    const clientProperties: string[] = [];
    
    if (hasQueries) {
      clientProperties.push('  public readonly query: QueryClient;');
    }
    
    if (hasMutations) {
      clientProperties.push('  public readonly mutation: MutationClient;');
    }
    
    if (hasSubscriptions) {
      clientProperties.push('  public readonly subscription: SubscriptionClient;');
    }

    const clientInitializers: string[] = [];
    
    if (hasQueries) {
      clientInitializers.push('    this.query = new QueryClient(this.client, this.options);');
    }
    
    if (hasMutations) {
      clientInitializers.push('    this.mutation = new MutationClient(this.client, this.options);');
    }
    
    if (hasSubscriptions) {
      clientInitializers.push('    this.subscription = new SubscriptionClient(this.client, this.options);');
    }

    // 使用模板渲染客户端
    return this.templateManager.render('client', {
      imports,
      clientProperties,
      clientInitializers
    });
  }

  /**
   * 生成客户端
   */
  public async generate(): Promise<void> {
    const content = this.generateClientContent();
    await this.fileManager.writeFile('client.ts', content);
    console.log('Generated client.ts');
  }
}