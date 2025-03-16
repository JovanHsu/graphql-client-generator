"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsGenerator = void 0;
const BaseTypeScriptGenerator_1 = require("../BaseTypeScriptGenerator");
/**
 * 工具函数生成器
 * 负责生成GraphQL客户端所需的工具函数
 */
class UtilsGenerator extends BaseTypeScriptGenerator_1.BaseTypeScriptGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
        // 加载工具函数模板
        try {
            this.templateManager.loadTemplate('utils');
        }
        catch (error) {
            console.error(`Error loading utils template: ${error.message}`);
        }
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'UtilsGenerator';
    }
    /**
     * 生成工具函数内容
     */
    generateUtilsContent() {
        // 使用模板渲染工具函数
        return this.templateManager.render('utils', {});
    }
    /**
     * 生成工具函数
     */
    async generate() {
        const content = this.generateUtilsContent();
        await this.fileManager.writeFile('utils.ts', content);
        console.log('Generated utils.ts');
    }
}
exports.UtilsGenerator = UtilsGenerator;
