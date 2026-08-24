'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ListingCard } from '@/components/listing/ListingCard';
import { useApp } from '@/lib/context/AppContext';
import { ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Home,
  Building2,
  Trees,
  Landmark,
  Compass,
  FilterX,
  Map as MapIcon,
  List as ListIcon,
  Grid as GridIcon,
  ArrowUpDown,
  Maximize2,
  Bed,
  Bath,
  Layers,
  Heart,
  ChevronRight,
  Sparkles,
  Command,
  HelpCircle,
  Building
} from 'lucide-react';

const SearchMap = dynamic(
  () => import('@/components/map/SearchMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#1a2744] flex items-center justify-center">
        <div className="text-white/50 text-sm">Đang tải bản đồ...</div>
      </div>
    )
  }
);

const HANOI_DISTRICTS = [
  'Tất cả quận',
  'Đống Đa',
  'Hoàn Kiếm',
  'Cầu Giấy',
  'Tây Hồ',
  'Long Biên',
  'Nam Từ Liêm',
  'Ba Đình',
  'Thanh Xuân',
  'Hai Bà Trưng',
  'Hà Đông',
  'Hoàng Mai',
];

const PROPERTY_TYPES = [
  { id: 'all', label: 'Tất cả', icon: Compass },
  { id: 'house', label: 'Nhà phố', icon: Home },
  { id: 'apartment', label: 'Chung cư', icon: Building2 },
  { id: 'land', label: 'Đất nền', icon: Trees },
  { id: 'villa', label: 'Biệt thự', icon: Landmark },
];

