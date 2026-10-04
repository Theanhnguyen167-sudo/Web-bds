'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/lib/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, ShieldCheck, MapPin, Compass, Info, 
  Train, Building, Trees, Sliders, Calendar, ChevronRight, 
  ChevronUp, ChevronDown, X, Scissors, FileText, Sparkles, Filter
} from 'lucide-react';
import type { SelectedZoneInfo } from '@/components/map/PlanningMap';
import { 
  HANOI_SUBDIVISION_GROUPS, 
  PLANNING_STANDARD_SYMBOLS,
  HANOI_DISTRICTS_PLANNING_PROFILES 
} from '@/lib/planning/hanoi-planning-db';

const PlanningMap = dynamic(
  () => import('@/components/map/PlanningMap'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full bg-[#0a1128] rounded-xl flex items-center justify-center">
        <div className="text-white/60 text-sm font-semibold animate-pulse flex items-center gap-2">
          <span>🗺️</span> Đang tải bản đồ quy hoạch Thủ đô Hà Nội...
        </div>
      </div>
    )
  }
);

const ALL_DISTRICTS = [
  { id: 'all', label: 'Tất cả quận' },
  { id: 'Đống Đa', label: 'Đống Đa' },
  { id: 'Cầu Giấy', label: 'Cầu Giấy' },
  { id: 'Ba Đình', label: 'Ba Đình' },
  { id: 'Tây Hồ', label: 'Tây Hồ' },
  { id: 'Hoàn Kiếm', label: 'Hoàn Kiếm' },
  { id: 'Hai Bà Trưng', label: 'Hai Bà Trưng' },
  { id: 'Nam Từ Liêm', label: 'Nam Từ Liêm' },
  { id: 'Bắc Từ Liêm', label: 'Bắc Từ Liêm' },
  { id: 'Thanh Xuân', label: 'Thanh Xuân' },
  { id: 'Hoàng Mai', label: 'Hoàng Mai' },
  { id: 'Long Biên', label: 'Long Biên' },
  { id: 'Hà Đông', label: 'Hà Đông' },
  { id: 'Phân khu Sông Hồng', label: 'Sông Hồng' },
];

