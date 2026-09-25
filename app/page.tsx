'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { QuickNav } from '@/components/layout/QuickNav';
import { AirbnbStickySearchBar } from '@/components/home/AirbnbStickySearchBar';
import { DistrictPropertyExplorer } from '@/components/home/DistrictPropertyExplorer';
import { ListingCard } from '@/components/listing/ListingCard';
import { mockListings, ListingItem } from '@/lib/mock-data';
import { useCountUp } from '@/lib/hooks/useScrollAnimation';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import {
  Search,
  MapPin,
  Home,
  Building2,
  TreePine,
  Castle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  TrendingUp,
  Newspaper,
  Users,
  Award,
  ArrowRight,
  Play,
  Phone,
  MessageCircle,
  Eye,
  Heart,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Building,
  Key,
  Flame,
  Clock,
  ExternalLink,
  Layers,
  Sliders,
  Check,
  Download,
  Compass,
  DollarSign,
  Briefcase
} from 'lucide-react';

// Reusable Scroll Animation Wrapper
function FadeInSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stats Counter item
function HeroCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 1500);
  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center px-3 py-1">
      <span className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-white/70 text-[10px] sm:text-xs font-medium mt-0.5">
        {label}
      </span>
    </div>
  );
}

const partnerLogos = [
  {
    name: 'Vietcombank',
    node: (
      <div className="flex items-center gap-1.5 shrink-0">
        <svg className="h-3.5 w-3.5 fill-emerald-500 shrink-0" viewBox="0 0 24 24">
          <path d="M12 2L3 19h18L12 2zm0 6l4.5 9h-9L12 8z" />
        </svg>
        <span className="font-black tracking-tight text-xs text-white">Vietcombank</span>
      </div>
    ),
  },
  {
    name: 'Techcombank',
    node: (
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center -space-x-1 shrink-0">
          <div className="w-2.5 h-2.5 bg-red-600 rotate-45" />
          <div className="w-2.5 h-2.5 bg-red-600 rotate-45" />
        </div>
        <span className="font-extrabold tracking-tight text-xs text-white">TECHCOMBANK</span>
      </div>
    ),
  },
  {
    name: 'VPBank',
    node: (
      <div className="flex items-center gap-1.5 shrink-0">
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C7.5 7 4 11 4 15.5a8 8 0 0016 0C20 11 16.5 7 12 2z" fill="#10b981" />
          <circle cx="12" cy="15" r="3.5" fill="#ef4444" />
        </svg>
        <span className="font-bold tracking-tight text-xs text-white">VPBank</span>
      </div>
    ),
  },
  {
    name: 'MB Bank',
    node: (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-4 h-4 rounded bg-blue-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 leading-none">MB</span>
        <span className="font-black tracking-tight text-xs text-white">MB Bank</span>
      </div>
    ),
  },
  {
    name: 'BIDV',
    node: (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-4 h-4 rounded bg-emerald-600 text-white font-black text-[8px] flex items-center justify-center shrink-0 leading-none">BIDV</span>
        <span className="font-bold tracking-tight text-xs text-white">BIDV</span>
      </div>
    ),
  },
  {
    name: 'VnExpress',
    node: (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-4 h-4 rounded bg-[#990000] text-white font-serif font-black text-[10px] flex items-center justify-center shrink-0 leading-none">V</span>
        <span className="font-serif font-black italic tracking-tight text-xs text-white">VnExpress</span>
      </div>
    ),
  },
  {
    name: 'CafeF',
    node: (
      <div className="flex items-center gap-1 shrink-0">
        <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white font-sans font-black text-[9px] flex items-center justify-center shrink-0 leading-none">C</span>
        <span className="font-black tracking-tight text-xs text-white">Cafe<span className="text-orange-500">F</span></span>
      </div>
    ),
  },
  {
    name: 'VTV',
    node: (
      <div className="flex items-center gap-1 shrink-0">
        <span className="px-1 py-0.5 rounded bg-red-600 text-white font-black italic text-[9px] tracking-tighter leading-none shrink-0">VTV</span>
        <span className="font-black text-xs text-white tracking-tight">Đài THVN</span>
      </div>
    ),
  },
];

const heroFeatureCards = [
  {
    title: 'Không gian Độc bản',
    description: 'Biệt thự, nhà phố kiến trúc tinh hoa tại các quận trung tâm Hà Nội.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    href: '/search?type=house',
  },
  {
    title: 'Căn hộ Hạng sang',
    description: 'Chung cư cao cấp, penthouse view hồ với tiện ích 5 sao đồng bộ.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    href: '/search?type=apartment',
  },
  {
    title: 'Quy hoạch GIS 2030',
    description: 'Tra cứu quy hoạch số, chỉ giới đường đỏ & phân khu đô thị minh bạch.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    href: '/planning',
  },
  {
    title: 'Định giá & Thẩm định AI',
    description: 'Báo cáo xu hướng giá, phân tích tiềm năng tăng trưởng theo thời gian thực.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    href: '/reports',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { savedListingIds, toggleSaveListing } = useApp();

  // ── Dynamic Navy Background Height (Phủ từ đỉnh đến đúng 1/4 hình ảnh) ──
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroCardsRef = useRef<HTMLDivElement>(null);
  const [navyHeight, setNavyHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateNavyHeight = () => {
      if (heroCardsRef.current && heroSectionRef.current) {
        const heroTop = heroSectionRef.current.getBoundingClientRect().top;
        const cardsRect = heroCardsRef.current.getBoundingClientRect();
        const cardTop = cardsRect.top - heroTop;
        const cardHeight = cardsRect.height;
        // Exactly 1/4 (25%) of the 4 cards height!
        const targetHeight = Math.round(cardTop + (cardHeight * 0.25));
        setNavyHeight(targetHeight);
      }
    };
    updateNavyHeight();
    window.addEventListener('resize', updateNavyHeight);
    return () => window.removeEventListener('resize', updateNavyHeight);
  }, []);

  // ── Section 2: Property Categories Carousel Scroll ──
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      categoriesScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // ── Section 3: Featured Listings Carousel Scroll ──
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const scrollFeatured = (direction: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      featuredScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // 8 Featured Listings mock
  const featuredListings = useMemo(() => {
    return mockListings.slice(0, 8);
  }, []);

  // ── Section 5: Personalized Filter Pill ──
  const [personalFilter, setPersonalFilter] = useState<string>('all');
  const personalizedListings = useMemo(() => {
    if (personalFilter === 'price-3-5') {
      return mockListings.filter((l) => l.price >= 3e9 && l.price <= 5.5e9);
    }
    if (personalFilter === 'dongda') {
      return mockListings.filter((l) => l.district === 'Đống Đa');
    }
    if (personalFilter === 'metro') {
      return mockListings.filter((l) => l.district === 'Đống Đa' || l.district === 'Cầu Giấy');
    }
    return mockListings;
  }, [personalFilter]);


  // ── Section 8: Reviews & Testimonials Carousel ──
  const reviews = [
    {
      name: 'Nguyễn Minh Tuấn',
      role: 'Nhà đầu tư BĐS · Đống Đa',
      content: 'Báo cáo AI của HaNoi Realty cực kỳ chi tiết và chuyên nghiệp. Giúp tôi thẩm định tiềm năng và quy hoạch phân khu Đống Đa trong tích tắc, an tâm xuống tiền.',
      rating: 5,
      date: '20/08/2025',
    },
    {
      name: 'Trần Thu Hương',
      role: 'Môi giới BĐS · Cầu Giấy',
      content: 'Bản đồ quy hoạch chuẩn Sở QHKT cùng tính năng Lasso Search hỗ trợ tìm căn hộ theo tuyến Metro cực chuẩn. Khách hàng của tôi rất ấn tượng với file PDF gửi qua Zalo.',
      rating: 5,
      date: '18/08/2025',
    },
    {
      name: 'Lê Văn Dũng',
      role: 'Chủ nhà · Hoàn Kiếm',
      content: 'Đăng tin buổi sáng, buổi chiều đã có 3 môi giới và khách mua liên hệ. Định giá AI gợi ý mức giá sát với giao dịch thực tế thị trường.',
      rating: 5,
      date: '15/08/2025',
    },
    {
      name: 'Phạm Thị Mai',
      role: 'Người mua nhà lần đầu · Hà Đông',
      content: 'Giao diện mượt mà và dễ dùng giống batdongsan nhưng hiện đại hơn nhiều. Dữ liệu giá đất từng đường phố giúp vợ chồng mình không bị mua hớ.',
      rating: 5,
      date: '12/08/2025',
    },
    {
      name: 'Hoàng Đức Anh',
      role: 'Nhà đầu tư cá nhân · Tây Hồ',
      content: 'Khả năng xem trực tiếp lộ trình quy hoạch Vành đai 4 và các tuyến Metro 2, 3 là vũ khí đắc lực giúp tôi đón đầu làn sóng tăng giá.',
      rating: 5,
      date: '08/08/2025',
    },
    {
      name: 'Nguyễn Thị Lan',
      role: 'Sàn BĐS Thủ Đô · Nam Từ Liêm',
      content: 'Gói thành viên Pro mang lại hiệu quả vượt trội. Báo cáo phân tích AI tự động tạo dựng niềm tin tuyệt đối với khách hàng khó tính.',
      rating: 5,
      date: '05/08/2025',
    },
  ];

  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="min-h-screen bg-page-bg text-text-primary overflow-x-hidden font-sans">
      <Navbar />
      <QuickNav />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 1 — HERO SEARCH & 4-CARD GRID (Chuẩn bố cục Ảnh 2)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="hero"
        ref={heroSectionRef}
        className="relative flex flex-col items-center overflow-hidden bg-slate-50 text-slate-800 pt-20 sm:pt-24 pb-0 border-b border-slate-200/80"
      >
        {/* ━━━ NỀN XANH NAVY PHỦ TỪ ĐỈNH ĐẾN 1/4 HÌNH ẢNH ━━━ */}
        <div
          className="absolute top-0 inset-x-0 bg-[#0a1128] z-0 pointer-events-none transition-[height] duration-200 ease-out h-[480px] sm:h-[520px] md:h-[550px] lg:h-[570px]"
          style={navyHeight ? { height: `${navyHeight}px` } : undefined}
        >
          {/* Subtle Ambient Glows on Navy */}
          <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-orange-500/15 blur-[140px]" />
          <div className="absolute top-28 right-1/4 w-96 h-96 rounded-full bg-blue-600/15 blur-[150px]" />
        </div>

        {/* 1. KHU VỰC TIÊU ĐỀ (HERO HEADER) - CĂN GIỮA TRÊN NỀN NAVY */}
        <div className="max-w-4xl w-full mx-auto text-center relative z-20 px-4 sm:px-6">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/15 text-orange-300 rounded-full px-4 py-1 text-xs font-bold shadow-sm mb-3.5 select-none backdrop-blur-sm"
          >
            <span>🏆</span>
            <span>Nền tảng BĐS thông minh #1 Hà Nội</span>
          </motion.div>

          {/* Tiêu đề chính (H1, Font to, Rất đậm) */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight flex flex-col items-center gap-1.5 sm:gap-2 leading-[1.18] sm:leading-[1.2]"
          >
            <span className="text-white block">
              Tìm ngôi nhà mơ ước
            </span>
            <span className="text-orange-500 block">
              tại Hà Nội
            </span>
          </motion.h1>

          {/* Tiêu đề phụ (Subtitle): Sáng rõ trên nền Navy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-xs sm:text-sm md:text-base mt-3 mb-6 sm:mb-8 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Hơn 10,000+ tin đăng chính chủ · Dữ liệu quy hoạch thực 2030-2045 · Thẩm định AI chuyên sâu.
          </motion.p>
        </div>

        {/* 2. KHUNG TÌM KIẾM NỔI (FLOATING SEARCH WIDGET) */}
        {/* Nổi bật trên nền Navy và đè lên 1/4 dải ảnh bên dưới */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-30">
          <AirbnbStickySearchBar />
        </div>

        {/* 3. LƯỚI 4 CỘT HÌNH ẢNH (4-COLUMN CARD GRID) */}
        {/* Nằm phía dưới khung tìm kiếm (đỉnh của 4 thẻ ảnh bị khung tìm kiếm che nhẹ lên, 1/4 nằm trong nền Navy) */}
        <div ref={heroCardsRef} className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-10 -mt-10 sm:-mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {heroFeatureCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
              >
                <Link
                  href={card.href}
                  className="group relative h-[360px] sm:h-[390px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/70 block hover:-translate-y-1.5"
                >
                  {/* Full height background image */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="eager"
                  />

                  {/* Gradient màu Xanh Navy đậm chuyển từ trong suốt ở giữa xuống phủ tối ở đáy thẻ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/50 to-transparent" />

                  {/* Text đè lên đáy ảnh (Căn giữa) */}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-center z-10">
                    {/* Dòng 1: Tiêu đề thẻ (Thẻ/Loại hình) - Chữ Trắng, In đậm, Cỡ vừa */}
                    <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight group-hover:text-orange-400 transition-colors">
                      {card.title}
                    </h3>
                    {/* Dòng 2: Đoạn mô tả ngắn (2 dòng) - Chữ Trắng/Xám nhạt, Cỡ nhỏ */}
                    <p className="text-xs text-white/80 line-clamp-2 max-w-[210px] mx-auto leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Search Preset Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 pt-7 pb-2 text-xs font-medium text-slate-600 max-w-4xl mx-auto px-4 relative z-10"
        >
          <span className="text-slate-400 font-semibold">Tìm kiếm phổ biến:</span>
          {[
            { label: 'Nhà phố Đống Đa', href: '/search?district=Đống Đa&type=house' },
            { label: 'Chung cư Cầu Giấy', href: '/search?district=Cầu Giấy&type=apartment' },
            { label: 'Đất Hà Đông', href: '/search?district=Hà Đông&type=land' },
            { label: 'Biệt thự Tây Hồ', href: '/search?district=Tây Hồ&type=villa' },
            { label: 'Căn hộ 2PN', href: '/search?type=apartment' },
            { label: 'Nhà dưới 3 tỷ', href: '/search?maxPrice=3000000000' },
          ].map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="bg-white hover:bg-orange-50 border border-slate-200/90 hover:border-orange-300 text-slate-700 hover:text-orange-600 rounded-full px-3.5 py-1 text-xs transition-all shadow-sm font-medium"
            >
              {tag.label}
            </Link>
          ))}
        </motion.div>

        {/* BOTTOM STATS BAR (Deep Navy Card) */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 mb-2 relative z-10">
          <div className="w-full rounded-2xl bg-[#0f172a] text-white shadow-xl border border-slate-800 py-3 sm:py-3.5 px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <HeroCounter value={10247} suffix="+" label="Tin đăng đang hoạt động" />
              <HeroCounter value={5832} suffix="+" label="Người dùng tháng này" />
              <HeroCounter value={98} suffix="%" label="Tỷ lệ hài lòng" />
              <HeroCounter value={29} suffix="" label="Quận/huyện có dữ liệu" />
            </div>
          </div>
        </div>

        {/* PARTNER & PRESS MARQUEE STRIP (Deep Navy Strip) */}
        <div className="w-full border-t border-slate-800/80 bg-[#0a0f1e] py-2.5 sm:py-3 mt-4 relative z-10 overflow-hidden">
          <div className="w-full flex items-center">
            {/* Fixed Left Badge */}
            <div className="flex items-center gap-1.5 px-3 sm:px-5 shrink-0 border-r border-slate-800 z-20 bg-gradient-to-r from-[#0a0f1e] via-[#0a0f1e]/90 to-transparent py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase tracking-widest whitespace-nowrap">
                <span className="sm:hidden">Đối tác & Báo chí</span>
                <span className="hidden sm:inline">Đối tác chiến lược & Báo chí</span>
              </span>
            </div>

            {/* Infinite Marquee Track with gradient fade masks on edges */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
              <div className="flex gap-8 sm:gap-12 w-max animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused] items-center py-0.5">
                {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, idx) => (
                  <div
                    key={`${partner.name}-${idx}`}
                    title={partner.name}
                    className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer shrink-0 hover:scale-105"
                  >
                    {partner.node}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 2 — DANH MỤC NHANH (Quick Property Types)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="categories" className="bg-white pt-3 pb-6 sm:pt-4 sm:pb-7 border-b border-slate-100">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3.5 sm:mb-4">
            <div>
              <span className="text-orange-500 font-extrabold text-[11px] tracking-wider uppercase block mb-1">
                KHÁM PHÁ THEO NHU CẦU
              </span>
              <h2 className="text-lg sm:text-xl font-black text-navy leading-snug">
                Danh mục bất động sản Hà Nội
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Carousel navigation buttons */}
              <button
                type="button"
                onClick={() => scrollCategories('left')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title="Trượt sang trái"
                aria-label="Trượt sang trái"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories('right')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title="Trượt sang phải"
                aria-label="Trượt sang phải"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <Link
                href="/search"
                className="text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 inline-flex items-center gap-1 ml-1"
              >
                <span className="hidden sm:inline">Xem tất cả loại BĐS</span>
                <span className="sm:hidden">Xem tất cả</span>
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>

          {/* 1 HÀNG NGANG CAROUSEL (Single Row Compact Carousel) */}
          <div className="relative group/cat-carousel">
            {/* Left Floating Arrow Button */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="hidden lg:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-400 items-center justify-center transition-all hover:scale-110 cursor-pointer"
              title="Trượt sang trái"
              aria-label="Trượt sang trái"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Horizontal Scroll Track */}
            <div
              ref={categoriesScrollRef}
              className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth snap-x scrollbar-none py-1.5 px-0.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { name: 'Nhà phố', count: '4,231 tin', icon: '🏠', href: '/search?type=house' },
                { name: 'Chung cư', count: '2,891 tin', icon: '🏢', href: '/search?type=apartment' },
                { name: 'Đất nền', count: '1,432 tin', icon: '🌿', href: '/search?type=land' },
                { name: 'Biệt thự', count: '456 tin', icon: '🏰', href: '/search?type=villa' },
                { name: 'Thương mại', count: '234 tin', icon: '🏪', href: '/search?type=commercial' },
                { name: 'Dự án mới', count: '89 dự án', icon: '🏗️', href: '/search?type=project' },
                { name: 'Cho thuê', count: '1,876 tin', icon: '🔑', href: '/search?purpose=rent' },
                { name: 'Quy hoạch', count: 'Sở QHKT', icon: '🗺️', href: '/planning' },
              ].map((cat, idx) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: idx * 0.02 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 min-w-[110px] sm:min-w-[130px] shrink-0 snap-start"
                >
                  <Link
                    href={cat.href}
                    className="flex flex-col items-center justify-center text-center px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/15 hover:ring-2 hover:ring-orange-500/20 transition-all duration-200 group h-full cursor-pointer"
                  >
                    <span className="text-xl sm:text-2xl mb-1.5 group-hover:scale-120 group-hover:-translate-y-0.5 transition-transform duration-200 inline-block">
                      {cat.icon}
                    </span>
                    <span className="font-bold text-xs text-navy group-hover:text-orange-600 transition-colors duration-200 whitespace-nowrap">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 group-hover:text-orange-500 font-medium transition-colors whitespace-nowrap">
                      {cat.count}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Floating Arrow Button */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-400 items-center justify-center transition-all hover:scale-110 cursor-pointer"
              title="Trượt sang phải"
              aria-label="Trượt sang phải"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 3 — BẤT ĐỘNG SẢN NỔI BẬT (Bố cục chuẩn Ảnh 1: Tràn viền phải)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="featured" className="bg-slate-50/70 py-16 sm:py-20 overflow-hidden relative border-b border-slate-200/80">
        <div className="w-full pl-4 sm:pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+2rem))] pr-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            
            {/* ── CỘT TRÁI: TEXT & CTA (Cố định, vừa vặn khung) ── */}
            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 pr-4 sm:pr-6 lg:pr-0 text-left">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 text-orange-600 font-extrabold text-[11px] px-3.5 py-1 rounded-full mb-3.5 shadow-xs">
                <Flame className="h-3.5 w-3.5 fill-orange-500" />
                <span>HOT · ĐƯỢC XEM NHIỀU NHẤT</span>
              </div>

              {/* H2 Headline: 2 dòng Navy + Cam chuẩn Image 1 */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.15]">
                <span className="text-[#0a1128] block">Bất động sản,</span>
                <span className="text-orange-500 block">nổi bật nhất tuần</span>
              </h2>

              {/* Subtitle có in đậm từ khóa */}
              <p className="text-slate-600 text-sm sm:text-base mt-4 mb-7 leading-relaxed font-normal">
                Cho dù bạn đang tìm kiếm không gian để <strong>an cư dài lâu</strong>, <strong>nghỉ dưỡng tinh hoa</strong> hay <strong>đầu tư sinh lời vượt trội</strong>, luôn có một bất động sản hoàn hảo dành riêng cho bạn tại Hà Nội.
              </p>

              {/* Action Buttons & Indicator Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                >
                  <span>Khám phá các bất động sản</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Desktop Mini Nav Arrows */}
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <button
                    type="button"
                    onClick={() => scrollFeatured('left')}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    title="Trượt sang trái"
                    aria-label="Trượt sang trái"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollFeatured('right')}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    title="Trượt sang phải"
                    aria-label="Trượt sang phải"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── CỘT PHẢI: DẢI THẺ ẢNH CHẠY HẾT VIỀN BÊN PHẢI (Full Bleed Right Carousel) ── */}
            <div className="w-full lg:flex-1 relative min-w-0">
              {/* Carousel Track */}
              <div
                ref={featuredScrollRef}
                className="flex gap-4 sm:gap-5 overflow-x-auto py-4 pr-6 sm:pr-12 snap-x scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start"
                  >
                    <Link
                      href={`/listings/${listing.id}`}
                      className="group relative h-[420px] sm:h-[460px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/80 cursor-pointer block hover:-translate-y-1.5"
                    >
                      {/* Background Image */}
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Navy Deep Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/50 to-transparent" />

                      {/* Top Badges (Price & Save) */}
                      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                        <span className="px-3.5 py-1.5 rounded-full bg-orange-500 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/30">
                          {formatCurrencyVND(listing.price)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSaveListing(listing.id);
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                            savedListingIds.includes(listing.id)
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
                          }`}
                          title="Lưu tin đăng"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              savedListingIds.includes(listing.id) ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Planning Status Badge (Top-left below price if exists) */}
                      {(listing.planningZone || listing.legalStatus) && (
                        <div className="absolute top-14 left-4 z-10">
                          <span className="px-2.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[10px] font-bold text-white/90 border border-white/20">
                            {listing.planningZone || listing.legalStatus}
                          </span>
                        </div>
                      )}

                      {/* Bottom Info Overlay (Chuẩn Ảnh 1) */}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10">
                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 mb-2 tracking-tight group-hover:text-orange-400 transition-colors">
                          {listing.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-white/85 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span className="truncate">
                            Quận {listing.district}, Hà Nội
                          </span>
                        </div>

                        {/* Specs Bar (Area, Bed, Bath) */}
                        <div className="flex items-center gap-3 pt-2.5 border-t border-white/15 text-[11px] text-white/75">
                          <span className="font-semibold">{listing.area} m²</span>
                          <span>•</span>
                          <span>{listing.bedrooms} PN</span>
                          <span>•</span>
                          <span>{listing.bathrooms} PT</span>
                          {listing.price && listing.area && (
                            <>
                              <span>•</span>
                              <span className="text-orange-300 font-bold">
                                {formatPricePerM2(listing.price, listing.area)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Floating Right Arrow Button (Chuẩn Ảnh 1) */}
              <button
                type="button"
                onClick={() => scrollFeatured('right')}
                className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-2xl border border-slate-200/90 text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:scale-110 active:scale-95 items-center justify-center transition-all cursor-pointer"
                title="Xem tiếp các bất động sản nổi bật"
                aria-label="Xem tiếp"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 4 — KHÁM PHÁ THEO KHU VỰC (Lưới Card & Bản đồ Hà Nội)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <DistrictPropertyExplorer />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 5 — BĐS DÀNH CHO BẠN (Gợi ý cá nhân hoá)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="roadmap" className="bg-navy py-20 text-white relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-orange-400 font-extrabold text-xs tracking-wider uppercase bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                <Sparkles className="h-3 w-3" />
                <span>GỢI Ý THÔNG MINH</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Bất động sản phù hợp với bạn
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Được AI tính toán dựa trên tiềm năng đầu tư, vị trí và pháp lý an toàn
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: '✨ Tất cả gợi ý' },
                { id: 'price-3-5', label: '💰 Giá 3 - 5 tỷ' },
                { id: 'dongda', label: '📍 Đống Đa' },
                { id: 'metro', label: '🚆 Gần tuyến Metro' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setPersonalFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    personalFilter === pill.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalizedListings.slice(0, 8).map((listing) => (
              <div key={listing.id} className="text-slate-900">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/20 transition-all hover:scale-105"
            >
              <span>Xem thêm 10,000+ gợi ý BĐS khác</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 6 — TIN TỨC & PHÂN TÍCH THỊ TRƯỜNG
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="market-updates" className="bg-slate-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-orange-500 font-extrabold text-xs tracking-wider uppercase">
                TIN TỨC & KIẾN THỨC
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy mt-1">
                Cập nhật thị trường BĐS Hà Nội
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Phân tích chuyên sâu từ đội ngũ chuyên gia quy hoạch và định giá
              </p>
            </div>
            <Link
              href="/streets"
              className="text-xs sm:text-sm font-bold text-orange-500 hover:underline inline-flex items-center gap-1"
            >
              <span>Xem tất cả tin tức</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* News Layout: 1 Big Left + 4 Small Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Big Featured Article (Left 50%) */}
            <div className="lg:col-span-6">
              <Link
                href="/streets"
                className="group block bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80"
                    alt="Metro line Hanoi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-orange-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md">
                    🔥 Nổi bật tuần
                  </span>
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                    22/08/2025
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg sm:text-xl font-black text-navy group-hover:text-orange-600 transition-colors leading-snug">
                    Thị trường BĐS Hà Nội Q4/2025: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức khởi công
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    Sự kết nối giữa các trục giao thông hướng tâm và đường vành đai đang tạo lực đẩy mạnh mẽ cho phân khúc nhà phố trung tâm và ven đô.
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-600 font-bold text-[10px] flex items-center justify-center">
                        HR
                      </div>
                      <span className="font-semibold text-slate-700">Ban biên tập HaNoi Realty</span>
                    </div>
                    <span>8 phút đọc</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* 4 Small Articles (Right 50%) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Quy hoạch Vành đai 4: Cơ hội vàng cho nhà đầu tư BĐS ven đô',
                  category: 'Quy hoạch',
                  date: '20/08/2025',
                  image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80',
                },
                {
                  title: 'Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa 2025',
                  category: 'Giá đất',
                  date: '19/08/2025',
                  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
                },
                {
                  title: 'Lãi suất ngân hàng giảm: Tác động tích cực thế nào đến lực cầu BĐS?',
                  category: 'Tài chính',
                  date: '17/08/2025',
                  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
                },
                {
                  title: 'Hướng dẫn kiểm tra quy hoạch phân khu BĐS chuẩn Sở QHKT',
                  category: 'Pháp lý',
                  date: '14/08/2025',
                  image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format&fit=crop&q=80',
                },
              ].map((article, idx) => (
                <Link
                  key={idx}
                  href="/streets"
                  className="group bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      {article.category}
                    </span>
                    <h4 className="font-bold text-xs text-navy group-hover:text-orange-600 transition-colors line-clamp-2 mt-1.5 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-2">{article.date}</p>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* Market Mini Dashboard Row */}
          <div className="mt-12 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>Chỉ số thị trường tuần này</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="p-2">
                <p className="text-xs text-slate-500">Giá TB Đống Đa</p>
                <p className="text-xl font-black text-navy mt-0.5">85 tr/m²</p>
                <span className="text-emerald-600 font-bold text-xs">▲ +2.3% so tháng trước</span>
              </div>
              <div className="p-2 sm:pl-6">
                <p className="text-xs text-slate-500">Giá TB Cầu Giấy</p>
                <p className="text-xl font-black text-navy mt-0.5">65 tr/m²</p>
                <span className="text-emerald-600 font-bold text-xs">▲ +1.8% so tháng trước</span>
              </div>
              <div className="p-2 sm:pl-6">
                <p className="text-xs text-slate-500">Tin đăng mới hôm nay</p>
                <p className="text-xl font-black text-navy mt-0.5">127 tin</p>
                <span className="text-emerald-600 font-bold text-xs">▲ +34 so hôm qua</span>
              </div>
              <div className="p-2 sm:pl-6">
                <p className="text-xs text-slate-500">Giao dịch tháng này</p>
                <p className="text-xl font-black text-navy mt-0.5">89 căn</p>
                <span className="text-emerald-600 font-bold text-xs">▲ +12% hoàn thành</span>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 8 — ĐÁNH GIÁ KHÁCH HÀNG
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-orange-500 font-extrabold text-xs tracking-wider uppercase">
              ⭐ ĐÁNH GIÁ TỪ NGƯỜI DÙNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy mt-1">
              Khách hàng nói gì về HaNoi Realty?
            </h2>
          </div>

          {/* Rating summary bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm border border-slate-100 mb-12 flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="text-center sm:text-left">
              <span className="text-5xl font-black text-navy">4.8</span>
              <span className="text-slate-400 font-bold text-lg"> / 5.0</span>
              <div className="flex items-center gap-1 text-amber-400 text-lg my-1">
                ★★★★★
              </div>
              <p className="text-xs text-slate-400">Dựa trên 1,247 đánh giá đã kiểm thực</p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>5★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[82%]" />
                </div>
                <span>82%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>4★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[12%]" />
                </div>
                <span>12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>3★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[4%]" />
                </div>
                <span>4%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>2★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[1%]" />
                </div>
                <span>1%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>1★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[1%]" />
                </div>
                <span>1%</span>
              </div>
            </div>
          </div>

          {/* Testimonial Cards Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(activeReviewIdx, activeReviewIdx + 3).concat(
              reviews.slice(0, Math.max(0, activeReviewIdx + 3 - reviews.length))
            ).map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 text-sm">★★★★★</span>
                    <span className="text-[11px] text-slate-400">{review.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                    "{review.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                  <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-navy flex items-center gap-1.5">
                      <span>{review.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                        ✓ Verified
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 9 — ĐỐI TÁC & THƯƠNG HIỆU (Marquee)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-14 overflow-hidden border-b border-slate-100">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            ĐỐI TÁC CHIẾN LƯỢC & THƯƠNG HIỆU ĐỒNG HÀNH
          </span>
        </div>

        {/* Marquee Row 1 (Developers) */}
        <div className="flex gap-4 w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] mb-4">
          {[
            'Vinhomes', 'Ecopark Group', 'Sun Group', 'Masterise Homes',
            'Nam Long', 'Hưng Thịnh Corp', 'Novaland', 'CapitaLand',
            'Vinhomes', 'Ecopark Group', 'Sun Group', 'Masterise Homes',
          ].map((brand, idx) => (
            <div
              key={idx}
              className="w-40 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 hover:text-navy hover:bg-orange-50/40 hover:border-orange-200 transition-all shadow-sm cursor-pointer"
            >
              {brand}
            </div>
          ))}
        </div>

        {/* Marquee Row 2 (Banks & Tech) */}
        <div className="flex gap-4 w-max animate-[marquee-reverse_35s_linear_infinite] hover:[animation-play-state:paused]">
          {[
            'Techcombank', 'VPBank', 'Vietcombank', 'BIDV',
            'VNPay', 'MoMo', 'Google Cloud', 'Supabase',
            'Techcombank', 'VPBank', 'Vietcombank', 'BIDV',
          ].map((brand, idx) => (
            <div
              key={idx}
              className="w-40 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 hover:text-navy hover:bg-blue-50/40 hover:border-blue-200 transition-all shadow-sm cursor-pointer"
            >
              {brand}
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="container max-w-5xl mx-auto px-4 mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-2">
            <Award className="h-4 w-4 text-orange-500" />
            Top 10 Startup VN 2024
          </span>
          <span>·</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Bảo mật ISO & SSL 256-bit
          </span>
          <span>·</span>
          <span className="flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-500" />
            Đăng ký Bộ TTTT
          </span>
          <span>·</span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
            Dữ liệu Sở QHKT kiểm định
          </span>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 10 — ĐĂNG TIN CTA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 text-white py-16 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left info */}
            <div className="space-y-3 text-center lg:text-left">
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Bạn muốn đăng tin bán hoặc cho thuê nhà?
              </h2>
              <p className="text-sm sm:text-base text-white/90 max-w-xl">
                Tiếp cận hàng nghìn khách mua tiềm năng mỗi ngày. Đăng tin miễn phí, định vị toạ độ chính xác trên bản đồ.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs font-semibold text-white/90">
                <span>✓ Miễn phí không cần thẻ</span>
                <span>·</span>
                <span>✓ Hiển thị ngay trên bản đồ GIS</span>
                <span>·</span>
                <span>✓ Tự động thẩm định AI</span>
              </div>
            </div>

            {/* Right buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/listings/create"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 font-black text-sm sm:text-base shadow-2xl transition-all hover:scale-105 text-center"
              >
                📝 Đăng tin ngay — Miễn phí
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border-2 border-white text-white hover:bg-white/10 font-bold text-sm sm:text-base transition-all text-center"
              >
                💎 Xem các gói Pro
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 FOOTER (Full width)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-[#0a0f1e] text-slate-400 text-xs py-16 border-t border-slate-800">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                🏠
              </div>
              <span className="text-lg font-black text-white">
                HaNoi <span className="text-orange-500">Realty</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng BĐS thông minh nhất Hà Nội. Tiên phong ứng dụng dữ liệu quy hoạch và định giá AI.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {['Facebook', 'YouTube', 'TikTok', 'LinkedIn'].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
                  title={social}
                >
                  {social[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Col 2 - Sản phẩm */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Sản phẩm & Hệ thống</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/search" className="hover:text-white transition-colors">Tìm kiếm BĐS</Link></li>
              <li><Link href="/planning" className="hover:text-white transition-colors">Bản đồ quy hoạch</Link></li>
              <li><Link href="/reports" className="hover:text-white transition-colors">Báo cáo AI</Link></li>
              <li><Link href="/listings/create" className="hover:text-white transition-colors">Đăng tin BĐS</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Gói thành viên</Link></li>
              <li><Link href="/admin" className="text-orange-400 hover:text-white transition-colors font-bold flex items-center gap-1">🛡️ Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 3 - Công ty */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Công ty</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/about#team" className="hover:text-white transition-colors">Đội ngũ</Link></li>
              <li><Link href="/about#careers" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
              <li><Link href="/streets" className="hover:text-white transition-colors">Blog & Tin tức</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Col 4 - Liên hệ & Hỗ trợ */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Liên hệ</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <p className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">✉️</span>
                <span>support@hanoirealty.vn</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">📞</span>
                <span>1800 6868 (miễn phí)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-orange-400 font-bold mt-0.5">📍</span>
                <span>Tầng 12, Tòa nhà Handico, Phạm Hùng, Nam Từ Liêm, Hà Nội</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                ⏰ T2-T6: 8:00-18:00 | T7: 8:00-12:00
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 HaNoi Realty. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">Chính sách bảo mật</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-slate-300 transition-colors">Điều khoản sử dụng</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
