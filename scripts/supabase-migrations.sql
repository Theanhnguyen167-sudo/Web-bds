-- =========================================================
-- 🏛️ HANOI PROPTECH PLATFORM - SUPABASE POSTGIS MIGRATIONS
-- =========================================================

-- 1. Enable PostGIS & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Custom ENUM Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE property_type_enum AS ENUM ('house', 'apartment', 'land', 'villa');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE listing_status_enum AS ENUM ('pending', 'active', 'expired', 'sold');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status_enum AS ENUM ('active', 'expired', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending', 'success', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE project_status_enum AS ENUM ('planning', 'construction', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Create Tables

-- USERS Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- PACKAGES Table
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly BIGINT NOT NULL,
  price_yearly BIGINT NOT NULL,
  max_listings INT NOT NULL DEFAULT 3,
  has_ai_report BOOLEAN NOT NULL DEFAULT false,
  has_featured BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  features JSONB DEFAULT '{}'::jsonb
);

-- PAYMENTS Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'VND',
  vnpay_txn_ref TEXT UNIQUE,
  vnpay_response_code TEXT,
  status payment_status_enum NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- SUBSCRIPTIONS Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL REFERENCES public.packages(id),
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  end_date TIMESTAMPTZ NOT NULL,
  status subscription_status_enum NOT NULL DEFAULT 'active',
  payment_id UUID REFERENCES public.payments(id)
);

-- LISTINGS Table (with PostGIS Point)
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type_enum NOT NULL,
  price BIGINT NOT NULL,
  area NUMERIC(10, 2) NOT NULL,
  price_per_m2 NUMERIC(12, 2) NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  ward TEXT,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  images TEXT[] DEFAULT '{}',
  status listing_status_enum NOT NULL DEFAULT 'active',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMPTZ
);

-- PLANNING ZONES Table (with PostGIS Polygon)
CREATE TABLE IF NOT EXISTS public.planning_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL,
  plan_year INT NOT NULL DEFAULT 2030,
  district TEXT NOT NULL,
  boundary GEOGRAPHY(Polygon, 4326) NOT NULL,
  description TEXT,
  source_url TEXT,
  color_code TEXT DEFAULT '#3b82f6'
);

-- PROJECTS Table (Infrastructure / Metro / Parks)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  status project_status_enum NOT NULL DEFAULT 'planning',
  expected_completion TEXT,
  impact_radius INT DEFAULT 2000,
  description TEXT
);

-- AI REPORTS Table
CREATE TABLE IF NOT EXISTS public.ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  planning_info JSONB DEFAULT '{}'::jsonb,
  development_potential NUMERIC(5, 2),
  nearby_projects JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  pdf_url TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- SAVED LISTINGS Table
CREATE TABLE IF NOT EXISTS public.saved_listings (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, listing_id)
);

-- 4. Spatial Indexes for PostGIS Performance
CREATE INDEX IF NOT EXISTS listings_location_idx ON public.listings USING GIST (location);
CREATE INDEX IF NOT EXISTS planning_zones_boundary_idx ON public.planning_zones USING GIST (boundary);
CREATE INDEX IF NOT EXISTS projects_location_idx ON public.projects USING GIST (location);

-- 5. Row Level Security (RLS) Policies

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public users profile readable" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active listings" ON public.listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users manage own listings" ON public.listings FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved" ON public.saved_listings FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own ai reports" ON public.ai_reports FOR SELECT USING (auth.uid() = user_id);

-- 6. PostGIS Spatial Functions & Helpers

-- A. Get nearby listings within radius (meters)
CREATE OR REPLACE FUNCTION get_nearby_listings(
  lat FLOAT, lng FLOAT, radius_meters INT DEFAULT 2000
) RETURNS SETOF public.listings AS $$
  SELECT * FROM public.listings
  WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  ) AND status = 'active'
  ORDER BY ST_Distance(location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) ASC;
$$ LANGUAGE sql STABLE;

-- B. Get planning zone at coordinate point
CREATE OR REPLACE FUNCTION get_planning_zone_at_point(
  lat FLOAT, lng FLOAT
) RETURNS SETOF public.planning_zones AS $$
  SELECT * FROM public.planning_zones
  WHERE ST_Contains(
    boundary::geometry,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)
  );
$$ LANGUAGE sql STABLE;

-- C. Get infrastructure projects near coordinate point
CREATE OR REPLACE FUNCTION get_projects_nearby(
  lat FLOAT, lng FLOAT, radius_meters INT DEFAULT 2000
) RETURNS SETOF public.projects AS $$
  SELECT * FROM public.projects
  WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  );
$$ LANGUAGE sql STABLE;

-- D. Increment listing view count safely
CREATE OR REPLACE FUNCTION increment_views(listing_id UUID)
RETURNS void AS $$
  UPDATE public.listings SET views = views + 1 WHERE id = listing_id;
$$ LANGUAGE sql VOLATILE;

-- 7. Supabase Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('listing-images', 'listing-images', true),
  ('avatars', 'avatars', true),
  ('ai-reports-pdf', 'ai-reports-pdf', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Read Listing Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated Upload Listing Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public Read Avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated Upload Avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
