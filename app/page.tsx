'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ListingCard } from '@/components/listing/ListingCard';
import { mockListings, ListingItem } from '@/lib/mock-data';
import { useCountUp } from '@/lib/hooks/useScrollAnimation';
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
  Smartphone,
  Compass,
  DollarSign,
  Briefcase
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

// Stats Counter item
function HeroCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 1500);
  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center px-4 py-2">
      <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-white/70 text-[11px] sm:text-xs font-medium mt-0.5">
        {label}
      </span>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  // ── Section 1: Hero Search States ──
  const [searchTab, setSearchTab] = useState<'buy' | 'rent' | 'project' | 'estimate'>('buy');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [priceDropdownOpen, setPriceDropdownOpen] = useState<boolean>(false);
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [areaRange, setAreaRange] = useState<string>('all');
  const [areaDropdownOpen, setAreaDropdownOpen] = useState<boolean>(false);

  // Close dropdowns on outside click
  const searchBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setTypeDropdownOpen(false);
        setLocationDropdownOpen(false);
        setPriceDropdownOpen(false);
        setAreaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Types list ──
  const propertyTypes = [
    { value: 'all', label: 'Tất cả loại BĐS', icon: '🏠' },
    { value: 'house', label: 'Nhà phố / Nhà riêng', icon: '🏠' },
    { value: 'apartment', label: 'Chung cư / Căn hộ', icon: '🏢' },
    { value: 'land', label: 'Đất nền / Trang trại', icon: '🌿' },
    { value: 'villa', label: 'Biệt thự / Villa', icon: '🏰' },
    { value: 'commercial', label: 'Văn phòng / Thương mại', icon: '🏪' },
  ];

  // ── Popular Districts ──
  const popularDistricts = [
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

  // Filtered districts for autocomplete
  const filteredDistricts = useMemo(() => {
    if (!locationQuery.trim()) return popularDistricts;
    return popularDistricts.filter((d) =>
      d.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [locationQuery]);

  // Price presets
  const pricePresets = [
    { label: 'Tất cả mức giá', value: 'all' },
    { label: 'Dưới 1 tỷ', value: '0-1' },
    { label: '1 - 3 tỷ', value: '1-3' },
    { label: '3 - 5 tỷ', value: '3-5' },
    { label: '5 - 10 tỷ', value: '5-10' },
    { label: '10 - 20 tỷ', value: '10-20' },
    { label: 'Trên 20 tỷ', value: '20-999' },
  ];

  // Area presets
  const areaPresets = [
    { label: 'Tất cả diện tích', value: 'all' },
    { label: 'Dưới 30m²', value: '0-30' },
    { label: '30 - 50m²', value: '30-50' },
    { label: '50 - 80m²', value: '50-80' },
    { label: '80 - 100m²', value: '80-100' },
    { label: '100 - 150m²', value: '100-150' },
    { label: 'Trên 150m²', value: '150-9999' },
  ];

  // Execute Search Navigation
  const handleExecuteSearch = () => {
    const params = new URLSearchParams();
    if (selectedType !== 'all') params.set('type', selectedType);
    if (locationQuery.trim()) params.set('district', locationQuery.trim());
    if (searchTab === 'rent') params.set('purpose', 'rent');
    if (searchTab === 'project') params.set('type', 'project');

    if (customMinPrice) {
      params.set('minPrice', (Number(customMinPrice) * 1e9).toString());
    } else if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-');
      if (min && min !== '0') params.set('minPrice', (Number(min) * 1e9).toString());
      if (max && max !== '999') params.set('maxPrice', (Number(max) * 1e9).toString());
    }

    if (customMaxPrice) {
      params.set('maxPrice', (Number(customMaxPrice) * 1e9).toString());
    }

    if (areaRange !== 'all') {
      const [minA, maxA] = areaRange.split('-');
      if (minA && minA !== '0') params.set('minArea', minA);
      if (maxA && maxA !== '9999') params.set('maxArea', maxA);
    }

    router.push(`/search?${params.toString()}`);
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

  // ── Section 7: Projects Carousel ──
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const scrollProjects = (direction: 'left' | 'right') => {
    if (projectsScrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      projectsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const mockProjects = [
    {
      id: 'p1',
      name: 'Vinhomes Smart City Tây Mỗ',
      location: 'Nam Từ Liêm, Hà Nội',
      type: 'Chung cư cao cấp & Shophouse',
      area: '45 - 120m²',
      price: 'Từ 3.2 tỷ',
      status: '🔥 Đang mở bán',
      developer: 'Vingroup',
      soldPercent: 78,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      name: 'The Zei Mỹ Đình',
      location: 'Lê Đức Thọ, Nam Từ Liêm',
      type: 'Căn hộ Hạng A & Penthouse',
      area: '84 - 265m²',
      price: 'Từ 5.8 tỷ',
      status: '⏰ Sắp ra mắt',
      developer: 'HD Mon Holdings',
      soldPercent: 45,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p3',
      name: 'Ecopark Grand The Island',
      location: 'Văn Giang, Giáp Gia Lâm',
      type: 'Biệt thự đảo sinh thái',
      area: '270 - 1000m²',
      price: 'Từ 28 tỷ',
      status: '🔥 Đang mở bán',
      developer: 'Ecopark Group',
      soldPercent: 92,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p4',
      name: 'Sunshine City Ciputra',
      location: 'KĐT Ciputra, Tây Hồ',
      type: 'Căn hộ dát vàng & Sky Villa',
      area: '77 - 142m²',
      price: 'Từ 4.6 tỷ',
      status: '🔥 Đang mở bán',
      developer: 'Sunshine Group',
      soldPercent: 85,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p5',
      name: 'The Manor Central Park',
      location: 'Nguyễn Xiển, Hoàng Mai',
      type: 'Nhà phố thương mại & Liền kề',
      area: '99 - 220m²',
      price: 'Từ 18.5 tỷ',
      status: '⏰ Sắp ra mắt',
      developer: 'Bitexco Group',
      soldPercent: 60,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'p6',
      name: 'Vinhomes Times City',
      location: 'Minh Khai, Hai Bà Trưng',
      type: 'Tổ hợp Căn hộ & TTTM',
      area: '53 - 160m²',
      price: 'Từ 3.9 tỷ',
      status: '🏠 Đang bàn giao',
      developer: 'Vingroup',
      soldPercent: 98,
      image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&auto=format&fit=crop&q=80',
    },
  ];

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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 1 — HERO SEARCH (Phong cách batdongsan.com.vn)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-[82vh] flex flex-col justify-between items-center overflow-hidden bg-[#0a0f1e] text-white pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Hanoi Skyline Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&auto=format&fit=crop&q=80')`,
          }}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#1a2744]/90 to-[#1a2744] pointer-events-none" />

        {/* Animated Floating Glow Orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-12 w-80 h-80 rounded-full bg-orange-500/15 blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 right-12 w-96 h-96 rounded-full bg-blue-500/15 blur-[130px] pointer-events-none"
        />

        {/* Center Search Container */}
        <div className="max-w-5xl w-full mx-auto text-center relative z-10 my-auto py-6">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 border border-orange-500/40 bg-orange-500/20 text-orange-300 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-orange-500/10 mb-4"
          >
            <span>🏆</span>
            <span>Nền tảng BĐS thông minh #1 Hà Nội</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-1"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Tìm ngôi nhà mơ ước
            </h1>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent leading-tight">
              tại Hà Nội
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70 text-sm sm:text-base md:text-lg mt-3 mb-6 max-w-2xl mx-auto font-normal"
          >
            Hơn 10,000+ tin đăng · Dữ liệu quy hoạch thực · Phân tích AI chuyên sâu
          </motion.p>

          {/* ━━ TAB ROW (Mua / Thuê / Dự án / Định giá) ━━ */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-3 text-sm font-bold">
            {[
              { key: 'buy', label: '🏠 Mua bán' },
              { key: 'rent', label: '🔑 Cho thuê' },
              { key: 'project', label: '🏗️ Dự án' },
              { key: 'estimate', label: '💰 Định giá AI' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSearchTab(tab.key as any)}
                className={`relative pb-2 transition-all ${
                  searchTab === tab.key
                    ? 'text-white font-extrabold'
                    : 'text-white/60 hover:text-white/90 font-medium'
                }`}
              >
                <span>{tab.label}</span>
                {searchTab === tab.key && (
                  <motion.div
                    layoutId="searchTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-orange-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* ━━ MAIN SEARCH BOX COMPONENT ━━ */}
          <div ref={searchBoxRef} className="relative z-30">
            <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 text-slate-800 border border-white/20">
              
              {/* SEGMENT 1: Loại BĐS */}
              <div className="relative md:w-44 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTypeDropdownOpen(!typeDropdownOpen);
                    setLocationDropdownOpen(false);
                    setPriceDropdownOpen(false);
                    setAreaDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-bold"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="truncate">
                      {propertyTypes.find((t) => t.value === selectedType)?.label || 'Loại BĐS'}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Types */}
                <AnimatePresence>
                  {typeDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 z-50 text-left"
                    >
                      {propertyTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setSelectedType(type.value);
                            setTypeDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                            selectedType === type.value
                              ? 'bg-orange-50 text-orange-600 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="text-base">{type.icon}</span>
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block w-px h-8 bg-slate-200" />

              {/* SEGMENT 2: Vị trí & Autocomplete */}
              <div className="relative flex-1">
                <div className="flex items-center gap-2 px-3 py-1">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setLocationDropdownOpen(true);
                    }}
                    onFocus={() => setLocationDropdownOpen(true)}
                    placeholder="Nhập tên đường, quận, phường Hà Nội..."
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400 py-1.5"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                  {locationDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white p-3 shadow-2xl border border-slate-100 z-50 text-left max-h-72 overflow-y-auto"
                    >
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                        Khu vực phổ biến
                      </p>
                      <div className="space-y-1">
                        {filteredDistricts.map((district) => (
                          <button
                            key={district.name}
                            type="button"
                            onClick={() => {
                              setLocationQuery(district.name);
                              setLocationDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-colors text-xs"
                          >
                            <span className="font-semibold flex items-center gap-2">
                              <span>🏙️</span>
                              <span>Quận {district.name}, Hà Nội</span>
                            </span>
                            <span className="text-[11px] text-slate-400">{district.count} tin</span>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 mt-2 pt-2 text-center">
                        <Link
                          href="/search"
                          className="text-xs font-bold text-orange-500 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Xem tất cả kết quả trên bản đồ</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block w-px h-8 bg-slate-200" />

              {/* SEGMENT 3: Khoảng giá */}
              <div className="relative md:w-40 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPriceDropdownOpen(!priceDropdownOpen);
                    setTypeDropdownOpen(false);
                    setLocationDropdownOpen(false);
                    setAreaDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-bold"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-orange-500 font-extrabold text-sm">₫</span>
                    <span className="truncate">
                      {pricePresets.find((p) => p.value === priceRange)?.label || 'Khoảng giá'}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Price Range */}
                <AnimatePresence>
                  {priceDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-72 rounded-xl bg-white p-3 shadow-2xl border border-slate-100 z-50 text-left"
                    >
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Chọn khoảng giá
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {pricePresets.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => {
                              setPriceRange(preset.value);
                              setCustomMinPrice('');
                              setCustomMaxPrice('');
                              setPriceDropdownOpen(false);
                            }}
                            className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                              priceRange === preset.value
                                ? 'bg-orange-500 text-white font-bold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Custom Range Inputs */}
                      <div className="border-t border-slate-100 pt-2 space-y-2">
                        <span className="text-[11px] font-semibold text-slate-500">Hoặc tự nhập (tỷ VNĐ):</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Từ (tỷ)"
                            value={customMinPrice}
                            onChange={(e) => {
                              setCustomMinPrice(e.target.value);
                              setPriceRange('custom');
                            }}
                            className="p-1.5 text-xs border rounded-lg focus:outline-none focus:border-orange-500"
                          />
                          <input
                            type="number"
                            placeholder="Đến (tỷ)"
                            value={customMaxPrice}
                            onChange={(e) => {
                              setCustomMaxPrice(e.target.value);
                              setPriceRange('custom');
                            }}
                            className="p-1.5 text-xs border rounded-lg focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setPriceDropdownOpen(false)}
                          className="w-full py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Áp dụng
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block w-px h-8 bg-slate-200" />

              {/* SEGMENT 4: Diện tích */}
              <div className="relative md:w-36 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAreaDropdownOpen(!areaDropdownOpen);
                    setTypeDropdownOpen(false);
                    setLocationDropdownOpen(false);
                    setPriceDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-bold"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Compass className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="truncate">
                      {areaPresets.find((a) => a.value === areaRange)?.label || 'Diện tích'}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Area */}
                <AnimatePresence>
                  {areaDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 z-50 text-left"
                    >
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">
                        Diện tích
                      </p>
                      {areaPresets.map((area) => (
                        <button
                          key={area.value}
                          type="button"
                          onClick={() => {
                            setAreaRange(area.value);
                            setAreaDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            areaRange === area.value
                              ? 'bg-orange-50 text-orange-600 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {area.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SEARCH BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleExecuteSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all text-sm shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>Tìm kiếm</span>
              </motion.button>

            </div>
          </div>

          {/* Quick Search Preset Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs font-medium text-white/80"
          >
            <span className="text-white/60">Tìm kiếm phổ biến:</span>
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
                className="bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-xs transition-all"
              >
                {tag.label}
              </Link>
            ))}
          </motion.div>

        </div>

        {/* BOTTOM STATS BAR */}
        <div className="w-full max-w-6xl mx-auto rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 py-3 px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <HeroCounter value={10247} suffix="+" label="Tin đăng đang hoạt động" />
            <HeroCounter value={5832} suffix="+" label="Người dùng tháng này" />
            <HeroCounter value={98} suffix="%" label="Tỷ lệ hài lòng" />
            <HeroCounter value={29} suffix="" label="Quận/huyện có dữ liệu" />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 2 — DANH MỤC NHANH (Quick Property Types)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-orange-500 font-extrabold text-xs tracking-wider uppercase">
                KHÁM PHÁ THEO NHU CẦU
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-navy">
                Danh mục bất động sản Hà Nội
              </h2>
            </div>
            <Link
              href="/search"
              className="text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 inline-flex items-center gap-1"
            >
              <span>Xem tất cả loại BĐS</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link
                  href={cat.href}
                  className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-orange-300 hover:bg-orange-50/20 hover:shadow-md transition-all group h-full"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-navy group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">{cat.count}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 3 — BẤT ĐỘNG SẢN NỔI BẬT (Carousel)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-slate-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full mb-1">
                <Flame className="h-3.5 w-3.5 fill-orange-500" />
                <span>HOT · ĐƯỢC XEM NHIỀU NHẤT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy">
                Bất động sản nổi bật tuần này
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Các bất động sản có quy hoạch đẹp, giá tốt và lượt quan tâm cao nhất
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollFeatured('left')}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center shadow-sm transition-all"
                title="Trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollFeatured('right')}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center shadow-sm transition-all"
                title="Sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <Link
                href="/search"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline ml-2"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Carousel container */}
          <div
            ref={featuredScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-200 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredListings.map((listing) => (
              <div
                key={listing.id}
                className="min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start shrink-0"
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 4 — BẢN ĐỒ MINI + BĐS THEO KHU VỰC
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left 45%: District List */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-orange-500 font-extrabold text-xs tracking-wider uppercase">
                  KHÁM PHÁ THEO KHU VỰC
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-navy mt-1">
                  Tìm nhà trên bản đồ Hà Nội
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Rê chuột vào quận để xem nhanh vị trí hoặc nhấp để lọc tin đăng chính xác
                </p>
              </div>

              {/* District Table List */}
              <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-2 divide-y divide-slate-100">
                {popularDistricts.map((d) => (
                  <div
                    key={d.name}
                    onMouseEnter={() => setHoveredDistrict(d.name)}
                    onClick={() => router.push(`/search?district=${encodeURIComponent(d.name)}`)}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all ${
                      hoveredDistrict === d.name
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${hoveredDistrict === d.name ? 'text-white' : 'text-orange-500'}`} />
                      <span className="font-bold text-xs sm:text-sm">Quận {d.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={hoveredDistrict === d.name ? 'text-white/80' : 'text-slate-400'}>
                        {d.count} tin
                      </span>
                      <span className={`font-mono font-bold ${hoveredDistrict === d.name ? 'text-yellow-200' : 'text-orange-600'}`}>
                        {d.avgPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/search?district=${encodeURIComponent(hoveredDistrict)}`}
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Xem tin quận {hoveredDistrict}</span>
                </Link>

                <Link
                  href="/planning"
                  className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="h-4 w-4 text-orange-500" />
                  <span>Xem bản đồ quy hoạch</span>
                </Link>
              </div>
            </div>

            {/* Right 55%: Interactive Mini Leaflet Map */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 h-[420px] relative bg-slate-900">
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
          📌 SECTION 5 — BĐS DÀNH CHO BẠN (Gợi ý cá nhân hoá)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-navy py-20 text-white relative">
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
      <section className="bg-slate-50 py-16">
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
          📌 SECTION 7 — DỰ ÁN NỔI BẬT (Hợp tác)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-orange-500 font-extrabold text-xs tracking-wider uppercase">
                DỰ ÁN HỢP TÁC
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy mt-1">
                Dự án bất động sản nổi bật
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Các dự án chính chủ, pháp lý minh bạch và đang mở bán với chính sách ưu đãi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollProjects('left')}
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center transition-all"
                title="Trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollProjects('right')}
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center transition-all"
                title="Sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Projects Carousel */}
          <div
            ref={projectsScrollRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="min-w-[300px] sm:min-w-[360px] max-w-[360px] snap-start shrink-0 rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-white"
              >
                {/* Hero image area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-orange-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md">
                    {project.status}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-navy font-bold text-[10px] px-2.5 py-1 rounded-lg shadow">
                    {project.developer}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-navy line-clamp-1">{project.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                      <span>{project.location}</span>
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-1 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Loại hình</span>
                      <strong className="text-navy truncate block">Căn hộ</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Diện tích</span>
                      <strong className="text-navy truncate block">{project.area}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mức giá</span>
                      <strong className="text-orange-600 truncate block">{project.price}</strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Tiến độ bán hàng</span>
                      <span className="text-orange-500 font-bold">{project.soldPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000"
                        style={{ width: `${project.soldPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href="tel:18006868"
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:border-orange-500 hover:text-orange-500 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Liên hệ CĐT</span>
                    </a>
                    <Link
                      href="/search?type=project"
                      className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs text-center transition-colors shadow-md shadow-orange-500/20"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
          📌 SECTION 10 — TẢI ỨNG DỤNG MOBILE APP CTA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#0a0f1e] text-white py-20 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 font-extrabold text-xs px-3 py-1 rounded-full border border-orange-500/30">
                <Smartphone className="h-3.5 w-3.5" />
                <span>ỨNG DỤNG DI ĐỘNG</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                HaNoi Realty trên điện thoại của bạn
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Tìm kiếm BĐS, kiểm tra quy hoạch phân khu và nhận thông báo biến động giá tức thì ngay trong tầm tay.
              </p>

              {/* App Features List */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span>Nhận thông báo khi có tin đăng mới đúng bộ lọc của bạn</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span>Tra cứu bản đồ quy hoạch phân khu offline mượt mà</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span>Chat và đặt lịch hẹn xem nhà trực tiếp với môi giới</span>
                </p>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs flex items-center gap-2 shadow-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="text-lg">🍎</span>
                  <div>
                    <span className="text-[10px] text-slate-500 block leading-tight">Tải về trên</span>
                    <span>App Store</span>
                  </div>
                </div>

                <div className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs flex items-center gap-2 shadow-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="text-lg">▶️</span>
                  <div>
                    <span className="text-[10px] text-slate-500 block leading-tight">Tải về trên</span>
                    <span>Google Play</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Phone Mockup) */}
            <div className="lg:col-span-6 flex justify-center relative">
              
              {/* Phone Frame */}
              <div className="relative w-72 sm:w-80 rounded-[3rem] bg-slate-900 p-4 shadow-2xl border-4 border-slate-700/80">
                <div className="rounded-[2.4rem] overflow-hidden bg-navy aspect-[9/18] p-4 text-white flex flex-col justify-between border border-white/10 relative">
                  
                  {/* Phone UI Top bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-white/10">
                    <span className="font-bold text-white">9:41</span>
                    <span>HaNoi Realty</span>
                    <span>5G 🔋</span>
                  </div>

                  {/* Phone App Content Preview */}
                  <div className="my-auto space-y-3">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-3">
                      <span className="text-[10px] text-orange-400 font-bold block mb-1">🗺️ Layer Quy hoạch 2030</span>
                      <p className="text-xs font-bold text-white">Quận Đống Đa - Đất ở đô thị</p>
                      <p className="text-[10px] text-slate-300">Tầng cao: 5-9 tầng · Mật độ: 65%</p>
                    </div>

                    <div className="bg-slate-800 rounded-2xl p-3 border border-slate-700">
                      <span className="text-[10px] text-emerald-400 font-bold block mb-1">🤖 AI Phân tích</span>
                      <p className="text-xs font-bold text-white">Tiềm năng tăng giá: 8.5/10</p>
                    </div>
                  </div>

                  <div className="py-2 text-center text-[10px] text-slate-400">
                    Trượt lên để mở khóa
                  </div>
                </div>
              </div>

              {/* Floating Notification 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-2 sm:left-4 bg-white text-slate-900 rounded-2xl p-3 shadow-2xl border border-slate-100 text-xs font-bold flex items-center gap-2 max-w-[220px]"
              >
                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs shrink-0">
                  🔔
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-slate-400">Vừa đăng 2 phút trước</p>
                  <p className="truncate text-navy font-bold">Nhà phố Đống Đa 8.5 tỷ</p>
                </div>
              </motion.div>

              {/* Floating Notification 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -right-2 sm:right-4 bg-white text-slate-900 rounded-2xl p-3 shadow-2xl border border-slate-100 text-xs font-bold flex items-center gap-2 max-w-[220px]"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">
                  📊
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-slate-400">Báo cáo AI sẵn sàng</p>
                  <p className="truncate text-navy font-bold">Đã phân tích 100% dữ liệu</p>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 11 — ĐĂNG TIN CTA
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
