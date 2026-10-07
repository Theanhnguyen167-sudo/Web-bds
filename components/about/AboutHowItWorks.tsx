'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, Cpu, MessageSquare, CheckCircle, ArrowRight, ArrowDown } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Tìm kiếm',
    description: 'Tìm bất động sản phù hợp với nhu cầu.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Kiểm tra',
    description: 'Xem thông tin vị trí, pháp lý và quy hoạch.',
    icon: ShieldAlert,
  },
  {
    step: '03',
    title: 'Phân tích',
    description: 'Tham khảo dữ liệu và công cụ AI hỗ trợ đánh giá.',
    icon: Cpu,
  },
  {
    step: '04',
    title: 'Kết nối',
    description: 'Liên hệ với người đăng tin hoặc đặt lịch xem nhà.',
    icon: MessageSquare,
  },
  {
    step: '05',
    title: 'Ra quyết định',
    description: 'Có thêm thông tin để chủ động đưa ra quyết định bất động sản.',
    icon: CheckCircle,
  },
];

export function AboutHowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-[#0a1128] text-white relative overflow-hidden border-y border-slate-800">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full">
            QUY TRÌNH HOẠT ĐỘNG
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Hanoi Realty hoạt động như thế nào?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Quy trình 5 bước liền mạch giúp bạn tiếp cận bất động sản minh bạch, kiểm tra quy hoạch và kết nối giao dịch chủ động, tự tin.
          </p>
        </div>

        {/* Desktop Process: Horizontal Layout */}
        <div className="hidden lg:block relative">
          
          {/* Connector Line behind nodes */}
          <div className="absolute top-7 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-orange-500/60 via-amber-400/60 to-emerald-500/60 z-0" />

          {/* 5 Step Nodes Grid */}
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Node Circle */}
                  <div className="relative mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-slate-900 border-2 border-orange-500/60 text-white flex items-center justify-center font-black text-base shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:border-orange-400 transition-all duration-300">
                      <IconComp className="h-6 w-6 text-orange-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full font-mono shadow-sm">
                      {item.step}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="w-full rounded-2xl bg-white/[0.05] border border-white/10 p-5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/[0.08] group-hover:border-orange-400/50 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Process: Vertical Timeline */}
        <div className="lg:hidden relative pl-6 sm:pl-8 space-y-6">
          {/* Vertical Line */}
          <div className="absolute top-4 bottom-4 left-6 sm:left-8 w-[2px] -translate-x-1/2 bg-gradient-to-b from-orange-500 via-amber-400 to-emerald-500" />

          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="relative pl-8 sm:pl-10"
              >
                {/* Node on vertical line */}
                <div className="absolute left-0 top-3 -translate-x-1/2 h-9 w-9 rounded-xl bg-slate-900 border-2 border-orange-500 text-orange-400 flex items-center justify-center font-black text-xs shadow-md">
                  <IconComp className="h-4 w-4" />
                </div>

                {/* Content Box */}
                <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">
                      Bước {item.step}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
