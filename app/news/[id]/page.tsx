'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AboutFooter } from '@/components/about/AboutFooter';
import { ArticleImage } from '@/components/news/ArticleImage';
import { getNewsArticleById, NEWS_ARTICLES } from '@/lib/news-data';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Building2,
  ChevronRight,
  Sparkles,
  Compass,
  FileText,
  Newspaper
} from 'lucide-react';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params?.id as string;

  const article = useMemo(() => {
    return getNewsArticleById(articleId);
  }, [articleId]);

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
          text: article?.summary,
          url: window.location.href,
        });
      } catch {
        // người dùng hủy chia sẻ
      }
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white antialiased">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Vùng nội dung bài viết dạng Editorial */}
          <article className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            
            {/* Header Image tỷ lệ 16:9 chuẩn */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0 overflow-hidden">
              <ArticleImage
                src={article.image}
                alt={article.title}
                category={article.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white font-bold text-xs px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                  {article.categoryLabel}
                </span>
              </div>
            </div>

            {/* Thân bài viết */}
            <div className="p-6 sm:p-10 space-y-6 max-w-[800px] mx-auto">
              
              {/* Tiêu đề H1 lớn */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* Thông tin Meta: Tác giả, Ngày đăng, Thời gian đọc, Lượt xem */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 py-3.5 border-y border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-slate-800">{article.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    {article.views.toLocaleString()} lượt xem
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-colors cursor-pointer border border-slate-200/80"
                    title="Chia sẻ bài viết"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Đoạn mở đầu / Tóm tắt tóm lược nổi bật */}
              {article.summary && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border-l-4 border-orange-500 text-slate-700 text-sm sm:text-[15px] font-medium leading-relaxed">
                  {article.summary}
                </div>
              )}

              {/* Nội dung chi tiết các đoạn văn */}
              <div className="space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {article.content.map((paragraph, idx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 pt-5 pb-1 border-b border-slate-100">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-slate-900 pt-3 pb-0.5">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="p-4 sm:p-5 rounded-2xl bg-orange-50/80 border-l-4 border-orange-500 text-slate-800 font-medium italic my-4 leading-relaxed">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (paragraph.startsWith('Nguồn tham khảo:')) {
                    return (
                      <div key={idx} className="pt-4 pb-2 border-t border-slate-200 text-xs sm:text-sm font-semibold text-slate-500 italic">
                        {paragraph}
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
                
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-800 leading-relaxed mt-6">
                  <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Lưu ý từ Ban biên tập HaNoi Realty:
                  </p>
                  Thông tin và số liệu được tổng hợp từ các văn bản công bố chính thức và hệ thống dữ liệu thị trường HaNoi Realty. Nhà đầu tư và quý độc giả có nhu cầu tra cứu thửa đất thực tế vui lòng sử dụng tiện ích Bản đồ Quy hoạch số hóa.
                </div>
              </div>

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

              {/* Nút quay lại ở cuối bài */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleGoBack}
                  className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Quay lại trang tin tức</span>
                </button>

                <Link
                  href="/planning"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Compass className="h-4 w-4 text-orange-400" />
                  <span>Tra cứu quy hoạch Hà Nội</span>
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
                      <span>{item.date} • {item.readTime}</span>
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
