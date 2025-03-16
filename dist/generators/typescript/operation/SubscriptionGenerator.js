"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGenerator = void 0;
const OperationGenerator_1 = require("./OperationGenerator");
/**
 * 订阅操作生成器
 * 负责生成GraphQL订阅操作的TypeScript代码
 */
class SubscriptionGenerator extends OperationGenerator_1.OperationGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'SubscriptionGenerator';
    }
    /**
     * 获取操作类型
     */
    getOperationType() {
        return 'subscription';
    }
    /**
     * 获取客户端名称
     */
    getClientName() {
        return 'Subscription';
    }
    /**
     * 获取文件名
     */
    getFileName() {
        return 'subscriptions';
    }
    /**
     * 获取订阅操作列表
     */
    getOperations() {
        return this.schema.subscriptions || [];
    }
    /**
     * 重写操作方法生成，以支持订阅特有的处理逻辑
     */
    generateOperationMethod(operation) {
        const dependencies = new Set();
        const methodName = operation.name;
        const returnType = this.typeUtils.convertType(operation.returnType);
        if (this.typeUtils.isCustomType(operation.returnType)) {
            dependencies.add(this.typeUtils.getTypeName(operation.returnType.replace(/[\[\]!]/g, '')));
        }
        const processedArgs = operation.arguments.map(arg => {
            const argType = this.typeUtils.convertType(arg.type);
            if (this.typeUtils.isCustomType(arg.type)) {
                dependencies.add(this.typeUtils.getTypeName(arg.type.replace(/[\[\]!]/g, '')));
            }
            return {
                name: arg.name,
                type: argType,
                graphqlType: arg.type,
                required: arg.required
            };
        });
        // 生成字段选择项数组
        const fieldSelectionItems = this.fieldSelectionGenerator.generateFieldSelectionItems(operation.returnType);
        // 使用模板渲染操作方法
        const definition = this.templateManager.render('operation-method', {
            methodName,
            args: processedArgs,
            returnType,
            operationType: operation.type,
            hasArgs: processedArgs.length > 0,
            fieldSelectionItems,
            isSubscription: true
        });
        return {
            dependencies: Array.from(dependencies),
            definition
        };
    }
}
exports.SubscriptionGenerator = SubscriptionGenerator;
