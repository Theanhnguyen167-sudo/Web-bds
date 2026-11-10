/**
 * HaNoi Realty - Hệ thống phân hệ Tiền & Thanh toán (Finances & Payments)
 * Chuẩn mực 4 mã định danh: BDS-XXXXX, MG-XXXXX, CN-XXXXX, HD-XXXXX
 */

export type TransactionStatus =
  | 'pending_payment'       // Chờ thanh toán
  | 'pending_confirmation'  // Đã nộp chứng từ, chờ xác nhận
  | 'bank_escrowed'         // Ngân hàng xác nhận phong tỏa an toàn
  | 'approved'              // Đã duyệt chi / đối soát thành công
  | 'completed'             // Đã nhận / giải ngân hoàn tất
  | 'rejected'              // Bị từ chối
  | 'refunded';             // Đã hoàn trả

export type TransactionCategory =
  | 'deal_escrow'           // Tiền cọc / giao dịch phong tỏa hợp đồng
  | 'deal_installment'      // Đợt thanh toán mua bán nhà
  | 'broker_commission'     // Hoa hồng môi giới / CTV / TPKD
  | 'package_fee'           // Phí mua / gia hạn gói cước hội viên
  | 'brokerage_fee';        // Phí dịch vụ môi giới sàn thu từ chủ nhà

export interface BankAccountItem {
  id: string;
  bankName: string;
  bankCode: string; // VD: VCB, BIDV, TCB, MB, CTG
  accountHolder: string; // Tên chủ tài khoản (in hoa không dấu)
  accountNumberMasked: string; // VD: 9704 **** 1234
  accountNumberFull?: string; // Số đầy đủ khi thao tác xác nhận
  branch?: string;
  isDefault: boolean;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface PaymentInstallment {
  installmentNumber: number;
  title: string;
  dueDate: string;
  grossAmount: number;
  deductionFee: number;
  netAmount: number;
  conditions: string;
  status: TransactionStatus;
  escrowBank?: string;
  proofUrl?: string;
  paidAt?: string;
}

export interface FinancialTransaction {
  id: string;
  transactionCode: string; // VD: TXN-20261110-001
  contractCode?: string;   // HD-00035
  listingCode?: string;    // BDS-00125
  listingTitle?: string;
  category: TransactionCategory;
  
  // Các bên liên quan (dùng mã định danh có sẵn)
  payerCode?: string;      // CN-00086 hoặc MG-00102 hoặc mã Người mua
  payerName: string;
  receiverCode?: string;   // CN-00086 hoặc MG-00102 hoặc HaNoi Realty Escrow
  receiverName: string;
  
  grossAmount: number;     // Số tiền gộp
  deductionFee: number;    // Khoản phí / khấu trừ thuế TNCN
  netAmount: number;       // Thực nhận / thực trả
  
  status: TransactionStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  
  // Thông tin ngân hàng & phong tỏa
  escrowBankName?: string; // Ngân hàng trung gian phong tỏa bảo chứng
  beneficiaryBank?: string;
  beneficiaryAccount?: string;
  beneficiaryName?: string;
  transferSyntax?: string; // Cú pháp chuyển khoản
  releaseConditions?: string; // Điều kiện giải ngân
  
  // Chứng từ chuyển khoản
  proofImageUrl?: string;
  proofUploadedAt?: string;
  adminNote?: string;
  disputeReason?: string;
}

export interface RoleFinancialSummary {
  // Chủ nhà
  ownerReceived?: number;
  ownerPending?: number;
  ownerEscrowed?: number;
  ownerBrokerFeePayable?: number;
  
  // CTV / Môi giới
  brokerExpected?: number;
  brokerReconciling?: number;
  brokerApprovedPending?: number;
  brokerReceived?: number;
  
  // TPKD - Đội nhóm
  teamTotalSales?: number;
  teamTotalCommission?: number;
  
  // Người mua
  buyerPayable?: number;
  buyerPaid?: number;
  buyerEscrowed?: number; // Lưu ý: Là một phần của buyerPaid
  buyerPendingRefund?: number;
  
  // Admin
  adminEscrowHolding?: number; // Tiền giao dịch BĐS phong tỏa (không tính vào doanh thu)
  adminPlatformRevenue?: number; // Doanh thu gói + phí môi giới sàn
  adminCommissionPayable?: number; // Hoa hồng CTV chờ chi
}

