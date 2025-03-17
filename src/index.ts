export { GeneratorConfig } from './config';
export * from './generators';
export * from './utils/file-system';
export * from './utils/schema-parser';
export * from './utils/schema-fetcher';

import * as path from 'path';
import { GeneratorConfig, defaultConfig } from './config';
import { BaseGenerator, JavaScriptGenerator, TypeScriptGenerator } from './generators';
import { SchemaParser } from './utils/schema-parser';
import { SchemaFetcher } from './utils/schema-fetcher';

/**
 * 生成 GraphQL 客户端代码
 * @param config 生成器配置
 */
export async function generateClient(config: GeneratorConfig): Promise<void> {
  try {
    // 合并配置
    const finalConfig = { ...defaultConfig, ...config };

    // 获取 schema 文件路径
    const schemaPath = await SchemaFetcher.getSchemaPath(
      finalConfig.schemaPath,
      finalConfig.endpoint,
      finalConfig.schemaFormat,
      path.resolve(finalConfig.outputDir)
    );

    // 解析 schema
    const parser = new SchemaParser(schemaPath);
    await parser.initialize();
    const schema = parser.parse();

    // 根据配置选择生成器
    const Generator = finalConfig.language === 'typescript' 
      ? TypeScriptGenerator 
      : JavaScriptGenerator;

    // 初始化生成器
    const generator = new Generator(finalConfig, parser);
    
    // 生成代码前初始化
    if ('initialize' in generator) {
      await (generator as BaseGenerator).initialize();
    }

    // 生成代码
    await generator.generate();
  } catch (error: any) {
    throw new Error(`生成 GraphQL 客户端代码失败: ${error.message}`);
  }
}