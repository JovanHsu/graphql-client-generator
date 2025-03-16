"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationGenerator = void 0;
const BaseTypeScriptGenerator_1 = require("../BaseTypeScriptGenerator");
const FieldSelectionGenerator_1 = require("../util/FieldSelectionGenerator");
/**
 * 操作生成器接口
 * 所有操作生成器的基类
 */
class OperationGenerator extends BaseTypeScriptGenerator_1.BaseTypeScriptGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
        this.fieldSelectionGenerator = new FieldSelectionGenerator_1.FieldSelectionGenerator(this.schema);
        this.templateManager.loadTemplate('operation-method');
        this.templateManager.loadTemplate('operation-client');
    }
    /**
     * 生成操作方法
     */
    generateOperationMethod(operation) {
        const dependencies = new Set();
        const methodName = operation.name;
        const returnType = this.typeUtils.convertType(operation.returnType);
        const isSubscription = operation.type === 'subscription';
        if (this.typeUtils.isCustomType(operation.returnType)) {
            dependencies.add(this.typeUtils.getTypeName(operation.returnType.replace(/[\[\]!]/g, '')));
        }
        // 处理参数
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
        // 生成字段选择字符串
        const fieldSelection = this.fieldSelectionGenerator.generateFieldSelection(operation.returnType, 10);
        // 使用模板渲染操作方法
        const definition = this.templateManager.render('operation-method', {
            methodName,
            args: processedArgs,
            returnType,
            operationType: operation.type,
            hasArgs: processedArgs.length > 0,
            fieldSelection,
            isSubscription
        });
        return {
            dependencies: Array.from(dependencies),
            definition
        };
    }
    /**
     * 收集操作中使用的所有类型
     */
    collectOperationTypes(operations) {
        const types = new Set();
        operations.forEach(operation => {
            if (this.typeUtils.isCustomType(operation.returnType)) {
                const typeName = this.typeUtils.getTypeName(operation.returnType.replace(/[\[\]!]/g, ''));
                // 排除JavaScript内置类型
                if (typeName !== 'Boolean') {
                    types.add(typeName);
                }
            }
            operation.arguments.forEach(arg => {
                if (this.typeUtils.isCustomType(arg.type)) {
                    const typeName = this.typeUtils.getTypeName(arg.type.replace(/[\[\]!]/g, ''));
                    // 排除JavaScript内置类型
                    if (typeName !== 'Boolean') {
                        types.add(typeName);
                    }
                }
            });
        });
        return Array.from(types);
    }
    /**
     * 生成操作内容
     */
    generateOperationsContent(operations) {
        const operationDefinitions = [];
        for (const operation of operations) {
            const { dependencies, definition } = this.generateOperationMethod(operation);
            operationDefinitions.push(definition);
        }
        const types = this.collectOperationTypes(operations);
        const isSubscription = this.getOperationType() === 'subscription';
        // 使用模板渲染操作客户端
        return this.templateManager.render('operation-client', {
            clientName: this.getClientName(),
            methods: operationDefinitions,
            hasTypes: types.length > 0,
            types,
            isSubscription,
            generateUtils: this.options.generateUtils !== false
        });
    }
    /**
     * 生成操作
     */
    async generate() {
        const operations = this.getOperations();
        // 如果没有操作，则不生成文件
        if (operations.length === 0) {
            console.log(`No ${this.getFileName()} operations defined, skipping ${this.getFileName()}.ts generation`);
            return;
        }
        // 分批处理操作
        const batches = this.typeUtils.splitIntoBatches(operations, this.options.maxTypesPerFile || 20);
        for (let i = 0; i < batches.length; i++) {
            const content = this.generateOperationsContent(batches[i]);
            const outputFileName = batches.length > 1 ? `${this.getFileName()}.${i + 1}.ts` : `${this.getFileName()}.ts`;
            await this.fileManager.writeFile(outputFileName, content);
        }
        // 如果有多个文件，生成索引文件
        if (batches.length > 1) {
            const indexContent = Array.from({ length: batches.length }, (_, i) => `export * from './${this.getFileName()}.${i + 1}';`).join('\n');
            await this.fileManager.writeFile(`${this.getFileName()}.index.ts`, indexContent);
        }
    }
}
exports.OperationGenerator = OperationGenerator;
