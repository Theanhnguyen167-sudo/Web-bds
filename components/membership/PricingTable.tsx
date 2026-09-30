'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockPackages } from '@/lib/mock-data';
import { useApp } from '@/lib/context/AppContext';
import { CheckCircle2, Sparkles, ArrowRight, Lock } from 'lucide-react';

interface ServiceLimitItem {
  label: string;
  badge: string;
}

interface PackageFeatureConfig {
  serviceLimitsTitle: string;
  serviceLimits: ServiceLimitItem[];
  privilegesTitle: string;
  privileges: string[];
}

const PACKAGE_FEATURE_CONFIGS: Record<string, PackageFeatureConfig> = {
  free: {
    serviceLimitsTitle: 'Hạn mức dịch vụ',
    serviceLimits: [
      { label: 'Đăng tối đa tin BĐS (Thời hạn 7 ngày)', badge: 'x 3' },
    ],
    privilegesTitle: 'Đặc quyền hệ thống & Công nghệ',
    privileges: [
      'Xem bản đồ quy hoạch cơ bản',
      'Hỗ trợ cộng đồng trực tuyến',
    ],
  },
  basic: {
    serviceLimitsTitle: 'Hạn mức dịch vụ 30 ngày',
    serviceLimits: [
      { label: 'Tin nổi bật / tháng', badge: 'x 2' },
      { label: 'Báo cáo AI chuyên sâu & định giá', badge: 'x 5' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 30 ngày)', badge: 'x 20' },
    ],
    privilegesTitle: 'Đặc quyền hệ thống & Công nghệ',
    privileges: [
      'Tra cứu bản đồ quy hoạch chi tiết',
      'Xuất file báo cáo PDF',
      'Hỗ trợ qua Ticket & Email',
    ],
  },
  pro: {
    serviceLimitsTitle: 'Hạn mức dịch vụ 30 ngày',
    serviceLimits: [
      { label: 'Tin nổi bật / tháng', badge: 'x 10' },
      { label: 'Báo cáo AI chuyên sâu & định giá', badge: 'x 30' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 60 ngày)', badge: 'x 50' },
    ],
    privilegesTitle: 'Đặc quyền hệ thống & Công nghệ',
    privileges: [
      'Tra cứu bản đồ quy hoạch 2030 & giá đất',
      'Xuất file báo cáo PDF chuẩn chuyên nghiệp',
      'Hỗ trợ ưu tiên 24/7',
    ],
  },
  agency: {
    serviceLimitsTitle: 'Hạn mức dịch vụ 30 ngày',
    serviceLimits: [
      { label: 'Tin nổi bật / tháng', badge: 'x 40' },
      { label: 'Báo cáo AI chuyên sâu & thẩm định giá', badge: 'x 150' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 90 ngày)', badge: 'x 250' },
    ],
    privilegesTitle: 'Đặc quyền hệ thống & Công nghệ',
    privileges: [
      'Quản trị phân quyền đội ngũ môi giới',
      'Dedicated Account Manager',
      'Hỗ trợ ưu tiên 24/7',
    ],
  },
};

const ANCHOR_PRICES: Record<string, string> = {
  basic: '469.000 đ',
  pro: '1.159.000 đ',
  agency: '3.199.000 đ',
};

const getSavingsText = (pkgId: string, isYearly: boolean): string => {
  if (pkgId === 'free') {
    return 'Trải nghiệm cá nhân • Không mất phí';
  }
  if (isYearly) {
    if (pkgId === 'basic') return 'Giảm đến 32% · Tiết kiệm 150.000 đ/tháng';
    if (pkgId === 'pro') return 'Giảm đến 45% · Tiết kiệm 520.000 đ/tháng';
    if (pkgId === 'agency') return 'Giảm đến 50% · Tiết kiệm 1.600.000 đ/tháng';
  } else {
    if (pkgId === 'basic') return 'Giảm 15% · Tiết kiệm 70.000 đ/tháng';
    if (pkgId === 'pro') return 'Giảm 31% · Tiết kiệm 360.000 đ/tháng';
    if (pkgId === 'agency') return 'Giảm 38% · Tiết kiệm 1.200.000 đ/tháng';
  }
  return '';
};

