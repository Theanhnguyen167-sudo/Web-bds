'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Map, Sparkles, ArrowUpRight } from 'lucide-react';

const coreFeatures = [
  {
    number: '01',
    title: 'Tìm kiếm bất động sản',
    description: 'Khám phá các tin đăng theo khu vực, loại hình, mức giá và nhu cầu.',
    icon: Search,
    href: '/search',
    actionText: 'Khám phá tin đăng',
  },
  {
    number: '02',
    title: 'Tra cứu quy hoạch',
    description: 'Hỗ trợ người dùng tiếp cận thông tin quy hoạch để có thêm cơ sở trước khi đưa ra quyết định.',
    icon: Map,
    href: '/planning',
    actionText: 'Xem bản đồ quy hoạch',
  },
  {
    number: '03',
    title: 'Phân tích & kết nối',
    description: 'Sử dụng dữ liệu và AI để hỗ trợ đánh giá bất động sản và kết nối người mua với người bán.',
    icon: Sparkles,
    href: '/reports',
    actionText: 'Công cụ phân tích AI',
  },
];

export function AboutWhatIs() {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200/60">
            GIỚI THIỆU NỀN TẢNG
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Hanoi Realty là gì?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal pt-2">
            Hanoi Realty là nền tảng công nghệ bất động sản tập trung vào việc kết nối thông tin, dữ liệu và nhu cầu của người tham gia thị trường. Nền tảng giúp người dùng tìm kiếm bất động sản, kiểm tra thông tin quy hoạch, phân tích dữ liệu và kết nối trực tiếp với người đăng tin.
          </p>
        </div>

        {/* 3 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {coreFeatures.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.article
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-xl"
              >
                <div className="space-y-6">
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-orange-500 font-mono tracking-wider">
                      {item.number}
                    </span>
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/80 transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-orange-600 transition-colors">
                  <span>{item.actionText}</span>
                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 group-hover:bg-orange-500 group-hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
