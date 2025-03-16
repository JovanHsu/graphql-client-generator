import { GraphQLClient } from 'graphql-request';
import { QueryClient } from './queries';
import { MutationClient } from './mutations';

/**
 * GraphQL客户端选项
 */
export interface ClientOptions {
  /**
   * 请求超时时间（毫秒）
   */
  timeout?: number;
  
  /**
   * 最大重试次数
   */
  maxRetries?: number;
  
  /**
   * 重试延迟（毫秒）
   */
  retryDelay?: number;
  
  /**
   * 自定义请求头
   */
  headers?: Record<string, string>;
}

/**
 * GraphQL客户端
 */
export class GraphQLApiClient {
  private readonly client: GraphQLClient;
  private readonly options: ClientOptions;
  public readonly query: QueryClient;
  public readonly mutation: MutationClient;

  /**
   * 创建GraphQL客户端
   * @param endpoint GraphQL端点URL
   * @param options 客户端选项
   */
  constructor(endpoint: string, options: ClientOptions = {}) {
    this.options = {
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 300,
      ...options
    };
    
    this.client = new GraphQLClient(endpoint, {
      headers: this.options.headers || {}
    });
    
    this.query = new QueryClient(this.client, this.options);
    this.mutation = new MutationClient(this.client, this.options);
  }
}