'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Target, ShieldCheck } from 'lucide-react';

const valuesData = [
  {
    type: 'TẦM NHÌN',
    badgeColor: 'bg-orange-50 text-orange-600 border border-orange-200/60',
    icon: Compass,
    title: 'Nền tảng BĐS Đáng tin cậy',
    description:
      'Trở thành nền tảng thông tin và kết nối bất động sản đáng tin cậy, nơi dữ liệu và công nghệ giúp thị trường minh bạch hơn.',
  },
  {
    type: 'SỨ MỆNH',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-200/60',
    icon: Target,
    title: 'Đơn giản hóa Mọi Trải nghiệm',
    description:
      'Đơn giản hóa quá trình tìm kiếm, kiểm tra và kết nối bất động sản bằng cách đưa thông tin và công nghệ đến gần người dùng hơn.',
  },
  {
    type: 'GIÁ TRỊ CỐT LÕI',
    badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    icon: ShieldCheck,
    title: '4 Nguyên tắc Hành động',
    description:
      'Minh bạch – Chính xác – Lấy người dùng làm trung tâm – Ứng dụng công nghệ có trách nhiệm.',
  },
];

export function AboutValues() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/60 px-3.5 py-1.5 rounded-full border border-orange-200/80">
            ĐỊNH HƯỚNG PHÁT TRIỂN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Tầm nhìn • Sứ mệnh • Giá trị cốt lõi
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Những chuẩn mực định hướng từng sản phẩm, tính năng và dịch vụ mà Hanoi Realty xây dựng cho cộng đồng.
          </p>
        </div>

        {/* 3 Cards (1 col mobile, 3 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {valuesData.map((item, index) => {
            const IconComp = item.icon;
            return (
              <motion.article
                key={item.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-xl"
              >
                <div className="space-y-6">
                  {/* Top Bar: Icon & Type Badge */}
                  <div className="flex items-center justify-between">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComp className="h-7 w-7 text-orange-500" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${item.badgeColor}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Title & Core Copy */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 text-xs font-bold text-slate-400">
                  Chuẩn mực hoạt động Hanoi Realty
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
