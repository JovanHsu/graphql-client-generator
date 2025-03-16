import * as fs from 'fs';
import * as path from 'path';
import { GeneratorConfig } from '../../../config';

/**
 * 文件管理器
 * 负责处理文件的读写操作
 */
export class FileManager {
  private readonly outputDir: string;
  private readonly generatedFiles: Set<string> = new Set();

  constructor(config: GeneratorConfig) {
    this.outputDir = path.resolve(config.outputDir);
  }

  /**
   * 确保目录存在
   * @param dir 目录路径
   */
  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * 清理生成的文件
   */
  public cleanupGeneratedFiles(): void {
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
  public trackGeneratedFile(fileName: string): void {
    this.generatedFiles.add(fileName);
  }

  /**
   * 写入文件
   * @param fileName 文件名
   * @param content 文件内容
   */
  public async writeFile(fileName: string, content: string): Promise<void> {
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
  public getGeneratedFiles(): string[] {
    return Array.from(this.generatedFiles);
  }
}