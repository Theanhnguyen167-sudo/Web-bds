---
name: web-performance-vital-audit
description: Tối ưu hóa hiệu năng render trình duyệt và Core Web Vitals từ kho tri thức qianguyihao/Web. Chống Layout Thrashing (rung giật bố cục), giảm TTFB, tách rời Read/Write DOM, tối ưu hóa CSS GPU Composite và kiểm soát vòng đời request.
---

# ⚡ Web Performance & Core Web Vitals Skill

Đúc kết từ chương *14 - 前端性能优化* của kho tri thức **qianguyihao/Web**: biến giao diện bản đồ và danh sách BĐS phức tạp thành trải nghiệm 60 FPS mượt mà.

## 1. Tránh hoàn toàn Layout Thrashing (Rung giật bố cục):
- **Nguyên nhân:** Khi đọc thuộc tính layout (`offsetWidth`, `clientHeight`, `getBoundingClientRect`) xen kẽ với ghi (`style.left`, `style.top`, `className`), trình duyệt bị ép tính toán lại Render Tree liên tục (Forced Synchronous Layout).
- **Quy tắc vàng:**
  - **Tách riêng Đọc & Ghi:** Đọc toàn bộ kích thước trước, sau đó mới cập nhật state/DOM hàng loạt.
  - **GPU Compositing:** Luôn ưu tiên dùng `transform: translate3d(x, y, 0)` hoặc `opacity` cho các chuyển động, popup, bottom drawer và marker bản đồ. Không dùng `top/left/margin` vì các thuộc tính này gây Reflow toàn trang.

## 2. Kiểm soát sự kiện tần số cao (High-Frequency Events):
- Các sự kiện kéo/cuộn bản đồ (`scroll`, `touchmove`, `mousemove`) phát sinh hơn 60 lần/giây:
  - Bắt buộc áp dụng **Debounce (Trì hoãn)** khi sync URL hoặc gửi request tìm kiếm (300ms - 500ms).
  - Sử dụng **`requestAnimationFrame`** cho các hiệu ứng hoạt cảnh di chuyển mượt theo chu kỳ quét màn hình.

## 3. Quản lý bất đồng bộ & Triệt tiêu Race Conditions:
- Khi người dùng liên tục đổi filter hoặc chuyển quận trên bản đồ:
  - Luôn sử dụng **`AbortController`** để hủy bỏ các HTTP request cũ đang bay dở dang.
  - Không bao giờ để kết quả trả về của một request cũ ghi đè lên kết quả của request mới nhất.
