---
name: improve-codebase-architecture
description: Tự động quét và tối ưu hóa kiến trúc codebase cho AI và lập trình viên. Phát hiện điểm nghẽn kiến trúc (friction points), tách biệt pure logic và side-effects, giảm độ phức tạp monolithic và nâng cao tính testable.
---

# 🏗️ Improve Codebase Architecture Skill (Hanoi PropTech Edition)

Kỹ năng này giúp duy trì cấu trúc dự án luôn ở trạng thái sạch (Clean Architecture), dễ kiểm thử (Testable) và AI-navigable (AI đọc hiểu nhanh mà không bị quá tải context).

## 1. Các tiêu chí quét "Điểm nghẽn kiến trúc" (Friction Points):
1. **Monolithic Files (>300 dòng):**
   - Các component hoặc file chứa quá nhiều logic hỗn tạp (UI rendering + fetch data + xử lý form + tính toán toạ độ).
   - *Cách xử lý:* Tách thành các sub-components độc lập, trích xuất custom hooks (`hooks/`) hoặc pure functions (`lib/utils.ts`, `lib/search/`).
2. **Trộn lẫn Pure Logic và Side-Effects:**
   - Đưa logic tính toán phức tạp (lọc giá, tính đơn giá/m², xử lý polygon GeoJSON) trực tiếp bên trong `useEffect` hoặc event handlers.
   - *Cách xử lý:* Đưa logic thành pure functions (nhận input, trả output) để kiểm thử độc lập mà không cần render UI.
3. **Phụ thuộc vòng hoặc Import lộn xộn:**
   - Client Component import trực tiếp các module Server-only hoặc ngược lại.
   - Luôn sử dụng path alias `@/...` thay vì relative path dài dòng `../../..`.
4. **Mức độ phụ thuộc dữ liệu cứng (Hardcoded State):**
   - Tách biệt ranh giới giữa Mock Data (`lib/mock-data.ts`) và Production Data từ Supabase PostGIS để dễ dàng chuyển đổi qua lại.

## 2. Quy trình thực hiện Refactor:
1. **Phân tích hiện trạng:** Xác định file đang có code smell và mục tiêu refactor.
2. **Bảo toàn chức năng (Zero Regressions):** Đảm bảo interface/types không bị gãy trước khi sửa phần implementation.
3. **Tách nhỏ từng bước:** Không đập đi xây lại toàn bộ cùng lúc; tiến hành refactor theo từng hàm hoặc từng sub-component.
4. **Xác nhận tính toàn vẹn:** Chạy `npx tsc --noEmit` để đảm bảo 0 lỗi type trước khi commit.
