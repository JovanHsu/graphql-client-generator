import { GeneratorConfig } from '../../config';
import { ParsedSchema, SchemaParser } from '../../utils/schema-parser';
import { TemplateManager } from './template/TemplateManager';
import { TypeScriptOptions } from './TypeScriptOptions';
import { FileManager } from './util/FileManager';
import { TypeUtils } from './util/TypeUtils';

/**
 * TypeScript生成器基类
 * 所有TypeScript生成器的基类
 */
export abstract class BaseTypeScriptGenerator {
  protected readonly config: GeneratorConfig;
  protected readonly schema: ParsedSchema;
  protected readonly fileManager: FileManager;
  protected readonly options: TypeScriptOptions;
  protected readonly typeUtils: TypeUtils;
  protected readonly templateManager: TemplateManager;

  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    this.config = config;
    this.schema = schemaParser.parse();
    this.fileManager = fileManager;
    this.options = {
      strictTypes: true,
      useTypeAliases: false,
      maxTypesPerFile: 20,
      maxFieldSelectionDepth: 5,
      generateComments: true,
      generateNullableTypes: true,
      useFragments: true,
      generateIndexFile: true,
      generateUtils: true,
      generateClient: true,
      ...options
    };
    this.typeUtils = new TypeUtils(this.schema);
    this.templateManager = new TemplateManager();
  }

  /**
   * 获取生成器名称
   */
  public abstract getName(): string;

  /**
   * 生成代码
   */
  public abstract generate(): Promise<void>;
}