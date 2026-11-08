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
      .select('id, role, membership_tier, notification_preferences')
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

    const payload: any = {
      id: validUserId,
      email,
      full_name: full_name || email.split('@')[0],
      avatar_url: avatar_url || null,
      phone: phone || null,
      role: dbRole,
      notification_preferences: updatedPreferences,
    };

    const { data, error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi upsert Supabase users:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { ...data, businessRole: assignedRole } });
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

    const businessRole = (data.notification_preferences as any)?.business_role || data.role || 'buyer';
    return NextResponse.json({ success: true, data: { ...data, businessRole } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
