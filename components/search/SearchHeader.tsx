'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters } from '@/lib/search/filterListings';
import {
  Search,
  X,
  Map as MapIcon,
  List as ListIcon,
  Grid as GridIcon,
  ArrowUpDown,
  Bell,
  RotateCcw,
  SlidersHorizontal,
  Loader2,
  MapPin,
  Building2
} from 'lucide-react';

interface SearchHeaderProps {
  filters: SearchFilters;
  onFilterChange: (update: Partial<SearchFilters> | ((prev: SearchFilters) => SearchFilters)) => void;
  activeCount: number;
  resultCount: number;
  viewMode: 'map' | 'list' | 'grid';
  onViewModeChange: (mode: 'map' | 'list' | 'grid') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  onOpenSaveSearch?: () => void;
  onToggleMobileFilter?: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onFilterChange,
  activeCount,
  resultCount,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onReset,
  onOpenSaveSearch,
  onToggleMobileFilter,
}) => {
  // ── CLEAN ASYNC PATTERNS: AbortController search with instant suggestions ──
  const [searchTerm, setSearchTerm] = useState(filters.keyword || '');
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; address: string; district: string; price: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync external filter keyword changes into local state
  useEffect(() => {
    setSearchTerm(filters.keyword || '');
  }, [filters.keyword]);

  // Clean Async Pattern: Abort previous pending fetch on keystroke
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // 1. Hủy bỏ (abort) bất kỳ request nào đang chạy trước đó
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/listings?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json?.data) ? json.data : [];
          // Lọc theo từ khóa phù hợp
          const matches = items
            .filter((item: any) =>
              item.title?.toLowerCase().includes(trimmed.toLowerCase()) ||
              item.address?.toLowerCase().includes(trimmed.toLowerCase()) ||
              item.district?.toLowerCase().includes(trimmed.toLowerCase())
            )
            .slice(0, 5);
          setSuggestions(matches);
          setShowDropdown(matches.length > 0);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Bỏ qua lỗi do người dùng tiếp tục gõ làm hủy request cũ
          return;
        }
        console.error('Search suggestions error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  const handleSelectSuggestion = (item: { title: string; district: string }) => {
    setSearchTerm(item.title);
    setShowDropdown(false);
    onFilterChange({ keyword: item.title });
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowDropdown(false);
    onFilterChange({ keyword: '' });
  };

  return (
    <div className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 relative z-30 shadow-sm">
      
      {/* ── LEFT SIDE: Keyword Search & Quick Tabs ── */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        {/* Keyword Search Input with Clean Async Suggestions */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          {isSearching ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500 animate-spin pointer-events-none" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              onFilterChange({ keyword: val });
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Tìm theo địa chỉ, dự án, từ khoá..."
            className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all touch-manipulation"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              title="Xoá tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showDropdown && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 overflow-hidden"
              >
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Gợi ý kết quả khớp
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <Building2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{item.address || item.district}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sale / Rent Toggle Pills (Hidden on very small screens) */}
        <div className="hidden sm:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
          <button
            onClick={() => onFilterChange({ listingType: 'sale' })}
            className={`px-3 py-1 rounded-lg transition-all ${
              filters.listingType === 'sale'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
            }`}
          >
            🏠 Mua bán
          </button>
          <button
            onClick={() => onFilterChange({ listingType: 'rent' })}
            className={`px-3 py-1 rounded-lg transition-all ${
              filters.listingType === 'rent'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
            }`}
          >
            🔑 Cho thuê
          </button>
        </div>
      </div>

      {/* ── CENTER: Result count indicator ── */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <span>Tìm thấy</span>
        <strong className="text-orange-600 font-extrabold text-sm">{resultCount}</strong>
        <span>bất động sản</span>
      </div>

      {/* ── RIGHT SIDE: Sort, View Mode & Action Buttons ── */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        {/* Mobile Filter Trigger Button */}
        {onToggleMobileFilter && (
          <button
            onClick={onToggleMobileFilter}
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 text-xs font-bold"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Bộ lọc {activeCount > 0 && `(${activeCount})`}</span>
          </button>
        )}

        {/* Sort Select */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer font-medium text-xs pr-1"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp → Cao</option>
            <option value="price_desc">Giá: Cao → Thấp</option>
            <option value="area_desc">Diện tích: Lớn → Nhỏ</option>
            <option value="price_m2_asc">Giá/m²: Thấp → Cao</option>
          </select>
        </div>

        {/* View Mode Toggle (Map, List, Grid) */}
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
          <button
            onClick={() => onViewModeChange('map')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Xem bản đồ & danh sách"
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Bản đồ</span>
          </button>

          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Xem danh sách ngang"
          >
            <ListIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Danh sách</span>
          </button>

          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Xem dạng lưới card"
          >
            <GridIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Lưới</span>
          </button>
        </div>

        {/* Save Search Button */}
        {onOpenSaveSearch && (
          <button
            onClick={onOpenSaveSearch}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-orange-600 text-xs font-bold transition-all shadow-sm"
            title="Nhận thông báo khi có tin mới"
          >
            <Bell className="h-3.5 w-3.5 text-orange-500" />
            <span>Lưu tìm kiếm</span>
          </button>
        )}

      </div>
    </div>
  );
};
