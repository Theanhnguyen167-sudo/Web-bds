export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'broker' | 'agency' | 'admin';
export type MembershipTier = 'free' | 'vip1' | 'vip2' | 'vip3';
export type PropertyType = 'house' | 'apartment' | 'villa' | 'land' | 'commercial';
export type ListingType = 'sale' | 'rent';
export type ListingStatus = 'active' | 'pending' | 'sold' | 'rejected' | 'draft' | 'expired';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type NotificationCategory = 'planning' | 'listing' | 'ai' | 'message' | 'system' | 'appointment';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type ProjectStatus = 'planning' | 'construction' | 'completed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          membership_tier: MembershipTier;
          membership_expires_at: string | null;
          notification_preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          membership_tier?: MembershipTier;
          membership_expires_at?: string | null;
          notification_preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          membership_tier?: MembershipTier;
          membership_expires_at?: string | null;
          notification_preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string | null;
          price: number;
          price_per_m2: number | null;
          area: number;
          district: string;
          ward: string | null;
          street: string | null;
          address: string;
          property_type: PropertyType;
          listing_type: ListingType;
          bedrooms: number;
          bathrooms: number;
          floors: number;
          direction: string | null;
          legal_status: string | null;
          status: ListingStatus;
          images: string[];
          is_featured: boolean;
          views_count: number;
          ai_investment_score: number | null;
          planning_zone_code: string | null;
          planning_year: number | null;
          substantive_diff: string | null;
          author_name: string | null;
          author_phone: string | null;
          author_email: string | null;
          author_avatar: string | null;
          seller_type: string | null;
          show_phone: boolean;
          geom: unknown; // PostGIS Point (EPSG:4326)
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string | null;
          price: number;
          price_per_m2?: number | null;
          area: number;
          district: string;
          ward?: string | null;
          street?: string | null;
          address: string;
          property_type: PropertyType;
          listing_type?: ListingType;
          bedrooms?: number;
          bathrooms?: number;
          floors?: number;
          direction?: string | null;
          legal_status?: string | null;
          status?: ListingStatus;
          images?: string[];
          is_featured?: boolean;
          views_count?: number;
          ai_investment_score?: number | null;
          planning_zone_code?: string | null;
          planning_year?: number | null;
          substantive_diff?: string | null;
          author_name?: string | null;
          author_phone?: string | null;
          author_email?: string | null;
          author_avatar?: string | null;
          seller_type?: string | null;
          show_phone?: boolean;
          geom?: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string | null;
          price?: number;
          price_per_m2?: number | null;
          area?: number;
          district?: string;
          ward?: string | null;
          street?: string | null;
          address?: string;
          property_type?: PropertyType;
          listing_type?: ListingType;
          bedrooms?: number;
          bathrooms?: number;
          floors?: number;
          direction?: string | null;
          legal_status?: string | null;
          status?: ListingStatus;
          images?: string[];
          is_featured?: boolean;
          views_count?: number;
          ai_investment_score?: number | null;
          planning_zone_code?: string | null;
          planning_year?: number | null;
          substantive_diff?: string | null;
          author_name?: string | null;
          author_phone?: string | null;
          author_email?: string | null;
          author_avatar?: string | null;
          seller_type?: string | null;
          show_phone?: boolean;
          geom?: unknown;
          created_at?: string;
          updated_at?: string;
        };
      };
      planning_zones: {
        Row: {
          id: string;
          zone_code: string;
          zone_name: string;
          district: string;
          description: string | null;
          color_code: string | null;
          legal_basis: string | null;
          area_ha: number | null;
          max_floors: number | null;
          density: string | null;
          floor_area_ratio: number | null;
          max_height: string | null;
          pdf_url: string | null;
          plan_year: number;
          status: 'published' | 'draft';
          geom: unknown; // Geometry(4326)
          created_at: string;
        };
        Insert: {
          id?: string;
          zone_code: string;
          zone_name: string;
          district: string;
          description?: string | null;
          color_code?: string | null;
          legal_basis?: string | null;
          area_ha?: number | null;
          max_floors?: number | null;
          density?: string | null;
          floor_area_ratio?: number | null;
          max_height?: string | null;
          pdf_url?: string | null;
          plan_year?: number;
          status?: 'published' | 'draft';
          geom?: unknown;
          created_at?: string;
        };
        Update: {
          id?: string;
          zone_code?: string;
          zone_name?: string;
          district?: string;
          description?: string | null;
          color_code?: string | null;
          legal_basis?: string | null;
          area_ha?: number | null;
          max_floors?: number | null;
          density?: string | null;
          floor_area_ratio?: number | null;
          max_height?: string | null;
          pdf_url?: string | null;
          plan_year?: number;
          status?: 'published' | 'draft';
          geom?: unknown;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          project_type: string;
          district: string;
          status: ProjectStatus;
          expected_completion: string | null;
          impact_radius: number | null;
          description: string | null;
          geom: unknown; // Point(4326)
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          project_type: string;
          district: string;
          status?: ProjectStatus;
          expected_completion?: string | null;
          impact_radius?: number | null;
          description?: string | null;
          geom?: unknown;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          project_type?: string;
          district?: string;
          status?: ProjectStatus;
          expected_completion?: string | null;
          impact_radius?: number | null;
          description?: string | null;
          geom?: unknown;
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          idempotency_key: string | null;
          listing_id: string;
          seller_id: string | null;
          seller_email: string | null;
          buyer_id: string | null;
          buyer_name: string;
          buyer_phone: string;
          buyer_email: string | null;
          appointment_date: string;
          time_slot: string;
          purpose: string | null;
          note: string | null;
          status: AppointmentStatus;
          cancelled_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idempotency_key?: string | null;
          listing_id: string;
          seller_id?: string | null;
          seller_email?: string | null;
          buyer_id?: string | null;
          buyer_name: string;
          buyer_phone: string;
          buyer_email?: string | null;
          appointment_date: string;
          time_slot: string;
          purpose?: string | null;
          note?: string | null;
          status?: AppointmentStatus;
          cancelled_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          idempotency_key?: string | null;
          listing_id?: string;
          seller_id?: string | null;
          seller_email?: string | null;
          buyer_id?: string | null;
          buyer_name?: string;
          buyer_phone?: string;
          buyer_email?: string | null;
          appointment_date?: string;
          time_slot?: string;
          purpose?: string | null;
          note?: string | null;
          status?: AppointmentStatus;
          cancelled_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          recipient_user_id: string;
          category: NotificationCategory;
          type: string;
          title: string;
          content: string;
          listing_id: string | null;
          appointment_id: string | null;
          link: string | null;
          metadata: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_user_id: string;
          category: NotificationCategory;
          type: string;
          title: string;
          content: string;
          listing_id?: string | null;
          appointment_id?: string | null;
          link?: string | null;
          metadata?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_user_id?: string;
          category?: NotificationCategory;
          type?: string;
          title?: string;
          content?: string;
          listing_id?: string | null;
          appointment_id?: string | null;
          link?: string | null;
          metadata?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      ai_reports: {
        Row: {
          id: string;
          listing_id: string;
          user_id: string;
          address: string;
          district: string;
          price: number;
          area: number;
          growth_potential_score: number | null;
          liquidity_score: number | null;
          planning_info: Json;
          nearby_projects: Json;
          amenities: Json;
          ai_analysis: Json;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          user_id: string;
          address: string;
          district: string;
          price: number;
          area: number;
          growth_potential_score?: number | null;
          liquidity_score?: number | null;
          planning_info?: Json;
          nearby_projects?: Json;
          amenities?: Json;
          ai_analysis?: Json;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          user_id?: string;
          address?: string;
          district?: string;
          price?: number;
          area?: number;
          growth_potential_score?: number | null;
          liquidity_score?: number | null;
          planning_info?: Json;
          nearby_projects?: Json;
          amenities?: Json;
          ai_analysis?: Json;
          pdf_url?: string | null;
          created_at?: string;
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
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          filters: Json;
          email_alert: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          filters: Json;
          email_alert?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          filters?: Json;
          email_alert?: boolean;
          created_at?: string;
        };
      };
      payment_orders: {
        Row: {
          id: string;
          order_id: string;
          user_id: string | null;
          package_id: string;
          package_name: string;
          amount: number;
          payment_method: string | null;
          status: PaymentStatus;
          bank_code: string | null;
          vnp_transaction_no: string | null;
          vnp_response_code: string | null;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          user_id?: string | null;
          package_id: string;
          package_name: string;
          amount: number;
          payment_method?: string | null;
          status?: PaymentStatus;
          bank_code?: string | null;
          vnp_transaction_no?: string | null;
          vnp_response_code?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          user_id?: string | null;
          package_id?: string;
          package_name?: string;
          amount?: number;
          payment_method?: string | null;
          status?: PaymentStatus;
          bank_code?: string | null;
          vnp_transaction_no?: string | null;
          vnp_response_code?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
      };
    };
    Functions: {
      search_listings_in_radius: {
        Args: {
          target_lng: number;
          target_lat: number;
          radius_meters?: number;
        };
        Returns: {
          id: string;
          title: string;
          price: number;
          area: number;
          address: string;
          district: string;
          distance_meters: number;
        }[];
      };
      check_property_planning_zone: {
        Args: {
          target_lng: number;
          target_lat: number;
        };
        Returns: {
          zone_code: string;
          zone_name: string;
          district: string;
          description: string | null;
          color_code: string | null;
          plan_year: number;
          density: string | null;
          max_height: string | null;
        }[];
      };
      get_nearby_infrastructure_projects: {
        Args: {
          target_lng: number;
          target_lat: number;
          radius_meters?: number;
        };
        Returns: {
          id: string;
          name: string;
          project_type: string;
          status: string;
          expected_completion: string | null;
          distance_meters: number;
        }[];
      };
      is_appointment_slot_available: {
        Args: {
          p_listing_id: string;
          p_date: string;
          p_time_slot: string;
        };
        Returns: boolean;
      };
    };
  };
}
