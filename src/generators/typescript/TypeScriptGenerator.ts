import { GeneratorConfig } from '../../config';
import { SchemaParser } from '../../utils/schema-parser';
import { FileManager } from './util/FileManager';
import { TypeScriptOptions } from './TypeScriptOptions';
import { EnumTypeGenerator } from './type/EnumTypeGenerator';
import { ModelTypeGenerator } from './type/ModelTypeGenerator';
import { InputTypeGenerator } from './type/InputTypeGenerator';
import { QueryGenerator } from './operation/QueryGenerator';
import { MutationGenerator } from './operation/MutationGenerator';
import { SubscriptionGenerator } from './operation/SubscriptionGenerator';
import { FragmentGenerator } from './fragment/FragmentGenerator';
import { UtilsGenerator } from './util/UtilsGenerator';
import { ClientGenerator } from './client/ClientGenerator';
import { TypeIndexGenerator } from './type/TypeIndexGenerator';

/**
 * TypeScript生成器
 * 负责生成GraphQL客户端的TypeScript代码
 */
export class TypeScriptGenerator {
  private readonly config: GeneratorConfig;
  private readonly schemaParser: SchemaParser;
  private readonly fileManager: FileManager;
  private readonly options: TypeScriptOptions;

  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    options: TypeScriptOptions = {}
  ) {
    this.config = config;
    this.schemaParser = schemaParser;
    this.fileManager = new FileManager(config);
    this.options = options;
  }

  /**
   * 清理生成的文件
   */
  public cleanupGeneratedFiles(): void {
    this.fileManager.cleanupGeneratedFiles();
  }

  /**
   * 生成代码
   */
  public async generate(): Promise<string[]> {
    console.log('Generating TypeScript client...');
    
    // 清理生成的文件
    this.cleanupGeneratedFiles();
    
    // 生成枚举类型
    const enumGenerator = new EnumTypeGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await enumGenerator.generate();
    
    // 生成模型类型
    const modelGenerator = new ModelTypeGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await modelGenerator.generate();
    
    // 生成输入类型
    const inputGenerator = new InputTypeGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await inputGenerator.generate();
    
    // 生成类型索引
    const typeIndexGenerator = new TypeIndexGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await typeIndexGenerator.generate();
    
    // 生成片段
    const fragmentGenerator = new FragmentGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await fragmentGenerator.generate();
    
    // 生成查询
    const queryGenerator = new QueryGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await queryGenerator.generate();
    
    // 生成变更
    const mutationGenerator = new MutationGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await mutationGenerator.generate();
    
    // 生成订阅
    const subscriptionGenerator = new SubscriptionGenerator(
      this.config,
      this.schemaParser,
      this.fileManager,
      this.options
    );
    await subscriptionGenerator.generate();
    
    // 生成工具函数
    if (this.options.generateUtils !== false) {
      const utilsGenerator = new UtilsGenerator(
        this.config,
        this.schemaParser,
        this.fileManager,
        this.options
      );
      await utilsGenerator.generate();
    }
    
    // 生成客户端
    if (this.options.generateClient !== false) {
      const clientGenerator = new ClientGenerator(
        this.config,
        this.schemaParser,
        this.fileManager,
        this.options
      );
      await clientGenerator.generate();
    }
    
    console.log('TypeScript client generation completed.');
    
    return this.fileManager.getGeneratedFiles();
  }
}