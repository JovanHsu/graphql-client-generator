"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGenerator = void 0;
const BaseTypeScriptGenerator_1 = require("../BaseTypeScriptGenerator");
/**
 * 客户端类生成器
 * 负责生成客户端类
 */
class ClientGenerator extends BaseTypeScriptGenerator_1.BaseTypeScriptGenerator {
    /**
     * 获取生成器名称
     */
    getName() {
        return 'ClientGenerator';
    }
    /**
     * 生成客户端类
     */
    async generate() {
        const content = `
import { GraphQLClient } from 'graphql-request';
import { QueryClient } from './queries';
import { MutationClient } from './mutations';
import { SubscriptionClient } from './subscriptions';
import { withRetry, withTimeout, RetryOptions } from './utils';

export interface ClientOptions {
  retry?: RetryOptions;
  timeout?: number;
  headers?: HeadersInit;
}

export class GraphQLApiClient {
  private queryClient: QueryClient;
  private mutationClient: MutationClient;
  private subscriptionClient: SubscriptionClient;
  private options: ClientOptions;

  constructor(
    endpoint: string,
    options: ClientOptions = {}
  ) {
    this.options = {
      retry: {
        attempts: ${this.options.errorHandling?.retryAttempts || 3},
        delay: 1000,
      },
      timeout: ${this.options.errorHandling?.timeout || 30000},
      ...options,
    };

    const client = new GraphQLClient(endpoint, {
      headers: this.options.headers,
    });

    this.queryClient = new QueryClient(client, this.options);
    this.mutationClient = new MutationClient(client, this.options);
    this.subscriptionClient = new SubscriptionClient(endpoint, this.options);
  }

  public get query() {
    return this.queryClient;
  }

  public get mutation() {
    return this.mutationClient;
  }

  public get subscription() {
    return this.subscriptionClient;
  }

  public dispose(): void {
    this.subscriptionClient.dispose();
  }
}`;
        await this.fileManager.writeFile('client.ts', content);
    }
}
exports.ClientGenerator = ClientGenerator;
