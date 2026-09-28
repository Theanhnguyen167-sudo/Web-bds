'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  text: string;
  name: string;
  role: string;
  organization?: string;
  rating: number;
  highlight: string;
}

const testimonials: Testimonial[] = [
  {
    text: 'Báo cáo thẩm định AI cực kỳ chi tiết và nhanh chóng. Nhờ layer phân tích quy hoạch phân khu 2030, tôi đã tự tin chốt mua căn nhà phố tại Đống Đa mà không còn lo lắng rủi ro quy hoạch.',
    name: 'Nguyễn Minh Tuấn',
    role: 'Nhà đầu tư cá nhân',
    organization: 'Hà Nội',
    rating: 5,
    highlight: 'Tránh hoàn toàn rủi ro quy hoạch treo',
  },
  {
    text: 'Layer quy hoạch 2030 và mạng lưới metro trực quan là công cụ không thể thiếu của tôi mỗi ngày. Khách hàng xem xong bản đồ đều rất ấn tượng với sự minh bạch và chuyên nghiệp.',
    name: 'Trần Thu Hằng',
    role: 'Môi giới BĐS cấp cao',
    organization: 'Sàn BĐS Thủ Đô',
    rating: 5,
    highlight: 'Tăng 40% tỷ lệ thuyết phục khách hàng',
  },
  {
    text: 'Giao diện trực quan, dữ liệu giá thị trường cập nhật live theo tuần. Tính năng xuất file PDF báo cáo đẹp chuẩn ngân hàng giúp văn phòng chúng tôi rút ngắn một nửa thời gian thẩm định sơ bộ.',
    name: 'Lê Văn Dũng',
    role: 'Giám đốc Chi nhánh',
    organization: 'Công ty CP Đầu tư Địa ốc ABC',
    rating: 5,
    highlight: 'Rút ngắn 50% thời gian thẩm định',
  },
  {
    text: 'Tính năng vẽ vùng tìm kiếm (Lasso Search) trực tiếp trên bản đồ rất mượt và thông minh. Tôi chỉ cần khoanh vùng quanh trường học của con là lọc ra ngay các căn hộ phù hợp ngân sách.',
    name: 'Vũ Quốc Bảo',
    role: 'Khách hàng mua nhà lần đầu',
    organization: 'Quận Cầu Giấy',
    rating: 5,
    highlight: 'Tìm nhà đúng nhu cầu trong 3 ngày',
  },
];

export function AboutTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slider every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
            ĐÁNH GIÁ THỰC TẾ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Khách hàng nói gì về HaNoi Realty?
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Hơn 10.000+ người mua nhà, nhà đầu tư và môi giới tin tưởng đồng hành
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative rounded-3xl border border-slate-100 bg-slate-50/80 p-8 sm:p-14 shadow-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Quote Icon Background */}
          <div className="absolute top-6 right-8 text-slate-200 pointer-events-none">
            <Quote className="h-16 w-16 opacity-40" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-6 relative z-10"
            >
              {/* Star Rating & Highlight Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-600">5.0 / 5.0</span>
                </div>
                <span className="rounded-full bg-orange-100/80 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-700">
                  ✨ {current.highlight}
                </span>
              </div>

              {/* Testimonial Quote */}
              <blockquote className="text-base sm:text-xl lg:text-2xl font-medium leading-relaxed text-slate-800 italic">
                "{current.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200/80">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold text-white shadow-md">
                  {current.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {current.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {current.role} {current.organization && `· ${current.organization}`}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls (Prev, Next, Indicators) */}
          <div className="mt-8 pt-4 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-orange-500'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Chuyển tới đánh giá ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-600 shadow-xs transition-colors"
                aria-label="Đánh giá trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-600 shadow-xs transition-colors"
                aria-label="Đánh giá tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
