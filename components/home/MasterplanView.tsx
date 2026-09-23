'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Bed,
  Car,
  Maximize2,
  Check,
  Building,
  Sparkles,
  Layers,
  Calendar,
  Compass,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  LayoutGrid,
  List,
  ZoomIn
} from 'lucide-react';
import { GalleryImage } from './LightboxModal';

export interface MasterplanUnit {
  id: string;
  code: string;
  name: string;
  pinX: number; // percentage X on masterplan image (0 - 100)
  pinY: number; // percentage Y on masterplan image (0 - 100)
  floor: string;
  area: number; // m2
  bedrooms: number;
  bathrooms: number;
  price: string;
  priceNum: number; // in billion VND
  handover: string;
  status: 'available' | 'leased';
  statusLabel: string;
  amenity: string;
  hasParking: boolean;
  floorplanImg: string;
  viewDirection: string;
  gallery: GalleryImage[];
}

const MOCK_UNITS: MasterplanUnit[] = [
  {
    id: 'unit-101',
    code: 'Space 101',
    name: 'Căn hộ Hạng sang Tháp A',
    pinX: 28,
    pinY: 42,
    floor: 'Tầng 12',
    area: 86.5,
    bedrooms: 2,
    bathrooms: 2,
    price: '6.2 tỷ (68 tr/m²)',
    priceNum: 6.2,
    handover: 'Quý 4 / 2025',
    status: 'available',
    statusLabel: 'Available · Còn trống 3 căn',
    amenity: 'Parking ô tô riêng',
    hasParking: true,
    floorplanImg: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&auto=format&fit=crop&q=80',
    viewDirection: 'Đông Nam view hồ',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&auto=format&fit=crop&q=80',
        caption: 'Sơ đồ mặt bằng chi tiết Căn Space 101 (86.5m²)',
        tag: 'Sơ đồ mặt bằng 2D'
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80',
        caption: 'Phòng khách sang trọng hướng sáng ban công',
        tag: 'Phòng khách'
      },
      {
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&auto=format&fit=crop&q=80',
        caption: 'Phòng ngủ Master rộng thoáng với sàn gỗ tự nhiên',
        tag: 'Phòng ngủ Master'
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
        caption: 'Bếp mở & Quầy bar đảo tiện nghi chuẩn Âu',
        tag: 'Khu Bếp'
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
        caption: 'Phòng tắm Master ốp đá Marble cao cấp',
        tag: 'Phòng tắm'
      }
    ]
  },
  {
    id: 'unit-102',
    code: 'Căn A.05',
    name: 'Căn góc 3 Mặt thoáng Tháp A',
    pinX: 52,
    pinY: 34,
    floor: 'Tầng 15',
    area: 112.0,
    bedrooms: 3,
    bathrooms: 2,
    price: '8.5 tỷ (75 tr/m²)',
    priceNum: 8.5,
    handover: 'Quý 1 / 2026',
    status: 'available',
    statusLabel: 'Available · Còn trống 2 căn',
    amenity: 'Thang máy riêng & Parking',
    hasParking: true,
    floorplanImg: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&auto=format&fit=crop&q=80',
    viewDirection: 'Nam view công viên',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&auto=format&fit=crop&q=80',
        caption: 'Sơ đồ thiết kế căn góc 3PN - Căn A.05 (112m²)',
        tag: 'Sơ đồ căn góc 3PN'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        caption: 'Không gian mở phòng khách view trọn công viên xanh',
        tag: 'Phòng khách góc'
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
        caption: 'Ban công Sky Garden rộng 15m² trồng cây thư giãn',
        tag: 'Ban công Garden'
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&auto=format&fit=crop&q=80',
        caption: 'Phòng ngủ view kính tràn viền Panorama',
        tag: 'Phòng ngủ Panorama'
      }
    ]
  },
  {
    id: 'unit-103',
    code: 'Space 204',
    name: 'Căn hộ Studio & Dual Key Tháp B',
    pinX: 42,
    pinY: 66,
    floor: 'Tầng 8',
    area: 74.2,
    bedrooms: 2,
    bathrooms: 1,
    price: '5.1 tỷ (68 tr/m²)',
    priceNum: 5.1,
    handover: 'Bàn giao ngay',
    status: 'leased',
    statusLabel: 'Leased · Đã cho thuê',
    amenity: 'Nội thất nhập khẩu',
    hasParking: false,
    floorplanImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
    viewDirection: 'Đông Bắc',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
        caption: 'Mặt bằng căn Dual Key Space 204 (74.2m²)',
        tag: 'Mặt bằng Dual Key'
      },
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
        caption: 'Nội thất phong cách Scandinavia trẻ trung',
        tag: 'Phòng khách'
      }
    ]
  },
  {
    id: 'unit-104',
    code: 'Penthouse P.01',
    name: 'Sky Villa Penthouse Panorama',
    pinX: 74,
    pinY: 22,
    floor: 'Tầng 28 (Cao nhất)',
    area: 215.0,
    bedrooms: 4,
    bathrooms: 4,
    price: '22.8 tỷ (106 tr/m²)',
    priceNum: 22.8,
    handover: 'Quý 2 / 2026',
    status: 'available',
    statusLabel: 'Available · Còn duy nhất 1 căn',
    amenity: 'Bể bơi riêng & Parking',
    hasParking: true,
    floorplanImg: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
    viewDirection: '360° Panorama Hồ Tây',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80',
        caption: 'Mặt bằng tổng thể Sky Villa Penthouse 215m²',
        tag: 'Mặt bằng Penthouse'
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
        caption: 'Bể bơi vô cực riêng trên đỉnh tầng 28 ngắm trọn Hồ Tây',
        tag: 'Bể bơi riêng'
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&auto=format&fit=crop&q=80',
        caption: 'Phòng khách thông tầng cao 6.5 mét phong cách Luxury',
        tag: 'Living Room Thông tầng'
      }
    ]
  },
  {
    id: 'unit-105',
    code: 'Duplex D.02',
    name: 'Căn hộ Thông tầng Cao cấp',
    pinX: 20,
    pinY: 72,
    floor: 'Tầng 20-21',
    area: 168.0,
    bedrooms: 3,
    bathrooms: 3,
    price: '14.2 tỷ (84 tr/m²)',
    priceNum: 14.2,
    handover: 'Quý 4 / 2025',
    status: 'leased',
    statusLabel: 'Leased · Đã giao dịch',
    amenity: 'Parking 2 ô tô',
    hasParking: true,
    floorplanImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    viewDirection: 'Tây Nam',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
        caption: 'Sơ đồ mặt bằng 2 tầng Căn Duplex D.02',
        tag: 'Mặt bằng Duplex'
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80',
        caption: 'Cầu thang xoắn nghệ thuật kết nối 2 tầng căn hộ',
        tag: 'Cầu thang xoắn'
      }
    ]
  },
  {
    id: 'unit-106',
    code: 'Corner Suite C.08',
    name: 'Căn hộ Suite Ban công Kính tràn',
    pinX: 66,
    pinY: 56,
    floor: 'Tầng 18',
    area: 98.5,
    bedrooms: 2,
    bathrooms: 2,
    price: '7.8 tỷ (79 tr/m²)',
    priceNum: 7.8,
    handover: 'Quý 1 / 2026',
    status: 'available',
    statusLabel: 'Available · Còn trống 3 căn',
    amenity: 'Parking ô tô & View hồ',
    hasParking: true,
    floorplanImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    viewDirection: 'Đông Nam mát mẻ',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
        caption: 'Sơ đồ thiết kế Corner Suite C.08 (98.5m²)',
        tag: 'Sơ đồ Suite 2PN'
      },
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
        caption: 'Không gian nội thất Minimalist ấm cúng và tinh tế',
        tag: 'Nội thất phòng khách'
      }
    ]
  },
];

