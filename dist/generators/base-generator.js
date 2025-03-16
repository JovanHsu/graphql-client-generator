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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGenerator = void 0;
const path = __importStar(require("path"));
const prettier = __importStar(require("prettier"));
const file_system_1 = require("../utils/file-system");
class BaseGenerator {
    constructor(config, schemaParser) {
        this.config = config;
        this.schemaParser = schemaParser;
        this.outputPath = path.resolve(config.outputDir);
    }
    /**
     * 初始化生成器
     */
    async initialize() {
        await this.schemaParser.initialize();
        this.schema = this.schemaParser.parse();
        await file_system_1.FileSystem.createDirectory(this.outputPath);
    }
    /**
     * 格式化代码
     * @param code 代码内容
     * @param parser 解析器类型
     * @returns 格式化后的代码
     */
    async formatCode(code, parser = 'typescript') {
        try {
            return prettier.format(code, {
                parser,
                ...this.config.prettier,
            });
        }
        catch (error) {
            console.warn(`代码格式化失败: ${error.message}`);
            return code;
        }
    }
    /**
     * 写入生成的代码到文件
     * @param filePath 相对输出目录的文件路径
     * @param content 文件内容
     */
    async writeFile(filePath, content) {
        const fullPath = path.join(this.outputPath, filePath);
        await file_system_1.FileSystem.writeFile(fullPath, content);
    }
    /**
     * 生成类型名称
     * @param name 原始名称
     * @returns 处理后的名称
     */
    getTypeName(name) {
        const { typePrefix = '', typeSuffix = '' } = this.config.naming || {};
        return `${typePrefix}${name}${typeSuffix}`;
    }
    /**
     * 生成枚举名称
     * @param name 原始名称
     * @returns 处理后的名称
     */
    getEnumName(name) {
        const { enumPrefix = '', enumSuffix = '' } = this.config.naming || {};
        return `${enumPrefix}${name}${enumSuffix}`;
    }
}
exports.BaseGenerator = BaseGenerator;
