import { GraphQLClient } from 'graphql-request';
import type { ClientOptions } from './client';
import type { ArticlePage, PageInput, Article, Category, RssFeed } from './types.index';
import { withRetryAndTimeout } from './utils';

export class QueryClient {
  constructor(
    private readonly client: GraphQLClient,
    private readonly options: ClientOptions
  ) {}

  public async articles(page?: PageInput): Promise<ArticlePage> {
    const query = `
      query articles($page: PageInput) {
        articles(page: $page) {
          content {
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
          pageInfo {
            pageNumber
            pageSize
            totalElements
            totalPages
            isFirst
            isLast
            hasNext
            hasPrevious
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ articles: ArticlePage }>(query, { page });
        return response.articles;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async article(id: string): Promise<Article> {
    const query = `
      query article($id: ID) {
        article(id: $id) {
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
        const response = await this.client.request<{ article: Article }>(query, { id });
        return response.article;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async articlesByFeed(feedId: string, page?: PageInput): Promise<ArticlePage> {
    const query = `
      query articlesByFeed($feedId: ID, $page: PageInput) {
        articlesByFeed(feedId: $feedId, page: $page) {
          content {
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
          pageInfo {
            pageNumber
            pageSize
            totalElements
            totalPages
            isFirst
            isLast
            hasNext
            hasPrevious
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ articlesByFeed: ArticlePage }>(query, { feedId, page });
        return response.articlesByFeed;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async articlesByCategory(categoryId: string, page?: PageInput): Promise<ArticlePage> {
    const query = `
      query articlesByCategory($categoryId: ID, $page: PageInput) {
        articlesByCategory(categoryId: $categoryId, page: $page) {
          content {
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
          pageInfo {
            pageNumber
            pageSize
            totalElements
            totalPages
            isFirst
            isLast
            hasNext
            hasPrevious
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ articlesByCategory: ArticlePage }>(query, { categoryId, page });
        return response.articlesByCategory;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async searchArticles(keyword: string, page?: PageInput): Promise<ArticlePage> {
    const query = `
      query searchArticles($keyword: String, $page: PageInput) {
        searchArticles(keyword: $keyword, page: $page) {
          content {
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
          pageInfo {
            pageNumber
            pageSize
            totalElements
            totalPages
            isFirst
            isLast
            hasNext
            hasPrevious
          }
        }
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ searchArticles: ArticlePage }>(query, { keyword, page });
        return response.searchArticles;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async categories(): Promise<Category[]> {
    const query = `
      query categories {
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
      }
    `;
    
    return withRetryAndTimeout(
      async () => {
        const response = await this.client.request<{ categories: Category[] }>(query);
        return response.categories;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async category(id: string): Promise<Category> {
    const query = `
      query category($id: ID) {
        category(id: $id) {
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
        const response = await this.client.request<{ category: Category }>(query, { id });
        return response.category;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async rssFeeds(): Promise<RssFeed[]> {
    const query = `
      query rssFeeds {
        rssFeeds {
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
        const response = await this.client.request<{ rssFeeds: RssFeed[] }>(query);
        return response.rssFeeds;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }

  public async rssFeed(id: string): Promise<RssFeed> {
    const query = `
      query rssFeed($id: ID) {
        rssFeed(id: $id) {
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
        const response = await this.client.request<{ rssFeed: RssFeed }>(query, { id });
        return response.rssFeed;
      },
      {
        maxRetries: this.options.maxRetries,
        retryDelay: this.options.retryDelay,
        timeout: this.options.timeout
      }
    );
  }
}