/**
 * HaNoi Realty - Types cho phân hệ Kho nhà mở & Tủ hàng cá nhân môi giới
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

export type PropertyPurpose = 'all' | 'sale' | 'rent';

export type PropertyTypeFilter = 'all' | 'house' | 'apartment' | 'villa' | 'land' | 'shophouse';

export type LegalStatusFilter = 'all' | 'so_do' | 'so_hong' | 'cho_so' | 'khac';

export type PriceRangeFilter = 'all' | 'under_3b' | '3b_6b' | '6b_10b' | '10b_20b' | 'above_20b';

export interface BrokerListingFilterState {
  keyword: string;
  purpose: PropertyPurpose;
  district: string;
  propertyType: PropertyTypeFilter;
  priceRange: PriceRangeFilter;
  legalStatus: LegalStatusFilter;
  onlyExclusive?: boolean;
}

export interface BrokerListing {
  id: string;
  propertyCode: string; // Mã định danh BĐS duy nhất: VD "HR-BDS-1088"
  title: string;
  slug?: string;
  price: number;
  area: number;
  pricePerM2: number;
  address: string;
  district: string;
  ward?: string;
  purpose: 'sale' | 'rent';
  propertyType: 'house' | 'apartment' | 'villa' | 'land' | 'shophouse';
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  direction?: string;
  frontageWidth?: number; // Mặt tiền (m)
  streetWidth?: number; // Độ rộng ngõ/đường (m)
  images: string[];
  
  // Thông tin thẩm định & pháp lý
  legalStatus: string; // VD: "Sổ đỏ chính chủ, sẵn sàng giao dịch"
  legalVerified: boolean;
  planningChecked: boolean;
  planningZone?: string; // VD: "Đất ở đô thị (QHPK H1-2)"
  
  // Thông tin nội bộ môi giới (Chỉ môi giới đủ điều kiện mới thấy)
  commissionRate: number; // Tỷ lệ hoa hồng ước tính (VD: 2.0%)
  estimatedCommissionAmount: number; // Số tiền ước tính (VND)
  contactCoordinator?: string; // Bộ phận điều phối nguồn hàng HaNoi Realty
  
  // Trạng thái đối với CTV hiện tại
  isCurated?: boolean; // Đã thêm vào Tủ hàng cá nhân
  privateNote?: string; // Ghi chú cá nhân riêng tư
  curatedAt?: string;
  publishedAt: string;
}

export interface CuratedNoteUpdate {
  listingId: string;
  note: string;
}

