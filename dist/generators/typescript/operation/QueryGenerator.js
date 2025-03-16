"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryGenerator = void 0;
const OperationGenerator_1 = require("./OperationGenerator");
/**
 * 查询操作生成器
 * 负责生成GraphQL查询操作的TypeScript代码
 */
class QueryGenerator extends OperationGenerator_1.OperationGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'QueryGenerator';
    }
    /**
     * 获取操作类型
     */
    getOperationType() {
        return 'query';
    }
    /**
     * 获取客户端名称
     */
    getClientName() {
        return 'Query';
    }
    /**
     * 获取文件名
     */
    getFileName() {
        return 'queries';
    }
    /**
     * 获取查询操作列表
     */
    getOperations() {
        return this.schema.queries || [];
    }
}
exports.QueryGenerator = QueryGenerator;
