import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

/**
 * 模板管理器
 * 负责加载和渲染Handlebars模板
 */
export class TemplateManager {
  private readonly templates: Map<string, Handlebars.TemplateDelegate> = new Map();
  private templateDir: string = '';

  /**
   * 创建模板管理器
   * @param templateDir 模板目录路径，默认为当前目录下的templates文件夹
   */
  constructor(templateDir?: string) {
    // 使用绝对路径，确保在命令行工具中也能找到模板
    const srcDir = path.resolve(__dirname, '../../../../../src');
    const distDir = path.resolve(__dirname, '../../../../');
    
    // 尝试多个可能的路径
    const possiblePaths = [
      // 1. 用户提供的路径
      templateDir,
      // 2. 相对于当前文件的路径（开发环境）
      path.join(__dirname, 'templates'),
      // 3. 相对于src目录的路径（开发环境）
      path.join(srcDir, 'generators/typescript/template/templates'),
      // 4. 相对于dist目录的路径（生产环境）
      path.join(distDir, 'generators/typescript/template/templates')
    ].filter(Boolean);
    
    // 查找第一个存在的路径
    for (const dir of possiblePaths) {
      if (dir && fs.existsSync(dir)) {
        this.templateDir = dir;
        break;
      }
    }
    
    // 如果没有找到有效路径，使用默认路径
    if (!this.templateDir) {
      this.templateDir = path.join(__dirname, 'templates');
      console.warn(`Warning: Template directory not found, using default: ${this.templateDir}`);
    }
    
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