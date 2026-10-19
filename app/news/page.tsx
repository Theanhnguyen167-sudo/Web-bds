'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AboutFooter } from '@/components/about/AboutFooter';
import { ArticleImage } from '@/components/news/ArticleImage';
import { NEWS_ARTICLES, NewsArticle } from '@/lib/news-data';
import {
  getStoredArticles,
  getArticlesForBlock,
  getDistinctPopularArticles,
  getCategoryFallbackImage
} from '@/lib/article-data';
import {
  Newspaper,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  Search,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Layers,
  Compass,
  FileText,
  X,
  ArrowUpRight,
  Share2,
  BookmarkCheck,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'market', label: 'Thị trường BĐS' },
  { id: 'planning', label: 'Quy hoạch & Hạ tầng' },
  { id: 'pricing', label: 'Biến động giá đất' },
  { id: 'policy', label: 'Chính sách & Pháp lý' },
  { id: 'project', label: 'Dự án & Quy hoạch' },
  { id: 'investment', label: 'Tài chính & Đầu tư' },
];

const NEWS_HEADINGS_TOC = [
  { id: 'tieu-diem-bds', label: 'Tiêu điểm BĐS' },
  { id: 'tin-moi-nhat', label: 'Tin mới nhất' },
  { id: 'chuyen-de-thi-truong', label: 'Thị trường BĐS' },
  { id: 'chuyen-de-quy-hoach', label: 'Quy hoạch & Hạ tầng' },
  { id: 'bien-dong-thi-truong', label: 'Biến động thị trường' },
  { id: 'doc-nhieu', label: 'Đọc nhiều' },
];

const DISTRICT_PRICE_STATS = [
  { name: 'Cầu Giấy', price: '115 tr/m²', change: '+12.4%' },
  { name: 'Đống Đa', price: '85 tr/m²', change: '+8.2%' },
  { name: 'Tây Hồ', price: '160 tr/m²', change: '+15.1%' },
  { name: 'Nam Từ Liêm', price: '72 tr/m²', change: '+10.5%' },
  { name: 'Thanh Xuân', price: '88 tr/m²', change: '+7.4%' },
  { name: 'Long Biên', price: '68 tr/m²', change: '+9.3%' },
];

const formatReadTime = (readTime?: string): string => {
  if (!readTime) return '5 phút đọc';
  return readTime.includes('đọc') ? readTime : `${readTime} đọc`;
};

const getPlanningProgress = (title: string, summary: string) => {
  const text = (title + ' ' + summary).toLowerCase();
  if (text.includes('thi công') || text.includes('tăng tốc') || text.includes('tiến độ')) {
    return {
      label: 'Đang thi công',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
    };
  }
  if (text.includes('vành đai') || text.includes('giải phóng') || text.includes('mặt bằng')) {
    return {
      label: 'Giải phóng mặt bằng',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
    };
  }
  if (text.includes('sông hồng') || text.includes('phê duyệt') || text.includes('luật')) {
    return {
      label: 'Đã phê duyệt QH',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
    };
  }
  if (text.includes('cầu') || text.includes('khởi công') || text.includes('sân bay')) {
    return {
      label: 'Chuẩn bị khởi công',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      dotColor: 'bg-purple-500',
    };
  }
  return {
    label: 'Đồ án phân khu',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    dotColor: 'bg-teal-500',
  };
};

function NewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');

  // Khôi phục bộ lọc, từ khóa và phân trang từ sessionStorage khi người dùng bấm Back trình duyệt
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('news_selected_category');
      if (saved && !catParam) return saved;
    }
    return catParam || 'all';
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('news_search_query');
      if (saved) return saved;
    }
    return '';
  });

  const [allNews, setAllNews] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('tieu-diem-bds');

  const scrollToHeading = (id: string) => {
    if (
      (id === 'tieu-diem-bds' || id === 'chuyen-de-thi-truong' || id === 'chuyen-de-quy-hoach') &&
      (selectedCategory !== 'all' || searchQuery)
    ) {
      setSelectedCategory('all');
      setSearchQuery('');
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 68;
        const tocHeight = 44;
        const yOffset = -(navbarHeight + tocHeight + 16);
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        setActiveHeadingId(id);
      }
    }, 60);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = NEWS_HEADINGS_TOC.length - 1; i >= 0; i--) {
        const item = NEWS_HEADINGS_TOC[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveHeadingId(item.id);
            return;
          }
        }
      }
      if (NEWS_HEADINGS_TOC.length > 0) {
        setActiveHeadingId(NEWS_HEADINGS_TOC[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedCategory, searchQuery]);

  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('news_current_page');
      if (saved) {
        const p = parseInt(saved, 10);
        if (!isNaN(p) && p > 0) return p;
      }
    }
    return 1;
  });

  const PAGE_SIZE = 5;
  const isInitialMount = useRef(true);

  // Highlight viền cam tinh tế giúp nhận diện bài viết vừa xem khi quay lại trang tin tức (vị trí cuộn do GlobalScrollRestoration bảo toàn chính xác)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedId = sessionStorage.getItem('news_scroll_id');
    if (!savedId) return;

    let attempts = 0;
    const tryHighlight = () => {
      const targetElement =
        document.getElementById(`article-${savedId}`) ||
        document.getElementById(`article-sidebar-${savedId}`);

      if (targetElement) {
        targetElement.classList.add('ring-2', 'ring-orange-500/80', 'ring-offset-2');
        setTimeout(() => {
          targetElement?.classList.remove('ring-2', 'ring-orange-500/80', 'ring-offset-2');
        }, 1600);
        sessionStorage.removeItem('news_scroll_id');
      } else if (attempts < 6) {
        attempts++;
        setTimeout(tryHighlight, 120);
      }
    };

    tryHighlight();
  }, []);

  // Điều hướng sang URL riêng của bài viết và ghi nhớ toàn bộ trạng thái hiện tại
  const handleArticleClick = (article: NewsArticle) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('news_scroll_id', article.id);
      sessionStorage.setItem('news_scroll_y', String(window.scrollY));
      sessionStorage.setItem('news_selected_category', selectedCategory);
      sessionStorage.setItem('news_current_page', String(currentPage));
      sessionStorage.setItem('news_search_query', searchQuery);
    }
    router.push(`/news/${article.id}`);
  };

  // Tự động đồng bộ khi URL query param category thay đổi từ menu điều hướng bên ngoài
  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // Khi người dùng chủ động thay đổi bộ lọc hoặc từ khóa (không phải lúc khôi phục từ back), reset về trang 1
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    try {
      const stored = getStoredArticles();
      if (stored && stored.length > 0) {
        const publishedStored = stored.filter((a) => a.status === 'published');
        const mapped: NewsArticle[] = publishedStored.map((a) => ({
          id: a.id,
          title: a.title,
          summary: a.excerpt || a.seoDescription || '',
          category: (['planning', 'pricing', 'policy', 'project', 'investment', 'market', 'analysis', 'hanoi', 'legal'].includes(a.category)
            ? a.category
            : 'planning') as any,
          categoryLabel: a.categoryLabel || 'Tin tức',
          categoryColor: a.categoryColor || 'bg-blue-500 text-white',
          image: a.featuredImage?.trim() || getCategoryFallbackImage(a.category),
          date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
          author: a.authorName || 'Ban biên tập HaNoi Realty',
          readTime: a.readTime || '5 phút đọc',
          views: a.views || 250,
          content: [a.content || a.excerpt || ''],
          tags: a.tags && a.tags.length > 0 ? a.tags : ['Bất động sản', 'Quy hoạch Hà Nội'],
        }));

        const existingIds = new Set(NEWS_ARTICLES.map((na) => na.id));
        const existingTitles = new Set(NEWS_ARTICLES.map((na) => na.title?.trim().toLowerCase()).filter(Boolean));
        const additionalStored = mapped.filter(
          (m) => !existingIds.has(m.id) && !existingTitles.has(m.title?.trim().toLowerCase())
        );
        const combined = [...NEWS_ARTICLES, ...additionalStored];
        setAllNews(combined);
      }
    } catch (e) {
      console.warn('Lỗi đồng bộ tin tức:', e);
    }
  }, []);

  // Filter logic
  const filteredArticles = useMemo(() => {
    return allNews.filter((article) => {
      let matchCategory = true;
      if (selectedCategory === 'all') {
        matchCategory = true;
      } else if (selectedCategory === 'market') {
        matchCategory = article.category === 'pricing' || article.category === 'investment' || article.category === 'project' || article.category === 'market';
      } else {
        matchCategory = article.category === selectedCategory;
      }

      const matchSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [allNews, selectedCategory, searchQuery]);

  // 1. Featured articles selection (Phần Hero & Tiêu điểm)
  const featuredArticle = useMemo(() => {
    return allNews.find((a) => a.featured) || allNews[0];
  }, [allNews]);

  const secondaryArticles = useMemo(() => {
    return allNews.filter((a) => a.id !== featuredArticle.id).slice(0, 6);
  }, [allNews, featuredArticle]);

  // Danh sách các bài viết đã xuất hiện tại khối Hero (loại trừ bài chính và 3 bài phụ đầu tiên để các khối dưới vẫn phong phú)
  const heroArticles = useMemo(() => {
    return [featuredArticle, ...secondaryArticles.slice(0, 3)].filter(Boolean);
  }, [featuredArticle, secondaryArticles]);

  const heroExcludeIds = useMemo(() => {
    return heroArticles.map((a) => a.id);
  }, [heroArticles]);

  // 2. Khối Tin mới nhất:
  // Lấy pool bài viết đã loại trừ các bài viết ở phần Hero (nếu đang ở trang all)
  const latestPool = useMemo(() => {
    if (selectedCategory === 'all' && !searchQuery) {
      return getArticlesForBlock(allNews, {
        exclude_ids: heroExcludeIds,
      });
    }
    return filteredArticles;
  }, [allNews, heroExcludeIds, selectedCategory, searchQuery, filteredArticles]);

  const totalPages = Math.max(1, Math.ceil(latestPool.length / PAGE_SIZE));

  const latestArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return latestPool.slice(start, start + PAGE_SIZE);
  }, [latestPool, currentPage, PAGE_SIZE]);

  // 3. Khối Chuyên đề Thị trường BĐS:
  // Cấu trúc: 1 bài lớn bên trái + 4 bài danh sách ngang bên phải (5 bài)
  const marketTopicArticles = useMemo(() => {
    const list = getArticlesForBlock(allNews, {
      previousBlocks: [heroArticles, latestArticles],
      category: ['pricing', 'investment', 'policy'],
      limit: 5,
    });
    if (list.length < 5) {
      const extra = allNews.filter(
        (a) => !heroExcludeIds.includes(a.id) && !list.some((item) => item.id === a.id)
      );
      return [...list, ...extra].slice(0, 5);
    }
    return list;
  }, [allNews, heroArticles, latestArticles, heroExcludeIds]);

  const leadMarketArticle = marketTopicArticles[0];
  const secondaryMarketArticles = marketTopicArticles.slice(1, 5);

  // 4. Khối Chuyên đề Quy hoạch & Hạ tầng:
  // Cấu trúc: Bố cục 4 Card ngang có kèm bản đồ thu nhỏ và badge tiến độ
  const planningTopicArticles = useMemo(() => {
    const list = getArticlesForBlock(allNews, {
      previousBlocks: [heroArticles, latestArticles, marketTopicArticles],
      category: ['planning', 'project'],
      limit: 4,
    });
    if (list.length < 4) {
      const extra = allNews.filter(
        (a) =>
          !heroExcludeIds.includes(a.id) &&
          !marketTopicArticles.some((m) => m.id === a.id) &&
          !list.some((p) => p.id === a.id)
      );
      return [...list, ...extra].slice(0, 4);
    }
    return list;
  }, [allNews, heroArticles, latestArticles, marketTopicArticles, heroExcludeIds]);

  // 5. Widget "Đọc nhiều" ở Sidebar:
  // Lọc DISTINCT theo bài viết để mỗi bài chỉ đứng 1 vị trí thứ hạng duy nhất
  const popularArticles = useMemo(() => {
    return getDistinctPopularArticles(allNews, 5);
  }, [allNews]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white antialiased">
      <Navbar />

      {/* ── 3. HERO SECTION (220-280px desktop, Clean Dark Navy, Modern Editorial) ── */}
      <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-12 bg-[#0F172A] text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-blue-500/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-3">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 border border-orange-500/30 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Newspaper className="h-3.5 w-3.5 text-orange-400" />
              <span>Chuyên trang tin tức &amp; phân tích BĐS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight sm:leading-[1.2] text-white">
              Tin tức Bất động sản &amp; Quy hoạch Hà Nội mới nhất
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
              Cập nhật quy hoạch phân khu, tiến độ hạ tầng đô thị và số liệu biến động giá đất từ HaNoi Realty.
            </p>

            {/* Clean Search Box */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm tin tức, quy hoạch, thị trường..."
                  className="w-full pl-11 pr-12 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 border border-white/20 focus:border-orange-500 outline-none transition-all text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── THANH ĐIỀU HƯỚNG NHỎ: MỤC LỤC NGANG CÁC TIÊU ĐỀ (Horizontal Headings TOC) ── */}
      <nav
        aria-label="Mục lục điều hướng tiêu đề trang tin tức"
        className="bg-white/95 supports-[backdrop-filter]:bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-16 sm:top-[68px] z-30 shadow-xs"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 sm:mr-1.5">
              <Compass className="h-3.5 w-3.5 text-orange-500" />
              <span>Mục lục:</span>
            </span>
            {NEWS_HEADINGS_TOC.map((heading) => {
              const isActive = activeHeadingId === heading.id;
              return (
                <button
                  key={heading.id}
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {heading.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER (max-w 1280px, Spacing chuẩn) ── */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-16">

        {/* Chuyên mục đang chọn (Chỉ hiện khi lọc chuyên mục cụ thể, không còn dải dài treo) */}
        {selectedCategory !== 'all' && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 font-medium">Chuyên mục đang chọn:</span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-xs">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory}
              </span>
            </div>
            <Link
              href="/news"
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1.5 group"
            >
              <span>Xem tất cả tin tức</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* ── 5 & 6. FEATURED NEWS (EDITORIAL 1 CHÍNH + 2 PHỤ) ── */}
        {selectedCategory === 'all' && !searchQuery && (
          <section id="tieu-diem-bds" className="space-y-4 scroll-mt-32">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Tiêu điểm bất động sản
              </span>
              <span className="text-xs text-slate-400 font-medium">Bản tin chọn lọc tuần này</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Bên trái: 1 Bài viết nổi bật lớn (Editorial Lead - 7 cols) với ảnh thu nhỏ gọn gàng, chân bằng khít cột bên phải */}
              <div className="lg:col-span-7 flex flex-col">
                <div
                  id={`article-${featuredArticle.id}`}
                  onClick={() => handleArticleClick(featuredArticle)}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col h-full lg:max-h-[412px] cursor-pointer"
                >
                  {/* Ảnh thu nhỏ chiều cao gọn gàng h-48 sm:h-52 lg:h-[215px] */}
                  <div className="relative w-full h-48 sm:h-52 lg:h-[215px] overflow-hidden bg-slate-900 shrink-0">
                    <ArticleImage
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      category={featuredArticle.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="bg-orange-500 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                        {featuredArticle.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Text bên dưới ảnh: Bố cục tinh gọn, vừa khít đáy */}
                  <div className="p-4 sm:p-4.5 lg:p-5 flex flex-col justify-between flex-1 space-y-2.5">
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        {featuredArticle.categoryLabel}
                      </div>
                      <h2 className="text-base sm:text-lg lg:text-[19px] font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-xs sm:text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100/80 flex items-center text-[11px] sm:text-[12px] text-[#6B7280]">
                      {featuredArticle.author && (
                        <>
                          <span className="font-medium text-slate-700">{featuredArticle.author}</span>
                          <span className="mx-2 text-slate-300">•</span>
                        </>
                      )}
                      <span>{featuredArticle.date} • {formatReadTime(featuredArticle.readTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bên phải: Danh sách bài viết phụ dạng thẻ ngang có thanh cuộn góc phải, chân bằng khít với thẻ bên trái */}
              <div
                className="lg:col-span-5 flex flex-col gap-2.5 overflow-y-auto pr-1.5 custom-hero-scrollbar"
                style={{
                  maxHeight: '412px',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E1 #F1F5F9',
                }}
              >
                {secondaryArticles.map((article) => (
                  <div
                    key={article.id}
                    id={`article-${article.id}`}
                    onClick={() => handleArticleClick(article)}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-2.5 sm:p-3 flex flex-row items-center gap-3 shrink-0 cursor-pointer"
                  >
                    {/* Ảnh nhỏ vuông 1:1 nằm bên trái */}
                    <div className="relative aspect-square w-20 sm:w-22 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                      <ArticleImage
                        src={article.image}
                        alt={article.title}
                        category={article.category}
                        className="group-hover:scale-105 transition-transform duration-500"
                        style={{ aspectRatio: '1/1' }}
                      />
                      <span className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {article.categoryLabel}
                      </span>
                    </div>

                    {/* Tiêu đề và ngày tháng nằm bên phải */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 space-y-1 h-full">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-0.5">
                          {article.categoryLabel}
                        </span>
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed hidden sm:block">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center text-[11px] text-[#6B7280] pt-1.5 border-t border-slate-100/80 mt-0.5">
                        <span>{article.date} • {formatReadTime(article.readTime)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ── 7, 8, 10, 11. LATEST NEWS + COMPACT SIDEBAR ── */}
        <section id="tin-moi-nhat" className="space-y-6 scroll-mt-32">
          
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {searchQuery
                  ? `Kết quả tìm kiếm cho "${searchQuery}" (${filteredArticles.length})`
                  : selectedCategory === 'all'
                  ? 'Tin mới nhất'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Danh sách tin bài'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCategory === 'all'
                  ? 'Tổng hợp diễn biến thị trường và thông tin bất động sản Hà Nội mới cập nhật'
                  : `Các bài viết chuyên đề thuộc mục ${CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            )}
          </div>

          {/* Bố cục 70% Nội dung + 30% Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cột Trái (Main Content: lg:col-span-8 ~70%) */}
            <div id="news-content-grid" className="lg:col-span-8 space-y-6">
              
              {latestArticles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                  <Newspaper className="h-10 w-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">Không tìm thấy bài viết phù hợp</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục tin tức khác.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-sm hover:bg-orange-600 transition-colors"
                  >
                    Xem tất cả bài viết
                  </button>
                </div>
              ) : (
                <>
                  {/* Bố cục Tin mới nhất chuẩn Hình 3: 1 bài lớn bên trái (Lead Card) + 4 bài danh sách ngang bên phải (Horizontal List Cards) */}
                  {latestArticles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Cột trái: 1 Bài viết lớn tiêu điểm (Lead Card - 7 cột) */}
                      <div className={`${latestArticles.length > 1 ? 'md:col-span-7' : 'md:col-span-12'} flex flex-col`}>
                        <article
                          id={`article-${latestArticles[0].id}`}
                          onClick={() => handleArticleClick(latestArticles[0])}
                          className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col h-full cursor-pointer"
                        >
                          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                            <ArticleImage
                              src={latestArticles[0].image}
                              alt={latestArticles[0].title}
                              category={latestArticles[0].category}
                              className="group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                {latestArticles[0].categoryLabel}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-2.5">
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                                {latestArticles[0].categoryLabel}
                              </div>
                              <h3
                                className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  wordBreak: 'normal',
                                  overflowWrap: 'break-word',
                                }}
                              >
                                {latestArticles[0].title}
                              </h3>
                              {latestArticles[0].summary && (
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                  {latestArticles[0].summary}
                                </p>
                              )}
                            </div>

                            <div className="pt-2 border-t border-slate-100/80 flex items-center text-[11px] text-[#6B7280]">
                              <span>{latestArticles[0].date} • {formatReadTime(latestArticles[0].readTime)}</span>
                            </div>
                          </div>
                        </article>
                      </div>

                      {/* Cột phải: 4 bài danh sách ngang (Horizontal List Cards - 5 cột) với cỡ chữ tiêu đề vừa như Hình 2 */}
                      {latestArticles.length > 1 && (
                        <div className="md:col-span-5 flex flex-col justify-between gap-3">
                          {latestArticles.slice(1, 5).map((article) => (
                            <article
                              key={article.id}
                              id={`article-${article.id}`}
                              onClick={() => handleArticleClick(article)}
                              className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-3 sm:p-3.5 flex flex-row items-center gap-3.5 flex-1 cursor-pointer"
                            >
                              <div className="relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                                <ArticleImage
                                  src={article.image}
                                  alt={article.title}
                                  category={article.category}
                                  className="group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 space-y-1 h-full">
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-0.5">
                                    {article.categoryLabel}
                                  </span>
                                  <h4
                                    className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug"
                                    style={{
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      wordBreak: 'normal',
                                      overflowWrap: 'break-word',
                                    }}
                                  >
                                    {article.title}
                                  </h4>
                                </div>

                                <div className="text-[12px] text-[#6B7280] pt-1">
                                  <span>{article.date} • {formatReadTime(article.readTime)}</span>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                  {/* Thanh Phân trang (Pagination Bar) rõ ràng - Giữ cho footer không bị đẩy quá xa */}
                  {totalPages > 1 && (
                    <div className="pt-6 sm:pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-slate-500 font-medium">
                        Hiển thị <span className="font-bold text-slate-800">{(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, latestPool.length)}</span> trên tổng số <span className="font-bold text-slate-800">{latestPool.length}</span> bài viết
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (currentPage > 1) {
                              setCurrentPage((prev) => prev - 1);
                              document.getElementById('news-content-grid')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          disabled={currentPage === 1}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                            currentPage === 1
                              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span>Trang trước</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              document.getElementById('news-content-grid')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                              currentPage === pageNum
                                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                                : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          onClick={() => {
                            if (currentPage < totalPages) {
                              setCurrentPage((prev) => prev + 1);
                              document.getElementById('news-content-grid')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                            currentPage === totalPages
                              ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <span>Trang sau</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── 12. TOPIC SECTIONS (Thị trường BĐS & Quy hoạch Hạ tầng - Nằm trong cột chính cạnh Sidebar bám dính) ── */}
              {selectedCategory === 'all' && !searchQuery && (
                <div className="space-y-10 sm:space-y-12 pt-8 sm:pt-10 border-t border-slate-200/80">
                  
                  {/* Chuyên đề 1: Thị trường BĐS (1 bài lớn bên trái + 4 bài danh sách ngang bên phải) */}
                  <section id="chuyen-de-thi-truong" className="space-y-6 scroll-mt-32">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Tiêu điểm kinh tế đô thị</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Thị trường Bất động sản
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Phân tích biến động giá đất, dòng vốn đầu tư và chu kỳ thanh khoản tại Thủ đô
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedCategory('pricing')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors shrink-0"
                      >
                        <span>Xem tất cả bài viết thị trường</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {leadMarketArticle && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                        {/* Cột trái: 1 Bài viết lớn tiêu điểm (Lead Card - 7 cột) */}
                        <div className="md:col-span-7 flex flex-col">
                          <article
                            id={`article-${leadMarketArticle.id}`}
                            onClick={() => handleArticleClick(leadMarketArticle)}
                            className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col h-full cursor-pointer"
                          >
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                              <ArticleImage
                                src={leadMarketArticle.image}
                                alt={leadMarketArticle.title}
                                category={leadMarketArticle.category}
                                className="group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                  {leadMarketArticle.categoryLabel}
                                </span>
                              </div>
                            </div>

                            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-3.5">
                              <div className="space-y-2">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                                  {leadMarketArticle.categoryLabel}
                                </div>
                                <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                                  {leadMarketArticle.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                  {leadMarketArticle.summary}
                                </p>
                              </div>

                              <div className="pt-3.5 border-t border-slate-100/80 flex items-center text-[12px] text-[#6B7280]">
                                <span>{leadMarketArticle.date} • {formatReadTime(leadMarketArticle.readTime)}</span>
                              </div>
                            </div>
                          </article>
                        </div>

                        {/* Cột phải: 4 bài danh sách ngang (Horizontal List Cards - 5 cột) */}
                        <div className="md:col-span-5 flex flex-col justify-between gap-3">
                          {secondaryMarketArticles.map((article) => (
                            <article
                              key={article.id}
                              id={`article-${article.id}`}
                              onClick={() => handleArticleClick(article)}
                              className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-3 sm:p-3.5 flex flex-row items-center gap-3.5 flex-1 cursor-pointer"
                            >
                              <div className="relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                                <ArticleImage
                                  src={article.image}
                                  alt={article.title}
                                  category={article.category}
                                  className="group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5 space-y-1 h-full">
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-0.5">
                                    {article.categoryLabel}
                                  </span>
                                  <h5 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                    {article.title}
                                  </h5>
                                </div>

                                <div className="text-[12px] text-[#6B7280] pt-1">
                                  <span>{article.date} • {formatReadTime(article.readTime)}</span>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Chuyên đề 2: Quy hoạch & Hạ tầng (Card ngang kèm bản đồ thu nhỏ và badge tiến độ) */}
                  <section id="chuyen-de-quy-hoach" className="space-y-6 scroll-mt-32">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                          <Compass className="h-4 w-4" />
                          <span>Dữ liệu không gian &amp; đồ án đô thị</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Quy hoạch &amp; Hạ tầng
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bản đồ số hóa quy hoạch phân khu, tiến độ thi công các trục vành đai và mạng lưới Metro
                        </p>
                      </div>
                      <Link
                        href="/planning"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Mở bản đồ quy hoạch số</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                      </Link>
                    </div>

                    {/* Lưới 2 cột Card ngang rộng rãi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                      {planningTopicArticles.map((article) => {
                        const progress = getPlanningProgress(article.title, article.summary);

                        return (
                          <article
                            key={article.id}
                            id={`article-${article.id}`}
                            onClick={() => handleArticleClick(article)}
                            className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row cursor-pointer"
                          >
                            {/* Ảnh + Bản đồ thu nhỏ GIS badge */}
                            <div className="relative sm:w-44 md:w-48 aspect-[16/10] sm:aspect-auto overflow-hidden bg-slate-900 shrink-0">
                              <ArticleImage
                                src={article.image}
                                alt={article.title}
                                category={article.category}
                                className="group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent sm:hidden" />

                              {/* Bản đồ thu nhỏ GIS badge */}
                              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-900/85 backdrop-blur-md text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-500/30 text-[9px] font-bold shadow-md">
                                <Compass className="h-3 w-3 text-emerald-400" />
                                <span>Bản đồ QH 1/2000</span>
                              </div>

                              {/* Tag danh mục */}
                              <div className="absolute top-2 left-2">
                                <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                                  {article.categoryLabel}
                                </span>
                              </div>
                            </div>

                            {/* Nội dung + Badge tiến độ */}
                            <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 min-w-0 space-y-2">
                              <div className="space-y-1.5">
                                {/* Badge tiến độ dự án */}
                                <div className="flex items-center gap-1.5">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${progress.badgeColor}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${progress.dotColor}`} />
                                    {progress.label}
                                  </span>
                                  <span className="text-[10px] text-slate-400 hidden sm:inline">•</span>
                                  <span className="text-[10px] text-slate-500 hidden sm:inline">Hà Nội 2030</span>
                                </div>

                                <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                                  {article.title}
                                </h4>

                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                  {article.summary}
                                </p>
                              </div>

                              {/* Footer card */}
                              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[12px] text-[#6B7280]">
                                <span>{article.date} • {formatReadTime(article.readTime)}</span>
                                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 group-hover:underline">
                                  <MapPin className="h-3 w-3" /> Xem bản đồ
                                </span>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>

                </div>
              )}

            </div>

            {/* Cột Phải (Sidebar: lg:col-span-4 ~30%) - Tinh gọn đúng 3 module quan trọng, bám dính khi cuộn */}
            <aside
              className="lg:col-span-4 space-y-6 sticky top-[90px] self-start"
              style={{ position: 'sticky', top: '90px' }}
            >

              {/* Module 1: Biến động thị trường */}
              <div id="bien-dong-thi-truong" className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-4 scroll-mt-32">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span>Biến động thị trường</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đơn giá / m²</span>
                </div>

                <div className="space-y-2.5">
                  {DISTRICT_PRICE_STATS.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-orange-50/70 transition-colors border border-slate-100/80"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400">Khu vực trọng điểm</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900">{item.price}</p>
                        <p className="text-[10px] font-bold text-emerald-600">{item.change}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/search"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 hover:bg-orange-50 text-orange-700 font-bold text-xs transition-colors border border-slate-200 hover:border-orange-200"
                >
                  <span>Xem bản đồ so sánh giá đất</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Module 2: Đọc nhiều (Top 5 bài viết editorial) */}
              <div id="doc-nhieu" className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-4 scroll-mt-32">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span>Đọc nhiều</span>
                  </h3>
                </div>

                <div className="divide-y divide-slate-100 space-y-3">
                  {popularArticles.map((article, idx) => (
                    <div
                      key={article.id}
                      id={`article-sidebar-${article.id}`}
                      onClick={() => handleArticleClick(article)}
                      className="group pt-3 first:pt-0 flex items-start gap-3.5 cursor-pointer"
                    >
                      <span className="text-lg sm:text-xl font-black text-slate-300 group-hover:text-orange-500 transition-colors shrink-0 w-6">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4
                          className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'normal',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {article.title}
                        </h4>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Eye className="h-2.5 w-2.5" /> {article.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 3: Tra cứu quy hoạch (CTA Navy/Orange) */}
              <div className="bg-[#0F172A] rounded-2xl p-6 text-white shadow-md space-y-3.5 border border-slate-800">
                <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs uppercase tracking-wider">
                  <Layers className="h-4 w-4" />
                  <span>Tra cứu quy hoạch</span>
                </div>

                <h3 className="text-base font-black leading-snug text-white">
                  Tra cứu quy hoạch Hà Nội trực tuyến
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Xem bản đồ số hóa quy hoạch phân khu, ranh giới lộ giới và tuyến Metro đến năm 2030.
                </p>

                <div className="pt-2">
                  <Link
                    href="/planning"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="h-4 w-4" />
                      <span>Tra cứu quy hoạch Hà Nội</span>
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

            </aside>

          </div>
        </section>

      </div>

      {/* ── FOOTER ĐỒNG BỘ ── */}
      <AboutFooter />

    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <NewsContent />
    </Suspense>
  );
}
