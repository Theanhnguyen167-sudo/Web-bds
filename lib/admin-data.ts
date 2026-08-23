export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  package: 'Free' | 'Basic' | 'Pro' | 'Agency';
  role: 'user' | 'agent' | 'admin';
  status: 'active' | 'locked' | 'pending';
  joinedDate: string;
  listingsCount: number;
  aiReportsUsed: number;
  totalSpent: number;
  avatar?: string;
  lastActive: string;
}

export interface AdminListing {
  id: string;
  title: string;
  price: number;
  area: number;
  type: 'house' | 'apartment' | 'land' | 'villa';
  district: string;
  address: string;
  authorName: string;
  authorPhone: string;
  authorAvatar?: string;
  status: 'pending' | 'active' | 'expired' | 'rejected' | 'sold';
  createdAt: string;
  expiresAt: string;
  images: string[];
  views: number;
  planningZone: string;
  isFeatured: boolean;
}

export interface AdminTransaction {
  id: string;
  userName: string;
  userEmail: string;
  package: string;
  amount: number;
  method: 'momo' | 'vnpay' | 'bank';
  txnRef: string;
  createdAt: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
}

export interface AdminPackage {
  id: string;
  name: string;
  priceMonth: number;
  priceYear: number;
  maxListings: number;
  durationDays: number;
  featuredPerMonth: number;
  aiReportsPerMonth: number;
  hasPdfExport: boolean;
  features: string[];
  isActive: boolean;
  isHighlighted: boolean;
  subscribersCount: number;
  monthlyRevenue: number;
  retentionRate: number;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@gmail.com',
    phone: '0988 123 456',
    package: 'Pro',
    role: 'agent',
    status: 'active',
    joinedDate: '2024-03-12',
    listingsCount: 14,
    aiReportsUsed: 38,
    totalSpent: 3594000,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    lastActive: '5 phút trước'
  },
  {
    id: 'u2',
    name: 'Trần Thị Thu Hà',
    email: 'thuha.land@yahoo.com',
    phone: '0912 345 678',
    package: 'Agency',
    role: 'agent',
    status: 'active',
    joinedDate: '2024-01-20',
    listingsCount: 42,
    aiReportsUsed: 120,
    totalSpent: 8990000,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    lastActive: '12 phút trước'
  },
  {
    id: 'u3',
    name: 'Lê Hoàng Nam',
    email: 'nam.lehoang@company.vn',
    phone: '0903 888 999',
    package: 'Basic',
    role: 'user',
    status: 'active',
    joinedDate: '2024-05-18',
    listingsCount: 3,
    aiReportsUsed: 8,
    totalSpent: 897000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    lastActive: '1 giờ trước'
  },
  {
    id: 'u4',
    name: 'Phạm Đức Thắng',
    email: 'thang.bds@gmail.com',
    phone: '0977 665 544',
    package: 'Free',
    role: 'user',
    status: 'pending',
    joinedDate: '2024-08-20',
    listingsCount: 1,
    aiReportsUsed: 2,
    totalSpent: 0,
    lastActive: 'Hôm qua'
  },
  {
    id: 'u5',
    name: 'Vũ Thị Mai Lan',
    email: 'mailan.invest@gmail.com',
    phone: '0936 112 233',
    package: 'Pro',
    role: 'user',
    status: 'locked',
    joinedDate: '2024-02-14',
    listingsCount: 0,
    aiReportsUsed: 15,
    totalSpent: 1198000,
    lastActive: '3 ngày trước'
  }
];

export const mockAdminListings: AdminListing[] = [
  {
    id: 'l1',
    title: 'Nhà phố Đống Đa 5 tầng, mặt tiền 6m, gần Văn Miếu',
    price: 8500000000,
    area: 100,
    type: 'house',
    district: 'Đống Đa',
    address: 'Phố Hào Nam, Đống Đa, Hà Nội',
    authorName: 'Nguyễn Văn Minh',
    authorPhone: '0988 123 456',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-08-18',
    expiresAt: '2025-09-18',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'],
    views: 432,
    planningZone: 'Đất ở đô thị',
    isFeatured: true
  },
  {
    id: 'l2',
    title: 'Biệt thự Đơn lập Tây Hồ view trực diện mặt nước, full nội thất gỗ óc chó',
    price: 36000000000,
    area: 250,
    type: 'villa',
    district: 'Tây Hồ',
    address: 'Phố Quảng Khánh, Tây Hồ, Hà Nội',
    authorName: 'Trần Thị Thu Hà',
    authorPhone: '0912 345 678',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2025-08-15',
    expiresAt: '2025-09-15',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80'],
    views: 1205,
    planningZone: 'Đất sinh thái du lịch',
    isFeatured: true
  },
  {
    id: 'l3',
    title: 'Căn hộ Duplex cao cấp 3PN The Matrix One Mễ Trì',
    price: 6800000000,
    area: 120,
    type: 'apartment',
    district: 'Nam Từ Liêm',
    address: 'Đường Lê Quang Đạo, Nam Từ Liêm, Hà Nội',
    authorName: 'Phạm Đức Thắng',
    authorPhone: '0977 665 544',
    status: 'pending',
    createdAt: '2025-08-23',
    expiresAt: '2025-09-23',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80'],
    views: 12,
    planningZone: 'Đất ở hỗn hợp',
    isFeatured: false
  },
  {
    id: 'l4',
    title: 'Đất phân lô kinh doanh Cầu Giấy, ngõ 8m ô tô tránh',
    price: 12500000000,
    area: 80,
    type: 'land',
    district: 'Cầu Giấy',
    address: 'Phố Duy Tân, Cầu Giấy, Hà Nội',
    authorName: 'Lê Hoàng Nam',
    authorPhone: '0903 888 999',
    status: 'pending',
    createdAt: '2025-08-23',
    expiresAt: '2025-09-23',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80'],
    views: 34,
    planningZone: 'Đất thương mại dịch vụ',
    isFeatured: false
  },
  {
    id: 'l5',
    title: 'Nhà phân lô Ba Đình 4 tầng gần Lotte Center',
    price: 9200000000,
    area: 65,
    type: 'house',
    district: 'Ba Đình',
    address: 'Phố Đội Cấn, Ba Đình, Hà Nội',
    authorName: 'Nguyễn Văn Minh',
    authorPhone: '0988 123 456',
    status: 'expired',
    createdAt: '2025-07-01',
    expiresAt: '2025-08-01',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80'],
    views: 290,
    planningZone: 'Đất ở đô thị',
    isFeatured: false
  }
];

