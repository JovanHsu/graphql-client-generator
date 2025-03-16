"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputTypeGenerator = void 0;
const BaseTypeScriptGenerator_1 = require("../BaseTypeScriptGenerator");
/**
 * 输入类型生成器
 * 负责生成GraphQL输入类型的TypeScript代码
 */
class InputTypeGenerator extends BaseTypeScriptGenerator_1.BaseTypeScriptGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
        // 加载输入类型模板
        try {
            this.templateManager.loadTemplate('input');
        }
        catch (error) {
            console.error(`Error loading input template: ${error.message}`);
        }
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'InputTypeGenerator';
    }
    /**
     * 生成输入类型内容
     */
    generateInputTypeContent(inputs) {
        if (inputs.length === 0) {
            return '// No input types defined';
        }
        const typeDefinitions = [];
        const dependencies = new Set();
        // 检查是否存在模型类型
        const modelTypes = this.schema.types || [];
        const modelTypeNames = new Set(modelTypes.map(t => t.name));
        // 创建输入类型名称映射，用于处理字段引用
        const inputTypeMap = new Map();
        for (const input of inputs) {
            // 直接使用GraphQL schema中的类型名称
            inputTypeMap.set(input.name, input.name);
        }
        for (const input of inputs) {
            // 直接使用GraphQL schema中的类型名称
            const interfaceName = input.name;
            // 处理字段和依赖
            const processedFields = input.fields?.map((field) => {
                let fieldType = this.typeUtils.convertType(field.type);
                if (this.typeUtils.isCustomType(field.type)) {
                    const typeName = this.typeUtils.getTypeName(field.type.replace(/[\[\]!]/g, ''));
                    if (typeName !== input.name) { // 避免自引用
                        dependencies.add(typeName);
                    }
                }
                return {
                    name: field.name,
                    type: fieldType,
                    description: field.description,
                    required: field.required
                };
            });
            // 使用模板渲染输入类型
            const inputContent = this.templateManager.render('input', {
                name: interfaceName,
                description: input.description,
                fields: processedFields,
                generateComments: this.options.generateComments !== false,
                useTypeAliases: this.options.useTypeAliases === true
            });
            typeDefinitions.push(inputContent);
        }
        // 添加依赖导入
        let imports = '';
        if (dependencies.size > 0) {
            const importTypes = Array.from(dependencies).filter(dep => !inputs.some(input => input.name === dep));
            if (importTypes.length > 0) {
                imports = `import type { ${importTypes.join(', ')} } from './types.index';\n\n`;
            }
        }
        return `${imports}${typeDefinitions.join('\n\n')}`;
    }
    /**
     * 生成输入类型
     */
    async generate() {
        const inputs = this.schema.inputs || [];
        // 如果没有输入类型，则生成空的输入类型文件
        if (inputs.length === 0) {
            await this.fileManager.writeFile('types.inputs.ts', '// No input types defined');
            console.log('No input types defined, generating empty types.inputs.ts');
            return;
        }
        // 分批处理输入类型
        const batches = this.typeUtils.splitIntoBatches(inputs, this.options.maxTypesPerFile || 20);
        for (let i = 0; i < batches.length; i++) {
            const content = this.generateInputTypeContent(batches[i]);
            const outputFileName = batches.length > 1 ? `types.inputs.${i + 1}.ts` : 'types.inputs.ts';
            await this.fileManager.writeFile(outputFileName, content);
        }
        // 如果有多个文件，生成索引文件
        if (batches.length > 1) {
            const indexContent = Array.from({ length: batches.length }, (_, i) => `export * from './types.inputs.${i + 1}';`).join('\\n');
            await this.fileManager.writeFile('types.inputs.index.ts', indexContent);
            await this.fileManager.writeFile('types.inputs.ts', `export * from './types.inputs.index';`);
        }
        console.log(`Generated ${inputs.length} input types in ${batches.length} file(s)`);
    }
}
exports.InputTypeGenerator = InputTypeGenerator;
