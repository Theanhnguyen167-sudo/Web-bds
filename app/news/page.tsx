'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { AboutFooter } from '@/components/about/AboutFooter';
import { getStoredArticles } from '@/lib/article-data';
import {
  Newspaper,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  Search,
  ArrowRight,
  ChevronRight,
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

export interface NewsArticle {
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
      'Các chuyên gia định giá nhận định: Việc hoàn thiện mạng lưới giao thông công cộng khối lượng lớn sẽ tái cấu trúc mật độ cư dân và nâng tầm giá trị thương mại cho các trục shophouse, nhà liền kề trên toàn tuyến.'
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
  },
  {
    id: 'chung-cu-ha-noi-thiet-lap-mat-bang-gia-moi',
    title: 'Chung cư Hà Nội thiết lập mặt bằng giá mới: Xu hướng dòng tiền dịch chuyển về phía Tây',
    summary: 'Nguồn cung sơ cấp hạn chế cùng hạ tầng kết nối phía Tây hoàn thiện đang khiến các dự án căn hộ cao cấp khu vực Nam Từ Liêm và Cầu Giấy hút mạnh dòng tiền.',
    category: 'pricing',
    categoryLabel: 'Biến động giá đất',
    categoryColor: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&auto=format&fit=crop&q=80',
    date: '08/09/2025',
    author: 'Nguyễn Minh Quân - Chuyên gia BĐS',
    readTime: '6 phút đọc',
    views: 2450,
    tags: ['Chung cư Hà Nội', 'Khu vực phía Tây', 'Thị trường sơ cấp'],
    content: [
      'Báo cáo thị trường quý gần nhất cho thấy tỷ trọng giao dịch căn hộ có tầm giá trên 60 triệu đồng/m² chiếm hơn 70% tổng lượng tiêu thụ tại thị trường Hà Nội.'
    ]
  },
  {
    id: 'cau-tran-hung-dao-ha-noi-khoi-cong',
    title: 'Quy hoạch cầu Trần Hưng Đạo: Đòn bẩy hạ tầng thúc đẩy giá trị BĐS bờ Đông sông Hồng',
    summary: 'Cây cầu biểu tượng nối trung tâm quận Hoàn Kiếm sang quận Long Biên mở ra chu kỳ phát triển mới cho phân khúc biệt thự, shophouse và đất nền phía Đông.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    date: '03/09/2025',
    author: 'Ban Quy hoạch & Đô thị',
    readTime: '7 phút đọc',
    views: 2780,
    tags: ['Cầu Trần Hưng Đạo', 'Long Biên', 'Quy hoạch giao thông'],
    content: [
      'Dự án không chỉ giảm tải cho cầu Chương Dương và cầu Vĩnh Tuy mà còn kết nối liền mạch hành lang kinh tế nội đô với các đô thị sinh thái hiện đại.'
    ]
  },
  {
    id: 'fdi-kieu-hoi-bds-thu-do-2025',
    title: 'Dòng vốn FDI và kiều hối đổ mạnh vào bất động sản Thủ đô dịp cuối năm',
    summary: 'Hà Nội liên tục dẫn đầu cả nước về thu hút vốn đầu tư nước ngoài vào lĩnh vực bất động sản công nghiệp, văn phòng hạng A và căn hộ dịch vụ cao cấp.',
    category: 'investment',
    categoryLabel: 'Tài chính & Đầu tư',
    categoryColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    date: '30/08/2025',
    author: 'Vũ Thanh Tùng - Chuyên viên Đầu tư',
    readTime: '5 phút đọc',
    views: 1980,
    tags: ['FDI Hà Nội', 'Dòng tiền ngoại', 'Bất động sản cao cấp'],
    content: [
      'Môi trường kinh doanh ổn định và cơ chế mở theo Luật Thủ đô mới đang gia tăng sức hấp dẫn mạnh mẽ cho các nhà đầu tư tổ chức quốc tế.'
    ]
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'market', label: 'Thị trường BĐS' },
  { id: 'planning', label: 'Quy hoạch & Hạ tầng' },
  { id: 'pricing', label: 'Biến động giá đất' },
  { id: 'policy', label: 'Chính sách & Pháp lý' },
  { id: 'project', label: 'Dự án & Quy hoạch' },
  { id: 'investment', label: 'Tài chính & Đầu tư' },
];

