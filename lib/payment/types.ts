export interface PaymentOrder {
  orderId: string;          // unique: `HNREALTY_${userId}_${Date.now()}`
  userId: string;
  packageId: string;
  packageName: string;
  amount: number;           // VNĐ (integers only, no decimals)
  description: string;      // "HaNoi Realty - Gói Pro 1 tháng"
  userEmail: string;
  userPhone: string;
  createdAt: string;
}

export interface MoMoPaymentRequest {
  partnerCode: string;
  requestId: string;
  amount: number;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  requestType: 'payWithMethod';
  extraData: string;
  lang: 'vi';
  signature: string;
}

export interface MoMoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;          // Redirect to this URL
  deeplink: string;        // Mobile deep link
  qrCodeUrl: string;       // QR code image URL
}

export interface VNPayReturnParams {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;  // "00" = success
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

export type PaymentMethod = 'momo' | 'vnpay' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';
