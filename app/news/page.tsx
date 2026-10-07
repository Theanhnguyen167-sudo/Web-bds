'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Newspaper,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Search,
  ArrowRight,
  Sparkles,
  Share2,
  ChevronRight,
  Layers,
  Building2,
  Compass,
  FileText,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'planning' | 'pricing' | 'policy' | 'project' | 'investment';
  categoryLabel: string;
  categoryColor: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  views: number;
  featured?: boolean;
  content: string[];
  tags: string[];
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'metro-line-2-hanoi-q4-2025',
    title: 'Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công',
    summary: 'Sự kết nối giữa các trục giao thông hướng tâm và tuyến Metro số 2 (Nam Thăng Long - Trần Hưng Đạo) đang tạo lực đẩy mạnh mẽ cho phân khúc nhà phố trung tâm và ven đô.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    date: '28/09/2025',
    author: 'Ban biên tập HaNoi Realty',
    readTime: '8 phút đọc',
    views: 3420,
    featured: true,
    tags: ['Metro Hà Nội', 'Quy hoạch 2030', 'Nhà phố Đống Đa', 'Hạ tầng giao thông'],
    content: [
      'Tuyến đường sắt đô thị số 2 (đoạn Nam Thăng Long - Trần Hưng Đạo) vừa được phê duyệt điều chỉnh tổng mức đầu tư và phương án giải phóng mặt bằng, tạo nên làn sóng quan tâm đặc biệt từ giới đầu tư bất động sản.',
      'Khảo sát thực tế của hệ thống HaNoi Realty cho thấy, trong bán kính 800m quanh các nhà ga C1 (Xuân Đỉnh), C2 (Ngoại Giao Đoàn), C3 (Tây Hồ Tây) và khu vực trung tâm phố cổ, giá chào bán nhà mặt phố và nhà riêng trong ngõ ô tô đã ghi nhận mức tăng từ 10% đến 14% so với cùng kỳ.',
      'Các chuyên gia định giá nhận định: Việc hoàn thiện mạng lưới giao thông công cộng khối lượng lớn sẽ tái cấu trúc mật độ cư dân và nâng tầm giá trị thương mại cho các trục shophouse, nhà liền kề trên toàn tuyến.',
    ]
  },
  {
    id: 'vanh-dai-4-ha-noi-co-hoi-vang',
    title: 'Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô',
    summary: 'Dự án đường Vành đai 4 - Vùng Thủ đô đang khẩn trương hoàn thành giải phóng mặt bằng, mở rộng không gian phát triển đô thị vệ tinh tại Hoài Đức, Đan Phượng và Hà Đông.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    date: '25/09/2025',
    author: 'ThS. Nguyễn Hoàng Nam',
    readTime: '6 phút đọc',
    views: 2890,
    tags: ['Vành đai 4', 'Đất nền ven đô', 'Hoài Đức', 'Hà Đông'],
    content: [
      'Đại lộ Vành đai 4 dài 112,8km đi qua Hà Nội, Hưng Yên và Bắc Ninh được kỳ vọng sẽ giải quyết nút thắt giao thông liên vùng và thúc đẩy sự hình thành của các đại đô thị xanh hiện đại.'
    ]
  },
  {
    id: 'bien-dong-gia-dat-dong-da-2025',
    title: 'Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế',
    summary: 'Dữ liệu giao dịch thực tế cho thấy các phường Ô Chợ Dừa, Láng Hạ và Cát Linh tiếp tục dẫn đầu về thanh khoản và tỷ lệ tăng trưởng giá trị bất động sản nhà ở.',
    category: 'pricing',
    categoryLabel: 'Biến động giá đất',
    categoryColor: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    date: '22/09/2025',
    author: 'Phòng Nghiên cứu Thị trường',
    readTime: '5 phút đọc',
    views: 2150,
    tags: ['Giá đất Đống Đa', 'Nhà mặt ngõ', 'Phân tích định giá'],
    content: [
      'Với mật độ dân cư cao và hệ thống trường học, bệnh viện hoàn chỉnh, quận Đống Đa luôn là điểm nóng về nhu cầu an cư bền vững và giữ giá an toàn bậc nhất Hà Nội.'
    ]
  },
  {
    id: 'chinh-sach-luat-dat-dai-moi',
    title: 'Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội',
    summary: 'Bỏ khung giá đất cũ và xây dựng bảng giá đất theo nguyên tắc thị trường: Người mua nhà và nhà đầu tư cần chuẩn bị gì để tối ưu chi phí pháp lý và thuế phí?',
    category: 'policy',
    categoryLabel: 'Chính sách & Pháp lý',
    categoryColor: 'bg-blue-600 text-white',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    date: '19/09/2025',
    author: 'Luật sư Trần Văn Hiệp',
    readTime: '7 phút đọc',
    views: 1820,
    tags: ['Luật Đất đai', 'Bảng giá đất', 'Sổ đỏ pháp lý'],
    content: [
      'Quy định mới tạo bước ngoặt minh bạch hóa thị trường, loại bỏ tình trạng hai giá và bảo vệ quyền lợi hợp pháp của người mua bất động sản có pháp lý hoàn chỉnh.'
    ]
  },
  {
    id: 'lai-suat-ngan-hang-giam-bds',
    title: 'Lãi suất vay mua nhà giảm sâu: Thời điểm thích hợp để sở hữu bất động sản an cư?',
    summary: 'Các gói tín dụng ưu đãi từ 5.5% - 6.5%/năm đang kích hoạt dòng vốn cá nhân quay trở lại phân khúc chung cư cao cấp và nhà riêng thổ cư nội đô.',
    category: 'investment',
    categoryLabel: 'Tài chính & Đầu tư',
    categoryColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    date: '15/09/2025',
    author: 'Chuyên gia Tài chính Techcombank',
    readTime: '6 phút đọc',
    views: 1670,
    tags: ['Lãi suất mua nhà', 'Đòn bẩy tài chính', 'Đầu tư an cư'],
    content: [
      'Mặt bằng lãi suất vay mua nhà ở mức thấp nhất trong 5 năm qua đang tạo ra cơ hội tối ưu chi phí vốn cho người có nhu cầu ở thực và đầu tư tích sản dài hạn.'
    ]
  },
  {
    id: 'quy-hoach-song-hong-ha-noi',
    title: 'Phân khu đô thị Sông Hồng: Diện mạo trục không gian xanh và cảnh quan trung tâm Thủ đô',
    summary: 'Đồ án quy hoạch phân khu đô thị sông Hồng được đẩy mạnh tiến độ, hình thành trục cảnh quan sinh thái văn hóa kết hợp thương mại dịch vụ hiện đại ven sông.',
    category: 'project',
    categoryLabel: 'Dự án & Quy hoạch',
    categoryColor: 'bg-teal-600 text-white',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    date: '11/09/2025',
    author: 'Viện Quy hoạch Xây dựng Hà Nội',
    readTime: '9 phút đọc',
    views: 3100,
    tags: ['Sông Hồng', 'Trục cảnh quan', 'Tây Hồ', 'Long Biên'],
    content: [
      'Trục sông Hồng sẽ trở thành biểu tượng mới của Hà Nội năng động, cân bằng giữa bảo tồn di sản sông nước và kiến tạo không gian sống sinh thái chuẩn quốc tế.'
    ]
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả tin tức' },
  { id: 'planning', label: 'Quy hoạch & Hạ tầng' },
  { id: 'pricing', label: 'Biến động giá đất' },
  { id: 'policy', label: 'Chính sách & Pháp lý' },
  { id: 'project', label: 'Dự án & Quy hoạch' },
  { id: 'investment', label: 'Tài chính & Đầu tư' },
];

