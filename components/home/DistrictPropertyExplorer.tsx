'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Bed,
  Maximize2,
  ChevronDown,
  Sparkles,
  Map as MapIcon,
  LayoutGrid,
  Check,
  Building,
  Home,
  Tag,
  ArrowRight,
  ShieldCheck,
  Flame,
  Layers,
  Eye,
  ZoomIn,
  Compass,
  Car
} from 'lucide-react';
import { mockListings, ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND } from '@/lib/utils';
import { LightboxModal, GalleryImage } from './LightboxModal';
import { MasterplanView } from './MasterplanView';

// Dynamic import Leaflet/Google map component with SSR disabled
const SearchMap = dynamic(() => import('@/components/map/SearchMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-800">
      <div className="h-8 w-8 rounded-full border-2 border-[#FF6600] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold">Đang tải bản đồ tương tác Hà Nội...</span>
    </div>
  ),
});

// Enriched property type with multi-angle gallery
export interface SplitPropertyItem extends ListingItem {
  statusLabel?: string;
  statusBadgeColor?: string;
  badgeText?: string;
  purpose?: 'sale' | 'rent';
  gallery: GalleryImage[];
}

const DISTRICT_OPTIONS = [
  'Tất cả quận',
  'Đống Đa',
  'Cầu Giấy',
  'Hoàn Kiếm',
  'Tây Hồ',
  'Ba Đình',
  'Hai Bà Trưng',
  'Nam Từ Liêm',
  'Thanh Xuân',
  'Long Biên',
  'Hà Đông',
];

const PROPERTY_TYPES = [
  { value: 'all', label: 'Tất cả loại BĐS' },
  { value: 'apartment', label: 'Chung cư / Căn hộ' },
  { value: 'house', label: 'Nhà phố / Nhà riêng' },
  { value: 'villa', label: 'Biệt thự / Villa' },
  { value: 'land', label: 'Đất nền / Thổ cư' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'available', label: 'Đang mở bán' },
  { value: 'trading', label: 'Đang giao dịch' },
  { value: 'limited', label: 'Còn ít căn' },
  { value: 'handover', label: 'Sắp bàn giao' },
];

const PURPOSE_OPTIONS = [
  { value: 'all', label: 'Tất cả hình thức' },
  { value: 'sale', label: 'Cần bán' },
  { value: 'rent', label: 'Cho thuê' },
];

