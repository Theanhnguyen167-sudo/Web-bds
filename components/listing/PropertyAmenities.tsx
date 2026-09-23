'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Train, 
  Hospital, 
  Trees, 
  ShoppingBag, 
  GraduationCap, 
  Eye, 
  ExternalLink,
  Navigation,
  X,
  Compass
} from 'lucide-react';
import { 
  CalculatedAmenity, 
  getNearbyAmenitiesForListing 
} from '@/lib/data/hanoi-amenities';

interface PropertyAmenitiesProps {
  district?: string;
  lat?: number;
  lng?: number;
  listingAddress?: string;
}

export default function PropertyAmenities({
  district = 'Đống Đa',
  lat = 21.0280,
  lng = 105.8350,
  listingAddress
}: PropertyAmenitiesProps) {
  // Tính toán cự ly thực tế và link Google Maps chuẩn xác từ tọa độ BĐS
  const amenities = getNearbyAmenitiesForListing(lat, lng, 8);
  const [activeModalItem, setActiveModalItem] = useState<CalculatedAmenity | null>(null);

  // Render icon theo phân loại chuẩn
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'metro':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80">
            <Train className="h-5 w-5" />
          </div>
        );
      case 'hospital':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-100/80">
            <Hospital className="h-5 w-5" />
          </div>
        );
      case 'park':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100/80">
            <Trees className="h-5 w-5" />
          </div>
        );
      case 'mall':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 border border-pink-100/80">
            <ShoppingBag className="h-5 w-5" />
          </div>
        );
      case 'university':
      case 'school':
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
            <GraduationCap className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-sm space-y-5">
      {/* ── HEADER KHỐI TIỆN ÍCH ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Building2 className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Tiện Ích & Dịch Vụ Xung Quanh Bất Động Sản ({district})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 sm:pl-10">
            Định vị chính xác cự ly thực tế và đường đi đến các trường học, bệnh viện, TTTM và công viên
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400 self-start sm:self-center shrink-0">
          8 Địa điểm tiêu biểu
        </span>
      </div>

      {/* ── LƯỚI 8 THẺ TIỆN ÍCH ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 hover:border-orange-300 hover:shadow-md transition-all group"
          >
            {/* Top row: Icon + Info + Rating */}
            <div className="flex items-start gap-3">
              {renderCategoryIcon(item.category)}

              <div className="min-w-0 flex-1">
                {/* Tên & Rating */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    <span>⭐</span>
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Địa chỉ hành chính */}
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{item.address}</span>
                </p>

                {/* Khoảng cách & Thời gian */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-orange-600">
                    Khoảng cách: {item.distanceFormatted}
                  </span>
                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {item.timeFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row: Action Links */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveModalItem(item)}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors py-0.5"
              >
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>Xem vị trí</span>
              </button>

              <a
                href={item.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold transition-colors py-0.5"
                title={`Mở Google Maps chỉ đường đến ${item.name}`}
              >
                <span>Chỉ đường Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL XEM CHI TIẾT VỊ TRÍ & TỌA ĐỘ BẢN ĐỒ ── */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-orange-500" />
                <h4 className="text-base font-bold text-slate-900">Chi Tiết Vị Trí & Tọa Độ</h4>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Tên địa điểm:</span>
                <p className="font-bold text-slate-800 text-sm">{activeModalItem.name}</p>
                {activeModalItem.note && (
                  <p className="text-slate-500 italic mt-0.5">ℹ️ {activeModalItem.note}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block">Tọa độ GPS (WGS84):</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">
                    {activeModalItem.lat.toFixed(4)}, {activeModalItem.lng.toFixed(4)}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block">Khoảng cách từ BĐS:</span>
                  <p className="font-bold text-orange-600 mt-0.5">
                    {activeModalItem.distanceFormatted} ({activeModalItem.timeFormatted})
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Địa chỉ Google Maps chính xác:</span>
                <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span>{activeModalItem.address}</span>
                </p>
              </div>

              {/* Nhúng iframe bản đồ Google Maps tọa độ thực */}
              <div className="rounded-xl overflow-hidden border border-slate-200 h-[220px] bg-slate-100 relative">
                <iframe
                  title={activeModalItem.name}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${activeModalItem.lat},${activeModalItem.lng}&hl=vi&z=16&output=embed`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Đóng
              </button>
              <a
                href={activeModalItem.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Chỉ đường trực tiếp trên Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
