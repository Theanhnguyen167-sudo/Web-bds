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

export interface ArticleSource {
  title: string;           // Tên bài báo nguồn
  outlet: string;          // Tên cơ quan báo chí chính thống (VnExpress, Báo Chính phủ, Tuổi Trẻ, Báo Đầu tư...)
  publishedAt: string;     // Ngày xuất bản nguồn gốc (DD/MM/YYYY hoặc ISO)
  url: string;             // Đường dẫn trực tiếp có thể click mở bài báo gốc
}

export interface ArticleTableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  sapo?: string;
  content: string;
  featuredImage: string;
  featuredImageCaption?: string;
  featuredImageCredit?: string;
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
  wordCount?: number;
  blocks?: ArticleBlock[];
  tags?: string[];
  sources?: ArticleSource[];
  sourcePublishedAt?: string; // Ngày bài báo nguồn gốc xuất bản
  createdAt: string;          // Thời điểm bài được tạo trên HaNoi Realty
  updatedAt: string;          // Thời điểm nội dung được sửa đổi thực sự
  publishedAt?: string;
}

export interface ArticleCategoryItem {
  id: string;
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}
