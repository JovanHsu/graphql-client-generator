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
exports.FileManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * 文件管理器
 * 负责处理文件的读写操作
 */
class FileManager {
    constructor(config) {
        this.generatedFiles = new Set();
        this.outputDir = path.resolve(config.outputDir);
    }
    /**
     * 确保目录存在
     * @param dir 目录路径
     */
    ensureDirectoryExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    /**
     * 清理生成的文件
     */
    cleanupGeneratedFiles() {
        if (fs.existsSync(this.outputDir)) {
            const files = fs.readdirSync(this.outputDir);
            for (const file of files) {
                const filePath = path.join(this.outputDir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
        }
        this.ensureDirectoryExists(this.outputDir);
    }
    /**
     * 跟踪生成的文件
     * @param fileName 文件名
     */
    trackGeneratedFile(fileName) {
        this.generatedFiles.add(fileName);
    }
    /**
     * 写入文件
     * @param fileName 文件名
     * @param content 文件内容
     */
    async writeFile(fileName, content) {
        this.ensureDirectoryExists(this.outputDir);
        const filePath = path.join(this.outputDir, fileName);
        // 替换HTML实体编码
        const decodedContent = content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x3D;/g, '=')
            .replace(/&#x60;/g, '`')
            .replace(/&#x27;/g, "'")
            .replace(/&#39;/g, "'")
            .replace(/&apos;/g, "'")
            .replace(/&#x2F;/g, '/')
            .replace(/&#47;/g, '/')
            .replace(/&#x2B;/g, '+');
        await fs.promises.writeFile(filePath, decodedContent, 'utf8');
        this.trackGeneratedFile(fileName);
    }
    /**
     * 获取生成的文件列表
     */
    getGeneratedFiles() {
        return Array.from(this.generatedFiles);
    }
}
exports.FileManager = FileManager;
