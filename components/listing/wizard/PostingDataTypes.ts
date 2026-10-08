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