function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { listings, activeListingId, setActiveListingId, savedListingIds, toggleSaveListing } = useApp();

  // Read initial filter values from URL params
  const initialSearch = searchParams.get('search') || '';
  const initialDistrict = searchParams.get('district') || 'Tất cả quận';
  const initialType = searchParams.get('type') || 'all';
  const initialMaxPrice = Number(searchParams.get('maxPrice')) || 50000000000;
  const initialMinPrice = Number(searchParams.get('minPrice')) || 0;
  const initialSort = (searchParams.get('sort') as 'newest' | 'price_asc' | 'price_desc' | 'area_desc') || 'newest';
  const initialView = (searchParams.get('view') as 'map' | 'list' | 'grid') || 'map';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedType, setSelectedType] = useState(initialType);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'area_desc'>(initialSort);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'grid'>(initialView);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showPlanningLayer, setShowPlanningLayer] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('list');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state to URL Query Params without full reload
  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedDistrict && selectedDistrict !== 'Tất cả quận') params.set('district', selectedDistrict);
    if (selectedType && selectedType !== 'all') params.set('type', selectedType);
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 50000000000) params.set('maxPrice', maxPrice.toString());
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (viewMode !== 'map') params.set('view', viewMode);

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  }, [searchTerm, selectedDistrict, selectedType, minPrice, maxPrice, sortBy, viewMode, pathname, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateQueryParams();
    }, 300);
    return () => clearTimeout(timer);
  }, [updateQueryParams]);

  // Keyboard shortcut: Press "/" to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard Hint auto fade-in after 2s, fade-out after 5s
  useEffect(() => {
    const showTimer = setTimeout(() => setShowKeyboardHint(true), 2000);
    const hideTimer = setTimeout(() => setShowKeyboardHint(false), 7000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('Tất cả quận');
    setSelectedType('all');
    setMinPrice(0);
    setMaxPrice(50000000000);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedDistrict !== 'Tất cả quận' ||
    selectedType !== 'all' ||
    minPrice > 0 ||
    maxPrice < 50000000000;

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    const results = listings.filter((item) => {
      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.district.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (selectedDistrict !== 'Tất cả quận' && item.district !== selectedDistrict) {
        return false;
      }
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }
      if (item.price < minPrice || item.price > maxPrice) {
        return false;
      }
      return true;
    });

    return results.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'area_desc') return b.area - a.area;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, searchTerm, selectedDistrict, selectedType, minPrice, maxPrice, sortBy]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-page-bg">
      <Navbar />

      {/* Main Container below navbar */}
      <div className="relative flex flex-1 flex-col overflow-hidden pt-16">
        
        {/* ── 1. PAGE HEADER BAR (Breadcrumbs & View Mode Switcher) ── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="z-30 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:px-6 py-2.5 shadow-sm"
        >
          {/* Left: Breadcrumbs + Count */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1 text-xs font-semibold text-text-muted hover:text-accent transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-text-muted" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-navy">🔍 Tìm kiếm BĐS</span>
              <span className="hidden sm:inline-block text-xs text-gray-500">
                · Đang hiển thị <strong className="text-accent">{filteredListings.length}</strong> bất động sản tại Hà Nội
              </span>
            </div>
          </div>

          {/* Right: View Toggle Buttons [Danh sách] [Grid] [Bản đồ] */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-navy hover:bg-slate-200/60'
              }`}
              title="Xem dạng danh sách chi tiết"
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Danh sách</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-navy hover:bg-slate-200/60'
              }`}
              title="Xem dạng lưới nhiều cột"
            >
              <GridIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-navy hover:bg-slate-200/60'
              }`}
              title="Xem bản đồ kết hợp danh sách"
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bản đồ</span>
            </button>
          </div>
        </motion.header>

        {/* ── 2. MAIN CONTENT ACCORDING TO VIEW MODE ── */}
        <div className="relative flex flex-1 overflow-hidden">
          
          {/* ── MODE A: SPLIT MAP VIEW (DEFAULT) ── */}
          {viewMode === 'map' && (
            <div className="flex w-full h-full overflow-hidden">
              {/* Left Sidebar Filter + Listings Feed (30% width) */}
              <section
                className={`h-full w-full md:w-[30%] min-w-[280px] max-w-[360px] flex-shrink-0 flex flex-col z-10 border-r border-border bg-white ${
                  mobileView === 'map' ? 'hidden md:flex' : 'flex'
                }`}
              >
                {/* Search & Filter Header Container */}
                <div className="sticky top-0 z-20 border-b border-border/60 bg-white/95 p-4 backdrop-blur-md space-y-3">
                  {/* Search Bar Input with shortcut hint */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-text-muted" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm theo đường, dự án, từ khoá... (Nhấn /)"
                      className="w-full rounded-xl border border-input bg-page-bg pl-10 pr-10 py-2.5 text-xs font-semibold text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    />
                    {searchTerm ? (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 text-xs text-text-muted hover:text-text-primary"
                      >
                        ✕
                      </button>
                    ) : (
                      <kbd className="hidden sm:flex absolute right-3 h-5 items-center gap-0.5 rounded border border-gray-300 bg-gray-100 px-1.5 text-[10px] font-mono text-gray-500">
                        /
                      </kbd>
                    )}
                  </div>

                  {/* Property Type Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {PROPERTY_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <motion.button
                          key={type.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedType(type.id)}
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                            isSelected
                              ? 'bg-accent text-white shadow-sm shadow-accent/20'
                              : 'bg-page-bg text-text-secondary hover:bg-slate-200/70'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{type.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Quick Filter Row: District Dropdown & Price Slider & Planning Toggle */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-accent pointer-events-none" />
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-input bg-page-bg pl-9 pr-7 py-2 text-xs font-bold text-text-primary focus:border-accent focus:outline-none cursor-pointer"
                      >
                        {HANOI_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPriceFilter(!showPriceFilter)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                        showPriceFilter || maxPrice < 50000000000
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-input bg-page-bg text-text-secondary hover:bg-slate-200/70'
                      }`}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Mức giá</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPlanningLayer(!showPlanningLayer)}
                      className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition-all ${
                        showPlanningLayer
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                          : 'border-input bg-page-bg text-text-secondary hover:bg-slate-200/70'
                      }`}
                      title="Bật/tắt lớp quy hoạch Hà Nội"
                    >
                      <Layers className="h-3.5 w-3.5" />
                    </motion.button>

                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-text-muted hover:text-danger hover:bg-red-50 transition-colors flex-shrink-0"
                        title="Đặt lại bộ lọc"
                      >
                        <FilterX className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Expandable Price Range Slider */}
                  <AnimatePresence>
                    {showPriceFilter && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl border border-border bg-page-bg p-3 space-y-2 overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-text-secondary">Giá tối đa:</span>
                          <span className="text-accent">{formatCurrencyVND(maxPrice)}</span>
                        </div>
                        <input
                          type="range"
                          min={2000000000}
                          max={50000000000}
                          step={1000000000}
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full accent-accent cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-text-muted">
                          <span>2 Tỷ</span>
                          <span>25 Tỷ</span>
                          <span>50+ Tỷ</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Results Count & Sort bar inside sidebar */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-border/50 text-xs">
                  <span className="font-bold text-gray-700">
                    Tìm thấy <span className="text-accent font-black">{filteredListings.length}</span> bất động sản
                  </span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <span>Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-semibold text-navy outline-none cursor-pointer"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="price_asc">Giá tăng dần</option>
                      <option value="price_desc">Giá giảm dần</option>
                      <option value="area_desc">Diện tích lớn nhất</option>
                    </select>
                  </div>
                </div>

                {/* Listings Cards Feed Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
                      ))}
                    </div>
                  ) : filteredListings.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 gap-4">
                      {filteredListings.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          id={`listing-card-${item.id}`}
                          onMouseEnter={() => setHoveredId(item.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.3) }}
                        >
                          <ListingCard listing={item} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    /* Empty state */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="py-16 text-center space-y-3"
                    >
                      <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                        <Search className="h-8 w-8" />
                      </div>
                      <h3 className="text-base font-bold text-navy">Không tìm thấy kết quả phù hợp</h3>
                      <p className="text-xs text-gray-500 max-w-xs mx-auto">
                        Thử thay đổi bộ lọc, giảm giá tối đa hoặc mở rộng khu vực tìm kiếm.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-colors"
                      >
                        Đặt lại bộ lọc
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Keyboard Shortcut Floating Hint */}
                <AnimatePresence>
                  {showKeyboardHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 left-4 z-30 bg-navy/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl shadow-lg text-[11px] flex items-center gap-2 border border-slate-700"
                    >
                      <span>⌨️ Nhấn phím <kbd className="bg-white/20 px-1 rounded font-mono font-bold">/</kbd> để tìm kiếm nhanh</span>
                      <button onClick={() => setShowKeyboardHint(false)} className="text-white/60 hover:text-white ml-1">✕</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Right Side: Map Container (70% width) */}
              <section
                className={`h-full flex-1 relative ${
                  mobileView === 'list' ? 'hidden md:flex' : 'flex'
                }`}
              >
                <SearchMap
                  listings={filteredListings}
                  selectedListingId={activeListingId}
                  hoveredListingId={hoveredId}
                  onMarkerClick={(id) => {
                    setActiveListingId(id);
                    document.getElementById(`listing-card-${id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }}
                  onMarkerHover={(id) => setHoveredId(id)}
                  showPlanningLayer={showPlanningLayer}
                />
              </section>

              {/* Mobile View Toggle Button */}
              <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center rounded-full bg-primary p-1 shadow-2xl border border-slate-700 text-white"
                >
                  <button
                    onClick={() => setMobileView('list')}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                      mobileView === 'list' ? 'bg-accent text-white' : 'text-slate-300'
                    }`}
                  >
                    <ListIcon className="h-4 w-4" />
                    <span>Danh sách</span>
                  </button>
                  <button
                    onClick={() => setMobileView('map')}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                      mobileView === 'map' ? 'bg-accent text-white' : 'text-slate-300'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Bản đồ</span>
                  </button>
                </motion.div>
              </div>
            </div>
          )}

          {/* ── MODE B: FULL WIDTH GRID VIEW ── */}
          {viewMode === 'grid' && (
            <div className="flex w-full h-full overflow-hidden">
              {/* Left Filter Sidebar (280px) */}
              <aside className="w-72 border-r border-border bg-white p-4 overflow-y-auto space-y-4 hidden lg:block">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Bộ lọc tìm kiếm</h3>
                
                {/* Search */}
                <div>
                  <label className="text-xs font-semibold text-navy block mb-1">Từ khoá</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tên đường, dự án..."
                    className="w-full rounded-xl border border-input p-2.5 text-xs outline-none focus:border-accent"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="text-xs font-semibold text-navy block mb-1">Quận / Huyện</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full rounded-xl border border-input p-2.5 text-xs outline-none focus:border-accent"
                  >
                    {HANOI_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-semibold text-navy block mb-1">Loại hình BĐS</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PROPERTY_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`p-2 rounded-lg text-xs font-bold text-center transition-all ${
                          selectedType === t.id
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Giá tối đa:</span>
                    <span className="text-accent">{formatCurrencyVND(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000000000}
                    max={50000000000}
                    step={1000000000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-xl text-xs font-bold transition-colors"
                  >
                    Đặt lại toàn bộ lọc
                  </button>
                )}
              </aside>

              {/* Right: 3-column Grid Feed */}
              <main className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-navy">
                    Tìm thấy <span className="text-accent">{filteredListings.length}</span> bất động sản
                  </p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-navy outline-none"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="area_desc">Diện tích lớn nhất</option>
                  </select>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredListings.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                      >
                        <ListingCard listing={item} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-3">
                    <Search className="h-12 w-12 text-gray-300 mx-auto" />
                    <h3 className="text-lg font-bold text-navy">Không tìm thấy kết quả phù hợp</h3>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>
                )}
              </main>
            </div>
          )}

          {/* ── MODE C: FULL WIDTH DETAILED LIST VIEW (ROW CARDS) ── */}
          {viewMode === 'list' && (
            <div className="flex w-full h-full overflow-hidden">
              {/* Left Filter Sidebar */}
              <aside className="w-72 border-r border-border bg-white p-4 overflow-y-auto space-y-4 hidden lg:block">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Bộ lọc danh sách</h3>
                <div>
                  <label className="text-xs font-semibold text-navy block mb-1">Từ khoá</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tên đường, dự án..."
                    className="w-full rounded-xl border border-input p-2.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-navy block mb-1">Quận / Huyện</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full rounded-xl border border-input p-2.5 text-xs outline-none focus:border-accent"
                  >
                    {HANOI_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-navy block mb-1">Loại hình BĐS</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PROPERTY_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`p-2 rounded-lg text-xs font-bold text-center transition-all ${
                          selectedType === t.id
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Giá tối đa:</span>
                    <span className="text-accent">{formatCurrencyVND(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000000000}
                    max={50000000000}
                    step={1000000000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-xl text-xs font-bold transition-colors"
                  >
                    Đặt lại toàn bộ lọc
                  </button>
                )}
              </aside>

              {/* Right: Table / Row Style Listings */}
              <main className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-navy">
                    Tìm thấy <span className="text-accent">{filteredListings.length}</span> bất động sản
                  </p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-navy outline-none"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="area_desc">Diện tích lớn nhất</option>
                  </select>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="space-y-3">
                    {filteredListings.map((item, idx) => {
                      const isSaved = savedListingIds.includes(item.id);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                          className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all group"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 flex gap-1">
                              {item.isFeatured && (
                                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                  ⭐ VIP
                                </span>
                              )}
                              <span className="bg-navy/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                                {item.planningZone}
                              </span>
                            </div>
                          </div>

                          {/* Center Details */}
                          <div className="flex-1 min-w-0 space-y-1.5 w-full">
                            <Link href={`/listings/${item.id}`} className="block">
                              <h4 className="text-sm font-bold text-navy hover:text-orange-500 transition-colors line-clamp-1">
                                {item.title}
                              </h4>
                            </Link>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                              <span className="truncate">{item.address}</span>
                            </p>

                            <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                              <span className="flex items-center gap-1 font-semibold">
                                <Maximize2 className="h-3.5 w-3.5 text-accent" />
                                {item.area} m²
                              </span>
                              <span className="flex items-center gap-1">
                                <Bed className="h-3.5 w-3.5 text-gray-400" />
                                {item.bedrooms} PN
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath className="h-3.5 w-3.5 text-gray-400" />
                                {item.bathrooms} PT
                              </span>
                              <span className="flex items-center gap-1">
                                <Building className="h-3.5 w-3.5 text-gray-400" />
                                {item.floors} tầng
                              </span>
                            </div>
                          </div>

                          {/* Right: Price & Actions */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                            <div className="text-left sm:text-right">
                              <p className="text-base font-black text-orange-500">
                                {formatCurrencyVND(item.price)}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {formatPricePerM2(item.price, item.area)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleSaveListing(item.id)}
                                className={`p-2 rounded-xl border transition-colors ${
                                  isSaved
                                    ? 'border-red-200 bg-red-50 text-red-500'
                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                }`}
                                title={isSaved ? 'Đã lưu' : 'Lưu tin'}
                              >
                                <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500' : ''}`} />
                              </button>
                              <Link
                                href={`/listings/${item.id}`}
                                className="px-3.5 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy/90 transition-colors"
                              >
                                Xem chi tiết →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-3">
                    <Search className="h-12 w-12 text-gray-300 mx-auto" />
                    <h3 className="text-lg font-bold text-navy">Không tìm thấy kết quả phù hợp</h3>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>
                )}
              </main>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-page-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
            <p className="text-xs font-semibold text-gray-500">Đang tải dữ liệu tìm kiếm...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </React.Suspense>
  );
}
