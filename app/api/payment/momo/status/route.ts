import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  // Simulate pending/success response for polling in dev/sandbox
  return NextResponse.json({
    orderId,
    status: 'pending',
    message: 'Đang chờ người dùng quét mã QR trên ứng dụng MoMo',
  });
}
