/**
 * lib/editorial-standard.ts
 * HANOI REALTY EDITORIAL CONTENT STANDARD ENGINE
 * ==============================================================================
 * Tiêu chuẩn biên tập nội dung báo chí bất động sản chuyên nghiệp cho HaNoi Realty.
 * Phục vụ kiểm soát chất lượng, đếm từ tiếng Việt, xác thực nguồn tin và sinh mục lục.
 * ==============================================================================
 */

import { ArticleSource, ArticleTableOfContentsItem } from '@/types/article';

export interface EditorialValidationResult {
  isValid: boolean;
  wordCount: number;
  headingsCount: { h2: number; h3: number };
  sourcesCount: number;
  imagesCount: number;
  errors: string[];
  warnings: string[];
  stats: {
    hasH1: boolean;
    hasSapo: boolean;
    sapoWordCount: number;
    hasThreeDates: boolean;
    hasClickableSources: boolean;
    hasCaptionsAndCredits: boolean;
  };
}

/**
 * Đếm số từ tiếng Việt trong nội dung chính:
 * - KHÔNG tính tiêu đề (H1, H2, H3)
 * - KHÔNG tính chú thích ảnh (Image captions, Alt text)
 * - KHÔNG tính thông tin tác giả và danh sách nguồn tham khảo
 * - KHÔNG tính các ký tự định dạng Markdown (---, **, ##, [], ())
 */
