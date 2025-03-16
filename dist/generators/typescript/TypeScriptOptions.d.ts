/**
 * TypeScript生成器选项
 */
export interface TypeScriptOptions {
    /**
     * 是否生成严格类型
     * 默认: true
     */
    strictTypes?: boolean;
    /**
     * 是否使用类型别名
     * 默认: false
     */
    useTypeAliases?: boolean;
    /**
     * 每个文件最大类型数量
     * 默认: 20
     */
    maxTypesPerFile?: number;
    /**
     * 字段选择最大深度
     * 默认: 5
     */
    maxFieldSelectionDepth?: number;
    /**
     * 是否生成注释
     * 默认: true
     */
    generateComments?: boolean;
    /**
     * 是否生成可空类型
     * 默认: true
     */
    generateNullableTypes?: boolean;
    /**
     * 是否使用片段
     * 默认: true
     */
    useFragments?: boolean;
    /**
     * 是否生成索引文件
     * 默认: true
     */
    generateIndexFile?: boolean;
    /**
     * 是否生成工具函数
     * 默认: true
     */
    generateUtils?: boolean;
    /**
     * 是否生成客户端
     * 默认: true
     */
    generateClient?: boolean;
    /**
     * 是否启用片段
     * 默认: true
     */
    fragmentsEnabled?: boolean;
    /**
     * 每个类型的最大字段数
     * 默认: 50
     */
    maxFieldsPerType?: number;
    /**
     * 错误处理选项
     */
    errorHandling?: {
        /**
         * 重试次数
         * 默认: 3
         */
        retryAttempts?: number;
        /**
         * 超时时间（毫秒）
         * 默认: 30000
         */
        timeout?: number;
    };
}
