import {
  FinancialTransaction,
  BankAccountItem,
  RoleFinancialSummary,
  PaymentInstallment,
} from '@/types/finance';

// ── 1. TÀI KHOẢN NGÂN HÀNG MẪU (THEO VAI TRÒ) ──
export const MOCK_USER_BANK_ACCOUNTS: Record<string, BankAccountItem[]> = {
  // Chủ nhà (CN-00086)
  owner: [
    {
      id: 'bank-cn-01',
      bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
      bankCode: 'VCB',
      accountHolder: 'PHAM QUOC DUNG',
      accountNumberMasked: '0011 **** 6789',
      accountNumberFull: '0011000866789',
      branch: 'Chi nhánh Hà Nội',
      isDefault: true,
      isVerified: true,
      verifiedAt: '2026-10-15',
    },
    {
      id: 'bank-cn-02',
      bankName: 'Ngân hàng TMCP Đầu tư và Phát triển (BIDV)',
      bankCode: 'BIDV',
      accountHolder: 'PHAM QUOC DUNG',
      accountNumberMasked: '2151 **** 9988',
      accountNumberFull: '2151000869988',
      branch: 'Chi nhánh Đống Đa',
      isDefault: false,
      isVerified: true,
      verifiedAt: '2026-10-20',
    },
  ],

  // CTV / Môi giới (MG-00102)
  agent: [
    {
      id: 'bank-mg-01',
      bankName: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)',
      bankCode: 'TCB',
      accountHolder: 'TRAN THI THU HA',
      accountNumberMasked: '1903 **** 5566',
      accountNumberFull: '1903001025566',
      branch: 'Chi nhánh Cầu Giấy',
      isDefault: true,
      isVerified: true,
      verifiedAt: '2026-09-01',
    },
  ],

  // Người mua
  buyer: [
    {
      id: 'bank-buyer-01',
      bankName: 'Ngân hàng TMCP Quân Đội (MBBank)',
      bankCode: 'MB',
      accountHolder: 'NGUYEN MINH TUAN',
      accountNumberMasked: '0888 **** 1234',
      accountNumberFull: '0888123456789',
      branch: 'Chi nhánh Ba Đình',
      isDefault: true,
      isVerified: true,
      verifiedAt: '2026-11-01',
    },
  ],

  // Admin / Tài khoản nhận bảo chứng sàn
  admin: [
    {
      id: 'bank-admin-01',
      bankName: 'Ngân hàng TMCP Ngoại thương (Vietcombank Escrow)',
      bankCode: 'VCB',
      accountHolder: 'HANOI REALTY ESCROW ACCOUNT',
      accountNumberMasked: '9999 **** 8888',
      accountNumberFull: '9999888800001',
      branch: 'Hội sở Thăng Long',
      isDefault: true,
      isVerified: true,
      verifiedAt: '2026-01-01',
    },
  ],
};

// ── 2. ĐỢT THANH TOÁN THEO HỢP ĐỒNG HD-00035 (BDS-00125) ──
export const MOCK_CONTRACT_INSTALLMENTS: PaymentInstallment[] = [
  {
    installmentNumber: 1,
    title: 'Đợt 1: Đặt cọc bảo chứng giao dịch',
    dueDate: '2026-11-08',
    grossAmount: 100_000_000,
    deductionFee: 0,
    netAmount: 100_000_000,
    conditions: 'Khóa căn nhà, ngân hàng trung gian Vietcombank phong tỏa bảo chứng trong thời gian thẩm định pháp lý sổ đỏ.',
    status: 'bank_escrowed',
    escrowBank: 'Vietcombank Escrow - CN Thăng Long',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    paidAt: '2026-11-08T10:30:00Z',
  },
  {
    installmentNumber: 2,
    title: 'Đợt 2: Ký hợp đồng công chứng chuyển nhượng',
    dueDate: '2026-11-20',
    grossAmount: 6_000_000_000,
    deductionFee: 136_000_000, // Phí môi giới sàn 2.0%
    netAmount: 5_864_000_000,
    conditions: 'Hai bên ký công chứng hợp đồng mua bán tại Văn phòng công chứng Đống Đa, người mua chuyển tiền vào tài khoản phong tỏa.',
    status: 'pending_payment',
    escrowBank: 'Vietcombank Escrow - CN Thăng Long',
  },
  {
    installmentNumber: 3,
    title: 'Đợt 3: Bàn giao sổ đỏ & Chìa khóa nhà',
    dueDate: '2026-12-05',
    grossAmount: 700_000_000,
    deductionFee: 0,
    netAmount: 700_000_000,
    conditions: 'Cập nhật biến động đăng bộ sang tên người mua thành công trên Giấy chứng nhận QSDĐ, giải ngân toàn bộ số dư cho chủ nhà.',
    status: 'pending_payment',
    escrowBank: 'Vietcombank Escrow - CN Thăng Long',
  },
];

