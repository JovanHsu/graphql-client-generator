import * as path from 'path';
import * as prettier from 'prettier';
import { GeneratorConfig } from '../config';
import { FileSystem } from '../utils/file-system';
import { ParsedSchema, SchemaParser } from '../utils/schema-parser';

export abstract class BaseGenerator {
  protected schema!: ParsedSchema;
  protected outputPath: string;

  constructor(
    protected config: GeneratorConfig,
    protected schemaParser: SchemaParser
  ) {
    this.outputPath = path.resolve(config.outputDir);
  }

  /**
   * 初始化生成器
   */
  public async initialize(): Promise<void> {
    await this.schemaParser.initialize();
    this.schema = this.schemaParser.parse();
    await FileSystem.createDirectory(this.outputPath);
  }

  /**
   * 生成代码
   */
  public abstract generate(): Promise<void>;

  /**
   * 格式化代码
   * @param code 代码内容
   * @param parser 解析器类型
   * @returns 格式化后的代码
   */
  protected async formatCode(code: string, parser: 'typescript' | 'babel' = 'typescript'): Promise<string> {
    try {
      return prettier.format(code, {
        parser,
        ...this.config.prettier,
      });
    } catch (error: any) {
      console.warn(`代码格式化失败: ${error.message}`);
      return code;
    }
  }

  /**
   * 写入生成的代码到文件
   * @param filePath 相对输出目录的文件路径
   * @param content 文件内容
   */
  protected async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.outputPath, filePath);
    await FileSystem.writeFile(fullPath, content);
  }

  /**
   * 生成类型名称
   * @param name 原始名称
   * @returns 处理后的名称
   */
  protected getTypeName(name: string): string {
    const { typePrefix = '', typeSuffix = '' } = this.config.naming || {};
    return `${typePrefix}${name}${typeSuffix}`;
  }

  /**
   * 生成枚举名称
   * @param name 原始名称
   * @returns 处理后的名称
   */
  protected getEnumName(name: string): string {
    const { enumPrefix = '', enumSuffix = '' } = this.config.naming || {};
    return `${enumPrefix}${name}${enumSuffix}`;
  }

  /**
   * 转换 GraphQL 类型到目标语言类型
   * @param type GraphQL 类型
   * @returns 目标语言类型
   */
  protected abstract convertType(type: string): string;

  /**
   * 生成类型导入语句
   * @param types 需要导入的类型名称列表
   * @returns 导入语句
   */
  protected abstract generateImports(types: string[]): string;

  /**
   * 生成类型定义
   * @param name 类型名称
   * @param fields 字段列表
   * @returns 类型定义代码
   */
  protected abstract generateTypeDefinition(name: string, fields: any[]): string;

  /**
   * 生成操作代码
   * @param operation 操作信息
   * @returns 操作代码
   */
  protected abstract generateOperation(operation: any): string;
}