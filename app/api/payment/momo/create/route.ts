import { NextRequest, NextResponse } from 'next/server';
import { createMoMoPayment } from '@/lib/payment/momo';
import { PaymentOrder } from '@/lib/payment/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, packageId, packageName, amount, userEmail, userPhone } = body;

    if (!userId || !packageId || !amount) {
      return NextResponse.json(
        { error: 'Thiếu thông tin thanh toán bắt buộc' },
        { status: 400 }
      );
    }

    const orderId = `HNREALTY_${userId.slice(0, 8)}_${Date.now()}`;

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

    const result = await createMoMoPayment(order);

    if (result.success) {
      return NextResponse.json({
        success: true,
        orderId,
        payUrl: result.payUrl,
        qrCodeUrl: result.qrCodeUrl,
        deeplink: result.deeplink,
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('MoMo create payment API error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi kết nối cổng MoMo' },
      { status: 500 }
    );
  }
}
