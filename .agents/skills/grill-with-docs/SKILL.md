---
name: grill-with-docs
description: Phỏng vấn dồn dập (Relentless Interview) và stress-test ý tưởng, kiến trúc, edge cases trước khi bắt tay viết code. Đồng thời tự động ghi nhận quyết định kiến trúc (ADR) và cập nhật từ điển nghiệp vụ (GLOSSARY.md).
---

# 🎯 Grill-with-Docs Skill (Hanoi PropTech Edition)

Phương pháp phỏng vấn kỹ thuật từ Matt Pocock nhằm triệt tiêu hiện tượng "vibe coding" (viết code theo cảm tính, mơ hồ về yêu cầu rồi phải đập đi xây lại).

## Quy trình phỏng vấn theo Vòng (Rounds) & Nhánh quyết định (Frontier):

1. **Xây dựng Cây Quyết Định (Design Tree):**
   - Mỗi quyết định kỹ thuật sẽ dẫn đến các quyết định con phụ thuộc vào nó.
   - Tìm kiếm facts từ code/database/file trước bằng tools, **tuyệt đối không hỏi người dùng những thứ AI có thể tự tra cứu được**.

2. **Đặt câu hỏi theo Vòng (Rounds):**
   - Đặt câu hỏi theo nhóm tiền đề đã sẵn sàng (Frontier).
   - Mỗi câu hỏi phải có cấu trúc rõ ràng:
     ```markdown
     ❓ **Q1 - [Tên vấn đề]**: [Mô tả chi tiết và các phương án lựa chọn]
     ➡️ **Khuyến nghị của AI**: [Phương án đề xuất và lý do kỹ thuật]
     ```
   - Chờ người dùng phản hồi trước khi chuyển sang vòng tiếp theo.

3. **Ghi lại tài liệu tự động (Docs as we go):**
   - Khi chốt được một thuật ngữ mới ➔ ghi ngay vào [GLOSSARY.md](file:///c:/Users/Admin/Downloads/Web%20bds/GLOSSARY.md).
   - Khi có quyết định kỹ thuật mang tính đánh đổi cao (ví dụ: cơ chế mã hóa VNPay checksum, chuẩn xử lý PostGIS GeoJSON, lazy-load Mapbox) ➔ đề xuất tạo file ADR trong `docs/adr/`.
