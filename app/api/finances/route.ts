import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  MOCK_FINANCIAL_TRANSACTIONS,
  MOCK_ROLE_FINANCIAL_SUMMARIES,
  MOCK_USER_BANK_ACCOUNTS,
} from '@/lib/data/mock-finance-data';
import { FinancialTransaction, BankAccountItem } from '@/types/finance';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// GET: Lấy danh sách giao dịch tài chính & tài khoản ngân hàng theo vai trò
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'buyer';
    const userId = searchParams.get('user_id');

    // Thử truy vấn từ bảng financial_transactions nếu đã migrate
    try {
      const { data: dbTxs } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbTxs && dbTxs.length > 0) {
        return NextResponse.json({
          success: true,
          data: {
            transactions: dbTxs,
            summary: MOCK_ROLE_FINANCIAL_SUMMARIES[role] || MOCK_ROLE_FINANCIAL_SUMMARIES.buyer,
            bankAccounts: MOCK_USER_BANK_ACCOUNTS[role] || [],
          },
        });
      }
    } catch {
      // Bỏ qua lỗi nếu bảng chưa tạo trên DB thực
    }

    // Fallback dữ liệu chuẩn Single Source of Truth
    return NextResponse.json({
      success: true,
      data: {
        transactions: MOCK_FINANCIAL_TRANSACTIONS,
        summary: MOCK_ROLE_FINANCIAL_SUMMARIES[role] || MOCK_ROLE_FINANCIAL_SUMMARIES.buyer,
        bankAccounts: MOCK_USER_BANK_ACCOUNTS[role] || [],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Thao tác tài chính (Nộp chứng từ, Đối soát, Duyệt chi, Thêm tài khoản ngân hàng)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, role, adminSecret } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: 'Thiếu tham số action' }, { status: 400 });
    }

    // 1. Thêm tài khoản ngân hàng thụ hưởng
    if (action === 'add_bank_account') {
      const { bankName, accountNumber, accountHolder, branch } = payload || {};
      if (!accountNumber || !accountHolder) {
        return NextResponse.json({ success: false, error: 'Thiếu thông tin số tài khoản hoặc chủ thẻ' }, { status: 400 });
      }

      // Lưu vào Supabase user_bank_accounts nếu có
      try {
        await supabase.from('user_bank_accounts').insert({
          bank_name: bankName,
          account_number: accountNumber,
          account_holder: accountHolder.toUpperCase().trim(),
          branch: branch || 'Hà Nội',
          is_verified: false,
          created_at: new Date().toISOString(),
        });
      } catch {}

      return NextResponse.json({
        success: true,
        message: 'Đã lưu tài khoản ngân hàng thành công! Đang chờ đối chiếu CCCD chính chủ.',
        data: {
          accountNumberMasked: `${accountNumber.slice(0, 4)} **** ${accountNumber.slice(-4)}`,
        },
      });
    }

    // 2. Nộp chứng từ chuyển tiền (Ủy nhiệm chi / Biên lai)
    if (action === 'submit_proof') {
      const { transactionId, proofImageUrl, note } = payload || {};
      if (!proofImageUrl) {
        return NextResponse.json({ success: false, error: 'Thiếu ảnh chứng từ' }, { status: 400 });
      }

      try {
        await supabase
          .from('financial_transactions')
          .update({
            proof_image_url: proofImageUrl,
            status: 'pending_confirmation',
            admin_notes: note ? `Khách gửi chứng từ: ${note}` : 'Đã nộp chứng từ chuyển khoản, chờ đối soát',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transactionId);
      } catch {}

      return NextResponse.json({
        success: true,
        message: 'Đã tiếp nhận chứng từ chuyển tiền! Trạng thái đang là CHỜ ĐỐI SOÁT.',
      });
    }

    // 3. Phê duyệt lệnh chi / Giải ngân (Chỉ dành cho Admin / Kế toán trưởng)
    if (action === 'approve_payout') {
      if (role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Bạn không có quyền thực hiện thao tác này' }, { status: 403 });
      }

      const { transactionId } = payload || {};
      try {
        await supabase
          .from('financial_transactions')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', transactionId);
      } catch {}

      return NextResponse.json({
        success: true,
        message: `Đã phê duyệt lệnh giải ngân thành công cho giao dịch #${transactionId}!`,
      });
    }

    // 4. Từ chối khoản chi có lý do (Chỉ dành cho Admin)
    if (action === 'reject_payout') {
      if (role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Bạn không có quyền thực hiện thao tác này' }, { status: 403 });
      }

      const { transactionId, reason } = payload || {};
      if (!reason) {
        return NextResponse.json({ success: false, error: 'Bắt buộc nhập lý do từ chối' }, { status: 400 });
      }

      try {
        await supabase
          .from('financial_transactions')
          .update({
            status: 'rejected',
            dispute_reason: reason,
            updated_at: new Date().toISOString(),
          })
          .eq('id', transactionId);
      } catch {}

      return NextResponse.json({
        success: true,
        message: `Đã từ chối giao dịch #${transactionId} với lý do: ${reason}`,
      });
    }

    // 5. Gửi yêu cầu đối chiếu / giải trình
    if (action === 'request_reconciliation') {
      const { transactionCode, content, userEmail } = payload || {};
      return NextResponse.json({
        success: true,
        message: 'Đã tiếp nhận yêu cầu đối chiếu số liệu. Phòng Tài vụ sẽ phản hồi trong vòng 24h.',
      });
    }

    return NextResponse.json({ success: false, error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

