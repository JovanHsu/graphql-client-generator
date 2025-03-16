"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaParser = void 0;
const graphql_1 = require("graphql");
const file_system_1 = require("./file-system");
class SchemaParser {
    constructor(schemaPath) {
        this.schemaPath = schemaPath;
    }
    /**
     * 初始化解析器
     */
    async initialize() {
        try {
            const schemaContent = await file_system_1.FileSystem.readFile(this.schemaPath);
            this.schema = (0, graphql_1.buildSchema)(schemaContent);
            this.document = (0, graphql_1.parse)(schemaContent);
        }
        catch (error) {
            throw new Error(`初始化 Schema 解析器失败: ${error.message}`);
        }
    }
    /**
     * 解析 schema
     */
    parse() {
        if (!this.schema || !this.document) {
            throw new Error('Schema 未初始化');
        }
        const types = this.parseTypes();
        const queries = this.parseOperations('query');
        const mutations = this.parseOperations('mutation');
        const subscriptions = this.parseOperations('subscription');
        // 按类型分类
        const enums = types.filter(type => type.kind === 'enum');
        const models = types.filter(type => type.kind === 'object');
        const inputs = types.filter(type => type.kind === 'input');
        return {
            types,
            enums,
            models,
            inputs,
            queries,
            mutations,
            subscriptions,
            operations: {
                queries,
                mutations,
                subscriptions,
            },
            fragments: [], // 默认空数组
        };
    }
    /**
     * 解析类型定义
     */
    parseTypes() {
        const types = [];
        const typeMap = this.schema.getTypeMap();
        for (const [name, type] of Object.entries(typeMap)) {
            // 跳过内置类型
            if (name.startsWith('__') || ['String', 'Int', 'Float', 'Boolean', 'ID'].includes(name)) {
                continue;
            }
            if (type instanceof graphql_1.GraphQLObjectType || type instanceof graphql_1.GraphQLInputObjectType) {
                const fields = type.getFields();
                const parsedFields = [];
                for (const [fieldName, field] of Object.entries(fields)) {
                    const fieldType = field.type;
                    let typeName = '';
                    let required = false;
                    if (fieldType instanceof graphql_1.GraphQLNonNull) {
                        required = true;
                        if (fieldType.ofType instanceof graphql_1.GraphQLList) {
                            typeName = `[${this.getTypeName(fieldType.ofType.ofType)}]`;
                        }
                        else {
                            typeName = this.getTypeName(fieldType.ofType);
                        }
                    }
                    else if (fieldType instanceof graphql_1.GraphQLList) {
                        typeName = `[${this.getTypeName(fieldType.ofType)}]`;
                    }
                    else {
                        typeName = this.getTypeName(fieldType);
                    }
                    parsedFields.push({
                        name: fieldName,
                        type: typeName,
                        required,
                    });
                }
                types.push({
                    name,
                    kind: type instanceof graphql_1.GraphQLInputObjectType ? 'input' : 'object',
                    fields: parsedFields,
                });
            }
            else if (type instanceof graphql_1.GraphQLEnumType) {
                types.push({
                    name,
                    kind: 'enum',
                    values: type.getValues().map(v => v.name),
                });
            }
        }
        return types;
    }
    /**
     * 解析操作定义
     */
    parseOperations(type) {
        const operations = [];
        const rootType = type === 'query'
            ? this.schema.getQueryType()
            : type === 'mutation'
                ? this.schema.getMutationType()
                : this.schema.getSubscriptionType();
        if (!rootType) {
            return operations;
        }
        const fields = rootType.getFields();
        for (const [name, field] of Object.entries(fields)) {
            const args = [];
            for (const arg of field.args) {
                const argType = arg.type;
                let typeName = '';
                let required = false;
                if (argType instanceof graphql_1.GraphQLNonNull) {
                    required = true;
                    if (argType.ofType instanceof graphql_1.GraphQLList) {
                        typeName = `[${this.getTypeName(argType.ofType.ofType)}]`;
                    }
                    else {
                        typeName = this.getTypeName(argType.ofType);
                    }
                }
                else if (argType instanceof graphql_1.GraphQLList) {
                    typeName = `[${this.getTypeName(argType.ofType)}]`;
                }
                else {
                    typeName = this.getTypeName(argType);
                }
                args.push({
                    name: arg.name,
                    type: typeName,
                    required,
                });
            }
            const returnType = field.type;
            let typeName = '';
            if (returnType instanceof graphql_1.GraphQLNonNull) {
                if (returnType.ofType instanceof graphql_1.GraphQLList) {
                    typeName = `[${this.getTypeName(returnType.ofType.ofType)}]!`;
                }
                else {
                    typeName = `${this.getTypeName(returnType.ofType)}!`;
                }
            }
            else if (returnType instanceof graphql_1.GraphQLList) {
                typeName = `[${this.getTypeName(returnType.ofType)}]`;
            }
            else {
                typeName = this.getTypeName(returnType);
            }
            operations.push({
                name,
                type,
                returnType: typeName,
                arguments: args,
            });
        }
        return operations;
    }
    /**
     * 获取类型名称
     */
    getTypeName(type) {
        return type.toString();
    }
}
exports.SchemaParser = SchemaParser;
