"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FragmentGenerator = void 0;
const BaseTypeScriptGenerator_1 = require("../BaseTypeScriptGenerator");
const FieldSelectionGenerator_1 = require("../util/FieldSelectionGenerator");
/**
 * 片段生成器
 * 负责生成GraphQL片段的TypeScript代码
 */
class FragmentGenerator extends BaseTypeScriptGenerator_1.BaseTypeScriptGenerator {
    constructor(config, schemaParser, fileManager, options) {
        super(config, schemaParser, fileManager, options);
        this.fieldSelectionGenerator = new FieldSelectionGenerator_1.FieldSelectionGenerator(this.schema, this.typeUtils);
        // 加载片段模板
        try {
            this.templateManager.loadTemplate('fragment');
        }
        catch (error) {
            console.error(`Error loading fragment template: ${error.message}`);
        }
        // 加载片段集合模板
        try {
            this.templateManager.loadTemplate('fragments');
        }
        catch (error) {
            console.error(`Error loading fragments template: ${error.message}`);
        }
    }
    /**
     * 获取生成器名称
     */
    getName() {
        return 'FragmentGenerator';
    }
    /**
     * 获取片段列表
     */
    getFragments() {
        return this.schema.fragments || [];
    }
    /**
     * 生成片段内容
     */
    generateFragmentContent(fragments) {
        if (fragments.length === 0) {
            return `export const fragments = {};`;
        }
        const fragmentDefinitions = [];
        const fragmentNames = [];
        const types = new Set();
        for (const fragment of fragments) {
            if (this.typeUtils.isCustomType(fragment.onType)) {
                types.add(this.typeUtils.getTypeName(fragment.onType.replace(/[\[\]!]/g, '')));
            }
            const fieldSelection = this.fieldSelectionGenerator.generateFieldSelection(fragment.onType, 4);
            // 使用模板渲染片段
            const fragmentContent = this.templateManager.render('fragment', {
                name: fragment.name,
                onType: fragment.onType,
                fieldSelection
            });
            fragmentDefinitions.push(fragmentContent);
            fragmentNames.push(fragment.name);
        }
        // 使用模板渲染片段集合
        return this.templateManager.render('fragments', {
            hasTypes: types.size > 0,
            types: Array.from(types),
            fragments: fragmentDefinitions,
            fragmentNames: fragmentNames
        });
    }
    /**
     * 生成片段
     */
    async generate() {
        const fragments = this.getFragments();
        // 如果没有片段，则生成空的片段文件
        const content = this.generateFragmentContent(fragments);
        await this.fileManager.writeFile('fragments.ts', content);
        if (fragments.length === 0) {
            console.log('No fragments defined, generating empty fragments.ts');
        }
        else {
            console.log(`Generated ${fragments.length} fragments in fragments.ts`);
        }
    }
}
exports.FragmentGenerator = FragmentGenerator;
