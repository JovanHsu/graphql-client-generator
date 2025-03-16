import { TypeInfo } from '../../../utils/schema-parser';
import { BaseTypeScriptGenerator } from '../BaseTypeScriptGenerator';

/**
 * 片段生成器
 * 负责生成片段
 */
export class FragmentGenerator extends BaseTypeScriptGenerator {
  private readonly fragments: Map<string, string> = new Map();

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'FragmentGenerator';
  }

  /**
   * 初始化片段
   */
  public initialize(): void {
    if (!this.options.fragmentsEnabled) {
      return;
    }

    this.schema.types.forEach(type => {
      if (type.fields && type.fields.length > (this.options.maxFieldsPerType || 50)) {
        this.fragments.set(type.name, this.generateTypeFragment(type));
      }
    });
  }

  /**
   * 生成片段
   */
  public async generate(): Promise<void> {
    if (!this.options.fragmentsEnabled) {
      return;
    }

    this.initialize();
    
    const fragments = Array.from(this.fragments.entries());
    
    // 如果没有片段定义，则不生成文件
    if (fragments.length === 0) {
      console.log('No fragments defined, skipping fragments.ts generation');
      return;
    }
    
    const content = fragments
      .map(([name, fragment]) => fragment)
      .join('\\n\\n');
    
    await this.fileManager.writeFile('fragments.ts', content);
  }

  /**
   * 生成类型片段
   */
  private generateTypeFragment(type: TypeInfo): string {
    const fields = type.fields || [];
    const fragmentName = `${type.name}Fragment`;
    
    return `export const ${fragmentName} = \`
  fragment ${fragmentName} on ${type.name} {
    ${fields.map(f => f.name).join('\\n    ')}
  }
\`;`;
  }
}