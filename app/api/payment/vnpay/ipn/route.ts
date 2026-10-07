import { NextRequest, NextResponse } from 'next/server';
import { verifyVNPayReturn } from '@/lib/payment/vnpay';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * VNPay IPN (Instant Payment Notification) Webhook
 * Đây là Server-to-Server callback độc lập, nguồn chân lý duy nhất (Single Source of Truth)
 * Cần trả về format chuẩn của VNPay: { RspCode: string, Message: string }
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams.entries());

    // 1. Xác thực tính toàn vẹn chữ ký HMAC-SHA512
    const verifyResult = verifyVNPayReturn(params as any);
    if (!verifyResult.isValid) {
      console.error('[VNPay IPN] Invalid Checksum received:', params);
      return NextResponse.json({ RspCode: '97', Message: 'Invalid Checksum' });
    }

    const orderId = params.vnp_TxnRef;
    const vnpResponseCode = params.vnp_ResponseCode;
    const vnpTransactionNo = params.vnp_TransactionNo;
    const rawAmount = Number(params.vnp_Amount || '0') / 100;

    // 2. Tra cứu đơn hàng trong cơ sở dữ liệu
    const { data: order, error: orderError } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();

    if (orderError) {
      console.error('[VNPay IPN] Database lookup error:', orderError);
    }

    // 3. Kiểm tra Idempotency (Tránh cộng trùng nếu VNPay retry webhook nhiều lần)
    if (order && order.status === 'completed') {
      return NextResponse.json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    // 4. Kiểm tra số tiền khớp với đơn hàng gốc (nếu có lưu DB)
    if (order && Math.round(Number(order.amount)) !== Math.round(rawAmount)) {
      console.error('[VNPay IPN] Amount mismatch:', { orderAmount: order.amount, vnpAmount: rawAmount });
      return NextResponse.json({ RspCode: '04', Message: 'Invalid Amount' });
    }

    // 5. Cập nhật trạng thái thanh toán & kích hoạt gói dịch vụ
    const isPaymentSuccess = vnpResponseCode === '00';
    const newStatus = isPaymentSuccess ? 'completed' : 'failed';

    if (order) {
      await supabase
        .from('payment_orders')
        .update({
          status: newStatus,
          vnp_transaction_no: vnpTransactionNo,
          vnp_response_code: vnpResponseCode,
          paid_at: isPaymentSuccess ? new Date().toISOString() : null,
        })
        .eq('order_id', orderId);

      // Kích hoạt VIP cho người dùng nếu thành công & tự động gửi email hóa đơn
      if (isPaymentSuccess) {
        if (order.user_id) {
          await supabase
            .from('users')
            .update({
              membership_tier: order.package_id || 'vip1_diamond',
              membership_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('id', order.user_id);
        }

        // 4.2. Tự động gửi Email hóa đơn & thông báo
        const { sendInvoiceEmail } = await import('@/lib/payment/invoice-service');
        await sendInvoiceEmail({
          toEmail: order.user_email || 'khachhang@hanoirealty.vn',
          customerName: order.user_name || 'Quý khách',
          orderId: order.order_id || orderId,
          packageName: order.package_name || 'Gói VIP 1 (Kim Cương)',
          amount: rawAmount,
          paymentMethod: 'vnpay',
          transactionNo: vnpTransactionNo,
          paidAt: new Date().toISOString(),
        });
      }
    }

    // Phản hồi thành công cho cổng thanh toán VNPay
    return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' });
  } catch (error: any) {
    console.error('[VNPay IPN] Unexpected server error:', error);
    return NextResponse.json({ RspCode: '99', Message: 'Unknown Error' }, { status: 500 });
  }
}
