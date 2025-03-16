import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

/**
 * 模板管理器
 * 负责加载和渲染Handlebars模板
 */
export class TemplateManager {
  private readonly templates: Map<string, Handlebars.TemplateDelegate> = new Map();
  private readonly templateDir: string;

  /**
   * 创建模板管理器
   * @param templateDir 模板目录路径，默认为当前目录下的templates文件夹
   */
  constructor(templateDir?: string) {
    this.templateDir = templateDir || path.join(__dirname, 'templates');
    this.registerHelpers();
  }

  /**
   * 注册Handlebars助手函数
   */
  private registerHelpers(): void {
    // 条件判断助手
    Handlebars.registerHelper('ifCond', function(this: any, v1, operator, v2, options) {
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
    Handlebars.registerHelper('unless', function(this: any, condition, options) {
      return condition ? options.inverse(this) : options.fn(this);
    });

    // 缩进助手
    Handlebars.registerHelper('indent', function(depth) {
      // 每个缩进级别对应2个空格
      return ' '.repeat(depth * 2);
    });

    // 首字母大写助手
    Handlebars.registerHelper('capitalize', function(text) {
      if (!text) return '';
      return text.charAt(0).toUpperCase() + text.slice(1);
    });

    // 首字母小写助手
    Handlebars.registerHelper('uncapitalize', function(text) {
      if (!text) return '';
      return text.charAt(0).toLowerCase() + text.slice(1);
    });

    // 连接数组助手
    Handlebars.registerHelper('join', function(array, separator) {
      if (!array || !Array.isArray(array)) return '';
      return array.join(separator || ', ');
    });

    // 三元运算符助手
    Handlebars.registerHelper('ternary', function(condition, trueValue, falseValue) {
      return condition ? trueValue : falseValue;
    });

    // 空格生成助手
    Handlebars.registerHelper('spaces', function(count) {
      return ' '.repeat(count * 2);
    });

    // 原始文本助手，避免HTML实体编码
    Handlebars.registerHelper('raw', function(text) {
      return new Handlebars.SafeString(text);
    });
  }

  /**
   * 加载模板
   * @param templateName 模板名称
   * @param templateContent 模板内容（可选，如果提供则不从文件加载）
   * @returns 模板管理器实例，用于链式调用
   */
  public loadTemplate(templateName: string, templateContent?: string): TemplateManager {
    if (templateContent) {
      this.templates.set(templateName, Handlebars.compile(templateContent));
    } else {
      const templatePath = path.join(this.templateDir, `${templateName}.hbs`);
      if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath, 'utf8');
        this.templates.set(templateName, Handlebars.compile(content));
      } else {
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
  public loadInlineTemplate(templateName: string, templateContent: string): TemplateManager {
    this.templates.set(templateName, Handlebars.compile(templateContent));
    return this;
  }

  /**
   * 渲染模板
   * @param templateName 模板名称
   * @param context 模板上下文数据
   * @returns 渲染后的内容
   */
  public render(templateName: string, context: any): string {
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
  public hasTemplate(templateName: string): boolean {
    return this.templates.has(templateName);
  }

  /**
   * 获取所有已加载的模板名称
   * @returns 模板名称数组
   */
  public getTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }
}