interface MasterplanViewProps {
  onBack: () => void;
  onSelectUnit?: (unit: MasterplanUnit) => void;
  onOpenLightbox?: (images: GalleryImage[], initialIndex?: number, title?: string) => void;
}

export function MasterplanView({ onBack, onSelectUnit, onOpenLightbox }: MasterplanViewProps) {
  // State for active / hovered unit pin
  const [activeUnitId, setActiveUnitId] = useState<string>('unit-101');
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);

  // Filter states
  const [parkingFilter, setParkingFilter] = useState<'all' | 'parking'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(25); // max 25 tỷ
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isVrTourActive, setIsVrTourActive] = useState<boolean>(false);

  // Dropdown states
  const [parkingDropdownOpen, setParkingDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Reference for card scroll
  const unitCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filtered unit list based on Parking, Price Slider, and Status
  const filteredUnits = useMemo(() => {
    return MOCK_UNITS.filter((u) => {
      // 1. Status filter
      if (selectedStatus !== 'all' && u.status !== selectedStatus) return false;

      // 2. Parking filter
      if (parkingFilter === 'parking' && !u.hasParking) return false;

      // 3. Price slider filter (Price <= maxPrice)
      if (u.priceNum > maxPrice) return false;

      return true;
    });
  }, [selectedStatus, parkingFilter, maxPrice]);

  const activeUnit = useMemo(() => {
    return MOCK_UNITS.find((u) => u.id === (hoveredUnitId || activeUnitId)) || MOCK_UNITS[0];
  }, [hoveredUnitId, activeUnitId]);

  // Click on pin handler
  const handlePinClick = (unitId: string) => {
    setActiveUnitId(unitId);
    const cardEl = unitCardRefs.current[unitId];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
      
      {/* ════════════════════════════════════════════════════════════
          SPLIT VIEW (Chia 2 cột):
          CỘT TRÁI: Flycam Masterplan + Hotspot Pins + 360 VR (50%)
          CỘT PHẢI: Bộ lọc chi tiết (Parking, Slider Giá, View Icons) + Lưới căn lẻ (50%)
         ════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[720px] items-stretch">
        
        {/* ──────────────────────────────────────────────────────────
            1. CỘT BÊN TRÁI: INTERACTIVE MAP / FLYCAM MASTERPLAN (50%)
           ────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 relative bg-slate-950 flex flex-col justify-between overflow-hidden min-h-[480px] lg:min-h-[740px]">
          
          {/* Top Left Controls: Back Button + 360° VR Tour Badge */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/20 text-xs font-bold transition-all hover:scale-105 shadow-xl cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span>&lt; Back Quay lại danh sách</span>
            </button>

            {/* 360° VR Badge */}
            <button
              type="button"
              onClick={() => setIsVrTourActive(!isVrTourActive)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl backdrop-blur-md border text-xs font-black transition-all shadow-xl cursor-pointer ${
                isVrTourActive
                  ? 'bg-orange-500 text-white border-orange-400 ring-2 ring-orange-500/40 animate-pulse'
                  : 'bg-black/70 text-white/90 hover:text-white border-white/20 hover:bg-black/90'
              }`}
            >
              <Compass className="w-4 h-4 text-orange-400" />
              <span>360° VR Tour</span>
              {isVrTourActive && <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />}
            </button>
          </div>

          {/* Masterplan Aerial / Flycam Background View */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80"
              alt="Flycam Masterplan Dự án"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isVrTourActive ? 'scale-110 filter saturate-125' : 'scale-100'
              }`}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />

            {/* VR Mode Indicator Tag */}
            {isVrTourActive && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-orange-600/90 text-white px-4 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-orange-400/40 shadow-lg animate-bounce">
                🌀 Chế độ thực tế ảo 360° VR đang kích hoạt
              </div>
            )}
          </div>

          {/* ── HOTSPOT PINS LAYER OVER MASTERPLAN ── */}
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {MOCK_UNITS.map((unit) => {
              const isActive = activeUnitId === unit.id;
              const isHovered = hoveredUnitId === unit.id;

              return (
                <div
                  key={unit.id}
                  style={{
                    left: `${unit.pinX}%`,
                    top: `${unit.pinY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute cursor-pointer group"
                  onMouseEnter={() => setHoveredUnitId(unit.id)}
                  onMouseLeave={() => setHoveredUnitId(null)}
                  onClick={() => handlePinClick(unit.id)}
                >
                  {/* Outer Pulsing Halo */}
                  {(isActive || isHovered || unit.status === 'available') && (
                    <span className="absolute -inset-2 rounded-full bg-orange-500/40 animate-ping pointer-events-none" />
                  )}

                  {/* Hotspot Pin Button (Chấm tròn nổi bật) */}
                  <button
                    type="button"
                    aria-label={`Hotspot căn ${unit.code}`}
                    className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-[11px] shadow-2xl transition-all duration-300 border-2 cursor-pointer ${
                      isActive || isHovered
                        ? 'bg-orange-500 text-white border-white scale-125 ring-4 ring-orange-500/50 shadow-orange-500/50'
                        : unit.status === 'available'
                        ? 'bg-white text-navy border-orange-500 hover:scale-115 hover:bg-orange-500 hover:text-white'
                        : 'bg-slate-800 text-slate-300 border-slate-500 hover:scale-110'
                    }`}
                  >
                    <span>{unit.code.split(' ')[1] || unit.code.slice(-3)}</span>
                  </button>

                  {/* ── TƯƠNG TÁC HOTSPOT: POPOVER CARD KHI HOVER / CLICK ── */}
                  {(isActive || isHovered) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 p-3 shadow-2xl z-50 text-slate-800 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Ảnh xem trước Sơ đồ mặt bằng (Floorplan) - Clickable to open Lightbox */}
                      <div
                        onClick={() => onOpenLightbox?.(unit.gallery, 0, `${unit.code} - ${unit.name}`)}
                        className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 group/img cursor-pointer"
                        title="Bấm để xem phóng to góc nhà qua Lightbox"
                      >
                        <img
                          src={unit.floorplanImg}
                          alt={unit.name}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">
                          {unit.floor}
                        </span>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Xem chi tiết</span>
                        </div>
                      </div>

                      {/* Tên mã căn + Diện tích + Tình trạng */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-navy">{unit.code}</h4>
                          {/* Nhãn dán Tình trạng (Available / Leased) */}
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              unit.status === 'available'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            ● {unit.status === 'available' ? 'Available - Còn trống' : 'Leased - Đã giao dịch'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium truncate">{unit.name}</p>
                        
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-black">
                          <span className="text-orange-600">{unit.price}</span>
                          <span className="text-slate-600 text-[11px] font-bold">{unit.area} m²</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Bar on Flycam Masterplan */}
          <div className="relative z-30 p-4 mt-auto">
            <div className="p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-between text-white text-xs shadow-2xl">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-medium text-slate-300">Đang chọn:</span>
                <strong className="text-orange-400 font-bold truncate">{activeUnit.code} ({activeUnit.floor})</strong>
              </div>
              <button
                type="button"
                onClick={() => onOpenLightbox?.(activeUnit.gallery, 0, `${activeUnit.code} - ${activeUnit.name}`)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem ảnh góc nhà</span>
              </button>
            </div>
          </div>

        </div>

        {/* ──────────────────────────────────────────────────────────
            2. CỘT BÊN PHẢI: DANH SÁCH CĂN LẺ & BỘ LỌC CHI TIẾT (50%)
           ────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col justify-between space-y-4 overflow-hidden bg-slate-50/50">
          
          {/* ── 2A. THANH BỘ LỌC TRÊN CÙNG (FILTER BAR - GIỐNG HÌNH 5) ── */}
          <div className="space-y-3 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            
            {/* Header thanh lọc */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <h3 className="font-black text-xs sm:text-sm text-navy uppercase tracking-wider">
                  Mặt bằng &amp; Phân căn chi tiết
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Hiển thị <strong className="text-orange-600 font-bold">{filteredUnits.length}</strong> / {MOCK_UNITS.length} căn
              </span>
            </div>

            {/* Hàng điều khiển bộ lọc: Tiện ích + Slider Giá + Chế độ xem */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1 border-t border-slate-100 text-xs">
              
              {/* Dropdown: Tiện ích (Parking/Chỗ đỗ xe) */}
              <div className="sm:col-span-4 relative">
                <button
                  type="button"
                  onClick={() => {
                    setParkingDropdownOpen(!parkingDropdownOpen);
                    setStatusDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/90 font-semibold text-navy transition-all"
                >
                  <span className="truncate flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{parkingFilter === 'parking' ? 'Có chỗ đỗ ô tô' : 'Tiện ích: Tất cả'}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {parkingDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setParkingFilter('all');
                        setParkingDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between ${
                        parkingFilter === 'all' ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>Tất cả tiện ích</span>
                      {parkingFilter === 'all' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setParkingFilter('parking');
                        setParkingDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between ${
                        parkingFilter === 'parking' ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>🚗 Có chỗ đỗ xe (Parking)</span>
                      {parkingFilter === 'parking' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Thanh trượt khoảng giá (Price Range Slider từ $ đến $$) */}
              <div className="sm:col-span-5 flex flex-col justify-center px-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Giá: $ ➔ $$</span>
                  <span className="text-orange-600 font-extrabold">≤ {maxPrice} tỷ</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-semibold">
                  <span>5 tỷ</span>
                  <span>15 tỷ</span>
                  <span>25 tỷ</span>
                </div>
              </div>

              {/* Cụm Icon Chế độ xem (Grid 2 cột vs List 1 cột) */}
              <div className="sm:col-span-3 flex items-center justify-end gap-1.5">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    title="Chế độ lưới 2 cột"
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-orange-600 shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    title="Chế độ danh sách"
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-orange-600 shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status Filter toggle button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusDropdownOpen(!statusDropdownOpen);
                      setParkingDropdownOpen(false);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Lọc theo trạng thái"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                      {[
                        { id: 'all', label: 'Tất cả trạng thái' },
                        { id: 'available', label: '🟢 Còn trống (Available)' },
                        { id: 'leased', label: '🔴 Đã giao dịch (Leased)' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(st.id);
                            setStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between ${
                            selectedStatus === st.id ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span>{st.label}</span>
                          {selectedStatus === st.id && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* ── 2B. LƯỚI DANH SÁCH CÁC CĂN LẺ (GRID 2 CỘT HOẶC LIST) ── */}
          <div className="flex-1 max-h-[570px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredUnits.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-600">Không có căn nào phù hợp với bộ lọc hiện tại</p>
                <button
                  type="button"
                  onClick={() => {
                    setParkingFilter('all');
                    setMaxPrice(25);
                    setSelectedStatus('all');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-3.5 ${
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {filteredUnits.map((unit) => {
                  const isSelected = activeUnitId === unit.id;
                  const isHovered = hoveredUnitId === unit.id;

                  return (
                    <div
                      key={unit.id}
                      ref={(el) => { unitCardRefs.current[unit.id] = el; }}
                      onMouseEnter={() => setHoveredUnitId(unit.id)}
                      onMouseLeave={() => setHoveredUnitId(null)}
                      onClick={() => {
                        setActiveUnitId(unit.id);
                        onSelectUnit?.(unit);
                      }}
                      className={`group bg-white rounded-2xl border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-sm ${
                        isSelected || isHovered
                          ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-lg -translate-y-0.5 bg-orange-50/15'
                          : 'border-slate-200/90 hover:border-orange-300 hover:shadow'
                      }`}
                    >
                      {/* Ảnh đại diện: Hình sơ đồ mặt bằng (Floor plan) */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLightbox?.(unit.gallery, 0, `${unit.code} - ${unit.name}`);
                        }}
                        className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 group/img"
                        title="Bấm vào ảnh để mở Lightbox Gallery xem các góc nhà"
                      >
                        <img
                          src={unit.floorplanImg}
                          alt={unit.name}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                          {unit.floor}
                        </span>

                        {/* Tag mở Lightbox */}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-navy text-[10px] font-bold shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1">
                          <Eye className="w-3 h-3 text-orange-500" />
                          <span>Xem ảnh</span>
                        </div>
                      </div>

                      {/* Thông tin căn lẻ */}
                      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Mã căn & Nhãn trạng thái */}
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-xs sm:text-sm text-navy group-hover:text-orange-600 transition-colors">
                              {unit.code}
                            </h4>
                            {/* Nhãn dán Trạng thái (Status Tag): Xanh lá "Available" / Đỏ "Leased" */}
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                unit.status === 'available'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              ● {unit.status === 'available' ? 'Available' : 'Leased'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {unit.name}
                          </p>
                        </div>

                        {/* Diện tích m² + Số phòng + Hướng view */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold pt-1 border-t border-slate-100">
                          <span>📐 {unit.area} m²</span>
                          <span>·</span>
                          <span>🛏️ {unit.bedrooms} PN</span>
                          <span>·</span>
                          <span className="text-slate-500 truncate">{unit.viewDirection}</span>
                        </div>

                        {/* Giá thuê/bán + Ngày bàn giao */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
                          <div>
                            <span className="text-xs font-black text-orange-600">
                              {unit.price}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{unit.handover}</span>
                          </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLightbox?.(unit.gallery, 0, `${unit.code} - ${unit.name}`);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Xem các góc nhà</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default MasterplanView;
