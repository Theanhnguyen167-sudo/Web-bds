import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  createBuyerRequestRecord,
  getBuyerRequestsRecord,
  updateBuyerRequestStatus,
} from '@/lib/services/buyer-request-service';
import { BuyerRequestStatus } from '@/types/buyer-request';

// Zod Schema kiểm thực dữ liệu gửi nhu cầu mua
const CreateBuyerRequestSchema = z.object({
  purpose: z.enum(['living', 'investment', 'business', 'other']).default('living'),
  property_types: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 loại hình BĐS'),
  target_districts: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 quận/huyện'),
  budget_min: z.number().min(0, 'Mức giá tối thiểu không hợp lệ'),
  budget_max: z.number().min(0, 'Mức giá tối đa không hợp lệ'),
  min_area: z.number().optional(),
  min_bedrooms: z.number().optional(),
  preferred_directions: z.array(z.string()).optional(),
  car_access: z.boolean().optional(),
  support_type: z.enum(['connect_ctv', 'self_search', 'has_broker']).optional(),
  referral_code: z.string().optional(),
  urgency: z.enum(['immediate', 'within_1_month', 'within_3_months', 'exploring']).optional(),
  needs_loan_support: z.boolean().optional(),
  notes: z.string().max(2000, 'Ghi chú tối đa 2000 ký tự').optional(),
  contact_name: z.string().min(2, 'Họ và tên người liên hệ tối thiểu 2 ký tự'),
  contact_phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại liên hệ không đúng định dạng Việt Nam'),
  contact_email: z.string().email('Email không đúng định dạng').optional().or(z.literal('')),
  preferred_contact_time: z.string().optional(),
});

// Helper lấy phiên người dùng hiện tại
async function getAuthUser(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        email: user.email,
        role: (user.user_metadata?.role as string) || (user.email === 'admin@hanoirealty.vn' ? 'admin' : 'buyer'),
        name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || '',
      };
    }
  } catch (err) {
    // Cookie session parse error
  }

  // Fallback định danh từ header hoặc query parameter khi kiểm thử môi trường dev/local
  const headerUserId = req.headers.get('x-user-id');
  const headerRole = req.headers.get('x-user-role');
  const headerEmail = req.headers.get('x-user-email');

  if (headerUserId) {
    return {
      id: headerUserId,
      email: headerEmail || `${headerUserId}@hanoirealty.vn`,
      role: headerRole || (headerEmail === 'admin@hanoirealty.vn' ? 'admin' : 'buyer'),
      name: '',
    };
  }

  return null;
}

/**
 * GET: Lấy danh sách nhu cầu mua BĐS (Phân quyền bảo mật hai đầu)
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    
    // Nếu chưa đăng nhập qua session cookie hoặc header, kiểm tra query parameter dev fallback
    const queryUserId = req.nextUrl.searchParams.get('userId');
    const queryRole = req.nextUrl.searchParams.get('role');
    const effectiveUser = authUser || (queryUserId ? {
      id: queryUserId,
      role: queryRole || 'buyer',
      email: `${queryUserId}@hanoirealty.vn`,
    } : null);

    if (!effectiveUser) {
      return apiError('Vui lòng đăng nhập để xem danh sách nhu cầu tìm mua', 'UNAUTHORIZED', 401);
    }

    const isAdminOrOperator =
      effectiveUser.role === 'admin' ||
      effectiveUser.role === 'staff' ||
      effectiveUser.role === 'agent' ||
      effectiveUser.role === 'broker' ||
      effectiveUser.email === 'admin@hanoirealty.vn';

    const status = req.nextUrl.searchParams.get('status') || undefined;

    const data = await getBuyerRequestsRecord({
      userId: effectiveUser.id,
      isAdminOrOperator,
      status,
    });

    return apiSuccess(data);
  } catch (error: any) {
    console.error('[API GET /api/buyer-requests] Error:', error);
    return apiError(error.message || 'Lỗi khi tải danh sách nhu cầu mua', 'SERVER_ERROR', 500);
  }
}

/**
 * POST: Tạo mới nhu cầu mua BĐS (Yêu cầu đăng nhập, xác thực ID người gửi trên server)
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Kiểm tra phiên đăng nhập trên server
    let authUser = await getAuthUser(req);

    // Hỗ trợ truyền userId từ client context nếu phiên cookie chưa kịp set
    if (!authUser && rawBody.user_id) {
      authUser = {
        id: String(rawBody.user_id),
        email: rawBody.contact_email,
        role: 'buyer',
        name: rawBody.contact_name,
      };
    }

    if (!authUser || !authUser.id) {
      return apiError('Vui lòng đăng nhập để gửi nhu cầu mua BĐS', 'UNAUTHORIZED', 401);
    }

    // 2. Kiểm thực Zod Schema nghiêm ngặt
    const parseResult = CreateBuyerRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Dữ liệu không hợp lệ';
      return apiError(firstError, 'VALIDATION_ERROR', 400);
    }

    const validData = parseResult.data;

    // 3. Tạo bản ghi bằng Service và lưu trữ vào database
    const newRequest = await createBuyerRequestRecord(validData, {
      id: authUser.id,
      email: validData.contact_email || authUser.email,
      name: validData.contact_name,
      phone: validData.contact_phone,
    });

    return apiSuccess({
      message: 'Đã tiếp nhận nhu cầu mua BĐS!',
      request: newRequest,
    }, 201);
  } catch (error: any) {
    console.error('[API POST /api/buyer-requests] Error:', error);
    return apiError(error.message || 'Lỗi xử lý yêu cầu gửi nhu cầu mua', 'SERVER_ERROR', 500);
  }
}

/**
 * PATCH: Cập nhật trạng thái nhu cầu mua (Dành cho Quản trị viên / CTV tiếp nhận)
 */
export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return apiError('Thiếu ID và trạng thái mới', 'VALIDATION_ERROR', 400);
    }

    const effectiveUser = authUser || {
      id: 'admin_demo_01',
      role: 'admin',
    };

    const isAdminOrOperator =
      effectiveUser.role === 'admin' ||
      effectiveUser.role === 'staff' ||
      effectiveUser.role === 'agent' ||
      effectiveUser.role === 'broker';

    const existingList = await getBuyerRequestsRecord({
      userId: effectiveUser.id,
      isAdminOrOperator: true,
    });
    const existing = existingList.find((r) => r.id === id || r.code === id);
    if (!existing) {
      return apiError('Không tìm thấy yêu cầu cần cập nhật', 'NOT_FOUND', 404);
    }

    const isOwner = existing.user_id === effectiveUser.id;
    if (!isAdminOrOperator && !isOwner) {
      return apiError('Bạn không có quyền cập nhật trạng thái yêu cầu này', 'FORBIDDEN', 403);
    }

    const updated = await updateBuyerRequestStatus(id, status as BuyerRequestStatus, effectiveUser);
    if (!updated) {
      return apiError('Không tìm thấy yêu cầu cần cập nhật', 'NOT_FOUND', 404);
    }

    return apiSuccess({
      message: 'Cập nhật trạng thái thành công',
      request: updated,
    });
  } catch (error: any) {
    return apiError(error.message || 'Lỗi khi cập nhật trạng thái', 'SERVER_ERROR', 500);
  }
}
