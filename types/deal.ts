import { Listing } from './listing';
import { Profile, UserRole, VerificationStatus } from './database';

export type { UserRole, VerificationStatus };

export type DealStatus = 
  | 'draft'                 // Khởi tạo phiếu đề nghị
  | 'offer_accepted'        // 2 bên chốt giá cuối
  | 'deposit_pending'       // Chờ người mua nộp cọc vào TK ngân hàng phong tỏa
  | 'escrow_locked'         // Tiền cọc đã khóa an toàn tại Ngân hàng
  | 'notarized'             // Đã ký HĐMB tại Phòng Công chứng
  | 'handover_completed'    // Đã bàn giao nhà & nộp hồ sơ sang tên
  | 'settled'               // Ngân hàng đã giải ngân đủ cho Chủ nhà và chia hoa hồng CTV
  | 'disputed'              // Phát sinh tranh chấp (chờ giải quyết theo điều khoản HĐ)
  | 'cancelled';            // Hủy giao dịch hợp lệ

export type EscrowStatus = 
  | 'waiting_deposit'       // Đang chờ nhận tiền cọc ban đầu
  | 'funds_locked'          // Tiền đang được phong tỏa an toàn tại ngân hàng
  | 'partially_released'    // Đã giải ngân một phần (VD: mốc công chứng)
  | 'fully_released'        // Đã giải ngân toàn bộ
  | 'refunded';             // Hoàn tiền cho người mua (nếu chủ nhà vi phạm)

export type MilestoneCode = 
  | 'deposit'               // Cọc giữ chỗ / Cọc giao dịch
  | 'notarization'          // Ký hợp đồng mua bán công chứng
  | 'tax_and_title'         // Nộp thuế & hồ sơ sang tên
  | 'handover_settlement';  // Bàn giao nhà và tất toán giải ngân

export type DisputeReason = 
  | 'legal_issue'           // Trục trặc pháp lý (sổ đỏ bị ngăn chặn, tranh chấp)
  | 'planning_conflict'     // Thay đổi quy hoạch so với cam kết
  | 'buyer_breach'          // Người mua không thanh toán đúng hạn
  | 'seller_breach'         // Chủ nhà đổi ý không bán / không bàn giao
  | 'force_majeure'         // Sự kiện bất khả kháng
  | 'other';

/**
 * 1. Bằng chứng dẫn khách xem nhà (Proof of Viewing)
 * Chống "cắt cầu" / luồn cò và bảo vệ quyền hưởng hoa hồng của CTV Môi giới
 */
export interface ProofOfViewing {
  id: string;
  listing_id: string;
  broker_id: string;
  buyer_id?: string | null;
  customer_name: string;
  customer_phone: string;
  checkin_location?: {
    lat: number;
    lng: number;
  } | null;
  checkin_address?: string | null;
  proof_photos: string[];
  notes?: string | null;
  is_verified_by_seller: boolean;
  seller_verified_at?: string | null;
  created_at: string;
  // Relational references
  listing?: Listing;
  broker?: Profile;
}

/**
 * 2. Ghi nhận và Khóa Lead khách hàng cho CTV (Lead Attribution) & Cơ chế Ba Mã
 * Mã 1: Member ID (CTV) | Mã 2: Property ID (BĐS) | Mã 3: Transaction ID (Giao dịch)
 */
export interface CustomerLeadBinding {
  id: string;
  member_id: string;                      // Member ID của CTV (VD: HR-MBR-10023)
  broker_profile_id: string;              // UUID profile của CTV
  property_id: string;                    // Property ID của BĐS (VD: HR-PROP-0012)
  listing_id: string;                     // UUID listing của BĐS
  transaction_code?: string | null;       // Transaction ID khi tạo deal (VD: HR-TXN-2026-0045)
  customer_phone: string;
  customer_name: string;
  source_channel?: string;                // Kênh tìm kiếm: Facebook, Zalo, Giới thiệu trực tiếp
  is_owner_confirmed: boolean;            // Xác nhận của chủ nhà là căn cứ đối soát tối cao
  owner_confirmed_at?: string | null;
  status: 'active' | 'expired' | 'deal_created';
  expires_at: string;                     // Thời hạn bảo lưu khách (30 - 60 ngày)
  created_at: string;
  updated_at: string;
}

/**
 * 3. Hồ sơ Giao dịch Trung gian (Deal)
 */
export interface Deal {
  id: string;
  code: string;                           // Transaction ID: HR-TXN-2026-XXXXX
  listing_id: string;
  property_code?: string;                 // Property ID tham chiếu
  seller_id: string;
  buyer_id: string;
  
  // Phân bổ nhân sự thực hiện
  broker_id?: string | null;              // CTV phụ trách chính
  lead_generator_id?: string | null;      // Cấp 1: Người tạo nguồn khách (Member ID nguồn)
  closer_id?: string | null;              // Cấp 1: Người trực tiếp chốt giao dịch
  team_leader_id?: string | null;         // Cấp 2: Trưởng phòng kinh doanh quản lý
  
