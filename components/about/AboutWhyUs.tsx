'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, MapPinned, Cpu, UserCheck } from 'lucide-react';

const reasons = [
  {
    number: '01',
    title: 'Minh bạch thông tin',
    description: 'Thông tin tin đăng được trình bày rõ ràng, giúp người dùng dễ dàng so sánh và đánh giá.',
    icon: Eye,
  },
  {
    number: '02',
    title: 'Dữ liệu quy hoạch',
    description: 'Cung cấp công cụ tra cứu và trực quan hóa thông tin quy hoạch theo khu vực.',
    icon: MapPinned,
  },
  {
    number: '03',
    title: 'AI hỗ trợ phân tích',
    description: 'Ứng dụng AI để hỗ trợ đánh giá, tổng hợp và phân tích thông tin bất động sản.',
    icon: Cpu,
  },
  {
    number: '04',
    title: 'Kết nối trực tiếp',
    description: 'Hỗ trợ người mua và người bán kết nối, trao đổi và đặt lịch xem bất động sản.',
    icon: UserCheck,
  },
];

export function AboutWhyUs() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/60 px-3.5 py-1.5 rounded-full border border-orange-200/80">
            GIÁ TRỊ KHÁC BIỆT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Bất động sản minh bạch hơn, quyết định chủ động hơn
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Chúng tôi tập trung giải quyết tình trạng bất đối xứng thông tin, cung cấp các công cụ trực quan và dữ liệu đáng tin cậy cho mọi người tham gia thị trường.
          </p>
        </div>

        {/* 4 Cards (Grid 2 cols on tablet/desktop, 1 col on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {reasons.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.article
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-xl flex flex-col sm:flex-row items-start gap-6"
              >
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <IconComponent className="h-7 w-7" />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                      {item.number}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
