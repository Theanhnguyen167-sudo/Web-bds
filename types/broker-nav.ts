/**
 * HaNoi Realty - Types cho phân hệ điều hướng Môi giới (CTV & TPKD)
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

export type BrokerRole = 'ctv' | 'tpkd';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

/**
 * Gói dịch vụ đã chốt:
 * - Free: Tháng đầu
 * - ctv_monthly: 189.000 đ/tháng
 * - tpkd_monthly: 499.000 đ/tháng
 * - expired: Đã hết hạn
 */
export type SubscriptionTier = 'free' | 'ctv_monthly' | 'tpkd_monthly' | 'expired';

export interface BrokerProfile {
  id: string;
  fullName: string;
  brokerCode: string; // VD: CTV-HN1089, TPKD-HN0021
  email: string;
  phone: string;
  avatarUrl?: string;
  role: BrokerRole;
  verificationStatus: VerificationStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string; // Chuỗi ISO ngày hết hạn
  referralCode: string;
  teamId?: string;
  teamName?: string;
  activeListingCount?: number;
  totalDealsClosed?: number;
}

export type IncomeStatus = 
  | 'estimated'    // Dự kiến
  | 'eligible'     // Đủ điều kiện
  | 'auditing'     // Chờ đối soát
  | 'paid'         // Đã chi
  | 'disputed';    // Tranh chấp

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeColor?: 'default' | 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
  isExternal?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
  requiresRole?: BrokerRole;
  isTeamManagement?: boolean;
}

