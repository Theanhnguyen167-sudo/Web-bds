'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CreditCard, ArrowRight, X, Lock } from 'lucide-react';
import { BrokerProfile } from '@/types/broker-nav';

interface AccountRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BrokerProfile;
  featureName?: string;
}

export const AccountRestrictedModal: React.FC<AccountRestrictedModalProps> = ({
  isOpen,
  onClose,
  profile,
  featureName = 'tính năng này',
}) => {
  if (!isOpen) return null;

  const isExpired = profile.subscriptionTier === 'expired';
  const isUnverified = profile.verificationStatus !== 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Đóng hộp thoại"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon & Tiêu đề */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4 ring-8 ring-amber-50/50">
            {isExpired ? (
              <CreditCard className="h-7 w-7 text-rose-600" />
            ) : (
              <Lock className="h-7 w-7 text-amber-600" />
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            {isExpired ? 'Gói dịch vụ đã hết hạn' : 'Tài khoản cần xác thực điều kiện'}
          </h3>

          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Để truy cập <strong>{featureName}</strong> (bao gồm xem tỷ lệ hoa hồng nội bộ, tải Marketing Kit và lưu tủ hàng), tài khoản môi giới cần đáp ứng điều kiện vận hành của <strong>HaNoi Realty</strong>.
          </p>
        </div>

        {/* Khối giải thích chi tiết */}
        <div className="mt-5 space-y-2.5 rounded-xl bg-slate-50 p-4 border border-slate-200/60 text-xs">
          {isUnverified && (
            <div className="flex items-start gap-2.5 text-slate-700">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Hồ sơ chứng chỉ:</strong> Đang ở trạng thái{' '}
                <span className="font-semibold text-amber-700">
                  {profile.verificationStatus === 'pending' ? 'Chờ duyệt' : 'Chưa hoàn tất'}
                </span>
                . Bạn cần ban quản trị thẩm định để mở quyền giao dịch chính thức.
              </span>
            </div>
          )}

          {isExpired && (
            <div className="flex items-start gap-2.5 text-slate-700">
              <CreditCard className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                <strong>Thời hạn gói công cụ:</strong> Gói CTV của bạn đã hết hạn. Vui lòng gia hạn để duy trì kết nối kho dữ liệu chuyên sâu.
              </span>
            </div>
          )}
        </div>

        {/* Hàng nút hành động */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          {isExpired ? (
            <Link
              href="/dashboard/broker/subscription"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Gia hạn gói (Từ 189k/tháng)
            </Link>
          ) : (
            <Link
              href="/dashboard/broker/settings"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              Cập nhật hồ sơ chứng chỉ
            </Link>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

