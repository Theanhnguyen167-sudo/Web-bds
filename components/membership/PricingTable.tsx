'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockPackages } from '@/lib/mock-data';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrencyVND } from '@/lib/utils';
import { CheckCircle2, Sparkles, Zap, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

export const PricingTable: React.FC = () => {
  const router = useRouter();
  const { user, setUser, addToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPackage = (pkg: typeof mockPackages[0]) => {
    if (!user) {
      addToast('Vui lòng đăng nhập để nâng cấp gói thành viên', 'info');
      router.push('/login');
      return;
    }

    if (pkg.id === 'free') {
      addToast('Bạn đang sử dụng gói Free mặc định', 'info');
      return;
    }

    // Simulate payment / upgrade
    setUser({
      ...user,
      package: pkg.id,
      packageExpiry: '2026-08-30',
      aiReportsLimit: pkg.aiReports === -1 ? 999 : pkg.aiReports,
    });

    addToast(`🎉 Đã kích hoạt thành công Gói ${pkg.name}!`, 'success');
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-10">
      
      {/* Header & Toggle */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-extrabold text-accent">
          <Sparkles className="h-4 w-4" />
          <span>Gói Hội Viên Đăng Tin & Thẩm Định AI</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Nâng Tầm Hiệu Quả Giao Dịch Bất Động Sản
        </h1>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Tối ưu chi phí môi giới, tiếp cận hàng ngàn khách mua và sở hữu công cụ phân tích quy hoạch AI độc quyền tại Hà Nội.
        </p>

        {/* Monthly / Yearly Switcher */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-primary' : 'text-text-muted'}`}>
            Thanh toán theo tháng
          </span>

          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative flex h-7 w-14 items-center rounded-full bg-primary p-1 cursor-pointer transition-colors shadow-inner"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`h-5 w-5 rounded-full bg-accent shadow-md ${
                billingCycle === 'yearly' ? 'ml-auto' : 'mr-auto'
              }`}
            />
          </button>

          <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-primary' : 'text-text-muted'}`}>
            Thanh toán 1 năm
          </span>

          <AnimatePresence>
            {billingCycle === 'yearly' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: -5 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-extrabold text-success animate-bounce"
              >
                Tiết kiệm 20%
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {mockPackages.map((pkg, idx) => {
          const isPro = pkg.isPopular;
          const calculatedPrice =
            billingCycle === 'yearly' && pkg.price > 0
              ? Math.round(pkg.price * 0.8)
              : pkg.price;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all duration-200 ${
                isPro
                  ? 'border-accent ring-4 ring-accent/15 shadow-glow lg:scale-105 z-10'
                  : 'border-border hover:shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  🔥 Phổ biến nhất
                </div>
              )}

              <div>
                {/* Package Name */}
                <h3 className="text-base font-extrabold text-text-primary">{pkg.name}</h3>
                <p className="text-[11px] text-text-secondary mt-1">
                  {pkg.id === 'free'
                    ? 'Trải nghiệm cá nhân'
                    : pkg.id === 'basic'
                    ? 'Môi giới độc lập'
                    : pkg.id === 'pro'
                    ? 'Nhà đầu tư & Môi giới VIP'
                    : 'Sàn giao dịch BĐS'}
                </p>

                {/* Price Display */}
                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-text-primary">
                    {calculatedPrice === 0 ? 'Miễn phí' : `${calculatedPrice.toLocaleString('vi-VN')} đ`}
                  </span>
                  {calculatedPrice > 0 && (
                    <span className="text-xs font-semibold text-text-muted">/tháng</span>
                  )}
                </div>

                {/* Feature List */}
                <div className="border-t border-border pt-4 space-y-2.5 text-xs text-text-primary">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>
                      {pkg.listings === -1 ? 'Không giới hạn tin đăng' : `Đăng tối đa ${pkg.listings} tin`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>Thời hạn tin: {pkg.duration} ngày</span>
                  </div>

                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>
                      {pkg.aiReports === -1
                        ? 'Báo cáo AI không giới hạn'
                        : pkg.aiReports === 0
                        ? 'Chưa hỗ trợ báo cáo AI'
                        : `${pkg.aiReports} Báo cáo AI chuyên sâu`}
                    </span>
                  </div>

                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-text-secondary">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectPackage(pkg)}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-extrabold transition-all shadow-sm ${
                  isPro
                    ? 'bg-accent text-white shadow-md shadow-accent/25 hover:bg-accent-hover'
                    : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                <span>{pkg.id === 'free' ? 'Đang sử dụng' : `Chọn gói ${pkg.name}`}</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