export function countVietnameseWords(content: string | string[]): number {
  const paragraphs = Array.isArray(content) ? content : [content];
  let cleanText = '';

  for (const p of paragraphs) {
    if (!p || typeof p !== 'string') continue;
    const trimmed = p.trim();

    // Bỏ qua tiêu đề
    if (trimmed.startsWith('#') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) continue;

    // Bỏ qua ảnh Markdown ![alt](url) và thẻ ảnh
    if (trimmed.startsWith('![') || trimmed.startsWith('<img') || trimmed.startsWith('[CHÈN ẢNH:')) continue;

    // Bỏ qua dòng phân cách ---
    if (trimmed === '---') continue;

    // Bỏ qua dòng nguồn tham khảo
    if (trimmed.toLowerCase().startsWith('nguồn tham khảo:') || trimmed.toLowerCase().startsWith('nguồn:')) continue;

    // Bỏ qua các hàng của bảng markdown nếu chỉ chứa ký tự phân cách |---|
    if (/^\|[-:| ]+\|$/.test(trimmed)) continue;

    // Bỏ qua dòng chú thích
    if (trimmed.toLowerCase().startsWith('ảnh:') || trimmed.toLowerCase().startsWith('nguồn ảnh:')) continue;

    cleanText += ' ' + trimmed;
  }

  // Làm sạch các thẻ HTML và ký tự markdown còn sót lại
  const sanitized = cleanText
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Giữ lại text trong link
    .replace(/[*_~`]/g, ' ')
    .replace(/[|]/g, ' ')
    .trim();

  if (!sanitized) return 0;

  // Tách từ theo khoảng trắng (tiếng Việt mỗi âm tiết được tính là 1 từ)
  const words = sanitized.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Đếm số từ của đoạn Sapo (chuẩn 80 - 120 từ)
 */
export function countSapoWords(sapo?: string): number {
  if (!sapo || typeof sapo !== 'string') return 0;
  return sapo.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Chuyển tiêu đề H2/H3 thành slug ID an toàn dùng làm anchor link
 */
export function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Tự động tạo danh sách Mục Lục (Table of Contents) từ các đề mục H2 và H3
 */
export function generateTableOfContents(content: string | string[]): ArticleTableOfContentsItem[] {
  const paragraphs = Array.isArray(content) ? content : content.split('\n');
  const toc: ArticleTableOfContentsItem[] = [];

  for (let idx = 0; idx < paragraphs.length; idx++) {
    const p = paragraphs[idx].trim();
    if (p.startsWith('## ')) {
      const rawTitle = p.replace(/^##\s+/, '').trim();
      const slugId = slugifyHeading(rawTitle);

      toc.push({
        id: slugId || `section-${idx}`,
        title: rawTitle,
        level: 2,
      });
    } else if (p.startsWith('### ')) {
      const rawTitle = p.replace(/^###\s+/, '').trim();
      const slugId = slugifyHeading(rawTitle);

      toc.push({
        id: slugId || `subsection-${idx}`,
        title: rawTitle,
        level: 3,
      });
    }
  }

  return toc;
}

/**
 * Kiểm định toàn diện bài viết theo QUY CHUẨN BIÊN TẬP HANOI REALTY (7 TIÊU CHUẨN)
 */
export function validateArticleEditorialStandard(article: {
  title: string;
  sapo?: string;
  summary?: string;
  content: string | string[];
  sources?: ArticleSource[];
  sourcePublishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  featuredImage?: string;
}): EditorialValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Kiểm tra Tiêu đề H1
  const hasH1 = Boolean(article.title && article.title.trim().length >= 20);
  if (!hasH1) {
    errors.push('Tiêu đề H1 quá ngắn hoặc chưa rõ ràng (yêu cầu tối thiểu 20 ký tự).');
  }

  // 2. Kiểm tra Sapo (80 - 120 từ)
  const sapoText = article.sapo || article.summary || '';
  const sapoWordCount = countSapoWords(sapoText);
  const hasSapo = sapoWordCount >= 60;
  if (sapoWordCount < 60) {
    errors.push(`Đoạn Sapo quá ngắn (${sapoWordCount} từ, quy chuẩn yêu cầu 80 - 120 từ).`);
  } else if (sapoWordCount > 150) {
    warnings.push(`Đoạn Sapo hơi dài (${sapoWordCount} từ, khuyến nghị nên cô đọng trong 80 - 120 từ).`);
  }

  // 3. Kiểm tra Số từ nội dung chính (Tối thiểu 1.200 từ tiếng Việt)
  const wordCount = countVietnameseWords(article.content);
  if (wordCount < 1200) {
    errors.push(`Nội dung chính chưa đạt độ dài tối thiểu (${wordCount}/1.200 từ tiếng Việt).`);
  }

  // 4. Kiểm tra Đề mục H2 (Ít nhất 5 - 7 đề mục H2)
  const paragraphs = Array.isArray(article.content) ? article.content : article.content.split('\n');
  let h2Count = 0;
  let h3Count = 0;
  let inArticleImagesCount = 0;

  for (const p of paragraphs) {
    const t = p.trim();
    if (t.startsWith('## ')) h2Count++;
    if (t.startsWith('### ')) h3Count++;
    if (t.startsWith('![') || t.startsWith('<img') || t.startsWith('[CHÈN ẢNH:')) inArticleImagesCount++;
  }

  if (h2Count < 4) {
    errors.push(`Bài viết có quá ít đề mục H2 (${h2Count} đề mục, quy chuẩn yêu cầu tối thiểu 5 - 7 đề mục H2).`);
  } else if (h2Count < 5) {
    warnings.push(`Nên bổ sung thêm đề mục H2 để đạt mức chuẩn 5 - 7 đề mục.`);
  }

  // 5. Kiểm tra 3 mốc thời gian minh bạch
  const hasThreeDates = Boolean(
    article.sourcePublishedAt &&
    article.createdAt &&
    article.updatedAt
  );
  if (!hasThreeDates) {
    errors.push('Thiếu một trong 3 mốc thời gian bắt buộc: Ngày nguồn gốc xuất bản, Ngày tạo bài trên HaNoi Realty, Ngày cập nhật gần nhất.');
  }

  // 6. Kiểm tra Nguồn tham khảo có thể nhấn (Tối thiểu 3 nguồn chính thống)
  const sources = article.sources || [];
  const validSources = sources.filter((s) => s.title && s.outlet && s.url && s.url.startsWith('http'));
  const hasClickableSources = validSources.length >= 3;

  if (validSources.length < 3) {
    errors.push(`Số lượng nguồn tham khảo chính thống chưa đủ (${validSources.length}/3 nguồn yêu cầu).`);
  }

  // 7. Kiểm tra Hình ảnh minh họa (Ảnh bìa + Tối thiểu 2 - 4 ảnh trong thân bài)
  if (!article.featuredImage) {
    errors.push('Thiếu ảnh đại diện (Featured Image) của bài viết.');
  }
  if (inArticleImagesCount < 2) {
    warnings.push(`Thân bài nên có từ 2 - 4 hình ảnh minh họa có chú thích và ghi rõ nguồn ảnh (hiện có: ${inArticleImagesCount} ảnh).`);
  }

  return {
    isValid: errors.length === 0,
    wordCount,
    headingsCount: { h2: h2Count, h3: h3Count },
    sourcesCount: validSources.length,
    imagesCount: inArticleImagesCount + (article.featuredImage ? 1 : 0),
    errors,
    warnings,
    stats: {
      hasH1,
      hasSapo,
      sapoWordCount,
      hasThreeDates,
      hasClickableSources,
      hasCaptionsAndCredits: inArticleImagesCount >= 2,
    },
  };
}
