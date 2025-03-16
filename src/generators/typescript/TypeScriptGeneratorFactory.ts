import { GeneratorConfig } from '../../config';
import { SchemaParser } from '../../utils/schema-parser';
import { TypeScriptGenerator } from '../typescript/TypeScriptGenerator';
import { TypeGenerator } from './type/TypeGenerator';
import { EnumTypeGenerator } from './type/EnumTypeGenerator';
import { ModelTypeGenerator } from './type/ModelTypeGenerator';
import { InputTypeGenerator } from './type/InputTypeGenerator';
import { TypeIndexGenerator } from './type/TypeIndexGenerator';
import { OperationGenerator } from './operation/OperationGenerator';
import { QueryGenerator } from './operation/QueryGenerator';
import { MutationGenerator } from './operation/MutationGenerator';
import { SubscriptionGenerator } from './operation/SubscriptionGenerator';
import { UtilsGenerator } from './util/UtilsGenerator';
import { ClientGenerator } from './util/ClientGenerator';
import { FragmentGenerator } from './util/FragmentGenerator';
import { FileManager } from './util/FileManager';
import { TypeScriptOptions } from './TypeScriptOptions';

/**
 * TypeScript生成器工厂类
 * 负责创建各种生成器实例
 */
export class TypeScriptGeneratorFactory {
  /**
   * 创建TypeScript生成器
   */
  public static createGenerator(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    options: TypeScriptOptions = {}
  ): TypeScriptGenerator {
    return new TypeScriptGenerator(config, schemaParser, options);
  }

  /**
   * 创建类型生成器
   */
  public static createTypeGenerators(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ): TypeGenerator[] {
    return [
      new EnumTypeGenerator(config, schemaParser, fileManager, options),
      new ModelTypeGenerator(config, schemaParser, fileManager, options),
      new InputTypeGenerator(config, schemaParser, fileManager, options),
      new TypeIndexGenerator(config, schemaParser, fileManager, options)
    ];
  }

  /**
   * 创建操作生成器
   */
  public static createOperationGenerators(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ): OperationGenerator[] {
    return [
      new QueryGenerator(config, schemaParser, fileManager, options),
      new MutationGenerator(config, schemaParser, fileManager, options),
      new SubscriptionGenerator(config, schemaParser, fileManager, options)
    ];
  }

  /**
   * 创建工具生成器
   */
  public static createUtilGenerators(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ): any[] {
    return [
      new UtilsGenerator(config, schemaParser, fileManager, options),
      new ClientGenerator(config, schemaParser, fileManager, options),
      new FragmentGenerator(config, schemaParser, fileManager, options)
    ];
  }
}