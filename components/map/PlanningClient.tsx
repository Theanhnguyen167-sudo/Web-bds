'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/lib/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, ShieldCheck, MapPin, Compass, Info, 
  Train, Building, Trees, Sliders, Calendar, ChevronRight, ChevronUp, ChevronDown, X
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

export function PlanningClient() {
  const { listings, activeListingId, setActiveListingId } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<2025 | 2030 | 2045>(2030);
  const [opacityValue, setOpacityValue] = useState<number>(35);
  const [selectedZoneInfo, setSelectedZoneInfo] = useState<SelectedZoneInfo | null>(null);
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState<boolean>(false);

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
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden bg-[#0a1128]">
      {/* MAP VIEWPORT CHÍNH */}
      <div className="absolute inset-0 z-0">
        <PlanningMap
          activeDistrict={selectedDistrict}
          planYear={selectedYear}
          opacity={opacityValue}
          activeLayers={activeLayers}
          onZoneClick={setSelectedZoneInfo}
        />
      </div>

      {/* TOP FLOATING CONTROLS: QUẬN & NĂM QUY HOẠCH */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto z-10 flex flex-wrap items-center gap-2 max-w-full">
        {/* District Selector Pill */}
        <div className="flex items-center gap-1 bg-[#0a1128]/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1 shadow-xl">
          {DISTRICTS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDistrict(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDistrict === d.id
                  ? 'bg-accent text-white shadow-md shadow-accent/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Planning Horizon Year Selector */}
        <div className="flex items-center gap-1 bg-[#0a1128]/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1 shadow-xl">
          <Calendar className="h-3.5 w-3.5 text-slate-400 ml-2" />
          {[2025, 2030, 2045].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year as 2025 | 2030 | 2045)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedYear === year
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Tầm nhìn {year}
            </button>
          ))}
        </div>
      </div>

      {/* FLOATING CONTROLS PANEL (COLLAPSIBLE) */}
      <div className="absolute bottom-6 left-4 sm:left-6 z-10 w-[300px] sm:w-[320px] max-w-[calc(100vw-32px)]">
        <div className="bg-[#0a1128]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all">
          {/* Header */}
          <div 
            onClick={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
            className="flex items-center justify-between p-3.5 cursor-pointer border-b border-slate-800 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Lớp Bản Đồ & Độ Mờ</span>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              {isControlPanelCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Body */}
          <AnimatePresence>
            {!isControlPanelCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3.5 space-y-4"
              >
                {/* Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>Độ hiển thị quy hoạch</span>
                    <span className="text-accent">{opacityValue}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={opacityValue}
                    onChange={(e) => setOpacityValue(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* Layer Toggles */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Các Lớp Dữ Liệu</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => toggleLayer('planning')}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                        activeLayers.planning
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Quy hoạch đất</span>
                    </button>
                    <button
                      onClick={() => toggleLayer('metro')}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                        activeLayers.metro
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      <Train className="h-3.5 w-3.5" />
                      <span>Tuyến Metro</span>
                    </button>
                    <button
                      onClick={() => toggleLayer('projects')}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                        activeLayers.projects
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      <Building className="h-3.5 w-3.5" />
                      <span>Đại đô thị</span>
                    </button>
                    <button
                      onClick={() => toggleLayer('green')}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                        activeLayers.green
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      <Trees className="h-3.5 w-3.5" />
                      <span>Cây xanh/Hồ</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ZONE DETAIL DRAWER / POPUP KHI BẤM VÀO PHÂN KHU */}
      <AnimatePresence>
        {selectedZoneInfo && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 z-20 w-[340px] max-w-[calc(100vw-32px)] bg-[#0a1128]/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl text-slate-200 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-accent/20 text-accent border border-accent/30">
                  {selectedZoneInfo.type}
                </span>
                <h3 className="font-bold text-sm text-white mt-1">{selectedZoneInfo.name}</h3>
              </div>
              <button
                onClick={() => setSelectedZoneInfo(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Khu vực:</span>
                <span className="font-semibold text-white">{selectedZoneInfo.district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Thời hạn quy hoạch:</span>
                <span className="font-semibold text-emerald-400">Tầm nhìn {selectedZoneInfo.planYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Trạng thái pháp lý:</span>
                <span className="font-semibold text-accent">{selectedZoneInfo.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Mật độ xây dựng (FAR):</span>
                <span className="font-semibold text-white">{selectedZoneInfo.floorAreaRatio}x</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Chiều cao tối đa:</span>
                <span className="font-semibold text-white">{selectedZoneInfo.maxHeight}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