const DISTRICT_PRICE_STATS = [
  { name: 'Cầu Giấy', price: '115 tr/m²', change: '+12.4%' },
  { name: 'Đống Đa', price: '85 tr/m²', change: '+8.2%' },
  { name: 'Tây Hồ', price: '160 tr/m²', change: '+15.1%' },
  { name: 'Nam Từ Liêm', price: '72 tr/m²', change: '+10.5%' },
  { name: 'Thanh Xuân', price: '88 tr/m²', change: '+7.4%' },
  { name: 'Long Biên', price: '68 tr/m²', change: '+9.3%' },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [allNews, setAllNews] = useState<NewsArticle[]>(NEWS_ARTICLES);

  useEffect(() => {
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

        const existingIds = new Set(mapped.map((m) => m.id));
        const combined = [...mapped, ...NEWS_ARTICLES.filter((na) => !existingIds.has(na.id))];
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
        matchCategory = article.category === 'pricing' || article.category === 'investment' || article.category === 'project';
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

  // Featured articles selection
  const featuredArticle = useMemo(() => {
    return allNews.find((a) => a.featured) || allNews[0];
  }, [allNews]);

  const secondaryArticles = useMemo(() => {
    return allNews.filter((a) => a.id !== featuredArticle.id).slice(0, 2);
  }, [allNews, featuredArticle]);

  // Latest articles (excluding featured and secondary when in 'all' view with no search)
  const latestArticles = useMemo(() => {
    if (selectedCategory === 'all' && !searchQuery) {
      const excludedIds = new Set([featuredArticle.id, ...secondaryArticles.map((s) => s.id)]);
      const remaining = allNews.filter((a) => !excludedIds.has(a.id));
      return remaining.slice(0, 6);
    }
    return filteredArticles;
  }, [allNews, featuredArticle, secondaryArticles, selectedCategory, searchQuery, filteredArticles]);

  // Topic sections data
  const marketTopicArticles = useMemo(() => {
    return allNews
      .filter((a) => a.category === 'pricing' || a.category === 'investment')
      .slice(0, 3);
  }, [allNews]);

  const planningTopicArticles = useMemo(() => {
    return allNews
      .filter((a) => a.category === 'planning' || a.category === 'project')
      .slice(0, 3);
  }, [allNews]);

  // Top 5 popular articles for sidebar
  const popularArticles = useMemo(() => {
    return [...allNews].sort((a, b) => b.views - a.views).slice(0, 5);
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

      {/* ── 4. CATEGORY NAVIGATION (Horizontal Pills, Clean White, Orange Active) ── */}
      <section className="bg-white border-b border-[#E5E7EB] sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                      : 'bg-white text-slate-600 border-[#E5E7EB] hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER (max-w 1280px, Spacing chuẩn) ── */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-16">

        {/* ── 5 & 6. FEATURED NEWS (EDITORIAL 1 CHÍNH + 2 PHỤ) ── */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Tiêu điểm bất động sản
              </span>
              <span className="text-xs text-slate-400 font-medium">Bản tin chọn lọc tuần này</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Bên trái: 1 Bài viết nổi bật lớn (Editorial Lead - 8 cols) */}
              <div className="lg:col-span-8 flex flex-col">
                <div
                  onClick={() => setSelectedArticle(featuredArticle)}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col h-full cursor-pointer"
                >
                  {/* Ảnh 16:9 đồng nhất */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                        {featuredArticle.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Text bên dưới ảnh */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                        {featuredArticle.categoryLabel}
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-[28px] font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-700">{featuredArticle.author}</span>
                        <span>•</span>
                        <span>{featuredArticle.date}</span>
                        <span>•</span>
                        <span>{featuredArticle.readTime}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                        Đọc toàn văn <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bên phải: 2 Bài viết phụ (Secondary News #2 & #3 - 4 cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                {secondaryArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col h-full cursor-pointer"
                  >
                    {/* Ảnh 16:9 chiều cao cân đối */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {article.categoryLabel}
                      </span>
                    </div>

                    {/* Nội dung gọn gàng để scan nhanh */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                          {article.categoryLabel}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mt-1">
                          {article.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>{article.date} · {article.readTime}</span>
                        <span className="font-semibold text-orange-600 flex items-center gap-0.5">
                          Chi tiết <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* ── 7, 8, 10, 11. LATEST NEWS + COMPACT SIDEBAR ── */}
        <section className="space-y-6">
          
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
            <div className="lg:col-span-8 space-y-6">
              
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
                /* Grid 3 cột trên desktop chuẩn Section 7 */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {latestArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* Ảnh tỷ lệ 16:9 đồng nhất */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Nội dung card */}
                        <div className="p-4 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                            {article.categoryLabel}
                          </div>

                          <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {article.summary}
                          </p>
                        </div>
                      </div>

                      {/* Footer card */}
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{article.date} · {article.readTime}</span>
                        <span className="font-semibold text-orange-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Đọc tiếp <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

            </div>

            {/* Cột Phải (Sidebar: lg:col-span-4 ~30%) - Tinh gọn đúng 3 module quan trọng */}
            <aside className="lg:col-span-4 space-y-6">

              {/* Module 1: Biến động thị trường */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
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
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
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
                      onClick={() => setSelectedArticle(article)}
                      className="group pt-3 first:pt-0 flex items-start gap-3.5 cursor-pointer"
                    >
                      <span className="text-lg sm:text-xl font-black text-slate-300 group-hover:text-orange-500 transition-colors shrink-0 w-6">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
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

        {/* ── 12. TOPIC SECTIONS (Thị trường BĐS & Quy hoạch Hạ tầng) ── */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="space-y-12 sm:space-y-16 pt-4 border-t border-slate-200/80">
            
            {/* Chuyên đề 1: Thị trường BĐS */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Thị trường BĐS
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Phân tích biến động giá, thanh khoản và xu hướng dòng tiền đầu tư tại Hà Nội
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory('pricing')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors shrink-0"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {marketTopicArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                          {article.categoryLabel}
                        </div>
                        <h4 className="text-[15px] sm:text-[16px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{article.date} · {article.readTime}</span>
                      <span className="font-semibold text-orange-600 flex items-center gap-0.5">
                        Đọc tiếp <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Chuyên đề 2: Quy hoạch & Hạ tầng */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Quy hoạch &amp; Hạ tầng
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tiến độ các tuyến vành đai, metro và đồ án phân khu đô thị mới nhất
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory('planning')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors shrink-0"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {planningTopicArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                          {article.categoryLabel}
                        </div>
                        <h4 className="text-[15px] sm:text-[16px] font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{article.date} · {article.readTime}</span>
                      <span className="font-semibold text-orange-600 flex items-center gap-0.5">
                        Đọc tiếp <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

          </div>
        )}

      </div>

      {/* ── 15. MODAL ĐỌC CHI TIẾT BÀI VIẾT (CHUẨN EDITORIAL TYPOGRAPHY) ── */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Header Image với tỷ lệ 16:9 sắc nét */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  aria-label="Đóng bài viết"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="absolute bottom-4 left-4 bg-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  {selectedArticle.categoryLabel}
                </span>
              </div>

              {/* Nội dung bài viết với Editorial Hierarchy */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 max-w-[760px] mx-auto w-full">
                
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Link href="/" className="hover:text-slate-700 transition-colors">Trang chủ</Link>
                  <span>/</span>
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      setSelectedCategory('all');
                    }}
                    className="hover:text-slate-700 transition-colors"
                  >
                    Tin tức
                  </button>
                  <span>/</span>
                  <span className="text-slate-700 font-medium">{selectedArticle.categoryLabel}</span>
                </div>

                {/* H1 Tiêu đề */}
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-black text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">{selectedArticle.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {selectedArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {selectedArticle.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-slate-400" />
                    {selectedArticle.views.toLocaleString()} lượt xem
                  </span>
                </div>

                {/* Lead Excerpt */}
                <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-orange-500 text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                  {selectedArticle.summary}
                </div>

                {/* Main Content Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedArticle.content.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  <p className="text-slate-500 italic pt-2">
                    * Thông tin và số liệu được tổng hợp từ nguồn dữ liệu công bố chính thức và hệ thống định giá HaNoi Realty. Quý độc giả có nhu cầu tra cứu thửa đất vui lòng sử dụng tiện ích bản đồ quy hoạch.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                  {selectedArticle.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        setSelectedArticle(null);
                        setSearchQuery(tag);
                      }}
                      className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Related Articles */}
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Bài viết cùng chuyên mục
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allNews
                      .filter((a) => a.id !== selectedArticle.id && a.category === selectedArticle.category)
                      .slice(0, 2)
                      .map((related) => (
                        <div
                          key={related.id}
                          onClick={() => setSelectedArticle(related)}
                          className="p-3 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer space-y-1.5"
                        >
                          <span className="text-[10px] font-bold text-orange-600 uppercase">
                            {related.categoryLabel}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                            {related.title}
                          </h5>
                          <span className="text-[10px] text-slate-400">{related.date}</span>
                        </div>
                      ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer Bar */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 rounded-b-2xl flex items-center justify-between gap-3">
                <Link
                  href="/planning"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  <Compass className="h-4 w-4" />
                  <span>Tra cứu quy hoạch liên quan</span>
                </Link>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Đóng bài viết
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ĐỒNG BỘ ── */}
      <AboutFooter />

    </div>
  );
}