const DISTRICT_PRICE_STATS = [
  { name: 'Cầu Giấy', price: '115 tr/m²', change: '+12.4%', trend: 'up' },
  { name: 'Đống Đa', price: '85 tr/m²', change: '+8.2%', trend: 'up' },
  { name: 'Tây Hồ', price: '160 tr/m²', change: '+15.1%', trend: 'up' },
  { name: 'Ba Đình', price: '145 tr/m²', change: '+6.8%', trend: 'up' },
  { name: 'Nam Từ Liêm', price: '72 tr/m²', change: '+10.5%', trend: 'up' },
  { name: 'Thanh Xuân', price: '88 tr/m²', change: '+7.4%', trend: 'up' },
];

import { getStoredArticles } from '@/lib/article-data';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [allNews, setAllNews] = useState<NewsArticle[]>(NEWS_ARTICLES);

  React.useEffect(() => {
    try {
      const stored = getStoredArticles();
      if (stored && stored.length > 0) {
        const publishedStored = stored.filter((a) => a.status === 'published');
        const mapped: NewsArticle[] = publishedStored.map((a) => ({
          id: a.id,
          title: a.title,
          summary: a.excerpt || a.seoDescription || '',
          category: (['planning', 'pricing', 'policy', 'project', 'investment'].includes(a.category)
            ? a.category
            : 'planning') as any,
          categoryLabel: a.categoryLabel || 'Tin tức',
          categoryColor: a.categoryColor || 'bg-blue-500 text-white',
          image: a.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
          date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
          author: a.authorName || 'Ban biên tập HaNoi Realty',
          readTime: a.readTime || '5 phút đọc',
          views: a.views || 250,
          content: [a.content || a.excerpt || ''],
          tags: a.tags && a.tags.length > 0 ? a.tags : ['Bất động sản', 'Quy hoạch Hà Nội'],
        }));

        // Merge mapped with standard mock if not duplicated
        const existingIds = new Set(mapped.map((m) => m.id));
        const combined = [...mapped, ...NEWS_ARTICLES.filter((na) => !existingIds.has(na.id))];
        setAllNews(combined);
      }
    } catch (e) {
      console.warn('Lỗi đồng bộ tin tức:', e);
    }
  }, []);

  const filteredArticles = useMemo(() => {
    return allNews.filter((article) => {
      const matchCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [allNews, selectedCategory, searchQuery]);

  const featuredArticle = allNews.find((a) => a.featured) || allNews[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* ── HEADER BANNER ── */}
      <section className="relative pt-28 pb-16 bg-[#0a1128] text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-blue-600/10 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 border border-orange-500/30 px-3.5 py-1 text-xs font-bold text-orange-400">
              <Newspaper className="h-4 w-4" />
              <span>Chuyên mục Tin tức & Phân tích Thị trường</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Tin Tức Bất Động Sản & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Quy Hoạch Hà Nội Mới Nhất
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Cập nhật thông tin quy hoạch hạ tầng đô thị, tiến độ Metro & Vành đai, biến động giá đất 29 quận huyện và phân tích chuyên sâu từ đội ngũ chuyên gia HaNoi Realty.
            </p>

            {/* Quick Search in News */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm tin tức, quy hoạch, tên tuyến đường..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 border border-white/20 focus:border-orange-500 outline-none transition-all text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 text-xs text-slate-400 hover:text-white"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY BAR ── */}
      <section className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-40 shadow-xs">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT: ARTICLES + SIDEBAR ── */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        
        {/* Featured Big Story (Shown when All is selected and no search) */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative aspect-video lg:aspect-auto overflow-hidden bg-slate-900 group">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                    🔥 Tiêu điểm tuần
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {featuredArticle.categoryLabel}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-orange-500" />
                      {featuredArticle.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug hover:text-orange-600 transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {featuredArticle.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredArticle.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        onClick={() => setSearchQuery(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-600 font-bold flex items-center justify-center text-xs">
                      HR
                    </div>
                    <span className="text-xs font-bold text-slate-700">{featuredArticle.author}</span>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(featuredArticle)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    <span>Đọc toàn văn</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ARTICLES GRID + SIDEBAR DASHBOARD ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Articles List (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                <span>Danh sách tin bài mới nhất ({filteredArticles.length})</span>
              </h3>
              {searchQuery && (
                <span className="text-xs text-slate-500">
                  Kết quả cho từ khóa: <strong className="text-orange-600">"{searchQuery}"</strong>
                </span>
              )}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                <Newspaper className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Không tìm thấy bài viết phù hợp</h4>
                <p className="text-xs text-slate-500">
                  Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục tin khác.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md hover:bg-orange-600 transition-colors"
                >
                  Xem tất cả tin bài
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <motion.article
                    key={article.id}
                    layout
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                          {article.categoryLabel}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                          <span>{article.date}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString()} lượt xem
                          </span>
                        </div>

                        <h4
                          onClick={() => setSelectedArticle(article)}
                          className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
                        >
                          {article.title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-500">{article.readTime}</span>
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                      >
                        <span>Chi tiết</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Market Stats & Tools Sidebar (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Market Mini Dashboard */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span>Đơn giá đất trung bình Q4/2025</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400">Theo m²</span>
              </div>

              <div className="space-y-3">
                {DISTRICT_PRICE_STATS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-orange-50/60 transition-colors border border-slate-100"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-500">Khu vực trung tâm</p>
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
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-colors border border-orange-200/60"
              >
                <span>So sánh giá chi tiết trên bản đồ</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 2. Quick Planning & Metro Access Widget */}
            <div className="bg-gradient-to-br from-[#0a1128] to-[#1e293b] rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>Tiện ích quy hoạch</span>
              </div>

              <h4 className="text-base sm:text-lg font-black leading-snug">
                Tra cứu bản đồ quy hoạch phân khu & Tuyến Metro
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                Xem bản đồ số hóa tỷ lệ 1/2000, 1/5000 các đồ án quy hoạch Hà Nội đến năm 2030, tầm nhìn 2050.
              </p>

              <div className="space-y-2 pt-2">
                <Link
                  href="/planning"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/20"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span>Mở bản đồ Quy hoạch Hà Nội</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/streets"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-orange-400" />
                    <span>Danh mục đường & mạng lưới Metro</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* 3. Newsletter Subscription */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                <Sparkles className="h-4 w-4" />
                <span>Bản tin thị trường hàng tuần</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Nhận cảnh báo quy hoạch và biến động giá đất mới nhất
              </h4>
              <p className="text-xs text-slate-500">
                Được biên tập bởi đội ngũ chuyên gia, gửi trực tiếp vào email của bạn mỗi sáng thứ Hai.
              </p>

              <div className="space-y-2 pt-1">
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => alert('Cảm ơn bạn đã đăng ký nhận bản tin thị trường HaNoi Realty!')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Đăng ký nhận tin miễn phí
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ── MODAL ĐỌC TOÀN VĂN BÀI VIẾT ── */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Modal Image Header */}
              <div className="relative aspect-video w-full bg-slate-900 shrink-0">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
                <span className="absolute bottom-4 left-4 bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                  {selectedArticle.categoryLabel}
                </span>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-4 flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h3>

                <p className="text-sm font-semibold text-slate-700 bg-orange-50/70 p-4 rounded-xl border border-orange-100 leading-relaxed">
                  {selectedArticle.summary}
                </p>

                <div className="space-y-3 pt-2 text-sm text-slate-600 leading-relaxed">
                  {selectedArticle.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                  <p>
                    Để tra cứu vị trí thửa đất, các quy định lộ giới và hạ tầng tiện ích lân cận theo từng đồ án quy hoạch cụ thể, bạn có thể sử dụng công cụ bản đồ số hóa của HaNoi Realty.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {selectedArticle.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between gap-3">
                <Link
                  href="/planning"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  <Compass className="h-4 w-4" />
                  <span>Tra cứu quy hoạch liên quan</span>
                </Link>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Đóng bài viết
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
