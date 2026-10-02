'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Home, Briefcase, TrendingUp, CheckCircle2 } from 'lucide-react';

const audienceSegments = [
  {
    title: 'Người mua / người thuê',
    badge: 'An tâm & Chủ động',
    icon: User,
    features: [
      'Tìm kiếm bất động sản',
      'Xem thông tin chi tiết',
      'Tra cứu quy hoạch',
      'Đặt lịch xem nhà',
    ],
  },
  {
    title: 'Chủ nhà / người bán',
    badge: 'Tiếp cận nhanh chóng',
    icon: Home,
    features: [
      'Đăng tin bất động sản',
      'Quản lý tin đăng',
      'Theo dõi lịch hẹn',
      'Nhận thông báo',
    ],
  },
  {
    title: 'Môi giới',
    badge: 'Công cụ chuyên nghiệp',
    icon: Briefcase,
    features: [
      'Quản lý danh sách bất động sản',
      'Tiếp cận khách hàng',
      'Quản lý lịch hẹn',
      'Theo dõi hiệu quả tin đăng',
    ],
  },
  {
    title: 'Nhà đầu tư',
    badge: 'Dữ liệu chuyên sâu',
    icon: TrendingUp,
    features: [
      'Theo dõi thị trường',
      'Phân tích dữ liệu',
      'Tra cứu quy hoạch',
      'Hỗ trợ đánh giá bất động sản',
    ],
  },
];

export function AboutTargetAudience() {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200/60">
            ĐỐI TƯỢNG PHỤC VỤ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Hanoi Realty dành cho ai?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Chúng tôi thiết kế các tính năng phù hợp cho từng mắt xích trong thị trường, từ người tìm nhà cá nhân đến các nhà đầu tư và môi giới chuyên nghiệp.
          </p>
        </div>

        {/* 4 Cards (1 col mobile, 2 cols tablet, 4 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {audienceSegments.map((segment, index) => {
            const IconComp = segment.icon;
            return (
              <motion.article
                key={segment.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-xl"
              >
                <div className="space-y-5">
                  {/* Top: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform duration-300">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                      {segment.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    {segment.title}
                  </h3>

                  {/* Bullet points */}
                  <div className="space-y-3 pt-2">
                    {segment.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 text-xs font-semibold text-slate-400 group-hover:text-orange-500 transition-colors">
                  Tích hợp đồng bộ trên nền tảng
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
