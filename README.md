# GraphQL 客户端生成器

一个用于自动生成 TypeScript 和 JavaScript GraphQL 客户端代码的工具。

## 功能特点

- 🚀 根据 GraphQL schema 自动生成类型安全的客户端代码
- 🔄 支持 TypeScript 和 JavaScript 两种语言
- 🧩 可选择性地与 React、Vue 等前端框架集成
- 🔒 生成的 TypeScript 代码提供完整的类型定义，确保类型安全
- 💅 使用 Prettier 对生成的代码进行格式化，保持代码风格一致
- 🔧 支持自定义类型、枚举等命名规则

## 安装

```bash
npm install graphql-client-generator
# 或
yarn add graphql-client-generator
```

## 使用方法

```typescript
import { generateClient } from 'graphql-client-generator';
import * as path from 'path';

async function main() {
  try {
    // 生成 TypeScript 客户端
    await generateClient({
      schemaPath: path.resolve('./schema.graphql'),
      outputDir: path.resolve('./generated'),
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

    console.log('✨ 客户端代码生成成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

main();
```

## 配置选项

| 选项 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `schemaPath` | `string` | 是 | GraphQL schema 文件路径 |
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

## 示例

查看 `example` 目录中的示例项目，了解如何使用该工具。

## 许可证

MIT 