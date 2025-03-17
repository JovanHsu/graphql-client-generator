#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs';
import { generateClient } from './index';
import { GeneratorConfig } from './config';

// 解析命令行参数
const args = process.argv.slice(2);
const options: Record<string, string> = {};

// 帮助信息
const helpText = `
GraphQL 客户端生成器 - 命令行工具

用法:
  graphql-client-gen [选项]

选项:
  --schema <path>          GraphQL schema 文件路径
  --endpoint <url>         GraphQL 端点 URL
  --format <type>          schema 获取方式，可选值: file, endpoint，默认: file
  --output <dir>           输出目录，默认: ./generated
  --language <lang>        目标语言，可选值: typescript, javascript，默认: typescript
  --documents <paths>      GraphQL 操作文件路径（查询和变更），多个路径用逗号分隔
  --framework <framework>  框架支持，可选值: react, vue, none，默认: none
  --help                   显示帮助信息

示例:
  # 从文件生成
  graphql-client-gen --schema ./schema.graphql --output ./generated

  # 从端点生成
  graphql-client-gen --endpoint https://api.example.com/graphql --format endpoint --output ./generated
`;

// 解析参数
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--help') {
    console.log(helpText);
    process.exit(0);
  }
  
  if (arg.startsWith('--') && i + 1 < args.length && !args[i + 1].startsWith('--')) {
    const key = arg.slice(2);
    const value = args[i + 1];
    options[key] = value;
    i++;
  }
}

// 检查必要参数
if (!options.schema && !options.endpoint) {
  console.error('错误: 必须提供 --schema 或 --endpoint 参数');
  console.log(helpText);
  process.exit(1);
}

// 准备配置
const config: GeneratorConfig = {
  outputDir: options.output || './generated',
  language: (options.language as 'typescript' | 'javascript') || 'typescript',
};

// 设置 schema 来源
if (options.schema) {
  config.schemaPath = path.resolve(process.cwd(), options.schema);
  config.schemaFormat = 'file';
  
  // 检查文件是否存在
  if (!fs.existsSync(config.schemaPath)) {
    console.error(`错误: Schema 文件不存在: ${config.schemaPath}`);
    process.exit(1);
  }
}

if (options.endpoint) {
  config.endpoint = options.endpoint;
  config.schemaFormat = 'endpoint';
}

// 如果同时提供了 schema 和 endpoint，使用 format 参数决定使用哪个
if (options.schema && options.endpoint) {
  config.schemaFormat = (options.format as 'file' | 'endpoint') || 'file';
}

// 处理文档路径
if (options.documents) {
  config.documents = options.documents.split(',').map(doc => path.resolve(process.cwd(), doc.trim()));
}

// 处理框架
if (options.framework) {
  config.framework = (options.framework as 'react' | 'vue' | 'none');
}

// 执行生成
(async () => {
  try {
    console.log('开始生成 GraphQL 客户端代码...');
    console.log('配置:', JSON.stringify(config, null, 2));
    
    await generateClient(config);
    
    console.log('✨ 客户端代码生成成功！');
  } catch (error: any) {
    console.error('❌ 生成失败:', error.message);
    process.exit(1);
  }
})();