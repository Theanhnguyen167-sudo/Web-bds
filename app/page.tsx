
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { AirbnbStickySearchBar } from '@/components/home/AirbnbStickySearchBar';
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
  Briefcase,
  X,
  Bed,
  Bath,
  Maximize2,
  Mail
} from 'lucide-react';

// Dynamic import for Leaflet GIS Map with SSR false
const MiniSearchMap = dynamic(() => import('@/components/map/SearchMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-700">
      <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      <span className="text-xs font-semibold">Đang tải bản đồ Hà Nội...</span>
    </div>
  ),
});

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

// Rolling digit animation for odometer effect
function RollingDigit({ digit, isInView, delay }: { digit: string; isInView: boolean; delay: number }) {
  if (isNaN(parseInt(digit))) return <span className="inline-block">{digit}</span>;

  const target = parseInt(digit);
  // Tạo mảng dài để tạo hiệu ứng cuộn nhiều vòng (dây cót)
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Vị trí dừng là vòng thứ 2 để đảm bảo số nào cũng phải cuộn một đoạn dài
  const offset = 10 + target;

  return (
    <div className="relative inline-block h-[1em] overflow-hidden align-bottom leading-none">
      <motion.div
        className="flex flex-col leading-none"
        initial={{ y: '0%' }}
        animate={{ y: isInView ? `-${offset * (100 / numbers.length)}%` : '0%' }}
        transition={{
          duration: 2.2,
          delay: delay,
          ease: [0.16, 1, 0.3, 1] // Hiệu ứng trượt nhanh lúc đầu và phanh lại từ từ (như dây cót/xe số)
        }}
      >
        {numbers.map((num, idx) => (
          <span key={idx} className="h-[1em] leading-none flex items-center justify-center">
            {num}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Stats Counter item chuẩn Hình 1 (Codi style)
function CodiStatCounter({
  value,
  label,
  suffix = '',
  highlight = false,
  isFixed = false,
  fixedText = '',
}: {
  value?: number;
  label: string;
  suffix?: string;
  highlight?: boolean;
  isFixed?: boolean;
  fixedText?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const formattedString = isFixed ? fixedText : `${(value || 0).toLocaleString('de-DE')}`;
  const displayChars = (formattedString + suffix).split('');

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2 w-full">
      <div
        className={`text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-none flex items-baseline justify-center ${highlight ? 'text-[#0066FF]' : 'text-[#212529]'
          }`}
      >
        {displayChars.map((char, idx) => (
          <RollingDigit
            key={idx}
            digit={char}
            isInView={isInView}
            // Tạo độ trễ từ phải qua trái (số hàng đơn vị chạy trước, hàng chục/trăm chạy sau như công tơ mét)
            delay={(displayChars.length - idx) * 0.15}
          />
        ))}
      </div>
      <span className="text-[11px] sm:text-xs md:text-sm text-slate-500 font-medium mt-1.5 sm:mt-2 text-center leading-snug">
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
    title: 'Định giá & Thẩm định AI',
    description: 'Báo cáo xu hướng giá, phân tích tiềm năng tăng trưởng theo thời gian thực.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    href: '/reports',
    actionText: 'Thẩm định AI',
  },
  {
    title: 'Không gian Độc bản',
    description: 'Biệt thự, nhà phố kiến trúc tinh hoa tại các quận trung tâm Hà Nội.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    href: '/mua-ban/nha-pho',
    actionText: 'Khám phá ngay',
  },
  {
    title: 'Căn hộ Hạng sang',
    description: 'Chung cư cao cấp, penthouse view hồ với tiện ích 5 sao đồng bộ.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    href: '/mua-ban/chung-cu',
    actionText: 'Khám phá ngay',
  },
  {
    title: 'Quy hoạch GIS 2030',
    description: 'Tra cứu quy hoạch số, chỉ giới đường đỏ & phân khu đô thị minh bạch.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    href: '/planning',
    actionText: 'Xem bản đồ số',
  },
  {
    title: 'Nhà phố & Shophouse',
    description: 'Vị trí đắc địa phố cổ & các trục giao thương sầm uất thủ đô.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    href: '/mua-ban/nha-mat-pho',
    actionText: 'Khám phá ngay',
  },
  {
    title: 'Biệt thự Sinh thái Ven đô',
    description: 'Không gian xanh khoáng đạt, cảnh quan sinh thái nghỉ dưỡng chuẩn resort.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    href: '/mua-ban/biet-thu',
    actionText: 'Khám phá ngay',
  },
  {
    title: 'Penthouse & Sky Villa',
    description: 'Tầm nhìn panorama 360 độ ngắm trọn Hồ Tây và toàn cảnh sông Hồng.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    href: '/mua-ban/penthouse',
    actionText: 'Khám phá ngay',
  },
];

const propertyCategories = [
  { name: 'Nhà phố', count: '4,231 tin', icon: '🏠', href: '/mua-ban/nha-pho' },
  { name: 'Chung cư', count: '2,891 tin', icon: '🏢', href: '/mua-ban/chung-cu' },
  { name: 'Đất nền', count: '1,432 tin', icon: '🌿', href: '/mua-ban/dat-nen' },
  { name: 'Biệt thự', count: '456 tin', icon: '🏰', href: '/mua-ban/biet-thu' },
  { name: 'Thương mại', count: '234 tin', icon: '🏪', href: '/search?type=commercial' },
  { name: 'Dự án mới', count: '89 dự án', icon: '🏗️', href: '/search?type=project' },
  { name: 'Cho thuê', count: '1,876 tin', icon: '🔑', href: '/cho-thue' },
  { name: 'Quy hoạch', count: 'Sở QHKT', icon: '🗺️', href: '/planning' },
  { name: 'Penthouse', count: '128 tin', icon: '✨', href: '/mua-ban/penthouse' },
  { name: 'Nhà mặt phố', count: '890 tin', icon: '🏬', href: '/mua-ban/nha-mat-pho' },
  { name: 'Bản đồ 3D', count: 'Metro & VĐ4', icon: '🌐', href: '/planning' },
  { name: 'Định giá AI', count: 'Tra cứu giá', icon: '🤖', href: '/reports' },
];

// ── Hero Search Constants ──
const heroPopularDistricts = [
  { name: 'Đống Đa', count: 1234, avgPrice: '~85tr/m²' },
  { name: 'Hoàn Kiếm', count: 891, avgPrice: '~120tr/m²' },
  { name: 'Cầu Giấy', count: 2102, avgPrice: '~65tr/m²' },
  { name: 'Tây Hồ', count: 567, avgPrice: '~95tr/m²' },
  { name: 'Ba Đình', count: 743, avgPrice: '~110tr/m²' },
  { name: 'Hai Bà Trưng', count: 1089, avgPrice: '~72tr/m²' },
  { name: 'Hoàng Mai', count: 1456, avgPrice: '~45tr/m²' },
  { name: 'Long Biên', count: 892, avgPrice: '~38tr/m²' },
  { name: 'Nam Từ Liêm', count: 1234, avgPrice: '~42tr/m²' },
  { name: 'Hà Đông', count: 2001, avgPrice: '~35tr/m²' },
];

const heroPropertyTypes = [
  { value: 'all', label: 'Tất cả loại BĐS', shortLabel: 'Tất cả BĐS', icon: '🏠' },
  { value: 'house', label: 'Nhà phố / Nhà riêng', shortLabel: 'Nhà phố', icon: '🏠' },
  { value: 'apartment', label: 'Chung cư / Căn hộ', shortLabel: 'Chung cư', icon: '🏢' },
  { value: 'land', label: 'Đất nền / Trang trại', shortLabel: 'Đất nền', icon: '🌿' },
  { value: 'villa', label: 'Biệt thự / Villa', shortLabel: 'Biệt thự', icon: '🏰' },
  { value: 'commercial', label: 'Văn phòng / Thương mại', shortLabel: 'Văn phòng', icon: '🏪' },
];

const heroPricePresets = [
  { label: 'Tất cả mức giá', shortLabel: 'Tất cả giá', value: 'all' },
  { label: 'Dưới 1 tỷ', shortLabel: '< 1 tỷ', value: '0-1' },
  { label: '1 - 3 tỷ', shortLabel: '1 - 3 tỷ', value: '1-3' },
  { label: '3 - 5 tỷ', shortLabel: '3 - 5 tỷ', value: '3-5' },
  { label: '5 - 10 tỷ', shortLabel: '5 - 10 tỷ', value: '5-10' },
  { label: '10 - 20 tỷ', shortLabel: '10 - 20 tỷ', value: '10-20' },
  { label: 'Trên 20 tỷ', shortLabel: '> 20 tỷ', value: '20-999' },
];

function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.6 : scrollLeft + clientWidth * 0.6;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group mt-2">
      <button
        onClick={() => scroll('left')}
        aria-label="Cuộn trái"
        className="hidden sm:flex absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/80 items-center justify-center opacity-90 group-hover:opacity-100 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-3.5 lg:gap-4 overflow-x-auto scrollbar-none py-3 px-1 scroll-smooth snap-x snap-mandatory"
      >
        {propertyCategories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="shrink-0 w-[136px] sm:w-[148px] lg:w-[156px] xl:w-[162px] h-[120px] sm:h-[128px] lg:h-[134px] xl:h-[138px] flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/15 hover:ring-2 hover:ring-orange-500/20 transition-all duration-300 group/item cursor-pointer hover:-translate-y-1 active:scale-98 select-none snap-start"
          >
            <span className="text-2xl sm:text-3xl mb-2.5 sm:mb-3 group-hover/item:scale-115 group-hover/item:-translate-y-0.5 transition-transform duration-300 inline-block leading-none">
              {cat.icon}
            </span>
            <span className="font-bold text-xs sm:text-[13px] lg:text-sm text-[#0a1128] group-hover/item:text-orange-500 transition-colors whitespace-nowrap leading-tight tracking-tight">
              {cat.name}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 mt-1.5 group-hover/item:text-orange-500 font-medium transition-colors whitespace-nowrap leading-none">
              {cat.count}
            </span>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Cuộn phải"
        className="hidden sm:flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200/80 items-center justify-center opacity-90 group-hover:opacity-100 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, listings, savedListingIds, toggleSaveListing } = useApp();

  // ── Hero Search State ──
  const [heroSearchTab, setHeroSearchTab] = useState<'buy' | 'rent' | 'project'>('buy');
  const [heroLocationQuery, setHeroLocationQuery] = useState('');
  const [heroLocationDropdownOpen, setHeroLocationDropdownOpen] = useState(false);
  const [heroType, setHeroType] = useState('all');
  const [heroTypeDropdownOpen, setHeroTypeDropdownOpen] = useState(false);
  const [heroPriceRange, setHeroPriceRange] = useState('all');
  const [heroPriceDropdownOpen, setHeroPriceDropdownOpen] = useState(false);
  const heroSearchBoxRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (heroSearchBoxRef.current && !heroSearchBoxRef.current.contains(e.target as Node)) {
        setHeroLocationDropdownOpen(false);
        setHeroTypeDropdownOpen(false);
        setHeroPriceDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete districts filter
  const heroFilteredDistricts = useMemo(() => {
    if (!heroLocationQuery.trim()) return heroPopularDistricts;
    return heroPopularDistricts.filter((d) =>
      d.name.toLowerCase().includes(heroLocationQuery.toLowerCase())
    );
  }, [heroLocationQuery]);

  // Execute Search handler
  const handleExecuteHeroSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (heroType !== 'all') params.set('type', heroType);
    if (heroLocationQuery.trim()) params.set('district', heroLocationQuery.trim());
    if (heroSearchTab === 'rent') params.set('purpose', 'rent');
    if (heroSearchTab === 'project') params.set('type', 'project');

    if (heroPriceRange !== 'all') {
      const [min, max] = heroPriceRange.split('-');
      if (min && min !== '0') params.set('minPrice', (Number(min) * 1e9).toString());
      if (max && max !== '999') params.set('maxPrice', (Number(max) * 1e9).toString());
    }

    setHeroLocationDropdownOpen(false);
    setHeroTypeDropdownOpen(false);
    setHeroPriceDropdownOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  // State xem chi tiết cho Section 5: Gợi ý thông minh
  const [selectedListingDetail, setSelectedListingDetail] = useState<ListingItem | null>(null);
  const [modalActiveImageIdx, setModalActiveImageIdx] = useState<number>(0);

  const handleOpenDetailModal = (listing: ListingItem) => {
    setSelectedListingDetail(listing);
    setModalActiveImageIdx(0);
  };

  const handleCloseDetailModal = () => {
    setSelectedListingDetail(null);
  };

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedListingDetail(null);
      }
    };
    if (selectedListingDetail) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedListingDetail]);

  // ── Hero Section (Image 1 Breda Layout): Cards Horizontal Scroll Ref ──
  const heroCardsScrollRef = useRef<HTMLDivElement>(null);
  const scrollHeroCards = (direction: 'left' | 'right') => {
    if (heroCardsScrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      heroCardsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

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

  // ── Section 4: District selection for Mini Map ──
  const [hoveredDistrict, setHoveredDistrict] = useState<string>('Đống Đa');

  // Popular Districts for Section 4
  const popularDistricts = useMemo(() => [
    { name: 'Đống Đa', count: 1234, avgPrice: '~85tr/m²' },
    { name: 'Hoàn Kiếm', count: 891, avgPrice: '~120tr/m²' },
    { name: 'Cầu Giấy', count: 2102, avgPrice: '~65tr/m²' },
    { name: 'Tây Hồ', count: 567, avgPrice: '~95tr/m²' },
    { name: 'Ba Đình', count: 743, avgPrice: '~110tr/m²' },
    { name: 'Hai Bà Trưng', count: 1089, avgPrice: '~72tr/m²' },
    { name: 'Hoàng Mai', count: 1456, avgPrice: '~45tr/m²' },
    { name: 'Long Biên', count: 892, avgPrice: '~38tr/m²' },
    { name: 'Nam Từ Liêm', count: 1234, avgPrice: '~42tr/m²' },
    { name: 'Hà Đông', count: 2001, avgPrice: '~35tr/m²' },
  ], []);

  // ── Section 5: Personalized Filter Pill ──
  const [personalFilter, setPersonalFilter] = useState<string>('all');
  const personalizedListings = useMemo(() => {
    const sourceList = listings && listings.length > 0 ? listings : mockListings;
    if (personalFilter === 'price-3-5') {
      return sourceList.filter((l) => l.price >= 3e9 && l.price <= 5.5e9);
    }
    if (personalFilter === 'dongda') {
      return sourceList.filter((l) => l.district === 'Đống Đa');
    }
    if (personalFilter === 'metro') {
      return sourceList.filter((l) => l.district === 'Đống Đa' || l.district === 'Cầu Giấy');
    }
    return sourceList;
  }, [personalFilter, listings]);

  // ── Section 5: Personalized Recommendations Carousel Scroll ──
  const personalizedScrollRef = useRef<HTMLDivElement>(null);
  const scrollPersonalized = (direction: 'left' | 'right') => {
    if (personalizedScrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      personalizedScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // ── Section 8: Reviews & Testimonials Carousel ──
  const reviews = [
    {
      name: 'Nguyễn Minh Tuấn',
      role: 'Nhà đầu tư BĐS · Đống Đa',
      content: 'Báo cáo AI của HaNoi Realty cực kỳ chi tiết và chuyên nghiệp. Giúp tôi thẩm định tiềm năng và quy hoạch phân khu Đống Đa trong tích tắc, an tâm xuống tiền.',
      rating: 5,
      date: '20/08/2025',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Trần Thu Hương',
      role: 'Môi giới BĐS · Cầu Giấy',
      content: 'Bản đồ quy hoạch chuẩn Sở QHKT cùng tính năng Lasso Search hỗ trợ tìm căn hộ theo tuyến Metro cực chuẩn. Khách hàng của tôi rất ấn tượng với file PDF gửi qua Zalo.',
      rating: 5,
      date: '18/08/2025',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Lê Văn Dũng',
      role: 'Chủ nhà · Hoàn Kiếm',
      content: 'Đăng tin buổi sáng, buổi chiều đã có 3 môi giới và khách mua liên hệ. Định giá AI gợi ý mức giá sát với giao dịch thực tế thị trường.',
      rating: 5,
      date: '15/08/2025',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Phạm Thị Mai',
      role: 'Người mua nhà lần đầu · Hà Đông',
      content: 'Giao diện mượt mà và dễ dùng giống batdongsan nhưng hiện đại hơn nhiều. Dữ liệu giá đất từng đường phố giúp vợ chồng mình không bị mua hớ.',
      rating: 5,
      date: '12/08/2025',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Hoàng Đức Anh',
      role: 'Nhà đầu tư cá nhân · Tây Hồ',
      content: 'Khả năng xem trực tiếp lộ trình quy hoạch Vành đai 4 và các tuyến Metro 2, 3 là vũ khí đắc lực giúp tôi đón đầu làn sóng tăng giá.',
      rating: 5,
      date: '08/08/2025',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Nguyễn Thị Lan',
      role: 'Sàn BĐS Thủ Đô · Nam Từ Liêm',
      content: 'Gói thành viên Pro mang lại hiệu quả vượt trội. Báo cáo phân tích AI tự động tạo dựng niềm tin tuyệt đối với khách hàng khó tính.',
      rating: 5,
      date: '05/08/2025',
      avatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef43ce481?w=100&auto=format&fit=crop&q=80',
    },
  ];

  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);
  const [reviewDirection, setReviewDirection] = useState<number>(1);
  const [isReviewPaused, setIsReviewPaused] = useState<boolean>(false);

  const nextReview = () => {
    setReviewDirection(1);
    setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setReviewDirection(-1);
    setActiveReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (idx: number) => {
    setReviewDirection(idx > activeReviewIdx ? 1 : -1);
    setActiveReviewIdx(idx);
  };

  useEffect(() => {
    if (isReviewPaused) return;
    const interval = setInterval(() => {
      setReviewDirection(1);
      setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [isReviewPaused, reviews.length]);

  // ── Section 10: Stay in the loop Newsletter State ──
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterChannel, setNewsletterChannel] = useState<'Email' | 'Zalo'>('Email');
  const [newsletterDropdownOpen, setNewsletterDropdownOpen] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail('');
    }, 3500);
  };

  return (
    <div className="overflow-x-hidden bg-page-bg text-text-primary font-sans scroll-smooth">
      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 1 — HERO THEO CHUẨN CẤU TRÚC ẢNH 1 (CODI FLOATING CARD & HERO IMAGE LAYOUT)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="hero"
        className="relative flex flex-col justify-between overflow-hidden bg-slate-50 text-slate-900 pt-[78px] sm:pt-[82px] lg:pt-[86px] pb-3 sm:pb-4 border-b border-slate-200/80"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col justify-between">

          {/* Main Visual Composition: Dóng trên cùng 1 Grid 12 cột, Cân bằng giữa Search & Lifestyle Visual */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center min-h-[360px] sm:min-h-[400px] lg:min-h-[450px] xl:min-h-[480px] pt-1 sm:pt-2">

            {/* 1. KHỐI ẢNH: CHIẾM VISUAL WEIGHT LỚN HƠN (Cột 4 -> 12, tăng chiều cao & diện tích hiển thị) */}
            <div className="w-full lg:col-start-4 lg:col-end-13 lg:row-start-1 relative h-[300px] sm:h-[360px] lg:h-[430px] xl:h-[460px] rounded-2xl sm:rounded-[28px] lg:rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 group z-10">
              <img
                src="/images/hanoi-luxury-home-hero.jpg"
                alt="Bất động sản nhà ở cao cấp tại Hà Nội - Không gian sống tinh hoa"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* 2. CARD TRẮNG NỔI BÊN TRÁI: Dóng cột 1 -> 5, thu gọn 5-10% chiều rộng để không che ảnh */}
            <div className="w-full md:w-[330px] lg:w-[340px] xl:w-[355px] lg:col-start-1 lg:col-end-5 lg:row-start-1 z-20 mt-4 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <div className="bg-white/98 backdrop-blur-md rounded-2xl sm:rounded-[24px] p-4 sm:p-4.5 shadow-[0_16px_40px_rgba(10,17,40,0.10)] border border-slate-200/90 flex flex-col justify-between">

                  {/* H1 Title: Tìm ngôi nhà mơ ước tại Hà Nội */}
                  <h1 className="text-base sm:text-lg lg:text-[20px] font-black text-[#0a1128] leading-[1.25] tracking-tight mb-2 sm:mb-2.5">
                    Tìm ngôi nhà mơ ước <br className="hidden sm:inline" />
                    <span className="text-orange-500">tại Hà Nội</span>
                  </h1>

                  {/* THANH TÌM KIẾM ĐẦY ĐỦ TÍNH NĂNG */}
                  <div ref={heroSearchBoxRef} className="space-y-2">

                    {/* HÀNG 1: TABS NHU CẦU (Mua bán / Cho thuê / Dự án) */}
                    <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-100/90 rounded-xl w-fit">
                      {[
                        { key: 'buy', label: 'Mua bán', icon: '🏠' },
                        { key: 'rent', label: 'Cho thuê', icon: '🔑' },
                        { key: 'project', label: 'Dự án', icon: '🏗️' },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setHeroSearchTab(tab.key as any)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${heroSearchTab === tab.key
                              ? 'bg-[#0a1128] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                            }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* HÀNG 2: THANH TÌM KIẾM ĐỊA ĐIỂM */}
                    <div className="relative">
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3 h-4 w-4 text-orange-500 pointer-events-none" />
                        <input
                          type="text"
                          value={heroLocationQuery}
                          onChange={(e) => {
                            setHeroLocationQuery(e.target.value);
                            setHeroLocationDropdownOpen(true);
                          }}
                          onFocus={() => {
                            setHeroLocationDropdownOpen(true);
                            setHeroTypeDropdownOpen(false);
                            setHeroPriceDropdownOpen(false);
                          }}
                          placeholder="Nhập quận, huyện, tên đường..."
                          className="w-full h-10 pl-9 pr-8 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15 bg-slate-50/60 focus:bg-white text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all shadow-xs"
                        />
                        {heroLocationQuery && (
                          <button
                            type="button"
                            onClick={() => setHeroLocationQuery('')}
                            className="absolute right-2.5 p-1 hover:bg-slate-200/80 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Autocomplete Dropdown */}
                      <AnimatePresence>
                        {heroLocationDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl bg-white p-2.5 shadow-2xl border border-slate-100 z-50 text-left max-h-60 overflow-y-auto"
                          >
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                              Khu vực phổ biến Hà Nội
                            </p>
                            <div className="space-y-0.5">
                              {heroFilteredDistricts.map((district) => (
                                <button
                                  key={district.name}
                                  type="button"
                                  onClick={() => {
                                    setHeroLocationQuery(district.name);
                                    setHeroLocationDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-colors text-xs cursor-pointer"
                                >
                                  <span className="font-semibold flex items-center gap-2">
                                    <span>🏙️</span>
                                    <span>Quận {district.name}, Hà Nội</span>
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-medium">{district.count} tin</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* HÀNG 3: BỘ LỌC LOẠI HÌNH & MỨC GIÁ */}
                    <div className="grid grid-cols-2 gap-2 relative">
                      {/* Dropdown 1 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setHeroTypeDropdownOpen(!heroTypeDropdownOpen);
                            setHeroPriceDropdownOpen(false);
                            setHeroLocationDropdownOpen(false);
                          }}
                          className={`w-full h-10 flex items-center justify-between px-3 rounded-xl border text-xs sm:text-[13px] font-semibold transition-all ${heroTypeDropdownOpen
                              ? 'border-orange-500 ring-3 ring-orange-500/15 bg-orange-50/20 text-[#0a1128]'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-white text-slate-700'
                            }`}
                        >
                          <span className="truncate">
                            {heroPropertyTypes.find((t) => t.value === heroType)?.label || 'Loại hình BĐS'}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${heroTypeDropdownOpen ? 'rotate-180 text-orange-500' : ''
                              }`}
                          />
                        </button>
                        <AnimatePresence>
                          {heroTypeDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              className="absolute top-full left-0 right-0 w-full mt-1.5 rounded-2xl bg-white p-1.5 shadow-2xl border border-slate-200/90 z-50 space-y-0.5 max-h-72 overflow-y-auto"
                            >
                              {heroPropertyTypes.map((t) => (
                                <button
                                  key={t.value}
                                  type="button"
                                  onClick={() => {
                                    setHeroType(t.value);
                                    setHeroTypeDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${heroType === t.value
                                      ? 'bg-orange-500 text-white shadow-sm'
                                      : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                  <span className="shrink-0">{t.icon}</span>
                                  <span className="truncate">{t.label}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Dropdown 2 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setHeroPriceDropdownOpen(!heroPriceDropdownOpen);
                            setHeroTypeDropdownOpen(false);
                            setHeroLocationDropdownOpen(false);
                          }}
                          className={`w-full h-10 flex items-center justify-between px-3 rounded-xl border text-xs sm:text-[13px] font-semibold transition-all ${heroPriceDropdownOpen
                              ? 'border-orange-500 ring-3 ring-orange-500/15 bg-orange-50/20 text-[#0a1128]'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-white text-slate-700'
                            }`}
                        >
                          <span className="truncate">
                            {heroPricePresets.find((p) => p.value === heroPriceRange)?.label || 'Mức giá'}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${heroPriceDropdownOpen ? 'rotate-180 text-orange-500' : ''
                              }`}
                          />
                        </button>
                        <AnimatePresence>
                          {heroPriceDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              className="absolute top-full left-0 right-0 w-full mt-1.5 rounded-2xl bg-white p-1.5 shadow-2xl border border-slate-200/90 z-50 space-y-0.5 max-h-72 overflow-y-auto"
                            >
                              {heroPricePresets.map((p) => (
                                <button
                                  key={p.value}
                                  type="button"
                                  onClick={() => {
                                    setHeroPriceRange(p.value);
                                    setHeroPriceDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${heroPriceRange === p.value
                                      ? 'bg-orange-500 text-white shadow-sm'
                                      : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                  <span className="truncate">{p.label}</span>
                                  {heroPriceRange === p.value && <span className="shrink-0 font-bold ml-1">✓</span>}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* HÀNG 4: NÚT TÌM KIẾM TO NỔI BẬT */}
                    <button
                      type="button"
                      onClick={() => handleExecuteHeroSearch()}
                      className="w-full h-10.5 sm:h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-[13px] tracking-wide shadow-md shadow-orange-500/30 hover:shadow-orange-500/45 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer mt-1"
                    >
                      <Search className="w-4 h-4" />
                      <span>Tìm kiếm Bất động sản</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* 3. DẢI ĐỐI TÁC HỆ SINH THÁI (Thu gọn vừa vặn để thấy trọn vẹn trong first viewport) */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 overflow-hidden bg-white rounded-t-3xl w-[100vw] relative left-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-8 xl:px-10 shadow-sm">
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] py-1.5 sm:py-2">
              <div className="flex gap-10 sm:gap-14 md:gap-18 w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] items-center text-slate-400 select-none">
                {[
                  { name: 'VINHOMES', className: 'font-black tracking-tight text-lg sm:text-xl md:text-2xl' },
                  { name: 'MASTERISE HOMES', className: 'font-serif font-bold tracking-wider text-base sm:text-lg md:text-xl' },
                  { name: 'ecopark', className: 'font-black italic tracking-tight text-lg sm:text-xl md:text-2xl' },
                  { name: 'SỞ QHKT HÀ NỘI', className: 'font-bold tracking-tight text-base sm:text-lg md:text-xl' },
                  { name: 'TECHCOMBANK', className: 'font-black tracking-tighter text-base sm:text-lg md:text-xl uppercase' },
                  { name: 'Vietcombank', className: 'font-black tracking-tight text-base sm:text-lg md:text-xl' },
                  { name: 'CEN LAND', className: 'font-black tracking-wider text-base sm:text-lg md:text-xl uppercase' },
                  { name: 'Batdongsan.com.vn', className: 'font-black tracking-tight text-base sm:text-lg md:text-xl' },
                  // Lặp lại
                  { name: 'VINHOMES', className: 'font-black tracking-tight text-lg sm:text-xl md:text-2xl' },
                  { name: 'MASTERISE HOMES', className: 'font-serif font-bold tracking-wider text-base sm:text-lg md:text-xl' },
                  { name: 'ecopark', className: 'font-black italic tracking-tight text-lg sm:text-xl md:text-2xl' },
                  { name: 'SỞ QHKT HÀ NỘI', className: 'font-bold tracking-tight text-base sm:text-lg md:text-xl' },
                  { name: 'TECHCOMBANK', className: 'font-black tracking-tighter text-base sm:text-lg md:text-xl uppercase' },
                  { name: 'Vietcombank', className: 'font-black tracking-tight text-base sm:text-lg md:text-xl' },
                  { name: 'CEN LAND', className: 'font-black tracking-wider text-base sm:text-lg md:text-xl uppercase' },
                  { name: 'Batdongsan.com.vn', className: 'font-black tracking-tight text-base sm:text-lg md:text-xl' },
                ].map((brand, idx) => (
                  <span
                    key={`${brand.name}-${idx}`}
                    className={`${brand.className} hover:text-slate-700 transition-colors cursor-default whitespace-nowrap`}
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Dòng mô tả nhỏ căn giữa chuẩn ảnh 2 */}
            <p className="text-xs text-slate-400 font-medium text-center mt-1.5 sm:mt-2">
              Được tin tưởng bởi các đơn vị phát triển BĐS và hơn 10.000+ khách hàng tại 29 quận, huyện Hà Nội
            </p>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 1.5 + SECTION 2: DẢI THỐNG KÊ + DANH MỤC BĐS (Chuyển tiếp êm dịu, không giật cục)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div id="stats-and-categories" className="flex flex-col border-b border-slate-200/80">

        {/* 1. DẢI THỐNG KÊ (Social proof nối tiếp Hero: Gọn gàng, giảm khoảng trắng thừa, căn theo Grid chuẩn max-w-7xl) */}
        <section id="hero-stats" className="bg-white py-6 sm:py-7 lg:py-8 border-b border-slate-200/80">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-slate-200/80 items-center">
              <CodiStatCounter value={10247} suffix="+" label="tin đăng đang hoạt động" />
              <CodiStatCounter value={5832} suffix="+" highlight={true} label="người dùng tháng này" />
              <CodiStatCounter value={98} suffix="%" label="tỷ lệ khách hàng hài lòng" />
            </div>
          </div>
        </section>

        {/* 2. DANH MỤC BẤT ĐỘNG SẢN HÀ NỘI (Nền trung tính nhẹ #F8FAFC, liền mạch với Hero & Stats) */}
        <section id="categories" className="bg-slate-50/70 py-8 sm:py-10 lg:py-12 relative text-slate-900 flex flex-col justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-orange-600 font-extrabold text-xs tracking-wider uppercase block mb-1">
                  KHÁM PHÁ THEO NHU CẦU
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0a1128] leading-tight tracking-tight">
                  Danh mục bất động sản <span className="text-orange-500">Hà Nội</span>
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                  Hơn 10,000+ tin đăng chính chủ đã thẩm định quy hoạch thực tế, phân loại đầy đủ theo từng phân khúc
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/search"
                  className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 group"
                >
                  <span>Xem tất cả loại BĐS</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Lưới Danh mục ô vuông cuộn ngang có nút điều hướng */}
          <CategoryCarousel />
        </section>

      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 3 — BẤT ĐỘNG SẢN NỔI BẬT (Nền trắng tinh sạch, tôn vinh hình ảnh BĐS)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="featured" className="bg-white py-10 sm:py-12 lg:py-14 overflow-hidden relative border-b border-slate-200/80">

        {/* ── PHẦN CHỮ Ở TRÊN (CĂN THEO GRID CHUẨN MAX-W-7XL + NÚT ĐIỀU HƯỚNG HEADER) ── */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {/* Top Badge — Primary Highlight */}
              <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 text-orange-600 font-extrabold text-[11px] px-3.5 py-1 rounded-full mb-2.5 shadow-xs">
                <Flame className="h-3.5 w-3.5 fill-orange-500" />
                <span>HOT · ĐƯỢC XEM NHIỀU NHẤT</span>
              </div>

              {/* Heading — Primary Information */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0a1128] tracking-tight leading-tight">
                Bất động sản, <span className="text-orange-500">nổi bật nhất tuần</span>
              </h2>

              {/* Subtitle — Supporting Text */}
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Cho dù bạn đang tìm kiếm không gian để <strong>an cư dài lâu</strong>, <strong>nghỉ dưỡng tinh hoa</strong> hay <strong>đầu tư sinh lời vượt trội</strong>, luôn có một bất động sản hoàn hảo dành riêng cho bạn tại Hà Nội.
              </p>
            </div>

            {/* Header Navigation Controls: Dễ nhìn, trong container, không che nội dung */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollFeatured('left')}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-300 shadow-sm transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label="Cuộn trái"
                title="Xem tin trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollFeatured('right')}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-300 shadow-sm transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label="Cuộn phải"
                title="Xem tin tiếp theo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── DẢI CÁC THẺ BÀI VIẾT Ở DƯỚI (CĂN THEO GRID CHUẨN MAX-W-7XL) ── */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative group/carousel">

            {/* Carousel Track: Tỷ lệ thẻ tạo partial preview 35% có chủ đích, không tràn container */}
            <div
              ref={featuredScrollRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto py-3 px-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredListings.map((listing) => {
                const isSaved = savedListingIds.includes(listing.id);
                const cardPricePerM2 = formatPricePerM2(listing.price, listing.area);
                const formattedPrice = formatCurrencyVND(listing.price);
                const firstImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={listing.id}
                    className="w-[275px] sm:w-[295px] md:w-[315px] lg:w-[335px] xl:w-[345px] shrink-0 snap-start"
                  >
                    <div
                      onClick={() => handleOpenDetailModal(listing)}
                      className="group/card relative flex flex-col h-[405px] sm:h-[420px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-sm hover:shadow-2xl hover:shadow-orange-500/15 hover:border-orange-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer select-none"
                      title="Nhấp để xem nội dung chi tiết bài đăng"
                    >
                      {/* Thumbnail Image Container: Aspect 16/10 đồng bộ */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={firstImage}
                          alt={listing.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-108"
                          loading="lazy"
                        />

                        {/* Badges (Top-left) */}
                        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5 items-center">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-2 py-0.5 text-[10px] font-black text-white shadow-md border border-white/20">
                            <Flame className="h-3 w-3 fill-white" />
                            <span>HOT</span>
                          </span>
                          {(listing.planningZone || listing.legalStatus) && (
                            <span className="inline-flex items-center rounded-lg bg-slate-900/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-md border border-white/20">
                              {listing.planningZone || listing.legalStatus}
                            </span>
                          )}
                        </div>

                        {/* Wishlist Heart Button (Top-right) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSaveListing(listing.id);
                          }}
                          className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-all hover:scale-115 hover:bg-white cursor-pointer"
                          title={isSaved ? 'Bỏ lưu tin' : 'Lưu tin yêu thích'}
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'}`}
                          />
                        </button>

                        {/* Price Tag Overlay — Primary Information (Giá độ tương phản cao nhất) */}
                        <div className="absolute bottom-2.5 left-2.5 z-20 rounded-xl bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-xs font-black text-white shadow-md border border-white/15">
                          <span className="text-white font-black text-xs tracking-tight">
                            {formattedPrice}
                          </span>
                          <span className="ml-1 text-[10px] font-medium text-slate-300">
                            ({cardPricePerM2})
                          </span>
                        </div>

                        {/* Quick view hover pill (Bottom-right) */}
                        <div className="absolute bottom-2.5 right-2.5 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-200 translate-y-1 group-hover/card:translate-y-0">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500 text-white text-[11px] font-bold px-2 py-1 shadow-md">
                            <Eye className="h-3 w-3" />
                            <span>Xem nhanh</span>
                          </span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="flex flex-1 flex-col p-3.5 justify-between bg-white">
                        {/* Title — Secondary Information (text-slate-800, hover orange) */}
                        <div className="h-10 sm:h-11 flex items-start mb-1.5">
                          <Link
                            href={`/listings/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="line-clamp-2 text-xs sm:text-[13px] font-extrabold leading-snug text-slate-800 transition-colors hover:text-orange-600 block cursor-pointer"
                            title={listing.title}
                          >
                            {listing.title}
                          </Link>
                        </div>

                        {/* Location — Secondary Information (text-slate-600) */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2.5 h-4 truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <span className="truncate font-medium">
                            {listing.ward ? `${listing.ward}, ` : ''}Quận {listing.district}, Hà Nội
                          </span>
                        </div>

                        {/* Specs Row — Metadata (text-slate-500 / 600, nhẹ hơn Title & Location) */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 mb-2.5 h-7">
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Maximize2 className="h-3 w-3 text-slate-400" />
                            <span className="font-semibold text-slate-600 text-[11px]">{listing.area} m²</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Building className="h-3 w-3 text-slate-400" />
                            <span className="font-medium text-slate-500 text-[11px]">{listing.floors > 0 ? `${listing.floors} tầng` : 'Nhà đẹp'}</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Bed className="h-3 w-3 text-slate-400" />
                            <span className="font-medium text-slate-500 text-[11px]">{listing.bedrooms || 2} PN</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Bath className="h-3 w-3 text-slate-400" />
                            <span className="font-medium text-slate-500 text-[11px]">{listing.bathrooms || 1} PT</span>
                          </div>
                        </div>

                        {/* Action buttons CTA: Cùng một baseline */}
                        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetailModal(listing);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Xem chi tiết</span>
                          </button>
                          <Link
                            href={`/listings/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition-colors shrink-0"
                            title="Mở toàn bộ trang chi tiết riêng"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Side Floating Left Arrow Button: Nằm trong container (left-1 sm:left-2), căn trên ảnh (top-[95px]), không che nội dung */}
            <button
              type="button"
              onClick={() => scrollFeatured('left')}
              className="hidden md:flex absolute left-1 sm:left-2 top-[95px] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer"
              title="Trượt sang trái"
              aria-label="Trượt sang trái"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Side Floating Right Arrow Button: Nằm trong container (right-1 sm:right-2), căn trên ảnh (top-[95px]), không che nội dung */}
            <button
              type="button"
              onClick={() => scrollFeatured('right')}
              className="hidden md:flex absolute right-1 sm:right-2 top-[95px] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer"
              title="Xem tiếp các bất động sản nổi bật"
              aria-label="Xem tiếp"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* ── NÚT KHÁM PHÁ Ở GIỮA BÊN DƯỚI (Chuẩn nút Book a tour trong Hình 2) ── */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            >
              <span>Khám phá các bất động sản</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 4 — BẢN ĐỒ MINI + BĐS THEO KHU VỰC
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="map-search" className="bg-[#0a1128] z-10 py-10 sm:py-14 lg:py-16 border-y border-slate-800/80 text-white relative overflow-hidden scroll-mt-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-stretch">

            {/* Left 40-42%: District List & Filter Control */}
            <div className="lg:col-span-5 flex flex-col justify-between lg:h-[520px] xl:h-[540px]">
              {/* Section Header */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-orange-400 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                  <span>KHÁM PHÁ THEO KHU VỰC</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white mt-2 leading-tight tracking-tight">
                  Tìm nhà trên bản đồ Hà Nội
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Rê chuột vào quận để xem vị trí trực quan hoặc nhấp để lọc tin đăng chính xác
                </p>
              </div>

              {/* District Table Panel - Structured 3-column scan */}
              <div className="rounded-2xl sm:rounded-[20px] border border-slate-200/90 bg-white shadow-2xl flex-1 my-3 sm:my-3.5 overflow-hidden flex flex-col min-h-[280px] lg:min-h-0">
                {/* Column Headers for Easy Scanning */}
                <div className="grid grid-cols-12 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-100 bg-slate-50/90 select-none">
                  <span className="col-span-5 flex items-center gap-1.5">
                    Khu vực
                  </span>
                  <span className="col-span-3 text-center">Nguồn cung</span>
                  <span className="col-span-4 text-right">Đơn giá TB</span>
                </div>

                {/* Scrollable District Rows */}
                <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-1.5 sm:p-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {popularDistricts.map((d) => {
                    const isSelected = hoveredDistrict === d.name;
                    return (
                      <div
                        key={d.name}
                        onMouseEnter={() => setHoveredDistrict(d.name)}
                        onClick={() => router.push(`/search?district=${encodeURIComponent(d.name)}`)}
                        className={`grid grid-cols-12 items-center py-2 px-2.5 sm:px-3 rounded-xl cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-semibold'
                            : 'hover:bg-orange-50/70 text-slate-700'
                        }`}
                      >
                        {/* District Name with Pin */}
                        <div className="col-span-5 flex items-center gap-2 min-w-0 pr-1">
                          <MapPin
                            className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                              isSelected ? 'text-white' : 'text-orange-500'
                            }`}
                          />
                          <span className="font-bold text-xs sm:text-[13px] truncate">
                            Quận {d.name}
                          </span>
                        </div>

                        {/* Supply Count Badge */}
                        <div className="col-span-3 text-center">
                          <span
                            className={`inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold transition-colors ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {d.count.toLocaleString()} tin
                          </span>
                        </div>

                        {/* Avg Price per m² */}
                        <div className="col-span-4 text-right">
                          <span
                            className={`font-mono font-bold text-xs sm:text-[13px] transition-colors ${
                              isSelected
                                ? 'text-yellow-200 drop-shadow-xs'
                                : 'text-orange-600'
                            }`}
                          >
                            {d.avgPrice}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons - Identical Height h-11 */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <Link
                  href={`/search?district=${encodeURIComponent(hoveredDistrict)}`}
                  className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/25 transition-all px-2.5"
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">Xem tin {hoveredDistrict}</span>
                </Link>

                <Link
                  href="/planning"
                  className="h-11 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100 hover:text-white active:scale-[0.98] font-bold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all px-2.5"
                >
                  <Layers className="h-4 w-4 text-orange-400 shrink-0" />
                  <span className="truncate">Bản đồ quy hoạch</span>
                </Link>
              </div>
            </div>

            {/* Right 58-60%: Interactive Leaflet GIS Map */}
            <div className="lg:col-span-7 flex flex-col h-[380px] sm:h-[440px] lg:h-[520px] xl:h-[540px]">
              <div className="rounded-2xl sm:rounded-[20px] overflow-hidden shadow-2xl border border-slate-700/80 w-full h-full relative bg-slate-900 ring-1 ring-white/10 flex-1">
                {/* Active Indicator Floating Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[400] bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-2 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-200">
                    Đang xem: <strong className="text-orange-400 font-bold">Quận {hoveredDistrict}</strong>
                  </span>
                </div>

                <MiniSearchMap
                  listings={mockListings as any}
                  targetDistrict={hoveredDistrict}
                  onMarkerClick={(id) => router.push(`/listings/${id}`)}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 5 — BĐS DÀNH CHO BẠN (Nền trung tính dịu mắt #F8FAFC, chuyển tiếp mượt mà từ Map Navy)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="roadmap" className="bg-slate-50/70 py-10 sm:py-12 lg:py-14 border-b border-slate-200/80 text-slate-900 relative overflow-hidden scroll-mt-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-orange-600 font-extrabold text-xs tracking-wider uppercase bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200/80 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                <span>GỢI Ý THÔNG MINH</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0a1128] mt-2 tracking-tight leading-tight">
                Bất động sản phù hợp với bạn
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Được AI tính toán dựa trên tiềm năng đầu tư, vị trí và pháp lý an toàn
              </p>
            </div>

            {/* Filter Pills + Header Navigation Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: '✨ Tất cả gợi ý' },
                  { id: 'price-3-5', label: '💰 Giá 3 - 5 tỷ' },
                  { id: 'dongda', label: '📍 Đống Đa' },
                  { id: 'metro', label: '🚆 Gần tuyến Metro' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setPersonalFilter(pill.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shrink-0 transition-all cursor-pointer ${personalFilter === pill.id
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 hover:text-slate-900'
                      }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Header Carousel Controls for Section 5 */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => scrollPersonalized('left')}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-300 shadow-sm transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                  aria-label="Cuộn trái"
                  title="Xem tin trước"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollPersonalized('right')}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-300 shadow-sm transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                  aria-label="Cuộn phải"
                  title="Xem tin tiếp theo"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 1 Row Carousel of Cards */}
          <div className="relative group/personalized">
            {/* Carousel Track: Tỷ lệ thẻ tạo partial preview 35% có chủ đích, không tràn container */}
            <div
              ref={personalizedScrollRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto py-2 sm:py-3 snap-x snap-mandatory scrollbar-none scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {personalizedListings.slice(0, 10).map((listing) => {
                const isSaved = savedListingIds?.includes(listing.id);
                const cardPricePerM2 = formatPricePerM2(listing.price, listing.area);
                const formattedPrice = formatCurrencyVND(listing.price);
                const firstImage =
                  listing.images?.[0] ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={listing.id}
                    className="w-[275px] sm:w-[295px] md:w-[315px] lg:w-[335px] xl:w-[345px] shrink-0 snap-start"
                  >
                    <div
                      onClick={() => handleOpenDetailModal(listing)}
                      className="group/card relative flex flex-col h-[405px] sm:h-[420px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-sm hover:shadow-2xl hover:shadow-orange-500/15 hover:border-orange-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer select-none"
                      title="Nhấp để xem nội dung chi tiết bài đăng"
                    >
                      {/* Thumbnail Image Container: Aspect 16/10 đồng bộ */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={firstImage}
                          alt={listing.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-108"
                        />

                        {/* Badges (Top-left): Featured & Planning Zone */}
                        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5 items-center">
                          {listing.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-2 py-0.5 text-[10px] font-black text-white shadow-md border border-white/20">
                              <span className="text-yellow-200 text-xs">★</span> Nổi bật
                            </span>
                          )}
                          {listing.planningZone && (
                            <span className="inline-flex items-center rounded-lg bg-slate-900/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-md border border-white/20">
                              {listing.planningZone}
                            </span>
                          )}
                        </div>

                        {/* Wishlist Heart Button (Top-right) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveListing(listing.id);
                          }}
                          className="absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-all hover:scale-115 hover:bg-white"
                          title={isSaved ? 'Bỏ lưu tin' : 'Lưu tin yêu thích'}
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'
                              }`}
                          />
                        </button>

                        {/* Price Tag Overlay (Bottom-left) */}
                        <div className="absolute bottom-2.5 left-2.5 z-20 rounded-xl bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-xs font-black text-white shadow-md border border-white/15">
                          <span className="text-white font-black text-xs tracking-tight">
                            {formattedPrice}
                          </span>
                          <span className="ml-1 text-[10px] font-medium text-slate-300">
                            ({cardPricePerM2})
                          </span>
                        </div>

                        {/* Quick view hover pill (Bottom-right) */}
                        <div className="absolute bottom-2.5 right-2.5 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-200 translate-y-1 group-hover/card:translate-y-0">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500 text-white text-[11px] font-bold px-2 py-1 shadow-md">
                            <Eye className="h-3 w-3" />
                            <span>Xem chi tiết</span>
                          </span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="flex flex-1 flex-col p-3.5 justify-between bg-white">
                        {/* Title: Cố định 2 dòng, line-clamp-2, không làm xô lệch chiều cao */}
                        <div className="h-10 sm:h-11 flex items-start mb-1.5">
                          <Link
                            href={`/listings/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="line-clamp-2 text-xs sm:text-[13px] font-extrabold leading-snug text-slate-800 transition-colors hover:text-orange-600 block cursor-pointer"
                            title={listing.title}
                          >
                            {listing.title}
                          </Link>
                        </div>

                        {/* Location — Secondary Information (text-slate-600) */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2.5 h-4 truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                          <span className="truncate font-medium">
                            {listing.ward ? `${listing.ward}, ` : ''}Quận {listing.district}, Hà Nội
                          </span>
                        </div>

                        {/* Specs Row — Metadata (text-slate-500 / 600, nhẹ hơn Title & Location) */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 mb-2.5 h-7">
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Maximize2 className="h-3 w-3 text-slate-400" />
                            <span className="font-semibold text-slate-600 text-[11px]">{listing.area} m²</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Building className="h-3 w-3 text-slate-400" />
                            <span className="font-medium text-slate-500 text-[11px]">{listing.floors > 0 ? `${listing.floors} tầng` : 'Nhà đẹp'}</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Bed className="h-3 w-3 text-slate-400" />
                            <span className="font-medium text-slate-500 text-[11px]">{listing.bedrooms || 2} PN</span>
                          </div>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                            <Bath className="h-3 w-3 text-slate-400" />
                            <span className="font-medium text-slate-500 text-[11px]">{listing.bathrooms || 1} PT</span>
                          </div>
                        </div>

                        {/* Action buttons CTA: Cùng một baseline */}
                        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetailModal(listing);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Xem chi tiết</span>
                          </button>
                          <Link
                            href={`/listings/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition-colors shrink-0"
                            title="Mở toàn bộ trang chi tiết riêng"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Side Floating Left Arrow Button: Nằm trong container (left-1 sm:left-2), căn trên ảnh (top-[95px]), không che nội dung */}
            <button
              type="button"
              onClick={() => scrollPersonalized('left')}
              className="hidden md:flex absolute left-1 sm:left-2 top-[95px] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer"
              title="Trượt sang trái"
              aria-label="Trượt sang trái"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Side Floating Right Arrow Button: Nằm trong container (right-1 sm:right-2), căn trên ảnh (top-[95px]), không che nội dung */}
            <button
              type="button"
              onClick={() => scrollPersonalized('right')}
              className="hidden md:flex absolute right-1 sm:right-2 top-[95px] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer"
              title="Xem tiếp các gợi ý"
              aria-label="Xem tiếp"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Xem chi tiết bài đăng — Gợi ý thông minh */}
          <AnimatePresence>
            {selectedListingDetail && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCloseDetailModal}
                  className="fixed inset-0 bg-navy/80 backdrop-blur-md transition-opacity"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-black">
                        <Sparkles className="h-3.5 w-3.5" />
                        GỢI Ý PHÙ HỢP VỚI BẠN
                      </span>
                      {selectedListingDetail.planningZone && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-bold">
                          {selectedListingDetail.planningZone}
                        </span>
                      )}
                      {selectedListingDetail.legalStatus && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          {selectedListingDetail.legalStatus}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseDetailModal}
                      className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                      title="Đóng cửa sổ"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Scrollable Body */}
                  <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {/* Title & Price Header */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-navy leading-snug">
                        {selectedListingDetail.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-2">
                        <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>{selectedListingDetail.address || `${selectedListingDetail.district}, Hà Nội`}</span>
                      </div>
                    </div>

                    {/* Photos Gallery */}
                    <div className="space-y-2.5">
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                        <img
                          src={
                            selectedListingDetail.images?.[modalActiveImageIdx] ||
                            selectedListingDetail.images?.[0] ||
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
                          }
                          alt={selectedListingDetail.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white font-black text-sm sm:text-base border border-white/20">
                          {formatCurrencyVND(selectedListingDetail.price)}
                          <span className="text-xs font-semibold text-amber-300 ml-2">
                            ({formatPricePerM2(selectedListingDetail.price, selectedListingDetail.area)})
                          </span>
                        </div>
                      </div>

                      {/* Thumbnails */}
                      {selectedListingDetail.images && selectedListingDetail.images.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {selectedListingDetail.images.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setModalActiveImageIdx(idx)}
                              className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${modalActiveImageIdx === idx
                                  ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105'
                                  : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                            >
                              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Key Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[11px] text-slate-500 font-medium block">Diện tích</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">{selectedListingDetail.area} m²</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[11px] text-slate-500 font-medium block">Số tầng</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">{selectedListingDetail.floors || 1} tầng</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[11px] text-slate-500 font-medium block">Phòng ngủ</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">{selectedListingDetail.bedrooms || 0} PN</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[11px] text-slate-500 font-medium block">Phòng tắm</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">{selectedListingDetail.bathrooms || 0} PT</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[11px] text-slate-500 font-medium block">Hướng nhà</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block">{selectedListingDetail.direction || 'Đông Nam'}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[11px] text-slate-500 font-medium block">Pháp lý</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5 block truncate" title={selectedListingDetail.legalStatus}>{selectedListingDetail.legalStatus || 'Sổ đỏ'}</span>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <h4 className="text-sm font-black text-navy flex items-center gap-2">
                        <span>📝</span>
                        <span>Mô tả chi tiết bài đăng</span>
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 pr-2">
                        {selectedListingDetail.description || 'Chưa có mô tả chi tiết cho bất động sản này.'}
                      </div>
                    </div>

                    {/* Seller Contact & AI evaluation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Seller info */}
                      <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user && (selectedListingDetail.userId === user.id || selectedListingDetail.authorEmail === user.email)
                                ? user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                                : selectedListingDetail.authorAvatar || selectedListingDetail.users?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                            }
                            alt="Seller"
                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-400"
                          />
                          <div>
                            <span className="text-[11px] font-bold text-orange-600 uppercase block">Người đăng / Liên hệ</span>
                            <h5 className="font-extrabold text-sm text-navy">
                              {user && (selectedListingDetail.userId === user.id || selectedListingDetail.authorEmail === user.email)
                                ? user.name || 'Người bán'
                                : selectedListingDetail.authorName || selectedListingDetail.users?.full_name || 'HaNoi Realty Partner'}
                            </h5>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">
                              {user && (selectedListingDetail.userId === user.id || selectedListingDetail.authorEmail === user.email)
                                ? user.phone || '0988 123 456'
                                : selectedListingDetail.authorPhone || selectedListingDetail.users?.phone || '0988 123 456'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${user && (selectedListingDetail.userId === user.id || selectedListingDetail.authorEmail === user.email)
                                ? user.phone || '0988123456'
                                : selectedListingDetail.authorPhone || selectedListingDetail.users?.phone || '0988123456'
                              }`}
                            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            <span>Gọi ngay</span>
                          </a>
                        </div>
                      </div>

                      {/* AI Insight */}
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
                          <Sparkles className="h-4 w-4" />
                          <span>Đánh giá tiềm năng Gemini AI</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Thuộc phân khu <span className="font-bold text-slate-800">{selectedListingDetail.planningZone}</span>, vị trí trung tâm quận {selectedListingDetail.district}, pháp lý chuẩn chỉnh và tiềm năng sinh lời bền vững.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="px-5 sm:px-7 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleCloseDetailModal}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      Đóng
                    </button>

                    <Link
                      href={`/listings/${selectedListingDetail.id}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                          return;
                        }
                        e.preventDefault();
                        const targetId = selectedListingDetail.id;
                        router.push(`/listings/${targetId}`);
                        handleCloseDetailModal();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>Xem toàn bộ trang chi tiết</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
          📌 SECTION 6 — TIN TỨC & PHÂN TÍCH THỊ TRƯỜNG (Nền trắng thanh lịch, trải nghiệm đọc tin chuyên nghiệp)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="market-updates" className="bg-white py-12 sm:py-16 lg:py-20 border-b border-slate-200/80 text-slate-900 relative overflow-hidden scroll-mt-0">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-orange-600 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase block mb-1">
                TIN TỨC & KIẾN THỨC
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0a1128] leading-tight tracking-tight">
                Cập nhật thị trường BĐS Hà Nội
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Phân tích chuyên sâu từ đội ngũ chuyên gia quy hoạch và định giá
              </p>
            </div>
            <Link
              href="/news"
              className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1.5 transition-colors shrink-0 group"
            >
              <span>Xem tất cả tin tức</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* News Layout: 1 Big Top + 3 Small Bottom */}
          <div className="flex flex-col gap-3 lg:gap-4">

            {/* Big Featured Article (Top 100%) */}
            <div className="w-full flex flex-col">
              <Link
                href="/streets"
                className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl hover:shadow-orange-500/10 hover:border-orange-400 transition-all duration-300 sm:h-[180px] lg:h-[200px]"
              >
                <div className="relative w-full sm:w-5/12 h-[140px] sm:h-full overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80"
                    alt="Metro line Hanoi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-orange-500 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md">
                    🔥 Nổi bật tuần
                  </span>
                  <span className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                    22/08/2025
                  </span>
                </div>

                <div className="p-4 sm:p-5 lg:p-6 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-center">
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="text-sm sm:text-base lg:text-lg font-black text-[#0a1128] group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                      Thị trường BĐS Hà Nội Q4/2025: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức khởi công
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 line-clamp-2 leading-relaxed">
                      Sự kết nối giữa các trục giao thông hướng tâm và đường vành đai đang tạo lực đẩy mạnh mẽ cho phân khúc nhà phố trung tâm và ven đô.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 text-[10px] sm:text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-500/20 text-orange-600 font-bold flex items-center justify-center text-[10px] sm:text-xs">
                        HR
                      </div>
                      <span className="font-semibold text-slate-700">Ban biên tập HaNoi Realty</span>
                    </div>
                    <span>8 phút đọc</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* 3 Small Articles (Bottom) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
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
              ].map((article, idx) => (
                <Link
                  key={idx}
                  href="/streets"
                  className="group bg-white rounded-2xl p-2 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-orange-400 transition-all flex flex-col justify-between"
                >
                  <div className="h-[65px] sm:h-[80px] rounded-xl overflow-hidden mb-1.5 bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      {article.category}
                    </span>
                    <h4 className="font-bold text-[10px] sm:text-xs text-[#0a1128] group-hover:text-orange-600 transition-colors line-clamp-2 mt-1 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{article.date}</p>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* Market Mini Dashboard Row */}
          <div className="mt-2 sm:mt-3 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-2xl">
            <h4 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>Chỉ số thị trường tuần này</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="p-2">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Giá TB Đống Đa</p>
                <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">85 tr/m²</p>
                <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +2.3% so tháng trước</span>
              </div>
              <div className="p-2 sm:pl-6">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Giá TB Cầu Giấy</p>
                <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">65 tr/m²</p>
                <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +1.8% so tháng trước</span>
              </div>
              <div className="p-2 sm:pl-6">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Tin đăng mới hôm nay</p>
                <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">127 tin</p>
                <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +34 so hôm qua</span>
              </div>
              <div className="p-2 sm:pl-6">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Giao dịch tháng này</p>
                <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">89 căn</p>
                <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +12% hoàn thành</span>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 8 — ĐÁNH GIÁ KHÁCH HÀNG (Điểm nhấn Navy Social Proof ấm áp)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="reviews"
        onMouseEnter={() => setIsReviewPaused(true)}
        onMouseLeave={() => setIsReviewPaused(false)}
        className="relative bg-gradient-to-r from-[#060a22] via-[#0d1645] to-[#121c5b] text-white py-14 sm:py-18 lg:py-22 overflow-hidden flex flex-col justify-center items-center select-none border-b border-slate-800"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[350px] bg-blue-500/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

          {/* Header chuẩn Hình 1 */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-orange-400 font-extrabold text-xs uppercase tracking-wider block mb-2">
              ⭐ ĐÁNH GIÁ TỪ NGƯỜI DÙNG
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Khách hàng nói gì về HaNoi Realty?
            </h2>
          </div>

          {/* Overall Rating Card chuẩn Hình 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl mx-auto mb-10 sm:mb-12 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-[#0a1128]">
            <div className="text-center sm:text-left shrink-0">
              <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <span className="text-5xl font-black text-[#0a1128] tracking-tight">4.8</span>
                <span className="text-lg text-slate-400 font-bold">/ 5.0</span>
              </div>
              <div className="flex text-amber-400 text-lg my-1.5 justify-center sm:justify-start tracking-wider">
                ★★★★★
              </div>
              <p className="text-xs text-slate-500 font-medium">Dựa trên 1,247 đánh giá đã kiểm thực</p>
            </div>

            {/* Bars */}
            <div className="space-y-1.5 w-full sm:w-64 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-500 font-medium">5★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[82%]" />
                </div>
                <span className="w-8 text-right font-bold text-slate-700">82%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-500 font-medium">4★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[12%]" />
                </div>
                <span className="w-8 text-right font-bold text-slate-700">12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-500 font-medium">3★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[4%]" />
                </div>
                <span className="w-8 text-right font-bold text-slate-700">4%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-500 font-medium">2★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[1%]" />
                </div>
                <span className="w-8 text-right font-bold text-slate-700">1%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-500 font-medium">1★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[1%]" />
                </div>
                <span className="w-8 text-right font-bold text-slate-700">1%</span>
              </div>
            </div>
          </div>

          {/* Testimonial Quote Slider */}
          <div className="relative w-full min-h-[190px] sm:min-h-[160px] md:min-h-[140px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={reviewDirection}>
              <motion.div
                key={activeReviewIdx}
                custom={reviewDirection}
                variants={{
                  enter: (dir: number) => ({
                    x: dir > 0 ? 80 : -80,
                    opacity: 0,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                  },
                  exit: (dir: number) => ({
                    x: dir > 0 ? -80 : 80,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col items-center text-center"
              >
                {/* Big Bold White Quote with Smart Quotes */}
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-white leading-snug sm:leading-tight tracking-tight max-w-4xl mx-auto px-2">
                  “{reviews[activeReviewIdx].content}”
                </h3>

                {/* Author Info matching Image 1: [K] Katrina · Chief of Staff */}
                <div className="flex items-center justify-center gap-2.5 mt-8 sm:mt-10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 overflow-hidden">
                    {reviews[activeReviewIdx].avatar ? (
                      <img src={reviews[activeReviewIdx].avatar} alt={reviews[activeReviewIdx].name} className="w-full h-full object-cover" />
                    ) : (
                      reviews[activeReviewIdx].name[0]
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="text-white font-medium">{reviews[activeReviewIdx].name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400">{reviews[activeReviewIdx].role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Navigation Dots matching Image 1 */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToReview(idx)}
                aria-label={`Chuyển đến đánh giá ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${activeReviewIdx === idx
                    ? 'w-2 h-2 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)] ring-2 ring-blue-500/30'
                    : 'w-1.5 h-1.5 bg-slate-600/70 hover:bg-slate-400'
                  }`}
              />
            ))}
          </div>

        </div>

        {/* Floating Subtle Arrows for Desktop */}
        <button
          type="button"
          onClick={prevReview}
          aria-label="Đánh giá trước"
          className="hidden md:flex absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={nextReview}
          aria-label="Đánh giá tiếp theo"
          className="hidden md:flex absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 9 — ĐỐI TÁC & THƯƠNG HIỆU (Marquee — Nền trung tính dịu mắt)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-slate-50/70 py-12 sm:py-14 overflow-hidden border-b border-slate-200/80">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7 text-center">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
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
              className="w-40 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center font-bold text-xs text-slate-600 hover:text-orange-600 hover:bg-orange-50/40 hover:border-orange-300 transition-all shadow-xs cursor-pointer"
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
              className="w-40 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center font-bold text-xs text-slate-600 hover:text-orange-600 hover:bg-orange-50/40 hover:border-orange-300 transition-all shadow-xs cursor-pointer"
            >
              {brand}
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="container max-w-5xl mx-auto px-4 mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600">
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
          📌 SECTION 10 — ĐĂNG TIN FINAL CTA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="cta-dang-tin"
        className="bg-slate-50 py-12 sm:py-16 lg:py-20 border-t border-slate-200/80 relative"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1636] via-[#0a1128] to-[#070d1e] border border-slate-800/90 shadow-2xl overflow-hidden p-8 sm:p-10 lg:p-14">

            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">

              {/* Left Column: Heading & Value Proposition */}
              <div className="space-y-3.5 max-w-2xl text-left">
                <span className="inline-flex items-center gap-1.5 text-orange-400 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>DÀNH CHO CHỦ NHÀ & MÔI GIỚI</span>
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                  Bạn muốn đăng tin bán hoặc cho thuê nhà?
                </h2>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                  Tiếp cận hàng nghìn khách mua tiềm năng mỗi ngày. Đăng tin miễn phí, định vị toạ độ chính xác trên bản đồ.
                </p>

                {/* Trust / Benefit Checkpoints */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs sm:text-sm font-medium text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Miễn phí không cần thẻ
                  </span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Hiển thị ngay trên bản đồ GIS
                  </span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Tự động thẩm định AI
                  </span>
                </div>
              </div>

              {/* Right Column: CTA Buttons Hierarchy */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3.5 w-full lg:w-auto shrink-0">
                {/* Primary CTA - Bold Orange */}
                <Link
                  href="/listings/create"
                  className="h-12 sm:h-13 px-6 sm:px-8 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-sm sm:text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all text-center whitespace-nowrap group cursor-pointer"
                >
                  <span>Đăng tin ngay — Miễn phí</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* Secondary CTA - Elegant Muted Slate */}
                <Link
                  href="/pricing"
                  className="h-12 sm:h-13 px-6 sm:px-7 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white active:scale-[0.98] font-bold text-sm sm:text-[15px] flex items-center justify-center gap-2 transition-all text-center whitespace-nowrap cursor-pointer"
                >
                  <span>Xem các gói Pro</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 FOOTER (Full width — Professional PropTech Theme)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-[#0a0f1e] text-slate-400 text-xs py-16 sm:py-20 lg:py-24 border-t border-slate-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12">

            {/* Col 1 — Brand (lg:col-span-4 xl:col-span-3) */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-2.5 group">
                  <div className="h-9 w-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                    🏠
                  </div>
                  <span className="text-xl font-black text-white tracking-tight">
                    HaNoi <span className="text-orange-500">Realty</span>
                  </span>
                </Link>

                <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed mt-4 max-w-[280px] sm:max-w-xs font-normal">
                  Nền tảng BĐS thông minh nhất Hà Nội. Tiên phong ứng dụng dữ liệu quy hoạch và định giá AI.
                </p>
              </div>

              {/* Social Icons */}
              <div className="mt-6 pt-2">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Mạng xã hội
                </span>
                <div className="flex items-center gap-2">
                  {['Facebook', 'YouTube', 'TikTok', 'LinkedIn'].map((social) => (
                    <div
                      key={social}
                      className="w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-orange-500 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                      title={social}
                    >
                      {social[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 2 — Sản phẩm & hệ thống (lg:col-span-3 xl:col-span-3) */}
            <div className="lg:col-span-3 xl:col-span-3">
              <h4 className="text-[13px] font-black text-white uppercase tracking-wider">
                Sản phẩm & Hệ thống
              </h4>
              <ul className="mt-4 sm:mt-5 space-y-3 text-xs sm:text-[13px]">
                <li>
                  <Link href="/search" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Tìm kiếm BĐS
                  </Link>
                </li>
                <li>
                  <Link href="/planning" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Bản đồ quy hoạch
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Báo cáo AI
                  </Link>
                </li>
                <li>
                  <Link href="/listings/create" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Đăng tin BĐS
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Gói thành viên
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-orange-400 hover:text-orange-300 font-bold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    🛡️ Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3 — Công ty (lg:col-span-2 xl:col-span-2) */}
            <div className="lg:col-span-2 xl:col-span-2">
              <h4 className="text-[13px] font-black text-white uppercase tracking-wider">
                Công ty
              </h4>
              <ul className="mt-4 sm:mt-5 space-y-3 text-xs sm:text-[13px]">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/about#team" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Đội ngũ
                  </Link>
                </li>
                <li>
                  <Link href="/about#careers" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Blog & Tin tức
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4 — Liên hệ (lg:col-span-3 xl:col-span-4) */}
            <div className="lg:col-span-3 xl:col-span-4">
              <h4 className="text-[13px] font-black text-white uppercase tracking-wider">
                Liên hệ
              </h4>
              <div className="mt-4 sm:mt-5 space-y-3.5 text-xs sm:text-[13px]">
                {/* Email Item */}
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0 text-orange-400 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-colors mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                      Email hỗ trợ
                    </span>
                    <a
                      href="mailto:support@hanoirealty.vn"
                      className="text-slate-200 hover:text-orange-400 font-semibold transition-colors break-all"
                    >
                      support@hanoirealty.vn
                    </a>
                  </div>
                </div>

                {/* Hotline Item */}
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                      Hotline tư vấn
                    </span>
                    <a
                      href="tel:18006868"
                      className="font-mono font-extrabold text-orange-400 hover:text-orange-300 text-sm sm:text-base tracking-tight transition-colors inline-block"
                    >
                      1800 6868 <span className="text-[11px] font-normal text-slate-400">(miễn phí)</span>
                    </a>
                  </div>
                </div>

                {/* Address Item */}
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0 text-orange-400 group-hover:border-orange-500/50 transition-colors mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                      Trụ sở văn phòng
                    </span>
                    <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                      Tầng 12, Tòa nhà Handico, Phạm Hùng, Nam Từ Liêm, Hà Nội
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>T2 - T6: 8:00 - 18:00 &nbsp;|&nbsp; T7: 8:00 - 12:00</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-14 sm:mt-16 lg:mt-20 pt-8 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2025 HaNoi Realty. Bảo lưu mọi quyền.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Link href="/about" className="hover:text-slate-300 transition-colors">
                Chính sách bảo mật
              </Link>
              <span className="text-slate-700">·</span>
              <Link href="/about" className="hover:text-slate-300 transition-colors">
                Điều khoản sử dụng
              </Link>
              <span className="text-slate-700">·</span>
              <Link href="/about" className="hover:text-slate-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
