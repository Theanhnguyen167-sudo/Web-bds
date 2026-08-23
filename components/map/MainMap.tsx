'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HANOI_COORDINATES, MAPBOX_TOKEN, MAP_STYLES, PLANNING_ZONE_COLORS } from '@/lib/mapbox/config';
import { Listing } from '@/types/listing';
import { Layers, MapPin, ZoomIn, ZoomOut, Navigation, Eye, EyeOff } from 'lucide-react';

interface MainMapProps {
  listings: Listing[];
  selectedListingId?: string | null;
  onSelectListing?: (listing: Listing | null) => void;
  hoveredListingId?: string | null;
}

export const MainMap: React.FC<MainMapProps> = ({
  listings,
  selectedListingId,
  onSelectListing,
  hoveredListingId,
}) => {
  const [showPlanningOverlay, setShowPlanningOverlay] = useState(true);
  const [currentStyle, setCurrentStyle] = useState<'light' | 'dark' | 'satellite'>('light');
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
      {/* Mapbox Container Placeholder / Implementation */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Mock Map Preview / Interactive Layer until Token provided */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] flex items-center justify-center">
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="flex flex-col rounded-lg border border-border/80 bg-background/90 p-1 shadow-md backdrop-blur-md">
              <button
                onClick={() => setShowPlanningOverlay(!showPlanningOverlay)}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  showPlanningOverlay ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                }`}
                title="Bật/Tắt Lớp Quy Hoạch"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Quy hoạch</span>
              </button>
            </div>

            {/* Map Style Selector */}
            <div className="flex rounded-lg border border-border/80 bg-background/90 p-1 shadow-md backdrop-blur-md text-[11px] font-medium">
              {(['light', 'satellite'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setCurrentStyle(style)}
                  className={`rounded px-2 py-1 capitalize transition-colors ${
                    currentStyle === style ? 'bg-muted font-bold text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {style === 'light' ? 'Bản đồ' : 'Vệ tinh'}
                </button>
              ))}
            </div>
          </div>

          {/* Planning Zone Overlay Legend */}
          {showPlanningOverlay && (
            <div className="absolute bottom-6 left-6 z-20 rounded-xl border border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur-md max-w-xs text-xs">
              <div className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Quy hoạch Hà Nội 2030
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#3b82f6]"></span>
                  <span>Đất ở đô thị</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#ef4444]"></span>
                  <span>Thương mại</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#10b981]"></span>
                  <span>Công viên / Cây xanh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#f59e0b]"></span>
                  <span>Giao thông / Metro</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Marker Pins (Simulated / Ready for Mapbox GL) */}
          <div className="relative w-full h-full p-12 flex flex-wrap items-center justify-around">
            {listings.map((item, idx) => {
              const isSelected = selectedListingId === item.id;
              const isHovered = hoveredListingId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectListing?.(item)}
                  className={`group absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${
                    isSelected || isHovered ? 'scale-125 z-30' : 'z-10 hover:scale-110'
                  }`}
                  style={{
                    left: `${25 + ((idx * 17) % 55)}%`,
                    top: `${30 + ((idx * 23) % 45)}%`,
                  }}
                >
                  <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold shadow-lg transition-all ${
                    isSelected || isHovered
                      ? 'bg-amber-500 text-white ring-4 ring-amber-400/40'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}>
                    <MapPin className="h-3 w-3" />
                    <span>{(item.price / 1_000_000_000).toFixed(1)} tỷ</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
