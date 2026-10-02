export type NotificationCategory = 'planning' | 'listing' | 'ai' | 'message' | 'system';

export type NotificationType =
  | 'listing_approved'
  | 'listing_rejected'
  | 'listing_edit_required'
  | 'listing_expiring'
  | 'appointment'
  | 'planning'
  | 'ai'
  | 'system';

export interface AppointmentData {
  buyerName: string;
  buyerPhone: string;
  date: string;
  time: string;
  listingId: string;
  listingTitle: string;
  note?: string;
  purpose?: string;
  createdAt?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface NotificationItem {
  id: string;
  /**
   * ID của tài khoản nhận thông báo (BẮT BUỘC).
   * Giá trị 'all' chỉ dành cho thông báo hệ thống chung (system broadcast).
   */
  recipientUserId: string;
  type?: NotificationType | string;
  title: string;
  message?: string;
  content: string; // Nội dung hiển thị (tương thích ngược hoàn toàn)
  listingId?: string;
  appointmentId?: string;
  rejectionReason?: string;
  category: NotificationCategory;
  createdAt: string;
  timestamp: number;
  isRead: boolean;
  link?: string;
  tag?: string;
  appointmentData?: AppointmentData;
}

export interface NotificationPreferences {
  browserPush: boolean;
  planningUpdates: boolean;
  priceAlerts: boolean;
  inquiriesAndVisits: boolean;
  aiValuationReady: boolean;
  weeklyEmailDigest: boolean;
}