export const PricingTable: React.FC = () => {
  const router = useRouter();
  const { user, addToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSelectPackage = (pkg: (typeof mockPackages)[0]) => {
    if (!user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingPackage', JSON.stringify({ packageId: pkg.id, billing: billingCycle }));
      }
      addToast('Vui lòng đăng nhập để tiến hành thanh toán gói thành viên', 'info');
      router.push(`/login?redirect=/payment/checkout?packageId=${pkg.id}&billing=${billingCycle}`);
      return;
    }

    if (pkg.id === 'free') {
      addToast('Bạn đang sử dụng gói Free mặc định', 'info');
      return;
    }

    if (user.package?.toLowerCase() === pkg.id.toLowerCase()) {
      addToast(`Bạn hiện đang kích hoạt và sử dụng Gói ${pkg.name} rồi!`, 'info');
      router.push('/dashboard');
      return;
    }

    // Navigate to payment checkout page
    router.push(`/payment/checkout?packageId=${pkg.id}&billing=${billingCycle}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 space-y-12">
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
          <span
            className={`text-xs font-bold ${
              billingCycle === 'monthly' ? 'text-primary' : 'text-text-muted'
            }`}
          >
            Thanh toán theo tháng
          </span>

          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative flex h-7 w-14 items-center rounded-full bg-primary p-1 cursor-pointer transition-colors shadow-inner"
            aria-label="Chuyển đổi chu kỳ thanh toán"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`h-5 w-5 rounded-full bg-accent shadow-md ${
                billingCycle === 'yearly' ? 'ml-auto' : 'mr-auto'
              }`}
            />
          </button>

          <span
            className={`text-xs font-bold ${
              billingCycle === 'yearly' ? 'text-primary' : 'text-text-muted'
            }`}
          >
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6 items-stretch">
        {mockPackages.map((pkg, idx) => {
          const isPro = pkg.isPopular;
          const isYearly = billingCycle === 'yearly';
          const calculatedPrice =
            isYearly && pkg.price > 0
              ? Math.floor((pkg.price * 0.8) / 1000) * 1000
              : pkg.price;

          const anchorPrice = ANCHOR_PRICES[pkg.id];
          const savingsText = getSavingsText(pkg.id, isYearly);
          const featureConfig = PACKAGE_FEATURE_CONFIGS[pkg.id] || {
            serviceLimitsTitle: 'Hạn mức dịch vụ',
            serviceLimits: [],
            privilegesTitle: 'Đặc quyền hệ thống & Công nghệ',
            privileges: [],
          };

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col rounded-3xl p-5 xl:p-6 transition-all duration-200 min-w-0 ${
                isPro
                  ? 'border-2 border-orange-500 bg-white shadow-lg lg:scale-[1.02] ring-4 ring-orange-500/10 z-10'
                  : 'border border-slate-200 bg-white hover:shadow-lg'
              }`}
            >
              {/* 4. Hero Card Banner on Top of Pro */}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/30 whitespace-nowrap z-20">
                  🔥 BÁN CHẠY NHẤT
                </div>
              )}

              {/* Package Header */}
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{pkg.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 min-h-[16px]">
                  {pkg.id === 'free'
                    ? 'Trải nghiệm cá nhân'
                    : pkg.id === 'basic'
                    ? 'Môi giới độc lập'
                    : pkg.id === 'pro'
                    ? 'Nhà đầu tư & Môi giới VIP'
                    : 'Sàn giao dịch BĐS'}
                </p>
              </div>

              {/* 1. PRICE ANCHORING BLOCK */}
              <div className="pt-4">
                {/* Giá gốc gạch ngang */}
                <div className="min-h-[20px] flex items-center">
                  {anchorPrice ? (
                    <span className="text-gray-400 line-through text-sm font-medium">
                      {anchorPrice}
                    </span>
                  ) : (
                    <span className="invisible text-sm">&nbsp;</span>
                  )}
                </div>

                {/* Giá bán chính thức */}
                <div className="my-1 flex items-baseline gap-1 whitespace-nowrap min-w-0">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {calculatedPrice === 0 ? 'Miễn phí' : calculatedPrice.toLocaleString('vi-VN')}
                  </span>
                  {calculatedPrice > 0 && (
                    <span className="text-xs sm:text-sm font-bold text-slate-500">
                      đ/tháng
                    </span>
                  )}
                </div>

                {/* Dòng phụ cam/đỏ ngay dưới giá */}
                <p
                  className={`text-xs font-semibold min-h-[18px] ${
                    isPro ? 'text-orange-600' : 'text-rose-600'
                  }`}
                >
                  {savingsText}
                </p>
              </div>

              {/* 2. REPOSITIONED CTA BUTTON (NGAY DƯỚI DÒNG TIẾT KIỆM) */}
              <div className="pt-3.5 pb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    isPro
                      ? 'bg-[#f97316] hover:bg-[#ea580c] text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35'
                      : 'bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm hover:shadow-md'
                  }`}
                >
                  <span className="truncate">
                    {pkg.id === 'free' ? 'Gói cơ bản (Free)' : `Nâng cấp ${pkg.name}`}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </motion.button>
              </div>

              {/* 3. TÁI CẤU TRÚC DANH SÁCH TÍNH NĂNG THÀNH 2 KHỐI */}
              <div className="flex-1 flex flex-col justify-start pt-3 border-t border-slate-100 space-y-4">
                {/* Khối 1: Hạn mức dịch vụ 30 ngày (Dạng Flex justify-between, badge căn sát lề phải, sắp xếp TĂNG DẦN theo số lượng) */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {featureConfig.serviceLimitsTitle}
                  </div>
                  <div className="space-y-2">
                    {featureConfig.serviceLimits.map((item, idxLimit) => (
                      <div
                        key={idxLimit}
                        className="flex items-center justify-between gap-2 text-xs font-medium text-slate-700 leading-snug"
                      >
                        <span className="truncate pr-1">{item.label}</span>
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-md shrink-0 border ${
                            isPro
                              ? 'bg-orange-50 text-orange-600 border-orange-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Khối 2: Đặc quyền hệ thống & Công nghệ (Nằm nửa dưới thẻ, icon checkmark xanh lá) */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {featureConfig.privilegesTitle}
                  </div>
                  <div className="space-y-2">
                    {featureConfig.privileges.map((privilege, idxPriv) => (
                      <div
                        key={idxPriv}
                        className="flex items-start gap-2 text-xs font-medium text-slate-700 leading-snug"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{privilege}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── PAYMENT METHODS LOGO ROW ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 text-center">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Chấp nhận thanh toán bảo mật 100% qua:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-extrabold text-slate-700">
          <div className="flex items-center gap-1.5 bg-pink-50 text-[#ae2070] px-3.5 py-2 rounded-xl border border-pink-200">
            <span className="h-5 w-5 rounded-lg bg-[#ae2070] text-white flex items-center justify-center font-black text-[10px]">M</span>
            <span>Ví MoMo QR</span>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-50 text-[#0066cc] px-3.5 py-2 rounded-xl border border-blue-200">
            <span className="h-5 w-5 rounded-lg bg-[#0066cc] text-white flex items-center justify-center font-black text-[10px]">VNP</span>
            <span>Cổng VNPay (40+ Ngân hàng)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200">
            <span>💳 Visa / Mastercard / JCB</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl border border-emerald-200">
            <span>🏛️ Chuyển khoản Vietcombank</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-500" /> Mã hóa SSL 256-bit
          </span>
          <span>·</span>
          <span>Kích hoạt gói tức thì trong 3 giây</span>
          <span>·</span>
          <span>Hỗ trợ hoàn tiền trong 7 ngày</span>
        </div>
      </div>
    </div>
  );
};

