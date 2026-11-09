/**
 * HaNoi Realty - Dữ liệu mẫu Gói Dịch Vụ Môi Giới (Subscription Mock Data)
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

import {
  SubscriptionPlan,
  SubscriptionInvoice,
  BillingCycleOption,
  CurrentSubscriptionInfo
} from '@/types/broker-subscription';

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'CTV Free',
    price: 0,
    priceFormatted: 'Miễn phí',
    period: 'tháng đầu trải nghiệm',
    roleTarget: 'ctv',
    description: 'Dành cho môi giới mới tham gia trải nghiệm và làm quen nền tảng HaNoi Realty.',
    features: [
      'Khai thác kho nhà chung mở (giới hạn 10 căn/ngày)',
      'Quản lý tủ hàng cá nhân (tối đa 5 căn lưu trữ)',
      'CRM khách hàng cơ bản (tối đa 10 khách)',
      'Gắn mã giới thiệu cá nhân (#CTV...) trên tin đăng',
      'Tham gia các buổi đào tạo & hướng dẫn quy chế',
    ],
    limitations: [
      'Chưa hỗ trợ xuất bộ Marketing Kit chuyên sâu',
      'Chưa có tính năng so sánh Portfolio nâng cao',
      'Không hỗ trợ ưu tiên đối soát tài chính',
    ],
    ctaText: 'Gói trải nghiệm',
    badge: 'Khởi đầu',
  },
  {
    id: 'ctv_monthly',
    name: 'Gói CTV Tiêu Chuẩn',
    price: 189000,
    priceFormatted: '189.000 đ',
    period: '/tháng',
    roleTarget: 'ctv',
    popular: true,
    description: 'Gói công cụ thiết yếu dành cho Môi giới hoạt động thường xuyên và chuyên nghiệp.',
    features: [
      'Toàn quyền khai thác kho nhà chung mở KHÔNG GIỚI HẠN',
      'Quản lý tủ hàng cá nhân không giới hạn',
      'CRM chuyên sâu: Đăng ký bảo lưu khách & chống trùng 72h',
      'Bảo lưu 100% quyền hoa hồng theo thỏa thuận giao dịch',
      'Tải trọn bộ Marketing Kit sạch (ảnh HD, bài viết Zalo/FB kèm SĐT cá nhân)',
      'Thông báo đẩy lịch hẹn dẫn khách xem nhà thời gian thực',
      'Bảng kê đối soát ví hoa hồng 5 trạng thái minh bạch',
    ],
    ctaText: 'Đang sử dụng',
    badge: 'Được tin dùng nhất',
  },
  {
    id: 'tpkd_monthly',
    name: 'Gói TPKD Quản Trị',
    price: 499000,
    priceFormatted: '499.000 đ',
    period: '/tháng',
    roleTarget: 'tpkd',
    description: 'Dành cho Trưởng phòng kinh doanh quản lý đội nhóm CTV và điều phối giao dịch.',
    features: [
      'Bao gồm toàn bộ đặc quyền của gói CTV Tiêu chuẩn',
      'Bảng điều khiển "Quản trị đội nhóm" chuyên biệt (Tông tím Manager)',
      'Quản lý danh sách thành viên CTV trực thuộc và tiến độ chăm sóc',
      'Mời thành viên CTV vào đội nhóm (yêu cầu CTV xác nhận 2 chiều)',
      'Theo dõi lịch hẹn và các Deal khó của nhóm cần hỗ trợ tháo gỡ',
      'Nhận Thù lao Quản lý (Management Overrides) theo nhiệm vụ thực tế được xác nhận',
      'Ưu tiên kết nối trực tiếp với Ban Pháp lý và Kế toán sàn',
    ],
    limitations: [
      'Không có hoa hồng tuyển dụng (chuẩn mực minh bạch, chống mô hình đa cấp)',
    ],
    ctaText: 'Nâng cấp TPKD',
    badge: 'Quản trị nhóm',
  },
];

export const MOCK_BILLING_CYCLES: BillingCycleOption[] = [
  {
    cycle: '1_month',
    label: '1 Tháng',
    months: 1,
    discountPercent: 0,
    bonusText: 'Thanh toán hàng tháng linh hoạt',
  },
  {
    cycle: '3_months',
    label: '3 Tháng',
    months: 3,
    discountPercent: 5,
    bonusText: 'Tiết kiệm 5% chi phí',
  },
  {
    cycle: '6_months',
    label: '6 Tháng',
    months: 6,
    discountPercent: 10,
    bonusText: 'Tiết kiệm 10% chi phí',
  },
  {
    cycle: '12_months',
    label: '12 Tháng',
    months: 12,
    discountPercent: 15,
    bonusText: 'Tiết kiệm 15% + Tặng thêm 1 tháng (13 tháng)',
  },
];

export const MOCK_CURRENT_SUBSCRIPTION: CurrentSubscriptionInfo = {
  tier: 'ctv_monthly',
  tierName: 'Gói CTV Tiêu Chuẩn',
  priceFormatted: '189.000 đ/tháng',
  validFrom: '2026-03-01T00:00:00Z',
  expiresAt: '2026-06-01T23:59:59Z',
  daysRemaining: 52,
  isExpired: false,
  lastInvoiceCode: 'INV-2026-SUB034',
  autoRenew: false,
  role: 'ctv',
};

export const MOCK_SUBSCRIPTION_INVOICES: SubscriptionInvoice[] = [
  {
    id: 'sub-inv-001',
    invoiceCode: 'INV-2026-SUB034',
    planId: 'ctv_monthly',
    planName: 'Gói CTV Tiêu Chuẩn (3 tháng)',
    cycle: '3_months',
    cycleText: '3 Tháng (Giảm 5%)',
    amount: 538650,
    paymentMethod: 'vietqr',
    paymentMethodTitle: 'VietQR - Quét mã ngân hàng',
    paidAt: '2026-03-01T09:15:30Z',
    validFrom: '2026-03-01T00:00:00Z',
    validUntil: '2026-06-01T23:59:59Z',
    status: 'paid',
    receiptPdfUrl: '/receipts/inv-2026-sub034.pdf',
    transactionRef: 'FT260601998241',
  },
  {
    id: 'sub-inv-002',
    invoiceCode: 'INV-2026-SUB018',
    planId: 'ctv_monthly',
    planName: 'Gói CTV Tiêu Chuẩn (1 tháng)',
    cycle: '1_month',
    cycleText: '1 Tháng',
    amount: 189000,
    paymentMethod: 'vnpay',
    paymentMethodTitle: 'Cổng VNPAY-QR',
    paidAt: '2026-02-01T14:22:10Z',
    validFrom: '2026-02-01T00:00:00Z',
    validUntil: '2026-03-01T23:59:59Z',
    status: 'paid',
    receiptPdfUrl: '/receipts/inv-2026-sub018.pdf',
    transactionRef: 'VNPAY-20260201889',
  },
  {
    id: 'sub-inv-003',
    invoiceCode: 'INV-2026-SUB002',
    planId: 'free',
    planName: 'Gói CTV Free Trải Nghiệm',
    cycle: '1_month',
    cycleText: 'Tháng đầu miễn phí',
    amount: 0,
    paymentMethod: 'vietqr',
    paymentMethodTitle: 'Hệ thống tự động kích hoạt',
    paidAt: '2026-01-01T08:00:00Z',
    validFrom: '2026-01-01T00:00:00Z',
    validUntil: '2026-02-01T23:59:59Z',
    status: 'paid',
    receiptPdfUrl: '/receipts/inv-2026-sub002.pdf',
    transactionRef: 'SYS-FREE-WELCOME',
  },
];
