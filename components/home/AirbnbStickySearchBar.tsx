'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Building2,
  Compass,
  ChevronDown,
  X,
  ArrowUp,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';

// ── Property Types ──
const propertyTypes = [
  { value: 'all', label: 'Tất cả loại BĐS', shortLabel: 'Tất cả BĐS', icon: '🏠' },
  { value: 'house', label: 'Nhà phố / Nhà riêng', shortLabel: 'Nhà phố', icon: '🏠' },
  { value: 'apartment', label: 'Chung cư / Căn hộ', shortLabel: 'Chung cư', icon: '🏢' },
  { value: 'land', label: 'Đất nền / Trang trại', shortLabel: 'Đất nền', icon: '🌿' },
  { value: 'villa', label: 'Biệt thự / Villa', shortLabel: 'Biệt thự', icon: '🏰' },
  { value: 'commercial', label: 'Văn phòng / Thương mại', shortLabel: 'Văn phòng', icon: '🏪' },
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

// ── Price Presets ──
const pricePresets = [
  { label: 'Tất cả mức giá', shortLabel: 'Tất cả giá', value: 'all' },
  { label: 'Dưới 1 tỷ', shortLabel: '< 1 tỷ', value: '0-1' },
  { label: '1 - 3 tỷ', shortLabel: '1 - 3 tỷ', value: '1-3' },
  { label: '3 - 5 tỷ', shortLabel: '3 - 5 tỷ', value: '3-5' },
  { label: '5 - 10 tỷ', shortLabel: '5 - 10 tỷ', value: '5-10' },
  { label: '10 - 20 tỷ', shortLabel: '10 - 20 tỷ', value: '10-20' },
  { label: 'Trên 20 tỷ', shortLabel: '> 20 tỷ', value: '20-999' },
];

// ── Area Presets ──
const areaPresets = [
  { label: 'Tất cả diện tích', shortLabel: 'Tất cả DT', value: 'all' },
  { label: 'Dưới 30m²', shortLabel: '< 30m²', value: '0-30' },
  { label: '30 - 50m²', shortLabel: '30 - 50m²', value: '30-50' },
  { label: '50 - 80m²', shortLabel: '50 - 80m²', value: '50-80' },
  { label: '80 - 100m²', shortLabel: '80 - 100m²', value: '80-100' },
  { label: '100 - 150m²', shortLabel: '100 - 150m²', value: '100-150' },
  { label: 'Trên 150m²', shortLabel: '> 150m²', value: '150-9999' },
];

export function AirbnbStickySearchBar() {
  const router = useRouter();

  // Scroll state & expand state
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Search filter values
  const [searchTab, setSearchTab] = useState<'buy' | 'rent' | 'project' | 'estimate'>('buy');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [areaRange, setAreaRange] = useState<string>('all');

  // Dropdown open states for full search box
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState<boolean>(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState<boolean>(false);
  const [areaDropdownOpen, setAreaDropdownOpen] = useState<boolean>(false);

  const heroSearchRef = useRef<HTMLDivElement>(null);
  const expandedModalRef = useRef<HTMLDivElement>(null);

  // 1. Scroll listener (scrollY > 50px)
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      // Auto close expanded modal if user scrolls back to the very top
      if (!scrolled) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      // Close dropdowns inside hero
      if (heroSearchRef.current && !heroSearchRef.current.contains(target)) {
        setTypeDropdownOpen(false);
        setLocationDropdownOpen(false);
        setPriceDropdownOpen(false);
        setAreaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Escape key listener to close expanded modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        setTypeDropdownOpen(false);
        setLocationDropdownOpen(false);
        setPriceDropdownOpen(false);
        setAreaDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autocomplete filter for districts
  const filteredDistricts = useMemo(() => {
    if (!locationQuery.trim()) return popularDistricts;
    return popularDistricts.filter((d) =>
      d.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [locationQuery]);

  // Execute Search
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

    setIsExpanded(false);
    router.push(`/search?${params.toString()}`);
  };

  // Compute compact summary text
  const compactTypeLabel = useMemo(() => {
    const match = propertyTypes.find((t) => t.value === selectedType);
    return match ? match.shortLabel : 'Tất cả BĐS';
  }, [selectedType]);

  const compactLocationLabel = useMemo(() => {
    if (locationQuery.trim()) {
      return locationQuery.trim();
    }
    return 'Hà Nội';
  }, [locationQuery]);

  const compactPriceLabel = useMemo(() => {
    if (customMinPrice || customMaxPrice) {
      return `${customMinPrice || '0'} - ${customMaxPrice || '∞'} tỷ`;
    }
    const match = pricePresets.find((p) => p.value === priceRange);
    return match ? match.shortLabel : 'Tất cả mức giá';
  }, [priceRange, customMinPrice, customMaxPrice]);

  // Smooth scroll to top handler
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsExpanded(false);
  };

  // Render the core Search Controls (used in Hero & in Expanded Modal)
  const renderSearchControls = () => (
    <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 text-slate-800 border border-slate-100">
      {/* SEGMENT 1: Loại BĐS */}
      <div className={`relative md:w-44 shrink-0 ${typeDropdownOpen ? 'z-50' : ''}`}>
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
              className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 z-[100] text-left"
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
      <div className={`relative flex-1 ${locationDropdownOpen ? 'z-50' : ''}`}>
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
          {locationQuery && (
            <button
              type="button"
              onClick={() => setLocationQuery('')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        <AnimatePresence>
          {locationDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white p-3 shadow-2xl border border-slate-100 z-[100] text-left max-h-72 overflow-y-auto"
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
      <div className={`relative md:w-40 shrink-0 ${priceDropdownOpen ? 'z-50' : ''}`}>
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
              className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-72 rounded-xl bg-white p-3 shadow-2xl border border-slate-100 z-[100] text-left"
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
      <div className={`relative md:w-36 shrink-0 ${areaDropdownOpen ? 'z-50' : ''}`}>
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
              className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 z-[100] text-left"
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
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all text-sm shrink-0 cursor-pointer"
      >
        <Search className="h-4 w-4" />
        <span>Tìm kiếm</span>
      </motion.button>
    </div>
  );

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO IN-PLACE FLOATING SEARCH WIDGET CHUẨN ẢNH 2 (scrollY <= 50)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div ref={heroSearchRef} className="w-full relative z-30 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] border border-slate-200/90 text-left">
          {/* HÀNG TRÊN (TABS FILTER): 3 nút dạng viên thuốc (Pill tabs) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {[
              { key: 'buy', label: 'Mua bán BĐS', icon: '🏠' },
              { key: 'rent', label: 'Cho thuê BĐS', icon: '🔑' },
              { key: 'project', label: 'Dự án & Quy hoạch', icon: '🏗️' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSearchTab(tab.key as any)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  searchTab === tab.key
                    ? 'bg-[#0f172a] text-white shadow-md shadow-slate-900/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* HÀNG DƯỚI (INPUTS BAR): Khung bo tròn chia 3 cột thông tin + Nút Tìm kiếm cam */}
          <div className="mt-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center bg-white transition-all">
            
            {/* CỘT 1: ĐỊA ĐIỂM */}
            <div className={`relative flex-1 ${locationDropdownOpen ? 'z-50' : ''}`}>
              <div className="px-3 py-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Địa điểm
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setLocationDropdownOpen(true);
                    }}
                    onFocus={() => setLocationDropdownOpen(true)}
                    placeholder="Quận, huyện, tên đường..."
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400 py-0.5 truncate"
                  />
                  {locationQuery && (
                    <button
                      type="button"
                      onClick={() => setLocationQuery('')}
                      className="p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {locationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white p-3 shadow-2xl border border-slate-100 z-[100] text-left max-h-72 overflow-y-auto"
                  >
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                      Khu vực phổ biến Hà Nội
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
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-colors text-xs cursor-pointer"
                        >
                          <span className="font-semibold flex items-center gap-2">
                            <span>🏙️</span>
                            <span>Quận {district.name}, Hà Nội</span>
                          </span>
                          <span className="text-[11px] text-slate-400">{district.count} tin</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phân cách kẻ dọc mảnh */}
            <div className="hidden md:block w-px h-9 bg-slate-200 mx-2 shrink-0" />

            {/* CỘT 2: LOẠI HÌNH BĐS */}
            <div className={`relative md:w-56 shrink-0 ${typeDropdownOpen ? 'z-50' : ''}`}>
              <button
                type="button"
                onClick={() => {
                  setTypeDropdownOpen(!typeDropdownOpen);
                  setLocationDropdownOpen(false);
                  setPriceDropdownOpen(false);
                }}
                className="w-full px-3 py-1 text-left cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Loại hình BĐS
                </span>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {propertyTypes.find((t) => t.value === selectedType)?.shortLabel || 'Tất cả loại BĐS'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-600" />
                </div>
              </button>

              {/* Dropdown Types */}
              <AnimatePresence>
                {typeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 z-[100] text-left"
                  >
                    {propertyTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setSelectedType(type.value);
                          setTypeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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

            {/* Phân cách kẻ dọc mảnh */}
            <div className="hidden md:block w-px h-9 bg-slate-200 mx-2 shrink-0" />

            {/* CỘT 3: KHOẢNG GIÁ */}
            <div className={`relative md:w-48 shrink-0 ${priceDropdownOpen ? 'z-50' : ''}`}>
              <button
                type="button"
                onClick={() => {
                  setPriceDropdownOpen(!priceDropdownOpen);
                  setTypeDropdownOpen(false);
                  setLocationDropdownOpen(false);
                }}
                className="w-full px-3 py-1 text-left cursor-pointer group"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Mức giá
                </span>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-orange-500 font-bold text-xs sm:text-sm shrink-0">₫</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {compactPriceLabel}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-600" />
                </div>
              </button>

              {/* Dropdown Price Range */}
              <AnimatePresence>
                {priceDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-72 rounded-xl bg-white p-3 shadow-2xl border border-slate-100 z-[100] text-left"
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
                          className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
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
                        className="w-full py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* NÚT TÌM KIẾM HÌNH VUÔNG BO GÓC MÀU CAM NỔI BẬT VỚI KÍNH LÚP TRẮNG Ở GIỮA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleExecuteSearch}
              title="Tìm kiếm ngay"
              className="w-12 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all hover:scale-105 shrink-0 ml-1.5 sm:ml-2.5 cursor-pointer mt-2 md:mt-0"
            >
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </motion.button>

          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. STICKY COMPACT SEARCH BAR CHUẨN AIRBNB (scrollY > 50px)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence>
        {isScrolled && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-2.5 left-1/2 -translate-x-1/2 z-[60] w-auto max-w-[94vw] sm:max-w-xl md:max-w-2xl"
          >
            <div
              onClick={() => setIsExpanded(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsExpanded(true);
                }
              }}
              title="Click để bung mở bộ lọc tìm kiếm hoặc chỉnh sửa thông số"
              className="group cursor-pointer flex items-center gap-1.5 sm:gap-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-full border border-slate-200/90 hover:border-orange-400/80 shadow-md hover:shadow-xl px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 ease-in-out backdrop-blur-md select-none ring-1 ring-black/5 hover:scale-[1.02]"
            >
              {/* Pill Segment 1: Loại BĐS */}
              <div className="flex items-center gap-1.5 px-1 sm:px-2">
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight whitespace-nowrap">
                  {compactTypeLabel}
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-4 sm:h-5 bg-slate-200 shrink-0" />

              {/* Pill Segment 2: Địa điểm */}
              <div className="flex items-center gap-1.5 px-1 sm:px-2 max-w-[110px] sm:max-w-[160px] truncate">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0 hidden sm:inline" />
                <span className="text-xs sm:text-sm font-semibold text-slate-600 truncate">
                  {compactLocationLabel}
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-4 sm:h-5 bg-slate-200 shrink-0" />

              {/* Pill Segment 3: Mức giá */}
              <div className="flex items-center gap-1 px-1 sm:px-2">
                <span className="text-xs sm:text-sm font-normal text-slate-500 tracking-tight whitespace-nowrap">
                  {compactPriceLabel}
                </span>
              </div>

              {/* Search Icon Orange Circle Button */}
              <div className="ml-1 sm:ml-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:bg-orange-600 group-hover:scale-105 transition-all duration-300 shrink-0">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. EXPANDED SEARCH MODAL OVERLAY CHUẨN AIRBNB (Khi click compact pill)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence>
        {isScrolled && isExpanded && (
          <div className="fixed inset-0 z-[70] flex flex-col items-center">
            {/* Dark Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            />

            {/* Expanded Search Header Container */}
            <motion.div
              ref={expandedModalRef}
              initial={{ opacity: 0, y: -30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-3 sm:pt-4"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl text-white">
                {/* Header Row: Title & Action buttons */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white">
                        Bộ lọc tìm kiếm BĐS Hà Nội
                      </h3>
                      <p className="text-[11px] text-slate-300">
                        Điều chỉnh thông số hoặc cuộn về đầu trang
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Button: Scroll to Top */}
                    <button
                      type="button"
                      onClick={handleScrollToTop}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 hover:text-white transition-all border border-white/10 cursor-pointer"
                      title="Cuộn mượt về đầu trang"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Về đầu trang</span>
                    </button>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Đóng (ESC)"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs Row */}
                <div className="flex items-center justify-center gap-4 sm:gap-7 mb-3 text-xs sm:text-sm font-bold">
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
                      className={`relative pb-1.5 transition-all cursor-pointer ${
                        searchTab === tab.key
                          ? 'text-white font-extrabold'
                          : 'text-white/60 hover:text-white/90 font-medium'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {searchTab === tab.key && (
                        <motion.div
                          layoutId="expandedSearchTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-orange-500"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Full Search Controls */}
                {renderSearchControls()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AirbnbStickySearchBar;
