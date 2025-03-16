import type { DateTime, String, ID } from './types.index';

export interface Query {
  articles: ArticlePage;
  article?: Article;
  articlesByFeed: ArticlePage;
  articlesByCategory: ArticlePage;
  searchArticles: ArticlePage;
  categories: Category[];
  category?: Category;
  rssFeeds: RssFeed[];
  rssFeed?: RssFeed;
}

export interface Mutation {
  updateArticle: Article;
  deleteArticle: boolean;
  generateArticleSummary: Article;
  createCategory: Category;
  updateCategory: Category;
  deleteCategory: boolean;
  createRssFeed: RssFeed;
  updateRssFeed: RssFeed;
  deleteRssFeed: boolean;
  fetchRssFeed: RssFeed;
  fetchAllRssFeeds: RssFeed[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  aiSummary?: string;
  author?: string;
  url?: string;
  imageUrl?: string;
  publishDate?: DateTime;
  status: string;
  statusDisplay: string;
  categories: Category[];
  tags?: string[];
  feedId?: string;
  feedName?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  formattedPublishDate: string;
  formattedCreatedAt: string;
}

export interface ArticlePage {
  content: Article[];
  pageInfo: PageInfo;
}

export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  displayOrder?: number;
  createdAt: DateTime;
  updatedAt: DateTime;
  articleCount: number;
  formattedCreatedAt: string;
}

export interface RssFeed {
  id: string;
  url: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  imageUrl?: string;
  categories: Category[];
  lastFetchTime?: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
  status: string;
  errorMessage?: string;
  articleCount: number;
  minutesToNextFetch?: number;
  nextFetchTimeDisplay: string;
  settings: FeedSettings;
}

export interface FeedSettings {
  enableAiSummary: boolean;
  fetchIntervalMinutes: number;
  fetchIntervalDisplay: string;
  autoPublish: boolean;
}

export interface PageInput {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ArticleUpdateInput {
  title?: string;
  content?: string;
  author?: string;
  url?: string;
  imageUrl?: string;
  publishDate?: DateTime;
  status?: string;
  categoryIds?: string[];
  tags?: string[];
}

export interface CategoryInput {
  name: string;
  description?: string;
  color?: string;
  displayOrder?: number;
}

export interface RssFeedInput {
  url: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  imageUrl?: string;
  categoryIds?: string[];
  settings?: FeedSettingsInput;
}

export interface FeedSettingsInput {
  enableAiSummary: boolean;
  fetchIntervalMinutes: number;
  autoPublish: boolean;
}