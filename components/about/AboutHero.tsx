'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, ShieldCheck, Database, Cpu, Compass } from 'lucide-react';
import { mockListings } from '@/lib/mock-data';

export function AboutHero() {
  // Lấy dữ liệu thực tế từ hệ thống hiện có
  const activeListingsCount = mockListings ? mockListings.length : 24;

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0d1527] to-[#121c33] text-white pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-slate-800/80">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Above-the-fold Center Content */}
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-orange-400 backdrop-blur-md shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-orange-400" />
            <span className="tracking-wide">MINH BẠCH HÓA THỊ TRƯỜNG BẤT ĐỘNG SẢN</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight"
          >
            Hanoi Realty <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Kết nối Bất động sản &amp; Quy hoạch thông minh
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Hanoi Realty giúp người mua, người bán và nhà đầu tư tiếp cận thông tin bất động sản minh bạch hơn thông qua dữ liệu, công nghệ AI và thông tin quy hoạch.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Search className="h-4 w-4" />
              <span>Khám phá bất động sản</span>
            </Link>
            <Link
              href="/planning"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all transform hover:-translate-y-0.5"
            >
              <MapPin className="h-4 w-4 text-orange-400" />
              <span>Tra cứu quy hoạch</span>
            </Link>
          </motion.div>
        </div>

        {/* Khối chỉ số hệ thống (Stats block dựa trên hệ thống thực tế) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 sm:mt-16 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-4 sm:p-6 shadow-2xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            
            {/* Metric 1 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Database className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Hệ thống</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {activeListingsCount}+
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200 mt-1">Tin đăng bất động sản</p>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Đầy đủ tọa độ &amp; pháp lý</p>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Phạm vi</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Hà Nội
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200 mt-1">Khu vực hỗ trợ</p>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Quận nội thành &amp; vùng phát triển</p>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Cpu className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Công nghệ</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Tự động
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200 mt-1">Báo cáo AI</p>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Định giá &amp; phân tích theo nhu cầu</p>
            </div>

            {/* Metric 4 */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2 text-orange-400 mb-1">
                <Compass className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Trực quan</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  24/7
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200 mt-1">Tra cứu quy hoạch</p>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Bản đồ số hóa cập nhật liên tục</p>
            </div>

          </div>
        </motion.div>

      </div>
    </header>
  );
}
