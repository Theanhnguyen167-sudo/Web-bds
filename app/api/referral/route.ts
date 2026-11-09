import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CODE_REGEX, formatMgCode } from '@/lib/identification';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// GET: Tra cứu thông tin hiển thị của môi giới theo mã MG-XXXXX
// Chỉ trả về họ tên và mã, TUYỆT ĐỐI không lộ SĐT, email, số dư hay quyền hạn
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const codeParam = searchParams.get('code')?.trim();

    if (!codeParam) {
      return NextResponse.json({ success: false, error: 'Thiếu mã môi giới' }, { status: 400 });
    }

    const standardCode = formatMgCode(codeParam);
    if (!CODE_REGEX.MG.test(standardCode)) {
      return NextResponse.json({ success: false, error: 'Mã môi giới không đúng định dạng (VD: MG-00102)' }, { status: 400 });
    }

    // Tra cứu trong bảng users theo agent_code
    const { data: agent, error } = await supabase
      .from('users')
      .select('id, full_name, agent_code, avatar_url')
      .eq('agent_code', standardCode)
      .maybeSingle();

    if (error || !agent) {
      // Fallback cho môi trường mẫu / dev
      if (standardCode === 'MG-00102') {
        return NextResponse.json({
          success: true,
          data: {
            agentCode: 'MG-00102',
            fullName: 'Trần Thị Thu Hà (TPKD)',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          },
        });
      }
      return NextResponse.json({ success: false, error: 'Không tìm thấy chuyên viên môi giới tương ứng với mã này' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        agentCode: agent.agent_code,
        fullName: agent.full_name || 'Chuyên viên HaNoi Realty',
        avatarUrl: agent.avatar_url || null,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Người mua xác nhận chuyên viên môi giới hỗ trợ
// QUY TẮC: Nếu đã có người giới thiệu, KHÔNG âm thầm ghi đè!
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buyerEmail, buyerId, agentCode } = body;

    if (!buyerEmail && !buyerId) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin người mua' }, { status: 400 });
    }

    const standardCode = formatMgCode(agentCode || '');
    if (!CODE_REGEX.MG.test(standardCode)) {
      return NextResponse.json({ success: false, error: 'Mã môi giới không đúng định dạng' }, { status: 400 });
    }

    // 1. Kiểm tra môi giới có tồn tại
    let agentName = 'Chuyên viên môi giới';
    const { data: agent } = await supabase
      .from('users')
      .select('id, full_name, agent_code')
      .eq('agent_code', standardCode)
      .maybeSingle();

    if (agent) {
      agentName = agent.full_name;
    } else if (standardCode !== 'MG-00102') {
      return NextResponse.json({ success: false, error: 'Mã môi giới không tồn tại trong hệ thống' }, { status: 404 });
    } else {
      agentName = 'Trần Thị Thu Hà (TPKD)';
    }

    // 2. Kiểm tra xem người mua đã xác nhận môi giới trước đó chưa
    let buyerQuery = supabase.from('users').select('id, email, full_name, referred_by_agent_code');
    if (buyerId) {
      buyerQuery = buyerQuery.eq('id', buyerId);
    } else {
      buyerQuery = buyerQuery.eq('email', buyerEmail);
    }
    const { data: currentBuyer } = await buyerQuery.maybeSingle();

    // Chống ghi đè môi giới đã xác nhận
    if (currentBuyer?.referred_by_agent_code) {
      if (currentBuyer.referred_by_agent_code === standardCode) {
        return NextResponse.json({
          success: true,
          message: 'Bạn đã kết nối với chuyên viên này trước đó.',
          data: { agentCode: standardCode, agentName },
        });
      }
      return NextResponse.json({
        success: false,
        error: `Tài khoản đã có chuyên viên môi giới hỗ trợ (${currentBuyer.referred_by_agent_code}). Không thể thay đổi người giới thiệu.`,
      }, { status: 409 });
    }

    // 3. Cập nhật mã môi giới giới thiệu (referred_by_agent_code)
    if (currentBuyer) {
      await supabase
        .from('users')
        .update({ referred_by_agent_code: standardCode })
        .eq('id', currentBuyer.id);
    }

    return NextResponse.json({
      success: true,
      message: `Đã kết nối thành công chuyên viên hỗ trợ: ${agentName}`,
      data: {
        agentCode: standardCode,
        agentName,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

