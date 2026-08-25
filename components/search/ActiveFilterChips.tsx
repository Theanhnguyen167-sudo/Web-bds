'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters, DEFAULT_SEARCH_FILTERS } from '@/lib/search/filterListings';
import { X, RotateCcw } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

interface ActiveFilterChipsProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters, value?: any) => void;
  onReset: () => void;
  count: number;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemove,
  onReset,
  count,
}) => {
  if (count === 0) return null;

  const chips: { key: keyof SearchFilters; label: string; value?: any }[] = [];

  // Keyword
  if (filters.keyword.trim()) {
    chips.push({ key: 'keyword', label: `🔍 "${filters.keyword}"` });
  }

  // Type
  if (filters.type !== 'all') {
    const typeLabels: Record<string, string> = {
      house: '🏠 Nhà phố',
      apartment: '🏢 Chung cư',
      land: '🌿 Đất nền',
      villa: '🏰 Biệt thự',
      commercial: '🏪 Thương mại',
      project: '🏗️ Dự án',
    };
    chips.push({ key: 'type', label: typeLabels[filters.type] || filters.type });
  }

  // District
  if (filters.district && filters.district !== 'Tất cả quận' && filters.district !== 'all') {
    chips.push({ key: 'district', label: `📍 Quận ${filters.district}` });
  }

  // Ward
  if (filters.ward && filters.ward !== 'Tất cả phường') {
    chips.push({ key: 'ward', label: `Phường ${filters.ward}` });
  }

  // Street
  if (filters.street.trim()) {
    chips.push({ key: 'street', label: `Đường: ${filters.street}` });
  }

  // Price
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    let priceLabel = '💰 ';
    if (filters.minPrice && filters.maxPrice) {
      priceLabel += `${filters.minPrice / 1e9} - ${filters.maxPrice / 1e9} tỷ`;
    } else if (filters.minPrice) {
      priceLabel += `≥ ${filters.minPrice / 1e9} tỷ`;
    } else if (filters.maxPrice) {
      priceLabel += `≤ ${filters.maxPrice / 1e9} tỷ`;
    }
    chips.push({ key: 'minPrice', label: priceLabel });
  }

  // Area
  if (filters.minArea !== null || filters.maxArea !== null) {
    let areaLabel = '📐 ';
    if (filters.minArea && filters.maxArea) {
      areaLabel += `${filters.minArea} - ${filters.maxArea} m²`;
    } else if (filters.minArea) {
      areaLabel += `≥ ${filters.minArea} m²`;
    } else if (filters.maxArea) {
      areaLabel += `≤ ${filters.maxArea} m²`;
    }
    chips.push({ key: 'minArea', label: areaLabel });
  }

  // Bedrooms
  if (filters.minBedrooms !== null) {
    chips.push({ key: 'minBedrooms', label: `🛏 ${filters.minBedrooms}+ PN` });
  }

  // Directions
  filters.direction.forEach((dir) => {
    chips.push({ key: 'direction', label: `🧭 Hướng ${dir}`, value: dir });
  });

  // Legal status
  filters.legalStatus.forEach((legal) => {
    chips.push({ key: 'legalStatus', label: `📜 ${legal}`, value: legal });
  });

  // Features
  filters.features.forEach((feat) => {
    chips.push({ key: 'features', label: `⭐ ${feat}`, value: feat });
  });

  // Near Metro
  if (filters.nearMetro) {
    chips.push({ key: 'nearMetro', label: `🚆 Gần Metro (< ${filters.nearRadius}km)` });
  }

  // Featured only
  if (filters.featuredOnly) {
    chips.push({ key: 'featuredOnly', label: '🔥 Tin nổi bật' });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-orange-50/50 dark:bg-slate-900/80 border-b border-orange-100 dark:border-slate-800 px-3 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none z-20 shrink-0 text-xs"
      >
        <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
          Đang lọc:
        </span>

        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {chips.map((chip, idx) => (
            <motion.span
              key={`${chip.key}-${chip.value || idx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 font-semibold px-2.5 py-1 rounded-full shadow-2xs"
            >
              <span>{chip.label}</span>
              <button
                onClick={() => onRemove(chip.key, chip.value)}
                className="hover:bg-orange-100 dark:hover:bg-slate-700 rounded-full p-0.5 text-orange-600 dark:text-orange-300 transition-colors"
                title="Bỏ lọc"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </div>

        {chips.length > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline shrink-0 flex items-center gap-1 ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Xoá tất cả ({count})</span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
