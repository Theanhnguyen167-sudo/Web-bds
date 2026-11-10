/**
 * 🏛️ HANOI REALTY - BUYER REQUEST SERVICE (SINGLE SOURCE OF TRUTH)
 * ==============================================================================
 * Quản lý vòng đời Yêu Cầu Tìm Mua BĐS (Buyer Requests):
 * - Người mua gửi yêu cầu thật (vào Supabase + server store)
 * - Người mua xem danh sách yêu cầu của chính mình và trạng thái "Chờ xử lý"
 * - Nhân sự vận hành (Admin / Môi giới / Staff) tiếp nhận toàn bộ yêu cầu và xử lý
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { BuyerRequest, CreateBuyerRequestDTO, BuyerRequestStatus } from '@/types/buyer-request';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'buyer-requests.json');

// Initial seed data for demonstration if empty
const INITIAL_SEED_REQUESTS: BuyerRequest[] = [
  {
    id: 'req_seed_001',
    code: 'HR-REQ-2026-1001',
    user_id: 'buyer_demo_01',
    purpose: 'living',
    property_types: ['house'],
    target_districts: ['Cầu Giấy', 'Đống Đa'],
    budget_min: 4_500_000_000,
    budget_max: 6_500_000_000,
    min_area: 45,
    min_bedrooms: 3,
    preferred_directions: ['Đông Nam', 'Nam'],
    car_access: true,
    urgency: 'within_1_month',
    support_type: 'connect_ctv',
    needs_loan_support: false,
    notes: 'Ưu tiên nhà gần trường Cầu Giấy, ngõ nông thông thoáng.',
    contact_name: 'Nguyễn Hải Đăng',
    contact_phone: '0912 345 678',
    contact_email: 'haidang.nguyen@gmail.com',
    preferred_contact_time: 'Sau 17h hoặc cuối tuần',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'req_seed_002',
    code: 'HR-REQ-2026-1002',
    user_id: 'buyer_demo_02',
    purpose: 'investment',
    property_types: ['apartment'],
    target_districts: ['Nam Từ Liêm'],
    budget_min: 2_800_000_000,
    budget_max: 3_800_000_000,
    min_area: 65,
    min_bedrooms: 2,
    car_access: true,
    urgency: 'within_3_months',
    support_type: 'self_search',
    needs_loan_support: true,
    notes: 'Tìm căn hộ 2 ngủ có ban công thoáng, sẵn sổ hồng.',
    contact_name: 'Phạm Thuỳ Linh',
    contact_phone: '0988 654 321',
    contact_email: 'thuylinh.bds@gmail.com',
    preferred_contact_time: 'Giờ hành chính',
    status: 'contacted',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

// Helper: Read local persistent file
function readLocalStore(): BuyerRequest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(INITIAL_SEED_REQUESTS, null, 2), 'utf8');
      return INITIAL_SEED_REQUESTS;
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[BuyerRequestService] Read store fallback:', err);
    return INITIAL_SEED_REQUESTS;
  }
}

// Helper: Write local persistent file
function writeLocalStore(items: BuyerRequest[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), 'utf8');
  } catch (err) {
    console.error('[BuyerRequestService] Write store error:', err);
  }
}

/**
 * Tạo Yêu Cầu Tìm Mua BĐS Mới
 */
