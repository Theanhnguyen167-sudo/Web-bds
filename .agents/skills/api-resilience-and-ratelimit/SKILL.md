---
name: api-resilience-and-ratelimit
description: Bảo vệ toàn diện API routes trong Next.js: kiểm thực runtime nghiêm ngặt bằng Zod Schema (chống injection và dữ liệu rác), giới hạn tần suất gọi Rate Limiting (in-memory sliding window / Redis) chống spam cào dữ liệu và chuẩn hóa cấu trúc phản hồi ApiResponse<T> theo AGENTS.md.
---

# 🛡️ API Resilience & Rate Limit Skill

Kỹ năng này chịu trách nhiệm bảo vệ toàn bộ các API Endpoints trong thư mục `app/api/` của nền tảng BĐS Hà Nội khỏi tấn công brute-force, spam bot cào dữ liệu và lỗi dữ liệu đầu vào.

## 1. Kiểm thực đầu vào nghiêm ngặt bằng Zod (Runtime Validation):
- **Nguyên tắc:** Không bao giờ tin tưởng dữ liệu từ `req.json()` hoặc `searchParams`.
- **Cách áp dụng:** Mọi route nhận dữ liệu phải khai báo Zod Schema và parse an toàn:
  ```typescript
  import { z } from 'zod';
  import { apiError, apiSuccess } from '@/lib/api-response';

  const ListingCreateSchema = z.object({
    title: z.string().min(10, 'Tiêu đề tối thiểu 10 ký tự').max(200),
    price: z.number().positive('Giá phải lớn hơn 0'),
    area: z.number().positive('Diện tích phải lớn hơn 0'),
    district: z.string().min(2),
    property_type: z.enum(['house', 'apartment', 'villa', 'land', 'commercial']),
    lat: z.number().min(20).max(22), // Giới hạn toạ độ hợp lệ của Hà Nội
    lng: z.number().min(105).max(107),
  });

  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const validation = ListingCreateSchema.safeParse(body);
      
      if (!validation.success) {
        return apiError(
          validation.error.errors.map(e => e.message).join(', '),
          'VALIDATION_ERROR',
          400
        );
      }
      // Xử lý tiếp với validation.data đã được type-safe 100%
    } catch (err: any) {
      return apiError('Dữ liệu JSON không hợp lệ', 'INVALID_JSON', 400);
    }
  }
  ```

## 2. Giới hạn tần suất gọi API (Rate Limiting - Sliding Window):
- **Áp dụng cho:**
  - Route gọi AI Valuation / Gemini analysis (`/api/ai/*`): Giới hạn **10 requests / phút / IP** để chống cạn kiệt hạn ngạch token Gemini.
  - Route tạo thanh toán VNPay (`/api/payment/vnpay/*`): Giới hạn **5 requests / phút / User**.
  - Route cào danh sách BĐS (`/api/listings`): Giới hạn **60 requests / phút / IP**.
- **Header phản hồi chuẩn RFC:**
  - `X-RateLimit-Limit`: Tổng số lượt cho phép trong chu kỳ.
  - `X-RateLimit-Remaining`: Số lượt còn lại.
  - `Retry-After`: Số giây cần đợi trước khi được gọi lại.
  - Trả về mã HTTP `429 Too Many Requests` khi vượt ngưỡng.

## 3. Chuẩn hóa phản hồi API (ApiResponse Standard):
Tất cả các route trong `app/api/` phải trả về đúng format đã định nghĩa trong `AGENTS.md` và `@/types`:
```json
// Thành công:
{ "success": true, "data": { ... } }

// Thất bại:
{ "success": false, "error": { "message": "Thông báo lỗi tiếng Việt dễ hiểu", "code": "ERROR_CODE" } }
```
