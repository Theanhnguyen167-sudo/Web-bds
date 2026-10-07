---
name: implement-spec
description: Hiện thực hóa code chính xác theo Bản Đặc Tả Kỹ Thuật (Spec file). Làm theo checklist từng bước, không tự ý thêm bớt tính năng ngoài phạm vi (chống Scope Creep), commit code sạch sẽ sau mỗi task hoàn thành.
---

# 🚀 Implement-Spec Skill (Hanoi PropTech Edition)

Kỹ năng đọc bản đặc tả kỹ thuật đã được phê duyệt và chuyển hóa thành mã nguồn hoạt động chuẩn production.

## Quy tắc thực thi nghiêm ngặt:
1. **Bám sát Spec 100%:**
   - Chỉ triển khai những gì spec yêu cầu. Không tự ý phình to tính năng (Scope Creep).
   - Nếu phát hiện điểm bất hợp lý trong spec trong lúc code: dừng lại và báo cáo với người dùng để xin ý kiến, không tự ý quyết định.

2. **Quy trình thực hiện tuần tự (Tick the box):**
   - Đọc danh sách checklist task trong file spec.
   - Làm từng task một:
     1. Khởi tạo Types & Schema.
     2. Viết backend / API logic / Server actions.
     3. Xây dựng giao diện UI components.
     4. Tích hợp dữ liệu và xử lý edge cases.
   - Cập nhật checklist `[x]` sau khi hoàn thành mỗi task.

3. **Kiểm tra tiêu chuẩn trước khi bàn giao:**
   - Chạy kiểm tra tĩnh: `npx tsc --noEmit` (đảm bảo 0 lỗi TypeScript).
   - Kiểm tra responsive (Mobile & Desktop).
   - Tự động commit và push trực tiếp lên branch `main` theo quy định tại `AGENTS.md`.
