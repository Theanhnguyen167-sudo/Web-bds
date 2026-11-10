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

export type PackageTierId = 'ctv_free' | 'ctv' | 'tpkd' | 'free' | 'basic' | 'pro' | 'agency';

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
  ctv_free: {
    id: 'ctv_free',
    name: 'CTV Free Tháng Đầu',
    badgeLabel: 'TRẢI NGHIỆM',
    subtitle: 'Miễn phí tháng đầu cho môi giới mới',
    monthlyPrice: 0,
    yearlyMonthlyPrice: 0,
    anchorMonthlyPrice: '',
    savingsTextMonthly: 'Trải nghiệm miễn phí tháng đầu',
    savingsTextYearly: 'Trải nghiệm miễn phí',
    limits: {
      maxListings: 5,
      listingDurationDays: 30,
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
      { label: 'Khai thác kho nguồn mở', badge: 'Chuẩn' },
    ],
    privilegesDisplay: [
      'Cấp Member ID CTV định danh riêng',
      'Đăng ký bảo lưu khách 72h chống trùng',
      'Xem kho nguồn BĐS đã xác minh',
      'Nhận 50% hoa hồng chốt deal',
    ],
  },

  ctv: {
    id: 'ctv',
    name: 'Gói CTV Tiêu Chuẩn',
    badgeLabel: 'MÔI GIỚI',
    subtitle: 'Dành cho môi giới thực chiến',
    monthlyPrice: 189000,
    yearlyMonthlyPrice: 151000,
    anchorMonthlyPrice: '249.000 đ',
    savingsTextMonthly: 'Tiết kiệm 60.000 đ/tháng',
    savingsTextYearly: 'Tiết kiệm 20% khi thanh toán năm',
    isPopular: true,
    limits: {
      maxListings: 15,
      listingDurationDays: 60,
      featuredListings: 2,
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
      supportLevel: 'Ticket & Email',
    },
    serviceLimitsDisplay: [
      { label: 'Tiếp cận kho nguồn mở', badge: 'Không giới hạn' },
    ],
    privilegesDisplay: [
      'Toàn quyền khai thác kho nhà mở KHÔNG GIỚI HẠN',
      'Tủ hàng cá nhân & tải Marketing Kit sạch',
      'CRM chuyên sâu bảo lưu khách 72h chống trùng',
      'Ví hoa hồng đối soát 5 trạng thái minh bạch',
    ],
  },

  tpkd: {
    id: 'tpkd',
    name: 'Gói TPKD Quản Trị',
    badgeLabel: 'TRƯỞNG PHÒNG',
    subtitle: 'Dành cho Trưởng phòng kinh doanh',
    monthlyPrice: 499000,
    yearlyMonthlyPrice: 399000,
    anchorMonthlyPrice: '699.000 đ',
    savingsTextMonthly: 'Tiết kiệm 200.000 đ/tháng',
    savingsTextYearly: 'Tiết kiệm 20% khi thanh toán năm',
    limits: {
      maxListings: 35,
      listingDurationDays: 90,
      featuredListings: 10,
      aiReports: 0,
    },
    features: {
      planningLevel: 'basic',
      canView2030Planning: false,
      canViewLandPrices: false,
      canExportPDF: false,
      pdfQuality: 'none',
      canManageAgencyTeam: true,
      hasDedicatedAccountManager: true,
      supportLevel: 'Dedicated VIP 24/7',
    },
    serviceLimitsDisplay: [
      { label: 'Quản trị đội nhóm CTV', badge: 'Không giới hạn' },
    ],
    privilegesDisplay: [
      'Toàn bộ đặc quyền của gói CTV Tiêu chuẩn',
      'Bảng điều khiển quản trị đội nhóm CTV trực thuộc',
      'Mời và điều phối thành viên CTV',
      'Nhận Thù lao Quản lý theo từng deal phát sinh',
      'Lưu ý: Quyền TPKD cần hồ sơ quản trị được duyệt',
    ],
  },

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
      'Bản đồ vị trí & tiện ích cơ bản',
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
      supportLevel: 'Ticket & Email',
    },
    serviceLimitsDisplay: [
      { label: 'Tin nổi bật / tháng', badge: 'x 2' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 30 ngày)', badge: 'x 20' },
    ],
    privilegesDisplay: [
      'Bản đồ vị trí & tiện ích xung quanh',
      'Huy hiệu Môi giới xác thực',
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
      aiReports: 0,
    },
    features: {
      planningLevel: 'detailed',
      canView2030Planning: false,
      canViewLandPrices: true,
      canExportPDF: false,
      pdfQuality: 'none',
      canManageAgencyTeam: false,
      hasDedicatedAccountManager: false,
      supportLevel: 'Ưu tiên 24/7',
    },
    serviceLimitsDisplay: [
      { label: 'Tin nổi bật / tháng', badge: 'x 10' },
      { label: 'Đăng tối đa tin BĐS (Thời hạn 60 ngày)', badge: 'x 50' },
    ],
    privilegesDisplay: [
      'Đẩy tin tự động lên trang chủ',
      'Huy hiệu VIP Pro nổi bật',
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
      aiReports: 0,
    },
    features: {
      planningLevel: 'detailed',
      canView2030Planning: false,
      canViewLandPrices: true,
      canExportPDF: false,
      pdfQuality: 'none',
      canManageAgencyTeam: true,
      hasDedicatedAccountManager: true,
      supportLevel: 'Dedicated VIP 24/7',
    },
    serviceLimitsDisplay: [
      { label: 'Tin nổi bật / tháng', badge: 'x 40' },
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
