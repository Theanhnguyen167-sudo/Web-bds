/**
 * HaNoi Realty - Types cho phân hệ Quản lý giao dịch (Deal Room) & Hợp đồng
 * Định vị: XÁC THỰC – RÕ RÀNG – MINH BẠCH – BẢO VỆ QUYỀN LỢI CÁC BÊN
 */

export type DealStage =
  | 'negotiation'          // 1. Thương lượng giá
  | 'deposit_agreement'    // 2. Thỏa thuận cọc
  | 'notarization'         // 3. Công chứng pháp lý
  | 'handover_settlement'; // 4. Bàn giao & Đối soát giải ngân

export interface BrokerDealMilestone {
  stage: DealStage;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  targetDate?: string;
  note?: string;
}

export type DealMilestone = BrokerDealMilestone;

export interface DealDocument {
  id: string;
  name: string;
  docType: 'deposit_contract' | 'notary_dossier' | 'title_deed' | 'handover_minute' | 'signed_scan';
  docTypeLabel: string;
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DealChatLog {
  id: string;
  senderName: string;
  senderRole: 'broker' | 'admin' | 'legal';
  senderRoleLabel: string;
  content: string;
  timestamp: string;
}

export interface DealItem {
  id: string;
  dealCode: string; // VD: "DEAL-HN-2026-089"
  propertyCode: string; // VD: "HR-BDS-1024"
  listingTitle: string;
  listingAddress: string;
  agreedPrice: number; // Giá trị giao dịch chốt (VND)
  stage: DealStage;
  stageLabel: string;
  expectedCompletionDate: string; // YYYY-MM-DD
  
  // Thông tin 3 bên
  buyerName: string;
  buyerMaskedPhone: string; // 0912.xxx.789
  sellerName: string;
  sellerPhone: string;
  adminCoordinator: string; // "Lê Hoàng Quân - Ban Pháp chế"
  
  // Bảng phân rã chi tiết phí & hoa hồng
  totalCommissionRate: number; // VD: 2.0%
  totalCommissionAmount: number; // Tổng phí môi giới
  brokerCommissionShare: number; // Khoản môi giới được nhận theo phiên bản thỏa thuận
  agreementVersion: string; // Phiên bản thỏa thuận chốt theo giao dịch (VD: "v2.4 - Ba Đình")
  escrowBankName?: string; // Định hướng ngân hàng trung gian (VD: "Vietcombank Escrow")
  
  milestones: DealMilestone[];
  documents: DealDocument[];
  chatLogs: DealChatLog[];
  createdAt: string;
}

export type AgreementStatus = 'read' | 'confirmed' | 'signed';

export interface AgreementDocument {
  id: string;
  code: string; // VD: "HR-AGR-2026-089"
  title: string;
  dealCode: string;
  propertyCode: string;
  status: AgreementStatus;
  statusLabel: string;
  commissionRateText: string;
  effectiveDate: string;
  signedAt?: string;
  pdfUrl: string;
  fileSize: string;
  signerName: string;
}