// ── 3. DANH SÁCH GIAO DỊCH TÀI CHÍNH (TOÀN HỆ THỐNG) ──
export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  // 1. Tiền cọc phong tỏa hợp đồng HD-00035
  {
    id: 'tx-001',
    transactionCode: 'TXN-20261108-01',
    contractCode: 'HD-00035',
    listingCode: 'BDS-00125',
    listingTitle: 'Nhà phố Đống Đa 5 tầng 48m² kinh doanh',
    category: 'deal_escrow',
    payerCode: 'BUYER-0912',
    payerName: 'Nguyễn Minh Tuấn (Khách mua)',
    receiverCode: 'CN-00086',
    receiverName: 'Phạm Quốc Dũng (Chủ nhà)',
    grossAmount: 100_000_000,
    deductionFee: 0,
    netAmount: 100_000_000,
    status: 'bank_escrowed',
    statusLabel: 'Ngân hàng phong tỏa',
    createdAt: '2026-11-08T09:15:00Z',
    updatedAt: '2026-11-08T10:45:00Z',
    escrowBankName: 'Vietcombank Escrow - CN Thăng Long',
    beneficiaryBank: 'Vietcombank',
    beneficiaryAccount: '9999888800001',
    beneficiaryName: 'HANOI REALTY ESCROW ACCOUNT',
    transferSyntax: 'HNREALTY HD00035 BDS00125 COC',
    releaseConditions: 'Giải ngân cho Chủ nhà CN-00086 ngay sau khi ký xong Văn bản công chứng chuyển nhượng hợp pháp.',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    adminNote: 'Ngân hàng Vietcombank gửi điện xác nhận tiền nổi 100.000.000 đ vào tài khoản phong tỏa lúc 10:45 08/11/2026.',
  },

  // 2. Hoa hồng môi giới chờ đối soát của hợp đồng HD-00035
  {
    id: 'tx-002',
    transactionCode: 'TXN-20261108-02',
    contractCode: 'HD-00035',
    listingCode: 'BDS-00125',
    listingTitle: 'Nhà phố Đống Đa 5 tầng 48m² kinh doanh',
    category: 'broker_commission',
    payerCode: 'CN-00086',
    payerName: 'Phạm Quốc Dũng (Trích phí môi giới)',
    receiverCode: 'MG-00102',
    receiverName: 'Trần Thị Thu Hà (Môi giới chốt)',
    grossAmount: 102_000_000, // 75% của 136 triệu phí sàn
    deductionFee: 10_200_000, // 10% thuế TNCN khấu trừ tại nguồn
    netAmount: 91_800_000,
    status: 'approved',
    statusLabel: 'Đã duyệt chờ trả',
    createdAt: '2026-11-08T11:00:00Z',
    updatedAt: '2026-11-09T08:30:00Z',
    beneficiaryBank: 'Techcombank',
    beneficiaryAccount: '1903001025566',
    beneficiaryName: 'TRAN THI THU HA',
    transferSyntax: 'HNREALTY HH MG00102 HD00035',
    releaseConditions: 'Chi trả trong vòng 24h sau khi đợt 2 của hợp đồng hoàn tất công chứng.',
    adminNote: 'Kế toán trưởng duyệt bảng kê hoa hồng ngày 09/11/2026. Lệnh thanh toán sẽ thực hiện ngày 21/11/2026.',
  },

  // 3. Hoa hồng đã nhận trước đó của CTV (Tháng 10)
  {
    id: 'tx-003',
    transactionCode: 'TXN-20261025-01',
    contractCode: 'HD-00028',
    listingCode: 'BDS-00098',
    listingTitle: 'Chung cư 3PN Masteri West Heights',
    category: 'broker_commission',
    payerCode: 'CN-00072',
    payerName: 'Nguyễn Bích Ngọc',
    receiverCode: 'MG-00102',
    receiverName: 'Trần Thị Thu Hà',
    grossAmount: 45_000_000,
    deductionFee: 4_500_000,
    netAmount: 40_500_000,
    status: 'completed',
    statusLabel: 'Đã nhận',
    createdAt: '2026-10-25T14:20:00Z',
    updatedAt: '2026-10-27T16:00:00Z',
    beneficiaryBank: 'Techcombank',
    beneficiaryAccount: '1903001025566',
    beneficiaryName: 'TRAN THI THU HA',
    transferSyntax: 'HNREALTY HH MG00102 HD00028',
    proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    adminNote: 'Đã chuyển khoản qua Techcombank số GD: TCB-20261027-991.',
  },

  // 4. Phí mua gói Pro của Môi giới
  {
    id: 'tx-004',
    transactionCode: 'TXN-20261001-09',
    category: 'package_fee',
    payerCode: 'MG-00102',
    payerName: 'Trần Thị Thu Hà (Môi giới VIP)',
    receiverCode: 'HANOI-REALTY',
    receiverName: 'Công ty Cổ phần PropTech Hà Nội',
    grossAmount: 499_000,
    deductionFee: 0,
    netAmount: 499_000,
    status: 'completed',
    statusLabel: 'Đã thanh toán',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:05:00Z',
    beneficiaryBank: 'Vietcombank',
    beneficiaryAccount: '9999888800001',
    beneficiaryName: 'HANOI REALTY CORP',
    transferSyntax: 'GOI PRO MG00102 THANG 10',
    adminNote: 'Gia hạn gói Pro thời hạn 30 ngày thành công.',
  },

  // 5. Khoản chi phí gói cước trước đó
  {
    id: 'tx-005',
    transactionCode: 'TXN-20261101-12',
    category: 'package_fee',
    payerCode: 'MG-00102',
    payerName: 'Trần Thị Thu Hà (Môi giới VIP)',
    receiverCode: 'HANOI-REALTY',
    receiverName: 'Công ty Cổ phần PropTech Hà Nội',
    grossAmount: 499_000,
    deductionFee: 0,
    netAmount: 499_000,
    status: 'completed',
    statusLabel: 'Đã thanh toán',
    createdAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-01T08:05:00Z',
    beneficiaryBank: 'Vietcombank',
    beneficiaryAccount: '9999888800001',
    beneficiaryName: 'HANOI REALTY CORP',
    transferSyntax: 'GOI PRO MG00102 THANG 11',
    adminNote: 'Gia hạn gói Pro thời hạn 60 ngày thành công.',
  },
];

