'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Building2, 
  RotateCcw, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';
import { BrokerListing, BrokerListingFilterState } from '@/types/broker-listing';
import { BrokerProfile } from '@/types/broker-nav';
import { HANOI_DISTRICTS } from '@/lib/data/broker-mock-listings';
import { BrokerListingCard } from './BrokerListingCard';

interface OpenListingPoolProps {
  listings: BrokerListing[];
  profile: BrokerProfile;
  onToggleCurate: (id: string) => void;
  onOpenMarketingKit: (listing: BrokerListing) => void;
  onRestrictedClick: (featureName: string) => void;
}

const INITIAL_FILTERS: BrokerListingFilterState = {
  keyword: '',
  purpose: 'all',
  district: 'Tất cả Quận/Huyện',
  propertyType: 'all',
  priceRange: 'all',
  legalStatus: 'all',
};

export const OpenListingPool: React.FC<OpenListingPoolProps> = ({
  listings,
  profile,
  onToggleCurate,
  onOpenMarketingKit,
  onRestrictedClick,
}) => {
  const [filters, setFilters] = useState<BrokerListingFilterState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Lọc dữ liệu theo đa tiêu chí
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Keyword search (mã BĐS, tiêu đề, địa chỉ)
      if (filters.keyword.trim()) {
        const query = filters.keyword.toLowerCase();
        const matchCode = item.propertyCode.toLowerCase().includes(query);
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchAddress = item.address.toLowerCase().includes(query);
        if (!matchCode && !matchTitle && !matchAddress) return false;
      }

      // 2. Purpose (Bán / Thuê)
      if (filters.purpose !== 'all' && item.purpose !== filters.purpose) {
        return false;
      }

      // 3. District
      if (filters.district !== 'Tất cả Quận/Huyện' && item.district !== filters.district) {
        return false;
      }

      // 4. Property type
      if (filters.propertyType !== 'all' && item.propertyType !== filters.propertyType) {
        return false;
      }

      // 5. Price range
      if (filters.priceRange !== 'all') {
        const priceInBillion = item.price / 1_000_000_000;
        if (filters.priceRange === 'under_3b' && priceInBillion >= 3) return false;
        if (filters.priceRange === '3b_6b' && (priceInBillion < 3 || priceInBillion > 6)) return false;
        if (filters.priceRange === '6b_10b' && (priceInBillion < 6 || priceInBillion > 10)) return false;
        if (filters.priceRange === '10b_20b' && (priceInBillion < 10 || priceInBillion > 20)) return false;
        if (filters.priceRange === 'above_20b' && priceInBillion < 20) return false;
      }

      // 6. Legal status
      if (filters.legalStatus !== 'all') {
        const legal = item.legalStatus.toLowerCase();
        if (filters.legalStatus === 'so_do' && !legal.includes('sổ đỏ')) return false;
        if (filters.legalStatus === 'so_hong' && !legal.includes('sổ hồng')) return false;
        if (filters.legalStatus === 'cho_so' && !legal.includes('chờ') && !legal.includes('hợp đồng')) return false;
      }

      return true;
    });
  }, [listings, filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="space-y-5">
      {/* KHỐI BỘ LỌC ĐA TIÊU CHÍ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Hàng 1: Search Keyword & View switcher */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã BĐS (HR-BDS-xxxx), Tên đường, Quận, hoặc Tiêu đề..."
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                showAdvancedFilters
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Bộ lọc nâng cao</span>
            </button>

            {/* View Switcher: Grid vs List */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng lưới thẻ"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng danh sách"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hàng 2: Bộ lọc nhanh Quận / Tầm giá / Loại hình */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Nhu cầu */}
          <select
            value={filters.purpose}
            onChange={(e) => setFilters({ ...filters, purpose: e.target.value as any })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Mọi nhu cầu (Bán & Cho thuê)</option>
            <option value="sale">BĐS Cần Bán</option>
            <option value="rent">BĐS Cho Thuê</option>
          </select>

          {/* Quận Huyện */}
          <select
            value={filters.district}
            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {HANOI_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Tầm giá */}
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value as any })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả tầm giá</option>
            <option value="under_3b">Dưới 3 tỷ</option>
            <option value="3b_6b">Từ 3 - 6 tỷ</option>
            <option value="6b_10b">Từ 6 - 10 tỷ</option>
            <option value="10b_20b">Từ 10 - 20 tỷ</option>
            <option value="above_20b">Trên 20 tỷ</option>
          </select>

          {/* Loại hình BĐS */}
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value as any })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Mọi loại hình BĐS</option>
            <option value="house">Nhà riêng / Nhà phố ngõ</option>
            <option value="apartment">Căn hộ chung cư</option>
            <option value="shophouse">Nhà mặt phố kinh doanh</option>
            <option value="villa">Biệt thự / Liền kề</option>
          </select>
        </div>

        {/* Hàng 3: Bộ lọc nâng cao (Pháp lý + Reset) */}
        {showAdvancedFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-600">Pháp lý:</span>
              <div className="flex items-center gap-2">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'so_do', label: 'Sổ đỏ chính chủ' },
                  { value: 'so_hong', label: 'Sổ hồng căn hộ' },
                  { value: 'cho_so', label: 'Chờ cấp sổ / HĐMB' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilters({ ...filters, legalStatus: item.value as any })}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      filters.legalStatus === item.value
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        )}
      </div>

      {/* THANH THỐNG KÊ KẾT QUẢ */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div>
          Tìm thấy <strong className="text-slate-900 font-bold">{filteredListings.length}</strong> BĐS đạt chuẩn trong kho mở
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>100% BĐS đã thẩm định một mã duy nhất</span>
        </div>
      </div>

      {/* DANH SÁCH BĐS (GRID HOẶC LIST) */}
      {filteredListings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            Không tìm thấy BĐS phù hợp
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Vui lòng thử mở rộng khoảng giá, thay đổi khu vực quận/huyện hoặc đặt lại bộ lọc.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại tất cả bộ lọc</span>
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-4'
          }
        >
          {filteredListings.map((listing) => (
            <BrokerListingCard
              key={listing.id}
              listing={listing}
              profile={profile}
              viewMode={viewMode}
              onToggleCurate={onToggleCurate}
              onOpenMarketingKit={onOpenMarketingKit}
              onRestrictedClick={onRestrictedClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

