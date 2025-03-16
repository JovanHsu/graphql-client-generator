import * as fs from 'fs';
import * as path from 'path';

export class FileSystem {
  /**
   * 读取文件内容
   * @param filePath 文件路径
   * @returns 文件内容
   */
  public static async readFile(filePath: string): Promise<string> {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error: any) {
      throw new Error(`读取文件失败: ${filePath}, 错误: ${error.message}`);
    }
  }

  /**
   * 写入文件内容
   * @param filePath 文件路径
   * @param content 文件内容
   */
  public static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // 确保目录存在
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content, 'utf-8');
    } catch (error: any) {
      throw new Error(`写入文件失败: ${filePath}, 错误: ${error.message}`);
    }
  }

  /**
   * 创建目录
   * @param dirPath 目录路径
   */
  public static async createDirectory(dirPath: string): Promise<void> {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    } catch (error: any) {
      throw new Error(`创建目录失败: ${dirPath}, 错误: ${error.message}`);
    }
  }

  /**
   * 列出目录内容
   * @param dirPath 目录路径
   * @returns 文件名列表
   */
  public static async listDirectory(dirPath: string): Promise<string[]> {
    try {
      return fs.readdirSync(dirPath);
    } catch (error: any) {
      throw new Error(`列出目录失败: ${dirPath}, 错误: ${error.message}`);
    }
  }

  /**
   * 搜索文件
   * @param basePath 基础路径
   * @param pattern 搜索模式
   * @returns 匹配的文件路径列表
   */
  public static async searchFiles(basePath: string, pattern: string): Promise<string[]> {
    try {
      const files: string[] = [];
      const walk = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(fullPath);
          } else if (entry.isFile() && entry.name.match(pattern)) {
            files.push(fullPath);
          }
        }
      };
      walk(basePath);
      return files;
    } catch (error: any) {
      throw new Error(`搜索文件失败: ${basePath}, 模式: ${pattern}, 错误: ${error.message}`);
    }
  }
}