export declare class FileSystem {
    /**
     * 读取文件内容
     * @param filePath 文件路径
     * @returns 文件内容
     */
    static readFile(filePath: string): Promise<string>;
    /**
     * 写入文件内容
     * @param filePath 文件路径
     * @param content 文件内容
     */
    static writeFile(filePath: string, content: string): Promise<void>;
    /**
     * 创建目录
     * @param dirPath 目录路径
     */
    static createDirectory(dirPath: string): Promise<void>;
    /**
     * 列出目录内容
     * @param dirPath 目录路径
     * @returns 文件名列表
     */
    static listDirectory(dirPath: string): Promise<string[]>;
    /**
     * 搜索文件
     * @param basePath 基础路径
     * @param pattern 搜索模式
     * @returns 匹配的文件路径列表
     */
    static searchFiles(basePath: string, pattern: string): Promise<string[]>;
}
