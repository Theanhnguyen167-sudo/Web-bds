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
      .select('id, role, package, package_expires_at')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      validUserId = existingUser.id;
    } else if (!isUuid) {
      // Dùng hàm tạo UUID chuẩn hoặc crypto.randomUUID()
      validUserId = crypto.randomUUID();
    }

    const payload: any = {
      id: validUserId,
      email,
      full_name: full_name || email.split('@')[0],
      avatar_url: avatar_url || null,
      phone: phone || null,
      role: existingUser?.role || role || (email.includes('admin') ? 'admin' : 'user'),
      package: existingUser?.package || (email.includes('admin') ? 'Agency' : 'Free'),
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

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API sync-user exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
