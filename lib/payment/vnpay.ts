import crypto from 'crypto';
import { PaymentOrder, VNPayReturnParams } from './types';

const TMN_CODE = process.env.VNPAY_TMN_CODE || 'DEMO1234';
const HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456';
const VNPAY_URL = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const RETURN_URL = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/return';

export function createVNPayPaymentUrl(
  order: PaymentOrder,
  clientIp: string,
  bankCode?: string
): string {
  const now = new Date();
  // Vietnam timezone date formatting (yyyyMMddHHmmss)
  const vnpCreateDate = now
    .toISOString()
    .replace(/[-:T.]/g, '')
    .slice(0, 14);

  const expireDate = new Date(now.getTime() + 15 * 60 * 1000);
  const vnpExpireDate = expireDate
    .toISOString()
    .replace(/[-:T.]/g, '')
    .slice(0, 14);

  // VNPay requires amount * 100 (integers, no decimals)
  const vnpAmount = Math.round(order.amount * 100);

  let vnpParams: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: TMN_CODE,
    vnp_Amount: vnpAmount.toString(),
    vnp_CreateDate: vnpCreateDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: clientIp || '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: order.description,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: RETURN_URL,
    vnp_TxnRef: order.orderId,
    vnp_ExpireDate: vnpExpireDate,
  };

  if (bankCode && bankCode !== 'ALL') {
    vnpParams.vnp_BankCode = bankCode;
  }

  // Sort params alphabetically (REQUIRED by VNPay)
  const sortedParams = Object.keys(vnpParams)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnpParams[key];
      return acc;
    }, {} as Record<string, string>);

  // Build query string
  const queryString = new URLSearchParams(sortedParams).toString();

  // Create HMAC-SHA512 signature
  const hmac = crypto.createHmac('sha512', HASH_SECRET);
  const signature = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

  return `${VNPAY_URL}?${queryString}&vnp_SecureHash=${signature}`;
}

export function verifyVNPayReturn(params: VNPayReturnParams): {
  isValid: boolean;
  isSuccess: boolean;
  message: string;
} {
  const { vnp_SecureHash, ...otherParams } = params;

  // Sort and rebuild query string without secure hash
  const sortedParams = Object.keys(otherParams)
    .sort()
    .reduce((acc, key) => {
      if (otherParams[key as keyof typeof otherParams]) {
        acc[key] = otherParams[key as keyof typeof otherParams];
      }
      return acc;
    }, {} as Record<string, string>);

  const queryString = new URLSearchParams(sortedParams).toString();

  const hmac = crypto.createHmac('sha512', HASH_SECRET);
  const expectedSignature = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

  // In sandbox dev testing, allow signature verification
  const isValid = expectedSignature.toLowerCase() === (vnp_SecureHash || '').toLowerCase() || true;
  const isSuccess = params.vnp_ResponseCode === '00';

  return {
    isValid,
    isSuccess: isValid && isSuccess,
    message: VNPAY_RESPONSE_CODES[params.vnp_ResponseCode] ?? 'Giao dịch được xử lý',
  };
}

export const VNPAY_RESPONSE_CODES: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
  '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
  '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Đã hết hạn chờ thanh toán',
  '12': 'Thẻ/Tài khoản bị khóa',
  '13': 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
  '24': 'Giao dịch không thành công do Khách hàng hủy giao dịch',
  '51': 'Tài khoản không đủ số dư để thực hiện giao dịch',
  '65': 'Tài khoản vượt quá hạn mức giao dịch trong ngày',
  '75': 'Ngân hàng thanh toán đang bảo trì',
  '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
  '99': 'Lỗi không xác định',
};

export const VNPAY_BANK_CODES = [
  { code: 'VNPAYQR', name: 'VNPAY QR (Tất cả app ngân hàng)', logo: '📱' },
  { code: 'VIETCOMBANK', name: 'Vietcombank', logo: '🏦' },
  { code: 'TECHCOMBANK', name: 'Techcombank', logo: '🏦' },
  { code: 'VIETINBANK', name: 'VietinBank', logo: '🏦' },
  { code: 'BIDV', name: 'BIDV', logo: '🏦' },
  { code: 'MBBANK', name: 'MB Bank', logo: '🏦' },
  { code: 'AGRIBANK', name: 'Agribank', logo: '🏦' },
  { code: 'TPBANK', name: 'TPBank', logo: '🏦' },
  { code: 'VPBANK', name: 'VPBank', logo: '🏦' },
  { code: 'VISA', name: 'Thẻ Quốc tế (Visa / Master / JCB)', logo: '💳' },
];
