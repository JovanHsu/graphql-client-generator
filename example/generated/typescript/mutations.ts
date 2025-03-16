import { GraphQLClient } from 'graphql-request';
import type { ClientOptions } from './client';
import type { Article, ArticleUpdateInput, Category, CategoryInput, RssFeed, RssFeedInput } from './types.index';
import { withRetryAndTimeout } from './utils';

export class MutationClient {
  constructor(
    private readonly client: GraphQLClient,
    private readonly options: ClientOptions
  ) {}

  public async updateArticle(id: string, input: ArticleUpdateInput): Promise<Article> {
    const query = `
      mutation updateArticle($id: ID, $input: ArticleUpdateInput) {
        updateArticle(id: $id, input: $input) {
          id
          title
          content
          summary
          aiSummary
          author
          url
          imageUrl
          publishDate
          status
          statusDisplay
          categories {
            id
            name
            description
            color
            displayOrder
            createdAt
            updatedAt
            articleCount
            formattedCreatedAt
          }
          tags
          feedId
          feedName
          createdAt
          updatedAt
          formattedPublishDate
          formattedCreatedAt
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ updateArticle: Article }>(query, { id, input });
        return response.updateArticle;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async deleteArticle(id: string): Promise<boolean> {
    const query = `
      mutation deleteArticle($id: ID) {
        deleteArticle(id: $id) {

        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ deleteArticle: boolean }>(query, { id });
        return response.deleteArticle;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async generateArticleSummary(id: string): Promise<Article> {
    const query = `
      mutation generateArticleSummary($id: ID) {
        generateArticleSummary(id: $id) {
          id
          title
          content
          summary
          aiSummary
          author
          url
          imageUrl
          publishDate
          status
          statusDisplay
          categories {
            id
            name
            description
            color
            displayOrder
            createdAt
            updatedAt
            articleCount
            formattedCreatedAt
          }
          tags
          feedId
          feedName
          createdAt
          updatedAt
          formattedPublishDate
          formattedCreatedAt
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ generateArticleSummary: Article }>(query, { id });
        return response.generateArticleSummary;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async createCategory(input: CategoryInput): Promise<Category> {
    const query = `
      mutation createCategory($input: CategoryInput) {
        createCategory(input: $input) {
          id
          name
          description
          color
          displayOrder
          createdAt
          updatedAt
          articleCount
          formattedCreatedAt
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ createCategory: Category }>(query, { input });
        return response.createCategory;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async updateCategory(id: string, input: CategoryInput): Promise<Category> {
    const query = `
      mutation updateCategory($id: ID, $input: CategoryInput) {
        updateCategory(id: $id, input: $input) {
          id
          name
          description
          color
          displayOrder
          createdAt
          updatedAt
          articleCount
          formattedCreatedAt
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ updateCategory: Category }>(query, { id, input });
        return response.updateCategory;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const query = `
      mutation deleteCategory($id: ID) {
        deleteCategory(id: $id) {

        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ deleteCategory: boolean }>(query, { id });
        return response.deleteCategory;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async createRssFeed(input: RssFeedInput): Promise<RssFeed> {
    const query = `
      mutation createRssFeed($input: RssFeedInput) {
        createRssFeed(input: $input) {
          id
          url
          name
          description
          websiteUrl
          imageUrl
          categories {
            id
            name
            description
            color
            displayOrder
            createdAt
            updatedAt
            articleCount
            formattedCreatedAt
          }
          lastFetchTime
          createdAt
          updatedAt
          status
          errorMessage
          articleCount
          minutesToNextFetch
          nextFetchTimeDisplay
          settings {
            enableAiSummary
            fetchIntervalMinutes
            fetchIntervalDisplay
            autoPublish
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ createRssFeed: RssFeed }>(query, { input });
        return response.createRssFeed;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async updateRssFeed(id: string, input: RssFeedInput): Promise<RssFeed> {
    const query = `
      mutation updateRssFeed($id: ID, $input: RssFeedInput) {
        updateRssFeed(id: $id, input: $input) {
          id
          url
          name
          description
          websiteUrl
          imageUrl
          categories {
            id
            name
            description
            color
            displayOrder
            createdAt
            updatedAt
            articleCount
            formattedCreatedAt
          }
          lastFetchTime
          createdAt
          updatedAt
          status
          errorMessage
          articleCount
          minutesToNextFetch
          nextFetchTimeDisplay
          settings {
            enableAiSummary
            fetchIntervalMinutes
            fetchIntervalDisplay
            autoPublish
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ updateRssFeed: RssFeed }>(query, { id, input });
        return response.updateRssFeed;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async deleteRssFeed(id: string): Promise<boolean> {
    const query = `
      mutation deleteRssFeed($id: ID) {
        deleteRssFeed(id: $id) {

        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ deleteRssFeed: boolean }>(query, { id });
        return response.deleteRssFeed;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async fetchRssFeed(id: string): Promise<RssFeed> {
    const query = `
      mutation fetchRssFeed($id: ID) {
        fetchRssFeed(id: $id) {
          id
          url
          name
          description
          websiteUrl
          imageUrl
          categories {
            id
            name
            description
            color
            displayOrder
            createdAt
            updatedAt
            articleCount
            formattedCreatedAt
          }
          lastFetchTime
          createdAt
          updatedAt
          status
          errorMessage
          articleCount
          minutesToNextFetch
          nextFetchTimeDisplay
          settings {
            enableAiSummary
            fetchIntervalMinutes
            fetchIntervalDisplay
            autoPublish
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ fetchRssFeed: RssFeed }>(query, { id });
        return response.fetchRssFeed;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async fetchAllRssFeeds(): Promise<RssFeed[]> {
    const query = `
      mutation fetchAllRssFeeds {
        fetchAllRssFeeds {
          id
          url
          name
          description
          websiteUrl
          imageUrl
          categories {
            id
            name
            description
            color
            displayOrder
            createdAt
            updatedAt
            articleCount
            formattedCreatedAt
          }
          lastFetchTime
          createdAt
          updatedAt
          status
          errorMessage
          articleCount
          minutesToNextFetch
          nextFetchTimeDisplay
          settings {
            enableAiSummary
            fetchIntervalMinutes
            fetchIntervalDisplay
            autoPublish
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ fetchAllRssFeeds: RssFeed[] }>(query);
        return response.fetchAllRssFeeds;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }
}