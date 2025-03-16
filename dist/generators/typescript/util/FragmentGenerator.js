"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FragmentGenerator = void 0;
const BaseTypeScriptGenerator_1 = require("../BaseTypeScriptGenerator");
/**
 * 片段生成器
 * 负责生成片段
 */
class FragmentGenerator extends BaseTypeScriptGenerator_1.BaseTypeScriptGenerator {
    constructor() {
        super(...arguments);
        this.fragments = new Map();
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'FragmentGenerator';
    }
    /**
     * 初始化片段
     */
    initialize() {
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
    async generate() {
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
    generateTypeFragment(type) {
        const fields = type.fields || [];
        const fragmentName = `${type.name}Fragment`;
        return `export const ${fragmentName} = \`
  fragment ${fragmentName} on ${type.name} {
    ${fields.map(f => f.name).join('\\n    ')}
  }
\`;`;
    }
}
exports.FragmentGenerator = FragmentGenerator;
