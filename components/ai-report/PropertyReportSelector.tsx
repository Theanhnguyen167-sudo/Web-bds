'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ListingItem, mockListings } from '@/lib/mock-data';
import { formatCurrencyVND } from '@/lib/utils';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  MapPin,
  X,
  Check,
  Maximize2,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface PropertyReportSelectorProps {
  currentListing: ListingItem;
  onSelectListing: (listing: ListingItem) => void;
}

export const PropertyReportSelector: React.FC<PropertyReportSelectorProps> = ({
  currentListing,
  onSelectListing,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const currentIndex = mockListings.findIndex((l) => l.id === currentListing.id);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + mockListings.length) % mockListings.length;
    onSelectListing(mockListings[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % mockListings.length;
    onSelectListing(mockListings[nextIndex]);
  };

  // Distinct districts list
  const districts = useMemo(() => {
    const list = Array.from(new Set(mockListings.map((l) => l.district))).filter(Boolean);
    return ['all', ...list];
  }, []);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return mockListings.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
      const matchType = selectedType === 'all' || item.type === selectedType;

      return matchSearch && matchDistrict && matchType;
    });
  }, [searchQuery, selectedDistrict, selectedType]);

  const getTypeName = (type: string) => {
    switch (type) {
      case 'apartment':
        return 'Chung cư';
      case 'villa':
        return 'Biệt thự';
      case 'land':
        return 'Đất nền';
      default:
        return 'Nhà riêng';
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Banner Control: Selected Property & Switcher Button */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-200/70 dark:border-orange-950/60 bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-orange-950/20 p-4 sm:p-5 shadow-sm backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Current Property Mini Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl overflow-hidden border border-border shadow-inner">
              <Image
                src={currentListing.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'}
                alt={currentListing.title}
                fill
                sizes="64px"
                className="object-cover"
              />
              <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.2 text-[9px] font-bold text-white uppercase backdrop-blur-xs">
                {getTypeName(currentListing.type)}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 dark:bg-accent/20 px-2.5 py-0.5 text-[10px] font-black text-accent">
                  <Sparkles className="h-3 w-3" />
                  Đang xem báo cáo
                </span>
                <span className="text-[11px] font-bold text-text-muted">
                  BĐS #{currentListing.id} ({currentIndex + 1}/{mockListings.length})
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-extrabold text-text-primary truncate">
                {currentListing.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5">
                <span className="font-extrabold text-accent">
                  {formatCurrencyVND(currentListing.price)}
                </span>
                <span>•</span>
                <span>{currentListing.area} m²</span>
                <span>•</span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 text-accent shrink-0" />
                  {currentListing.district}, Hà Nội
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Prev, Next & Open Selector Modal */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {/* Quick Prev Button */}
            <button
              onClick={handlePrev}
              title="Xem BĐS trước đó"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white dark:bg-slate-800 text-text-secondary hover:text-accent hover:border-accent shadow-sm transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Quick Next Button */}
            <button
              onClick={handleNext}
              title="Xem BĐS kế tiếp"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white dark:bg-slate-800 text-text-secondary hover:text-accent hover:border-accent shadow-sm transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Main Switcher Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpenModal(true)}
              className="flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-white px-3.5 py-2 text-xs font-black shadow-md shadow-accent/20 transition-colors"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Đổi BĐS Khác</span>
            </motion.button>
          </div>

        </div>
      </div>

      {/* Property Selection Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[88vh] rounded-3xl border border-border bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
            >
              
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between bg-page-bg/40">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-md">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-text-primary">
                      Chọn Bất Động Sản Xem Báo Cáo AI
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Chọn một bất động sản từ danh mục Hà Nội để xem chi tiết thẩm định và tiềm năng quy hoạch
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpenModal(false)}
                  className="rounded-full p-2 text-text-muted hover:text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filters & Search Input */}
              <div className="p-4 sm:p-6 border-b border-border space-y-3 bg-white dark:bg-slate-900">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên bất động sản, đường phố, quận huyện..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-page-bg text-text-primary text-xs sm:text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* District Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  <span className="text-[11px] font-bold text-text-muted mr-1 shrink-0 flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    Quận:
                  </span>
                  {districts.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDistrict(d)}
                      className={`shrink-0 px-3 py-1 rounded-full font-bold transition-all ${
                        selectedDistrict === d
                          ? 'bg-accent text-white shadow-sm'
                          : 'bg-page-bg text-text-secondary hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      {d === 'all' ? 'Tất cả quận' : d}
                    </button>
                  ))}
                </div>

                {/* Property Type Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <span className="text-[11px] font-bold text-text-muted mr-1 shrink-0">Loại BĐS:</span>
                  {[
                    { id: 'all', label: 'Tất cả loại hình' },
                    { id: 'house', label: 'Nhà riêng' },
                    { id: 'apartment', label: 'Chung cư' },
                    { id: 'villa', label: 'Biệt thự' },
                    { id: 'land', label: 'Đất thổ cư' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`shrink-0 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                        selectedType === t.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-text-secondary hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Grid List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-text-muted">
                    <p className="text-sm font-semibold">Không tìm thấy bất động sản phù hợp.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDistrict('all');
                        setSelectedType('all');
                      }}
                      className="mt-2 text-xs font-bold text-accent hover:underline"
                    >
                      Xóa bộ lọc để xem tất cả
                    </button>
                  </div>
                ) : (
                  filteredListings.map((item) => {
                    const isSelected = item.id === currentListing.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectListing(item);
                          setIsOpenModal(false);
                        }}
                        className={`group relative flex flex-col rounded-2xl border p-3 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md'
                            : 'border-border bg-white dark:bg-slate-900 hover:border-accent/60 hover:shadow-lg'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5">
                          <Image
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-xs">
                            {getTypeName(item.type)}
                          </div>
                          <div className="absolute bottom-2 left-2 rounded-md bg-primary/90 px-2 py-0.5 text-xs font-black text-white shadow-sm backdrop-blur-xs">
                            {formatCurrencyVND(item.price)}
                          </div>

                          {isSelected && (
                            <div className="absolute top-2 right-2 rounded-full bg-accent text-white p-1 shadow-md">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Title & Info */}
                        <h4 className="text-xs font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                          {item.title}
                        </h4>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-text-secondary pt-2 border-t border-border/80">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 text-accent shrink-0" />
                            {item.district}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-text-primary">
                            <Maximize2 className="h-3 w-3 text-slate-400" />
                            {item.area} m²
                          </span>
                        </div>

                        {/* CTA Bottom Bar */}
                        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                          <span className="text-[10px] text-text-muted">
                            Quy hoạch {item.planningYear || 2030}
                          </span>
                          <span className={`text-[11px] font-black ${isSelected ? 'text-accent' : 'text-text-muted group-hover:text-accent'}`}>
                            {isSelected ? '✓ Đang xem' : 'Xem báo cáo AI →'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 border-t border-border bg-page-bg/50 flex items-center justify-between text-xs text-text-secondary">
                <span>
                  Hiển thị <strong className="text-text-primary">{filteredListings.length}</strong> / {mockListings.length} bất động sản tại Hà Nội
                </span>
                <button
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-1.5 rounded-xl border border-border bg-white dark:bg-slate-800 text-xs font-bold text-text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Đóng
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
