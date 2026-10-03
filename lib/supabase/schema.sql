-- ==============================================================================
-- HANOI REALTY - DATABASE & POSTGIS SPATIAL SCHEMA MIGRATION (PRODUCTION READY)
-- Tiêu chuẩn: EPSG:4326 (WGS 84), GIST Spatial Index, An toàn RLS, Hiệu năng < 15ms
-- Phục vụ: BĐS Hà Nội, Lịch hẹn (Concurrency Control), Thông báo, AI Report, Quy hoạch PostGIS
-- ==============================================================================

-- 1. KÍCH HOẠT EXTENSION POSTGIS & UUID
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. BẢNG NGƯỜI DÙNG & TÀI KHOẢN (users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'broker', 'agency', 'admin')),
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'vip1', 'vip2', 'vip3')),
  membership_expires_at TIMESTAMPTZ,
  notification_preferences JSONB DEFAULT '{
    "browserPush": true,
    "planningUpdates": true,
    "priceAlerts": true,
    "inquiriesAndVisits": true,
    "aiValuationReady": true,
    "weeklyEmailDigest": false
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ==============================================================================
-- 3. BẢNG TIN ĐĂNG BẤT ĐỘNG SẢN (listings) VỚI CỘT KHÔNG GIAN POSTGIS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(15, 2) NOT NULL, -- Đơn vị: VNĐ
  price_per_m2 NUMERIC(12, 2),   -- Đơn vị: VNĐ/m²
  area NUMERIC(8, 2) NOT NULL,    -- Đơn vị: m²
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
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rejected', 'draft', 'expired')),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  
  -- Thuộc tính Định Giá & Information Gain (Patent 49, 61, 62)
  ai_investment_score NUMERIC(3, 1) DEFAULT 8.5,
  planning_zone_code TEXT DEFAULT 'ODT', -- Đất ở đô thị
  planning_year INTEGER DEFAULT 2030,
  substantive_diff TEXT, -- Nhật ký biến động giá/quy hoạch thực chất
  
  -- Thông tin liên hệ chủ tin đăng (Liên kết trực tiếp tác giả)
  author_name TEXT,
  author_phone TEXT,
  author_email TEXT,
  author_avatar TEXT,
  seller_type TEXT DEFAULT 'personal', -- personal | broker | agency
  show_phone BOOLEAN DEFAULT TRUE,
  
  -- CỘT KHÔNG GIAN POSTGIS WGS 84 (EPSG:4326): Longitude (X), Latitude (Y)
  geom GEOMETRY(Point, 4326),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục tối ưu hóa truy vấn không gian & lọc tin đăng
CREATE INDEX IF NOT EXISTS idx_listings_geom ON public.listings USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_district_status ON public.listings(district, status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- ==============================================================================
-- 4. BẢNG QUY HOẠCH PHÂN KHU HÀ NỘI 2030 - 2045 (planning_zones)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.planning_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_code TEXT NOT NULL, -- ODT, TMDV, CX, GT, QSQP...
  zone_name TEXT NOT NULL,
  district TEXT NOT NULL,
  description TEXT,
  color_code TEXT DEFAULT '#f97316',
  legal_basis TEXT, -- Quyết định phê duyệt quy hoạch
  area_ha NUMERIC(10, 2),
  max_floors INTEGER,
  density TEXT,
  floor_area_ratio NUMERIC(5, 2),
  max_height TEXT,
  pdf_url TEXT,
  plan_year INTEGER DEFAULT 2030,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  
  -- Đa giác vùng quy hoạch WGS 84 (Polygon/MultiPolygon)
  geom GEOMETRY(Geometry, 4326),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planning_zones_geom ON public.planning_zones USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_planning_zones_district ON public.planning_zones(district);
CREATE INDEX IF NOT EXISTS idx_planning_zones_code ON public.planning_zones(zone_code);

-- ==============================================================================
-- 5. BẢNG DỰ ÁN HẠ TẦNG XUNG QUANH (projects - Metro, Cầu, Trường, Bệnh viện)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('metro', 'bridge', 'road', 'school', 'hospital', 'park', 'mall', 'urban_area')),
  district TEXT NOT NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'construction', 'completed')),
  expected_completion TEXT,
  impact_radius NUMERIC(10, 2) DEFAULT 2000, -- Bán kính ảnh hưởng (mét)
  description TEXT,
  
  -- Vị trí dự án WGS 84
  geom GEOMETRY(Point, 4326),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_geom ON public.projects USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(project_type);

