export type NotificationCategory = 'planning' | 'listing' | 'ai' | 'message' | 'system';

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
  title: string;
  content: string;
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
