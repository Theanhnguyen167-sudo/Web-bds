/**
 * 📦 HANOI REALTY - PACKAGE CONFIGURATION & PRIVILEGES ENGINE
 * ==============================================================================
 * Hệ thống cấu hình tập trung cho 4 gói thành viên:
 * 1. Free    - Trải nghiệm cá nhân (Miễn phí)
 * 2. Basic   - Môi giới độc lập (399.000 đ/tháng)
 * 3. Pro     - Nhà đầu tư & Môi giới VIP (799.000 đ/tháng) [Bán chạy nhất]
 * 4. Agency  - Sàn giao dịch BĐS (1.999.000 đ/tháng) [Doanh nghiệp]
 * ==============================================================================
 */

export type PackageTierId = 'free' | 'basic' | 'pro' | 'agency';

export interface PackagePrivilegeDef {
  title: string;
  included: boolean;
  note?: string;
}

export interface PackageDefinition {
  id: PackageTierId;
  name: string;
  badgeLabel: string;
  subtitle: string;
  monthlyPrice: number;
  yearlyMonthlyPrice: number;
  anchorMonthlyPrice: string;
  savingsTextMonthly: string;
  savingsTextYearly: string;
  isPopular?: boolean;
  isEnterprise?: boolean;
  
  // Hạn mức định lượng (30 ngày hoặc theo chu kỳ)
  limits: {
    maxListings: number;            // Đăng tối đa tin BĐS (3, 20, 50, 250)
    listingDurationDays: number;    // Thời hạn tin đăng (7, 30, 60, 90 ngày)
    featuredListings: number;       // Tin nổi bật / tháng (0, 2, 10, 40)
    aiReports: number;              // Báo cáo AI chuyên sâu & định giá (0, 5, 30, 150)
  };

  // Đặc quyền hệ thống & Công nghệ
  features: {
    planningLevel: 'basic' | 'detailed' | 'advanced_2030_price'; // Cơ bản | Chi tiết | 2030 & Giá đất
    canView2030Planning: boolean;   // Tra cứu bản đồ quy hoạch 2030
    canViewLandPrices: boolean;     // Tra cứu bảng giá đất & biến động thị trường
    canExportPDF: boolean;          // Xuất file báo cáo PDF
    pdfQuality: 'none' | 'standard' | 'professional_vip' | 'agency_branded';
    canManageAgencyTeam: boolean;   // Quản trị phân quyền đội ngũ môi giới
    hasDedicatedAccountManager: boolean; // Chuyên viên quản lý tài khoản riêng
    supportLevel: 'Cộng đồng trực tuyến' | 'Ticket & Email' | 'Ưu tiên 24/7' | 'Dedicated VIP 24/7';
  };

  // Danh sách hiển thị trên UI Bảng giá
  serviceLimitsDisplay: { label: string; badge: string }[];
  privilegesDisplay: string[];
}

