/**
 * HaNoi Realty - Types Schema Supabase cho Phân hệ Môi giới (Broker System)
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 * Kiến trúc: 4 Bảng SQL cốt lõi đồng bộ với Database Supabase / PostGIS
 */

import { BrokerRole, SubscriptionTier, VerificationStatus } from './broker-nav';

// ============================================================================
// 1. BẢNG SQL: broker_profiles
// ============================================================================
export interface BrokerProfileRecord {
  id: string; // UUID liên kết auth.users
  broker_code: string; // VD: 'CTV-HN1089', 'TPKD-HN0021'
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  role: BrokerRole; // 'ctv' | 'tpkd'
  subscription_tier: SubscriptionTier; // 'free' | 'ctv_monthly' | 'tpkd_monthly' | 'expired'
  subscription_expires_at: string | null; // ISO Timestamp
  verification_status: VerificationStatus; // 'pending' | 'verified' | 'rejected'
  id_card_front_url?: string;
  id_card_back_url?: string;
  license_number?: string;
  license_image_url?: string;
  license_verified_at?: string;
  referral_code: string; // Gắn mã giới thiệu vào link BĐS (?ref=CODE)
  team_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 2. BẢNG SQL: broker_curated_listings
// Quan hệ N-N: Môi giới bookmark BĐS vào Tủ hàng cá nhân.
// NGUYÊN TẮC: Tuyệt đối KHÔNG INSERT vào bảng `listings`, tránh nhân bản BĐS trên bản đồ.
// ============================================================================
export interface BrokerCuratedListingRecord {
  id: string; // UUID của mục tủ hàng
  broker_id: string; // UUID của môi giới (foreign key -> broker_profiles.id)
  broker_code: string;
  listing_id: string; // ID của BĐS trong kho nhà mở (foreign key -> listings.id)
  private_notes?: string; // Ghi chú cá nhân chỉ môi giới này xem được
  tags?: string[]; // Tag phân loại: 'khách VIP', 'đầu tư', 'hot'
  created_at: string;
  updated_at: string;
}

// Joined representation hiển thị trên giao diện Tủ hàng
export interface BrokerCuratedListingWithProperty extends BrokerCuratedListingRecord {
  propertyTitle: string;
  propertyCode: string;
  price: number;
  priceFormatted: string;
  area: number;
  address: string;
  district: string;
  thumbnailUrl: string;
  commissionRate: number; // % hoa hồng ước tính
  legalStatus: string;
  status: 'available' | 'deposited' | 'sold';
}

// ============================================================================
// 3. BẢNG SQL: broker_leads
// Quản lý phễu khách hàng & Cơ chế Đăng ký bảo lưu quyền lợi bằng chứng từ số
// ============================================================================
export type LeadFunnelStage = 
  | 'new'           // Chờ xác nhận
  | 'consulting'    // Đang tư vấn
  | 'touring'       // Đang dẫn xem
  | 'negotiating'   // Đang thương lượng
  | 'deposited'     // Đã chốt cọc
  | 'expired'       // Hết hạn bảo lưu
  | 'disputed';     // Đang tranh chấp (chờ Admin đối soát khiếu nại)

export type LeadProtectionStatus = 'active' | 'warning' | 'expired' | 'disputed';

export interface BrokerLeadRecord {
  id: string; // UUID
  registration_code: string; // Format: 'REG-YYYY-XXXX', VD: 'REG-2026-0419'
  broker_id: string;
  broker_code: string;
  customer_name: string;
  phone_hash: string; // Mã băm SHA-256 đối soát trùng lặp mà không lộ SĐT
  masked_phone: string; // VD: '0912.xxx.789'
  listing_id: string;
  target_property_code: string;
  funnel_stage: LeadFunnelStage;
  proof_image_urls: string[]; // Bằng chứng tin nhắn / cuộc gọi hẹn xem
  protection_status: LeadProtectionStatus;
  protection_days_remaining: number;
  protection_expires_at: string; // Hạn bảo lưu (72h hoặc theo thỏa thuận)
  budget?: number;
  notes?: string;
  dispute_id?: string;
  dispute_reason?: string;
  dispute_proof_urls?: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 4. BẢNG SQL: broker_commissions
// Ví hoa hồng 5 trạng thái minh bạch gắn với phiên bản thỏa thuận chốt của Deal
// ============================================================================
export type BrokerCommissionStatus = 
  | 'estimated'      // 1. Dự kiến (Khách vào cọc / đang đàm phán)
  | 'qualified'      // 2. Đủ điều kiện (Đã công chứng, bàn giao nhà thành công)
  | 'audit_pending'  // 3. Chờ đối soát (Kế toán & Admin sàn thẩm định giải ngân)
  | 'paid'           // 4. Đã chi trả (Đã chuyển khoản kèm Ủy nhiệm chi UNC)
  | 'disputed';      // 5. Đang tranh chấp (Chờ giải trình / đối soát chứng từ)

export interface BrokerCommissionRecord {
  id: string; // UUID
  deal_id: string;
  deal_code: string; // VD: 'DEAL-2026-0312'
  broker_id: string;
  broker_code: string;
  listing_id: string;
  property_code: string;
  property_title: string;
  transaction_value: number; // Giá trị giao dịch thực tế (VNĐ)
  total_commission_rate: number; // % Tổng hoa hồng chủ nhà trả sàn (VD: 2.0%)
  broker_share_rate: number; // % Môi giới được nhận (VD: 45%)
  gross_amount: number; // Hoa hồng gộp (VNĐ)
  tax_deduction: number; // Khấu trừ thuế TNCN 10% (VNĐ)
  net_payout_amount: number; // Số tiền thực nhận vào tài khoản (VNĐ)
  status: BrokerCommissionStatus;
  
  /**
   * Phiên bản thỏa thuận đã chốt của deal (BẮT BUỘC).
   * VD: 'HĐ-TT-2026-v2.1'.
   * NGUYÊN TẮC: Khóa cứng theo phiên bản đã ký, không bị ảnh hưởng bởi thay đổi biểu phí sau này.
   */
  agreement_version: string;

  disbursement_voucher_code?: string; // Mã Ủy nhiệm chi (UNC), VD: 'UNC-VCB-2026-88992'
  voucher_pdf_url?: string; // Link xem ảnh / PDF chứng từ UNC ngân hàng
  eligible_at?: string;
  audit_pending_at?: string;
  paid_at?: string;
  disputed_at?: string;
  dispute_notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 5. DỮ LIỆU KHIẾU NẠI TRÙNG KHÁCH (Lead Dispute)
// ============================================================================
export interface LeadDisputePayload {
  disputeCode: string; // VD: 'DISPUTE-2026-089'
  propertyCode: string;
  customerName: string;
  phone: string;
  currentProtectedBrokerCode?: string;
  
  // 3 Bằng chứng bắt buộc theo quy chế sàn
  proof1InitialContactUrl?: string; // Tin nhắn tương tác đầu tiên
  proof2ActualShowingUrl?: string;   // Ảnh/phiếu dẫn xem thực tế tại căn nhà
  proof3CustomerAffirmationUrl?: string; // Xác nhận từ khách hàng
  
  explanationNote: string;
  submittedAt: string;
}
