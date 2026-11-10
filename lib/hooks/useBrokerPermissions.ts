'use client';

import { useMemo, useCallback } from 'react';
import { BrokerProfile } from '@/types/broker-nav';
import { useApp } from '@/lib/context/AppContext';

export interface BrokerPermissions {
  // Trạng thái tài khoản
  isExpired: boolean;
  isVerified: boolean;
  isPending: boolean;
  isRejected: boolean;
  isTpkd: boolean;
  isCtv: boolean;

  // 1. TÁC VỤ TẠO MỚI (Bị khóa khi subscriptionTier === 'expired' hoặc chưa duyệt hồ sơ)
  canRegisterLead: boolean;
  canBookAppointment: boolean;
  canDownloadMarketingKit: boolean;
  canCurateListings: boolean;
  canInviteTeamMembers: boolean;
  canExportPortfolio: boolean;

  // 2. QUYỀN TRUY CẬP ĐỌC & BẢO LƯU (100% LUÔN MỞ DÙ HẾT HẠN GÓI)
  canViewCommissions: true; // Luôn xem được ví hoa hồng 5 trạng thái
  canViewCustomersHistory: true; // Luôn xem được danh sách khách cũ
  canViewCuratedInventory: true; // Luôn xem được các căn đã lưu trước đó
  canViewAgreements: true; // Luôn xem và tải PDF các thỏa thuận/hợp đồng cũ
  canViewTeamMembers: boolean; // TPKD luôn xem được danh sách thành viên cũ
  canViewManagementRewards: boolean; // TPKD luôn xem được thù lao quản lý đã phát sinh

  // Reassurance message cam kết của HaNoi Realty
  reassuranceMessage: string;

  // Helper thực thi hành động an toàn kèm toast tiếng Việt
  guardAction: (
    actionName: string,
    onExecute: () => void,
    customBlockedMessage?: string
  ) => boolean;

  // Lấy lý do bị giới hạn (nếu có)
  getRestrictionReason: (actionName: string) => string | null;
}

/**
 * Hook phân tầng quyền hạn Môi giới HaNoi Realty:
 * - Khi hết hạn gói (`subscription_tier === 'expired'`), chỉ khóa các nút tạo tác vụ mới (Thêm lead, Đặt lịch, Tải kit).
 * - Giữ nguyên 100% quyền truy cập đọc vào bảng hoa hồng và danh sách khách cũ.
 */
export function useBrokerPermissions(profile?: BrokerProfile | null): BrokerPermissions {
  let addToastFn: ((msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void) | null = null;
  try {
    const appContext = useApp();
    addToastFn = appContext?.addToast || null;
  } catch {
    // Không nằm trong AppProvider thì bỏ qua toast
  }

  const isExpired = profile?.subscriptionTier === 'expired';
  const isVerified = profile?.verificationStatus === 'verified';
  const isPending = profile?.verificationStatus === 'pending';
  const isRejected = profile?.verificationStatus === 'rejected';
  const isTpkd = profile?.role === 'tpkd';
  const isCtv = profile?.role === 'ctv';

  // 1. Quyền tác vụ tạo mới (Cần cả còn hạn gói và đã duyệt hồ sơ)
  const canOperate = !isExpired && isVerified;

  const canRegisterLead = canOperate;
  const canBookAppointment = canOperate;
  const canDownloadMarketingKit = canOperate;
  const canCurateListings = canOperate;
  const canExportPortfolio = canOperate;
  const canInviteTeamMembers = isTpkd && canOperate;

  // 2. Quyền truy cập đọc & bảo lưu
  const canViewCommissions = true as const;
  const canViewCustomersHistory = true as const;
  const canViewCuratedInventory = true as const;
  const canViewAgreements = true as const;
  const canViewTeamMembers = isTpkd;
  const canViewManagementRewards = isTpkd;

  const reassuranceMessage =
    'Cam kết bảo lưu quyền lợi HaNoi Realty: Dù gói dịch vụ của bạn hết hạn, bạn vẫn có toàn quyền 100% truy cập bảng kê đối soát hoa hồng và danh sách khách hàng cũ. Sàn không bao giờ khấu trừ hay hủy bỏ quyền lợi đã phát sinh hợp lệ.';

  const getRestrictionReason = useCallback(
    (actionName: string): string | null => {
      if (isExpired) {
        return `Gói dịch vụ của bạn đã hết hạn. Bạn không thể thực hiện "${actionName}". Vui lòng gia hạn gói để tiếp tục. Quyền lợi hoa hồng và dữ liệu khách cũ vẫn được bảo toàn nguyên vẹn 100%.`;
      }
      if (isPending) {
        return `Hồ sơ môi giới của bạn đang chờ Ban Pháp chế xét duyệt trong 2-4h. Tính năng "${actionName}" sẽ được tự động mở ngay khi tài khoản được kích hoạt.`;
      }
      if (isRejected) {
        return `Hồ sơ môi giới chưa đạt điều kiện xác thực. Vui lòng cập nhật lại ảnh CCCD và chứng chỉ hành nghề để mở tính năng "${actionName}".`;
      }
      return null;
    },
    [isExpired, isPending, isRejected]
  );

  const guardAction = useCallback(
    (actionName: string, onExecute: () => void, customBlockedMessage?: string): boolean => {
      const reason = getRestrictionReason(actionName);
      if (reason) {
        const messageToShow = customBlockedMessage || reason;
        if (addToastFn) {
          addToastFn(messageToShow, 'warning');
        } else if (typeof window !== 'undefined') {
          alert(messageToShow);
        }
        return false;
      }

      onExecute();
      return true;
    },
    [getRestrictionReason, addToastFn]
  );

  return useMemo(
    () => ({
      isExpired,
      isVerified,
      isPending,
      isRejected,
      isTpkd,
      isCtv,
      canRegisterLead,
      canBookAppointment,
      canDownloadMarketingKit,
      canCurateListings,
      canInviteTeamMembers,
      canExportPortfolio,
      canViewCommissions,
      canViewCustomersHistory,
      canViewCuratedInventory,
      canViewAgreements,
      canViewTeamMembers,
      canViewManagementRewards,
      reassuranceMessage,
      guardAction,
      getRestrictionReason,
    }),
    [
      isExpired,
      isVerified,
      isPending,
      isRejected,
      isTpkd,
      isCtv,
      canRegisterLead,
      canBookAppointment,
      canDownloadMarketingKit,
      canCurateListings,
      canInviteTeamMembers,
      canExportPortfolio,
      reassuranceMessage,
      guardAction,
      getRestrictionReason,
    ]
  );
}

