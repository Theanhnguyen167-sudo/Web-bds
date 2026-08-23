import { NextRequest, NextResponse } from 'next/server';
import { verifyVNPayReturn } from '@/lib/payment/vnpay';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());

  const result = verifyVNPayReturn(params as any);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (result.isValid && result.isSuccess) {
    const rawAmount = Number(params.vnp_Amount || '0') / 100;
    return NextResponse.redirect(
      `${siteUrl}/payment/success?orderId=${params.vnp_TxnRef}&method=vnpay&amount=${rawAmount}&bankCode=${params.vnp_BankCode || ''}&payDate=${params.vnp_PayDate || ''}`
    );
  } else {
    return NextResponse.redirect(
      `${siteUrl}/payment/error?reason=${encodeURIComponent(result.message)}&method=vnpay&orderId=${params.vnp_TxnRef || ''}`
    );
  }
}