export const mockAdminTransactions: AdminTransaction[] = [
  {
    id: 'TXN-90234',
    userName: 'Trần Thị Thu Hà',
    userEmail: 'thuha.land@yahoo.com',
    package: 'Agency (1 năm)',
    amount: 11990000,
    method: 'vnpay',
    txnRef: 'VNPAY-14920491',
    createdAt: '2025-08-23 10:45',
    status: 'success'
  },
  {
    id: 'TXN-90233',
    userName: 'Nguyễn Văn An',
    userEmail: 'an.nguyen@gmail.com',
    package: 'Pro (1 tháng)',
    amount: 599000,
    method: 'momo',
    txnRef: 'MOMO-88234190',
    createdAt: '2025-08-23 09:12',
    status: 'success'
  },
  {
    id: 'TXN-90232',
    userName: 'Lê Hoàng Nam',
    userEmail: 'nam.lehoang@company.vn',
    package: 'Basic (1 tháng)',
    amount: 299000,
    method: 'vnpay',
    txnRef: 'VNPAY-89102482',
    createdAt: '2025-08-22 16:30',
    status: 'success'
  },
  {
    id: 'TXN-90231',
    userName: 'Vũ Đức Thịnh',
    userEmail: 'thinh.vu@gmail.com',
    package: 'Pro (3 tháng)',
    amount: 1599000,
    method: 'vnpay',
    txnRef: 'VNPAY-89102470',
    createdAt: '2025-08-22 14:15',
    status: 'failed'
  },
  {
    id: 'TXN-90230',
    userName: 'Đỗ Thùy Linh',
    userEmail: 'linh.do@outlook.com',
    package: 'Basic (1 tháng)',
    amount: 299000,
    method: 'bank',
    txnRef: 'VCB-29184019',
    createdAt: '2025-08-22 11:00',
    status: 'pending'
  }
];

export const mockAdminPackages: AdminPackage[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonth: 0,
    priceYear: 0,
    maxListings: 3,
    durationDays: 7,
    featuredPerMonth: 0,
    aiReportsPerMonth: 0,
    hasPdfExport: false,
    features: ['Đăng 3 tin cơ bản', 'Thời hạn tin 7 ngày', 'Xem bản đồ quy hoạch', 'Hỗ trợ cộng đồng'],
    isActive: true,
    isHighlighted: false,
    subscribersCount: 8430,
    monthlyRevenue: 0,
    retentionRate: 35
  },
  {
    id: 'basic',
    name: 'Basic',
    priceMonth: 299000,
    priceYear: 2990000,
    maxListings: 20,
    durationDays: 30,
    featuredPerMonth: 2,
    aiReportsPerMonth: 5,
    hasPdfExport: true,
    features: ['Đăng 20 tin BĐS', 'Thời hạn tin 30 ngày', '2 tin nổi bật/tháng', '5 Báo cáo AI định giá', 'Xuất file PDF'],
    isActive: true,
    isHighlighted: false,
    subscribersCount: 1120,
    monthlyRevenue: 334880000,
    retentionRate: 68
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonth: 599000,
    priceYear: 5990000,
    maxListings: 50,
    durationDays: 60,
    featuredPerMonth: 10,
    aiReportsPerMonth: 30,
    hasPdfExport: true,
    features: ['Đăng 50 tin BĐS', 'Thời hạn tin 60 ngày', '10 tin nổi bật/tháng', '30 Báo cáo AI chuyên sâu', 'Phân tích quy hoạch 2030', 'Hỗ trợ ưu tiên 24/7'],
    isActive: true,
    isHighlighted: true,
    subscribersCount: 560,
    monthlyRevenue: 335440000,
    retentionRate: 84
  },
  {
    id: 'agency',
    name: 'Agency',
    priceMonth: 1299000,
    priceYear: 12990000,
    maxListings: -1,
    durationDays: 90,
    featuredPerMonth: -1,
    aiReportsPerMonth: -1,
    hasPdfExport: true,
    features: ['Không giới hạn tin đăng', 'Thời hạn tin 90 ngày', 'Tin nổi bật không giới hạn', 'Không giới hạn Báo cáo AI', 'Quản trị đội ngũ môi giới', 'Dedicated Account Manager'],
    isActive: true,
    isHighlighted: false,
    subscribersCount: 137,
    monthlyRevenue: 177963000,
    retentionRate: 92
  }
];
