'use client';

import React from 'react';
import { Search, SlidersHorizontal, MapPin, Building, DollarSign } from 'lucide-react';
import { PropertyType } from '@/types/database';

interface FilterPanelProps {
  onSearchChange?: (text: string) => void;
  onDistrictChange?: (district: string) => void;
  onTypeChange?: (type: PropertyType | 'all') => void;
}

const HANOI_DISTRICTS = [
  'Tất cả quận',
  'Cầu Giấy',
  'Ba Đình',
  'Đống Đa',
  'Hoàn Kiếm',
  'Tây Hồ',
  'Hai Bà Trưng',
  'Thanh Xuân',
  'Nam Từ Liêm',
  'Bắc Từ Liêm',
  'Hà Đông',
  'Long Biên',
  'Hoàng Mai',
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onSearchChange,
  onDistrictChange,
  onTypeChange,
}) => {
  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card p-3 shadow-md backdrop-blur-md">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search by keyword/street */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo đường, dự án, từ khoá..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* District Select */}
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <select
            onChange={(e) => onDistrictChange?.(e.target.value)}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {HANOI_DISTRICTS.map((district) => (
              <option key={district} value={district === 'Tất cả quận' ? '' : district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="relative flex items-center">
          <Building className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <select
            onChange={(e) => onTypeChange?.(e.target.value as any)}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Tất cả loại BĐS</option>
            <option value="house">Nhà riêng / Nhà phố</option>
            <option value="apartment">Chung cư</option>
            <option value="land">Đất nền / Đất thổ cư</option>
            <option value="villa">Biệt thự</option>
            <option value="shophouse">Shophouse</option>
          </select>
        </div>

        {/* Filter Trigger / Price Button */}
        <div className="flex items-center gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2 px-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Bộ lọc nâng cao</span>
          </button>
        </div>
      </div>
    </div>
  );
};
