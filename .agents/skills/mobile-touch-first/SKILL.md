---
name: mobile-touch-first
description: Tối ưu hóa trải nghiệm chạm (Touch & Gesture) và responsive chuyên sâu cho thiết bị di động từ kho tri thức qianguyihao/Web (Chương 09). Triệt tiêu độ trễ 300ms, sử dụng 100dvh chống tràn thanh điều hướng, tối ưu hóa Lazy Loading bằng IntersectionObserver theo Viewport thực tế.
---

# 📱 Mobile-Touch-First Skill (Hanoi PropTech Edition)

Hơn 75% người tìm kiếm bất động sản tại Hà Nội sử dụng điện thoại thông minh. Kỹ năng này đảm bảo trải nghiệm người dùng trên Mobile đạt độ mượt mà tương đương Native Application.

## 1. Triệt tiêu hoàn toàn độ trễ chạm (300ms Click Delay & Ghost Clicks):
- Thiết lập thẻ viewport chuẩn trong HTML/Layout:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
  ```
- Sử dụng thuộc tính CSS `touch-action: manipulation;` trên các nút bấm, icon marker bản đồ và carousel ảnh để vô hiệu hóa cử chỉ double-tap zoom gây trễ 300ms.
- Đối với Modal và Bottom Sheet drawer (như bộ lọc và danh sách rút gọn BĐS): bắt sự kiện `touchstart`, `touchmove`, `touchend` với `{ passive: true }` để cuộn 60 FPS không bị chặn luồng chính (Main Thread Blocking).

## 2. Chiều cao khung nhìn an toàn (Dynamic Viewport Height - `100dvh`):
- **Vấn đề kinh điển:** Khi dùng `100vh` trên iOS Safari hoặc Android Chrome, khi thanh URL bar co giãn sẽ đẩy nút bấm hoặc bộ lọc chân trang ra khỏi màn hình hoặc bị che khuất.
- **Quy tắc bắt buộc:** Luôn sử dụng `h-[100dvh]` hoặc `min-h-[100dvh]` cho màn hình tìm kiếm, bản đồ Mapbox toàn màn hình và drawer trượt lên.

## 3. Chiến lược Lazy Loading ảnh Viewport-Priority:
- Tối ưu tải ảnh danh thiếp BĐS:
  - Ảnh Hero đầu tiên (LCP element): Không lazy-load, set `priority` hoặc `fetchpriority="high"`.
  - Các ảnh từ vị trí thứ 2 trở đi: Áp dụng native `loading="lazy"` kết hợp `IntersectionObserver` với `rootMargin: '200px 0px'` để nạp ảnh trước khi người dùng kịp cuộn tới.
