/**
 * HaNoi Realty - Types cho phân hệ Quản lý khách hàng (CRM) & Đăng ký bảo lưu môi giới
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

export type LeadStage =
  | 'all'
  | 'pending_confirmation' // Chờ xác nhận
  | 'consulting'           // Đang tư vấn
  | 'viewing'              // Đang dẫn xem
  | 'negotiating'          // Đang thương lượng
  | 'deposited'            // Đã chốt cọc
  | 'expired';             // Hết hạn

export type ProtectionStatus =
  | 'active'     // Đang bảo lưu hợp lệ
  | 'warning'    // Sắp hết hạn bảo lưu (< 5 ngày)
  | 'expired'    // Đã hết hạn bảo lưu
  | 'disputed';  // Đang tranh chấp / khiếu nại

export interface LeadTimelineEntry {
  id: string;
  createdAt: string;
  type: 'call' | 'message' | 'viewing' | 'note' | 'status_change';
  title: string;
  content: string;
  authorName: string;
}

export interface LeadItem {
  id: string;
  fullName: string;
  maskedPhone: string; // VD: 0912.xxx.789
  rawPhone?: string;
  email?: string;
  budget?: number; // Ngân sách dự kiến (VND)
  targetListingId: string;
  targetPropertyCode: string; // VD: HR-BDS-1024
  targetListingTitle: string;
  stage: Exclude<LeadStage, 'all'>;
  protectionStatus: ProtectionStatus;
  protectionDaysRemaining: number;
  protectionExpiresAt: string; // ISO String
  evidenceUrl?: string; // Link ảnh chụp màn hình tin nhắn / nhật ký cuộc gọi
  evidenceNote?: string;
  lastContactAt: string;
  nextAction: string;
  nextActionDate?: string;
  createdAt: string;
  timeline: LeadTimelineEntry[];
  isDisputed?: boolean;
  disputeReason?: string;
}

export interface NewLeadFormData {
  fullName: string;
  phone: string;
  email?: string;
  budget?: number;
  targetPropertyCode: string;
  note: string;
  evidenceFile?: File | null;
  evidencePreviewUrl?: string;
  termsAgreed: boolean;
}

