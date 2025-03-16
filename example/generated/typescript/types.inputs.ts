import type { DateTime, ID, String } from './types.index';

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