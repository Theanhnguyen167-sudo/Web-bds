import { createClient } from '@/lib/supabase/client';
import { Database, AppointmentStatus } from '@/lib/supabase/database.types';

export type AppointmentRow = Database['public']['Tables']['appointments']['Row'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];

/**
 * Kiểm tra xem khung giờ tại một BĐS có còn trống không (PostGIS RPC hoặc direct query)
 */
export async function checkSlotAvailability(
  listingId: string,
  date: string,
  timeSlot: string
): Promise<boolean> {
  const supabase = createClient();
  try {
    const { data, error } = await (supabase.rpc as any)('is_appointment_slot_available', {
      p_listing_id: listingId,
      p_date: date,
      p_time_slot: timeSlot,
    });

    if (!error && typeof data === 'boolean') {
      return data;
    }

    // Fallback nếu RPC chưa chạy migration trên Supabase console
    const { data: existing } = await (supabase.from('appointments') as any)
      .select('id')
      .eq('listing_id', listingId)
      .eq('appointment_date', date)
      .eq('time_slot', timeSlot)
      .in('status', ['pending', 'confirmed']);

    return !existing || existing.length === 0;
  } catch (err) {
    console.warn('[Supabase] checkSlotAvailability fallback to true:', err);
    return true;
  }
}

/**
 * Tạo lịch hẹn mới với cơ chế idempotent key và concurrency protection
 */
export async function createSupabaseAppointment(
  appointment: AppointmentInsert
): Promise<{ success: boolean; data?: AppointmentRow; error?: string }> {
  const supabase = createClient();
  try {
    const isAvailable = await checkSlotAvailability(
      appointment.listing_id,
      appointment.appointment_date,
      appointment.time_slot
    );

    if (!isAvailable) {
      return {
        success: false,
        error: `Khung giờ ${appointment.time_slot} ngày ${appointment.appointment_date} đã có khách đặt lịch. Vui lòng chọn khung giờ khác.`,
      };
    }

    const { data, error } = await (supabase.from('appointments') as any)
      .insert(appointment)
      .select()
      .single();

    if (error) {
      // Bắt lỗi Unique constraint idempotency_key
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Yêu cầu đặt lịch đã được ghi nhận trước đó (Idempotency).',
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Không thể tạo lịch hẹn.' };
  }
}

/**
 * Lấy danh sách lịch hẹn của chủ tin đăng (Seller)
 */
export async function getSellerAppointments(sellerId: string): Promise<AppointmentRow[]> {
  const supabase = createClient();
  const { data, error } = await (supabase.from('appointments') as any)
    .select('*')
    .eq('seller_id', sellerId)
    .order('appointment_date', { ascending: false });

  if (error) {
    console.error('Error fetching seller appointments:', error);
    return [];
  }
  return data || [];
}

/**
 * Cập nhật trạng thái lịch hẹn (Xác nhận, Huỷ, Hoàn tất)
 */
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  cancelledReason?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await (supabase.from('appointments') as any)
    .update({
      status,
      cancelled_reason: cancelledReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
