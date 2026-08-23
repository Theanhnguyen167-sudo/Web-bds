'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { HANOI_STREETS, HANOI_METRO_LINES, HANOI_RING_ROADS } from '@/lib/data/hanoi-streets';
import { formatCurrencyVND } from '@/lib/utils';
import {
  Navigation,
  Train,
  CircleDot,
  MapPin,
  Search,
  Layers,
  Sparkles,
  TrendingUp,
  Building,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function StreetsPage() {
  const [activeTab, setActiveTab] = useState<'streets' | 'metro' | 'ring-roads'>('streets');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const districts = ['all', 'Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Tây Hồ', 'Hoàn Kiếm', 'Nam Từ Liêm', 'Thanh Xuân', 'Long Biên'];

  const filteredStreets = HANOI_STREETS.filter((s) => {
    const matchDistrict = selectedDistrict === 'all' || s.district === selectedDistrict;
    const matchSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.metroLineNear && s.metroLineNear.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchDistrict && matchSearch;
  });

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-extrabold text-accent">
            <Navigation className="h-4 w-4" />
            <span>Hạ Tầng Giao Thông & Tuyến Đường Hà Nội</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Danh Mục Tuyến Đường & Mạng Lưới Metro Hà Nội
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Tra cứu thông tin lộ giới quy hoạch, đơn giá đất thị trường trung bình và các tuyến đường sắt đô thị kết nối trực tiếp với bất động sản.
          </p>
        </div>

        {/* Tab Switcher: Tuyến đường | Tuyến Metro | Đường Vành đai */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white p-1.5 border border-border shadow-sm">
            <button
              onClick={() => setActiveTab('streets')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'streets'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Navigation className="h-4 w-4 text-accent" />
              <span>Tuyến Đường Huyết Mạch ({HANOI_STREETS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('metro')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'metro'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Train className="h-4 w-4 text-emerald-400" />
              <span>Đường Sắt Metro ({HANOI_METRO_LINES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ring-roads')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'ring-roads'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <CircleDot className="h-4 w-4 text-amber-500" />
              <span>Đường Vành Đai ({HANOI_RING_ROADS.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: STREETS DIRECTORY */}
        {activeTab === 'streets' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên đường, quận, tuyến Metro..."
                  className="w-full rounded-xl border border-input bg-page-bg pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:border-accent focus:bg-white focus:outline-none"
                />
              </div>

              {/* District Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {districts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                      selectedDistrict === d
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-page-bg text-text-secondary hover:bg-slate-200'
                    }`}
                  >
                    {d === 'all' ? 'Tất cả quận' : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Streets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStreets.map((street) => (
                <motion.div
                  key={street.id}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-white p-5 shadow-sm hover:shadow-md hover:border-accent transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-extrabold text-accent">
                        Quận {street.district}
                      </span>
                      {street.isMajorArtery && (
                        <span className="rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                          Trục chính
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-text-primary">{street.name}</h3>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {street.description}
                    </p>
                  </div>

                  {/* Specs & Metro info */}
                  <div className="border-t border-border pt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Lộ giới mặt đường:</span>
                      <span className="font-bold text-text-primary">{street.widthMeters}m (Quy hoạch: {street.planningWidthMeters}m)</span>
                    </div>

                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Đơn giá đất TB:</span>
                      <span className="font-extrabold text-accent">
                        ~{(street.averagePricePerM2 / 1_000_000).toFixed(0)} triệu / m²
                      </span>
                    </div>

                    {street.metroLineNear && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                        <Train className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{street.metroLineNear}</span>
                      </div>
                    )}

                    <Link
                      href={`/?search=${encodeURIComponent(street.name)}`}
                      className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-page-bg py-2 text-xs font-bold text-primary hover:bg-accent hover:text-white transition-colors"
                    >
                      <span>Xem BĐS trên đường này</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: METRO LINES */}
        {activeTab === 'metro' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HANOI_METRO_LINES.map((metro) => (
              <div
                key={metro.id}
                className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: metro.color }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-xs"
                      style={{ backgroundColor: metro.color }}
                    >
                      <Train className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-extrabold text-text-primary">{metro.name}</h3>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      metro.status === 'operating'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {metro.status === 'operating' ? 'Đang vận hành' : 'Quy hoạch / Chuẩn bị'}
                  </span>
                </div>

                <div className="rounded-2xl bg-page-bg p-4 space-y-2 text-xs border border-border">
                  <p className="text-text-secondary font-medium leading-relaxed">
                    <span className="font-bold text-text-primary">Lộ trình: </span>
                    {metro.route}
                  </p>
                  <div className="flex items-center gap-4 text-text-muted pt-2 border-t border-border">
                    <span>Chiều dài: <strong className="text-text-primary">{metro.totalLengthKm} km</strong></span>
                    <span>Số nhà ga: <strong className="text-text-primary">{metro.stationsCount} ga</strong></span>
                  </div>
                </div>

                {/* Key Stations */}
                <div>
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    Các Ga Trọng Điểm:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {metro.keyStations.map((station, sIdx) => (
                      <span key={sIdx} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-text-primary">
                        🚉 {station}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: RING ROADS */}
        {activeTab === 'ring-roads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HANOI_RING_ROADS.map((ring) => (
              <div
                key={ring.id}
                className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-accent" />
                      {ring.name}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        ring.status === 'operating'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ring.status === 'operating' ? 'Đã hoàn thành' : 'Đang thi công'}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed bg-page-bg p-3.5 rounded-xl border border-border">
                    <strong className="text-text-primary">Tuyến lộ trình: </strong>
                    {ring.route}
                  </p>
                </div>

                <div className="border-t border-border pt-3 text-xs text-text-secondary flex items-center justify-between">
                  <span>Mặt cắt lộ giới quy hoạch:</span>
                  <span className="font-extrabold text-accent">{ring.width}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
