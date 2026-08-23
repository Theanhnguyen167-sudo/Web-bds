'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { useApp } from '@/lib/context/AppContext';
import { PropertyMarker } from './PropertyMarker';
import { PropertyPopup } from './PropertyPopup';
import { PlanningLegend } from './PlanningLegend';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  RotateCcw,
  Sparkles,
  MapPin
} from 'lucide-react';

interface MapContainerProps {
  listings: ListingItem[];
}

export const MapContainer: React.FC<MapContainerProps> = ({ listings }) => {
  const {
    activeListingId,
    setActiveListingId,
    hoveredListingId,
    setHoveredListingId,
    showPlanningOverlay,
    setShowPlanningOverlay,
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const selectedListing = listings.find((l) => l.id === activeListingId) || null;

  // Convert GPS Coordinates to container percentage positions (WGS84 Hanoi bounding box)
  const getCoordinatesPosition = (lat: number, lng: number) => {
    const minLng = 105.72;
    const maxLng = 105.93;
    const minLat = 20.96;
    const maxLat = 21.08;

    const x = Math.max(8, Math.min(92, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.max(10, Math.min(90, ((maxLat - lat) / (maxLat - minLat)) * 100));
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0e1626] select-none">
      {/* Mapbox Style Dark Canvas Background with Hanoi Grid & Red River (Sông Hồng) */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Vector SVG: Sông Hồng & Hồ Tây & Major Arterials */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none opacity-60"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          {/* Hồ Tây (West Lake) */}
          <path
            d="M 440 140 C 490 120, 540 160, 520 230 C 500 280, 430 270, 410 210 Z"
            fill="#1e3a5f"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.7"
          />
          {/* Hồ Hoàn Kiếm */}
          <ellipse cx="580" cy="350" rx="14" ry="22" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1" />
          
          {/* Hồ Trúc Bạch */}
          <ellipse cx="490" cy="200" rx="15" ry="12" fill="#1e3a5f" opacity="0.6" />

          {/* Sông Hồng (Red River) Path */}
          <path
            d="M 280 0 Q 380 180, 620 220 T 950 480 Q 990 600, 1000 700"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M 280 0 Q 380 180, 620 220 T 950 480 Q 990 600, 1000 700"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Sông Đuống */}
          <path
            d="M 640 230 Q 780 200, 1000 240"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="14"
            opacity="0.3"
          />

          {/* Ring Roads (Vành đai 2, Vành đai 3) */}
          <ellipse cx="480" cy="380" rx="280" ry="200" fill="none" stroke="#334155" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.7" />
          <ellipse cx="480" cy="380" rx="390" ry="270" fill="none" stroke="#475569" strokeWidth="3" opacity="0.6" />

          {/* Metro Line 2A (Cát Linh - Hà Đông) */}
          <path
            d="M 520 340 L 320 540"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Metro Line 3 (Nhổn - Ga Hà Nội) */}
          <path
            d="M 220 310 L 560 345"
            fill="none"
            stroke="#eab308"
            strokeWidth="3"
            strokeDasharray="4 4"
            opacity="0.8"
          />
        </svg>

        {/* Planning Polygons Overlay (Fade in/out) */}
        <AnimatePresence>
          {showPlanningOverlay && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox="0 0 1000 700"
              preserveAspectRatio="none"
            >
              {/* Phân khu Cầu Giấy (Đô thị mới - Xanh dương) */}
              <polygon
                points="240,260 370,250 360,370 230,360"
                fill="#3b82f6"
                fillOpacity="0.22"
                stroke="#3b82f6"
                strokeWidth="1.5"
              />
              {/* Phân khu Đống Đa - Ba Đình (Thương mại - Đỏ) */}
              <polygon
                points="420,290 560,280 540,410 400,390"
                fill="#ef4444"
                fillOpacity="0.2"
                stroke="#ef4444"
                strokeWidth="1.5"
              />
              {/* Phân khu Tây Hồ (Sinh thái - Xanh lá) */}
              <polygon
                points="400,100 580,90 560,240 380,210"
                fill="#10b981"
                fillOpacity="0.25"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              {/* Phân khu Long Biên (Đô thị ven sông - Vàng) */}
              <polygon
                points="660,220 880,240 850,420 630,370"
                fill="#f59e0b"
                fillOpacity="0.2"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* District Labels */}
        <div className="absolute inset-0 pointer-events-none text-[11px] font-extrabold tracking-wider text-slate-500/60 uppercase">
          <span className="absolute top-[28%] left-[45%]">Tây Hồ</span>
          <span className="absolute top-[48%] left-[28%]">Cầu Giấy</span>
          <span className="absolute top-[49%] left-[48%]">Đống Đa</span>
          <span className="absolute top-[46%] left-[58%]">Hoàn Kiếm</span>
          <span className="absolute top-[62%] left-[44%]">Thanh Xuân</span>
          <span className="absolute top-[42%] left-[75%]">Long Biên</span>
          <span className="absolute top-[65%] left-[24%]">Nam Từ Liêm</span>
        </div>

        {/* Interactive Property Markers */}
        {listings.map((listing, index) => {
          const isSelected = activeListingId === listing.id;
          const isHovered = hoveredListingId === listing.id;
          const pos = getCoordinatesPosition(listing.lat, listing.lng);

          return (
            <motion.div
              key={listing.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1 + index * 0.06,
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              style={{ position: 'absolute', left: pos.left, top: pos.top, transform: 'translate(-50%, -100%)' }}
              className="z-20"
            >
              <PropertyMarker
                listing={listing}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={(item) => setActiveListingId(item.id === activeListingId ? null : item.id)}
                onHover={(id) => setHoveredListingId(id)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Map Control Actions (Top Right) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        {/* Toggle Planning Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPlanningOverlay(!showPlanningOverlay)}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold shadow-lg backdrop-blur-md transition-all ${
            showPlanningOverlay
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
              : 'bg-primary/90 text-slate-300 hover:text-white border border-slate-700'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Quy hoạch 2030</span>
        </motion.button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl border border-slate-700 bg-primary/90 shadow-lg backdrop-blur-md overflow-hidden text-white">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
            className="flex h-9 w-9 items-center justify-center hover:bg-primary-light transition-colors border-b border-slate-700"
            title="Phóng to"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            className="flex h-9 w-9 items-center justify-center hover:bg-primary-light transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>

        {/* Reset View */}
        <button
          onClick={() => {
            setZoomLevel(1);
            setActiveListingId(null);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-primary/90 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition-colors"
          title="Đặt lại bản đồ"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Planning Legend (Bottom Left) */}
      <AnimatePresence>
        {showPlanningOverlay && <PlanningLegend />}
      </AnimatePresence>

      {/* Selected Property Popup (Bottom Right) */}
      <AnimatePresence>
        {selectedListing && (
          <PropertyPopup
            listing={selectedListing}
            onClose={() => setActiveListingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
