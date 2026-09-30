'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockPackages } from '@/lib/mock-data';
import { useApp } from '@/lib/context/AppContext';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Zap,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';

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
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/25 px-4 py-1.5 text-xs font-black text-orange-600 shadow-xs"
        >
          <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
          <span>Gói Hội Viên Đăng Tin & Thẩm Định AI</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0a1128] tracking-tight leading-tight">
          Nâng Tầm Hiệu Quả{' '}
          <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Giao Dịch Bất Động Sản
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Tối ưu chi phí môi giới, tiếp cận hàng ngàn khách mua và sở hữu công cụ phân tích quy hoạch AI độc quyền tại Hà Nội.
        </p>

        {/* Monthly / Yearly Switcher */}
        <div className="pt-3 flex items-center justify-center gap-3.5">
          <span
            onClick={() => setBillingCycle('monthly')}
            className={`text-xs sm:text-sm font-extrabold cursor-pointer transition-colors ${
              billingCycle === 'monthly' ? 'text-[#0a1128]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Thanh toán theo tháng
          </span>

          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative flex h-8 w-16 items-center rounded-full bg-[#0a1128] p-1 cursor-pointer transition-colors shadow-inner ring-2 ring-orange-500/20"
            aria-label="Chuyển đổi chu kỳ thanh toán"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              className={`h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-md flex items-center justify-center ${
                billingCycle === 'yearly' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div className="h-2 w-2 rounded-full bg-white/80" />
            </motion.div>
          </button>

          <span
            onClick={() => setBillingCycle('yearly')}
            className={`text-xs sm:text-sm font-extrabold cursor-pointer transition-colors ${
              billingCycle === 'yearly' ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
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
                className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-[11px] font-black text-white shadow-sm shadow-emerald-500/25 animate-bounce"
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
          const isAgency = pkg.id === 'agency';
          const isBasic = pkg.id === 'basic';
          const isFree = pkg.id === 'free';
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
              className={`relative flex flex-col rounded-3xl p-4 sm:p-5 xl:p-5 transition-all duration-300 min-w-0 ${
                isPro
                  ? 'border-2 border-orange-500 bg-gradient-to-b from-orange-50/50 via-white to-amber-50/20 shadow-xl shadow-orange-500/15 lg:scale-[1.03] ring-4 ring-orange-500/15 z-10'
                  : isAgency
                  ? 'border border-indigo-200/90 bg-white hover:border-indigo-400/80 hover:shadow-xl'
                  : isBasic
                  ? 'border border-blue-200/80 bg-white hover:border-blue-400/70 hover:shadow-xl'
                  : 'border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {/* 4. Hero Card Banner on Top of Pro */}
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/40 whitespace-nowrap z-20 flex items-center gap-1.5 border border-white/30">
                  <Flame className="h-3.5 w-3.5 fill-white" />
                  <span>BÁN CHẠY NHẤT</span>
                </div>
              )}

              {/* Package Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-lg sm:text-xl font-black ${
                      isPro
                        ? 'text-orange-600'
                        : isAgency
                        ? 'text-indigo-950'
                        : isBasic
                        ? 'text-[#0a1128]'
                        : 'text-slate-800'
                    }`}
                  >
                    {pkg.name}
                  </h3>

                  {isPro && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xs">
                      VIP
                    </span>
                  )}
                  {isAgency && (
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-gradient-to-r from-[#0a1128] to-indigo-900 text-amber-300 shadow-2xs">
                      DOANH NGHIỆP
                    </span>
                  )}
                  {isBasic && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                      MÔI GIỚI
                    </span>
                  )}
                </div>

                <p className="text-[12px] text-slate-500 font-medium mt-1 min-h-[18px]">
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
                <div className="min-h-[22px] flex items-center">
                  {anchorPrice ? (
                    <span className="text-gray-400 line-through text-sm font-semibold whitespace-nowrap">
                      {anchorPrice}
                    </span>
                  ) : (
                    <span className="invisible text-sm">&nbsp;</span>
                  )}
                </div>

                {/* Giá bán chính thức */}
                <div className="my-1 flex items-baseline gap-1.5 whitespace-nowrap min-w-0">
                  <span
                    className={`text-2xl sm:text-[28px] xl:text-3xl font-black tracking-tight shrink-0 ${
                      isPro ? 'text-slate-900' : 'text-[#0a1128]'
                    }`}
                  >
                    {calculatedPrice === 0 ? 'Miễn phí' : calculatedPrice.toLocaleString('vi-VN')}
                  </span>
                  {calculatedPrice > 0 && (
                    <span className="text-xs sm:text-sm font-extrabold text-slate-500 shrink-0 whitespace-nowrap">
                      đ/tháng
                    </span>
                  )}
                </div>

                {/* Dòng phụ cam/đỏ ngay dưới giá: whitespace-nowrap để 'đ/tháng' luôn cùng 1 dòng với giá */}
                <div className="min-h-[28px] flex items-center pt-0.5 overflow-hidden">
                  <span
                    className={`whitespace-nowrap text-[10.5px] sm:text-[11px] xl:text-[11.5px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 shadow-2xs ${
                      isPro
                        ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-300'
                        : isAgency || isBasic
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {savingsText}
                  </span>
                </div>
              </div>

              {/* 2. REPOSITIONED CTA BUTTON (NGAY DƯỚI DÒNG TIẾT KIỆM) */}
              <div className="pt-3.5 pb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    isPro
                      ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/35 hover:shadow-orange-500/50'
                      : isAgency
                      ? 'bg-gradient-to-r from-[#0a1128] via-[#1a2744] to-[#1e1b4b] hover:from-[#141e34] hover:to-[#2e1065] text-white shadow-md hover:shadow-lg'
                      : 'bg-gradient-to-r from-[#0a1128] to-[#1a2744] hover:from-[#141e34] hover:to-[#24365d] text-white shadow-md hover:shadow-lg'
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
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{featureConfig.serviceLimitsTitle}</span>
                  </div>
                  <div className="space-y-2">
                    {featureConfig.serviceLimits.map((item, idxLimit) => (
                      <div
                        key={idxLimit}
                        className="flex items-center justify-between gap-2 text-xs leading-snug"
                      >
                        <span className="text-slate-700 font-semibold text-left">
                          {item.label}
                        </span>
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] rounded-md shrink-0 border ${
                            isPro
                              ? 'bg-orange-100/90 text-orange-700 border-orange-300 font-black shadow-2xs'
                              : isAgency
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-black shadow-2xs'
                              : isBasic
                              ? 'bg-blue-50 text-blue-700 border-blue-200 font-extrabold shadow-2xs'
                              : 'bg-slate-100 text-slate-700 border-slate-200 font-bold'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Khối 2: Đặc quyền hệ thống & Công nghệ (Nằm nửa dưới thẻ, icon checkmark xanh lá) */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{featureConfig.privilegesTitle}</span>
                  </div>
                  <div className="space-y-2">
                    {featureConfig.privileges.map((privilege, idxPriv) => (
                      <div
                        key={idxPriv}
                        className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 leading-snug"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 fill-emerald-50" />
                        <span className="text-slate-700">{privilege}</span>
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
      <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 text-center">
        <p className="text-xs font-black text-[#0a1128] uppercase tracking-wider flex items-center justify-center gap-2">
          <Award className="h-4 w-4 text-orange-500" />
          <span>Chấp nhận thanh toán bảo mật 100% qua</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-black text-slate-700">
          <div className="flex items-center gap-2 bg-pink-50 text-[#ae2070] px-4 py-2.5 rounded-xl border border-pink-200 shadow-2xs hover:shadow-xs transition-shadow">
            <span className="h-5 w-5 rounded-lg bg-[#ae2070] text-white flex items-center justify-center font-black text-[10px]">M</span>
            <span>Ví MoMo QR</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 text-[#0066cc] px-4 py-2.5 rounded-xl border border-blue-200 shadow-2xs hover:shadow-xs transition-shadow">
            <span className="h-5 w-5 rounded-lg bg-[#0066cc] text-white flex items-center justify-center font-black text-[10px]">VNP</span>
            <span>Cổng VNPay (40+ Ngân hàng)</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
            <span>💳 Visa / Mastercard / JCB</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-200 shadow-2xs hover:shadow-xs transition-shadow">
            <span>🏛️ Chuyển khoản Vietcombank</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[12px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <Lock className="h-3.5 w-3.5 text-emerald-500" /> Mã hóa SSL 256-bit
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

