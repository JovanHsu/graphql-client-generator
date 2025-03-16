import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
/**
 * 客户端类生成器
 * 负责生成客户端类
 */
export declare class ClientGenerator extends BaseTypeScriptGenerator {
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 生成客户端类
     */
    generate(): Promise<void>;
}
