/**
 * 模板管理器
 * 负责加载和渲染Handlebars模板
 */
export declare class TemplateManager {
    private readonly templates;
    private readonly templateDir;
    /**
     * 创建模板管理器
     * @param templateDir 模板目录路径，默认为当前目录下的templates文件夹
     */
    constructor(templateDir?: string);
    /**
     * 注册Handlebars助手函数
     */
    private registerHelpers;
    /**
     * 加载模板
     * @param templateName 模板名称
     * @param templateContent 模板内容（可选，如果提供则不从文件加载）
     * @returns 模板管理器实例，用于链式调用
     */
    loadTemplate(templateName: string, templateContent?: string): TemplateManager;
    /**
     * 加载内存中的模板
     * @param templateName 模板名称
     * @param templateContent 模板内容
     * @returns 模板管理器实例，用于链式调用
     */
    loadInlineTemplate(templateName: string, templateContent: string): TemplateManager;
    /**
     * 渲染模板
     * @param templateName 模板名称
     * @param context 模板上下文数据
     * @returns 渲染后的内容
     */
    render(templateName: string, context: any): string;
    /**
     * 检查模板是否已加载
     * @param templateName 模板名称
     * @returns 是否已加载
     */
    hasTemplate(templateName: string): boolean;
    /**
     * 获取所有已加载的模板名称
     * @returns 模板名称数组
     */
    getTemplateNames(): string[];
}
