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
  ctv_free: {
    serviceLimitsTitle: 'Hạn mức tháng trải nghiệm',
    serviceLimits: [
      { label: 'Khai thác kho BĐS mở', badge: 'Chuẩn' },
      { label: 'Thời hạn trải nghiệm', badge: '30 ngày' },
    ],
    privilegesTitle: 'Đặc quyền khởi đầu',
    privileges: [
      'Cấp Member ID định danh CTV riêng',
      'Đăng ký bảo lưu khách 72h chống trùng',
      'Xem nguồn hàng sạch đã xác thực',
      'Nhận 50% hoa hồng chốt deal',
    ],
  },
  ctv: {
    serviceLimitsTitle: 'Hạn mức dịch vụ thực chiến',
    serviceLimits: [
      { label: 'Kho nhà mở Hà Nội', badge: 'Không giới hạn' },
      { label: 'Tủ hàng cá nhân', badge: 'Không giới hạn' },
    ],
    privilegesTitle: 'Đặc quyền môi giới chuyên nghiệp',
    privileges: [
      'Toàn quyền khai thác kho nhà mở KHÔNG GIỚI HẠN',
      'CRM chuyên sâu: Đăng ký bảo lưu khách 72h',
      'Tải trọn bộ Marketing Kit sạch (ảnh HD, bài viết)',
      'Gắn mã CTV (#CTV...) vào link BĐS',
      'Ví hoa hồng đối soát 5 trạng thái minh bạch',
    ],
  },
  tpkd: {
    serviceLimitsTitle: 'Hạn mức quản trị đội nhóm',
    serviceLimits: [
      { label: 'Quản trị CTV thành viên', badge: 'Đội nhóm' },
      { label: 'Bàn làm việc TPKD Manager', badge: 'Độc quyền' },
    ],
    privilegesTitle: 'Đặc quyền Trưởng phòng KD',
    privileges: [
      'Toàn bộ đặc quyền của gói CTV Tiêu chuẩn',
      'Bảng điều khiển Quản trị đội nhóm CTV trực thuộc',
      'Mời & phân bổ khách cho CTV trong nhóm',
      'Nhận Thù lao Quản lý (5 - 15 triệu/deal)',
      'Lưu ý: Quyền TPKD cần hồ sơ quản trị được duyệt',
    ],
  },
};

const ANCHOR_PRICES: Record<string, string> = {
  ctv: '249.000 đ',
  tpkd: '699.000 đ',
};

const getSavingsText = (pkgId: string, isYearly: boolean): string => {
  if (pkgId === 'ctv_free' || pkgId === 'free') {
    return 'Miễn phí trải nghiệm tháng đầu';
  }
  if (pkgId === 'ctv') {
    return isYearly ? 'Tiết kiệm 20% khi thanh toán 1 năm' : 'Giảm 24% • Tiết kiệm 60.000 đ/tháng';
  }
  if (pkgId === 'tpkd') {
    return isYearly ? 'Tiết kiệm 20% khi thanh toán 1 năm' : 'Giảm 28% • Tiết kiệm 200.000 đ/tháng';
  }
  return '';
};