// Curated multi-angle galleries for realistic real-estate inspection
const SAMPLE_GALLERIES: GalleryImage[][] = [
  // Gallery 1: Căn hộ cao cấp view hồ
  [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80',
      caption: 'Mặt tiền & Toàn cảnh kiến trúc hiện đại, view trực diện công viên',
      tag: 'Toàn cảnh kiến trúc'
    },
    {
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&auto=format&fit=crop&q=80',
      caption: 'Phòng khách sang trọng tràn ngập ánh sáng tự nhiên với trần cao',
      tag: 'Phòng khách'
    },
    {
      url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&auto=format&fit=crop&q=80',
      caption: 'Phòng ngủ Master ấm cúng trang bị sàn gỗ tự nhiên & tủ âm tường',
      tag: 'Phòng ngủ Master'
    },
    {
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1400&auto=format&fit=crop&q=80',
      caption: 'Khu bếp mở phong cách Bắc Âu tiện nghi, mặt đá thạch anh cao cấp',
      tag: 'Khu Bếp & Ăn'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&auto=format&fit=crop&q=80',
      caption: 'Ban công rộng thoáng ngắm hoàng hôn và view toàn cảnh Hà Nội',
      tag: 'Ban công Skyline'
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1400&auto=format&fit=crop&q=80',
      caption: 'Phòng tắm Master chuẩn khách sạn 5 sao với bồn tắm kính tràn viền',
      tag: 'Phòng tắm Master'
    }
  ],
  // Gallery 2: Biệt thự vườn sang trọng
  [
    {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&auto=format&fit=crop&q=80',
      caption: 'Toàn cảnh biệt thự phong cách Indochine tân cổ điển quý phái',
      tag: 'Mặt tiền biệt thự'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&auto=format&fit=crop&q=80',
      caption: 'Phòng khách thông tầng rộng 70m² với sofa da Ý nhập khẩu',
      tag: 'Phòng khách thông tầng'
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&auto=format&fit=crop&q=80',
      caption: 'Bể bơi riêng ngoài trời và sân vườn cây xanh nhiệt đới',
      tag: 'Bể bơi & Sân vườn'
    },
    {
      url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1400&auto=format&fit=crop&q=80',
      caption: 'Phòng ngủ view hồ bơi riêng tư tuyệt đối cho gia chủ',
      tag: 'Phòng ngủ VIP'
    },
    {
      url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1400&auto=format&fit=crop&q=80',
      caption: 'Sơ đồ mặt bằng thiết kế phân khu chức năng biệt thự',
      tag: 'Sơ đồ mặt bằng'
    }
  ],
  // Gallery 3: Sky Villa Penthouse
  [
    {
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&auto=format&fit=crop&q=80',
      caption: 'Không gian phòng khách Penthouse với trần cao 6 mét kính Panorama',
      tag: 'Phòng khách Sky Villa'
    },
    {
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&auto=format&fit=crop&q=80',
      caption: 'Mặt bằng tổng thể tòa tháp và khuôn viên trung tâm',
      tag: 'Flycam tổng thể'
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&auto=format&fit=crop&q=80',
      caption: 'Cầu thang nghệ thuật kết nối các tầng căn hộ cao cấp',
      tag: 'Cầu thang nghệ thuật'
    },
    {
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&auto=format&fit=crop&q=80',
      caption: 'Góc thư giãn đọc sách và quầy bar rượu sang trọng',
      tag: 'Khu thư giãn'
    },
    {
      url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1400&auto=format&fit=crop&q=80',
      caption: 'Bản vẽ chi tiết thiết kế căn hộ cao cấp',
      tag: 'Bản vẽ kiến trúc'
    }
  ]
];

