export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'agent' | 'admin';
export type PropertyType = 'house' | 'apartment' | 'land' | 'villa';
export type ListingStatus = 'pending' | 'active' | 'expired' | 'sold';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed';
export type ProjectStatus = 'planning' | 'construction' | 'completed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          name: string;
          price_monthly: number;
          price_yearly: number;
          max_listings: number;
          has_ai_report: boolean;
          has_featured: boolean;
          description: string | null;
          features: Json | null;
        };
        Insert: {
          id: string;
          name: string;
          price_monthly: number;
          price_yearly: number;
          max_listings?: number;
          has_ai_report?: boolean;
          has_featured?: boolean;
          description?: string | null;
          features?: Json | null;
        };
        Update: {
          id?: string;
          name?: string;
          price_monthly?: number;
          price_yearly?: number;
          max_listings?: number;
          has_ai_report?: boolean;
          has_featured?: boolean;
          description?: string | null;
          features?: Json | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          package_id: string;
          start_date: string;
          end_date: string;
          status: SubscriptionStatus;
          payment_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          package_id: string;
          start_date?: string;
          end_date: string;
          status?: SubscriptionStatus;
          payment_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          package_id?: string;
          start_date?: string;
          end_date?: string;
          status?: SubscriptionStatus;
          payment_id?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          vnpay_txn_ref: string | null;
          vnpay_response_code: string | null;
          status: PaymentStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          vnpay_txn_ref?: string | null;
          vnpay_response_code?: string | null;
          status?: PaymentStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          vnpay_txn_ref?: string | null;
          vnpay_response_code?: string | null;
          status?: PaymentStatus;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          property_type: PropertyType;
          price: number;
          area: number;
          price_per_m2: number;
          address: string;
          district: string;
          ward: string | null;
          location: unknown; // geography(Point, 4326)
          images: string[];
          status: ListingStatus;
          is_featured: boolean;
          views: number;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          property_type: PropertyType;
          price: number;
          area: number;
          price_per_m2?: number;
          address: string;
          district: string;
          ward?: string | null;
          location?: unknown;
          images?: string[];
          status?: ListingStatus;
          is_featured?: boolean;
          views?: number;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          property_type?: PropertyType;
          price?: number;
          area?: number;
          price_per_m2?: number;
          address?: string;
          district?: string;
          ward?: string | null;
          location?: unknown;
          images?: string[];
          status?: ListingStatus;
          is_featured?: boolean;
          views?: number;
          created_at?: string;
          expires_at?: string | null;
        };
      };
      planning_zones: {
        Row: {
          id: string;
          name: string;
          zone_type: string;
          plan_year: number;
          district: string;
          boundary: unknown; // geography(Polygon, 4326)
          description: string | null;
          source_url: string | null;
          color_code: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          zone_type: string;
          plan_year: number;
          district: string;
          boundary?: unknown;
          description?: string | null;
          source_url?: string | null;
          color_code?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          zone_type?: string;
          plan_year?: number;
          district?: string;
          boundary?: unknown;
          description?: string | null;
          source_url?: string | null;
          color_code?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          project_type: string;
          location: unknown; // geography(Point, 4326)
          status: ProjectStatus;
          expected_completion: string | null;
          impact_radius: number | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          project_type: string;
          location?: unknown;
          status?: ProjectStatus;
          expected_completion?: string | null;
          impact_radius?: number | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          project_type?: string;
          location?: unknown;
          status?: ProjectStatus;
          expected_completion?: string | null;
          impact_radius?: number | null;
          description?: string | null;
        };
      };
      ai_reports: {
        Row: {
          id: string;
          listing_id: string;
          user_id: string;
          planning_info: Json;
          development_potential: number | null;
          nearby_projects: Json;
          amenities: Json;
          ai_analysis: Json;
          pdf_url: string | null;
          generated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          user_id: string;
          planning_info?: Json;
          development_potential?: number | null;
          nearby_projects?: Json;
          amenities?: Json;
          ai_analysis?: Json;
          pdf_url?: string | null;
          generated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          user_id?: string;
          planning_info?: Json;
          development_potential?: number | null;
          nearby_projects?: Json;
          amenities?: Json;
          ai_analysis?: Json;
          pdf_url?: string | null;
          generated_at?: string;
        };
      };
      saved_listings: {
        Row: {
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          listing_id?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_nearby_listings: {
        Args: {
          lat: number;
          lng: number;
          radius_meters: number;
        };
        Returns: Database['public']['Tables']['listings']['Row'][];
      };
      get_planning_zone_at_point: {
        Args: {
          lat: number;
          lng: number;
        };
        Returns: Database['public']['Tables']['planning_zones']['Row'][];
      };
      get_projects_nearby: {
        Args: {
          lat: number;
          lng: number;
          radius_meters: number;
        };
        Returns: Database['public']['Tables']['projects']['Row'][];
      };
      increment_views: {
        Args: {
          listing_id: string;
        };
        Returns: void;
      };
    };
  };
}
