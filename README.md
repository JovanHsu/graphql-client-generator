# GraphQL 客户端生成器

一个用于自动生成 TypeScript 和 JavaScript GraphQL 客户端代码的工具。

## 功能特点

- 🚀 根据 GraphQL schema 自动生成类型安全的客户端代码
- 📡 支持从文件或 GraphQL 端点获取 schema
- 🔄 支持 TypeScript 和 JavaScript 两种语言
- 🧩 可选择性地与 React、Vue 等前端框架集成
- 🔒 生成的 TypeScript 代码提供完整的类型定义，确保类型安全
- 💅 使用 Prettier 对生成的代码进行格式化，保持代码风格一致
- 🔧 支持自定义类型、枚举等命名规则

## 安装

### 作为依赖安装

```bash
npm install graphql-client-generator
# 或
yarn add graphql-client-generator
```

### 全局安装作为命令行工具

```bash
npm install -g graphql-client-generator
# 或
yarn global add graphql-client-generator
```

## 使用方法

```typescript
import { generateClient } from 'graphql-client-generator';
import * as path from 'path';

async function main() {
  try {
    // 方式一：从文件获取 schema
    await generateClient({
      schemaPath: path.resolve('./schema.graphql'),
      schemaFormat: 'file',  // 可选，默认就是 'file'
      outputDir: path.resolve('./generated/from-file'),
      language: 'typescript',
      documents: [],  // 可选的操作文件
      prettier: {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
      naming: {
        typePrefix: '',
        typeSuffix: '',
        enumPrefix: '',
        enumSuffix: 'Enum',
      },
    });

    console.log('✨ 从文件生成客户端代码成功！');
    
    // 方式二：从 GraphQL 端点获取 schema
    await generateClient({
      endpoint: 'https://api.example.com/graphql',
      schemaFormat: 'endpoint',
      outputDir: path.resolve('./generated/from-endpoint'),
      language: 'typescript',
      documents: [],
      prettier: {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
      },
      naming: {
        typePrefix: '',
        typeSuffix: '',
        enumPrefix: '',
        enumSuffix: 'Enum',
      },
    });
    
    console.log('✨ 从端点生成客户端代码成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

main();
```

## 配置选项

| 选项 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `schemaPath` | `string` | 否* | GraphQL schema 文件路径（与 endpoint 二选一） |
| `endpoint` | `string` | 否* | GraphQL 端点 URL（与 schemaPath 二选一） |
| `schemaFormat` | `'file' \| 'endpoint'` | 否 | schema 获取方式，默认为 'file' |
| `outputDir` | `string` | 是 | 输出目录 |
| `language` | `'typescript' \| 'javascript'` | 是 | 目标语言 |
| `documents` | `string[]` | 否 | GraphQL 操作文件路径（查询和变更） |
| `framework` | `'react' \| 'vue' \| 'none'` | 否 | 框架支持 |
| `prettier` | `object` | 否 | 代码格式化选项 |
| `naming` | `object` | 否 | 命名约定 |
| `plugins` | `object` | 否 | 插件配置 |

## 生成的代码结构

生成的客户端代码包括：

1. **类型定义**：
   - `types.models.ts`：数据模型类型
   - `types.inputs.ts`：输入参数类型
   - `types.enums.ts`：枚举类型
   - `types.index.ts`：类型索引

2. **操作定义**：
   - `queries.ts`：查询操作
   - `mutations.ts`：变更操作
   - `fragments.ts`：片段定义

3. **客户端实现**：
   - `client.ts`：GraphQL 客户端类
   - `utils.ts`：工具函数

## 命令行使用

如果您全局安装了该工具，可以直接使用命令行：

```bash
# 从文件生成
$ graphql-client-gen --schema ./schema.graphql --output ./generated

# 从端点生成
$ graphql-client-gen --endpoint https://api.example.com/graphql --format endpoint --output ./generated

# 查看帮助信息
$ graphql-client-gen --help
```

### 命令行选项

| 选项 | 描述 |
|------|------|
| `--schema <path>` | GraphQL schema 文件路径 |
| `--endpoint <url>` | GraphQL 端点 URL |
| `--format <type>` | schema 获取方式，可选值: file, endpoint，默认: file |
| `--output <dir>` | 输出目录，默认: ./generated |
| `--language <lang>` | 目标语言，可选值: typescript, javascript，默认: typescript |
| `--documents <paths>` | GraphQL 操作文件路径，多个路径用逗号分隔 |
| `--framework <framework>` | 框架支持，可选值: react, vue, none，默认: none |
| `--help` | 显示帮助信息 |

## 示例

查看 `example` 目录中的示例项目，了解如何使用该工具。

## 许可证

MIT 