export const PACKAGE_DEFINITIONS: Record<PackageTierId, PackageDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    badgeLabel: 'CÁ NHÂN',
    subtitle: 'Trải nghiệm cá nhân',
    monthlyPrice: 0,
    yearlyMonthlyPrice: 0,
    anchorMonthlyPrice: '',
    savingsTextMonthly: 'Trải nghiệm cá nhân • Không mất phí',
    savingsTextYearly: 'Trải nghiệm cá nhân • Không mất phí',
    limits: {
      maxListings: 3,
      listingDurationDays: 7,
      featuredListings: 0,
      aiReports: 0,
    },
    features: {
      planningLevel: 'basic',
      canView2030Planning: false,
      canViewLandPrices: false,
      canExportPDF: false,
      pdfQuality: 'none',
      canManageAgencyTeam: false,
      hasDedicatedAccountManager: false,
      supportLevel: 'Cộng đồng trực tuyến',
    },
    serviceLimitsDisplay: [
      { label: 'Đăng tối đa tin BĐS (Thời hạn 7 ngày)', badge: 'x 3' },
    ],
    privilegesDisplay: [
      'Xem bản đồ quy hoạch cơ bản',
      'Hỗ trợ cộng đồng trực tuyến',
    ],
  },

  basic: {
    id: 'basic',
    name: 'Basic',
    badgeLabel: 'MÔI GIỚI',
    subtitle: 'Môi giới độc lập',
    monthlyPrice: 399000,
    yearlyMonthlyPrice: 319000,
    anchorMonthlyPrice: '469.000 đ',
    savingsTextMonthly: 'Giảm 15% • Tiết kiệm 70.000 đ/tháng',
    savingsTextYearly: 'Giảm đến 32% • Tiết kiệm 150.000 đ/tháng',
    limits: {
      maxListings: 20,
      listingDurationDays: 30,
      featuredListings: 2,
      aiReports: 5,
    },
    features: {
      planningLevel: 'detailed',
      canView2030Planning: false,
      canViewLandPrices: false,
      canExportPDF: true,
      pdfQuality: 'standard',
      canManageAgencyTeam: false,
      hasDedicatedAccountManager: false,
      supportLevel: 'Ticket & Email',
    },
    serviceLimitsDisplay: [
      { label: 'Tin nổi bật / tháng', badge: 'x 2' },
      { label: 'Báo cáo AI chuyên sâu & định giá', badge: 'x 5' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 30 ngày)', badge: 'x 20' },
    ],
    privilegesDisplay: [
      'Tra cứu bản đồ quy hoạch chi tiết',
      'Xuất file báo cáo PDF',
      'Hỗ trợ qua Ticket & Email',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    badgeLabel: 'VIP',
    subtitle: 'Nhà đầu tư & Môi giới VIP',
    monthlyPrice: 799000,
    yearlyMonthlyPrice: 639000,
    anchorMonthlyPrice: '1.159.000 đ',
    savingsTextMonthly: 'Giảm 31% • Tiết kiệm 360.000 đ/tháng',
    savingsTextYearly: 'Giảm đến 45% • Tiết kiệm 520.000 đ/tháng',
    isPopular: true,
    limits: {
      maxListings: 50,
      listingDurationDays: 60,
      featuredListings: 10,
      aiReports: 30,
    },
    features: {
      planningLevel: 'advanced_2030_price',
      canView2030Planning: true,
      canViewLandPrices: true,
      canExportPDF: true,
      pdfQuality: 'professional_vip',
      canManageAgencyTeam: false,
      hasDedicatedAccountManager: false,
      supportLevel: 'Ưu tiên 24/7',
    },
    serviceLimitsDisplay: [
      { label: 'Tin nổi bật / tháng', badge: 'x 10' },
      { label: 'Báo cáo AI chuyên sâu & định giá', badge: 'x 30' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 60 ngày)', badge: 'x 50' },
    ],
    privilegesDisplay: [
      'Tra cứu bản đồ quy hoạch 2030 & giá đất',
      'Xuất file báo cáo PDF chuẩn chuyên nghiệp',
      'Hỗ trợ ưu tiên 24/7',
    ],
  },

  agency: {
    id: 'agency',
    name: 'Agency',
    badgeLabel: 'DOANH NGHIỆP',
    subtitle: 'Sàn giao dịch BĐS',
    monthlyPrice: 1999000,
    yearlyMonthlyPrice: 1599000,
    anchorMonthlyPrice: '3.199.000 đ',
    savingsTextMonthly: 'Giảm 38% • Tiết kiệm 1.200.000 đ/tháng',
    savingsTextYearly: 'Giảm đến 50% • Tiết kiệm 1.600.000 đ/tháng',
    isEnterprise: true,
    limits: {
      maxListings: 250,
      listingDurationDays: 90,
      featuredListings: 40,
      aiReports: 150,
    },
    features: {
      planningLevel: 'advanced_2030_price',
      canView2030Planning: true,
      canViewLandPrices: true,
      canExportPDF: true,
      pdfQuality: 'agency_branded',
      canManageAgencyTeam: true,
      hasDedicatedAccountManager: true,
      supportLevel: 'Dedicated VIP 24/7',
    },
    serviceLimitsDisplay: [
      { label: 'Tin nổi bật / tháng', badge: 'x 40' },
      { label: 'Báo cáo AI chuyên sâu & thẩm định giá', badge: 'x 150' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 90 ngày)', badge: 'x 250' },
    ],
    privilegesDisplay: [
      'Quản trị phân quyền đội ngũ môi giới',
      'Dedicated Account Manager',
      'Hỗ trợ ưu tiên 24/7',
    ],
  },
};

/**
 * Lấy cấu hình gói dựa theo ID (chuẩn hoá chữ thường)
 */
export function getPackageDefinition(packageId?: string | null): PackageDefinition {
  if (!packageId) return PACKAGE_DEFINITIONS.free;
  const key = packageId.toLowerCase().trim() as PackageTierId;
  return PACKAGE_DEFINITIONS[key] || PACKAGE_DEFINITIONS.free;
}

/**
 * Tính ngày hết hạn dựa theo chu kỳ
 */
export function calculatePackageExpiry(billing: 'monthly' | 'yearly' = 'monthly'): string {
  const now = new Date();
  if (billing === 'yearly') {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setDate(now.getDate() + 30);
  }
  return now.toISOString().split('T')[0];
}

/**
 * Thông tin người phụ trách VIP Dedicated Account Manager mặc định cho gói Agency
 */
export const DEFAULT_DEDICATED_MANAGER = {
  name: 'Đặng Mai Lan',
  title: 'Senior Account Manager (Phụ trách Khối Doanh nghiệp & Sàn BĐS)',
  phone: '0936 888 999',
  email: 'lan.dang@hanoirealty.vn',
  hotlineVip: '1900 8989 (Phím 1 - Line VIP Doanh Nghiệp)',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
};

/**
 * Đội ngũ môi giới mẫu cho tài khoản Agency
 */
export interface AgencyTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'leader' | 'agent' | 'assistant';
  assignedListings: number;
  maxListingsQuota: number;
  activeListings: number;
  avatar: string;
  joinedDate: string;
}

export const DEFAULT_AGENCY_TEAM: AgencyTeamMember[] = [
  {
    id: 'agent_1',
    name: 'Nguyễn Tiến Dũng',
    email: 'dung.nguyen@agency.vn',
    phone: '0912 111 222',
    role: 'leader',
    assignedListings: 42,
    maxListingsQuota: 80,
    activeListings: 35,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    joinedDate: '2025-01-15',
  },
  {
    id: 'agent_2',
    name: 'Vũ Thu Trang',
    email: 'trang.vu@agency.vn',
    phone: '0934 333 444',
    role: 'agent',
    assignedListings: 28,
    maxListingsQuota: 50,
    activeListings: 22,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    joinedDate: '2025-02-01',
  },
  {
    id: 'agent_3',
    name: 'Hoàng Quốc Bảo',
    email: 'bao.hoang@agency.vn',
    phone: '0977 555 666',
    role: 'agent',
    assignedListings: 19,
    maxListingsQuota: 40,
    activeListings: 15,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    joinedDate: '2025-03-10',
  },
];
