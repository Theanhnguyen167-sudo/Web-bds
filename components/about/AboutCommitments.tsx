'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, ShieldCheck, Cpu } from 'lucide-react';

const commitments = [
  {
    title: 'Minh bạch thông tin',
    description: 'Trình bày thông tin rõ ràng và dễ kiểm tra.',
    icon: FileText,
  },
  {
    title: 'Bảo vệ dữ liệu',
    description: 'Tôn trọng và bảo vệ thông tin cá nhân của người dùng.',
    icon: Shield,
  },
  {
    title: 'Kiểm soát tin đăng',
    description: 'Hướng tới môi trường tin đăng rõ ràng và hạn chế thông tin không phù hợp.',
    icon: ShieldCheck,
  },
  {
    title: 'Công nghệ có trách nhiệm',
    description: 'AI đóng vai trò hỗ trợ phân tích, không thay thế hoàn toàn quyết định của người dùng.',
    icon: Cpu,
  },
];

export function AboutCommitments() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 border-b border-slate-200/80">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-20">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/60 px-3.5 py-1.5 rounded-full border border-orange-200/80">
            TRÁCH NHIỆM &amp; NGUYÊN TẮC
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Cam kết của Hanoi Realty
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Chúng tôi cam kết xây dựng một môi trường thông tin bất động sản minh bạch, an toàn và đồng hành cùng người dùng trong mọi quyết định.
          </p>
        </div>

        {/* 4 Cards (1 col mobile, 2 cols tablet, 4 cols desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((item, index) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-sm hover:border-orange-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
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
