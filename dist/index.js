"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClient = generateClient;
__exportStar(require("./generators"), exports);
__exportStar(require("./utils/file-system"), exports);
__exportStar(require("./utils/schema-parser"), exports);
const config_1 = require("./config");
const generators_1 = require("./generators");
const schema_parser_1 = require("./utils/schema-parser");
/**
 * 生成 GraphQL 客户端代码
 * @param config 生成器配置
 */
async function generateClient(config) {
    try {
        // 合并配置
        const finalConfig = { ...config_1.defaultConfig, ...config };
        // 解析 schema
        const parser = new schema_parser_1.SchemaParser(finalConfig.schemaPath);
        await parser.initialize();
        const schema = parser.parse();
        // 根据配置选择生成器
        const Generator = finalConfig.language === 'typescript'
            ? generators_1.TypeScriptGenerator
            : generators_1.JavaScriptGenerator;
        // 初始化生成器
        const generator = new Generator(finalConfig, parser);
        // 生成代码前初始化
        if ('initialize' in generator) {
            await generator.initialize();
        }
        // 生成代码
        await generator.generate();
    }
    catch (error) {
        throw new Error(`生成 GraphQL 客户端代码失败: ${error.message}`);
    }
}