  agreed_price: number;                   // Giá chốt mua bán (VNĐ)
  deposit_amount: number;                 // Số tiền cọc quy định (VNĐ)
  commission_total: number;               // Tổng hoa hồng thỏa thuận (VNĐ)
  platform_fee: number;                   // Phí dịch vụ điều phối sàn Hanoi Realty (VNĐ)
  broker_commission: number;              // Hoa hồng thực nhận của CTV (VNĐ)
  
  status: DealStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  
  // Relational details
  listing?: Listing;
  seller?: Profile;
  buyer?: Profile;
  broker?: Profile | null;
  lead_generator?: Profile | null;
  closer?: Profile | null;
  team_leader?: Profile | null;
  escrow_account?: EscrowAccount | null;
  milestones?: DealMilestone[];
  viewing_proof?: ProofOfViewing | null;
  commission_split?: DealCommission | null;
}

/**
 * 4. Bảng Phân Chia Hoa Hồng Đa Đóng Góp (Multi-party Commission Split)
 */
export interface DealCommission {
  id: string;
  deal_id: string;
  
  // 1. Người tạo nguồn khách
  lead_generator_id?: string | null;
  lead_generator_commission: number;
  
  // 2. Người trực tiếp chốt giao dịch
  closer_id?: string | null;
  closer_commission: number;
  
  // 3. Trưởng phòng kinh doanh
  team_leader_id?: string | null;
  team_leader_commission: number;
  
  // 4. Phí dịch vụ sàn Hanoi Realty
  platform_fee: number;
  
  total_commission: number;
  is_settled: boolean;
  settled_at?: string | null;
  created_at: string;
}

/**
 * 4. Tài khoản Phong tỏa / Ký quỹ Ngân hàng (Escrow Account)
 */
export interface EscrowAccount {
  id: string;
  deal_id: string;
  bank_name: string;                      // VD: 'Vietcombank', 'BIDV', 'Techcombank'
  virtual_account_no: string;             // Số tài khoản định danh phong tỏa riêng cho Deal
  account_holder_name: string;            // Tên tài khoản định danh
  total_locked_amount: number;            // Tổng tiền đang khóa tại ngân hàng
  status: EscrowStatus;
  bank_reference_id?: string | null;      // Mã tham chiếu từ Core Banking
  locked_at?: string | null;
  released_at?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 5. Các Mốc Giải Ngân Có Điều Kiện (Deal Milestones)
 * Đảm bảo nguyên tắc: Chỉ giải ngân khi có đồng thuận đa bên (Multi-party Approval)
 */
export interface DealMilestone {
  id: string;
  deal_id: string;
  milestone: MilestoneCode;
  title: string;
  description?: string | null;
  percentage: number;                     // Tỷ lệ % giải ngân của mốc (VD: 10%, 80%, 10%)
  amount: number;                         // Số tiền tương ứng (VNĐ)
  
  buyer_approved: boolean;                // Người mua đồng thuận
  buyer_approved_at?: string | null;
  
  seller_approved: boolean;               // Chủ nhà đồng thuận
  seller_approved_at?: string | null;
  
  platform_verified: boolean;             // Hanoi Realty đã kiểm tra chứng từ hoàn tất mốc
  platform_verified_by?: string | null;
  platform_verified_at?: string | null;
  
  is_disbursed: boolean;                  // Ngân hàng đã thực hiện lệnh chi
  disbursed_at?: string | null;
  disbursement_proof_url?: string | null; // Chứng từ/Ủy nhiệm chi ngân hàng
  created_at: string;
}

/**
 * 6. Nhật ký đối soát bất biến (Deal Audit Log)
 */
export interface DealAuditLog {
  id: string;
  deal_id: string;
  actor_id: string;
  action: string;
  details?: Record<string, unknown>;
  ip_address?: string | null;
  created_at: string;
}

/**
 * DTO: Khởi tạo Deal / Phiếu chốt giá
 */
export interface CreateDealDTO {
  listing_id: string;
  buyer_id: string;
  broker_id?: string | null;
  lead_generator_id?: string | null;      // Cấp 1: Người tạo nguồn khách
  closer_id?: string | null;              // Cấp 1: Người trực tiếp chốt deal
  team_leader_id?: string | null;         // Cấp 2: Trưởng phòng kinh doanh
  agreed_price: number;
  deposit_amount: number;
  commission_rate_percent?: number;       // Mặc định VD: 1.5% - 2.0%
  notes?: string;
}

/**
 * DTO: Ghi nhận Bằng chứng xem nhà
 */
export interface CreateProofOfViewingDTO {
  listing_id: string;
  customer_name: string;
  customer_phone: string;
  lat?: number;
  lng?: number;
  checkin_address?: string;
  proof_photos: string[];
  notes?: string;
}

/**
 * DTO: Phê duyệt mốc giải ngân
 */
export interface ApproveMilestoneDTO {
  milestone_id: string;
  role: 'buyer' | 'seller' | 'admin';
  note?: string;
}
