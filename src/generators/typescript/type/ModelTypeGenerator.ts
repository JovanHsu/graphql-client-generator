import { GeneratorConfig } from '../../../config';
import { SchemaParser, TypeInfo } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
import { TypeScriptOptions } from '../TypeScriptOptions';
import { FileManager } from '../util/FileManager';

/**
 * 模型类型生成器
 * 负责生成GraphQL对象类型的TypeScript代码
 */
export class ModelTypeGenerator extends BaseTypeScriptGenerator {
  private enumImports: string = '';
  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    super(config, schemaParser, fileManager, options);
    
    // 加载模型类型模板
    try {
      this.templateManager.loadTemplate('model');
    } catch (error: any) {
      console.error(`Error loading model template: ${error.message}`);
    }
  }

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'ModelTypeGenerator';
  }

  /**
   * 生成模型类型内容
   */
  private generateModelTypeContent(types: TypeInfo[]): string {
    if (types.length === 0) {
      return '// No model types defined';
    }

    const typeDefinitions: string[] = [];
    const dependencies = new Set<string>();
    
    // 检查是否存在枚举类型
    const enumTypes = this.schema.enums || [];
    const enumTypeNames = new Set(enumTypes.map(e => e.name));

    for (const type of types) {
      // 跳过与枚举名称冲突的接口
      if (enumTypeNames.has(type.name)) {
        continue;
      }
      
      // 处理字段和依赖
      const processedFields = type.fields?.map((field: any) => {
        const fieldType = this.typeUtils.convertType(field.type);
        
        if (this.typeUtils.isCustomType(field.type)) {
          const typeName = this.typeUtils.getTypeName(field.type.replace(/[\[\]!]/g, ''));
          if (typeName !== type.name) { // 避免自引用
            dependencies.add(typeName);
          }
          
          // 检查是否是枚举类型
          const enumType = (this.schema.enums || []).find(e => e.name === typeName);
          if (enumType) {
            dependencies.add(typeName);
          }
        }
        
        return {
          name: field.name,
          type: fieldType,
          description: field.description,
          required: field.required
        };
      });
      
      // 使用模板渲染模型类型
      const modelContent = this.templateManager.render('model', {
        name: type.name,
        description: (type as any).description,
        fields: processedFields,
        generateComments: this.options.generateComments !== false,
        useTypeAliases: this.options.useTypeAliases === true
      });
      
      typeDefinitions.push(modelContent);
    }

    // 添加依赖导入
    let imports = '';
    if (dependencies.size > 0) {
      // 收集所有依赖类型
      const allDependencies = new Set(dependencies);
      
      // 添加枚举类型依赖
      for (const field of types.flatMap(type => type.fields || [])) {
        if (field.type && typeof field.type === 'string') {
          const baseType = field.type.replace(/[\[\]!]/g, '');
          const enumType = (this.schema.enums || []).find(e => e.name === baseType);
          if (enumType) {
            allDependencies.add(baseType);
          }
        }
      }
      
      const importTypes = Array.from(allDependencies).filter(dep => 
        !types.some(type => type.name === dep)
      );
      
      if (importTypes.length > 0) {
        imports = `import type { ${importTypes.join(', ')} } from './types.index';\n\n`;
      }
    }

    // 如果有枚举导入，添加到导入语句中
    if (this.enumImports && !imports.includes(this.enumImports)) {
      imports = this.enumImports + imports;
    }
    
    return `${imports}${typeDefinitions.join('\n\n')}`;
  }

  /**
   * 生成模型类型
   */
  public async generate(): Promise<void> {
    const types = this.schema.types || [];
    
    // 如果没有模型类型，则生成空的模型类型文件
    if (types.length === 0) {
      await this.fileManager.writeFile('types.models.ts', '// No model types defined');
      console.log('No model types defined, generating empty types.models.ts');
      return;
    }
    
    // 检查是否需要导入枚举类型
    const enumTypes = this.schema.enums || [];
    const enumImports: string[] = [];
    
    // 检查所有字段是否使用了枚举类型
    for (const type of types) {
      for (const field of type.fields || []) {
        if (field.type && typeof field.type === 'string') {
          const baseType = field.type.replace(/[\[\]!]/g, '');
          if (enumTypes.some(e => e.name === baseType)) {
            enumImports.push(baseType);
          }
        }
      }
    }
    
    // 如果有枚举类型被使用，添加导入语句
    if (enumImports.length > 0) {
      const uniqueEnumImports = Array.from(new Set(enumImports));
      const importStatement = `import type { ${uniqueEnumImports.join(', ')} } from './types.index';\n\n`;
      this.enumImports = importStatement;
    }
    
    // 分批处理模型类型
    const batches = this.typeUtils.splitIntoBatches(types, this.options.maxTypesPerFile || 20);
    
    for (let i = 0; i < batches.length; i++) {
      const content = this.generateModelTypeContent(batches[i]);
      const outputFileName = batches.length > 1 ? `types.models.${i + 1}.ts` : 'types.models.ts';
      await this.fileManager.writeFile(outputFileName, content);
    }

    // 如果有多个文件，生成索引文件
    if (batches.length > 1) {
      const indexContent = Array.from({ length: batches.length }, (_, i) => 
        `export * from './types.models.${i + 1}';`
      ).join('\\n');
      await this.fileManager.writeFile('types.models.index.ts', indexContent);
      await this.fileManager.writeFile('types.models.ts', `export * from './types.models.index';`);
    }
    
    console.log(`Generated ${types.length} model types in ${batches.length} file(s)`);
  }
}