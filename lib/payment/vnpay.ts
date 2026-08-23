import crypto from 'crypto';

interface VNPayConfig {
  tmnCode: string;
  hashSecret: string;
  url: string;
  returnUrl: string;
}

const vnpConfig: VNPayConfig = {
  tmnCode: process.env.VNPAY_TMN_CODE || '',
  hashSecret: process.env.VNPAY_HASH_SECRET || '',
  url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/payment/vnpay/callback',
};

function stringifyParams(obj: Record<string, any>): string {
  const sortedKeys = Object.keys(obj).sort();
  return sortedKeys
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key]).replace(/%20/g, '+')}`)
    .join('&');
}

export function createVNPayPaymentUrl(params: {
  amount: number;
  orderInfo: string;
  txnRef: string;
  ipAddr: string;
  bankCode?: string;
}): string {
  const date = new Date();
  const createDate = date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

  let vnp_Params: Record<string, any> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpConfig.tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: params.txnRef,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: params.amount * 100, // VNPay requires multiplying by 100
    vnp_ReturnUrl: vnpConfig.returnUrl,
    vnp_IpAddr: params.ipAddr || '127.0.0.1',
    vnp_CreateDate: createDate,
  };

  if (params.bankCode) {
    vnp_Params['vnp_BankCode'] = params.bankCode;
  }

  const signData = stringifyParams(vnp_Params);
  const hmac = crypto.createHmac('sha512', vnpConfig.hashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  vnp_Params['vnp_SecureHash'] = signed;
  return `${vnpConfig.url}?${stringifyParams(vnp_Params)}`;
}

export function verifyVNPayCallback(vnp_Params: Record<string, any>): boolean {
  const secureHash = vnp_Params['vnp_SecureHash'];
  const paramsToVerify = { ...vnp_Params };
  delete paramsToVerify['vnp_SecureHash'];
  delete paramsToVerify['vnp_SecureHashType'];

  const signData = stringifyParams(paramsToVerify);
  const hmac = crypto.createHmac('sha512', vnpConfig.hashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === signed;
}
