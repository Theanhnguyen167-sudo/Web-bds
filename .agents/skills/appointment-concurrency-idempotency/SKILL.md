---
name: appointment-concurrency-idempotency
description: Kiểm soát xung đột khung giờ hẹn xem nhà (Slot Concurrency Control), chống trùng lịch (Double-Booking), đảm bảo tính lũy đẳng (Idempotency Key) và bảo toàn thông báo (Outbox Pattern) kế thừa từ booking-microservices và aws-serverless-airline-booking.
---

# 📅 Slot Concurrency & Idempotency Skill (Hanoi PropTech Edition)

Kiến trúc quản lý lịch hẹn xem nhà được đúc kết từ hai dự án chuẩn mực:
- **`meysamhadeli/booking-microservices`**: Idempotency Key, Inbox/Outbox Pattern đảm bảo *At-least-once & Exactly-once Delivery*.
- **`aws-samples/aws-serverless-airline-booking`**: Slot Concurrency Control, Optimistic Locking chống xung đột lịch hẹn (*Double-Booking*) và Finite State Machine.

---

## 🎯 1. BÀI TOÁN & THÁCH THỨC NGHIỆP VỤ BĐS

1. **Trùng lịch hẹn (Double-Booking):**
   - Hai khách hàng khác nhau cùng đặt lịch xem cùng 1 căn nhà lúc 09:30 ngày mai.
   - Nếu không có cơ chế Concurrency Check, chủ nhà sẽ bị quá tải hoặc lúng túng khi 2 khách đến cùng lúc.
2. **Duplicate Submissions (Bấm liên tiếp nhiều lần):**
   - Do mạng lag hoặc giật, người dùng bấm nút "Xác nhận đặt lịch" 3 lần liên tiếp trong 1 giây.
   - Hệ thống tạo ra 3 bản ghi trùng lặp và bắn 3 thông báo rác làm phiền chủ nhà.
3. **Mất thông báo (Lost Notification):**
   - Lịch hẹn lưu thành công nhưng notification bị lỗi hoặc tab bị đóng trước khi gửi xong.

---

## 🛡️ 2. QUY CHUẨN THIẾT KẾ & PATTERNS

### 2.1. Idempotency Key Pattern
- Mỗi phiên đặt lịch khởi tạo một `idempotencyKey = `${listingId}-${dateStr}-${timeSlot}-${buyerPhone}``.
- Nếu hệ thống phát hiện request với cùng key trong vòng 5 phút:
  - Trả về kết quả của request đầu tiên, không tạo thêm bản ghi mới.
  - Vô hiệu hóa nút Submit ngay khi request bắt đầu (`isSubmitting = true`).

### 2.2. Slot Concurrency & Conflict Detection
- Trước khi hiển thị khung giờ (`time slots`), hệ thống truy vấn danh sách lịch hẹn hiện có của BĐS đó trong ngày được chọn.
- Nếu một slot đã có lịch hẹn ở trạng thái `pending` hoặc `confirmed`:
  - Đánh dấu slot là `booked: true`.
  - Vô hiệu hóa nút chọn khung giờ (`disabled`), đổi màu sang nền xám nhạt kèm badge `Đã có khách hẹn`.
- **Race Condition Guard:** Khi bấm Submit, thực hiện kiểm tra Concurrency lần cuối (Optimistic Locking). Nếu slot vừa bị người khác chọn trước, hiển thị Toast cảnh báo: *"Khung giờ này vừa có khách đặt trước, vui lòng chọn giờ khác!"*.

### 2.3. Outbox Pattern for Notifications
- Lưu đồng thời `Appointment Record` và `Notification Item` vào cùng một transaction / storage batch.
- Phát sự kiện toàn cục `hanoi_new_notification` và `hanoi_appointments_updated` ngay lập tức để đồng bộ chuông thông báo và Dashboard người bán không độ trễ.

---

## 💻 3. MẪU HOOK CHUẨN HOÁ: `useAppointmentSlot`

```typescript
// hooks/useAppointmentSlot.ts
import { useMemo } from 'react';

export interface BookedSlot {
  date: string;
  time: string;
  listingId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export function checkSlotAvailability(
  bookedAppointments: BookedSlot[],
  listingId: string,
  dateStr: string,
  timeSlot: string
): { isAvailable: boolean; reason?: string } {
  const existing = bookedAppointments.find(
    (a) =>
      a.listingId === listingId &&
      a.date === dateStr &&
      a.time === timeSlot &&
      a.status !== 'cancelled'
  );

  if (existing) {
    return {
      isAvailable: false,
      reason: existing.status === 'confirmed' ? 'Đã có khách hẹn' : 'Đang chờ xác nhận',
    };
  }

  return { isAvailable: true };
}
```

---

## 📋 4. CHECKLIST KIỂM THỬ AN TOÀN LỊCH HẸN
- [ ] Bấm nút Submit liên tiếp không tạo ra 2 bản ghi trùng nhau.
- [ ] Chọn ngày đã có khách đặt ➔ Khung giờ đó bị khóa màu xám và không bấm được.
- [ ] Nếu chủ nhà bấm "Huỷ lịch hẹn" trong Dashboard ➔ Khung giờ đó lập tức mở lại cho khách khác đặt.
- [ ] Thông báo được gửi đến đúng chủ sở hữu bài đăng (`sellerId`), các tài khoản khác không nhìn thấy.
