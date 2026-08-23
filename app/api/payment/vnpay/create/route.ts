import { NextRequest, NextResponse } from 'next/server';
import { createVNPayPaymentUrl } from '@/lib/payment/vnpay';
import { PaymentOrder } from '@/lib/payment/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, packageId, packageName, amount, userEmail, userPhone, bankCode } = body;

    if (!userId || !packageId || !amount) {
      return NextResponse.json(
        { error: 'Thiếu thông tin thanh toán bắt buộc' },
        { status: 400 }
      );
    }

    const orderId = `VNPAY_${userId.slice(0, 8)}_${Date.now()}`;

    const order: PaymentOrder = {
      orderId,
      userId,
      packageId,
      packageName: packageName || 'Gói VIP',
      amount: Math.round(Number(amount)),
      description: `HaNoi Realty - ${packageName || 'Goi VIP'}`,
      userEmail: userEmail || 'user@example.com',
      userPhone: userPhone || '0988123456',
      createdAt: new Date().toISOString(),
    };

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const paymentUrl = createVNPayPaymentUrl(order, clientIp, bankCode);

    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl,
    });
  } catch (error: any) {
    console.error('VNPay create payment error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo liên kết thanh toán VNPay' },
      { status: 500 }
    );
  }
}
