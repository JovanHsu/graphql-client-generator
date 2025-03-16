import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';

/**
 * 类型生成器接口
 * 所有类型生成器的基类
 */
export abstract class TypeGenerator extends BaseTypeScriptGenerator {
  /**
   * 获取生成器名称
   */
  public abstract getName(): string;
}