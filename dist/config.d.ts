export interface GeneratorConfig {
    schemaPath: string;
    documents?: string[];
    outputDir: string;
    language: 'typescript' | 'javascript';
    framework?: 'react' | 'vue' | 'none';
    prettier?: {
        semi?: boolean;
        singleQuote?: boolean;
        tabWidth?: number;
        trailingComma?: 'none' | 'es5' | 'all';
    };
    naming?: {
        typePrefix?: string;
        typeSuffix?: string;
        enumPrefix?: string;
        enumSuffix?: string;
    };
    plugins?: {
        [key: string]: any;
    };
}
export declare const defaultConfig: Partial<GeneratorConfig>;
