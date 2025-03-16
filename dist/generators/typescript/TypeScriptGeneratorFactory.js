"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptGeneratorFactory = void 0;
const TypeScriptGenerator_1 = require("../typescript/TypeScriptGenerator");
const EnumTypeGenerator_1 = require("./type/EnumTypeGenerator");
const ModelTypeGenerator_1 = require("./type/ModelTypeGenerator");
const InputTypeGenerator_1 = require("./type/InputTypeGenerator");
const TypeIndexGenerator_1 = require("./type/TypeIndexGenerator");
const QueryGenerator_1 = require("./operation/QueryGenerator");
const MutationGenerator_1 = require("./operation/MutationGenerator");
const SubscriptionGenerator_1 = require("./operation/SubscriptionGenerator");
const UtilsGenerator_1 = require("./util/UtilsGenerator");
const ClientGenerator_1 = require("./util/ClientGenerator");
const FragmentGenerator_1 = require("./util/FragmentGenerator");
/**
 * TypeScript生成器工厂类
 * 负责创建各种生成器实例
 */
class TypeScriptGeneratorFactory {
    /**
     * 创建TypeScript生成器
     */
    static createGenerator(config, schemaParser, options = {}) {
        return new TypeScriptGenerator_1.TypeScriptGenerator(config, schemaParser, options);
    }
    /**
     * 创建类型生成器
     */
    static createTypeGenerators(config, schemaParser, fileManager, options) {
        return [
            new EnumTypeGenerator_1.EnumTypeGenerator(config, schemaParser, fileManager, options),
            new ModelTypeGenerator_1.ModelTypeGenerator(config, schemaParser, fileManager, options),
            new InputTypeGenerator_1.InputTypeGenerator(config, schemaParser, fileManager, options),
            new TypeIndexGenerator_1.TypeIndexGenerator(config, schemaParser, fileManager, options)
        ];
    }
    /**
     * 创建操作生成器
     */
    static createOperationGenerators(config, schemaParser, fileManager, options) {
        return [
            new QueryGenerator_1.QueryGenerator(config, schemaParser, fileManager, options),
            new MutationGenerator_1.MutationGenerator(config, schemaParser, fileManager, options),
            new SubscriptionGenerator_1.SubscriptionGenerator(config, schemaParser, fileManager, options)
        ];
    }
    /**
     * 创建工具生成器
     */
    static createUtilGenerators(config, schemaParser, fileManager, options) {
        return [
            new UtilsGenerator_1.UtilsGenerator(config, schemaParser, fileManager, options),
            new ClientGenerator_1.ClientGenerator(config, schemaParser, fileManager, options),
            new FragmentGenerator_1.FragmentGenerator(config, schemaParser, fileManager, options)
        ];
    }
}
exports.TypeScriptGeneratorFactory = TypeScriptGeneratorFactory;
