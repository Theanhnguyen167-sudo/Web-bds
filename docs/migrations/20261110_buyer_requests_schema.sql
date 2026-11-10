-- ============================================================================
-- MIGRATION: BẢNG TIẾP NHẬN NHU CẦU MUA BĐS (BUYER REQUESTS)
-- Dự án: HaNoi Realty (Hanoi PropTech Platform)
-- Ngày tạo: 10/11/2026
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.buyer_requests (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Tiêu chí BĐS
    purpose TEXT NOT NULL DEFAULT 'living',
    property_types TEXT[] NOT NULL DEFAULT ARRAY['house']::TEXT[],
    target_districts TEXT[] NOT NULL DEFAULT ARRAY['Hà Nội']::TEXT[],
    budget_min BIGINT NOT NULL DEFAULT 0,
    budget_max BIGINT NOT NULL DEFAULT 0,
    min_area NUMERIC,
    min_bedrooms INTEGER,
    preferred_directions TEXT[],
    car_access BOOLEAN DEFAULT FALSE,
    
    -- Phương thức hỗ trợ & tiến độ
    support_type TEXT DEFAULT 'connect_ctv',
    referral_code TEXT,
    urgency TEXT DEFAULT 'within_1_month',
    needs_loan_support BOOLEAN DEFAULT FALSE,
    notes TEXT,
    
    -- Thông tin người mua liên hệ
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    preferred_contact_time TEXT DEFAULT 'Bất kỳ lúc nào',
    
    -- Trạng thái & điều phối
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' (Chờ xử lý), 'contacted', 'matched', 'completed', 'cancelled'
    assigned_agent_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_buyer_requests_user_id ON public.buyer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_code ON public.buyer_requests(code);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_status ON public.buyer_requests(status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_created_at ON public.buyer_requests(created_at DESC);

-- Bật Row Level Security (RLS)
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;

-- 1. Người mua chỉ xem được yêu cầu của chính mình
CREATE POLICY "buyer_requests_select_own" ON public.buyer_requests
    FOR SELECT
    USING (
        auth.uid()::text = user_id 
        OR (SELECT role FROM public.users WHERE id = auth.uid()::text) IN ('admin', 'staff', 'agent')
    );

-- 2. Người dùng đã đăng nhập có thể gửi yêu cầu của mình
CREATE POLICY "buyer_requests_insert_own" ON public.buyer_requests
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- 3. Người mua có thể sửa/hủy yêu cầu của mình; Quản trị viên và CTV phụ trách có thể cập nhật trạng thái
CREATE POLICY "buyer_requests_update" ON public.buyer_requests
    FOR UPDATE
    USING (
        auth.uid()::text = user_id 
        OR (SELECT role FROM public.users WHERE id = auth.uid()::text) IN ('admin', 'staff', 'agent')
    );

