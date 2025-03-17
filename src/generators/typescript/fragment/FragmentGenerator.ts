// 自定义片段信息接口
interface FragmentInfo {
  name: string;
  onType: string;
}
import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FieldSelectionGenerator } from '../util/FieldSelectionGenerator';
import { FileManager } from '../util/FileManager';

/**
 * 片段生成器
 * 负责生成GraphQL片段的TypeScript代码
 */
export class FragmentGenerator extends BaseTypeScriptGenerator {
  private readonly fieldSelectionGenerator: FieldSelectionGenerator;

  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    super(config, schemaParser, fileManager, options);
    this.fieldSelectionGenerator = new FieldSelectionGenerator(this.schema, this.typeUtils);
    
    // 加载片段模板
    try {
      this.templateManager.loadTemplate('fragments');
    } catch (error: any) {
      console.error(`Error loading fragments template: ${error.message}`);
    }
    
    // 加载片段集合模板
    try {
      this.templateManager.loadTemplate('fragments');
    } catch (error: any) {
      console.error(`Error loading fragments template: ${error.message}`);
    }
  }

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'FragmentGenerator';
  }

  /**
   * 获取片段列表
   */
  private getFragments(): FragmentInfo[] {
    return this.schema.fragments || [];
  }

  /**
   * 生成片段内容
   */
  private generateFragmentContent(fragments: FragmentInfo[]): string {
    if (fragments.length === 0) {
      return `export const fragments = {};`;
    }

    const fragmentDefinitions: string[] = [];
    const fragmentNames: string[] = [];
    const types = new Set<string>();

    for (const fragment of fragments) {
      if (this.typeUtils.isCustomType(fragment.onType)) {
        types.add(this.typeUtils.getTypeName(fragment.onType.replace(/[\[\]!]/g, '')));
      }

      const fieldSelection = this.fieldSelectionGenerator.generateFieldSelection(fragment.onType, 4);
      
      // 使用模板渲染片段
      const fragmentContent = this.templateManager.render('fragments', {
        name: fragment.name,
        onType: fragment.onType,
        fieldSelection
      });

      fragmentDefinitions.push(fragmentContent);
      fragmentNames.push(fragment.name);
    }

    // 使用模板渲染片段集合
    return this.templateManager.render('fragments', {
      hasTypes: types.size > 0,
      types: Array.from(types),
      fragments: fragmentDefinitions,
      fragmentNames: fragmentNames
    });
  }

  /**
   * 生成片段
   */
  public async generate(): Promise<void> {
    const fragments = this.getFragments();
    
    // 如果没有片段，则生成空的片段文件
    const content = this.generateFragmentContent(fragments);
    await this.fileManager.writeFile('fragments.ts', content);
    
    if (fragments.length === 0) {
      console.log('No fragments defined, generating empty fragments.ts');
    } else {
      console.log(`Generated ${fragments.length} fragments in fragments.ts`);
    }
  }
}