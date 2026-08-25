'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { SearchListingCard } from './SearchListingCard';
import { Search, MapPin, Sparkles, FilterX } from 'lucide-react';

interface ListingsPanelProps {
  listings: ListingItem[];
  selectedId: string | null;
  hoveredId: string | null;
  savedIds: string[];
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onSaveToggle: (id: string) => void;
  isLoading?: boolean;
  onResetFilters: () => void;
}

export const ListingsPanel: React.FC<ListingsPanelProps> = ({
  listings,
  selectedId,
  hoveredId,
  savedIds,
  onSelect,
  onHover,
  onSaveToggle,
  isLoading,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="p-3 space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 animate-pulse border border-slate-100 dark:border-slate-700"
          >
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center my-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-orange-500 flex items-center justify-center text-2xl shadow-inner">
          🔍
        </div>
        <h4 className="font-extrabold text-sm text-navy dark:text-white">
          Không tìm thấy bất động sản phù hợp
        </h4>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Hãy thử nới lỏng khoảng giá, mở rộng diện tích hoặc chọn quận huyện lân cận.
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-md"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 space-y-2.5">
      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Hiển thị {listings.length} tin</span>
        <span className="text-orange-500 font-semibold lowercase">click thẻ để bay tới map</span>
      </div>

      <AnimatePresence mode="popLayout">
        {listings.map((listing) => (
          <SearchListingCard
            key={listing.id}
            listing={listing}
            isSelected={selectedId === listing.id}
            isHovered={hoveredId === listing.id}
            isSaved={savedIds.includes(listing.id)}
            onHover={onHover}
            onClick={onSelect}
            onSaveToggle={onSaveToggle}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