export const PricingTable: React.FC = () => {
  const router = useRouter();
  const { user, addToast, upgradeUserPackage } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSelectPackage = (pkg: (typeof mockPackages)[0]) => {
    if (pkg.id === 'tpkd') {
      addToast('Gói TPKD yêu cầu xét duyệt hồ sơ quản lý và thẩm định điều kiện riêng trước khi kích hoạt.', 'info');
      router.push('/danh-cho-moi-gioi#tpkd');
      return;
    }

    if (!user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingPackage', JSON.stringify({ packageId: pkg.id, billing: billingCycle }));
      }
      if (pkg.id === 'ctv_free') {
        router.push('/register?role=ctv');
      } else {
        addToast('Vui lòng đăng nhập để tiến hành kích hoạt gói thành viên', 'info');
        router.push(`/login?redirect=/payment/checkout?packageId=${pkg.id}&billing=${billingCycle}`);
      }
      return;
    }

    if (pkg.id === 'ctv_free' || pkg.id === 'free') {
      if (user.package?.toLowerCase() === 'ctv_free' || user.package?.toLowerCase() === 'ctv') {
        addToast('Bạn đã có gói CTV hoạt động!', 'info');
      } else {
        upgradeUserPackage('ctv_free');
        addToast('🎉 Đã kích hoạt Gói CTV Free tháng đầu! Toàn quyền trải nghiệm kho BĐS mở.', 'success');
        router.push('/dashboard/broker');
      }
      return;
    }

    if (user.package?.toLowerCase() === pkg.id.toLowerCase()) {
      addToast(`Bạn hiện đang kích hoạt và sử dụng Gói ${pkg.name} rồi!`, 'info');
      router.push('/dashboard?tab=packages');
      return;
    }

    // Navigate to payment checkout page
    router.push(`/payment/checkout?packageId=${pkg.id}&billing=${billingCycle}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 space-y-12">
      {/* Header & Toggle */}
      <div className="relative text-center space-y-4 w-full max-w-6xl mx-auto px-4">
        {/* Ambient Warm Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 sm:w-[580px] h-32 bg-gradient-to-r from-orange-400/15 via-amber-400/20 to-orange-400/15 blur-3xl rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/25 px-4 py-1.5 text-xs font-black text-orange-600 shadow-xs backdrop-blur-xs"
        >
          <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
          <span>Gói Hội Viên Đăng Tin &amp; Quảng Bá BĐS</span>
        </motion.div>

        <h1 
          style={{ whiteSpace: 'nowrap' }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-[38px] xl:text-[42px] font-black text-[#0a1128] tracking-tight leading-tight whitespace-nowrap text-center"
        >
          <span>Nâng Tầm Hiệu Quả </span>
          <span 
            style={{ whiteSpace: 'nowrap' }}
            className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm"
          >
            Giao Dịch Bất Động Sản
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tối ưu chi phí môi giới, tiếp cận hàng ngàn khách mua và quản lý tin đăng bất động sản chuyên nghiệp tại Hà Nội.
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {mockPackages
          .filter((p) => ['ctv_free', 'ctv', 'tpkd'].includes(p.id))
          .map((pkg, idx) => {
            const isCtv = pkg.id === 'ctv';
            const isTpkd = pkg.id === 'tpkd';
            const isCtvFree = pkg.id === 'ctv_free';
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
              privilegesTitle: 'Đặc quyền',
              privileges: [],
            };

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-3xl p-5 xl:p-6 transition-all duration-300 min-w-0 ${
                  isCtv
                    ? 'border-2 border-orange-500 bg-gradient-to-b from-orange-50/50 via-white to-amber-50/20 shadow-xl shadow-orange-500/15 lg:scale-[1.03] ring-4 ring-orange-500/15 z-10'
                    : isTpkd
                    ? 'border-2 border-purple-400 bg-white hover:border-purple-500 hover:shadow-xl'
                    : 'border border-blue-200 bg-white hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                {/* 4. Hero Card Banner on Top of CTV */}
                {isCtv && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/40 whitespace-nowrap z-20 flex items-center gap-1.5 border border-white/30">
                    <Flame className="h-3.5 w-3.5 fill-white" />
                    <span>MÔI GIỚI THỰC CHIẾN • PHỔ BIẾN NHẤT</span>
                  </div>
                )}
                {isTpkd && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-purple-600/30 whitespace-nowrap z-20 flex items-center gap-1.5 border border-white/30">
                    <Award className="h-3.5 w-3.5 fill-white" />
                    <span>QUẢN TRỊ ĐỘI NHÓM</span>
                  </div>
                )}

                {/* Package Header */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-lg sm:text-xl font-black ${
                        isCtv
                          ? 'text-orange-600'
                          : isTpkd
                          ? 'text-purple-900'
                          : 'text-blue-900'
                      }`}
                    >
                      {pkg.name}
                    </h3>

                    {isCtv && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                        189K / THÁNG
                      </span>
                    )}
                    {isTpkd && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        499K / THÁNG
                      </span>
                    )}
                    {isCtvFree && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        FREE THÁNG ĐẦU
                      </span>
                    )}
                  </div>

                  <p className="text-[12px] text-slate-500 font-medium mt-1 min-h-[18px]">
                    {isCtvFree
                      ? 'Miễn phí tháng đầu cho môi giới mới'
                      : isCtv
                      ? 'Dành cho môi giới hoạt động thường xuyên'
                      : 'Dành cho Trưởng phòng kinh doanh (Cần xét duyệt)'}
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
                      isCtv ? 'text-orange-600' : isTpkd ? 'text-purple-900' : 'text-[#0a1128]'
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

                {/* Thanh ưu đãi/tiết kiệm lướt ngang marquee lặp liên tục với tốc độ vừa phải */}
                <div className="pt-1.5 min-h-[32px] flex items-center">
                  <div
                    className={`w-full h-[28px] rounded-lg overflow-hidden relative flex items-center select-none shadow-2xs ${
                      isCtv
                        ? 'bg-gradient-to-r from-orange-100/90 via-amber-100/90 to-orange-100/90 text-orange-900 border border-orange-300/90'
                        : isTpkd
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/90'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {/* Hiệu ứng làm mờ nhẹ 2 mép viền để chữ vào/ra thanh thoát */}
                    <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)]">
                      <div className="flex w-max items-center animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] cursor-default">
                        {/* Nhóm 1 */}
                        <div className="flex shrink-0 items-center">
                          <span className="whitespace-nowrap text-[11px] sm:text-[11.5px] font-bold px-3">
                            {savingsText}
                          </span>
                          <span className="text-[10px] opacity-40 select-none">✦</span>
                          <span className="whitespace-nowrap text-[11px] sm:text-[11.5px] font-bold px-3">
                            {savingsText}
                          </span>
                          <span className="text-[10px] opacity-40 select-none">✦</span>
                        </div>
                        {/* Nhóm 2 (bản sao giống hệt để lặp vô tận liền mạch) */}
                        <div className="flex shrink-0 items-center" aria-hidden="true">
                          <span className="whitespace-nowrap text-[11px] sm:text-[11.5px] font-bold px-3">
                            {savingsText}
                          </span>
                          <span className="text-[10px] opacity-40 select-none">✦</span>
                          <span className="whitespace-nowrap text-[11px] sm:text-[11.5px] font-bold px-3">
                            {savingsText}
                          </span>
                          <span className="text-[10px] opacity-40 select-none">✦</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. REPOSITIONED CTA BUTTON (NGAY DƯỚI DÒNG TIẾT KIỆM) */}
              <div className="pt-3.5 pb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    isCtv
                      ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/35 hover:shadow-orange-500/50'
                      : isTpkd
                      ? 'bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 hover:from-purple-800 hover:to-indigo-950 text-white shadow-md hover:shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <span className="truncate">
                    {isCtvFree
                      ? 'Đăng ký CTV Free'
                      : isCtv
                      ? 'Nâng cấp CTV (189.000 đ)'
                      : 'Tìm hiểu gói TPKD'}
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
                            isCtv
                              ? 'bg-orange-100/90 text-orange-700 border-orange-300 font-black shadow-2xs'
                              : isTpkd
                              ? 'bg-purple-50 text-purple-700 border-purple-200 font-black shadow-2xs'
                              : 'bg-blue-50 text-blue-700 border-blue-200 font-extrabold shadow-2xs'
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

