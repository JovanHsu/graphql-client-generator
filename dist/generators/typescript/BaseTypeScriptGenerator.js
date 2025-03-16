"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTypeScriptGenerator = void 0;
const TemplateManager_1 = require("./template/TemplateManager");
const TypeUtils_1 = require("./util/TypeUtils");
/**
 * TypeScript生成器基类
 * 所有TypeScript生成器的基类
 */
class BaseTypeScriptGenerator {
    constructor(config, schemaParser, fileManager, options) {
        this.config = config;
        this.schema = schemaParser.parse();
        this.fileManager = fileManager;
        this.options = {
            strictTypes: true,
            useTypeAliases: false,
            maxTypesPerFile: 20,
            maxFieldSelectionDepth: 5,
            generateComments: true,
            generateNullableTypes: true,
            useFragments: true,
            generateIndexFile: true,
            generateUtils: true,
            generateClient: true,
            ...options
        };
        this.typeUtils = new TypeUtils_1.TypeUtils(this.schema);
        this.templateManager = new TemplateManager_1.TemplateManager();
    }
}
exports.BaseTypeScriptGenerator = BaseTypeScriptGenerator;
