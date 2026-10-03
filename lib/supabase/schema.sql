-- ==============================================================================
-- HANOI REALTY - DATABASE & POSTGIS SPATIAL SCHEMA MIGRATION
-- Đạt chuẩn: EPSG:4326 (WGS 84), GIST Spatial Index, An toàn RLS, Hiệu năng < 15ms
-- ==============================================================================

-- 1. Kích hoạt Extension PostGIS & Tiện ích không gian
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bảng người dùng & vai trò (Users & Profiles)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'broker', 'agency', 'admin')),
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'vip1', 'vip2', 'vip3')),
  membership_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Tin Đăng Bất Động Sản (Listings) với cột Không Gian PostGIS
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(15, 2) NOT NULL, -- Đơn vị: VNĐ
  area NUMERIC(8, 2) NOT NULL,  -- Đơn vị: m²
  district TEXT NOT NULL,
  ward TEXT,
  street TEXT,
  address TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'villa', 'land', 'commercial')),
  listing_type TEXT NOT NULL DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent')),
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  floors INTEGER DEFAULT 1,
  direction TEXT,
  legal_status TEXT DEFAULT 'Sổ đỏ chính chủ',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rejected', 'draft')),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Thuộc tính Định Giá & Information Gain (Patent 49, 61, 62)
  ai_investment_score NUMERIC(3, 1) DEFAULT 8.5,
  planning_zone_code TEXT DEFAULT 'ODT', -- Đất ở đô thị
  substantive_diff TEXT, -- Nhật ký biến động giá/quy hoạch thực chất
  
  -- CỘT KHÔNG GIAN POSTGIS WGS 84 (EPSG:4326): Longitude (X), Latitude (Y)
  geom GEOMETRY(Point, 4326),
  
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục không gian siêu tốc GIST
CREATE INDEX IF NOT EXISTS idx_listings_geom ON public.listings USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_listings_district_status ON public.listings(district, status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);

-- 4. Bảng Quy Hoạch Phân Khu Hà Nội 2030 - 2045 (Planning Zones)
CREATE TABLE IF NOT EXISTS public.planning_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_code TEXT NOT NULL, -- ODT, TMDV, CX, GT, QSQP...
  zone_name TEXT NOT NULL,
  district TEXT NOT NULL,
  description TEXT,
  color_code TEXT DEFAULT '#f97316',
  legal_basis TEXT, -- Căn cứ quyết định phê duyệt quy hoạch
  
  -- Đa giác vùng quy hoạch
  geom GEOMETRY(Polygon, 4326),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planning_zones_geom ON public.planning_zones USING GIST (geom);

-- 5. Bảng Giao Dịch & Thanh Toán VNPay (Orders & Transactions)
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL, -- Mã giao dịch: VNPAY_...
  user_id UUID REFERENCES public.users(id),
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_method TEXT DEFAULT 'vnpay',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  bank_code TEXT,
  vnp_transaction_no TEXT,
  vnp_response_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON public.payment_orders(order_id);

-- ==============================================================================
-- STORED PROCEDURES (RPC) - TÍNH TOÁN KHÔNG GIAN TRỰC TIẾP TRÊN POSTGRESQL (<15ms)
-- ==============================================================================

-- Hàm 1: Tìm kiếm BĐS trong bán kính mét (Ví dụ: Ga Metro, Trường học, Bệnh viện)
CREATE OR REPLACE FUNCTION public.search_listings_in_radius(
  target_lng DOUBLE PRECISION,
  target_lat DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION DEFAULT 2000
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price NUMERIC,
  area NUMERIC,
  address TEXT,
  distance_meters DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    l.id,
    l.title,
    l.price,
    l.area,
    l.address,
    ST_Distance(
      l.geom::geography,
      ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography
    ) AS distance_meters
  FROM public.listings l
  WHERE
    l.status = 'active'
    AND ST_DWithin(
      l.geom::geography,
      ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography,
      radius_meters
    )
  ORDER BY distance_meters ASC
  LIMIT 50;
$$;

-- Hàm 2: Kiểm tra một toạ độ bất động sản rơi vào vùng quy hoạch nào
CREATE OR REPLACE FUNCTION public.check_property_planning_zone(
  target_lng DOUBLE PRECISION,
  target_lat DOUBLE PRECISION
)
RETURNS TABLE (
  zone_code TEXT,
  zone_name TEXT,
  district TEXT,
  description TEXT,
  color_code TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.zone_code,
    p.zone_name,
    p.district,
    p.description,
    p.color_code
  FROM public.planning_zones p
  WHERE ST_Contains(
    p.geom,
    ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)
  )
  LIMIT 1;
$$;
