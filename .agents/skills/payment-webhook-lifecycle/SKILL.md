---
name: payment-webhook-lifecycle
description: Xử lý vòng đời giao dịch thanh toán (VNPay / MoMo) an toàn, chuẩn xác và chống gian lận. Bao gồm: xác thực chữ ký Checksum, cơ chế Idempotency chống cộng trùng tiền, xử lý IPN Server-to-Server độc lập với Redirect URL.
---

# 💳 Payment Webhook Lifecycle Skill (VNPay / MoMo)

Kỹ năng này đảm bảo quy trình tích hợp cổng thanh toán đạt tiêu chuẩn ngân hàng: không thất thoát giao dịch, không double-credit và có khả năng đối soát minh bạch.

## 1. Ba nguyên tắc sống còn (Core Rules):
1. **Server-to-Server IPN là nguồn chân lý duy nhất (Single Source of Truth):**
   - URL Return (trình duyệt người dùng redirect về) **CHỈ ĐƯỢC PHÉP** hiển thị giao diện thông báo ("Đang kiểm tra kết quả...").
   - **TUYỆT ĐỐI KHÔNG** kích hoạt gói VIP hoặc cộng tiền trong URL Return vì người dùng có thể tắt trình duyệt hoặc giả mạo tham số GET.
   - Mọi trạng thái đơn hàng (`PAID`, `EXPIRED`, `FAILED`) chỉ được chốt trong Route IPN Webhook bí mật.

2. **Idempotency (Tính bất biến khi nhận lặp Webhook):**
   - VNPay có thể gửi retry IPN nhiều lần nếu mạng chập chờn.
   - Trước khi xử lý, kiểm tra xem `order_id` / `transaction_ref` đã ở trạng thái `completed` chưa. Nếu đã `completed`, lập tức trả về `{ RspCode: '02', Message: 'Order already confirmed' }` mà không cộng tiền lần hai.

3. **Xác thực chữ ký HMAC-SHA512 nghiêm ngặt:**
   - Sắp xếp toàn bộ tham số nhận được theo thứ tự alphabet `A-Z`.
   - Băm SHA512 với `vnp_HashSecret` để so sánh với `vnp_SecureHash`. Bất kỳ sự sai lệch nào lập tức trả về mã lỗi `{ RspCode: '97', Message: 'Invalid Checksum' }`.

## 2. Chuẩn phản hồi IPN của VNPay:
```json
{ "RspCode": "00", "Message": "Confirm Success" }
```
- Các mã RspCode chuẩn:
  - `00`: Giao dịch thành công và đã ghi nhận.
  - `01`: Đơn hàng không tìm thấy (Order Not Found).
  - `02`: Đơn hàng đã được xác nhận trước đó (Already Confirmed).
  - `04`: Số tiền không hợp lệ (Invalid Amount).
  - `97`: Chữ ký không hợp lệ (Invalid Checksum).
