'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AboutFooter } from '@/components/about/AboutFooter';
import { ArticleImage } from '@/components/news/ArticleImage';
import { getNewsArticleById, NEWS_ARTICLES } from '@/lib/news-data';
import { generateTableOfContents, slugifyHeading } from '@/lib/editorial-standard';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Building2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Newspaper,
  Camera,
  Search,
  ExternalLink,
  ShieldCheck,
  ListOrdered,
  BookOpen,
  CheckCircle2,
  Quote,
  Layers,
  Info,
  Check
} from 'lucide-react';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params?.id as string;

  const [isTocOpen, setIsTocOpen] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const article = useMemo(() => {
    return getNewsArticleById(articleId);
  }, [articleId]);

  // Sinh mục lục tự động từ các thẻ H2 và H3 trong nội dung
  const tocItems = useMemo(() => {
    if (!article?.content) return [];
    return generateTableOfContents(article.content);
  }, [article?.content]);

  // Các bài viết liên quan cùng chuyên mục
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return NEWS_ARTICLES.filter(
      (a) => a.id !== article.id && a.category === article.category
    ).slice(0, 3);
  }, [article]);

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/news#article-${article?.id || ''}`);
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.sapo || article?.summary,
          url: window.location.href,
        });
      } catch {
        // người dùng hủy chia sẻ
      }
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleScrollToSection = (id: string) => {
    if (typeof document === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `#${id}`);
      }
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 container max-w-4xl mx-auto px-4 pt-32 pb-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Newspaper className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Không tìm thấy bài viết</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Bài viết bạn đang tìm kiếm có thể đã được dời đi hoặc không tồn tại trên hệ thống.
          </p>
          <div className="pt-2">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại trang tin tức</span>
            </Link>
          </div>
        </main>
        <AboutFooter />
      </div>
    );
  }

  // 3 mốc thời gian minh bạch
  const sourceDate = article.sourcePublishedAt || article.date;
  const createdDate = article.createdAt || article.date;
  const updatedDate = article.updatedAt || article.date;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white antialiased">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb điều hướng */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link href="/news" className="hover:text-orange-600 transition-colors">
              Tin tức & Phân tích
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link
              href={`/news?category=${article.category}`}
              className="text-orange-600 font-semibold hover:underline"
            >
              {article.categoryLabel}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </nav>

          {/* Vùng nội dung bài viết dạng Editorial */}
          <article className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            
            {/* Header Featured Image tỷ lệ 16:9 */}
            <div className="space-y-2">
              <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0 overflow-hidden">
                <ArticleImage
                  src={article.image}
                  alt={article.imageCaption || article.title}
                  category={article.category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white font-bold text-xs px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {article.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Chú thích ảnh bìa và Nguồn ảnh */}
              {(article.imageCaption || article.imageCredit) && (
                <figcaption className="text-center text-xs text-slate-500 font-medium px-6 pt-1 pb-2 space-y-0.5">
                  {article.imageCaption && (
                    <span className="text-slate-700 italic block">{article.imageCaption}</span>
                  )}
                  {article.imageCredit && (
                    <span className="text-[11px] text-slate-400 font-normal block">
                      Nguồn ảnh: <strong className="text-slate-600 font-semibold">{article.imageCredit}</strong>
                    </span>
                  )}
                </figcaption>
              )}
            </div>

            {/* Thân bài viết */}
            <div className="p-6 sm:p-10 space-y-6 max-w-[800px] mx-auto">
              
              {/* Tiêu đề H1 lớn */}
              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* Thông tin Tác giả, Thời lượng đọc & Lượt xem */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="font-bold text-slate-900">{article.author}</span>
                    {article.authorRole && (
                      <span className="block text-[11px] text-slate-400">{article.authorRole}</span>
                    )}
                  </div>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    {article.views.toLocaleString()} lượt xem
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors cursor-pointer border border-slate-200/80 text-xs font-semibold"
                    title="Chia sẻ bài viết"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã sao chép liên kết</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Chia sẻ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3 MỐC THỜI GIAN MINH BẠCH BẮT BUỘC THEO TIÊU CHUẨN BIÊN TẬP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-medium">Xuất bản nguồn:</span>
                    <strong className="font-bold text-slate-800 text-xs">{sourceDate}</strong>
                    <span className="block text-[10px] text-slate-400">Công văn / Báo chí gốc</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100/70 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-medium">Đăng tải HaNoi Realty:</span>
                    <strong className="font-bold text-slate-800 text-xs">{createdDate}</strong>
                    <span className="block text-[10px] text-slate-400">Khởi tạo bản thảo</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-medium">Cập nhật gần nhất:</span>
                    <strong className="font-bold text-emerald-800 text-xs">{updatedDate}</strong>
                    <span className="block text-[10px] text-emerald-600 font-medium">✓ Dữ liệu mới nhất</span>
                  </div>
                </div>
              </div>

              {/* Đoạn mở đầu / Sapo (80–120 từ) nổi bật */}
              {(article.sapo || article.summary) && (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white border-l-4 border-orange-500 text-slate-800 text-[15px] sm:text-base font-normal leading-relaxed shadow-2xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800 uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                    <span>Tóm tắt bài phân tích (Sapo)</span>
                  </div>
                  <p className="text-slate-700 italic">
                    {article.sapo || article.summary}
                  </p>
                </div>
              )}

              {/* MỤC LỤC BÀI VIẾT TỰ ĐỘNG (TABLE OF CONTENTS) */}
              {tocItems.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="w-full flex items-center justify-between p-4 bg-slate-100/80 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                    aria-expanded={isTocOpen}
                  >
                    <div className="flex items-center gap-2">
                      <ListOrdered className="h-4 w-4 text-orange-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        Mục lục bài viết ({tocItems.filter(t => t.level === 2).length} phần chính)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <span>{isTocOpen ? 'Thu gọn' : 'Xem mục lục'}</span>
                      {isTocOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {isTocOpen && (
                    <nav className="p-4 pt-2 divide-y divide-slate-100 text-xs sm:text-sm">
                      <ul className="space-y-1.5 pt-2">
                        {tocItems.map((item, tIdx) => (
                          <li
                            key={tIdx}
                            className={item.level === 3 ? 'pl-6 list-disc list-inside text-slate-600' : 'font-semibold text-slate-800'}
                          >
                            <a
                              href={`#${item.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleScrollToSection(item.id);
                              }}
                              className="hover:text-orange-600 transition-colors inline-block py-0.5 leading-snug cursor-pointer"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>
              )}

              {/* Nội dung chi tiết các đoạn văn */}
              <div className="space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal pt-2">
                {article.content.map((paragraph, idx) => {
                  // 1. Tiêu đề H2
                  if (paragraph.startsWith('## ')) {
                    const headingText = paragraph.replace('## ', '').trim();
                    const headingId = slugifyHeading(headingText);
                    return (
                      <h2
                        key={idx}
                        id={headingId}
                        className="group text-xl sm:text-2xl font-black text-slate-900 pt-7 pb-2 border-b border-slate-100 scroll-mt-28 flex items-center justify-between"
                      >
                        <span>{headingText}</span>
                        <a
                          href={`#${headingId}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleScrollToSection(headingId);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-orange-600 transition-opacity p-1 text-sm font-mono"
                          title="Liên kết đến mục này"
                        >
                          #
                        </a>
                      </h2>
                    );
                  }

                  // 2. Tiêu đề H3
                  if (paragraph.startsWith('### ')) {
                    const headingText = paragraph.replace('### ', '').trim();
                    const headingId = slugifyHeading(headingText);
                    return (
                      <h3
                        key={idx}
                        id={headingId}
                        className="text-lg font-bold text-slate-900 pt-4 pb-1 scroll-mt-28 text-orange-950 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-4 bg-orange-500 rounded-full inline-block shrink-0"></span>
                        <span>{headingText}</span>
                      </h3>
                    );
                  }

                  // 3. Trích dẫn Blockquote
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="p-4 sm:p-5 rounded-2xl bg-orange-50/80 border-l-4 border-orange-500 text-slate-800 font-medium italic my-5 leading-relaxed">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }

                  // 4. Kẻ phân cách Markdown ---
                  if (paragraph.trim() === '---') {
                    return <hr key={idx} className="my-6 border-slate-200" />;
                  }

                  // 5. Cú pháp ảnh Markdown: ![alt](url)
                  const imgMatch = paragraph.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
                  if (imgMatch) {
                    const rawAlt = imgMatch[1];
                    const imgSrc = imgMatch[2];

                    // Kiểm tra xem đoạn kế tiếp có phải là dòng chú thích "Ảnh: ... Nguồn ảnh: ..." không
                    const nextPara = article.content[idx + 1]?.trim() || '';
                    let caption = rawAlt;
                    let credit = '';

                    if (nextPara.startsWith('Ảnh:') || nextPara.startsWith('Nguồn ảnh:')) {
                      const parts = nextPara.split('Nguồn ảnh:');
                      caption = parts[0].replace(/^Ảnh:\s*/, '').trim();
                      if (parts[1]) {
                        credit = parts[1].trim();
                      }
                    } else if (rawAlt.includes('| Nguồn ảnh:')) {
                      const parts = rawAlt.split('| Nguồn ảnh:');
                      caption = parts[0].trim();
                      credit = parts[1].trim();
                    }

                    return (
                      <figure key={idx} className="my-7 space-y-2.5">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-xs bg-slate-100">
                          <img
                            src={imgSrc}
                            alt={caption || rawAlt}
                            className="w-full h-auto max-h-[520px] object-cover transition-transform duration-500 hover:scale-[1.01]"
                            loading="lazy"
                          />
                        </div>
                        {(caption || credit) && (
                          <figcaption className="text-center text-xs text-slate-600 font-medium px-4 pt-1 space-y-0.5">
                            {caption && <span className="block text-slate-700 italic">{caption}</span>}
                            {credit && (
                              <span className="block text-[11px] text-slate-400 not-italic font-normal">
                                Nguồn ảnh: <strong className="text-slate-600 font-semibold">{credit}</strong>
                              </span>
                            )}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  // Nếu đoạn hiện tại là dòng chú thích ảnh đã được render ở trên thì bỏ qua
                  if (paragraph.trim().startsWith('Ảnh:') || paragraph.trim().startsWith('Nguồn ảnh:')) {
                    const prevPara = article.content[idx - 1]?.trim() || '';
                    if (prevPara.match(/^!\[(.*?)\]\((.*?)\)$/)) {
                      return null;
                    }
                  }

                  // 6. Cú pháp bảng Markdown
                  if (paragraph.includes('|') && paragraph.includes('\n')) {
                    const lines = paragraph.trim().split('\n').map(l => l.trim()).filter(l => l.startsWith('|'));
                    if (lines.length >= 2) {
                      const headerCells = lines[0].split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
                      const dataRows = lines.slice(2).map(line =>
                        line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
                      );

                      return (
                        <div key={idx} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
                          <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-slate-100/90 text-slate-900 font-bold border-b border-slate-200">
                              <tr>
                                {headerCells.map((th, hIdx) => (
                                  <th key={hIdx} className="px-4 py-3 whitespace-nowrap">{th}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {dataRows.map((tr, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                                  {tr.map((td, dIdx) => (
                                    <td key={dIdx} className="px-4 py-3 text-slate-700 whitespace-nowrap font-medium">{td}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                  }

                  // 7. Bỏ qua dòng nguồn tham khảo cũ dạng text thô nếu bài đã có danh sách sources chuẩn hóa
                  if (paragraph.startsWith('Nguồn tham khảo:')) {
                    if (article.sources && article.sources.length > 0) {
                      return null;
                    }
                    return (
                      <div key={idx} className="pt-4 pb-2 border-t border-slate-200 text-xs sm:text-sm font-semibold text-slate-500 italic">
                        {paragraph}
                      </div>
                    );
                  }

                  // 8. Đoạn văn thông thường
                  return (
                    <p key={idx} className="leading-relaxed whitespace-pre-line text-slate-700">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* KHỐI MINH BẠCH & PHÂN BIỆT THÔNG TIN BIÊN TẬP */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 mt-8">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Chuẩn mực biên tập & Minh bạch thông tin HaNoi Realty</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] leading-relaxed">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <strong className="block text-slate-900 font-bold mb-1">🏛️ Căn cứ pháp lý:</strong>
                    Văn bản quy phạm pháp luật, nghị định của Chính phủ và quyết định phê duyệt chính thức của UBND TP. Hà Nội.
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <strong className="block text-slate-900 font-bold mb-1">📰 Dữ liệu báo chí:</strong>
                    Đối chiếu độc lập từ các cơ quan thông tấn báo chí chính thống (VnExpress, Báo Chính phủ, Tuổi Trẻ, Báo Đầu Tư).
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <strong className="block text-slate-900 font-bold mb-1">🔍 Góc nhìn biên tập:</strong>
                    Phân tích độc lập từ hệ thống dữ liệu thị trường và khảo sát thực địa của Ban Biên tập HaNoi Realty.
                  </div>
                </div>
              </div>

              {/* NGUỒN THAM KHẢO & CĂN CỨ DỮ LIỆU CÓ THỂ CLICK MỞ TAB MỚI */}
              {article.sources && article.sources.length > 0 && (
                <section className="mt-10 pt-6 border-t-2 border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                        Nguồn tham khảo & Căn cứ dữ liệu ({article.sources.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 w-fit">
                      ✓ Báo chí chính thống & Cơ quan quản lý
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Mọi số liệu thống kê, văn bản chính sách và thông tin quy hoạch trong bài viết được đối chiếu trực tiếp từ các nguồn chính thống dưới đây:
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {article.sources.map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50/80 hover:bg-orange-50/60 border border-slate-200/90 hover:border-orange-300 transition-all gap-2 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200/80 text-[11px] shadow-2xs">
                              {src.outlet}
                            </span>
                            <span className="text-slate-400 text-[11px]">• Xuất bản: {src.publishedAt}</span>
                          </div>
                          <p className="font-semibold text-slate-800 group-hover:text-orange-700 transition-colors line-clamp-2">
                            {src.title}
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white group-hover:bg-orange-500 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-orange-500 text-[11px] font-bold transition-all shadow-2xs shrink-0 self-start sm:self-center">
                          <span>Xem bài gốc</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Thẻ Tags bài viết */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Từ khóa:</span>
                  {article.tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/news?search=${encodeURIComponent(tag)}`}
                      className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-3 py-1 rounded-lg transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Nút quay lại và điều hướng ở cuối bài */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleGoBack}
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Quay lại trang tin tức</span>
                </button>

                <Link
                  href="/search"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Search className="h-4 w-4 text-orange-400" />
                  <span>Tra cứu bất động sản trên bản đồ</span>
                </Link>
              </div>

            </div>
          </article>

          {/* Khối bài viết liên quan cùng chuyên mục */}
          {relatedArticles.length > 0 && (
            <section className="mt-12 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span>Bài viết cùng chuyên mục</span>
                </h3>
                <Link
                  href={`/news?category=${article.category}`}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>Xem thêm</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-3 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                        <ArticleImage
                          src={item.image}
                          alt={item.title}
                          category={item.category}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
                        {item.categoryLabel}
                      </span>
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 mt-2">
                      <span>{item.createdAt || item.date} • {item.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <AboutFooter />
    </div>
  );
}