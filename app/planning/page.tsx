'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, MapPin, Compass, Info } from 'lucide-react';

const HybridMap = dynamic(() => import('@/components/map/HybridMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 animate-pulse rounded-xl flex items-center justify-center">
      <p className="text-white/50 text-sm">Đang tải bản đồ quy hoạch...</p>
    </div>
  ),
});

export default function PlanningPage() {
  const { listings, activeListingId, setActiveListingId } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  const filtered = selectedDistrict === 'all'
    ? listings
    : listings.filter(l => l.district.toLowerCase().includes(selectedDistrict.toLowerCase()));

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <Navbar />

      <div className="relative flex flex-1 overflow-hidden pt-16">
        {/* Fullscreen Interactive Hybrid Planning Map */}
        <div className="relative h-full w-full">
          <HybridMap
            listings={filtered}
            onListingClick={(id) => setActiveListingId(id)}
            selectedListingId={activeListingId}
          />

          {/* Floating Planning Overview Header Overlay */}
          <div className="pointer-events-none absolute top-4 left-4 z-[400] max-w-sm hidden sm:block">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-2xl text-slate-100"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white">Tra cứu Quy hoạch Hà Nội 2030 - 2050</h1>
                  <p className="text-[11px] text-slate-400">Tích hợp dữ liệu Vệ tinh Hybrid & PostGIS</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-slate-400">Lọc quận:</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                >
                  <option value="all">Tất cả quận / huyện</option>
                  <option value="Đống Đa">Đống Đa</option>
                  <option value="Cầu Giấy">Cầu Giấy</option>
                  <option value="Tây Hồ">Tây Hồ</option>
                  <option value="Hoàn Kiếm">Hoàn Kiếm</option>
                  <option value="Nam Từ Liêm">Nam Từ Liêm</option>
                  <option value="Long Biên">Long Biên</option>
                </select>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
