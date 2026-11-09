import { Profile } from './database';

export type ContractType = 
  | 'ctv_agreement'               // Hợp đồng Hợp tác CTV Môi giới
  | 'sales_director_agreement'   // Hợp đồng Quản lý Trưởng phòng kinh doanh
  | 'seller_service_agreement'   // Hợp đồng Dịch vụ Ký gửi & Môi giới BĐS với Chủ nhà
  | 'buyer_terms_agreement';     // Thỏa thuận Dịch vụ & Kết nối với Người mua

export type ContractStatus = 
  | 'draft'                      // Bản nháp điều khoản
  | 'pending_signature'          // Chờ thành viên/khách hàng xác nhận ký số
  | 'active'                     // Đang có hiệu lực pháp lý
  | 'expired'                    // Hết hạn hợp đồng
  | 'terminated';                // Chấm dứt hợp đồng trước hạn

/**
 * Hồ sơ Hợp đồng Điện tử Số hóa (E-Contract)
 */
export interface EContract {
  id: string;
  contract_code: string;         // Mã hợp đồng: HR-CTR-CTV-2026-XXXX, HR-CTR-OWNER-XXXX
  contract_type: ContractType;
  title: string;
  
  // Các bên tham gia
  platform_representative_id?: string | null; // Đại diện Hanoi Realty
  party_b_id: string;                         // Thành viên/Chủ nhà/Người mua ký kết
  party_b_member_id?: string | null;          // Member ID (nếu là CTV / TPKD)
  property_code?: string | null;              // Property ID (nếu là HĐ ký gửi Chủ nhà)
  
  // Nội dung và Điều khoản thỏa thuận
  terms_snapshot: ContractTermsSnapshot;
  
  // Dấu vết ký số & Pháp lý
  is_signed: boolean;
  signed_at?: string | null;
  signature_hash?: string | null;             // Mã băm SHA-256 xác thực chữ ký số / OTP
  signer_ip?: string | null;
  signer_user_agent?: string | null;
  
  valid_from: string;
  valid_until?: string | null;
  
  status: ContractStatus;
  notes?: string | null;
  pdf_url?: string | null;
  created_at: string;
  updated_at: string;
  
  // Relational references
  party_b?: Profile;
}

/**
 * Snapshot các nhóm điều khoản trong hợp đồng số
 */
export interface ContractTermsSnapshot {
  version: string;
  summary: string;
  clauses: {
    sectionTitle: string;
    content: string;
  }[];
  // Giá trị cam kết cụ thể
  commissionRatePercent?: number;       // % Hoa hồng (với Chủ nhà hoặc CTV)
  protectionDurationDays?: number;      // Số ngày bảo lưu khách hàng (VD: 60 ngày)
  monthlyFeeVnd?: number;               // Phí gói thành viên (189k, 299k, 499k)
  maxTeamMembers?: number;              // Giới hạn CTV (5 hoặc 15 với TPKD)
  exclusiveListing?: boolean;           // Ký gửi độc quyền hay không
}

/**
 * DTO: Ký hợp đồng điện tử trực tuyến
 */
export interface SignContractDTO {
  contract_id: string;
  signer_name: string;
  id_number: string;                    // CCCD/Hộ chiếu
  otp_code?: string;
  accept_terms: boolean;
}

