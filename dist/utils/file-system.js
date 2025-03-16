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
exports.FileSystem = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FileSystem {
    /**
     * 读取文件内容
     * @param filePath 文件路径
     * @returns 文件内容
     */
    static async readFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf-8');
        }
        catch (error) {
            throw new Error(`读取文件失败: ${filePath}, 错误: ${error.message}`);
        }
    }
    /**
     * 写入文件内容
     * @param filePath 文件路径
     * @param content 文件内容
     */
    static async writeFile(filePath, content) {
        try {
            // 确保目录存在
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, content, 'utf-8');
        }
        catch (error) {
            throw new Error(`写入文件失败: ${filePath}, 错误: ${error.message}`);
        }
    }
    /**
     * 创建目录
     * @param dirPath 目录路径
     */
    static async createDirectory(dirPath) {
        try {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        }
        catch (error) {
            throw new Error(`创建目录失败: ${dirPath}, 错误: ${error.message}`);
        }
    }
    /**
     * 列出目录内容
     * @param dirPath 目录路径
     * @returns 文件名列表
     */
    static async listDirectory(dirPath) {
        try {
            return fs.readdirSync(dirPath);
        }
        catch (error) {
            throw new Error(`列出目录失败: ${dirPath}, 错误: ${error.message}`);
        }
    }
    /**
     * 搜索文件
     * @param basePath 基础路径
     * @param pattern 搜索模式
     * @returns 匹配的文件路径列表
     */
    static async searchFiles(basePath, pattern) {
        try {
            const files = [];
            const walk = (dir) => {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        walk(fullPath);
                    }
                    else if (entry.isFile() && entry.name.match(pattern)) {
                        files.push(fullPath);
                    }
                }
            };
            walk(basePath);
            return files;
        }
        catch (error) {
            throw new Error(`搜索文件失败: ${basePath}, 模式: ${pattern}, 错误: ${error.message}`);
        }
    }
}
exports.FileSystem = FileSystem;
