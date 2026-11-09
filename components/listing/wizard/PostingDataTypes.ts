export type SellerType =
  | 'Chính chủ'
  | 'Môi giới'
  | 'Nhân viên sàn giao dịch'
  | 'Chủ đầu tư'
  | 'Người được ủy quyền';

export interface SellerInfo {
  fullName: string;
  phone: string;
  email: string;
  sellerType: SellerType;
  companyName: string;
  contactAddress: string;
  showPhone: boolean;
  allowEmailContact: boolean;
  showCompany: boolean;
  isPhoneVerified: boolean;
}

export interface PostingLocation {
  district: string;
  ward: string;
  street: string;
  addressNumber: string;
  lat: number;
  lng: number;
  displayName?: string;
}

export interface PostingData {
  propertyType: 'house' | 'apartment' | 'land' | 'villa';
  location: PostingLocation;
  images: string[];
  price: number;
  area: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  direction: string;
  legalStatus: string;
  title: string;
  description: string;
  seller: SellerInfo;
  status: 'pending' | 'draft' | 'active' | 'rejected' | 'hidden' | 'expired' | 'sold';
  isFeatured?: boolean;

  // CÁC TRƯỜNG PHỤC VỤ LUỒNG 6 BƯỚC CỦA CHỦ NHÀ THEO THIẾT KẾ MỚI
  // Bước 3: Hình ảnh & lịch khảo sát
  imageMethod?: 'has_images' | 'need_survey';
  surveyDate?: string;         // YYYY-MM-DD
  surveyTimeSlot?: string;     // "Buổi sáng" | "Buổi chiều" | "Buổi tối"

  // Bước 4: Điều kiện giao dịch
  usageStatus?: 'empty' | 'occupied' | 'rented';

  // Bước 5: Xác minh chủ nhà & hồ sơ
  ownershipRole?: 'sole_owner' | 'co_owner' | 'authorized';
  certificateStatus?: string;  // 'Có giấy chứng nhận' | 'Đang chờ cấp giấy chứng nhận' | ...
  mortgageStatus?: string;     // 'Chưa rõ / cần kiểm tra' | 'Không có thế chấp' | 'Đang thế chấp ngân hàng'
  disputeStatus?: string;      // 'Không có tranh chấp (theo khai báo)' | 'Đang giải quyết tranh chấp'
  confidentialDocs?: string[]; // Mảng ảnh giấy tờ bảo mật (CCCD, Sổ đỏ, Giấy ủy quyền)
  ownerDeclarationChecked?: boolean;

  // Chủ nhà: Hồ sơ pháp lý (legacy)
  legalDocuments?: string;
  // Chủ nhà: Cam kết chính chủ
  isOwnerCommitted?: boolean;
  // Property ID do hệ thống cấp sau thẩm định
  propertyCode?: string;
  // Trạng thái xác minh
  verificationStatus?: 'in_review' | 'verified' | 'rejected';
}

export interface SellerValidationErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  sellerType?: string;
  companyName?: string;
}

/**
 * Kiểm tra định dạng số điện thoại Việt Nam hợp lệ:
 * - Bắt đầu bằng 0 hoặc +84 hoặc 84
 * - Tiếp theo là đầu số mạng VN: 3, 5, 7, 8, 9
 * - Tổng cộng 10 số (hoặc +84 theo sau 9 số)
 */
export function isValidVNPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\.\-\(\)]/g, '');
  return /^(0|\+84|84)(3|5|7|8|9)[0-9]{8}$/.test(cleaned);
}

/**
 * Kiểm tra định dạng email hợp lệ
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Kiểm tra xem loại người đăng có yêu cầu tên công ty / sàn giao dịch không
 */
export function isCompanyRequired(sellerType: SellerType): boolean {
  return ['Môi giới', 'Nhân viên sàn giao dịch', 'Chủ đầu tư'].includes(sellerType);
}
