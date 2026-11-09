import { CommissionRecord, BankBeneficiary } from '@/types/broker-finance';

export const BROKER_DEFAULT_BENEFICIARY: BankBeneficiary = {
  bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
  bankBranch: 'Chi nhánh Thăng Long, Hà Nội',
  accountNumber: '0011008899889',
  accountHolder: 'NGUYEN THE ANH',
  isVerified: true,
};

export const BROKER_MOCK_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'comm_01',
    dealCode: 'DEAL-HN-2026-089',
    propertyCode: 'HR-BDS-1024',
    listingTitle: 'Nhà phố Đống Đa 5 tầng, gần Hồ Đắc Di, ô tô đỗ cửa',
    transactionValue: 8450000000,
    totalCommissionRate: 2.0,
    totalCommissionAmount: 169000000,
    brokerShareRate: 75,
    brokerShareAmount: 126750000,
    agreementVersion: 'Thỏa thuận giao dịch Ba Đình - Đống Đa v2.4',
    status: 'estimated', // 1. Dự kiến
    taxWithholding: 0,
    netPayoutAmount: 126750000,
    timeline: [
      {
        status: 'estimated',
        title: 'Khởi tạo khoản dự kiến sau khi ký cọc 3 bên',
        isCompleted: true,
        timestamp: '2026-11-08T10:30:00Z',
        note: 'Đã hoàn tất đặt cọc 300 triệu đồng. Khoản hoa hồng được khóa bảo vệ theo deal.',
      },
      {
        status: 'eligible',
        title: 'Đủ điều kiện thanh toán (Sau khi công chứng HĐMB)',
        isCompleted: false,
        note: 'Dự kiến hoàn thành ngày 18/11/2026 tại Văn phòng công chứng.',
      },
      {
        status: 'auditing',
        title: 'Chờ đối soát biên bản nghiệm thu & chứng từ thực thu',
        isCompleted: false,
      },
      {
        status: 'paid',
        title: 'Kế toán giải ngân chuyển khoản về tài khoản ngân hàng',
        isCompleted: false,
      },
    ],
    createdAt: '2026-11-08T10:30:00Z',
  },
  {
    id: 'comm_02',
    dealCode: 'DEAL-HN-2026-072',
    propertyCode: 'HR-BDS-3011',
    listingTitle: 'Nhà mặt phố Nguyễn Trãi kinh doanh sầm uất, 7 tầng thang máy',
    transactionValue: 24500000000,
    totalCommissionRate: 1.8,
    totalCommissionAmount: 441000000,
    brokerShareRate: 75,
    brokerShareAmount: 330750000,
    agreementVersion: 'Thỏa thuận BĐS Triệu Đô Thanh Xuân v2.1',
    status: 'eligible', // 2. Đủ điều kiện
    taxWithholding: 0,
    netPayoutAmount: 330750000,
    timeline: [
      {
        status: 'estimated',
        title: 'Đặt cọc giao dịch thành công',
        isCompleted: true,
        timestamp: '2026-11-05T10:00:00Z',
      },
      {
        status: 'eligible',
        title: 'Đã hoàn tất nghĩa vụ công chứng & pháp lý sạch',
        isCompleted: true,
        timestamp: '2026-11-09T16:00:00Z',
        note: 'Hồ sơ đã đủ điều kiện chuyển sang kỳ đối soát giải ngân của sàn.',
      },
      {
        status: 'auditing',
        title: 'Kế toán đối soát và kiểm tra thuế TNCN',
        isCompleted: false,
        note: 'Dự kiến đối soát ngày 12/11/2026.',
      },
      {
        status: 'paid',
        title: 'Thực hiện lệnh Ủy nhiệm chi (UNC) ngân hàng',
        isCompleted: false,
      },
    ],
    createdAt: '2026-11-05T10:00:00Z',
  },
  {
    id: 'comm_03',
    dealCode: 'DEAL-HN-2026-064',
    propertyCode: 'HR-BDS-4092',
    listingTitle: 'Nhà phân lô ngõ 106 Hoàng Quốc Việt, ô tô vào nhà',
    transactionValue: 11200000000,
    totalCommissionRate: 2.0,
    totalCommissionAmount: 224000000,
    brokerShareRate: 75,
    brokerShareAmount: 168000000,
    agreementVersion: 'Thỏa thuận giao dịch Cầu Giấy v1.9',
    status: 'auditing', // 3. Chờ đối soát
    taxWithholding: 16800000, // Tạm khấu trừ 10% theo quy định
    netPayoutAmount: 151200000,
    timeline: [
      {
        status: 'estimated',
        title: 'Ký cọc và hoàn thiện hồ sơ',
        isCompleted: true,
        timestamp: '2026-10-20T09:00:00Z',
      },
      {
        status: 'eligible',
        title: 'Công chứng và nộp thuế trước bạ',
        isCompleted: true,
        timestamp: '2026-10-28T14:00:00Z',
      },
      {
        status: 'auditing',
        title: 'Kế toán sàn đang kiểm duyệt biên bản tất toán',
        isCompleted: true,
        timestamp: '2026-11-08T11:00:00Z',
        note: 'Đang chuẩn bị lệnh chi chuyển khoản đợt chi trả thứ 6 tuần này.',
      },
      {
        status: 'paid',
        title: 'Ủy nhiệm chi ngân hàng Vietcombank',
        isCompleted: false,
        note: 'Dự kiến tiền vào tài khoản vào ngày 11/11/2026.',
      },
    ],
    createdAt: '2026-10-20T09:00:00Z',
  },
  {
    id: 'comm_04',
    dealCode: 'DEAL-HN-2026-041',
    propertyCode: 'HR-BDS-5110',
    listingTitle: 'Căn hộ chung cư 2PN Imperia Smart City, full nội thất xịn',
    transactionValue: 3400000000,
    totalCommissionRate: 2.5,
    totalCommissionAmount: 85000000,
    brokerShareRate: 75,
    brokerShareAmount: 63750000,
    agreementVersion: 'Thỏa thuận giao dịch Nam Từ Liêm v2.0',
    status: 'paid', // 4. Đã chi trả
    taxWithholding: 6375000, // Thuế TNCN 10%
    netPayoutAmount: 57375000,
    paymentReferenceCode: 'UNC-VCB-20261101-041',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    paidAt: '2026-11-01T17:30:00Z',
    timeline: [
      { status: 'estimated', title: 'Khởi tạo hồ sơ', isCompleted: true, timestamp: '2026-10-10T10:00:00Z' },
      { status: 'eligible', title: 'Công chứng HĐMB căn hộ', isCompleted: true, timestamp: '2026-10-25T11:00:00Z' },
      { status: 'auditing', title: 'Đối soát hồ sơ bàn giao', isCompleted: true, timestamp: '2026-10-31T09:00:00Z' },
      {
        status: 'paid',
        title: 'Đã giải ngân thành công qua Vietcombank',
        isCompleted: true,
        timestamp: '2026-11-01T17:30:00Z',
        note: 'Mã giao dịch: UNC-VCB-20261101-041. Số tiền 57.375.000 VNĐ.',
      },
    ],
    createdAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'comm_05',
    dealCode: 'DEAL-HN-2026-018',
    propertyCode: 'HR-BDS-2045',
    listingTitle: 'Biệt thự đơn lập KĐT Ngoại Giao Đoàn, lô góc 2 mặt tiền',
    transactionValue: 36000000000,
    totalCommissionRate: 2.0,
    totalCommissionAmount: 720000000,
    brokerShareRate: 75,
    brokerShareAmount: 540000000,
    agreementVersion: 'Thỏa thuận Biệt thự VIP Tây Hồ v2.2',
    status: 'disputed', // 5. Đang tranh chấp
    taxWithholding: 0,
    netPayoutAmount: 540000000,
    disputeReason: 'Khiếu nại về trùng lịch dẫn khách giữa 2 CTV. Ban Pháp chế đang yêu cầu nộp bổ sung định vị check-in và tin nhắn xác nhận của chủ nhà.',
    timeline: [
      { status: 'estimated', title: 'Đặt cọc biệt thự', isCompleted: true, timestamp: '2026-09-15T14:00:00Z' },
      {
        status: 'disputed',
        title: 'Phát sinh khiếu nại đối soát trùng khách',
        isCompleted: true,
        timestamp: '2026-10-02T10:00:00Z',
        note: 'Tạm dừng giải ngân để đối soát bằng chứng 5 yếu tố theo quy chế sàn.',
      },
    ],
    createdAt: '2026-09-15T14:00:00Z',
  },
];

