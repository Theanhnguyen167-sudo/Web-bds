
'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { AirbnbStickySearchBar } from '@/components/home/AirbnbStickySearchBar';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingItem } from '@/lib/mock-data';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { getListingUrl } from '@/lib/listing-slug';
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
  ArrowRight,
  Phone,
  MessageCircle,
  Eye,
  Heart,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Building,
  Key,
  Clock,
  ExternalLink,
  Check,
  DollarSign,
  Briefcase,
  X,
  Bed,
  Maximize2,
  Mail
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

// ── FAQ Constants ──
const homeFaqs = [
  {
    q: 'Gửi nhà có mất phí đăng tin không?',
    a: 'Hiện tại, HaNoi Realty hoàn toàn không thu phí đăng tin đối với chủ nhà bán hoặc cho thuê. Thông tin BĐS sau khi gửi sẽ được tiếp nhận, kiểm tra dữ liệu cơ bản và phối hợp giới thiệu tới người mua hoặc mạng lưới môi giới phù hợp.',
  },
  {
    q: 'Đã kiểm tra thông tin nghĩa là gì?',
    a: 'Nhãn “Đã kiểm tra thông tin” thể hiện HaNoi Realty đã đối chiếu các dữ liệu cụ thể do chủ nhà cung cấp (địa chỉ thực tế, diện tích, hiện trạng và giấy tờ sẵn có tại thời điểm kiểm tra). Nhãn này không thay thế việc thẩm tra pháp lý chuyên sâu trước khi đặt cọc hay công chứng. Khi xem nhà, các bên vẫn cần trực tiếp kiểm tra hồ sơ gốc.',
  },
  {
    q: 'Người mua có mất phí kết nối không?',
    a: 'Người mua hoàn toàn không mất phí kết nối khi tìm kiếm nhà, gửi tiêu chí hoặc phối hợp lịch xem nhà trên HaNoi Realty. Phí dịch vụ (nếu có) tuân theo thỏa thuận môi giới giao dịch thành công giữa chủ nhà và chuyên viên theo quy định hiện hành.',
  },
  {
    q: 'Môi giới cần điều kiện gì để tham gia?',
    a: 'Môi giới và CTV cần tạo tài khoản, cung cấp số điện thoại định danh và khu vực hoạt động để HaNoi Realty xét duyệt trước khi khai thác kho nhà mở. Đối với vai trò Quản trị (TPKD), hệ thống yêu cầu xét duyệt hồ sơ quản lý và thẩm định điều kiện riêng trước khi kích hoạt.',
  },
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


const heroSalePricePresets = [
  { label: 'Tất cả mức giá', value: 'all' },
  { label: 'Dưới 2 tỷ', value: '0-2' },
  { label: '2 - 5 tỷ', value: '2-5' },
  { label: '5 - 10 tỷ', value: '5-10' },
  { label: '10 - 20 tỷ', value: '10-20' },
  { label: 'Trên 20 tỷ', value: '20-999' },
];

const heroRentPricePresets = [
  { label: 'Tất cả mức giá', value: 'all' },
  { label: 'Dưới 5 triệu/tháng', value: '0-5' },
  { label: '5 - 10 triệu/tháng', value: '5-10' },
  { label: '10 - 20 triệu/tháng', value: '10-20' },
  { label: '20 - 40 triệu/tháng', value: '20-40' },
  { label: 'Trên 40 triệu/tháng', value: '40-999' },
];

export default function HomePage() {
  const router = useRouter();
  const { user, listings, savedListingIds, toggleSaveListing } = useApp();

  // ── Hero Search State ──
  const [heroSearchTab, setHeroSearchTab] = useState<'buy' | 'rent'>('buy');
  const [heroLocationQuery, setHeroLocationQuery] = useState('');
  const [heroLocationDropdownOpen, setHeroLocationDropdownOpen] = useState(false);
  const [heroPriceRange, setHeroPriceRange] = useState('all');
  const [heroPriceDropdownOpen, setHeroPriceDropdownOpen] = useState(false);
  const heroSearchBoxRef = useRef<HTMLDivElement>(null);

  const currentHeroPricePresets = heroSearchTab === 'rent' ? heroRentPricePresets : heroSalePricePresets;

  const handleHeroTabChange = (tab: 'buy' | 'rent') => {
    if (heroSearchTab !== tab) {
      setHeroSearchTab(tab);
      setHeroPriceRange('all');
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (heroSearchBoxRef.current && !heroSearchBoxRef.current.contains(e.target as Node)) {
        setHeroLocationDropdownOpen(false);
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
    params.set('purpose', heroSearchTab === 'rent' ? 'rent' : 'sale');
    if (heroLocationQuery.trim()) params.set('district', heroLocationQuery.trim());

    if (heroPriceRange !== 'all') {
      const [min, max] = heroPriceRange.split('-');
      const multiplier = heroSearchTab === 'rent' ? 1e6 : 1e9;
      if (min && min !== '0') params.set('minPrice', (Number(min) * multiplier).toString());
      if (max && max !== '999') params.set('maxPrice', (Number(max) * multiplier).toString());
    }

    setHeroLocationDropdownOpen(false);
    setHeroPriceDropdownOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  // ── FAQ Accordion State ──
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // ── Section 3: Featured Listings Carousel Scroll ──
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const scrollFeatured = (direction: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      featuredScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // ── Section 3: Nhà đang bán và cho thuê (Quản lý tab, dữ liệu thật & deduplication) ──
  const [activeSection3Tab, setActiveSection3Tab] = useState<'sale' | 'rent'>('sale');
  const [section3Loading, setSection3Loading] = useState<boolean>(true);
  const [section3Error, setSection3Error] = useState<string | null>(null);
  const [remoteApprovedListings, setRemoteApprovedListings] = useState<ListingItem[]>([]);

  const fetchSection3Data = useCallback(async () => {
    try {
      setSection3Loading(true);
      setSection3Error(null);
      const res = await fetch('/api/listings?status=active');
      if (!res.ok) {
        throw new Error('Không thể tải danh sách bất động sản từ hệ thống');
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: ListingItem[] = json.data.map((row: any) => {
          const area = Number(row.area) || 0;
          const price = Number(row.price) || 0;
          const pricePerM2 = row.price_per_m2 || Math.round(price / (area || 1));
          return {
            id: String(row.id),
            code: row.listing_code || row.code,
            listing_code: row.listing_code || row.code,
            propertyCode: row.listing_code || row.code,
            title: row.title || 'Bất động sản Hà Nội',
            price,
            pricePerM2,
            area,
            floors: Number(row.floors) || 0,
            bedrooms: Number(row.bedrooms) || 0,
            bathrooms: Number(row.bathrooms) || 0,
            address: row.address || '',
            district: row.district || 'Hà Nội',
            ward: row.ward || '',
            lat: Number(row.lat) || 21.0285,
            lng: Number(row.lng) || 105.8542,
            type: row.property_type || 'house',
            images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
            status: row.status || 'active',
            isFeatured: Boolean(row.is_featured),
            views: Number(row.views) || 0,
            createdAt: row.created_at ? row.created_at.split('T')[0] : '',
            updatedAt: row.updated_at ? row.updated_at.split('T')[0] : (row.updatedAt || ''),
            planningZone: row.planning_zone || '',
            planningYear: 2030,
            legalStatus: row.legal_status || '',
            purpose: row.purpose || (row.title?.toLowerCase().includes('cho thuê') || row.title?.toLowerCase().includes('thuê') ? 'rent' : 'sale'),
            verificationStatus: row.verification_status || (row.is_verified ? 'verified' : undefined),
          };
        });
        setRemoteApprovedListings(mapped);
      } else {
        setRemoteApprovedListings([]);
      }
    } catch (err: any) {
      setSection3Error(err?.message || 'Lỗi khi tải dữ liệu BĐS');
    } finally {
      setSection3Loading(false);
    }
  }, []);

  useEffect(() => {
    fetchSection3Data();
  }, [fetchSection3Data]);

  // Gộp nguồn thật và AppContext, lọc BĐS công khai đã duyệt + còn hiệu lực, deduplicate mã BĐS / id, lọc theo tab tối đa 10 căn
  const section3Listings = useMemo(() => {
    const combined = [...remoteApprovedListings, ...(listings || [])];
    const nowTime = Date.now();

    // 1. Chỉ lấy BĐS công khai đã duyệt & còn hiệu lực
    const approvedList = combined.filter((item) => {
      const isApproved = item.status === 'active' || (item.status as string) === 'published';
      if (!isApproved) return false;
      if (item.expiresAt) {
        const expiry = new Date(item.expiresAt).getTime();
        if (!isNaN(expiry) && nowTime > expiry) return false;
      }
      return true;
    });

    // 2. Mỗi căn hiện một lần theo mã BĐS chuẩn nếu có, dùng ID làm dự phòng
    const seenKeys = new Set<string>();
    const deduplicated: ListingItem[] = [];
    for (const item of approvedList) {
      const standardCode = (item.listing_code || item.code || item.propertyCode || '').trim().toUpperCase();
      const uniqueKey = standardCode || item.id;
      if (!uniqueKey || seenKeys.has(uniqueKey)) continue;
      seenKeys.add(uniqueKey);
      deduplicated.push(item);
    }

    // 3. Lọc theo tab Đang bán vs Đang cho thuê, lấy tối đa 10 căn
    return deduplicated
      .filter((item) => {
        const isRent =
          item.purpose === 'rent' ||
          item.title?.toLowerCase().includes('cho thuê') ||
          item.title?.toLowerCase().includes('thuê') ||
          (item.price > 0 && item.price <= 100_000_000 && !item.title?.toLowerCase().startsWith('bán'));

        return activeSection3Tab === 'rent' ? isRent : !isRent;
      })
      .slice(0, 10);
  }, [remoteApprovedListings, listings, activeSection3Tab]);


  return (
    <div className="overflow-x-hidden bg-page-bg text-text-primary font-sans scroll-smooth">
      <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn'} />
      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 1 — HERO THEO CHUẨN CẤU TRÚC ẢNH 1 (CODI FLOATING CARD & HERO IMAGE LAYOUT)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="hero"
        className="relative flex flex-col justify-between overflow-hidden bg-slate-50 text-slate-900 pt-[78px] sm:pt-[82px] lg:pt-[86px] pb-6 sm:pb-8 lg:pb-10 border-b border-slate-200/80"
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

            {/* 2. CARD TRẮNG NỔI BÊN TRÁI: Dóng cột 1 -> 5, cân bằng tỷ lệ với ảnh */}
            <div className="w-full md:w-[350px] lg:w-[370px] xl:w-[395px] lg:col-start-1 lg:col-end-5 lg:row-start-1 z-20 mt-4 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <div className="bg-white/98 backdrop-blur-md rounded-2xl sm:rounded-[24px] p-4.5 sm:p-5 shadow-[0_16px_40px_rgba(10,17,40,0.10)] border border-slate-200/90 flex flex-col justify-between">

                  {/* H1 Title: Hero H1 dẫn đầu hệ thống typography desktop */}
                  <h1 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-black text-[#0a1128] leading-[1.2] tracking-tight mb-2">
                    Kết nối giao dịch <br className="hidden sm:inline" />
                    <span className="text-orange-500">bất động sản tại Hà Nội</span>
                  </h1>

                  {/* Dòng mô tả dưới H1 */}
                  <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed mb-3">
                    HaNoi Realty kết nối chủ nhà, môi giới và người mua, giúp mỗi bên nắm rõ thông tin và biết bước tiếp theo trong giao dịch.
                  </p>

                  {/* THANH TÌM KIẾM ĐẦY ĐỦ TÍNH NĂNG */}
                  <div ref={heroSearchBoxRef} className="space-y-2">

                    {/* HÀNG 1: TABS NHU CẦU (Mua / Thuê) */}
                    <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-100/90 rounded-xl w-fit">
                      {[
                        { key: 'buy', label: 'Mua', icon: '🏠' },
                        { key: 'rent', label: 'Thuê', icon: '🔑' },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => handleHeroTabChange(tab.key as 'buy' | 'rent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${heroSearchTab === tab.key
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
                            setHeroPriceDropdownOpen(false);
                          }}
                          placeholder="Chọn khu vực tại Hà Nội"
                          className="w-full h-10.5 pl-9 pr-8 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15 bg-slate-50/60 focus:bg-white text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 outline-none transition-all shadow-xs"
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

                    {/* HÀNG 3: BỘ LỌC MỨC GIÁ THEO TAB (Mua / Thuê) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setHeroPriceDropdownOpen(!heroPriceDropdownOpen);
                          setHeroLocationDropdownOpen(false);
                        }}
                        className={`w-full h-10.5 flex items-center justify-between px-3 rounded-xl border text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${heroPriceDropdownOpen
                          ? "border-orange-500 ring-3 ring-orange-500/15 bg-orange-50/20 text-[#0a1128]"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-white text-slate-700"
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <DollarSign className="w-4 h-4 text-orange-500 shrink-0" />
                          <span className="truncate">
                            {currentHeroPricePresets.find((p) => p.value === heroPriceRange)?.label || "Tất cả mức giá"}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform duration-200 ${heroPriceDropdownOpen ? "rotate-180 text-orange-500" : ""
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
                            {currentHeroPricePresets.map((p) => (
                              <button
                                key={p.value}
                                type="button"
                                onClick={() => {
                                  setHeroPriceRange(p.value);
                                  setHeroPriceDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${heroPriceRange === p.value
                                  ? "bg-orange-500 text-white shadow-sm"
                                  : "hover:bg-slate-50 text-slate-700"
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

                    {/* HÀNG 4: NÚT TÌM KIẾM */}
                    <button
                      type="button"
                      onClick={() => handleExecuteHeroSearch()}
                      className="w-full h-10.5 sm:h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-[13px] tracking-wide shadow-md shadow-orange-500/30 hover:shadow-orange-500/45 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer mt-1"
                    >
                      <Search className="w-4 h-4" />
                      <span>Tìm nhà</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* BA LỐI VÀO NGAY DƯỚI THANH TÌM KIẾM CHO 3 ĐỐI TƯỢNG */}
          <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">
            {/* 1. Người mua */}
            <Link
              href="/buyer-request"
              className="group flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-2xl bg-white hover:bg-orange-50/40 border border-slate-200/90 hover:border-orange-500/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-lg shrink-0">
                  Người mua
                </span>
                <span className="text-slate-300 font-bold shrink-0">·</span>
                <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                  Gửi nhu cầu mua
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
            </Link>

            {/* 2. Chủ nhà */}
            <Link
              href="/post-property"
              className="group flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-2xl bg-white hover:bg-orange-50/40 border border-slate-200/90 hover:border-orange-500/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-lg shrink-0">
                  Chủ nhà
                </span>
                <span className="text-slate-300 font-bold shrink-0">·</span>
                <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                  Gửi nhà cần bán hoặc cho thuê
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
            </Link>

            {/* 3. CTV/môi giới */}
            <Link
              href="/danh-cho-moi-gioi"
              className="group flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-2xl bg-white hover:bg-orange-50/40 border border-slate-200/90 hover:border-orange-500/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-lg shrink-0">
                  CTV/môi giới
                </span>
                <span className="text-slate-300 font-bold shrink-0">·</span>
                <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                  Dành cho môi giới
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 2: HANOI REALTY HOẠT ĐỘNG THẾ NÀO?
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="how-it-works" className="bg-white py-10 sm:py-12 lg:py-14 border-b border-slate-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-9">
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#0a1128] tracking-tight mb-2">
              HaNoi Realty hoạt động thế nào?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Quy trình HaNoi Realty đang xây dựng để kết nối chủ nhà, môi giới và người mua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Thẻ 1 */}
            <div className="rounded-2xl p-5 sm:p-6 bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between hover:border-orange-500/40 hover:bg-white hover:shadow-md transition-all duration-200">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-500 text-white font-black text-xs shadow-xs shrink-0">
                    1
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    Tiếp nhận và kiểm tra thông tin
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Chủ nhà gửi thông tin BĐS. HaNoi Realty tiếp nhận, kiểm tra và đề nghị bổ sung khi cần trước khi duyệt công bố.
                </p>
              </div>
            </div>

            {/* Thẻ 2 */}
            <div className="rounded-2xl p-5 sm:p-6 bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between hover:border-orange-500/40 hover:bg-white hover:shadow-md transition-all duration-200">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-500 text-white font-black text-xs shadow-xs shrink-0">
                    2
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    Kết nối theo nhu cầu
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Người mua tự tìm nhà hoặc gửi tiêu chí. Môi giới đã được duyệt có thể khai thác kho nhà chung và hỗ trợ tìm căn phù hợp.
                </p>
              </div>
            </div>

            {/* Thẻ 3 */}
            <div className="rounded-2xl p-5 sm:p-6 bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between hover:border-orange-500/40 hover:bg-white hover:shadow-md transition-all duration-200">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-500 text-white font-black text-xs shadow-xs shrink-0">
                    3
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    Phối hợp xem nhà và trao đổi
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  Khi người mua quan tâm, HaNoi Realty hỗ trợ phối hợp lịch xem để các bên trao đổi về căn nhà và điều kiện giao dịch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 3 — BẤT ĐỘNG SẢN NỔI BẬT (Nền trắng tinh sạch, tôn vinh hình ảnh BĐS)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="featured" className="bg-white py-10 sm:py-12 lg:py-14 overflow-hidden relative border-b border-slate-200/80">

        {/* ── PHẦN CHỮ Ở TRÊN (TIÊU ĐỀ, TABS & NÚT ĐIỀU HƯỚNG HEADER) ── */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0a1128] tracking-tight leading-tight">
                Nhà đang bán và cho thuê
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-500 font-normal mt-2 sm:mt-2.5 max-w-2xl leading-relaxed">
                Cho dù bạn đang tìm kiếm không gian để <strong className="font-semibold text-slate-700">an cư dài lâu</strong>, <strong className="font-semibold text-slate-700">nghỉ dưỡng tinh hoa</strong> hay <strong className="font-semibold text-slate-700">đầu tư sinh lời vượt trội</strong>, luôn có một bất động sản hoàn hảo dành riêng cho bạn tại Hà Nội.
              </p>

              {/* Hai tab Đang bán và Đang cho thuê */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl w-fit mt-3.5 sm:mt-4 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setActiveSection3Tab('sale')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${activeSection3Tab === 'sale'
                    ? 'bg-[#0a1128] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                >
                  Đang bán
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection3Tab('rent')}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${activeSection3Tab === 'rent'
                    ? 'bg-[#0a1128] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                >
                  Đang cho thuê
                </button>
              </div>
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

        {/* ── DẢI CÁC THẺ BÀI VIẾT Ở DƯỚI ── */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          {/* 1. Trạng thái Đang tải (Loading) */}
          {section3Loading && (
            <div className="flex gap-4 sm:gap-5 overflow-hidden py-3 px-1">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="w-[275px] sm:w-[295px] md:w-[315px] lg:w-[335px] xl:w-[345px] shrink-0 h-[405px] sm:h-[420px] rounded-2xl border border-slate-200 bg-white p-3.5 flex flex-col justify-between animate-pulse"
                >
                  <div className="aspect-[16/10] w-full rounded-xl bg-slate-200" />
                  <div className="space-y-2 mt-3">
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-slate-100 rounded-xl mt-auto" />
                </div>
              ))}
            </div>
          )}

          {/* 2. Trạng thái Lỗi tải (Error) */}
          {!section3Loading && section3Error && section3Listings.length === 0 && (
            <div className="w-full py-10 px-4 rounded-2xl border border-rose-200 bg-rose-50/50 text-center flex flex-col items-center justify-center">
              <p className="text-xs sm:text-sm font-semibold text-rose-600 mb-3">
                {section3Error}
              </p>
              <button
                type="button"
                onClick={() => fetchSection3Data()}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Thử tải lại
              </button>
            </div>
          )}

          {/* 3. Trạng thái Danh sách trống (Empty) */}
          {!section3Loading && !section3Error && section3Listings.length === 0 && (
            <div className="w-full py-12 px-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Chưa có bất động sản {activeSection3Tab === 'rent' ? 'cho thuê' : 'đang bán'} phù hợp
              </h3>
              <p className="text-xs text-slate-500 max-w-md mb-4 leading-relaxed">
                Nguồn nhà {activeSection3Tab === 'rent' ? 'cho thuê' : 'đang bán'} đang được tiếp nhận, kiểm tra và duyệt liên tục. Bạn có thể xem thêm trong bộ lọc tìm kiếm.
              </p>
              <Link
                href={activeSection3Tab === 'rent' ? '/search?purpose=rent' : '/search?purpose=sale'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-orange-600 hover:border-orange-300 shadow-xs transition-all"
              >
                <span>Xem bộ lọc tìm kiếm</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* 4. Dãy thẻ BĐS khi có dữ liệu */}
          {section3Listings.length > 0 && (
            <div className="relative group/carousel">
              <div
                ref={featuredScrollRef}
                className="flex gap-4 sm:gap-5 overflow-x-auto py-3 px-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {section3Listings.map((listing) => {
                  const isSaved = savedListingIds.includes(listing.id);
                  const isRent = activeSection3Tab === 'rent' || listing.purpose === 'rent' || listing.title?.toLowerCase().includes('cho thuê') || listing.title?.toLowerCase().includes('thuê');
                  const cardPricePerM2 = formatPricePerM2(listing.price, listing.area);
                  const baseFormattedPrice = formatCurrencyVND(listing.price);
                  const formattedPrice = isRent ? `${baseFormattedPrice}/tháng` : baseFormattedPrice;
                  const firstImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80';
                  const isVerified = listing.verificationStatus === 'verified' || listing.verificationStatus === 'Đã kiểm tra' || (listing as any).isVerified;
                  const updatedDate = listing.updatedAt ? (listing.updatedAt.includes('T') ? listing.updatedAt.split('T')[0] : listing.updatedAt) : null;

                  return (
                    <div
                      key={listing.id}
                      className="w-[275px] sm:w-[295px] md:w-[315px] lg:w-[335px] xl:w-[345px] shrink-0 snap-start"
                    >
                      <div
                        onClick={() => router.push(getListingUrl(listing))}
                        className="group/card relative flex flex-col h-[405px] sm:h-[420px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-sm hover:shadow-2xl hover:shadow-orange-500/15 hover:border-orange-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer select-none"
                        title="Nhấp để xem nội dung chi tiết bài đăng"
                      >
                        {/* Thumbnail Image Container */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={firstImage}
                            alt={listing.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-108"
                            loading="lazy"
                          />

                          {/* Nhãn kiểm tra khi có dữ liệu xác nhận */}
                          {isVerified && (
                            <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-1.5 items-center">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-md border border-white/20">
                                <ShieldCheck className="h-3 w-3" />
                                <span>Đã kiểm tra</span>
                              </span>
                            </div>
                          )}

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

                          {/* Price Tag Overlay — Hiện giá, kèm /tháng khi thuê */}
                          <div className="absolute bottom-2.5 left-2.5 z-20 rounded-xl bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-xs font-black text-white shadow-md border border-white/15">
                            <span className="text-white font-black text-xs tracking-tight">
                              {formattedPrice}
                            </span>
                            {!isRent && listing.area > 0 && (
                              <span className="ml-1 text-[10px] font-medium text-slate-300">
                                ({cardPricePerM2})
                              </span>
                            )}
                          </div>

                          {/* Quick view hover pill */}
                          <div className="absolute bottom-2.5 right-2.5 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-200 translate-y-1 group-hover/card:translate-y-0">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500 text-white text-[11px] font-bold px-2 py-1 shadow-md">
                              <Eye className="h-3 w-3" />
                              <span>Xem nhanh</span>
                            </span>
                          </div>
                        </div>

                        {/* Content Details */}
                        <div className="flex flex-1 flex-col p-3.5 justify-between bg-white">
                          {/* Title */}
                          <div className="h-10 sm:h-11 flex items-start mb-1.5">
                            <Link
                              href={getListingUrl(listing)}
                              onClick={(e) => e.stopPropagation()}
                              className="line-clamp-2 text-xs sm:text-[13px] font-extrabold leading-snug text-slate-800 transition-colors hover:text-orange-600 block cursor-pointer"
                              title={listing.title}
                            >
                              {listing.title}
                            </Link>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2.5 h-4 truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                            <span className="truncate font-medium">
                              {listing.ward ? `${listing.ward}, ` : ''}Quận {listing.district}, Hà Nội
                            </span>
                          </div>

                          {/* Specs Row */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 mb-2.5 h-7">
                            {listing.area > 0 && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                                <Maximize2 className="h-3 w-3 text-slate-400" />
                                <span className="font-semibold text-slate-600 text-[11px]">{listing.area} m²</span>
                              </div>
                            )}
                            {listing.floors > 0 && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                                <Building className="h-3 w-3 text-slate-400" />
                                <span className="font-medium text-slate-500 text-[11px]">{listing.floors} tầng</span>
                              </div>
                            )}
                            {listing.bedrooms > 0 && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                                <Bed className="h-3 w-3 text-slate-400" />
                                <span className="font-medium text-slate-500 text-[11px]">{listing.bedrooms} PN</span>
                              </div>
                            )}
                            {updatedDate && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 ml-auto" title="Ngày cập nhật xác nhận">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span>{updatedDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Action buttons CTA */}
                          <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(getListingUrl(listing));
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Xem chi tiết</span>
                            </button>
                            <Link
                              href={getListingUrl(listing)}
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

              {/* Side Floating Left Arrow Button */}
              <button
                type="button"
                onClick={() => scrollFeatured('left')}
                className="hidden md:flex absolute left-1 sm:left-2 top-[95px] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer"
                title="Trượt sang trái"
                aria-label="Trượt sang trái"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Side Floating Right Arrow Button */}
              <button
                type="button"
                onClick={() => scrollFeatured('right')}
                className="hidden md:flex absolute right-1 sm:right-2 top-[95px] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 text-slate-800 hover:text-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer"
                title="Xem tiếp các bất động sản"
                aria-label="Xem tiếp"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* ── NÚT CTA XEM TẤT CẢ DƯỚI DANH SÁCH BĐS ── */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href={activeSection3Tab === 'rent' ? '/search?purpose=rent' : '/search?purpose=sale'}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            >
              <span>Xem tất cả {activeSection3Tab === 'rent' ? 'nhà cho thuê' : 'nhà đang bán'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 5 — THÔNG TIN ĐƯỢC KIỂM TRA NHƯ THẾ NÀO?
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="kiem-tra-thong-tin"
        className="bg-slate-50/70 py-12 sm:py-16 lg:py-20 border-b border-slate-200/80 text-slate-900 relative overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 text-orange-600 font-bold text-[11px] sm:text-xs tracking-widest uppercase mb-2">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              <span>MINH BẠCH & ĐỐI CHIẾU THỰC TẾ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0a1128] tracking-tight leading-tight">
              Thông tin được kiểm tra như thế nào?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal mt-2.5 leading-relaxed">
              Nguyên tắc công khai trạng thái đối chiếu giúp chủ nhà, môi giới và người mua nắm rõ mức độ xác thực của từng căn nhà.
            </p>
          </div>

          {/* 3 Mục ngắn trả lời 3 câu hỏi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Mục 1: Thông tin nào đã được đối chiếu? */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2.5 tracking-tight">
                  Thông tin nào đã được đối chiếu?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Chỉ hiển thị trạng thái kiểm tra khi có dữ liệu xác nhận thực tế. Hệ thống nêu rõ các nội dung đã đối chiếu (vị trí, diện tích, tình trạng sử dụng và giấy tờ do chủ nhà cung cấp) kèm ngày kiểm tra cụ thể trên từng tin đăng, không đưa ra xác nhận chung chung.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Xác nhận theo từng trường dữ liệu
                </span>
              </div>
            </div>

            {/* Mục 2: Thông tin nào còn thiếu? */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2.5 tracking-tight">
                  Thông tin nào còn thiếu?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Dùng nhãn <strong className="text-slate-800 font-semibold">“Chờ bổ sung”</strong> đối với các căn nhà đang hoàn thiện tài liệu hoặc chưa đủ hình ảnh thực tế. HaNoi Realty tránh các nhãn bảo chứng chung khiến người mua hiểu nhầm rằng toàn bộ hồ sơ pháp lý đã được thẩm định tuyệt đối.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  Gắn nhãn “Chờ bổ sung” rõ ràng
                </span>
              </div>
            </div>

            {/* Mục 3: Tôi báo sai lệch ở đâu? */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border border-sky-100">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2.5 tracking-tight">
                  Tôi báo sai lệch ở đâu?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Nếu phát hiện giá, địa chỉ, hình ảnh hoặc trạng thái căn nhà không đúng với thực tế, bạn có thể gửi phản ánh kèm mã BĐS tới kênh tiếp nhận của HaNoi Realty. Tin có báo cáo sẽ được tạm ẩn để rà soát lại với chủ nhà trước khi phản hồi kết quả.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-1.5">
                <a
                  href="mailto:support@hanoirealty.vn?subject=B%C3%A1o%20sai%20l%E1%BB%87ch%20th%C3%B4ng%20tin%20B%C4%90S"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>support@hanoirealty.vn</span>
                </a>
                <a
                  href="tel:02438889999"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>Hotline: (024) 3888 9999</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── FAQ NGẮN (BẤM MỞ) ── */}
          <div className="mt-14 sm:mt-18 max-w-4xl mx-auto pt-10 sm:pt-14 border-t border-slate-200/80">
            <div className="text-center mb-8">
              <span className="text-xs font-bold tracking-wider uppercase text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/70 inline-block mb-2">
                HỎI ĐÁP QUY CHUẨN
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Câu hỏi thường gặp
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                Giải đáp nhanh về chi phí, quy trình đối chiếu và điều kiện tham gia hệ thống
              </p>
            </div>

            <div className="space-y-3">
              {homeFaqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full px-5 sm:px-6 py-4 sm:py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-[15px] text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={
                          isOpen
                            ? 'w-4 h-4 text-orange-500 rotate-180 shrink-0 transition-transform duration-200'
                            : 'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200'
                        }
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100 mt-1">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 6 — TIN TỨC & PHÂN TÍCH THỊ TRƯỜNG (Nền trắng thanh lịch, trải nghiệm đọc tin chuyên nghiệp)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  <section id="market-updates" className="bg-white py-12 sm:py-16 lg:py-20 border-b border-slate-200/80 text-slate-900 relative overflow-hidden scroll-mt-0">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
                        <div>
                          {/* Eyebrow — Uppercase Tracking-Widest Accent */}
                          <span className="inline-block text-[11px] sm:text-xs font-bold tracking-widest text-orange-600 uppercase mb-2">
                            TIN TỨC & KIẾN THỨC
                          </span>
                          {/* Heading — Primary Information (Nổi bật nhất) */}
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0a1128] leading-tight tracking-tight">
                            Cập nhật thị trường BĐS Hà Nội
                          </h2>
                          {/* Description — Supporting Text (Nhẹ hơn heading) */}
                          <p className="text-sm sm:text-base text-slate-500 font-normal mt-2 sm:mt-2.5 max-w-xl leading-relaxed">
                            Phân tích chuyên sâu từ đội ngũ chuyên gia quy hoạch và định giá
                            Tổng hợp thông tin và góc nhìn thực tế về thị trường bất động sản thủ đô
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
                            href="/news"
                            className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl hover:shadow-orange-500/10 hover:border-orange-400 transition-all duration-300 sm:h-[180px] lg:h-[200px]"
                          >
                            <div className="relative w-full sm:w-5/12 h-[140px] sm:h-full overflow-hidden bg-slate-900 shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1000&auto=format&fit=crop&q=80"
                                alt="Metro line Hanoi"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute top-3.5 left-3.5 bg-orange-500 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md">
                                🔥 Nổi bật tuần
                              </span>
                              <span className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                                28/09/2025
                              </span>
                            </div>

                            <div className="p-4 sm:p-5 lg:p-6 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-center">
                              <div className="space-y-1 sm:space-y-1.5">
                                {/* Card Title khoảng 18-20px */}
                                <h3 className="text-base sm:text-lg lg:text-[20px] font-bold text-[#0a1128] group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                                  Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công
                                </h3>
                                {/* Body text khoảng 14-16px - Rút gọn 1 câu súc tích */}
                                <p className="text-sm sm:text-[15px] lg:text-base text-slate-500 font-normal line-clamp-1 leading-relaxed">
                                  Sự kết nối giữa các trục giao thông hướng tâm và đường vành đai đang tạo lực đẩy mạnh mẽ cho phân khúc nhà phố.
                                </p>
                              </div>

                              {/* Metadata khoảng 12-14px */}
                              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 text-xs sm:text-[13px] text-slate-400 font-normal">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-500/20 text-orange-600 font-bold flex items-center justify-center text-xs">
                                    HR
                                  </div>
                                  <span className="font-medium text-slate-600">Ban biên tập HaNoi Realty</span>
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
                              date: '25/09/2025',
                              image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=400&auto=format&fit=crop&q=80',
                            },
                            {
                              title: 'Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích thực tế',
                              category: 'Giá đất',
                              date: '22/09/2025',
                              image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
                            },
                            {
                              title: 'Lãi suất vay mua nhà giảm sâu: Thời điểm thích hợp để sở hữu BĐS an cư?',
                              category: 'Tài chính',
                              date: '15/09/2025',
                              image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
                            },
                          ].map((article, idx) => (
                            <Link
                              key={idx}
                              href="/news"
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
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                                  {article.category}
                                </span>
                                <h4 className="font-bold text-xs sm:text-[13px] lg:text-sm text-[#0a1128] group-hover:text-orange-600 transition-colors line-clamp-2 mt-1 leading-snug">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 font-normal">{article.date}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                      </div>

                      {/* Market Mini Dashboard Row — Có thời điểm cập nhật và liên kết sang Báo cáo AI chuyên sâu */}
                      <div className="mt-2 sm:mt-3 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1.5">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Chỉ số thị trường Hà Nội (Cập nhật: Q3/2025)</span>
                          </h4>
                          <Link
                            href="/search"
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 transition-colors group"
                            title="Khám phá bất động sản trên toàn Hà Nội"
                          >
                            <span>Xem tin đăng theo khu vực</span>
                            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                          <div className="p-2">
                            <p className="text-xs sm:text-sm text-slate-500 font-normal">Giá TB Đống Đa</p>
                            <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">85 tr/m²</p>
                            <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +2.3% so tháng trước</span>
                          </div>
                          <div className="p-2 sm:pl-6">
                            <p className="text-xs sm:text-sm text-slate-500 font-normal">Giá TB Cầu Giấy</p>
                            <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">65 tr/m²</p>
                            <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +1.8% so tháng trước</span>
                          </div>
                          <div className="p-2 sm:pl-6">
                            <p className="text-xs sm:text-sm text-slate-500 font-normal">Tin đăng mới hôm nay</p>
                            <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">127 tin</p>
                            <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +34 so hôm qua</span>
                          </div>
                          <div className="p-2 sm:pl-6">
                            <p className="text-xs sm:text-sm text-slate-500 font-normal">Giao dịch tháng này</p>
                            <p className="text-xl sm:text-2xl font-black text-[#0a1128] mt-0.5">89 căn</p>
                            <span className="text-emerald-600 font-bold text-xs sm:text-sm">▲ +12% hoàn thành</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-2 text-right italic font-normal">
                          *Nguồn dữ liệu: Tổng hợp niêm yết và giao dịch thực tế trên hệ thống HaNoi Realty
                        </p>
                      </div>


                    </div>
                  </section>




                  {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📌 SECTION 10 — BẮT ĐẦU CÙNG HANOI REALTY (3 VAI TRÒ)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                  <section
                    id="bat-dau"
                    className="bg-slate-50 py-12 sm:py-16 lg:py-20 border-t border-slate-200/80 relative"
                  >
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                          Bắt đầu cùng HaNoi Realty
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 font-normal mt-2.5 leading-relaxed">
                          Lựa chọn đúng vai trò để tiếp cận quy trình và công cụ được chuẩn hóa cho từng nhu cầu giao dịch.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                        {/* Ô 1: Tôi là chủ nhà */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100/80">
                              <Key className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2.5 tracking-tight">
                              Tôi là chủ nhà
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-normal">
                              Gửi thông tin nhà cần bán hoặc cho thuê để HaNoi Realty tiếp nhận và kiểm tra.
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                            <Link
                              href="/register?role=owner"
                              className="h-11 sm:h-12 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                            >
                              <span>Đăng ký chủ nhà</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              href="/post-property"
                              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors py-1 text-center"
                            >
                              <span>Gửi nhà cần bán hoặc cho thuê</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Ô 2: Tôi là môi giới hoặc TPKD */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-5 border border-orange-100/80">
                              <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2.5 tracking-tight">
                              Tôi là môi giới hoặc TPKD
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-normal">
                              Tìm hiểu điều kiện tham gia và công cụ dành cho CTV, môi giới và trưởng nhóm.
                            </p>
                            <p className="mt-3 text-[11px] leading-relaxed text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                              Quyền TPKD chỉ có hiệu lực sau khi hồ sơ quản trị được xét duyệt.
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                            <Link
                              href="/register?role=agent"
                              className="h-11 sm:h-12 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 transition-all text-center"
                            >
                              <span>Đăng ký CTV/môi giới</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              href="/danh-cho-moi-gioi#tpkd"
                              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors py-1 text-center"
                            >
                              <span>Tìm hiểu gói TPKD</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Ô 3: Tôi muốn tìm nhà */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 border border-sky-100/80">
                              <Search className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2.5 tracking-tight">
                              Tôi muốn tìm nhà
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-normal">
                              Tạo tài khoản để lưu căn quan tâm và gửi nhu cầu tìm nhà tại Hà Nội.
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                            <Link
                              href="/register?role=buyer"
                              className="h-11 sm:h-12 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                            >
                              <span>Đăng ký tài khoản người mua</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              href="/search"
                              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors py-1 text-center"
                            >
                              <span>Tìm nhà ngay</span>
                              <ChevronRight className="w-4 h-4" />
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
                              Nền tảng công nghệ bất động sản Hà Nội, cung cấp dữ liệu quy hoạch minh bạch và hỗ trợ giao dịch nhà đất tin cậy.
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
                              <Link href="/listings/create" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                                Đăng tin BĐS
                              </Link>
                            </li>
                            <li>
                              <Link href="/pricing" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                                Bảng giá dịch vụ
                              </Link>
                            </li>
                            {user?.role === 'admin' && (
                              <li>
                                <Link href="/admin" className="text-orange-400 hover:text-orange-300 font-bold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                                  🛡️ Admin Portal
                                </Link>
                              </li>
                            )}
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
                                Đội ngũ phát triển
                              </Link>
                            </li>
                            <li>
                              <Link href="/about#careers" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                                Tuyển dụng
                              </Link>
                            </li>
                            <li>
                              <Link href="/news" className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                                Tin tức thị trường
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
