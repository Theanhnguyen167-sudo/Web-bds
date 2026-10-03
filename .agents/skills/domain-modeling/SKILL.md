---
name: domain-modeling
description: Xây dựng và chuẩn hóa Ubiquitous Language (ngôn ngữ chung) cho dự án BĐS Hà Nội theo phương pháp Domain-Driven Design (DDD) của Matt Pocock. Dùng khi thảo luận thuật ngữ PropTech, quy hoạch, SEO Google Patents hoặc cập nhật GLOSSARY.md / ADRs.
---

# 🏛️ Domain Modeling Skill (Hanoi PropTech Edition)

Kỹ năng này chịu trách nhiệm chuẩn hóa bộ từ điển thuật ngữ nghiệp vụ và cấu trúc quyết định thiết kế cho nền tảng BĐS Hà Nội.

## Quy tắc áp dụng:
1. **Đối chiếu thuật ngữ với `GLOSSARY.md`:** Khi người dùng hoặc agent dùng từ mập mờ (ví dụ: "tọa độ", "điểm số", "bản đồ"), chủ động làm sắc bén lại theo các thực thể chuẩn:
   - *Tọa độ*: luôn xác định theo thứ tự `(Longitude, Latitude)` - WGS 84 (`EPSG:4326`).
   - *Điểm đầu tư*: chuẩn hóa thành `AI Investment Score`.
   - *Lớp quy hoạch*: chuẩn hóa thành `Planning Zone Overlay` (ODT, CLN, TMDV).
   - *Cập nhật bài viết*: phân biệt giữa cập nhật hình thức và `Substantive Freshness`.

2. **Cập nhật ngay vào `GLOSSARY.md` khi phát sinh khái niệm mới:**
   - Mỗi định nghĩa từ 1-2 câu ngắn gọn, tập trung vào bản chất thực thể.
   - Luôn kèm mục `_Avoid_:` để chỉ rõ các từ ngữ/cách hiểu sai cần né tránh.

3. **Ghi nhận Architecture Decision Record (ADR):**
   - Chỉ tạo ADR trong `docs/adr/` khi đáp ứng đủ 3 tiêu chuẩn khắt khe của Matt Pocock:
     1. Khó đảo ngược (Hard to reverse).
     2. Gây ngạc nhiên nếu không có ngữ cảnh (Surprising without context).
     3. Là kết quả của một sự đánh đổi thực sự (Real trade-off).
