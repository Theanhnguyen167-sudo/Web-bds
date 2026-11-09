'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, CreditCard, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrokerProfile } from '@/types/broker-nav';

interface BrokerAlertBannerProps {
  profile: BrokerProfile;
}

export const BrokerAlertBanner: React.FC<BrokerAlertBannerProps> = ({ profile }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const isExpired = profile.subscriptionTier === 'expired';
  const isPending = profile.verificationStatus === 'pending';
  const isRejected = profile.verificationStatus === 'rejected';

  // Không hiển thị nếu mọi thứ đều hợp lệ hoặc người dùng tạm ẩn
  if ((!isExpired && !isPending && !isRejected) || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Cảnh báo trạng thái tài khoản môi giới"
      className="sticky top-0 z-30 w-full shadow-sm transition-all"
    >
      {/* Cảnh báo hết hạn gói */}
      {isExpired && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 px-4 py-2.5 text-white text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <CreditCard className="h-4 w-4 text-white" />
            </span>
            <span>
              <strong>Gói dịch vụ đã hết hạn:</strong> Quyền khai thác kho nhà chung và tạo giao dịch mới tạm thời bị hạn chế.
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/dashboard/broker/subscription"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow hover:bg-rose-50 transition-colors"
            >
              Gia hạn ngay (Từ 189k/tháng)
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setIsDismissed(true)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              title="Tạm ẩn cảnh báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cảnh báo hồ sơ chờ duyệt (chỉ hiện nếu gói chưa hết hạn để tránh chồng chéo banner) */}
      {!isExpired && isPending && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 py-2.5 text-white text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <AlertTriangle className="h-4 w-4 text-white" />
            </span>
            <span>
              <strong>Hồ sơ đang chờ duyệt:</strong> Quản trị viên đang thẩm định chứng chỉ và hồ sơ môi giới của bạn. Bạn vẫn có thể xem kho nhà nhưng chưa thể đăng ký khách hàng.
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/dashboard/broker/settings"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 shadow hover:bg-amber-50 transition-colors"
            >
              Xem hồ sơ chứng chỉ
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setIsDismissed(true)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              title="Tạm ẩn cảnh báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cảnh báo hồ sơ bị từ chối */}
      {!isExpired && isRejected && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2.5 text-white text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <ShieldAlert className="h-4 w-4 text-white" />
            </span>
            <span>
              <strong>Hồ sơ chưa đạt tiêu chuẩn:</strong> Vui lòng cập nhật lại giấy phép/chứng chỉ hành nghề để được cấp quyền mở rộng.
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/dashboard/broker/settings"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow hover:bg-red-50 transition-colors"
            >
              Cập nhật lại hồ sơ
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setIsDismissed(true)}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              title="Tạm ẩn cảnh báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

