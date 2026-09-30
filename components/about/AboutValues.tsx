'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ValueCardProps {
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  highlights: string[];
  footerNote?: string;
  delay?: number;
}

function ValueCard({
  icon,
  badge,
  badgeColor,
  title,
  description,
  highlights,
  footerNote,
  delay = 0,
}: ValueCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-xl"
    >
      <div className="space-y-6">
        {/* Icon & Badge Header */}
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 shadow-sm transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${badgeColor}`}
          >
            {badge}
          </span>
        </div>

        {/* Title & Core Copy */}
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        {/* Highlight Bullet Points */}
        <div className="space-y-2.5 pt-2">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Highlight Footer */}
      {footerNote && (
        <div className="mt-8 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
            {footerNote}
          </p>
        </div>
      )}
    </motion.article>
  );
}

export function AboutValues() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/70">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
            KIM CHỈ NAM PHÁT TRIỂN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tầm nhìn • Sứ mệnh • Giá trị cốt lõi
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Những cam kết và chuẩn mực định hướng từng thuật toán và sản phẩm của HaNoi Realty
          </p>
        </div>

        {/* 3 Columns / 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Tầm nhìn */}
          <ValueCard
            icon={<Compass className="h-7 w-7 text-orange-500" />}
            badge="Tầm nhìn 2030"
            badgeColor="bg-orange-50 text-orange-600 border border-orange-200/60"
            title="Chuẩn hóa Hệ sinh thái BĐS Số"
            description="Trở thành nền tảng PropTech tin cậy hàng đầu Việt Nam, ứng dụng GIS và AI để kết nối mọi quyết định mua bán BĐS chuẩn xác, minh bạch."
            highlights={[
              'Tiên phong bản đồ quy hoạch số hóa liên tục 24/7',
              'Định vị dữ liệu không gian WGS84 cho toàn bộ 29 quận huyện',
              'Mục tiêu đồng hành cùng 1 triệu nhà đầu tư đến năm 2027',
            ]}
            footerNote="🎯 Cam kết: Dẫn dắt chuyển đổi số BĐS Thủ đô"
            delay={0.1}
          />

          {/* Card 2: Sứ mệnh */}
          <ValueCard
            icon={<Target className="h-7 w-7 text-blue-600" />}
            badge="Sứ mệnh"
            badgeColor="bg-blue-50 text-blue-600 border border-blue-200/60"
            title="Minh bạch & An toàn Pháp lý"
            description="Xóa bỏ hoàn toàn rào cản bất cân xứng thông tin, ngăn chặn rủi ro mua phải đất dính quy hoạch treo, bảo vệ giá trị tích lũy của từng gia đình."
            highlights={[
              'Công khai chi tiết lớp phân khu đô thị và lộ giới mở đường',
              'Báo cáo thẩm định AI khách quan, độc lập không thiên vị',
              'Tra cứu tức thì chỉ với vài cú nhấp chuột trên bản đồ',
            ]}
            footerNote="⚡ Cam kết: Mỗi ngày hỗ trợ hàng trăm người mua an tâm"
            delay={0.2}
          />

          {/* Card 3: Giá trị cốt lõi */}
          <ValueCard
            icon={<ShieldCheck className="h-7 w-7 text-emerald-600" />}
            badge="Giá trị cốt lõi"
            badgeColor="bg-emerald-50 text-emerald-600 border border-emerald-200/60"
            title="4 Nguyên tắc Bất biến"
            description="Mọi sản phẩm và số liệu tại HaNoi Realty đều được kiểm chứng nghiêm ngặt qua 4 tiêu chuẩn hành động cao nhất."
            highlights={[
              'Chính xác: Dữ liệu đối soát trực tiếp từ nguồn quy hoạch chuẩn',
              'Khách quan: Thuật toán AI định giá không chịu áp lực hoa hồng',
              'Bảo mật: Cam kết an toàn thông tin khách hàng tuyệt đối',
              'Tận tâm: Đội ngũ kỹ sư & chuyên gia giải đáp 24/7',
            ]}
            footerNote="💎 Cam kết: Đặt sự hài lòng của khách hàng lên hàng đầu"
            delay={0.3}
          />

        </div>
      </div>
    </section>
  );
}
