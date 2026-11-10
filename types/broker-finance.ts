/**
 * HaNoi Realty - Types cho phân hệ Thu nhập & Ví hoa hồng 5 trạng thái
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

import { IncomeStatus } from './broker-nav';

export interface BankBeneficiary {
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  accountHolder: string;
  isVerified: boolean;
}

export interface SettlementTimelineStep {
  status: IncomeStatus;
  title: string;
  isCompleted: boolean;
  timestamp?: string;
  note?: string;
}

export interface CommissionRecord {
  id: string;
  dealCode: string; // VD: "DEAL-HN-2026-089"
  propertyCode: string; // VD: "HR-BDS-1024"
  listingTitle: string;
  transactionValue: number; // Giá trị giao dịch chốt (VND)
  totalCommissionRate: number; // % hoa hồng toàn sàn (VD: 2.0%)
  totalCommissionAmount: number; // Tổng tiền phí môi giới (VND)
  brokerShareRate: number; // % chia cho CTV (VD: 75%)
  brokerShareAmount: number; // Tiền hoa hồng CTV trước thuế
  agreementVersion: string; // Phiên bản thỏa thuận chốt (VD: "v2.4")
  status: IncomeStatus;
  
  // Khấu trừ & Thực chuyển
  taxWithholding?: number; // Thuế TNCN khấu trừ nếu có (VND)
  otherDeductions?: number;
  netPayoutAmount: number; // Số tiền thực nhận về tài khoản ngân hàng (VND)
  
  // Chứng từ thanh toán
  paymentReferenceCode?: string; // Mã UNC (VD: "UNC-VCB-20261101-089")
  paymentProofUrl?: string; // Link ảnh / PDF Ủy nhiệm chi
  paidAt?: string;
  
  // Tranh chấp & Giải trình (nếu có)
  disputeReason?: string;
  disputeEvidenceUrl?: string;
  
  timeline: SettlementTimelineStep[];
  createdAt: string;
}

