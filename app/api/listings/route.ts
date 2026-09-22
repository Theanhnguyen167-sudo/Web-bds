import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// GET: Lấy danh sách tin đăng
// query param ?status=all | pending | active
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    let query = supabase
      .from('listings')
      .select('*, users!user_id(full_name, avatar_url, phone)')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      // Fallback: query without users relation if join fails
      const fallbackQuery = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (status !== 'all') fallbackQuery.eq('status', status);
      const { data: fallbackData } = await fallbackQuery;
      return NextResponse.json({ success: true, data: fallbackData || [] });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Tạo tin đăng mới (mặc định status: 'pending' chờ admin duyệt)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      user_id,
      author_email,
      title,
      description,
      property_type,
      price,
      area,
      address,
      district,
      ward,
      lat,
      lng,
      images,
      planning_zone,
      direction,
      legal_status,
      floors,
      bedrooms,
      bathrooms,
    } = body;

    if (!title || !price || !area || !district) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Đảm bảo user_id hợp lệ trong bảng users (phải là UUID v4)
    let finalUserId = user_id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(finalUserId || '');
    if (!isUuid) {
      // Tìm xem có user nào trong bảng users trùng email không
      const targetEmail = author_email || 'cozyhollys@gmail.com';
      const { data: matchedUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', targetEmail)
        .maybeSingle();

      if (matchedUser?.id) {
        finalUserId = matchedUser.id;
      } else {
        // Tìm 1 user đầu tiên có sẵn trong db làm author fallback
        const { data: firstUser } = await supabase.from('users').select('id').limit(1).maybeSingle();
        finalUserId = firstUser?.id || '08880538-c501-47ff-835f-63b7573b7577';
      }
    }

    const pricePerM2 = Math.round(Number(price) / (Number(area) || 1));
    const locationWKT = lat && lng ? `POINT(${lng} ${lat})` : `POINT(105.7825 21.0315)`;

    const payload = {
      user_id: finalUserId,
      title,
      description: description || null,
      property_type: property_type || 'house',
      price: Number(price),
      area: Number(area),
      price_per_m2: pricePerM2,
      address,
      district,
      ward: ward || null,
      location: locationWKT,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'],
      status: 'pending', // Luôn vào hàng đợi kiểm duyệt của Admin
      is_featured: false,
      views: 1,
    };

    let resultData = null;
    try {
      const { data, error } = await (supabase.from('listings') as any)
        .insert(payload)
        .select('*, users!user_id(full_name, avatar_url, phone)')
        .single();

      if (error) {
        console.warn('Lỗi khi tạo tin đăng Supabase (có thể do RLS):', error.message);
        // Trả về data mô phỏng với ID tạm thời nếu RLS chưa mở
        return NextResponse.json({
          success: false,
          code: error.code,
          error: error.message,
          need_policy: error.code === '42501',
          fallback_data: {
            id: 'lst_' + Date.now(),
            ...payload,
            created_at: new Date().toISOString(),
          }
        }, { status: error.code === '42501' ? 403 : 500 });
      }
      resultData = data;
    } catch (insertErr: any) {
      console.error('Insert error:', insertErr);
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: resultData });
  } catch (err: any) {
    console.error('Exception khi tạo tin:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH: Phê duyệt hoặc Từ chối tin đăng (Dành cho Admin)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body; // status: 'active' | 'rejected'

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Thiếu id hoặc status' }, { status: 400 });
    }

    const { data, error } = await (supabase.from('listings') as any)
      .update({ status })
      .eq('id', id)
      .select('*, users!user_id(full_name, avatar_url, phone)')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
