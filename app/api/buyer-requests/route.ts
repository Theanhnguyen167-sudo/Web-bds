import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { BuyerRequest, CreateBuyerRequestDTO } from '@/types/buyer-request';

export async function POST(req: NextRequest) {
  try {
    const body: CreateBuyerRequestDTO = await req.json();

    if (!body.contact_name || !body.contact_phone) {
      return apiError('Họ tên và số điện thoại liên hệ là bắt buộc', 'VALIDATION_ERROR', 400);
    }

    if (!body.target_districts || body.target_districts.length === 0) {
      return apiError('Vui lòng chọn ít nhất 1 quận/huyện', 'VALIDATION_ERROR', 400);
    }

    const code = `HR-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: BuyerRequest = {
      id: `req_${Date.now()}`,
      code,
      purpose: body.purpose || 'living',
      property_types: body.property_types || ['house'],
      target_districts: body.target_districts,
      budget_min: body.budget_min || 0,
      budget_max: body.budget_max || 0,
      min_area: body.min_area,
      min_bedrooms: body.min_bedrooms,
      preferred_directions: body.preferred_directions,
      car_access: body.car_access,
      urgency: body.urgency || 'within_1_month',
      needs_loan_support: Boolean(body.needs_loan_support),
      needs_planning_check: Boolean(body.needs_planning_check),
      notes: body.notes,
      contact_name: body.contact_name,
      contact_phone: body.contact_phone,
      contact_email: body.contact_email,
      preferred_contact_time: body.preferred_contact_time || 'Bất kỳ lúc nào',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return apiSuccess({
      message: 'Gửi nhu cầu mua BĐS thành công! Hệ thống đang phân loại kho BĐS phù hợp.',
      request: newRequest,
    }, 201);
  } catch (error: any) {
    return apiError(error.message || 'Lỗi xử lý yêu cầu', 'SERVER_ERROR', 500);
  }
}

