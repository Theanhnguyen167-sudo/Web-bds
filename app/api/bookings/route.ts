import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { listingId, bookingData } = await req.json();

    if (!listingId) {
      return NextResponse.json({ success: false, error: 'Missing listingId' }, { status: 400 });
    }

    // 1. Query ra người sở hữu của tin đăng (owner_id)
    const { data: listing, error } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single();

    if (error || !listing) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tin đăng' }, { status: 404 });
    }

    const ownerId = listing.user_id;

    // 2. Lưu database thông báo cho riêng owner_id này
    // Cố gắng insert vào bảng notifications nếu có
    const { error: insertError } = await supabase
      .from('notifications' as any)
      .insert({
        user_id: ownerId,
        title: bookingData?.title || 'Khách hẹn xem nhà mới',
        content: bookingData?.content || '',
        category: 'message',
        is_read: false,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.warn("Lỗi lưu DB thông báo (có thể bảng chưa tồn tại):", insertError.message);
    }

    return NextResponse.json({ success: true, ownerId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
