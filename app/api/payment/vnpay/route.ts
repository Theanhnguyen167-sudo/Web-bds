import { NextRequest, NextResponse } from 'next/server';
import { createVNPayPaymentUrl } from '@/lib/payment/vnpay';
import { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, packageId, bankCode } = body;

    if (!amount || !packageId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: 'Thiếu số tiền hoặc gói dịch vụ' } },
        { status: 400 }
      );
    }

    const ipAddr = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const txnRef = `PROPTECH_${Date.now()}`;

    const paymentUrl = createVNPayPaymentUrl(
      {
        orderId: txnRef,
        userId: 'user_1',
        packageId,
        packageName: `Gói ${packageId}`,
        amount: Number(amount),
        description: `Thanh toan goi dich vu ${packageId} - Don hang ${txnRef}`,
        userEmail: 'user@example.com',
        userPhone: '0988123456',
        createdAt: new Date().toISOString(),
      },
      ipAddr,
      bankCode
    );

    return NextResponse.json<ApiResponse<{ paymentUrl: string; txnRef: string }>>({
      success: true,
      data: { paymentUrl, txnRef },
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: error.message || 'Lỗi tạo thanh toán VNPay' } },
      { status: 500 }
    );
  }
}
