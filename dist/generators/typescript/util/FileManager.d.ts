import { GeneratorConfig } from '../../../config';
/**
 * 文件管理器
 * 负责处理文件的读写操作
 */
export declare class FileManager {
    private readonly outputDir;
    private readonly generatedFiles;
    constructor(config: GeneratorConfig);
    /**
     * 确保目录存在
     * @param dir 目录路径
     */
    private ensureDirectoryExists;
    /**
     * 清理生成的文件
     */
    cleanupGeneratedFiles(): void;
    /**
     * 跟踪生成的文件
     * @param fileName 文件名
     */
    trackGeneratedFile(fileName: string): void;
    /**
     * 写入文件
     * @param fileName 文件名
     * @param content 文件内容
     */
    writeFile(fileName: string, content: string): Promise<void>;
    /**
     * 获取生成的文件列表
     */
    getGeneratedFiles(): string[];
}
