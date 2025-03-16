import { GeneratorConfig } from '../../../config';
import { SchemaParser, TypeInfo } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';

/**
 * 枚举类型生成器
 * 负责生成GraphQL枚举类型的TypeScript代码
 */
export class EnumTypeGenerator extends BaseTypeScriptGenerator {
  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    super(config, schemaParser, fileManager, options);
    
    // 加载枚举模板
    try {
      this.templateManager.loadTemplate('enum');
    } catch (error: any) {
      console.error(`Error loading enum template: ${error.message}`);
    }
  }

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'EnumTypeGenerator';
  }

  /**
   * 生成枚举类型内容
   */
  private generateEnumTypeContent(enums: TypeInfo[]): string {
    if (enums.length === 0) {
      return '// No enum types defined';
    }

    const enumDefinitions: string[] = [];

    for (const enumType of enums) {
      // 使用模板渲染枚举类型
      const enumContent = this.templateManager.render('enum', {
        name: enumType.name,
        description: (enumType as any).description,
        values: enumType.values,
        generateComments: this.options.generateComments !== false
      });
      
      enumDefinitions.push(enumContent);
    }

    return enumDefinitions.join('\n\n');
  }

  /**
   * 生成枚举类型
   */
  public async generate(): Promise<void> {
    const enums = this.schema.enums || [];
    
    // 如果没有枚举类型，则生成空的枚举类型文件
    if (enums.length === 0) {
      await this.fileManager.writeFile('types.enums.ts', '// No enum types defined');
      console.log('No enum types defined, generating empty types.enums.ts');
      return;
    }
    
    // 分批处理枚举类型
    const batches = this.typeUtils.splitIntoBatches(enums, this.options.maxTypesPerFile || 20);
    
    for (let i = 0; i < batches.length; i++) {
      const content = this.generateEnumTypeContent(batches[i] as TypeInfo[]);
      const outputFileName = batches.length > 1 ? `types.enums.${i + 1}.ts` : 'types.enums.ts';
      await this.fileManager.writeFile(outputFileName, content);
    }

    // 如果有多个文件，生成索引文件
    if (batches.length > 1) {
      const indexContent = Array.from({ length: batches.length }, (_, i) => 
        `export * from './types.enums.${i + 1}';`
      ).join('\\n');
      await this.fileManager.writeFile('types.enums.index.ts', indexContent);
      await this.fileManager.writeFile('types.enums.ts', `export * from './types.enums.index';`);
    }
    
    console.log(`Generated ${enums.length} enum types in ${batches.length} file(s)`);
  }
}