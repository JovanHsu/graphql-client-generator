import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';
/**
 * 片段生成器
 * 负责生成片段
 */
export declare class FragmentGenerator extends BaseTypeScriptGenerator {
    private readonly fragments;
    /**
     * 获取生成器名称
     */
    getName(): string;
    /**
     * 初始化片段
     */
    initialize(): void;
    /**
     * 生成片段
     */
    generate(): Promise<void>;
    /**
     * 生成类型片段
     */
    private generateTypeFragment;
}
