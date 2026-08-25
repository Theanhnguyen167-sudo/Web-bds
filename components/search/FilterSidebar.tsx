'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters } from '@/lib/search/filterListings';
import {
  ChevronDown,
  RotateCcw,
  Building2,
  MapPin,
  Compass,
  Sliders,
  DollarSign,
  Maximize2,
  Bed,
  ShieldCheck,
  Sparkles,
  Layers,
  Train,
  Check
} from 'lucide-react';

const HANOI_ALL_DISTRICTS = [
  'Đống Đa', 'Hoàn Kiếm', 'Cầu Giấy', 'Tây Hồ', 'Ba Đình',
  'Hai Bà Trưng', 'Hoàng Mai', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm',
  'Hà Đông', 'Thanh Xuân', 'Đông Anh', 'Gia Lâm', 'Hoài Đức',
  'Mê Linh', 'Sóc Sơn', 'Đan Phượng', 'Thường Tín', 'Thanh Oai',
  'Chương Mỹ', 'Quốc Oai', 'Thạch Thất', 'Ba Vì', 'Phúc Thọ',
  'Mỹ Đức', 'Ứng Hòa', 'Phú Xuyên', 'Thanh Trì'
];

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (update: Partial<SearchFilters>) => void;
  onReset: () => void;
  activeCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  activeCount,
}) => {
  // Collapsible section states (Section 1 and 2 open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    type: true,
    location: true,
    price: true,
    area: true,
    specs: false,
    direction: false,
    legal: false,
    features: false,
    specialLocation: false,
    planning: false,
    quick: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Custom price input local state
  const [minPriceInput, setMinPriceInput] = useState<string>(
    filters.minPrice ? (filters.minPrice / 1e9).toString() : ''
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    filters.maxPrice ? (filters.maxPrice / 1e9).toString() : ''
  );

  // Custom area input local state
  const [minAreaInput, setMinAreaInput] = useState<string>(
    filters.minArea ? filters.minArea.toString() : ''
  );
  const [maxAreaInput, setMaxAreaInput] = useState<string>(
    filters.maxArea ? filters.maxArea.toString() : ''
  );

  // Handle direction toggle
  const toggleDirection = (dir: string) => {
    const exists = filters.direction.includes(dir);
    const updated = exists
      ? filters.direction.filter((d) => d !== dir)
      : [...filters.direction, dir];
    onChange({ direction: updated });
  };

  // Handle legal toggle
  const toggleLegal = (legal: string) => {
    const exists = filters.legalStatus.includes(legal);
    const updated = exists
      ? filters.legalStatus.filter((l) => l !== legal)
      : [...filters.legalStatus, legal];
    onChange({ legalStatus: updated });
  };

  // Handle features toggle
  const toggleFeature = (feat: string) => {
    const exists = filters.features.includes(feat);
    const updated = exists
      ? filters.features.filter((f) => f !== feat)
      : [...filters.features, feat];
    onChange({ features: updated });
  };

  // Handle planning zone toggle
  const togglePlanningZone = (zone: string) => {
    const exists = filters.planningZone.includes(zone);
    const updated = exists
      ? filters.planningZone.filter((z) => z !== zone)
      : [...filters.planningZone, zone];
    onChange({ planningZone: updated });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-100 text-xs">
      
      {/* ── HEADER ── */}
      <div className="p-3 sm:p-4 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-orange-500" />
          <h3 className="font-extrabold text-sm text-navy dark:text-white">
            Bộ lọc tìm kiếm
          </h3>
          {activeCount > 0 && (
            <span className="bg-orange-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-orange-500 hover:text-orange-600 font-bold text-xs flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* ━━ SECTION 1: LOẠI BĐS ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('type')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Loại Bất Động Sản</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.type ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.type && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 pt-1"
            >
              {/* Sale / Rent Toggle */}
              <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl font-bold text-xs">
                <button
                  onClick={() => onChange({ listingType: 'sale' })}
                  className={`py-1.5 rounded-lg transition-all ${
                    filters.listingType === 'sale'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🏠 Cần bán
                </button>
                <button
                  onClick={() => onChange({ listingType: 'rent' })}
                  className={`py-1.5 rounded-lg transition-all ${
                    filters.listingType === 'rent'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🔑 Cho thuê
                </button>
              </div>

              {/* Property Types Grid (2x3) */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'all', label: 'Tất cả BĐS', icon: '🏠' },
                  { id: 'house', label: 'Nhà phố', icon: '🏘️' },
                  { id: 'apartment', label: 'Chung cư', icon: '🏢' },
                  { id: 'land', label: 'Đất nền', icon: '🌿' },
                  { id: 'villa', label: 'Biệt thự', icon: '🏰' },
                  { id: 'commercial', label: 'Thương mại', icon: '🏪' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onChange({ type: type.id })}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold text-left transition-all ${
                      filters.type === type.id
                        ? 'border-orange-500 bg-orange-50/50 text-orange-600 dark:bg-orange-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base">{type.icon}</span>
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━ SECTION 2: VỊ TRÍ ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Vị trí (Hà Nội)</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.location ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.location && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 pt-1"
            >
              {/* District Dropdown */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Quận / Huyện:
                </label>
                <select
                  value={filters.district || 'Tất cả quận'}
                  onChange={(e) => onChange({ district: e.target.value === 'Tất cả quận' ? '' : e.target.value })}
                  className="w-full p-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                >
                  <option value="Tất cả quận">Tất cả 29 quận/huyện</option>
                  {HANOI_ALL_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      Quận {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street Search Input */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Đường / Phố cụ thể:
                </label>
                <input
                  type="text"
                  value={filters.street}
                  onChange={(e) => onChange({ street: e.target.value })}
                  placeholder="Ví dụ: Hoàng Cầu, Xã Đàn..."
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━ SECTION 3: KHOẢNG GIÁ ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Khoảng Giá</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.price && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 pt-1"
            >
              {/* Presets */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Tất cả', min: null, max: null },
                  { label: '< 1 tỷ', min: null, max: 1e9 },
                  { label: '1 - 3 tỷ', min: 1e9, max: 3e9 },
                  { label: '3 - 5 tỷ', min: 3e9, max: 5e9 },
                  { label: '5 - 10 tỷ', min: 5e9, max: 10e9 },
                  { label: '> 10 tỷ', min: 10e9, max: null },
                ].map((preset, idx) => {
                  const isSelected =
                    filters.minPrice === preset.min && filters.maxPrice === preset.max;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onChange({ minPrice: preset.min, maxPrice: preset.max });
                        setMinPriceInput(preset.min ? (preset.min / 1e9).toString() : '');
                        setMaxPriceInput(preset.max ? (preset.max / 1e9).toString() : '');
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Dual Inputs */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Hoặc tự nhập (tỷ VNĐ):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Từ (tỷ)"
                    value={minPriceInput}
                    onChange={(e) => {
                      setMinPriceInput(e.target.value);
                      onChange({
                        minPrice: e.target.value ? Number(e.target.value) * 1e9 : null,
                      });
                    }}
                    className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-orange-500 font-semibold"
                  />
                  <input
                    type="number"
                    placeholder="Đến (tỷ)"
                    value={maxPriceInput}
                    onChange={(e) => {
                      setMaxPriceInput(e.target.value);
                      onChange({
                        maxPrice: e.target.value ? Number(e.target.value) * 1e9 : null,
                      });
                    }}
                    className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━ SECTION 4: DIỆN TÍCH ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('area')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Diện Tích (m²)</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.area ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.area && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2.5 pt-1"
            >
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Tất cả', min: null, max: null },
                  { label: '< 30m²', min: null, max: 30 },
                  { label: '30 - 50m²', min: 30, max: 50 },
                  { label: '50 - 80m²', min: 50, max: 80 },
                  { label: '80 - 120m²', min: 80, max: 120 },
                  { label: '> 120m²', min: 120, max: null },
                ].map((preset, idx) => {
                  const isSelected =
                    filters.minArea === preset.min && filters.maxArea === preset.max;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onChange({ minArea: preset.min, maxArea: preset.max });
                        setMinAreaInput(preset.min ? preset.min.toString() : '');
                        setMaxAreaInput(preset.max ? preset.max.toString() : '');
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Area Inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <input
                  type="number"
                  placeholder="Từ (m²)"
                  value={minAreaInput}
                  onChange={(e) => {
                    setMinAreaInput(e.target.value);
                    onChange({ minArea: e.target.value ? Number(e.target.value) : null });
                  }}
                  className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-orange-500 font-semibold"
                />
                <input
                  type="number"
                  placeholder="Đến (m²)"
                  value={maxAreaInput}
                  onChange={(e) => {
                    setMaxAreaInput(e.target.value);
                    onChange({ maxArea: e.target.value ? Number(e.target.value) : null });
                  }}
                  className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-orange-500 font-semibold"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━ SECTION 5: ĐẶC ĐIỂM NHÀ (Số phòng ngủ, số tầng) ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('specs')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Số Phòng Ngủ & Số Tầng</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.specs ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.specs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-1"
            >
              {/* Phòng ngủ */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Số phòng ngủ tối thiểu:
                </label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Bất kỳ', val: null },
                    { label: '1+', val: 1 },
                    { label: '2+', val: 2 },
                    { label: '3+', val: 3 },
                    { label: '4+', val: 4 },
                    { label: '5+', val: 5 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => onChange({ minBedrooms: p.val })}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        filters.minBedrooms === p.val
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số tầng */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Số tầng tối thiểu:
                </label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Bất kỳ', val: null },
                    { label: '1+', val: 1 },
                    { label: '2+', val: 2 },
                    { label: '3+', val: 3 },
                    { label: '4+', val: 4 },
                  ].map((f) => (
                    <button
                      key={f.label}
                      onClick={() => onChange({ minFloors: f.val })}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        filters.minFloors === f.val
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━ SECTION 6: HƯỚNG NHÀ ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('direction')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Hướng Nhà (La bàn)</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.direction ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.direction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-1"
            >
              <div className="grid grid-cols-3 gap-1.5 text-center font-bold">
                {[
                  'Tây Bắc', 'Bắc', 'Đông Bắc',
                  'Tây', '', 'Đông',
                  'Tây Nam', 'Nam', 'Đông Nam'
                ].map((dir, idx) => {
                  if (!dir) {
                    return <div key={idx} className="flex items-center justify-center text-slate-300">🧭</div>;
                  }
                  const isSelected = filters.direction.includes(dir);
                  return (
                    <button
                      key={dir}
                      onClick={() => toggleDirection(dir)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dir}
                    </button>
                  );
                })}
              </div>

              {filters.direction.length > 0 && (
                <div className="text-right">
                  <button
                    onClick={() => onChange({ direction: [] })}
                    className="text-[11px] text-orange-500 hover:underline"
                  >
                    Bỏ chọn hướng
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━ SECTION 7: PHÁP LÝ ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('legal')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Tình Trạng Pháp Lý</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.legal ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.legal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5 pt-1"
            >
              {[
                'Sổ đỏ chính chủ',
                'Sổ hồng căn hộ',
                'Hợp đồng mua bán',
                'Giấy tờ hợp lệ',
              ].map((legal) => {
                const checked = filters.legalStatus.includes(legal);
                return (
                  <label
                    key={legal}
                    onClick={() => toggleLegal(legal)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded text-orange-500 focus:ring-orange-500 h-3.5 w-3.5"
                    />
                    <span className={checked ? 'font-bold text-orange-600' : 'text-slate-700 dark:text-slate-300'}>
                      {legal}
                    </span>
                  </label>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ━━ SECTION 8: TIỆN ÍCH & VỊ TRÍ GẦN METRO ━━ */}
      <div className="p-3 sm:p-4 space-y-3">
        <button
          onClick={() => toggleSection('features')}
          className="w-full flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide text-[11px]"
        >
          <span>Tiện Ích & Tuyến Metro</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              openSections.features ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openSections.features && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-1"
            >
              {/* Near Metro Switch */}
              <div className="p-2.5 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Train className="h-4 w-4 text-orange-500" />
                    <span className="font-bold text-xs text-orange-700 dark:text-orange-300">
                      Gần Tuyến Metro Hà Nội
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.nearMetro}
                    onChange={(e) => onChange({ nearMetro: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500 h-4 w-4 cursor-pointer"
                  />
                </div>

                {filters.nearMetro && (
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500 font-semibold">Bán kính:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((r) => (
                        <button
                          key={r}
                          onClick={() => onChange({ nearRadius: r })}
                          className={`px-2 py-0.5 rounded font-bold ${
                            filters.nearRadius === r
                              ? 'bg-orange-500 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick toggle list */}
              <div className="space-y-1.5">
                {[
                  { key: 'featuredOnly', label: '🔥 Chỉ tin nổi bật' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={(filters as any)[item.key]}
                      onChange={(e) => onChange({ [item.key]: e.target.checked } as any)}
                      className="rounded text-orange-500 focus:ring-orange-500 h-3.5 w-3.5"
                    />
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
