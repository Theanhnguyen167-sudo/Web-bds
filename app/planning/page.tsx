'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, ShieldCheck, MapPin, Compass, Info, 
  Train, Building, Trees, Sliders, Calendar, ChevronRight, X
} from 'lucide-react';
import type { SelectedZoneInfo } from '@/components/map/PlanningMap';

const PlanningMap = dynamic(
  () => import('@/components/map/PlanningMap'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full bg-[#0f1923] rounded-xl flex items-center justify-center">
        <div className="text-white/40 text-sm animate-pulse">
          🗺️ Đang tải bản đồ quy hoạch...
        </div>
      </div>
    )
  }
);

const DISTRICTS = [
  { id: 'all', label: 'Tất cả quận' },
  { id: 'Đống Đa', label: 'Đống Đa' },
  { id: 'Cầu Giấy', label: 'Cầu Giấy' },
  { id: 'Tây Hồ', label: 'Tây Hồ' },
  { id: 'Hoàn Kiếm', label: 'Hoàn Kiếm' },
  { id: 'Nam Từ Liêm', label: 'Nam Từ Liêm' },
  { id: 'Long Biên', label: 'Long Biên' },
];

export default function PlanningPage() {
  const { listings, activeListingId, setActiveListingId } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<2025 | 2030 | 2045>(2030);
  const [opacityValue, setOpacityValue] = useState<number>(35);
  const [selectedZoneInfo, setSelectedZoneInfo] = useState<SelectedZoneInfo | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    planning: true,
    metro: true,
    projects: true,
    amenities: false,
    green: true,
  });

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <Navbar />

      <div className="relative flex flex-1 overflow-hidden pt-16">
        {/* Fullscreen Interactive Leaflet Planning Map */}
        <div className="relative h-full w-full">
          <PlanningMap
            activeDistrict={selectedDistrict}
            activeLayers={activeLayers}
            planYear={selectedYear}
            opacity={opacityValue / 100}
            onZoneClick={(zone) => {
              setSelectedZoneInfo(zone);
            }}
          />

          {/* Floating Planning Control Panel (Top-Left) */}
          <div className="pointer-events-none absolute top-4 left-4 z-[400] max-w-sm hidden sm:block">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl text-slate-100 space-y-3.5"
            >
              {/* Header */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/15 text-orange-500 border border-orange-500/20">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white leading-tight">Quy hoạch Hà Nội 2030 – 2045</h1>
                  <p className="text-[11px] text-slate-400">Dữ liệu phân khu GIS & mạng lưới Metro</p>
                </div>
              </div>

              {/* District Filter Dropdown */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-orange-500" /> Quận / Huyện:
                </span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer"
                >
                  {DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Plan Year Tabs */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-400" /> Giai đoạn:
                  </span>
                  <span className="text-orange-400 font-bold">Năm {selectedYear}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                  {([2025, 2030, 2045] as const).map(yr => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedYear === yr
                          ? 'bg-orange-500 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer Toggles */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lớp bản đồ hiển thị</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => toggleLayer('planning')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      activeLayers.planning
                        ? 'bg-green-500/15 border-green-500/40 text-green-400 font-bold'
                        : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
                    }`}
                  >
                    <span>🎨</span> Phân khu
                  </button>

                  <button
                    onClick={() => toggleLayer('metro')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      activeLayers.metro
                        ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 font-bold'
                        : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
                    }`}
                  >
                    <span>🚇</span> Ga Metro
                  </button>
                </div>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sliders className="h-3 w-3" /> Độ đậm màu lớp phủ:
                  </span>
                  <span className="font-mono font-bold text-white">{opacityValue}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={opacityValue}
                  onChange={(e) => setOpacityValue(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
