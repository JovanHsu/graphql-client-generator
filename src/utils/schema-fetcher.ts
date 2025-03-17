import { getIntrospectionQuery, buildClientSchema, printSchema } from 'graphql';
import { request } from 'graphql-request';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Schema 获取器
 * 负责从不同来源获取 GraphQL schema
 */
export class SchemaFetcher {
  /**
   * 从 GraphQL 端点获取 schema 并保存到文件
   * @param endpoint GraphQL 端点 URL
   * @param outputPath 输出文件路径
   * @returns 保存的 schema 文件路径
   */
  public static async fetchFromEndpoint(endpoint: string, outputPath: string): Promise<string> {
    try {
      console.log(`正在从 ${endpoint} 获取 GraphQL schema...`);
      
      // 获取内省查询
      const introspectionQuery = getIntrospectionQuery();
      
      // 发送请求获取 schema 信息
      const result = await request(endpoint, introspectionQuery);
      
      // 构建客户端 schema
      const schema = buildClientSchema(result);
      
      // 将 schema 转换为 SDL 格式
      const sdlSchema = printSchema(schema);
      
      // 确保输出目录存在
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // 写入文件
      fs.writeFileSync(outputPath, sdlSchema);
      
      console.log(`✅ Schema 已从 ${endpoint} 获取并保存到 ${outputPath}`);
      
      return outputPath;
    } catch (error: any) {
      throw new Error(`获取 GraphQL schema 失败: ${error.message}`);
    }
  }

  /**
   * 获取 schema 文件路径
   * 如果指定了 endpoint，则从端点获取 schema
   * 如果指定了 schemaPath，则直接返回该路径
   * @param config 配置对象，包含 schemaPath 或 endpoint
   * @param outputDir 输出目录
   * @returns schema 文件路径
   */
  public static async getSchemaPath(
    schemaPath?: string,
    endpoint?: string,
    schemaFormat: 'file' | 'endpoint' = 'file',
    outputDir: string = process.cwd()
  ): Promise<string> {
    // 如果指定了使用文件方式且提供了 schemaPath
    if (schemaFormat === 'file' && schemaPath) {
      // 检查文件是否存在
      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema 文件不存在: ${schemaPath}`);
      }
      return schemaPath;
    }
    
    // 如果指定了使用端点方式且提供了 endpoint
    if (schemaFormat === 'endpoint' && endpoint) {
      // 生成输出文件路径
      const outputPath = path.join(outputDir, 'schema.graphql');
      
      // 从端点获取 schema
      return await this.fetchFromEndpoint(endpoint, outputPath);
    }
    
    // 如果没有提供有效的 schema 来源
    throw new Error('必须提供 schemaPath 或 endpoint 参数');
  }
}