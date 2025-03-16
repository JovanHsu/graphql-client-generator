"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptGenerator = void 0;
const FileManager_1 = require("./util/FileManager");
const EnumTypeGenerator_1 = require("./type/EnumTypeGenerator");
const ModelTypeGenerator_1 = require("./type/ModelTypeGenerator");
const InputTypeGenerator_1 = require("./type/InputTypeGenerator");
const QueryGenerator_1 = require("./operation/QueryGenerator");
const MutationGenerator_1 = require("./operation/MutationGenerator");
const SubscriptionGenerator_1 = require("./operation/SubscriptionGenerator");
const FragmentGenerator_1 = require("./fragment/FragmentGenerator");
const UtilsGenerator_1 = require("./util/UtilsGenerator");
const ClientGenerator_1 = require("./client/ClientGenerator");
const TypeIndexGenerator_1 = require("./type/TypeIndexGenerator");
/**
 * TypeScript生成器
 * 负责生成GraphQL客户端的TypeScript代码
 */
class TypeScriptGenerator {
    constructor(config, schemaParser, options = {}) {
        this.config = config;
        this.schemaParser = schemaParser;
        this.fileManager = new FileManager_1.FileManager(config);
        this.options = options;
    }
    /**
     * 清理生成的文件
     */
    cleanupGeneratedFiles() {
        this.fileManager.cleanupGeneratedFiles();
    }
    /**
     * 生成代码
     */
    async generate() {
        console.log('Generating TypeScript client...');
        // 清理生成的文件
        this.cleanupGeneratedFiles();
        // 生成枚举类型
        const enumGenerator = new EnumTypeGenerator_1.EnumTypeGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await enumGenerator.generate();
        // 生成模型类型
        const modelGenerator = new ModelTypeGenerator_1.ModelTypeGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await modelGenerator.generate();
        // 生成输入类型
        const inputGenerator = new InputTypeGenerator_1.InputTypeGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await inputGenerator.generate();
        // 生成类型索引
        const typeIndexGenerator = new TypeIndexGenerator_1.TypeIndexGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await typeIndexGenerator.generate();
        // 生成片段
        const fragmentGenerator = new FragmentGenerator_1.FragmentGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await fragmentGenerator.generate();
        // 生成查询
        const queryGenerator = new QueryGenerator_1.QueryGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await queryGenerator.generate();
        // 生成变更
        const mutationGenerator = new MutationGenerator_1.MutationGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await mutationGenerator.generate();
        // 生成订阅
        const subscriptionGenerator = new SubscriptionGenerator_1.SubscriptionGenerator(this.config, this.schemaParser, this.fileManager, this.options);
        await subscriptionGenerator.generate();
        // 生成工具函数
        if (this.options.generateUtils !== false) {
            const utilsGenerator = new UtilsGenerator_1.UtilsGenerator(this.config, this.schemaParser, this.fileManager, this.options);
            await utilsGenerator.generate();
        }
        // 生成客户端
        if (this.options.generateClient !== false) {
            const clientGenerator = new ClientGenerator_1.ClientGenerator(this.config, this.schemaParser, this.fileManager, this.options);
            await clientGenerator.generate();
        }
        console.log('TypeScript client generation completed.');
        return this.fileManager.getGeneratedFiles();
    }
}
exports.TypeScriptGenerator = TypeScriptGenerator;
