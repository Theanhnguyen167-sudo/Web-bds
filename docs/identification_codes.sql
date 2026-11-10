-- ============================================================================
-- HANOI REALTY — MÃ ĐỊNH DANH HỆ THỐNG (4 MÃ CHUẨN)
-- 1. BDS-00125: Mã căn nhà (Listings)
-- 2. MG-00102:  Mã CTV / TPKD / Môi giới (Users - Agent & Referral Code)
-- 3. CN-00086:  Mã Chủ nhà BĐS (Users - Owner Code)
-- 4. HD-00035:  Mã hợp đồng (Contracts / Deals)
-- ============================================================================

-- 1. Khởi tạo Sequences cho 4 loại mã với bước khởi đầu chuẩn
CREATE SEQUENCE IF NOT EXISTS seq_bds_code START WITH 125 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_mg_code  START WITH 102 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_cn_code  START WITH 86  INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS seq_hd_code  START WITH 35  INCREMENT BY 1;

-- 2. Bổ sung các cột định danh vào bảng public.listings
ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS listing_code VARCHAR(20) UNIQUE;

-- Function & Trigger tự sinh mã BDS-XXXXX cho tin đăng BĐS mới
CREATE OR REPLACE FUNCTION public.fn_generate_listing_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.listing_code IS NULL OR TRIM(NEW.listing_code) = '' THEN
    NEW.listing_code := 'BDS-' || LPAD(nextval('seq_bds_code')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_listing_code ON public.listings;
CREATE TRIGGER trg_generate_listing_code
  BEFORE INSERT ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_generate_listing_code();

-- Gán mã BDS cho các tin đăng hiện có chưa có mã
UPDATE public.listings
SET listing_code = 'BDS-' || LPAD(nextval('seq_bds_code')::TEXT, 5, '0')
WHERE listing_code IS NULL;

-- 3. Bổ sung các cột định danh vào bảng public.users
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS agent_code VARCHAR(20) UNIQUE,
  ADD COLUMN IF NOT EXISTS owner_code VARCHAR(20) UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by_agent_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS referred_at TIMESTAMPTZ DEFAULT NOW();

-- Index tra cứu nhanh mã giới thiệu & mã căn nhà
CREATE INDEX IF NOT EXISTS idx_users_agent_code ON public.users(agent_code);
CREATE INDEX IF NOT EXISTS idx_users_owner_code ON public.users(owner_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by_agent_code);
CREATE INDEX IF NOT EXISTS idx_listings_code ON public.listings(listing_code);

-- Function & Trigger tự sinh mã MG-XXXXX và CN-XXXXX cho users
-- Đảm bảo: 1 user có thể có CẢ HAI mã (vừa là chủ nhà vừa là CTV)
-- Đổi gói / nâng cấp CTV lên TPKD không bao giờ đổi mã!
CREATE OR REPLACE FUNCTION public.fn_assign_user_identity_codes()
RETURNS TRIGGER AS $$
DECLARE
  biz_role TEXT;
BEGIN
  -- Lấy business_role từ notification_preferences nếu có
  biz_role := COALESCE(
    (NEW.notification_preferences->>'business_role'),
    NEW.role::TEXT,
    'buyer'
  );

  -- 1. Nếu là CTV / Môi giới (hoặc TPKD) và chưa có agent_code
  IF (biz_role IN ('agent', 'broker', 'agency') OR NEW.role::TEXT = 'agent') AND (NEW.agent_code IS NULL OR TRIM(NEW.agent_code) = '') THEN
    NEW.agent_code := 'MG-' || LPAD(nextval('seq_mg_code')::TEXT, 5, '0');
  END IF;

  -- 2. Nếu là Chủ nhà và chưa có owner_code
  IF (biz_role = 'owner') AND (NEW.owner_code IS NULL OR TRIM(NEW.owner_code) = '') THEN
    NEW.owner_code := 'CN-' || LPAD(nextval('seq_cn_code')::TEXT, 5, '0');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assign_user_identity_codes ON public.users;
CREATE TRIGGER trg_assign_user_identity_codes
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_assign_user_identity_codes();

-- 4. Bảng Hợp Đồng (Contracts) với mã HD-XXXXX tự sinh
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_code VARCHAR(20) UNIQUE NOT NULL DEFAULT ('HD-' || LPAD(nextval('seq_hd_code')::TEXT, 5, '0')),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  listing_code VARCHAR(20),
  buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  agent_code VARCHAR(20),
  contract_type VARCHAR(50) DEFAULT 'deposit', -- 'deposit' | 'sale' | 'lease'
  deposit_amount NUMERIC(15, 2) DEFAULT 0,
  total_value NUMERIC(15, 2) DEFAULT 0,
  status VARCHAR(30) DEFAULT 'active', -- 'draft' | 'active' | 'completed' | 'cancelled'
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_code ON public.contracts(contract_code);
CREATE INDEX IF NOT EXISTS idx_contracts_listing_code ON public.contracts(listing_code);

-- Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contracts_updated_at ON public.contracts;
CREATE TRIGGER trg_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_set_updated_at();

-- 5. RLS (Row Level Security) bảo vệ: Không cho phép client tự sửa mã của mình
-- Mã là duy nhất, cố định và do hệ thống quản lý.

-- 6. Bảng Lịch hẹn xem nhà (Appointments) lưu vết mã căn BDS và mã Môi giới giới thiệu
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung các cột định danh vào bảng appointments (trường hợp bảng đã có sẵn từ trước)
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS listing_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS buyer_name TEXT,
  ADD COLUMN IF NOT EXISTS buyer_phone TEXT,
  ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS broker_referral_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS appointment_date DATE,
  ADD COLUMN IF NOT EXISTS appointment_time VARCHAR(20),
  ADD COLUMN IF NOT EXISTS purpose TEXT,
  ADD COLUMN IF NOT EXISTS note TEXT,
  ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'pending';

CREATE INDEX IF NOT EXISTS idx_appointments_broker_ref ON public.appointments(broker_referral_code);
CREATE INDEX IF NOT EXISTS idx_appointments_listing_code ON public.appointments(listing_code);

-- 7. Bảng Tài khoản ngân hàng người dùng (User Bank Accounts)
CREATE TABLE IF NOT EXISTS public.user_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  bank_code VARCHAR(20),
  account_number VARCHAR(50) NOT NULL,
  account_holder TEXT NOT NULL,
  branch TEXT,
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Giao dịch tài chính (Financial Transactions) lưu vết thu/chi, hoa hồng, cọc escrow
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_code VARCHAR(30) UNIQUE NOT NULL,
  contract_code VARCHAR(20),
  listing_code VARCHAR(20),
  payer_code VARCHAR(20),
  payer_name TEXT NOT NULL,
  receiver_code VARCHAR(20),
  receiver_name TEXT NOT NULL,
  category VARCHAR(30) NOT NULL,
  gross_amount NUMERIC(15, 2) NOT NULL,
  deduction_fee NUMERIC(15, 2) DEFAULT 0,
  net_amount NUMERIC(15, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending_payment',
  escrow_bank_name TEXT,
  beneficiary_bank TEXT,
  beneficiary_account VARCHAR(50),
  beneficiary_name TEXT,
  transfer_syntax TEXT,
  release_conditions TEXT,
  proof_image_url TEXT,
  admin_notes TEXT,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_contract ON public.financial_transactions(contract_code);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON public.financial_transactions(listing_code);
CREATE INDEX IF NOT EXISTS idx_transactions_payer ON public.financial_transactions(payer_code);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver ON public.financial_transactions(receiver_code);

