const { generateClient } = require('../src');
const path = require('path');

async function main() {
  try {
    // TypeScript 客户端生成
    await generateClient({
      schemaPath: path.resolve(__dirname, './schema.graphqls'),
      outputDir: path.resolve(__dirname, './generated/typescript'),
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

    // JavaScript 客户端生成
    // await generateClient({
    //   schemaPath: path.resolve(__dirname, './schema.graphql'),
    //   outputDir: path.resolve(__dirname, './generated/javascript'),
    //   language: 'javascript',
    //   documents: [],  // 暂时不使用操作文件
    //   prettier: {
    //     semi: true,
    //     singleQuote: true,
    //     tabWidth: 2,
    //     trailingComma: 'es5',
    //   },
    // });

    console.log('✨ 客户端代码生成成功！');
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

main();