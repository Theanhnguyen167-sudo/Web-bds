export type BuyerPurpose = 'living' | 'investment' | 'business' | 'other';
export type UrgencyLevel = 'immediate' | 'within_1_month' | 'within_3_months' | 'exploring';
export type BuyerRequestStatus = 'pending' | 'matched' | 'contacted' | 'completed' | 'cancelled';

/**
 * Hồ sơ Đăng ký Nhu cầu Mua BĐS (Dành cho Người mua)
 * Hoàn toàn miễn phí - Không áp dụng cơ chế gói tin
 */
export interface BuyerRequest {
  id: string;
  code: string;                           // Mã nhu cầu: HR-REQ-2026-XXXXX
  user_id?: string;
  
  // Bước 1: Nhu cầu & Loại BĐS
  purpose: BuyerPurpose;                  // Để ở, đầu tư, kinh doanh
  property_types: string[];               // ['house', 'apartment', 'land', 'villa']
  target_districts: string[];             // ['Cầu Giấy', 'Nam Từ Liêm', ...]
  
  // Bước 2: Khoảng tài chính & Tiêu chí chi tiết
  budget_min: number;                     // VNĐ
  budget_max: number;                     // VNĐ
  min_area?: number;                      // m2
  min_bedrooms?: number;                  // Phòng ngủ
  preferred_directions?: string[];        // Đông, Tây, Nam, Bắc,...
  car_access?: boolean;                   // Ngõ ô tô tránh
  
  // Bước 3: Hỗ trợ môi giới & Thời gian mua
  support_type?: 'connect_ctv' | 'self_search' | 'has_broker';
  referral_code?: string;                 // Mã giới thiệu CTV (nếu có)
  urgency?: UrgencyLevel;                 // Cần mua gấp, trong 1 tháng, 3 tháng
  needs_loan_support?: boolean;           // Cần tư vấn gói vay ngân hàng
  needs_planning_check?: boolean;         // Cần kiểm tra quy hoạch phân khu Hà Nội
  notes?: string;                         // Yêu cầu đặc thù khác
  
  // Bước 4: Thông tin liên hệ
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  preferred_contact_time?: string;        // 'Bất kỳ lúc nào', 'Giờ hành chính', 'Buổi tối'
  
  status: BuyerRequestStatus;
  created_at: string;
  updated_at: string;
}

/**
 * DTO Tạo Nhu cầu Mua BĐS mới
 */
export interface CreateBuyerRequestDTO {
  purpose: BuyerPurpose;
  property_types: string[];
  target_districts: string[];
  budget_min: number;
  budget_max: number;
  min_area?: number;
  min_bedrooms?: number;
  preferred_directions?: string[];
  car_access?: boolean;
  urgency?: UrgencyLevel;
  support_type?: 'connect_ctv' | 'self_search' | 'has_broker';
  referral_code?: string;
  needs_loan_support?: boolean;
  needs_planning_check?: boolean;
  notes?: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  preferred_contact_time?: string;
}