export function PlanningClient() {
  const { listings } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<2025 | 2030 | 2045>(2030);
  const [opacityValue, setOpacityValue] = useState<number>(45);
  const [isSwipeMode, setIsSwipeMode] = useState<boolean>(false);
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

  // Lọc danh sách quận theo nhóm đồ án phân khu được chọn
  const currentGroup = HANOI_SUBDIVISION_GROUPS.find(g => g.id === selectedGroup);
  const availableDistricts = selectedGroup === 'ALL'
    ? ALL_DISTRICTS
    : [
        { id: 'all', label: `Tất cả ${currentGroup?.shortLabel || ''}` },
        ...ALL_DISTRICTS.filter(d => currentGroup?.districts.includes(d.id))
      ];

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    setSelectedDistrict('all');
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden bg-[#070d1e]">
      {/* MAP VIEWPORT CHÍNH */}
      <div className="absolute inset-0 z-0">
        <PlanningMap
          activeDistrict={selectedDistrict}
          subdivisionGroup={selectedGroup}
          zoneTypeCode={selectedSymbol}
          planYear={selectedYear}
          opacity={opacityValue}
          activeLayers={activeLayers}
          onZoneClick={setSelectedZoneInfo}
          isSwipeMode={isSwipeMode}
          onToggleSwipeMode={setIsSwipeMode}
        />
      </div>

      {/* TOP FLOATING CONTROLS: NHÓM PHÂN KHU + QUẬN + NĂM + SOI RÈM */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto z-10 flex flex-col gap-2 max-w-full">
        {/* Hàng 1: Tabs Nhóm Phân Khu Quy Hoạch (H1, H2, N, S, Sông Hồng...) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-[calc(100vw-32px)] sm:max-w-4xl">
          <div className="flex items-center gap-1 bg-[#0a1128]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1 shadow-2xl shrink-0">
            {HANOI_SUBDIVISION_GROUPS.map((group) => {
              const isActive = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                  title={`${group.name} - ${group.legalBasis}`}
                >
                  <span>{group.shortLabel}</span>
                  {group.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-semibold ${
                      isActive ? 'bg-black/25 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {group.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Nút bật/tắt Soi Rèm Hiện Trạng */}
          <button
            onClick={() => setIsSwipeMode(!isSwipeMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xl shrink-0 border ${
              isSwipeMode
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 ring-2 ring-amber-400/40 shadow-orange-500/40'
                : 'bg-[#0a1128]/90 backdrop-blur-md text-slate-200 border-slate-700 hover:text-white hover:border-slate-500'
            }`}
            title="Kéo trượt để so sánh hiện trạng vệ tinh với quy hoạch 2030"
          >
            <Scissors className={`h-3.5 w-3.5 ${isSwipeMode ? 'rotate-90 text-white' : 'text-amber-400'}`} />
            <span>{isSwipeMode ? 'Đang Soi rèm' : 'Soi rèm hiện trạng'}</span>
          </button>
        </div>

        {/* Hàng 2: Bộ lọc Quận cụ thể + Tầm nhìn Năm */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-[calc(100vw-32px)] sm:max-w-3xl">
          {/* Pills Quận */}
          <div className="flex items-center gap-1 bg-[#0a1128]/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1 shadow-xl shrink-0">
            {availableDistricts.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDistrict === d.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Horizon Year */}
          <div className="flex items-center gap-1 bg-[#0a1128]/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1 shadow-xl shrink-0">
            <Calendar className="h-3.5 w-3.5 text-slate-400 ml-2" />
            {[2025, 2030, 2045].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year as 2025 | 2030 | 2045)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedYear === year
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Hàng 3: Lọc nhanh theo Loại Đất Chuẩn Quốc Gia (ODT, TMD, HH, CX, GT, CQ, GD, YT, CN, QSQP) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-[calc(100vw-32px)] sm:max-w-4xl">
          <div className="flex items-center gap-1 bg-[#0a1128]/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 shadow-lg shrink-0">
            <div className="flex items-center gap-1 px-1.5 text-slate-400 text-[11px] font-bold">
              <Filter className="h-3 w-3 text-orange-400" />
              <span>Loại đất:</span>
            </div>

            <button
              onClick={() => setSelectedSymbol('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                selectedSymbol === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tất cả
            </button>

            {Object.values(PLANNING_STANDARD_SYMBOLS).map((sym) => {
              const isChosen = selectedSymbol === sym.code;
              return (
                <button
                  key={sym.code}
                  onClick={() => setSelectedSymbol(isChosen ? 'all' : sym.code)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
                    isChosen
                      ? 'border-white text-white font-bold shadow-xs'
                      : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                  style={isChosen ? { backgroundColor: `${sym.color}40`, borderColor: sym.color } : {}}
                  title={`${sym.code}: ${sym.name} - ${sym.desc}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: sym.color }}
                  />
                  <span>{sym.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Căn cứ pháp lý đồ án phân khu */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#0a1128]/80 backdrop-blur-md border border-slate-800/80 rounded-xl text-[11px] text-slate-300 shadow-md max-w-2xl">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">
            {selectedDistrict !== 'all' && HANOI_DISTRICTS_PLANNING_PROFILES[selectedDistrict]
              ? HANOI_DISTRICTS_PLANNING_PROFILES[selectedDistrict].legalBasis
              : currentGroup?.legalBasis}
          </span>
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
              <Sliders className="h-4 w-4 text-orange-400" />
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
                    <span className="text-orange-400 font-bold">{opacityValue}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={opacityValue}
                    onChange={(e) => setOpacityValue(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
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
                      <Layers className="h-3.5 w-3.5 text-blue-400" />
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
                      <Train className="h-3.5 w-3.5 text-amber-400" />
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
                      <Building className="h-3.5 w-3.5 text-purple-400" />
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
                      <Trees className="h-3.5 w-3.5 text-emerald-400" />
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
            style={{ borderLeft: `5px solid ${selectedZoneInfo.color}` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedZoneInfo.code && (
                    <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                      {selectedZoneInfo.code}
                    </span>
                  )}
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {selectedZoneInfo.type}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white mt-1 leading-snug">{selectedZoneInfo.name}</h3>
              </div>
              <button
                onClick={() => setSelectedZoneInfo(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white shrink-0"
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
                <span className="font-semibold text-amber-400">{selectedZoneInfo.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Quy mô phân khu:</span>
                <span className="font-semibold text-white">
                  {selectedZoneInfo.areaHa ? `${selectedZoneInfo.areaHa} ha` : 'Đang cập nhật'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Mật độ xây dựng:</span>
                <span className="font-semibold text-white">{selectedZoneInfo.density || '60%'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Hệ số SDĐ (FAR):</span>
                <span className="font-semibold text-white">{selectedZoneInfo.floorAreaRatio ? `${selectedZoneInfo.floorAreaRatio}x` : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Chiều cao tối đa:</span>
                <span className="font-semibold text-white">{selectedZoneInfo.maxHeight}</span>
              </div>
            </div>

            {selectedZoneInfo.pdfUrl && (
              <a
                href={selectedZoneInfo.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full 
                           bg-red-500/20 hover:bg-red-500/30 border border-red-500/40
                           text-red-300 text-xs font-bold py-2.5 px-3 
                           rounded-xl transition-colors shadow-xs"
              >
                <FileText size={14} className="text-red-400 shrink-0" />
                <span className="truncate">Tải/Xem Đồ án Quy hoạch PDF</span>
              </a>
            )}

            <a
              href={`/search?district=${encodeURIComponent(selectedZoneInfo.district)}`}
              className="flex items-center justify-center gap-2 w-full 
                         bg-orange-500 hover:bg-orange-600 
                         text-white text-xs font-bold py-2.5 px-3 
                         rounded-xl transition-colors shadow-md shadow-orange-500/25"
            >
              <span>🔍 Tìm BĐS trong khu vực này</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
