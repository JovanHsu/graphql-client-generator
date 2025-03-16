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
exports.TemplateManager = void 0;
const fs = __importStar(require("fs"));
const Handlebars = __importStar(require("handlebars"));
const path = __importStar(require("path"));
/**
 * 模板管理器
 * 负责加载和渲染Handlebars模板
 */
class TemplateManager {
    /**
     * 创建模板管理器
     * @param templateDir 模板目录路径，默认为当前目录下的templates文件夹
     */
    constructor(templateDir) {
        this.templates = new Map();
        this.templateDir = templateDir || path.join(__dirname, 'templates');
        this.registerHelpers();
    }
    /**
     * 注册Handlebars助手函数
     */
    registerHelpers() {
        // 条件判断助手
        Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });
        // unless助手
        Handlebars.registerHelper('unless', function (condition, options) {
            return condition ? options.inverse(this) : options.fn(this);
        });
        // 缩进助手
        Handlebars.registerHelper('indent', function (depth) {
            // 每个缩进级别对应2个空格
            return ' '.repeat(depth * 2);
        });
        // 首字母大写助手
        Handlebars.registerHelper('capitalize', function (text) {
            if (!text)
                return '';
            return text.charAt(0).toUpperCase() + text.slice(1);
        });
        // 首字母小写助手
        Handlebars.registerHelper('uncapitalize', function (text) {
            if (!text)
                return '';
            return text.charAt(0).toLowerCase() + text.slice(1);
        });
        // 连接数组助手
        Handlebars.registerHelper('join', function (array, separator) {
            if (!array || !Array.isArray(array))
                return '';
            return array.join(separator || ', ');
        });
        // 三元运算符助手
        Handlebars.registerHelper('ternary', function (condition, trueValue, falseValue) {
            return condition ? trueValue : falseValue;
        });
        // 空格生成助手
        Handlebars.registerHelper('spaces', function (count) {
            return ' '.repeat(count * 2);
        });
        // 原始文本助手，避免HTML实体编码
        Handlebars.registerHelper('raw', function (text) {
            return new Handlebars.SafeString(text);
        });
    }
    /**
     * 加载模板
     * @param templateName 模板名称
     * @param templateContent 模板内容（可选，如果提供则不从文件加载）
     * @returns 模板管理器实例，用于链式调用
     */
    loadTemplate(templateName, templateContent) {
        if (templateContent) {
            this.templates.set(templateName, Handlebars.compile(templateContent));
        }
        else {
            const templatePath = path.join(this.templateDir, `${templateName}.hbs`);
            if (fs.existsSync(templatePath)) {
                const content = fs.readFileSync(templatePath, 'utf8');
                this.templates.set(templateName, Handlebars.compile(content));
            }
            else {
                throw new Error(`Template not found: ${templatePath}`);
            }
        }
        return this;
    }
    /**
     * 加载内存中的模板
     * @param templateName 模板名称
     * @param templateContent 模板内容
     * @returns 模板管理器实例，用于链式调用
     */
    loadInlineTemplate(templateName, templateContent) {
        this.templates.set(templateName, Handlebars.compile(templateContent));
        return this;
    }
    /**
     * 渲染模板
     * @param templateName 模板名称
     * @param context 模板上下文数据
     * @returns 渲染后的内容
     */
    render(templateName, context) {
        const template = this.templates.get(templateName);
        if (!template) {
            throw new Error(`Template not loaded: ${templateName}`);
        }
        return template(context);
    }
    /**
     * 检查模板是否已加载
     * @param templateName 模板名称
     * @returns 是否已加载
     */
    hasTemplate(templateName) {
        return this.templates.has(templateName);
    }
    /**
     * 获取所有已加载的模板名称
     * @returns 模板名称数组
     */
    getTemplateNames() {
        return Array.from(this.templates.keys());
    }
}
exports.TemplateManager = TemplateManager;
