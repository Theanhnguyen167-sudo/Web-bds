import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { mockListings } from '@/lib/mock-data';

export async function POST(req: Request) {
  try {
    const { listingId, bookingData } = await req.json();

    if (!listingId) {
      return NextResponse.json({ success: false, error: 'Missing listingId' }, { status: 400 });
    }

    // 1. Kiểm tra trong mock data trước để có ownerId tức thì
    const mockMatch = mockListings.find((l) => String(l.id) === String(listingId));
    let ownerId = mockMatch?.userId || mockMatch?.ownerId || 'u1';

    // 2. Thử truy vấn Supabase có timeout tối đa 1.2s (Graceful Degradation)
    try {
      const supabase = createServerSupabaseClient();
      const sbQuery = supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single();

      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase query timeout')), 1200)
      );

      const res = (await Promise.race([sbQuery, timeoutPromise])) as any;
      if (res?.data?.user_id) {
        ownerId = res.data.user_id;

        // Lưu notification vào DB nếu có kết nối
        await Promise.race([
          (supabase.from('notifications') as any).insert({
            user_id: ownerId,
            title: bookingData?.title || 'Khách hẹn xem nhà mới',
            content: bookingData?.content || '',
            category: 'message',
            is_read: false,
            created_at: new Date().toISOString(),
          }),
          new Promise((r) => setTimeout(r, 800)),
        ]).catch(() => {});
      }
    } catch {
      // Supabase timeout hoặc lỗi kết nối -> dùng ownerId fallback
    }

    return NextResponse.json({ success: true, ownerId });
  } catch (err: any) {
    return NextResponse.json({ success: true, ownerId: 'u1' });
  }
}