export function DistrictPropertyExplorer() {
  // ── VIEW MODE (Split-Screen Map vs Masterplan Interactive) ──
  const [isMasterplanMode, setIsMasterplanMode] = useState<boolean>(false);

  // ── STATE MANAGEMENT THEO YÊU CẦU: selectedPhotos & isGalleryOpen ──
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [selectedPropertyInfo, setSelectedPropertyInfo] = useState<{ title: string; price: string } | null>(null);

  // Hàm mở Photo Gallery Modal (Lightbox)
  const openPhotoGallery = useCallback((
    images: (string | GalleryImage)[],
    title?: string,
    price?: string,
    initialIndex = 0
  ) => {
    const normalizedUrls = images && images.length > 0
      ? images.map((img) => (typeof img === 'string' ? img : img.url))
      : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1400&auto=format&fit=crop&q=80'
        ];
    
    setSelectedPhotos(normalizedUrls);
    setSelectedPhotoIndex(initialIndex);
    setSelectedPropertyInfo(title ? { title, price: price || '' } : null);
    setIsGalleryOpen(true);
  }, []);

  // ── FILTER STATES ──
  const [keyword, setKeyword] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tất cả quận');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');

  // ── INTERACTIVE BI-DIRECTIONAL SELECTION ──
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  // ── MOBILE VIEW TOGGLE ('map' | 'list') ──
  const [mobileView, setMobileView] = useState<'map' | 'list'>('list');

  // Dropdown open states
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [purposeDropdownOpen, setPurposeDropdownOpen] = useState(false);

  // Card element references for auto-scroll into view when map pin is clicked
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdowns on outside click
  const filterContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterContainerRef.current && !filterContainerRef.current.contains(e.target as Node)) {
        setDistrictDropdownOpen(false);
        setTypeDropdownOpen(false);
        setStatusDropdownOpen(false);
        setPurposeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enrich mock listings with labels, badges, and rich room-angle galleries
  const enrichedListings: SplitPropertyItem[] = useMemo(() => {
    const badges = ['✓ Đã xác minh', '🔥 Dự án Hot', '📜 Sổ đỏ sẵn', '💎 VIP Mở bán'];
    const statuses = [
      { label: 'Đang mở bán', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { label: 'Còn 3 căn', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { label: 'Đang giao dịch', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { label: 'Sắp bàn giao', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    ];

    return mockListings.map((item, idx) => {
      const statusObj = statuses[idx % statuses.length];
      const baseGallery = SAMPLE_GALLERIES[idx % SAMPLE_GALLERIES.length];

      // Custom gallery combining item's primary image and angle shots
      const gallery: GalleryImage[] = [
        {
          url: item.images[0] || baseGallery[0].url,
          caption: `${item.title} - Toàn cảnh căn hộ & Không gian tổng quan`,
          tag: 'Tổng quan'
        },
        ...baseGallery.slice(1)
      ];

      return {
        ...item,
        badgeText: badges[idx % badges.length],
        statusLabel: statusObj.label,
        statusBadgeColor: statusObj.color,
        purpose: idx % 4 === 1 ? 'rent' : 'sale',
        gallery
      };
    });
  }, []);

  // Filter listings based on controls
  const filteredListings = useMemo(() => {
    return enrichedListings.filter((item) => {
      // 1. Keyword search (title, address, district)
      if (keyword.trim()) {
        const query = keyword.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchAddr = item.address.toLowerCase().includes(query);
        const matchDist = item.district.toLowerCase().includes(query);
        if (!matchTitle && !matchAddr && !matchDist) return false;
      }

      // 2. District filter
      if (selectedDistrict !== 'Tất cả quận' && item.district !== selectedDistrict) {
        return false;
      }

      // 3. Property Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // 4. Purpose filter (Bán / Cho thuê)
      if (selectedPurpose !== 'all' && item.purpose !== selectedPurpose) {
        return false;
      }

      // 5. Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'available' && !item.statusLabel?.includes('mở bán')) return false;
        if (selectedStatus === 'limited' && !item.statusLabel?.includes('Còn')) return false;
        if (selectedStatus === 'trading' && !item.statusLabel?.includes('giao dịch')) return false;
        if (selectedStatus === 'handover' && !item.statusLabel?.includes('bàn giao')) return false;
      }

      return true;
    });
  }, [enrichedListings, keyword, selectedDistrict, selectedType, selectedPurpose, selectedStatus]);

  // ── MARKER CLICK TRÊN BẢN ĐỒ: MỞ NGAY POPUP XEM ẢNH, KHÔNG CHUYỂN TRANG ──
  const handleMarkerClick = useCallback((id: string) => {
    setActiveListingId(id);
    const item = enrichedListings.find((l) => l.id === id);
    if (item) {
      const photos = item.gallery.map((g) => g.url) || item.images;
      openPhotoGallery(photos, item.title, formatCurrencyVND(item.price), 0);
    }
    const cardEl = cardRefs.current[id];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [enrichedListings, openPhotoGallery]);

  // Reset all filters
  const handleResetFilters = () => {
    setKeyword('');
    setSelectedDistrict('Tất cả quận');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedPurpose('all');
    setActiveListingId(null);
    setHoveredListingId(null);
  };

  return (
    <section id="map-search" className="bg-[#F8FAFC] py-8 sm:py-12 border-y border-slate-200/80 relative">
      <div className="container max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-[#FF6600] font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BẢN ĐỒ BẤT ĐỘNG SẢN HÀ NỘI &amp; MẶT BẰNG DỰ ÁN</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy mt-1 tracking-tight">
              {isMasterplanMode
                ? 'Khám phá Mặt bằng & Phân căn Dự án'
                : 'Tìm nhà trên bản đồ Hà Nội'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Bấm vào bất kỳ ghim bản đồ hoặc thẻ BĐS nào để xem trọn bộ ảnh góc nhà sắc nét
            </p>
          </div>

          {/* Controls: Mode Switcher + Planning link */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* View Mode Toggle: Map Split-Screen vs Interactive Masterplan */}
            <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setIsMasterplanMode(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !isMasterplanMode
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5 text-[#FF6600]" />
                <span>Bản đồ Hà Nội</span>
              </button>
              
              <button
                type="button"
                onClick={() => setIsMasterplanMode(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMasterplanMode
                    ? 'bg-[#FF6600] text-white shadow-md'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Sơ đồ Mặt bằng &amp; Phân căn</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black uppercase">
                  MỚI
                </span>
              </button>
            </div>

            {/* Quick Planning Link */}
            <Link
              href="/planning"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-orange-50 hover:text-[#FF6600] border border-slate-200 px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-[#FF6600]" />
              <span>Quy hoạch 2030</span>
            </Link>

            {/* Mobile View Toggle Buttons (Only when in Map Mode) */}
            {!isMasterplanMode && (
              <div className="flex lg:hidden bg-slate-200 p-0.5 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMobileView('map')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                    mobileView === 'map' ? 'bg-[#FF6600] text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Bản đồ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                    mobileView === 'list' ? 'bg-[#FF6600] text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Danh sách ({filteredListings.length})</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            MODE SWITCH RENDERING:
            Mode A: TƯƠNG TÁC MẶT BẰNG & PHÂN CĂN (MasterplanView)
            Mode B: SPLIT-SCREEN GOOGLE MAPS + LISTING CARDS
           ════════════════════════════════════════════════════════════ */}
        {isMasterplanMode ? (
          <MasterplanView
            onBack={() => setIsMasterplanMode(false)}
            onOpenLightbox={(images, index, title) => {
              const urls = images.map((img) => (typeof img === 'string' ? img : img.url));
              openPhotoGallery(urls, title, '', index || 0);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ──────────────────────────────────────────────────────────
                CỘT TRÁI (45% - 48%): BẢN ĐỒ TƯƠNG TÁC (LEAFLET / GOOGLE MAPS)
                CLICK MARKER / TAG → MỞ NGAY POPUP XEM BỘ ẢNH BĐS
               ────────────────────────────────────────────────────────── */}
            <div
              className={`lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 z-10 transition-all ${
                mobileView === 'list' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="h-[480px] sm:h-[580px] lg:h-[730px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/90 relative bg-slate-900">
                
                {/* Map Component */}
                <SearchMap
                  listings={filteredListings as any}
                  selectedListingId={activeListingId}
                  hoveredListingId={hoveredListingId}
                  targetDistrict={selectedDistrict === 'Tất cả quận' ? undefined : selectedDistrict}
                  onMarkerClick={handleMarkerClick}
                  onMarkerHover={(id) => setHoveredListingId(id)}
                />

                {/* Floating Top Badge on Map */}
                <div className="absolute top-3 left-3 z-[1000] pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-2 text-xs font-bold text-navy">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6600] animate-pulse" />
                    <span>
                      {selectedDistrict === 'Tất cả quận' ? 'Hà Nội' : `Quận ${selectedDistrict}`} ({filteredListings.length} ghim BĐS)
                    </span>
                  </div>
                </div>

                {/* Floating Quick District Chips on Bottom of Map */}
                <div className="absolute bottom-3 left-3 right-3 z-[1000] overflow-x-auto scrollbar-none flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                  <span className="text-[10px] font-bold text-white/80 uppercase px-2 shrink-0">Nhanh:</span>
                  {['Đống Đa', 'Cầu Giấy', 'Ba Đình', 'Tây Hồ', 'Nam Từ Liêm'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDistrict(d)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                        selectedDistrict === d
                          ? 'bg-[#FF6600] text-white shadow-sm'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────
                CỘT PHẢI (52% - 55%): THANH LỌC + LƯỚI CARD BĐS (SCROLLABLE)
                CLICK VÀO BẤT KỲ CARD / ẢNH → MỞ NGAY POPUP XEM BỘ ẢNH BĐS
               ────────────────────────────────────────────────────────── */}
            <div
              className={`lg:col-span-7 xl:col-span-7 flex flex-col space-y-4 ${
                mobileView === 'map' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              
              {/* 1. THANH LỌC NẰM NGANG (HORIZONTAL FILTER BAR - STYLE HIỆN ĐẠI) */}
              <div
                ref={filterContainerRef}
                className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-sm space-y-3"
              >
                {/* Row 1: Search Box + Quick Filter Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  
                  {/* Keyword search input */}
                  <div className="sm:col-span-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên đường, dự án..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs font-medium text-navy placeholder-slate-400 border border-slate-200/80 rounded-xl outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 transition-all"
                    />
                    {keyword && (
                      <button
                        type="button"
                        onClick={() => setKeyword('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Dropdown 1: Quận / Huyện */}
                  <div className="sm:col-span-3 relative">
                    <button
                      type="button"
                      onClick={() => {
                        setDistrictDropdownOpen(!districtDropdownOpen);
                        setTypeDropdownOpen(false);
                        setStatusDropdownOpen(false);
                        setPurposeDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-navy border border-slate-200/80 rounded-xl transition-all cursor-pointer"
                    >
                      <span className="truncate">
                        {selectedDistrict === 'Tất cả quận' ? '📍 Tất cả quận' : `📍 ${selectedDistrict}`}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                    </button>

                    {/* Dropdown Menu */}
                    {districtDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-56 overflow-y-auto text-xs">
                        {DISTRICT_OPTIONS.map((dist) => (
                          <button
                            key={dist}
                            type="button"
                            onClick={() => {
                              setSelectedDistrict(dist);
                              setDistrictDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#FF6600] flex items-center justify-between cursor-pointer ${
                              selectedDistrict === dist ? 'font-bold text-[#FF6600] bg-orange-50/50' : 'text-slate-700'
                            }`}
                          >
                            <span>{dist}</span>
                            {selectedDistrict === dist && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dropdown 2: Loại BĐS */}
                  <div className="sm:col-span-4 relative">
                    <button
                      type="button"
                      onClick={() => {
                        setTypeDropdownOpen(!typeDropdownOpen);
                        setDistrictDropdownOpen(false);
                        setStatusDropdownOpen(false);
                        setPurposeDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-navy border border-slate-200/80 rounded-xl transition-all cursor-pointer"
                    >
                      <span className="truncate">
                        {PROPERTY_TYPES.find((t) => t.value === selectedType)?.label}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                    </button>

                    {/* Dropdown Menu */}
                    {typeDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                        {PROPERTY_TYPES.map((pt) => (
                          <button
                            key={pt.value}
                            type="button"
                            onClick={() => {
                              setSelectedType(pt.value);
                              setTypeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#FF6600] flex items-center justify-between cursor-pointer ${
                              selectedType === pt.value ? 'font-bold text-[#FF6600] bg-orange-50/50' : 'text-slate-700'
                            }`}
                          >
                            <span>{pt.label}</span>
                            {selectedType === pt.value && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Row 2: Secondary Filters (Hình thức, Tình trạng, Reset) */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Dropdown 3: Hình thức (Bán / Cho thuê) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setPurposeDropdownOpen(!purposeDropdownOpen);
                          setDistrictDropdownOpen(false);
                          setTypeDropdownOpen(false);
                          setStatusDropdownOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {selectedPurpose === 'all' ? 'Mục đích: Tất cả' : selectedPurpose === 'sale' ? 'Mục đích: Bán' : 'Mục đích: Thuê'}
                        </span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {purposeDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                          {PURPOSE_OPTIONS.map((po) => (
                            <button
                              key={po.value}
                              type="button"
                              onClick={() => {
                                setSelectedPurpose(po.value);
                                setPurposeDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#FF6600] flex items-center justify-between cursor-pointer ${
                                selectedPurpose === po.value ? 'font-bold text-[#FF6600]' : 'text-slate-700'
                              }`}
                            >
                              <span>{po.label}</span>
                              {selectedPurpose === po.value && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dropdown 4: Tình trạng (Mở bán / Còn 3 căn / Giao dịch) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setStatusDropdownOpen(!statusDropdownOpen);
                          setDistrictDropdownOpen(false);
                          setTypeDropdownOpen(false);
                          setPurposeDropdownOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label}
                        </span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {statusDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                          {STATUS_OPTIONS.map((st) => (
                            <button
                              key={st.value}
                              type="button"
                              onClick={() => {
                                setSelectedStatus(st.value);
                                setStatusDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#FF6600] flex items-center justify-between cursor-pointer ${
                                selectedStatus === st.value ? 'font-bold text-[#FF6600]' : 'text-slate-700'
                              }`}
                            >
                              <span>{st.label}</span>
                              {selectedStatus === st.value && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Clear filter chip if active */}
                    {(keyword || selectedDistrict !== 'Tất cả quận' || selectedType !== 'all' || selectedPurpose !== 'all' || selectedStatus !== 'all') && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        title="Xóa tất cả bộ lọc"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Đặt lại</span>
                      </button>
                    )}
                  </div>

                  {/* Total results count */}
                  <div className="text-slate-500 font-medium text-[11px] ml-auto">
                    Tìm thấy <strong className="text-[#FF6600] font-bold">{filteredListings.length}</strong> bất động sản
                  </div>
                </div>
              </div>

              {/* 2. LƯỚI DANH SÁCH THẺ BẤT ĐỘNG SẢN (GRID 2 CỘT, SCROLLABLE MƯỢT) */}
              <div className="max-h-[580px] lg:max-h-[635px] overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredListings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6600] flex items-center justify-center mx-auto text-xl">
                      🔍
                    </div>
                    <h3 className="font-bold text-sm text-navy">Không tìm thấy bất động sản phù hợp</h3>
                    <p className="text-xs text-slate-400">
                      Vui lòng đổi quận hoặc xóa bớt tiêu chí lọc để xem thêm các căn nhà khác.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-[#FF6600] text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer"
                    >
                      Xem tất cả BĐS Hà Nội
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {filteredListings.map((item) => {
                      const isSelected = activeListingId === item.id;
                      const isHovered = hoveredListingId === item.id;
                      const photos = item.gallery?.map((g) => g.url) || item.images;

                      return (
                        <div
                          key={item.id}
                          ref={(el) => { cardRefs.current[item.id] = el; }}
                          onMouseEnter={() => setHoveredListingId(item.id)}
                          onMouseLeave={() => setHoveredListingId(null)}
                          onClick={() => {
                            // HỦY BỎ ĐIỀU HƯỚNG TRANG -> MỞ NGAY POPUP XEM ẢNH
                            setActiveListingId(item.id);
                            openPhotoGallery(photos, item.title, formatCurrencyVND(item.price), 0);
                          }}
                          className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between p-3 cursor-pointer ${
                            isSelected
                              ? 'border-[#FF6600] ring-2 ring-[#FF6600]/30 shadow-xl bg-orange-50/10 -translate-y-1'
                              : isHovered
                              ? 'border-[#FF6600] shadow-lg -translate-y-1'
                              : 'border-slate-200/90 hover:border-orange-300 hover:shadow-md shadow-sm'
                          }`}
                        >
                          {/* ── ẢNH CARD: BẤM VÀO MỞ NGAY POPUP LIGHTBOX XEM ẢNH ── */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              openPhotoGallery(photos, item.title, formatCurrencyVND(item.price), 0);
                            }}
                            className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5 cursor-zoom-in group/img"
                            title="Bấm vào ảnh để mở Popup xem bộ ảnh BĐS"
                          >
                            <img
                              src={item.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                            />

                            {/* Tag / Badge đè lên góc trái ảnh */}
                            <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-black/60 backdrop-blur-md shadow-sm">
                                {item.badgeText || '✓ Đã xác minh'}
                              </span>
                            </div>

                            {/* Badge số góc ảnh (Gallery Counter Badge) */}
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#FF6600] transition-colors shadow-sm z-10">
                              <Eye className="w-3 h-3 text-orange-400" />
                              <span>{photos.length} ảnh</span>
                            </div>

                            {/* Overlay hover zoom hint */}
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                              <ZoomIn className="w-4 h-4 text-orange-400" />
                              <span>Bấm xem trọn bộ ảnh</span>
                            </div>

                            {/* Overlay Giá tiền nổi bật ở góc dưới trái ảnh */}
                            <div className="absolute bottom-2 left-2 bg-[#FF6600] text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow-md z-10">
                              {formatCurrencyVND(item.price)}
                            </div>
                          </div>

                          {/* Chi tiết nội dung Thẻ BĐS (Không dùng link chuyển trang) */}
                          <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                            <div>
                              {/* Tiêu đề BĐS */}
                              <h4 className="font-bold text-xs sm:text-sm text-navy group-hover:text-[#FF6600] transition-colors line-clamp-1 leading-snug">
                                {item.title}
                              </h4>

                              {/* Vị trí Quận / Huyện */}
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                                <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
                                <span className="truncate">{item.ward ? `${item.ward}, ` : ''}{item.district}, Hà Nội</span>
                              </p>
                            </div>

                            {/* Thông số kỹ thuật (Số phòng & Diện tích) */}
                            <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold pt-1 border-t border-slate-100 mt-2">
                              <span className="flex items-center gap-1">
                                <span>📐</span>
                                <span>{item.area} m²</span>
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Bed className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.bedrooms || 3} PN</span>
                              </span>
                              {item.floors > 0 && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Building className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{item.floors}T</span>
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Card Footer: Nhãn tình trạng + Nút Mở Ảnh (Không chuyển trang) */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 gap-2">
                              {/* Nhãn dán tình trạng (Pill shape) */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border truncate ${
                                  item.statusBadgeColor || 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                ● {item.statusLabel || 'Đang mở bán'}
                              </span>

                              {/* Action buttons (CHỈ XEM ẢNH / MẶT BẰNG, KHÔNG CHUYỂN TRANG) */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Button xem Masterplan */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMasterplanMode(true);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#FF6600] text-[11px] font-bold border border-orange-200/80 transition-colors cursor-pointer"
                                  title="Xem sơ đồ phân căn dự án này"
                                >
                                  📐 Mặt bằng
                                </button>

                                {/* Nút MỞ BỘ ẢNH BĐS (THAY THẾ HOÀN TOÀN XEM CHI TIẾT) */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPhotoGallery(photos, item.title, formatCurrencyVND(item.price), 0);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-[11px] shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Xem ảnh</span>
                                </button>
                              </div>
                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════════════
          POPUP XEM ẢNH (IMAGE LIGHTBOX MODAL) ĐÈ LÊN TRANG CHỦ
          - Dark Overlay backdrop-blur
          - Bộ ảnh chính giữa màn hình
          - Nút điều hướng Trái / Phải
          - Đếm số lượng ảnh & dải ảnh nhỏ
          - Nút Đóng (Icon X) & ESC
          - Thanh thông tin cực nhỏ gọn: [Tên BĐS] - [Giá tiền]
          (KHÔNG CÓ NÚT XEM CHI TIẾT HAY LINK CHUYỂN TRANG)
         ════════════════════════════════════════════════════════════ */}
      <LightboxModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={selectedPhotos}
        initialIndex={selectedPhotoIndex}
        propertyTitle={selectedPropertyInfo?.title || ''}
        propertyPrice={selectedPropertyInfo?.price || ''}
      />

    </section>
  );
}

export default DistrictPropertyExplorer;
