export type ArticleStatus = 'draft' | 'pending' | 'published' | 'hidden';

export type ArticleCategory =
  | 'market'
  | 'planning'
  | 'analysis'
  | 'knowledge'
  | 'hanoi'
  | 'legal'
  | 'investment'
  | string;

export type ArticleBlockType =
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'quote'
  | 'table'
  | 'list'
  | 'cta'
  | 'featured_property'
  | 'map'
  | 'planning_info'
  | 'related_articles';

export interface ArticleBlock {
  id: string;
  type: ArticleBlockType;
  title?: string;
  data: Record<string, any>;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: ArticleCategory;
  categoryLabel?: string;
  categoryColor?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  status: ArticleStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  views: number;
  readTime?: string;
  blocks?: ArticleBlock[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ArticleCategoryItem {
  id: string;
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}
