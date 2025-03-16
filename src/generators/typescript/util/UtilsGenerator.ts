import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';

/**
 * 工具函数生成器
 * 负责生成GraphQL客户端所需的工具函数
 */
export class UtilsGenerator extends BaseTypeScriptGenerator {
  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    super(config, schemaParser, fileManager, options);
    
    // 加载工具函数模板
    try {
      this.templateManager.loadTemplate('utils');
    } catch (error: any) {
      console.error(`Error loading utils template: ${error.message}`);
    }
  }

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'UtilsGenerator';
  }

  /**
   * 生成工具函数内容
   */
  private generateUtilsContent(): string {
    // 使用模板渲染工具函数
    return this.templateManager.render('utils', {});
  }

  /**
   * 生成工具函数
   */
  public async generate(): Promise<void> {
    const content = this.generateUtilsContent();
    await this.fileManager.writeFile('utils.ts', content);
    console.log('Generated utils.ts');
  }
}