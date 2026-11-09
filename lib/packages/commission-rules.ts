/**
 * 💰 HANOI REALTY - CƠ CHẾ BẢNG GIÁ THÀNH VIÊN & PHÂN CHIA HOA HỒNG DOANH THU
 * ==============================================================================
 * Phần II: Bảng giá đăng ký thành viên (CTV, TPKD Started, TPKD Professional)
 * Phần III: Cơ chế hoa hồng chủ nhà và phân bổ nội bộ (35% Sàn - 50% CTV - 15% TPKD)
 * ==============================================================================
 */

export type MemberPackageId = 'ctv' | 'tpkd_started' | 'tpkd_professional';

export interface MemberPackageBenefit {
  title: string;
  ctv: boolean | string;
  tpkdStarted: boolean | string;
  tpkdProfessional: boolean | string;
}

export interface MemberPackageDefinition {
  id: MemberPackageId;
  name: string;
  roleTitle: string;
  monthlyPrice: number;
  formattedPrice: string;
  subtitle: string;
  maxCtvMembers: number;        // 0 cho CTV, 5 cho Started, 15 cho Pro
  maxListings: number;          // Giới hạn bài đăng
  mediaKitLevel: 'Cơ bản' | 'Nâng cao';
  highlights: string[];
}

/**
 * 1. Đề xuất bảng giá thành viên
 */
export const MEMBER_PACKAGES: Record<MemberPackageId, MemberPackageDefinition> = {
  ctv: {
    id: 'ctv',
    name: 'Gói CTV',
    roleTitle: 'Cộng Tác Viên Kinh Doanh',
    monthlyPrice: 189000,
    formattedPrice: '189.000 đ/tháng',
    subtitle: 'Dành cho cá nhân môi giới độc lập',
    maxCtvMembers: 0,
    maxListings: 0, // Nhận kho nguồn hàng từ sàn & TPKD
    mediaKitLevel: 'Cơ bản',
    highlights: [
      'Tạo hồ sơ CTV & Cấp Member ID riêng',
      'Xem kho bất động sản được phép chia sẻ',
      'Gửi thông tin khách hàng (Khóa Lead Ba Mã)',
      'Theo dõi trạng thái khách hàng và giao dịch',
      'Nhận hoa hồng 50% khi giao dịch thành công',
    ],
  },
  tpkd_started: {
    id: 'tpkd_started',
    name: 'TPKD Started',
    roleTitle: 'Trưởng Phòng Kinh Doanh Khởi Đầu',
    monthlyPrice: 299000,
    formattedPrice: '299.000 đ/tháng',
    subtitle: 'Dành cho trưởng nhóm xây dựng đội sale',
    maxCtvMembers: 5,
    maxListings: 10,
    mediaKitLevel: 'Nâng cao',
    highlights: [
      'Quản lý tối đa 5 CTV trong nhóm',
      'Đăng tin BĐS (Hạn mức dưới 10 bài đăng)',
      'Quản lý khách hàng và nguồn hàng của nhóm',
      'Theo dõi hiệu suất đội nhóm & Báo cáo hoa hồng',
      'Nhận hoa hồng quản lý 15% trên từng deal của CTV',
    ],
  },
  tpkd_professional: {
    id: 'tpkd_professional',
    name: 'TPKD Professional',
    roleTitle: 'Trưởng Phòng Kinh Doanh Chuyên Nghiệp',
    monthlyPrice: 499000,
    formattedPrice: '499.000 đ/tháng',
    subtitle: 'Dành cho sàn nhánh hoặc đội ngũ quy mô',
    maxCtvMembers: 15,
    maxListings: 35,
    mediaKitLevel: 'Nâng cao',
    highlights: [
      'Quản lý tối đa 15 CTV trong nhóm',
      'Hạn mức đăng tin cao hơn (35 bài đăng)',
      'Quản lý và tự động phân phối khách hàng cho CTV',
      'Báo cáo KPI chi tiết từng CTV',
      'Dashboard doanh thu nhóm & phòng kinh doanh realtime',
      'Nhận hoa hồng quản lý 15% trên từng deal',
    ],
  },
};

/**
 * 2. Ma trận quyền lợi so sánh chi tiết
 */
