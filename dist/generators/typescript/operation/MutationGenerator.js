"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationGenerator = void 0;
const OperationGenerator_1 = require("./OperationGenerator");
/**
 * 变更操作生成器
 * 负责生成GraphQL变更操作的TypeScript代码
 */
class MutationGenerator extends OperationGenerator_1.OperationGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'MutationGenerator';
    }
    /**
     * 获取操作类型
     */
    getOperationType() {
        return 'mutation';
    }
    /**
     * 获取客户端名称
     */
    getClientName() {
        return 'Mutation';
    }
    /**
     * 获取文件名
     */
    getFileName() {
        return 'mutations';
    }
    /**
     * 获取变更操作列表
     */
    getOperations() {
        return this.schema.mutations || [];
    }
}
exports.MutationGenerator = MutationGenerator;