export async function createBuyerRequestRecord(
  dto: CreateBuyerRequestDTO,
  user: { id: string; email?: string; name?: string; phone?: string }
): Promise<BuyerRequest> {
  const code = `HR-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newRequest: BuyerRequest = {
    id,
    code,
    user_id: user.id,
    purpose: dto.purpose || 'living',
    property_types: dto.property_types && dto.property_types.length > 0 ? dto.property_types : ['house'],
    target_districts: dto.target_districts && dto.target_districts.length > 0 ? dto.target_districts : ['Hà Nội'],
    budget_min: Number(dto.budget_min) || 0,
    budget_max: Number(dto.budget_max) || 0,
    min_area: dto.min_area ? Number(dto.min_area) : undefined,
    min_bedrooms: dto.min_bedrooms ? Number(dto.min_bedrooms) : undefined,
    preferred_directions: dto.preferred_directions,
    car_access: Boolean(dto.car_access),
    urgency: dto.urgency || 'within_1_month',
    support_type: dto.support_type || 'connect_ctv',
    referral_code: dto.referral_code?.trim() || undefined,
    needs_loan_support: Boolean(dto.needs_loan_support),
    notes: dto.notes?.trim() || undefined,
    contact_name: dto.contact_name.trim(),
    contact_phone: dto.contact_phone.trim(),
    contact_email: dto.contact_email?.trim() || user.email || undefined,
    preferred_contact_time: dto.preferred_contact_time || 'Bất kỳ lúc nào',
    status: 'pending',
    created_at: now,
    updated_at: now,
  };

  // 1. Thử lưu vào Supabase nếu bảng đã có
  try {
    const supabase = createServerSupabaseClient();
    const { error: sbError } = await (supabase.from('buyer_requests' as any) as any).insert({
      id: newRequest.id,
      code: newRequest.code,
      user_id: newRequest.user_id,
      purpose: newRequest.purpose,
      property_types: newRequest.property_types,
      target_districts: newRequest.target_districts,
      budget_min: newRequest.budget_min,
      budget_max: newRequest.budget_max,
      min_area: newRequest.min_area || null,
      min_bedrooms: newRequest.min_bedrooms || null,
      preferred_directions: newRequest.preferred_directions || null,
      car_access: newRequest.car_access,
      support_type: newRequest.support_type || null,
      referral_code: newRequest.referral_code || null,
      urgency: newRequest.urgency,
      needs_loan_support: newRequest.needs_loan_support,
      notes: newRequest.notes || null,
      contact_name: newRequest.contact_name,
      contact_phone: newRequest.contact_phone,
      contact_email: newRequest.contact_email || null,
      preferred_contact_time: newRequest.preferred_contact_time,
      status: newRequest.status,
      created_at: newRequest.created_at,
      updated_at: newRequest.updated_at,
    });
    if (sbError) {
      console.warn('[BuyerRequestService] Supabase insert warning (fallback to server store):', sbError.message);
    }
  } catch (err: any) {
    console.warn('[BuyerRequestService] Supabase insert failed (fallback to server store):', err.message);
  }

  // 2. Lưu vào server store (Single source of truth khi dev/test)
  const currentList = readLocalStore();
  const updatedList = [newRequest, ...currentList.filter((r) => r.id !== id && r.code !== code)];
  writeLocalStore(updatedList);

  return newRequest;
}

/**
 * Lấy Danh Sách Yêu Cầu Tìm Mua BĐS (Phân Quyền Chặt Chẽ)
 */
export async function getBuyerRequestsRecord(options: {
  userId: string;
  isAdminOrOperator: boolean;
  status?: string;
}): Promise<BuyerRequest[]> {
  const { userId, isAdminOrOperator, status } = options;

  let allRequests: BuyerRequest[] = [];

  // 1. Đọc từ Supabase trước nếu có
  try {
    const supabase = createServerSupabaseClient();
    let query = (supabase.from('buyer_requests' as any) as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdminOrOperator) {
      query = query.eq('user_id', userId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data) && data.length > 0) {
      allRequests = data;
    }
  } catch (err) {
    // Supabase query fallback
  }

  // 2. Nếu Supabase rỗng hoặc chưa migrate bảng, hợp nhất với local server store
  const localList = readLocalStore();
  if (allRequests.length === 0) {
    allRequests = localList;
  } else {
    // Merge deduplicating by code/id
    const existingIds = new Set(allRequests.map((r) => r.id));
    for (const item of localList) {
      if (!existingIds.has(item.id)) {
        allRequests.push(item);
      }
    }
  }

  // 3. Áp dụng Phân Quyền (Security Filter)
  let result = allRequests;
  if (!isAdminOrOperator) {
    // Người mua CHỈ được xem yêu cầu của chính mình
    result = result.filter((r) => r.user_id === userId);
  }

  if (status && status !== 'all') {
    result = result.filter((r) => r.status === status);
  }

  // Sắp xếp mới nhất lên đầu
  result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // 4. Bảo mật thông tin liên hệ: Nếu không phải Admin/Operator và cũng không phải chủ sở hữu yêu cầu, giấu SĐT & Email
  return result.map((r) => {
    if (isAdminOrOperator || r.user_id === userId) {
      return r;
    }
    return {
      ...r,
      contact_phone: '***',
      contact_email: '***',
    };
  });
}

/**
 * Cập nhật Trạng Thái Yêu Cầu Tìm Mua (Dành cho Quản trị viên / CTV tiếp nhận)
 */
export async function updateBuyerRequestStatus(
  idOrCode: string,
  newStatus: BuyerRequestStatus,
  operatorUser: { id: string; role?: string }
): Promise<BuyerRequest | null> {
  const now = new Date().toISOString();

  // 1. Cập nhật Supabase
  try {
    const supabase = createServerSupabaseClient();
    await (supabase.from('buyer_requests' as any) as any)
      .update({
        status: newStatus,
        assigned_agent_id: operatorUser.id,
        updated_at: now,
      })
      .or(`id.eq.${idOrCode},code.eq.${idOrCode}`);
  } catch (err) {
    console.warn('[BuyerRequestService] Supabase status update fallback:', err);
  }

  // 2. Cập nhật Local Store
  const list = readLocalStore();
  let updatedRecord: BuyerRequest | null = null;
  const updatedList: BuyerRequest[] = list.map((r): BuyerRequest => {
    if (r.id === idOrCode || r.code === idOrCode) {
      updatedRecord = {
        ...r,
        status: newStatus,
        assigned_agent_id: operatorUser.id,
        updated_at: now,
      };
      return updatedRecord;
    }
    return r;
  });

  if (updatedRecord) {
    writeLocalStore(updatedList);
  }

  return updatedRecord;
}
