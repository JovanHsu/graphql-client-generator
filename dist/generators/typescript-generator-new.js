"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptGenerator = void 0;
const base_generator_1 = require("./base-generator");
const FileManager_1 = require("./typescript/util/FileManager");
const EnumTypeGenerator_1 = require("./typescript/type/EnumTypeGenerator");
const ModelTypeGenerator_1 = require("./typescript/type/ModelTypeGenerator");
const InputTypeGenerator_1 = require("./typescript/type/InputTypeGenerator");
const TypeIndexGenerator_1 = require("./typescript/type/TypeIndexGenerator");
const QueryGenerator_1 = require("./typescript/operation/QueryGenerator");
const MutationGenerator_1 = require("./typescript/operation/MutationGenerator");
const SubscriptionGenerator_1 = require("./typescript/operation/SubscriptionGenerator");
const UtilsGenerator_1 = require("./typescript/util/UtilsGenerator");
const ClientGenerator_1 = require("./typescript/util/ClientGenerator");
const FragmentGenerator_1 = require("./typescript/util/FragmentGenerator");
/**
 * TypeScript生成器
 * 使用模块化设计，将功能拆分为多个小型模块
 */
class TypeScriptGenerator extends base_generator_1.BaseGenerator {
    constructor(config, schemaParser, options = {}) {
        super(config, schemaParser);
        this.options = {
            fragmentsEnabled: true,
            maxFieldsPerType: 50,
            maxTypesPerFile: 20,
            errorHandling: {
                retryAttempts: 3,
                timeout: 30000
            },
            ...options
        };
        // 创建文件管理器
        this.fileManager = new FileManager_1.FileManager(config, this.formatCode.bind(this));
        // 创建类型生成器
        this.typeGenerators = [
            new EnumTypeGenerator_1.EnumTypeGenerator(config, schemaParser, this.fileManager, this.options),
            new ModelTypeGenerator_1.ModelTypeGenerator(config, schemaParser, this.fileManager, this.options),
            new InputTypeGenerator_1.InputTypeGenerator(config, schemaParser, this.fileManager, this.options),
            new TypeIndexGenerator_1.TypeIndexGenerator(config, schemaParser, this.fileManager, this.options)
        ];
        // 创建操作生成器
        this.operationGenerators = [
            new QueryGenerator_1.QueryGenerator(config, schemaParser, this.fileManager, this.options),
            new MutationGenerator_1.MutationGenerator(config, schemaParser, this.fileManager, this.options),
            new SubscriptionGenerator_1.SubscriptionGenerator(config, schemaParser, this.fileManager, this.options)
        ];
        // 创建工具生成器
        this.utilGenerators = [
            new UtilsGenerator_1.UtilsGenerator(config, schemaParser, this.fileManager, this.options),
            new ClientGenerator_1.ClientGenerator(config, schemaParser, this.fileManager, this.options)
        ];
        // 创建片段生成器
        this.fragmentGenerator = new FragmentGenerator_1.FragmentGenerator(config, schemaParser, this.fileManager, this.options);
    }
    /**
     * 生成所有代码
     */
    async generate() {
        // 清理之前生成的文件
        await this.fileManager.cleanupGeneratedFiles();
        // 生成类型定义
        for (const generator of this.typeGenerators) {
            await generator.generate();
        }
        // 生成片段
        if (this.options.fragmentsEnabled) {
            await this.fragmentGenerator.generate();
        }
        // 生成操作
        for (const generator of this.operationGenerators) {
            await generator.generate();
        }
        // 生成工具类
        for (const generator of this.utilGenerators) {
            await generator.generate();
        }
        console.log('Generated files:', this.fileManager.getGeneratedFiles());
    }
}
exports.TypeScriptGenerator = TypeScriptGenerator;
