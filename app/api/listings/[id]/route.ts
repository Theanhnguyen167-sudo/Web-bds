import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getListingBySlugOrIdServer } from '@/lib/services/listing-lookup';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài đăng' }, { status: 400 });
    }

    // Tra cứu thống nhất qua database Supabase & mockListings (hỗ trợ cả UUID, ID số và Slug)
    const listing = await getListingBySlugOrIdServer(id);
    if (listing) {
      return NextResponse.json({ success: true, data: listing });
    }

    return NextResponse.json(
      { success: false, error: 'Không tìm thấy bài đăng' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Lỗi khi lấy chi tiết bài đăng API:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi lấy chi tiết bài đăng' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài đăng' }, { status: 400 });
    }
    const body = await req.json();
    const { status, title, price, area, description, images, address, district, ward, legal_status, rejectionReason } = body;

    const payload: Record<string, any> = {};
    if (status) payload.status = status;
    if (title) payload.title = title;
    if (price !== undefined) payload.price = Number(price);
    if (area !== undefined) payload.area = Number(area);
    if (description !== undefined) payload.description = description;
    if (images) payload.images = images;
    if (address) payload.address = address;
    if (district) payload.district = district;
    if (ward !== undefined) payload.ward = ward;
    if (legal_status) payload.legal_status = legal_status;
    if (rejectionReason) payload.rejection_reason = rejectionReason;

    const { data, error } = await (supabase.from('listings') as any)
      .update(payload)
      .eq('id', id)
      .select('*, users!user_id(full_name, avatar_url, phone)')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || { id, ...payload } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài đăng' }, { status: 400 });
    }

    await (supabase.from('listings') as any).delete().eq('id', id);
    return NextResponse.json({ success: true, message: 'Đã xóa bài đăng thành công' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

