import { NextRequest, NextResponse } from 'next/server';
import { verifyMoMoCallback } from '@/lib/payment/momo';

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const isValid = verifyMoMoCallback(params);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const { orderId, resultCode, transId, amount } = params;
    const isSuccess = resultCode === 0 || resultCode === 9000;

    if (isSuccess) {
      console.log(`✅ MoMo payment IPN success: ${orderId}, txn: ${transId}, amount: ${amount}`);
    } else {
      console.log(`❌ MoMo payment IPN failed: ${orderId}, code: ${resultCode}`);
    }

    // Must return 204 or MoMo will retry
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
