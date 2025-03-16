"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTypeGenerator = void 0;
const BaseTypeScriptGenerator_1 = require("../BaseTypeScriptGenerator");
/**
 * 枚举类型生成器
 * 负责生成GraphQL枚举类型的TypeScript代码
 */
class EnumTypeGenerator extends BaseTypeScriptGenerator_1.BaseTypeScriptGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
        // 加载枚举模板
        try {
            this.templateManager.loadTemplate('enum');
        }
        catch (error) {
            console.error(`Error loading enum template: ${error.message}`);
        }
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'EnumTypeGenerator';
    }
    /**
     * 生成枚举类型内容
     */
    generateEnumTypeContent(enums) {
        if (enums.length === 0) {
            return '// No enum types defined';
        }
        const enumDefinitions = [];
        for (const enumType of enums) {
            // 使用模板渲染枚举类型
            const enumContent = this.templateManager.render('enum', {
                name: enumType.name,
                description: enumType.description,
                values: enumType.values,
                generateComments: this.options.generateComments !== false
            });
            enumDefinitions.push(enumContent);
        }
        return enumDefinitions.join('\n\n');
    }
    /**
     * 生成枚举类型
     */
    async generate() {
        const enums = this.schema.enums || [];
        // 如果没有枚举类型，则生成空的枚举类型文件
        if (enums.length === 0) {
            await this.fileManager.writeFile('types.enums.ts', '// No enum types defined');
            console.log('No enum types defined, generating empty types.enums.ts');
            return;
        }
        // 分批处理枚举类型
        const batches = this.typeUtils.splitIntoBatches(enums, this.options.maxTypesPerFile || 20);
        for (let i = 0; i < batches.length; i++) {
            const content = this.generateEnumTypeContent(batches[i]);
            const outputFileName = batches.length > 1 ? `types.enums.${i + 1}.ts` : 'types.enums.ts';
            await this.fileManager.writeFile(outputFileName, content);
        }
        // 如果有多个文件，生成索引文件
        if (batches.length > 1) {
            const indexContent = Array.from({ length: batches.length }, (_, i) => `export * from './types.enums.${i + 1}';`).join('\\n');
            await this.fileManager.writeFile('types.enums.index.ts', indexContent);
            await this.fileManager.writeFile('types.enums.ts', `export * from './types.enums.index';`);
        }
        console.log(`Generated ${enums.length} enum types in ${batches.length} file(s)`);
    }
}
exports.EnumTypeGenerator = EnumTypeGenerator;
