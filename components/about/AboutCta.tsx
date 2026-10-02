'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles } from 'lucide-react';

export function AboutCta() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#0d1527] via-[#0a1128] to-[#070b14] text-white text-center relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Subtle badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 backdrop-blur-md border border-white/10"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>BẮT ĐẦU TRẢI NGHIỆM</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white"
        >
          Sẵn sàng khám phá thị trường bất động sản?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Tìm kiếm bất động sản, tra cứu quy hoạch và kết nối với người đăng tin trên Hanoi Realty.
        </motion.p>

        {/* Two Action Buttons: "Khám phá bất động sản" -> /search, "Tra cứu quy hoạch" -> /planning */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-base shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Search className="h-5 w-5" />
            <span>Khám phá bất động sản</span>
          </Link>

          <Link
            href="/planning"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl text-base border border-white/15 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
          >
            <MapPin className="h-5 w-5 text-orange-400" />
            <span>Tra cứu quy hoạch</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
