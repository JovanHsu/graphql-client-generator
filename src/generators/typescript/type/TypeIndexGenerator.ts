import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';

/**
 * 类型索引生成器
 * 负责生成类型索引文件
 */
export class TypeIndexGenerator extends BaseTypeScriptGenerator {
  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    super(config, schemaParser, fileManager, options);
    
    // 加载类型索引模板
    try {
      this.templateManager.loadTemplate('type-index');
    } catch (error: any) {
      console.error(`Error loading type-index template: ${error.message}`);
    }
  }

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'TypeIndexGenerator';
  }

  /**
   * 生成类型索引内容
   */
  private generateTypeIndexContent(): string {
    const hasEnums = (this.schema.enums || []).length > 0;
    const hasModels = (this.schema.types || []).length > 0;
    const hasInputs = (this.schema.inputs || []).length > 0;
    const hasQueries = (this.schema.queries || []).length > 0;
    const hasMutations = (this.schema.mutations || []).length > 0;
    const hasSubscriptions = (this.schema.subscriptions || []).length > 0;

    const imports: string[] = [];
    
    // 检查文件是否存在
    const checkFileExists = (fileName: string): boolean => {
      try {
        const filePath = `${this.config.outputDir}/${fileName}`;
        return require('fs').existsSync(filePath);
      } catch (error) {
        return false;
      }
    };
    
    // 使用具名导出而不是通配符导出
    if (hasEnums && checkFileExists('types.enums.ts')) {
      imports.push('export * from \'./types.enums\';');
    }
    
    if (hasModels && checkFileExists('types.models.ts')) {
      // 从types.models.ts导出所有类型
      imports.push('export * from \'./types.models\';');
    }
    
    if (hasInputs && checkFileExists('types.inputs.ts')) {
      // 从types.inputs.ts导出所有类型，但使用as关键字重命名可能冲突的类型
      imports.push('export { PageInput as PageInputType, ArticleUpdateInput as ArticleUpdateInputType, CategoryInput as CategoryInputType, RssFeedInput as RssFeedInputType, FeedSettingsInput as FeedSettingsInputType } from \'./types.inputs\';');
    }
    
    // 只有在文件存在时才导入
    if (hasQueries && checkFileExists('types.queries.ts')) {
      imports.push('export * from \'./types.queries\';');
    }
    
    if (hasMutations && checkFileExists('types.mutations.ts')) {
      imports.push('export * from \'./types.mutations\';');
    }
    
    if (hasSubscriptions && checkFileExists('types.subscriptions.ts')) {
      imports.push('export * from \'./types.subscriptions\';');
    }

    // 添加基本类型定义
    imports.push('\n// 基本类型定义');
    imports.push('export type ID = string;');
    imports.push('export type String = string;');
    imports.push('export type DateTime = string;');

    // 使用模板渲染类型索引
    return this.templateManager.render('type-index', { imports });
  }

  /**
   * 生成类型索引
   */
  public async generate(): Promise<void> {
    if (this.options.generateIndexFile === false) {
      console.log('Skipping types.index.ts generation');
      return;
    }
    
    const content = this.generateTypeIndexContent();
    await this.fileManager.writeFile('types.index.ts', content);
    console.log('Generated types.index.ts');
  }
}