import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

export type NotificationRow = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];

/**
 * Lấy danh sách thông báo gửi riêng cho User (hoặc broadcast 'all')
 */
export async function getUserNotifications(userId: string): Promise<NotificationRow[]> {
  const supabase = createClient();
  const { data, error } = await (supabase.from('notifications') as any)
    .select('*')
    .or(`recipient_user_id.eq.${userId},recipient_user_id.eq.all`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data || [];
}

/**
 * Gửi thông báo đến chủ tin / người dùng
 */
export async function createNotification(
  notification: NotificationInsert
): Promise<{ success: boolean; data?: NotificationRow; error?: string }> {
  const supabase = createClient();
  const { data, error } = await (supabase.from('notifications') as any)
    .insert(notification)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

/**
 * Đánh dấu một thông báo là đã đọc
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await (supabase.from('notifications') as any)
    .update({ is_read: true })
    .eq('id', id);

  return !error;
}

/**
 * Đánh dấu tất cả thông báo của người dùng là đã đọc
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await (supabase.from('notifications') as any)
    .update({ is_read: true })
    .or(`recipient_user_id.eq.${userId},recipient_user_id.eq.all`);

  return !error;
}