// ── 4. TỔNG HỢP THEO 4 VAI TRÒ (SINGLE SOURCE OF TRUTH) ──
export const MOCK_ROLE_FINANCIAL_SUMMARIES: Record<string, RoleFinancialSummary> = {
  // CHỦ NHÀ (CN-00086)
  owner: {
    ownerReceived: 0,
    ownerPending: 6_700_000_000,       // Đợt 2 (6 tỷ) + Đợt 3 (700 tr)
    ownerEscrowed: 100_000_000,        // Đợt 1 đang phong tỏa tại Vietcombank Escrow
    ownerBrokerFeePayable: 136_000_000,// 2% của tổng 6.8 tỷ (khấu trừ ở đợt 2)
  },

  // CTV / MÔI GIỚI (MG-00102)
  agent: {
    brokerExpected: 102_000_000,       // 75% hoa hồng từ căn BDS-00125
    brokerReconciling: 0,
    brokerApprovedPending: 91_800_000, // Đã duyệt khấu trừ thuế 10%, chờ ngân hàng chuyển
    brokerReceived: 40_500_000,        // Đã nhận tháng 10
    teamTotalSales: 24_500_000_000,    // Kết quả toàn đội nhóm (TPKD theo dõi, không cộng vào ví)
    teamTotalCommission: 367_500_000,  // Doanh số hoa hồng của 6 thành viên trong nhóm
  },

  // NGƯỜI MUA
  buyer: {
    buyerPayable: 6_700_000_000,       // Đợt 2 và Đợt 3
    buyerPaid: 100_000_000,            // Đã nộp tiền cọc đợt 1
    buyerEscrowed: 100_000_000,        // Lưu ý: Là một phần của 100 triệu đã nộp
    buyerPendingRefund: 0,
  },

  // ADMIN
  admin: {
    adminEscrowHolding: 100_000_000,   // Tiền cọc BĐS đang giữ hộ tại ngân hàng trung gian (không tính vào doanh thu)
    adminPlatformRevenue: 136_998_000, // 136 tr phí môi giới sàn + 998k phí gói cước
    adminCommissionPayable: 91_800_000,// Hoa hồng chờ chi trả cho CTV MG-00102
  },
};