export const PACKAGE_BENEFITS_MATRIX: {
  category: string;
  benefits: MemberPackageBenefit[];
}[] = [
  {
    category: 'I. QUYỀN LỢI CƠ BẢN & TÁC NGHIỆP CÁ NHÂN',
    benefits: [
      { title: 'Mã thành viên riêng (Member ID)', ctv: true, tpkdStarted: true, tpkdProfessional: true },
      { title: 'Xem nguồn hàng sạch đã xác minh', ctv: true, tpkdStarted: true, tpkdProfessional: true },
      { title: 'Đăng ký khách hàng (Khóa Lead 3 Mã)', ctv: true, tpkdStarted: true, tpkdProfessional: true },
      { title: 'Công cụ theo dõi tiến độ giao dịch', ctv: true, tpkdStarted: true, tpkdProfessional: true },
      { title: 'Tài liệu truyền thông & Marketing Kit', ctv: 'Cơ bản', tpkdStarted: 'Nâng cao', tpkdProfessional: 'Nâng cao' },
      { title: 'Báo cáo hiệu quả cá nhân', ctv: true, tpkdStarted: true, tpkdProfessional: true },
    ],
  },
  {
    category: 'II. QUYỀN LỢI QUẢN LÝ & ĐỘI NGŨ',
    benefits: [
      { title: 'Tạo mạng lưới CTV thành viên', ctv: false, tpkdStarted: 'Tối đa 5 CTV', tpkdProfessional: 'Tối đa 15 CTV' },
      { title: 'Quản lý nhóm CTV & Phân công chăm sóc', ctv: false, tpkdStarted: true, tpkdProfessional: true },
      { title: 'Dashboard doanh thu đội nhóm', ctv: false, tpkdStarted: true, tpkdProfessional: true },
      { title: 'Dashboard doanh thu phòng kinh doanh', ctv: false, tpkdStarted: true, tpkdProfessional: true },
    ],
  },
];

/**
 * III.1. Biểu tỷ lệ hoa hồng chủ nhà trả cho doanh nghiệp
 */
export interface SellerCommissionTier {
  minPrice: number;
  maxPrice: number | null;
  rateLabel: string;
  defaultRate: number;      // Tỷ lệ mặc định gợi ý (%)
  isNegotiable: boolean;
  notes: string;
}

export const SELLER_COMMISSION_TIERS: SellerCommissionTier[] = [
  {
    minPrice: 0,
    maxPrice: 5_000_000_000,
    rateLabel: '2,0%',
    defaultRate: 2.0,
    isNegotiable: false,
    notes: 'Cố định',
  },
  {
    minPrice: 5_000_000_000,
    maxPrice: 15_000_000_000,
    rateLabel: '1,5% – 2,0%',
    defaultRate: 1.8,
    isNegotiable: true,
    notes: 'Thương lượng',
  },
  {
    minPrice: 15_000_000_000,
    maxPrice: 50_000_000_000,
    rateLabel: '1,0% – 1,5%',
    defaultRate: 1.2,
    isNegotiable: true,
    notes: 'Thương lượng',
  },
  {
    minPrice: 50_000_000_000,
    maxPrice: null,
    rateLabel: 'Thỏa thuận riêng',
    defaultRate: 1.0,
    isNegotiable: true,
    notes: 'Theo từng BĐS giá trị cao',
  },
];

/**
 * Gợi ý tỷ lệ hoa hồng cho chủ nhà dựa trên giá trị BĐS
 */
export function getSuggestedCommissionTier(price: number): SellerCommissionTier {
  for (const tier of SELLER_COMMISSION_TIERS) {
    if (tier.maxPrice === null) {
      if (price >= tier.minPrice) return tier;
    } else if (price >= tier.minPrice && price < tier.maxPrice) {
      return tier;
    }
  }
  return SELLER_COMMISSION_TIERS[0];
}

/**
 * III.2. Tỷ lệ phân chia hoa hồng nội bộ chuẩn 100%
 * Web BĐS: 35% | CTV Sale: 50% | TPKD: 15%
 */
export const INTERNAL_COMMISSION_RATES = {
  PLATFORM_SHARE: 0.35,  // 35% cho Hanoi Realty Platform
  CTV_SHARE: 0.50,       // 50% cho CTV trực tiếp tạo nguồn & chốt deal
  TPKD_SHARE: 0.15,      // 15% cho Trưởng phòng kinh doanh quản lý
} as const;

export interface CommissionCalculationResult {
  agreedPrice: number;
  commissionRatePercent: number;
  totalCommission: number;
  platformFee: number;         // 35%
  ctvCommission: number;       // 50%
  tpkdCommission: number;      // 15%
}

/**
 * Hàm tính toán phân chia hoa hồng chuẩn hóa theo công thức 35 - 50 - 15
 */
export function calculateDealCommissionSplit(
  agreedPrice: number,
  customCommissionRate?: number
): CommissionCalculationResult {
  const tier = getSuggestedCommissionTier(agreedPrice);
  const rate = customCommissionRate !== undefined ? customCommissionRate : tier.defaultRate;
  
  const totalCommission = Math.round((agreedPrice * rate) / 100);
  const platformFee = Math.round(totalCommission * INTERNAL_COMMISSION_RATES.PLATFORM_SHARE);
  const ctvCommission = Math.round(totalCommission * INTERNAL_COMMISSION_RATES.CTV_SHARE);
  const tpkdCommission = totalCommission - platformFee - ctvCommission; // Bảo toàn chính xác 100% tổng tiền

  return {
    agreedPrice,
    commissionRatePercent: rate,
    totalCommission,
    platformFee,
    ctvCommission,
    tpkdCommission,
  };
}

