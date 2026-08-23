export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'user' | 'agent' | 'admin';
export type PropertyType = 'house' | 'apartment' | 'land' | 'villa' | 'shophouse';
export type ListingStatus = 'pending' | 'active' | 'expired' | 'sold' | 'rejected';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type PaymentStatus = 'pending' | 'success' | 'failed';
export type ProjectStatus = 'planning' | 'construction' | 'completed';
export type ZoneType = 'residential' | 'commercial' | 'green' | 'transport' | 'industrial' | 'public';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_listings: number;
  listing_duration_days: number;
  featured_listings_count: number;
  has_ai_report: boolean;
  max_ai_reports_monthly: number;
  has_export_pdf: boolean;
  description: string | null;
  features: string[];
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  created_at: string;
  package?: Package;
}

export interface Payment {
  id: string;
  user_id: string;
  package_id: string | null;
  amount: number;
  currency: string;
  vnpay_txn_ref: string;
  vnpay_transaction_no: string | null;
  vnpay_response_code: string | null;
  status: PaymentStatus;
  created_at: string;
}
