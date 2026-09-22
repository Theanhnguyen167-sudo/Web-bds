export type NotificationCategory = 'planning' | 'listing' | 'ai' | 'message' | 'system';

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
}

export interface NotificationPreferences {
  browserPush: boolean;
  planningUpdates: boolean;
  priceAlerts: boolean;
  inquiriesAndVisits: boolean;
  aiValuationReady: boolean;
  weeklyEmailDigest: boolean;
}
