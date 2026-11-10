/**
 * HaNoi Realty - Types cho phân hệ Quản Trị Đội Nhóm TPKD (Team Management)
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 * Nguyên tắc: Thù lao quản lý dựa trên đóng góp/nhiệm vụ thực tế, không có hoa hồng tuyển dụng.
 */

import { SubscriptionTier } from './broker-nav';

export type TeamMemberRole = 'ctv' | 'ctv_senior';

export type TeamMemberStatus = 'active' | 'inactive' | 'pending_invite';

export interface TeamMemberAppointmentSummary {
  dateText: string; // VD: "Hôm nay 15:30", "09/04/2026"
  location: string; // VD: "Ngõ 34 Hoàng Cầu, Đống Đa"
  propertyCode: string; // VD: "HN-DDA-092"
}

export interface TeamMember {
  id: string;
  brokerCode: string; // VD: "CTV-HN1089"
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  subscriptionTier: SubscriptionTier;
  joinedAt: string; // ISO
  activeCuratedListings: number; // Số căn trong tủ hàng
  activeLeadsCount: number; // Số khách đang chăm
  totalClosedDeals: number; // Số deal chốt thành công
  lastAppointment?: TeamMemberAppointmentSummary;
  hasPendingHelpRequest?: boolean;
  pendingHelpDealCode?: string;
  pendingHelpTopic?: string;
}

export type ManagementRewardStatus = 'in_progress' | 'completed' | 'disbursed';

export type ContributionType = 
  | 'legal_appraisal'       // Thẩm định hồ sơ pháp lý & quy hoạch phức tạp
  | 'negotiation_support'   // Hỗ trợ đàm phán giá & chốt cọc tại hiện trường
  | 'dispute_resolution'    // Hòa giải vướng mắc các bên
  | 'notary_closing';       // Hỗ trợ thủ tục công chứng & bàn giao nhà

export interface ManagementReward {
  id: string;
  taskCode: string; // VD: "TASK-TPKD-2026-081"
  dealCode: string; // VD: "DEAL-2026-0389"
  propertyCode: string; // VD: "HN-DDA-092"
  propertyTitle: string; // VD: "Nhà phố Hoàng Cầu 5 tầng"
  ctvCode: string; // VD: "CTV-HN1089"
  ctvName: string; // VD: "Trần Minh Đức"
  contributionType: ContributionType;
  contributionTitle: string;
  notes: string;
  rewardAmount: number; // VNĐ
  status: ManagementRewardStatus;
  createdAt: string;
  completedAt?: string;
  disbursedAt?: string;
  voucherCode?: string; // Mã phiếu chi / UNC nội bộ
}

export interface TeamStats {
  totalMembers: number;
  activeWeeklyMembers: number;
  weeklyAppointmentsCount: number;
  dealsRequiringHelpCount: number;
  totalManagementRewardsCompleted: number;
  totalRewardsAmount: number; // VNĐ
}

export interface TeamInvitePayload {
  brokerCodeOrEmail: string;
  note?: string;
}

