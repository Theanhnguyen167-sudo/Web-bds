'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Copy, 
  Check, 
  Menu, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  ShieldAlert, 
  Crown, 
  Sparkles,
  User,
  Share2
} from 'lucide-react';
import { BrokerProfile, SubscriptionTier, BrokerRole, VerificationStatus } from '@/types/broker-nav';
import { cn } from '@/lib/utils';

interface BrokerHeaderProps {
  profile: BrokerProfile;
  onToggleSidebarMobile?: () => void;
}

export const BrokerHeader: React.FC<BrokerHeaderProps> = ({
  profile,
  onToggleSidebarMobile,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hanoirealty.vn';
    const refLink = `${origin}?ref=${encodeURIComponent(profile.referralCode || profile.brokerCode)}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(refLink);
      } else {
        // Fallback cho môi trường không hỗ trợ clipboard api trực tiếp
        const textArea = document.createElement('textarea');
        textArea.value = refLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Không thể sao chép liên kết:', err);
    }
  };

  // Render badge vai trò
  const renderRoleBadge = (role: BrokerRole) => {
    if (role === 'tpkd') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
          <Crown className="w-3 h-3 text-purple-600" />
          Trưởng phòng KD
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
        <Sparkles className="w-3 h-3 text-blue-600" />
        Cộng tác viên
      </span>
    );
  };

  // Render pill trạng thái gói
  const renderSubscriptionPill = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Gói Miễn phí (Tháng đầu)
          </span>
        );
      case 'ctv_monthly':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Gói CTV (189.000đ/tháng)
          </span>
        );
      case 'tpkd_monthly':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Crown className="h-3 w-3 text-purple-600" />
            Gói TPKD (499.000đ/tháng)
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Gói Hết Hạn
          </span>
        );
    }
  };

  // Render badge trạng thái duyệt hồ sơ
  const renderVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span 
            title="Hồ sơ chứng chỉ đã được HaNoi Realty xác thực" 
            className="inline-flex items-center text-xs font-medium text-emerald-600 gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Đã duyệt hồ sơ
          </span>
        );
      case 'pending':
        return (
          <span 
            title="Đang trong quá trình xét duyệt hồ sơ" 
            className="inline-flex items-center text-xs font-medium text-amber-600 gap-1"
          >
            <Clock className="w-3.5 h-3.5" />
            Chờ duyệt
          </span>
        );
      case 'rejected':
        return (
          <span 
            title="Hồ sơ bị từ chối xét duyệt" 
            className="inline-flex items-center text-xs font-medium text-red-600 gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Cần bổ sung
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Khối bên trái: Nút Menu Mobile + Thông tin môi giới */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebarMobile}
            className="inline-flex lg:hidden items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Mở danh mục điều hướng"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Avatar + Tên + Mã định danh */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-sm">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                profile.fullName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                  {profile.fullName}
                </span>
                <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {profile.brokerCode}
                </span>
                {renderRoleBadge(profile.role)}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                {renderVerificationBadge(profile.verificationStatus)}
                <span className="text-slate-300 text-xs hidden sm:inline">•</span>
                <div className="hidden sm:inline-block">
                  {renderSubscriptionPill(profile.subscriptionTier)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khối bên phải: Nút Sao chép Link Giới thiệu & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile display of subscription pill if screen small */}
          <div className="sm:hidden">
            {renderSubscriptionPill(profile.subscriptionTier)}
          </div>

          {/* Nút copy link giới thiệu gắn mã môi giới */}
          <button
            type="button"
            onClick={handleCopyReferral}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all shadow-sm",
              copied
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            )}
            title="Sao chép đường dẫn giới thiệu khách gắn mã môi giới của bạn"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                <span>Đã chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden sm:inline">Link giới thiệu</span>
                <span className="font-mono font-bold text-[11px] text-blue-800">
                  #{profile.referralCode || profile.brokerCode}
                </span>
              </>
            )}
          </button>

          {/* Nút xem Trang chủ / Kho BĐS ngoài */}
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Mở cổng thông tin công khai HaNoi Realty"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Xem Website</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