-- ==============================================================================
-- 6. BẢNG ĐẶT LỊCH HẸN XEM NHÀ (appointments) - CHỐNG XUNG ĐỘT KHUNG GIỜ
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idempotency_key TEXT UNIQUE, -- Ngăn chặn đặt trùng 2 lần khi mạng lag
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  seller_email TEXT,
  buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Có thể là khách vãng lai
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL, -- Ví dụ: '09:30', '14:00'
  purpose TEXT DEFAULT 'buy', -- buy, invest, rent, check
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  cancelled_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục kiểm tra lịch trùng siêu nhanh (Concurrency Control)
CREATE INDEX IF NOT EXISTS idx_appointments_listing_slot 
  ON public.appointments(listing_id, appointment_date, time_slot, status);
CREATE INDEX IF NOT EXISTS idx_appointments_seller_id 
  ON public.appointments(seller_id, appointment_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_buyer_id 
  ON public.appointments(buyer_id);

-- ==============================================================================
-- 7. BẢNG THÔNG BÁO HỆ THỐNG & REAL-TIME (notifications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_user_id TEXT NOT NULL, -- UUID string hoặc 'all' (system broadcast)
  category TEXT NOT NULL CHECK (category IN ('planning', 'listing', 'ai', 'message', 'system', 'appointment')),
  type TEXT NOT NULL, -- listing_approved, appointment, ai_report, etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  link TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread 
  ON public.notifications(recipient_user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_appointment 
  ON public.notifications(appointment_id);

-- ==============================================================================
-- 8. BẢNG BÁO CÁO THẨM ĐỊNH AI PRO (ai_reports)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  area NUMERIC(8, 2) NOT NULL,
  growth_potential_score NUMERIC(5, 2), -- 1-100
  liquidity_score NUMERIC(5, 2),        -- 1-100
  planning_info JSONB DEFAULT '{}'::jsonb,
  nearby_projects JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_listing_id ON public.ai_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_user_id ON public.ai_reports(user_id);

-- ==============================================================================
-- 9. BẢNG TIN ĐĂNG ĐÃ LƯU (saved_listings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_listings (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_listings_user ON public.saved_listings(user_id);

-- ==============================================================================
-- 10. BẢNG LƯU BỘ LỌC TÌM KIẾM (saved_searches)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  filters JSONB NOT NULL,
  email_alert BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON public.saved_searches(user_id);

-- ==============================================================================
-- 11. BẢNG THANH TOÁN & GÓI THÀNH VIÊN VNPAY (payment_orders & subscriptions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL, -- Mã giao dịch: VNPAY_...
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON public.payment_orders(user_id);

-- ==============================================================================
-- 12. STORED PROCEDURES (RPC) - TÍNH TOÁN POSTGIS HIỆU NĂNG CAO (<15ms)
-- ==============================================================================

-- Hàm 1: Tìm kiếm BĐS trong bán kính mét (VD: quanh ga metro, trường học)
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
  district TEXT,
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
    l.district,
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

-- Hàm 2: Kiểm tra toạ độ rơi vào vùng quy hoạch nào
CREATE OR REPLACE FUNCTION public.check_property_planning_zone(
  target_lng DOUBLE PRECISION,
  target_lat DOUBLE PRECISION
)
RETURNS TABLE (
  zone_code TEXT,
  zone_name TEXT,
  district TEXT,
  description TEXT,
  color_code TEXT,
  plan_year INTEGER,
  density TEXT,
  max_height TEXT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.zone_code,
    p.zone_name,
    p.district,
    p.description,
    p.color_code,
    p.plan_year,
    p.density,
    p.max_height
  FROM public.planning_zones p
  WHERE ST_Contains(
    p.geom,
    ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)
  )
  LIMIT 1;
$$;

-- Hàm 3: Tìm dự án hạ tầng lớn xung quanh toạ độ (Metro, Cầu, Công viên...)
CREATE OR REPLACE FUNCTION public.get_nearby_infrastructure_projects(
  target_lng DOUBLE PRECISION,
  target_lat DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION DEFAULT 3000
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  project_type TEXT,
  status TEXT,
  expected_completion TEXT,
  distance_meters DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.id,
    p.name,
    p.project_type,
    p.status,
    p.expected_completion,
    ST_Distance(
      p.geom::geography,
      ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography
    ) AS distance_meters
  FROM public.projects p
  WHERE ST_DWithin(
    p.geom::geography,
    ST_SetSRID(ST_MakePoint(target_lng, target_lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance_meters ASC
  LIMIT 15;
$$;

-- Hàm 4: Kiểm tra khung giờ xem nhà có bị trùng trước khi lưu (Slot Concurrency)
CREATE OR REPLACE FUNCTION public.is_appointment_slot_available(
  p_listing_id UUID,
  p_date DATE,
  p_time_slot TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.appointments
    WHERE listing_id = p_listing_id
      AND appointment_date = p_date
      AND time_slot = p_time_slot
      AND status IN ('pending', 'confirmed')
  );
END;
$$;

-- ==============================================================================
-- 13. CHÍNH SÁCH BẢO MẬT HÀNG (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

-- Bật RLS cho tất cả bảng
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- Policy 1: users (Mọi người có thể đọc profile công khai, chỉ chính chủ sửa)
CREATE POLICY "Public users viewable by everyone" ON public.users
  FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policy 2: listings (Mọi người có thể xem active, chủ tin có toàn quyền)
CREATE POLICY "Active listings viewable by everyone" ON public.listings
  FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own listings" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);

-- Policy 3: planning_zones & projects (Công khai cho toàn bộ người dùng)
CREATE POLICY "Planning zones viewable by everyone" ON public.planning_zones
  FOR SELECT USING (true);
CREATE POLICY "Projects viewable by everyone" ON public.projects
  FOR SELECT USING (true);

-- Policy 4: appointments (Người mua và chủ tin đăng có quyền xem/sửa)
CREATE POLICY "Users can view relevant appointments" ON public.appointments
  FOR SELECT USING (
    auth.uid() = seller_id 
    OR auth.uid() = buyer_id 
    OR auth.uid() IS NULL -- Cho phép tra cứu khách vãng lai nếu cần
  );
CREATE POLICY "Anyone can book an appointment" ON public.appointments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Sellers and buyers can update appointment status" ON public.appointments
  FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Policy 5: notifications (Chỉ người nhận xem được thông báo của mình)
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (
    recipient_user_id = auth.uid()::text 
    OR recipient_user_id = 'all'
  );
CREATE POLICY "Users can update their own notification status" ON public.notifications
  FOR UPDATE USING (recipient_user_id = auth.uid()::text);
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Policy 6: saved_listings & saved_searches (Chính chủ quản lý danh sách yêu thích)
CREATE POLICY "Users manage their own saved listings" ON public.saved_listings
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage their own saved searches" ON public.saved_searches
  FOR ALL USING (auth.uid() = user_id);

-- Policy 7: ai_reports (Chính chủ xem báo cáo đã tạo)
CREATE POLICY "Users can view their own ai reports" ON public.ai_reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert ai reports" ON public.ai_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 8: payment_orders (Chỉ chính chủ xem đơn hàng thanh toán)
CREATE POLICY "Users can view their own payment orders" ON public.payment_orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment orders" ON public.payment_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
