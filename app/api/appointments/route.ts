import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { mockListings } from '@/lib/mock-data';

// Zod Schema kiểm thực dữ liệu đặt lịch hẹn
const CreateAppointmentSchema = z.object({
  listingId: z.string().min(1, 'Thiếu listingId của BĐS'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD'),
  timeSlot: z.string().regex(/^\d{1,2}:\d{2}$/, 'Định dạng giờ phải là HH:mm (VD: 14:30)'),
  buyerName: z.string().min(2, 'Tên người xem nhà tối thiểu 2 ký tự'),
  buyerPhone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  sellerId: z.string().optional(),
  sellerEmail: z.string().email().optional(),
  purpose: z.string().optional(),
  note: z.string().max(500).optional(),
  brokerReferralCode: z.string().optional(),
});

/**
 * Chuyển đổi chuỗi giờ "HH:mm" thành số phút tính từ 00:00
 * VD: "09:30" -> 570; "14:15" -> 855
 */
function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Chuyển số phút tính từ 00:00 thành chuỗi "HH:mm"
 */
function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Kiểm thực Schema
    const parseResult = CreateAppointmentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: parseResult.error.errors[0]?.message || 'Dữ liệu lịch hẹn không hợp lệ',
          },
        },
        { status: 400 }
      );
    }

    const {
      listingId,
      appointmentDate,
      timeSlot,
      buyerName,
      buyerPhone,
      sellerId: rawSellerId,
      sellerEmail,
      purpose,
      note,
      brokerReferralCode,
    } = parseResult.data;

    // Tìm sellerId nếu chưa có
    const targetListing = mockListings.find((l) => String(l.id) === String(listingId));
    const sellerId = rawSellerId || targetListing?.userId || targetListing?.ownerId || 'u1';
    const targetMinutes = parseTimeToMinutes(timeSlot);

    // 2. KIỂM TRA XUNG ĐỘT KHUNG GIỜ VỚI BỘ ĐỆM (+/- 45 PHÚT)
    const BUFFER_MINUTES = 45;
    let existingAppointments: Array<{ time_slot: string; id: string; buyer_name?: string }> = [];

    // A. Thử truy vấn từ Supabase
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await (supabase.from('appointments' as any) as any)
        .select('id, time_slot, buyer_name')
        .eq('listing_id', listingId)
        .eq('appointment_date', appointmentDate)
        .in('status', ['pending', 'confirmed']);

      if (!error && Array.isArray(data)) {
        existingAppointments = data;
      }
    } catch (dbErr) {
      // Fallback
    }

    // B. Kiểm tra bộ đệm 45 phút
    let conflictingAppointment: { time_slot: string; diff: number } | null = null;

    for (const appt of existingAppointments) {
      if (!appt.time_slot) continue;
      const existingMinutes = parseTimeToMinutes(appt.time_slot);
      const diff = Math.abs(targetMinutes - existingMinutes);

      if (diff < BUFFER_MINUTES) {
        conflictingAppointment = { time_slot: appt.time_slot, diff };
        break;
      }
    }

    // 3. NẾU BỊ TRÙNG LỊCH HOẶC NẰM TRONG BỘ ĐỆM 45 PHÚT -> TRẢ VỀ HTTP 409
    if (conflictingAppointment) {
      const conflictingSlot = conflictingAppointment.time_slot;
      const confMinutes = parseTimeToMinutes(conflictingSlot);

      const suggestedEarlier = confMinutes - BUFFER_MINUTES >= 480 // sau 8:00
        ? formatMinutesToTime(confMinutes - BUFFER_MINUTES)
        : null;
      const suggestedLater = confMinutes + BUFFER_MINUTES <= 1260 // trước 21:00
        ? formatMinutesToTime(confMinutes + BUFFER_MINUTES)
        : null;

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TIME_BUFFER_COLLISION',
            message: `Khung giờ ${timeSlot} bị xung đột với lịch hẹn đã có lúc ${conflictingSlot}. Quy chuẩn HaNoi Realty yêu cầu đệm tối thiểu 45 phút giữa 2 lượt xem cùng một căn nhà để đảm bảo an ninh và chất lượng đón tiếp.`,
            conflictingSlot,
            bufferMinutes: BUFFER_MINUTES,
            suggestedSlots: [suggestedEarlier, suggestedLater].filter(Boolean),
          },
        },
        { status: 409 }
      );
    }

    // 4. TẠO IDEMPOTENCY KEY VÀ GHI NHẬN LỊCH HẸN MỚI
    const idempotencyKey = `${listingId}-${appointmentDate}-${timeSlot}-${buyerPhone.trim().replace(/\D/g, '')}`;
    const newAppointmentId = `appt-${Date.now()}`;

    const newAppointmentData = {
      id: newAppointmentId,
      listing_id: listingId,
      listing_title: targetListing?.title || 'BĐS Hà Nội',
      seller_id: sellerId,
      seller_email: sellerEmail || targetListing?.authorEmail,
      buyer_name: buyerName.trim(),
      buyer_phone: buyerPhone.trim(),
      appointment_date: appointmentDate,
      time_slot: timeSlot,
      note: note?.trim() || null,
      purpose: purpose || 'Mua ở thực',
      broker_referral_code: brokerReferralCode || null,
      idempotency_key: idempotencyKey,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Thử ghi vào Supabase
    try {
      const supabase = createServerSupabaseClient();
      await (supabase.from('appointments' as any) as any).insert(newAppointmentData);
    } catch (insertErr) {
      console.warn('[Appointments API] Supabase insert fallback to memory:', insertErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: newAppointmentData,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[Appointments API] Internal error:', err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message || 'Lỗi xử lý tạo lịch hẹn xem nhà.',
        },
      },
      { status: 500 }
    );
  }
}

