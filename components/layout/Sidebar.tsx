'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { ListingCard } from '@/components/listing/ListingCard';
import { formatCurrencyVND } from '@/lib/utils';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Home,
  Building2,
  Trees,
  Landmark,
  Compass,
  FilterX
} from 'lucide-react';

interface SidebarProps {
  listings: ListingItem[];
  filteredListings: ListingItem[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
}

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

export const Sidebar: React.FC<SidebarProps> = ({
  listings,
  filteredListings,
  searchTerm,
  setSearchTerm,
  selectedDistrict,
  setSelectedDistrict,
  selectedType,
  setSelectedType,
  maxPrice,
  setMaxPrice,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('Tất cả quận');
    setSelectedType('all');
    setMaxPrice(50000000000);
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedDistrict !== 'Tất cả quận' ||
    selectedType !== 'all' ||
    maxPrice < 50000000000;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex h-full w-full flex-col border-r border-border/80 bg-white"
    >
      {/* Search & Filter Header Container */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-white/95 p-4 backdrop-blur-md space-y-3">
        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên đường, dự án, từ khoá..."
            className="w-full rounded-xl border border-input bg-page-bg pl-10 pr-3.5 py-2.5 text-xs font-semibold text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 text-xs text-text-muted hover:text-text-primary"
            >
              ✕
            </button>
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

        {/* Quick Filter Row: District Dropdown & Advanced Trigger */}
        <div className="flex items-center gap-2">
          {/* District Dropdown */}
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-accent pointer-events-none" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-page-bg pl-9 pr-7 py-2 text-xs font-bold text-text-primary focus:border-accent focus:outline-none"
            >
              {HANOI_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Price Slider Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
              showFilters || maxPrice < 50000000000
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-input bg-page-bg text-text-secondary hover:bg-slate-200/70'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Mức giá</span>
          </motion.button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-text-muted hover:text-danger hover:bg-red-50 transition-colors"
              title="Đặt lại bộ lọc"
            >
              <FilterX className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Expandable Price Range Slider */}
        <AnimatePresence>
          {showFilters && (
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

      {/* Listings Cards Feed Container */}
      <div id="search-feed" className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            Tìm thấy <span className="text-accent font-extrabold">{filteredListings.length}</span> bất động sản
          </span>
          <span className="text-[11px] text-text-muted font-medium">Hà Nội · Sắp xếp mới nhất</span>
        </div>

        {/* Animated Stagger List */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredListings.length > 0 ? (
              filteredListings.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.3) }}
                >
                  <ListingCard listing={item} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 py-12 text-center text-text-muted space-y-2"
              >
                <Home className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Không tìm thấy bất động sản phù hợp với bộ lọc.</p>
                <button
                  onClick={resetFilters}
                  className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/20"
                >
                  Xoá bộ lọc tìm kiếm
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
};
