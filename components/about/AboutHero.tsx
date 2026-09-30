'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Search } from 'lucide-react';
import { useCountUp } from '@/lib/hooks/useScrollAnimation';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  sublabel?: string;
}

function StatItem({ value, suffix, label, sublabel }: StatItemProps) {
  const { count, ref } = useCountUp(value, 1500);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center sm:items-start text-center sm:text-left px-4 sm:px-6 py-4"
    >
      <div className="flex items-baseline gap-0.5">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {count.toLocaleString()}
        </span>
        <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-400">
          {suffix}
        </span>
      </div>
      <p className="text-sm font-bold text-slate-200 mt-1">{label}</p>
      {sublabel && (
        <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{sublabel}</p>
      )}
    </div>
  );
}

export function AboutHero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0d1527] to-[#121c33] text-white pt-28 pb-20 sm:pt-36 sm:pb-28 border-b border-slate-800/80">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Above-the-fold Center Content */}
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-orange-400 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nền tảng PropTech Thông minh Thủ đô</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.18] tracking-tight"
          >
            Nền tảng kết nối Bất động sản &amp;{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Quy hoạch thông minh
            </span>
          </motion.h1>

          {/* Sub-text (1-2 sentences) */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            HaNoi Realty kết nối người mua, người bán và nhà đầu tư trên nền tảng
            số hóa bản đồ quy hoạch minh bạch, tích hợp công nghệ AI thế hệ mới
            giúp định giá chính xác và loại bỏ rủi ro pháp lý.
          </motion.p>

          {/* Primary Quick Action Button */}
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
              <span>Khám phá tin đăng ngay</span>
            </Link>
            <Link
              href="/planning"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-colors"
            >
              <MapPin className="h-4 w-4 text-orange-400" />
              <span>Tra cứu bản đồ quy hoạch</span>
            </Link>
          </motion.div>
        </div>

        {/* Integrated Stats Section (Grid 4 cols desktop, 2 cols mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 sm:mt-16 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-3 sm:p-5 shadow-2xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <StatItem
              value={10000}
              suffix="+"
              label="Tin đăng BĐS"
              sublabel="Cập nhật thực tế liên tục"
            />
            <StatItem
              value={500}
              suffix="+"
              label="Báo cáo AI"
              sublabel="Định giá & thẩm định mỗi tháng"
            />
            <StatItem
              value={29}
              suffix=""
              label="Quận / Huyện"
              sublabel="Phủ kín dữ liệu Hà Nội"
            />
            <StatItem
              value={98}
              suffix="%"
              label="Khách hàng hài lòng"
              sublabel="Đánh giá 5 sao từ chuyên gia"
            />
          </div>
        </motion.div>

      </div>
    </header>
  );
}
