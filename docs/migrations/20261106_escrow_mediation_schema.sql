-- =====================================================================================
-- 🏛️ HANOI REALTY - MÔ HÌNH SÀN ĐIỀU PHỐI TRUNG GIAN & KÝ QUỸ NGÂN HÀNG (ESCROW)
-- MIGRATION: 20261106_escrow_mediation_schema.sql
-- 1. Mô hình thành viên 2 cấp (CTV & Trưởng phòng)
-- 2. Cơ chế Ba Mã chống giao dịch ngoài: Member ID - Property ID - Transaction ID
-- 3. Hồ sơ Deal, Tài khoản phong tỏa Ngân hàng & Giải ngân theo Mốc (Milestones)
-- 4. Phân chia hoa hồng đa tầng (Nguồn khách + Chốt deal + Trưởng phòng + Phí sàn)
-- =====================================================================================

-- 1. ENUMS KHỞI TẠO
DO $$ BEGIN
  CREATE TYPE broker_tier AS ENUM ('ctv', 'sales_director', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('unverified', 'in_review', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM (
    'draft',
    'offer_accepted',
    'deposit_pending',
    'escrow_locked',
    'notarized',
    'handover_completed',
    'settled',
    'disputed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status AS ENUM (
    'waiting_deposit',
    'funds_locked',
    'partially_released',
    'fully_released',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE milestone_code AS ENUM (
    'deposit',
    'notarization',
    'tax_and_title',
    'handover_settlement'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. CẬP NHẬT BẢNG PROFILES (Mô hình thành viên & Member ID)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS member_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS broker_tier broker_tier DEFAULT 'ctv',
  ADD COLUMN IF NOT EXISTS team_name TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_member_id ON public.profiles(member_id);
CREATE INDEX IF NOT EXISTS idx_profiles_leader_id ON public.profiles(leader_id);

-- 3. CẬP NHẬT BẢNG LISTINGS (Property ID & Xác minh nguồn hàng)
ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS property_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS legal_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(4, 2) DEFAULT 2.0,
  ADD COLUMN IF NOT EXISTS exclusive_contract BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_listings_property_code ON public.listings(property_code);
CREATE INDEX IF NOT EXISTS idx_listings_verification_status ON public.listings(verification_status);

-- 4. BẢNG KHÓA LEAD KHÁCH HÀNG & RÀNG BUỘC BA MÃ (Anti-bypass Customer Lead Binding)
CREATE TABLE IF NOT EXISTS public.customer_lead_bindings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id TEXT NOT NULL,                     -- Mã Member ID của CTV
  broker_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_code TEXT NOT NULL,                 -- Mã Property ID của BĐS
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  transaction_code TEXT,                       -- Transaction ID khi phát sinh deal
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  source_channel TEXT DEFAULT 'direct',        -- 'facebook', 'zalo', 'referral', 'direct'
  is_owner_confirmed BOOLEAN DEFAULT FALSE,    -- Chủ nhà xác nhận qua SMS/OTP/App
  owner_confirmed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'deal_created')),
  expires_at TIMESTAMPTZ NOT NULL,             -- Mặc định 60 ngày kể từ lúc ghi nhận
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_member_property ON public.customer_lead_bindings(member_id, property_code);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.customer_lead_bindings(customer_phone);

-- 5. BẢNG BẰNG CHỨNG DẪN XEM NHÀ (Proof of Viewing - Chống cắt cầu thực địa)
CREATE TABLE IF NOT EXISTS public.viewing_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  broker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  checkin_location GEOGRAPHY(POINT, 4326),     -- Toạ độ GPS thực tế của Môi giới khi đến xem
  checkin_address TEXT,
  proof_photos TEXT[] DEFAULT ARRAY[]::TEXT[], -- Ảnh chụp thực tế căn nhà / biên bản ký
  notes TEXT,
  is_verified_by_seller BOOLEAN DEFAULT FALSE, -- Chủ nhà xác nhận môi giới đã dẫn khách tới
  seller_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_viewing_proofs_listing ON public.viewing_proofs(listing_id);
CREATE INDEX IF NOT EXISTS idx_viewing_proofs_broker ON public.viewing_proofs(broker_id);
CREATE INDEX IF NOT EXISTS idx_viewing_proofs_location ON public.viewing_proofs USING GIST(checkin_location);

-- 6. BẢNG HỒ SƠ GIAO DỊCH TRUNG GIAN (Deals)
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,                   -- Transaction ID: HR-TXN-2026-XXXXX
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  property_code TEXT,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  
  -- Nhân sự tham gia
  broker_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  lead_generator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  closer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  team_leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  agreed_price BIGINT NOT NULL,                -- Giá chốt giao dịch (VNĐ)
  deposit_amount BIGINT NOT NULL,              -- Số tiền cọc cần phong tỏa (VNĐ)
  commission_total BIGINT NOT NULL,            -- Tổng hoa hồng (VNĐ)
  platform_fee BIGINT NOT NULL,                -- Phí sàn Hanoi Realty (VNĐ)
  broker_commission BIGINT NOT NULL,           -- Tổng hoa hồng trả cho đội ngũ môi giới
  
  status deal_status DEFAULT 'deposit_pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_code ON public.deals(code);
CREATE INDEX IF NOT EXISTS idx_deals_listing ON public.deals(listing_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller ON public.deals(seller_id);
CREATE INDEX IF NOT EXISTS idx_deals_buyer ON public.deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_broker ON public.deals(broker_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);

-- 7. TÀI KHOẢN PHONG TỎA / KÝ QUỸ NGÂN HÀNG (Escrow Accounts)
CREATE TABLE IF NOT EXISTS public.escrow_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL UNIQUE REFERENCES public.deals(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,                     -- 'Vietcombank', 'BIDV', 'Techcombank'
  virtual_account_no TEXT NOT NULL,            -- Số tài khoản định danh phong tỏa
  account_holder_name TEXT NOT NULL,
  total_locked_amount BIGINT DEFAULT 0,        -- Số dư đang phong tỏa
  status escrow_status DEFAULT 'waiting_deposit',
  bank_reference_id TEXT,                      -- Mã đối soát ngân hàng
  locked_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrow_deal ON public.escrow_accounts(deal_id);
CREATE INDEX IF NOT EXISTS idx_escrow_va ON public.escrow_accounts(virtual_account_no);

-- 8. CÁC MỐC GIẢI NGÂN CÓ ĐIỀU KIỆN (Deal Milestones - Multi-party Approval)
CREATE TABLE IF NOT EXISTS public.deal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  milestone milestone_code NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  percentage INT NOT NULL,                     -- % giải ngân (VD: Cọc 10%, Công chứng 80%, Bàn giao 10%)
  amount BIGINT NOT NULL,
  
  -- Xác nhận 3 bên
  buyer_approved BOOLEAN DEFAULT FALSE,
  buyer_approved_at TIMESTAMPTZ,
  
  seller_approved BOOLEAN DEFAULT FALSE,
  seller_approved_at TIMESTAMPTZ,
  
  platform_verified BOOLEAN DEFAULT FALSE,
  platform_verified_by UUID REFERENCES public.profiles(id),
  platform_verified_at TIMESTAMPTZ,
  
  -- Kết quả chi từ Ngân hàng
  is_disbursed BOOLEAN DEFAULT FALSE,
  disbursed_at TIMESTAMPTZ,
  disbursement_proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_deal ON public.deal_milestones(deal_id);

-- 9. BẢNG PHÂN CHIA HOA HỒNG CHI TIẾT (Deal Commissions)
CREATE TABLE IF NOT EXISTS public.deal_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL UNIQUE REFERENCES public.deals(id) ON DELETE CASCADE,
  
  -- 1. Người tạo nguồn khách
  lead_generator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  lead_generator_commission BIGINT DEFAULT 0,
  
  -- 2. Người trực tiếp chốt giao dịch
  closer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  closer_commission BIGINT DEFAULT 0,
  
  -- 3. Trưởng phòng kinh doanh quản lý
  team_leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  team_leader_commission BIGINT DEFAULT 0,
  
  -- 4. Phí dịch vụ sàn Hanoi Realty
  platform_fee BIGINT DEFAULT 0,
  
  total_commission BIGINT NOT NULL,
  is_settled BOOLEAN DEFAULT FALSE,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_deal ON public.deal_commissions(deal_id);
CREATE INDEX IF NOT EXISTS idx_commissions_lead_gen ON public.deal_commissions(lead_generator_id);
CREATE INDEX IF NOT EXISTS idx_commissions_closer ON public.deal_commissions(closer_id);
CREATE INDEX IF NOT EXISTS idx_commissions_leader ON public.deal_commissions(team_leader_id);

-- 10. NHẬT KÝ ĐỐI SOÁT BẤT BIẾN (Deal Audit Logs)
CREATE TABLE IF NOT EXISTS public.deal_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_deal ON public.deal_audit_logs(deal_id);

-- =====================================================================================
-- 🔒 BẬT ROW LEVEL SECURITY (RLS) VÀ PHÂN QUYỀN TRUY CẬP CHẶT CHẼ
-- =====================================================================================
ALTER TABLE public.customer_lead_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewing_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy Deals: Các bên liên quan (Buyer, Seller, Broker, Closer, LeadGen, Leader, Admin) mới được xem
CREATE POLICY "Deal parties can view own deal" ON public.deals
  FOR SELECT USING (
    auth.uid() = seller_id OR
    auth.uid() = buyer_id OR
    auth.uid() = broker_id OR
    auth.uid() = lead_generator_id OR
    auth.uid() = closer_id OR
    auth.uid() = team_leader_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy Escrow: Chỉ các bên trong deal hoặc Admin mới được xem tài khoản phong tỏa
CREATE POLICY "Deal parties can view escrow info" ON public.escrow_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.deals d 
      WHERE d.id = public.escrow_accounts.deal_id 
      AND (
        d.seller_id = auth.uid() OR 
        d.buyer_id = auth.uid() OR 
        d.broker_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Policy Milestones: Xem và cập nhật trạng thái đồng thuận
CREATE POLICY "Deal parties can view milestones" ON public.deal_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.deals d 
      WHERE d.id = public.deal_milestones.deal_id 
      AND (
        d.seller_id = auth.uid() OR 
        d.buyer_id = auth.uid() OR 
        d.broker_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Policy Viewing Proofs: Môi giới xem bằng chứng mình lập, Chủ nhà xem bằng chứng nhà mình
CREATE POLICY "Broker and seller can view viewing proofs" ON public.viewing_proofs
  FOR SELECT USING (
    broker_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.listings l WHERE l.id = public.viewing_proofs.listing_id AND l.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Brokers can insert viewing proofs" ON public.viewing_proofs
  FOR INSERT WITH CHECK (broker_id = auth.uid());

-- 11. BẢNG HỢP ĐỒNG ĐIỆN TỬ SỐ HÓA (E-Contracts)
CREATE TYPE contract_type AS ENUM (
  'ctv_agreement',
  'sales_director_agreement',
  'seller_service_agreement',
  'buyer_terms_agreement'
);

CREATE TYPE contract_status AS ENUM (
  'draft',
  'pending_signature',
  'active',
  'expired',
  'terminated'
);

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_code TEXT UNIQUE NOT NULL,          -- VD: HR-CTR-CTV-2026-XXXX, HR-CTR-SELLER-XXXX
  contract_type contract_type NOT NULL,
  title TEXT NOT NULL,
  platform_representative_id UUID REFERENCES public.profiles(id),
  party_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  party_b_member_id TEXT,                      -- Member ID (nếu là CTV / TPKD)
  property_code TEXT,                          -- Property ID (nếu là HĐ Ký gửi Chủ nhà)
  
  terms_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  is_signed BOOLEAN DEFAULT FALSE,
  signed_at TIMESTAMPTZ,
  signature_hash TEXT,                         -- Mã băm chứng thực chữ ký số / OTP
  signer_ip TEXT,
  signer_user_agent TEXT,
  
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  status contract_status DEFAULT 'pending_signature',
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_code ON public.contracts(contract_code);
CREATE INDEX IF NOT EXISTS idx_contracts_party_b ON public.contracts(party_b_id);
CREATE INDEX IF NOT EXISTS idx_contracts_type ON public.contracts(contract_type);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contracts" ON public.contracts
  FOR SELECT USING (
    party_b_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 12. SEED CẤU HÌNH GÓI THÀNH VIÊN MỚI (CTV, TPKD Started, TPKD Professional)
INSERT INTO public.packages (id, name, price_monthly, price_yearly, max_listings, listing_duration_days, featured_listings_count, has_ai_report, max_ai_reports_monthly, has_export_pdf, description, features)
VALUES 
('ctv', 'Gói CTV', 189000, 1890000, 0, 30, 0, false, 0, false, 'Dành cho cá nhân môi giới độc lập', '["Tạo hồ sơ CTV & nhận Member ID riêng", "Xem kho BĐS được phép chia sẻ", "Gửi thông tin khách hàng (Khóa Lead 3 Mã)", "Theo dõi trạng thái khách và giao dịch", "Nhận 50% hoa hồng khi giao dịch thành công"]'::jsonb),
('tpkd_started', 'TPKD Started', 299000, 2990000, 10, 30, 2, true, 5, true, 'Dành cho trưởng nhóm xây dựng đội sale', '["Quản lý tối đa 5 CTV trong nhóm", "Đăng tin BĐS (Hạn mức dưới 10 bài)", "Quản lý khách hàng và nguồn hàng của nhóm", "Theo dõi hiệu suất đội nhóm & Báo cáo hoa hồng", "Nhận 15% hoa hồng quản lý"]'::jsonb),
('tpkd_professional', 'TPKD Professional', 499000, 4990000, 35, 60, 10, true, 20, true, 'Dành cho sàn nhánh hoặc đội ngũ quy mô', '["Quản lý tối đa 15 CTV trong nhóm", "Hạn mức đăng tin cao hơn (35 bài)", "Quản lý và tự động phân phối khách cho CTV", "Báo cáo KPI chi tiết từng CTV", "Dashboard doanh thu nhóm & phòng realtime", "Nhận 15% hoa hồng quản lý"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  max_listings = EXCLUDED.max_listings,
  description = EXCLUDED.description,
  features = EXCLUDED.features;


