'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, CreditCard, Sparkles, ArrowRight } from 'lucide-react';

export function AboutCta() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 text-white text-center relative overflow-hidden">
      {/* Subtle background ambient circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-black/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Sub badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Sẵn sàng trải nghiệm thông minh</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white"
        >
          Bắt đầu ngay hôm nay — Miễn phí
        </motion.h2>

        {/* Short Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-white/90 max-w-xl mx-auto font-normal leading-relaxed"
        >
          Tra cứu bản đồ quy hoạch phân khu Hà Nội và nhận báo cáo thẩm định AI chính xác chỉ trong vài phút.
        </motion.p>

        {/* Primary CTA Button: "Tìm kiếm BĐS ngay" -> /search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-2 flex justify-center"
        >
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-orange-600 hover:bg-orange-50 font-black rounded-2xl text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 group"
          >
            <Search className="h-5 w-5 text-orange-600" />
            <span>Tìm kiếm BĐS ngay</span>
            <ArrowRight className="h-4 w-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Trust Badges Micro-copy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs sm:text-sm font-semibold text-white/85"
        >
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4" />
            Không cần thẻ tín dụng
          </span>
          <span className="hidden sm:inline opacity-60">·</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Hủy bất kỳ lúc nào
          </span>
          <span className="hidden sm:inline opacity-60">·</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Hoàn tiền 7 ngày
          </span>
        </motion.div>

      </div>
    </section>
  );
}
