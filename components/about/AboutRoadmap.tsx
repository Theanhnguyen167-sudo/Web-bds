'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, Rocket, Sparkles } from 'lucide-react';

interface Milestone {
  year: string;
  quarter?: string;
  status: 'completed' | 'in-progress' | 'planned' | 'vision';
  statusLabel: string;
  title: string;
  description: string;
  metric: string;
}

const milestones: Milestone[] = [
  {
    year: '2024',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    title: 'Thành lập & Ra mắt MVP',
    description: 'Khởi chạy bản đồ quy hoạch số, tích hợp AI định giá sơ bộ và duyệt 1.000 tin đăng đầu tiên.',
    metric: '1.000+ tin đăng',
  },
  {
    year: '2025',
    quarter: 'Q1',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    title: 'Phủ kín 29 Quận/Huyện',
    description: 'Số hóa dữ liệu quy hoạch toàn Hà Nội, tích hợp Google Gemini 1.5 Pro và xuất PDF chuyên sâu.',
    metric: '10.000+ người dùng',
  },
  {
    year: '2025',
    quarter: 'Q4',
    status: 'in-progress',
    statusLabel: 'Đang triển khai',
    title: 'Cổng thanh toán & Hội viên VIP',
    description: 'Ra mắt hệ thống thanh toán VietQR & VNPay tự động, phân hạng môi giới và gói thẩm định cao cấp.',
    metric: '50.000+ người dùng',
  },
  {
    year: '2026',
    status: 'planned',
    statusLabel: 'Kế hoạch',
    title: 'Ứng dụng Mobile iOS & Android',
    description: 'Trải nghiệm tra cứu quy hoạch thời gian thực với định vị GPS và công nghệ AR xem ranh giới thực địa.',
    metric: '200.000+ người dùng',
  },
  {
    year: '2027',
    status: 'vision',
    statusLabel: 'Tầm nhìn',
    title: 'Mở rộng Hệ sinh thái Toàn quốc',
    description: 'Nhân rộng mô hình bản đồ quy hoạch & AI thẩm định tới TP.HCM, Đà Nẵng, Nha Trang và Hải Phòng.',
    metric: '1.000.000+ người dùng',
  },
];

export function AboutRoadmap() {
  return (
    <section className="py-20 sm:py-28 bg-[#0a0f1e] text-white overflow-hidden relative border-t border-slate-800">
      {/* Subtle Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">
            LỘ TRÌNH PHÁT TRIỂN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Thanh tiến trình tương lai
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Những mốc chuyển mình quan trọng của HaNoi Realty từ khởi đầu đến vị thế dẫn đầu
          </p>
        </div>

        {/* Horizontal Progress Timeline */}
        <div className="relative">
          
          {/* Timeline Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[3px] bg-slate-800 z-0">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-slate-700 w-[55%]" />
          </div>

          {/* Milestone Cards / Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4 relative z-10">
            {milestones.map((m, idx) => {
              const isCompleted = m.status === 'completed';
              const isInProgress = m.status === 'in-progress';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className={`flex flex-col items-start lg:items-center text-left lg:text-center group ${
                    isInProgress ? 'lg:-translate-y-1' : ''
                  }`}
                >
                  {/* Status Indicator Node */}
                  <div className="flex items-center gap-3 lg:flex-col mb-4">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 group-hover:scale-110 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 shadow-md shadow-emerald-500/10'
                          : isInProgress
                          ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 text-white ring-4 ring-orange-500/30 shadow-lg shadow-orange-500/25 scale-105'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isInProgress ? (
                        <Rocket className="h-5 w-5 text-white" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>

                    {/* Timeline Pill */}
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-amber-300 border border-orange-400/50 shadow-xs'
                          : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {isInProgress ? '⚡ ' : ''}{m.year} {m.quarter && `· ${m.quarter}`}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div
                    className={`w-full rounded-2xl p-5 backdrop-blur-sm transition-all duration-300 flex-1 flex flex-col justify-between space-y-3 ${
                      isInProgress
                        ? 'border border-orange-500/40 bg-gradient-to-b from-orange-500/[0.08] via-slate-900/90 to-slate-900 shadow-xl shadow-orange-500/10 group-hover:border-orange-400/60 group-hover:shadow-orange-500/20'
                        : 'border border-slate-800 bg-slate-900/60 group-hover:border-slate-700 group-hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between lg:justify-center">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider ${
                            isInProgress ? 'text-amber-400 font-extrabold flex items-center gap-1.5' : 'text-slate-500'
                          }`}
                        >
                          {isInProgress && <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />}
                          {m.statusLabel}
                        </span>
                      </div>
                      <h3
                        className={`font-bold text-base transition-colors ${
                          isInProgress ? 'text-white font-extrabold group-hover:text-amber-300' : 'text-white group-hover:text-orange-400'
                        }`}
                      >
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      {isInProgress ? (
                        <span className="inline-block text-[11px] font-bold text-amber-300 bg-orange-500/20 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                          🎯 {m.metric}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-orange-400">
                          {m.metric}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
