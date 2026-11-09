import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client phía Server với quyền bypass RLS khi cần
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, email, full_name, avatar_url, phone, role } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // Nếu id từ Firebase không phải định dạng UUID (v4), tạo UUID v4 ngẫu nhiên hoặc kiểm tra xem user theo email đã có chưa
    let validUserId = id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

    // Kiểm tra xem đã có bản ghi theo email này trong bảng users chưa
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role, membership_tier, notification_preferences, agent_code, owner_code, referred_by_agent_code')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      validUserId = existingUser.id;
    } else if (!isUuid) {
      // Dùng hàm tạo UUID chuẩn hoặc crypto.randomUUID()
      validUserId = crypto.randomUUID();
    }

    const validRoles = ['buyer', 'owner', 'agent', 'admin', 'user'];
    const existingBusinessRole = (existingUser?.notification_preferences as any)?.business_role;
    // Ưu tiên role được truyền lên (khi đăng ký mới hoặc chuyển vai trò), sau đó đến role đã lưu trong DB
    const assignedRole = (validRoles.includes(role) ? role : null) || existingBusinessRole || existingUser?.role || 'buyer';

    // Ánh xạ an toàn về PostgreSQL enum 'user_role' hiện hành ('user' | 'agent' | 'admin')
    let dbRole = 'user';
    if (assignedRole === 'admin') {
      dbRole = 'admin';
    } else if (assignedRole === 'agent') {
      dbRole = 'agent';
    } else {
      dbRole = 'user';
    }

    const currentPreferences = (existingUser?.notification_preferences as any) || {};
    const updatedPreferences = {
      ...currentPreferences,
      business_role: assignedRole,
    };

    // Quản lý mã định danh: Mỗi tài khoản CHỈ có 1 mã duy nhất theo đúng vai trò đăng ký
    let existingAgentCode: string | null = existingUser?.agent_code || currentPreferences?.agent_code || null;
    let existingOwnerCode: string | null = existingUser?.owner_code || currentPreferences?.owner_code || null;

    if (assignedRole === 'agent') {
      if (!existingAgentCode) {
        existingAgentCode = 'MG-00102';
      }
      existingOwnerCode = null; // CTV không mang mã chủ nhà
    } else if (assignedRole === 'owner') {
      if (!existingOwnerCode) {
        existingOwnerCode = 'CN-00086';
      }
      existingAgentCode = null; // Chủ nhà không mang mã CTV
    } else {
      // Người mua / Khách hàng / Admin: không cấp mã riêng
      existingAgentCode = null;
      existingOwnerCode = null;
    }

    updatedPreferences.agent_code = existingAgentCode;
    updatedPreferences.owner_code = existingOwnerCode;

    const payload: any = {
      id: validUserId,
      email,
      full_name: full_name || email.split('@')[0],
      avatar_url: avatar_url || null,
      phone: phone || null,
      role: dbRole,
      notification_preferences: updatedPreferences,
    };

    if (existingAgentCode) payload.agent_code = existingAgentCode;
    if (existingOwnerCode) payload.owner_code = existingOwnerCode;

    const { data, error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi upsert Supabase users:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        businessRole: assignedRole,
        agentCode: existingAgentCode || data?.agent_code,
        ownerCode: existingOwnerCode || data?.owner_code,
        referredByAgentCode: data?.referred_by_agent_code,
      },
    });
  } catch (err: any) {
    console.error('API sync-user exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET: Tra cứu tài khoản và vai trò đã đăng ký trong Supabase
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json({ success: false, error: 'Email or ID is required' }, { status: 400 });
    }

    let query = supabase.from('users').select('*');
    if (id) {
      query = query.eq('id', id);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'User not found in Supabase' }, { status: 404 });
    }

    const prefs = (data.notification_preferences as any) || {};
    const businessRole = prefs.business_role || data.role || 'buyer';
    const isAgent = businessRole === 'agent' || data.role === 'agent';
    const isOwner = businessRole === 'owner';

    // Mỗi tài khoản CHỈ có duy nhất 1 mã đúng vai trò đăng ký
    const agentCode = isAgent ? (data.agent_code || prefs.agent_code || 'MG-00102') : null;
    const ownerCode = isOwner ? (data.owner_code || prefs.owner_code || 'CN-00086') : null;
    const referredByAgentCode = data.referred_by_agent_code || prefs.referred_by_agent_code || null;

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        businessRole,
        agentCode,
        ownerCode,
        referredByAgentCode,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
