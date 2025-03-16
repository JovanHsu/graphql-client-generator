export declare function mcp_filesystem_read_file(params: { path: string }): Promise<string>;
export declare function mcp_filesystem_write_file(params: { path: string; content: string }): Promise<void>;
export declare function mcp_filesystem_create_directory(params: { path: string }): Promise<void>;
export declare function mcp_filesystem_list_directory(params: { path: string }): Promise<{ entries: { name: string }[] }>;
export declare function mcp_filesystem_search_files(params: { path: string; pattern: string }): Promise<string[]>;