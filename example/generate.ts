import * as path from 'path';
import { generateClient } from '../src';

async function main() {
  try {
    // 从文件获取 schema（默认方式）
    console.log('\n1. 从文件获取 schema...');
    await generateClient({
      schemaPath: path.resolve(__dirname, './schema.graphqls'),
      schemaFormat: 'file',  // 可选，默认就是 'file'
      outputDir: path.resolve(__dirname, './generated/typescript-from-file'),
      language: 'typescript',
      documents: [],  // 暂时不使用操作文件
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
    
    // 从端点获取 schema（需要取消注释才会执行）
    // console.log('\n2. 从端点获取 schema...');
    // await generateClient({
    //   endpoint: 'https://api.example.com/graphql',  // 替换为实际的 GraphQL 端点
    //   schemaFormat: 'endpoint',
    //   outputDir: path.resolve(__dirname, './generated/typescript-from-endpoint'),
    //   language: 'typescript',
    //   documents: [],
    //   prettier: {
    //     semi: true,
    //     singleQuote: true,
    //     tabWidth: 2,
    //     trailingComma: 'es5',
    //   },
    //   naming: {
    //     typePrefix: '',
    //     typeSuffix: '',
    //     enumPrefix: '',
    //     enumSuffix: 'Enum',
    //   },
    // });
    // console.log('✨ 从端点生成客户端代码成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

main();