-- =================================================================
-- 🏗️ HANOI REAL ESTATE PLATFORM - SUPABASE POSTGRES + POSTGIS SCHEMA
-- =================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUM Types
CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');
CREATE TYPE property_type AS ENUM ('house', 'apartment', 'land', 'villa', 'shophouse');
CREATE TYPE listing_status AS ENUM ('pending', 'active', 'expired', 'sold', 'rejected');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE project_status AS ENUM ('planning', 'construction', 'completed');
CREATE TYPE zone_type AS ENUM ('residential', 'commercial', 'green', 'transport', 'industrial', 'public');

-- 3. Users Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Membership Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY, -- 'free', 'basic', 'pro', 'agency'
  name TEXT NOT NULL,
  price_monthly BIGINT NOT NULL DEFAULT 0,
  price_yearly BIGINT NOT NULL DEFAULT 0,
  max_listings INT NOT NULL DEFAULT 3,
  listing_duration_days INT NOT NULL DEFAULT 7,
  featured_listings_count INT NOT NULL DEFAULT 0,
  has_ai_report BOOLEAN DEFAULT FALSE,
  max_ai_reports_monthly INT DEFAULT 0,
  has_export_pdf BOOLEAN DEFAULT FALSE,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL REFERENCES public.packages(id),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status subscription_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id TEXT REFERENCES public.packages(id),
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'VND',
  vnpay_txn_ref TEXT UNIQUE NOT NULL,
  vnpay_transaction_no TEXT,
  vnpay_response_code TEXT,
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Property Listings Table (PostGIS Enabled)
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  price BIGINT NOT NULL,                  -- VNĐ
  area NUMERIC(10, 2) NOT NULL,           -- m2
  price_per_m2 NUMERIC(14, 2) GENERATED ALWAYS AS (CASE WHEN area > 0 THEN price / area ELSE 0 END) STORED,
  address TEXT NOT NULL,
  district TEXT NOT NULL,                 -- e.g. 'Cầu Giấy', 'Ba Đình'
  ward TEXT,                              -- e.g. 'Dịch Vọng Hậu'
  street TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- WGS84 (Longitude, Latitude)
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  floors INT DEFAULT 1,
  direction TEXT,                         -- 'Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', etc.
  legal_status TEXT,                      -- 'Sổ đỏ/Sổ hồng', 'Hợp đồng mua bán', etc.
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  status listing_status DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Spatial Index for Fast Map Queries
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_listings_district ON public.listings(district);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);

-- 8. Planning Zones Table (Quy Hoạch GeoJSON Polygons)
CREATE TABLE IF NOT EXISTS public.planning_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  zone_type zone_type NOT NULL,
  plan_year INT NOT NULL DEFAULT 2030,
  district TEXT NOT NULL,
  boundary GEOGRAPHY(POLYGON, 4326) NOT NULL, -- PostGIS Polygon
  color_code TEXT NOT NULL DEFAULT '#3b82f6',
  description TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planning_boundary ON public.planning_zones USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_planning_district ON public.planning_zones(district);

-- 9. Infrastructure Projects (Dự án giao thông, đô thị xung quanh)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  project_type TEXT NOT NULL,             -- 'metro', 'bridge', 'hospital', 'school', 'mall', 'urban_area'
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  status project_status DEFAULT 'construction',
  expected_completion TEXT,               -- e.g. 'Q4/2026'
  impact_radius_meters INT DEFAULT 2000,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_location ON public.projects USING GIST(location);

-- 10. AI Reports Table
CREATE TABLE IF NOT EXISTS public.ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  planning_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  nearby_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_analysis TEXT NOT NULL,
  score_potential INT CHECK (score_potential >= 0 AND score_potential <= 100),
  pdf_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Saved Listings Table
CREATE TABLE IF NOT EXISTS public.saved_listings (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- =================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

-- Public can view active listings & packages & planning data
CREATE POLICY "Public can view active listings" ON public.listings FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public can view planning zones" ON public.planning_zones FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);

-- User policies
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own listings" ON public.listings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own AI reports" ON public.ai_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage saved listings" ON public.saved_listings FOR ALL USING (auth.uid() = user_id);

-- Initial Packages Seed
INSERT INTO public.packages (id, name, price_monthly, price_yearly, max_listings, listing_duration_days, featured_listings_count, has_ai_report, max_ai_reports_monthly, has_export_pdf, description, features)
VALUES 
('free', 'Miễn phí', 0, 0, 3, 7, 0, false, 0, false, 'Dành cho người dùng cá nhân trải nghiệm', '["Đăng tối đa 3 tin", "Thời hạn tin 7 ngày", "Xem quy hoạch Hà Nội"]'::jsonb),
('basic', 'Cơ bản', 299000, 2990000, 20, 30, 2, true, 5, true, 'Dành cho môi giới độc lập', '["Đăng tối đa 20 tin", "Thời hạn tin 30 ngày", "2 tin nổi bật/tháng", "5 Báo cáo AI định giá", "Xuất báo cáo PDF"]'::jsonb),
('pro', 'Chuyên nghiệp', 599000, 5990000, 50, 60, 10, true, 30, true, 'Dành cho nhà đầu tư & môi giới VIP', '["Đăng tối đa 50 tin", "Thời hạn tin 60 ngày", "10 tin nổi bật/tháng", "30 Báo cáo AI chi tiết", "Phân tích quy hoạch nâng cao", "Hỗ trợ ưu tiên"]'::jsonb),
('agency', 'Doanh nghiệp', 1299000, 12990000, 9999, 90, 999, true, 999, true, 'Dành cho sàn giao dịch BĐS', '["Không giới hạn tin đăng", "Thời hạn tin 90 ngày", "Tin nổi bật không giới hạn", "Báo cáo AI không giới hạn", "Quản lý team & phân quyền", "Dedicated Support"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
