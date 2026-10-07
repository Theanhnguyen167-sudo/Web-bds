---
name: to-spec
description: Tổng hợp yêu cầu, thảo luận và context codebase thành bản Đặc tả kỹ thuật hoàn chỉnh (Technical Specification). Dùng trước khi bắt tay viết code cho các tính năng mới hoặc thay đổi lớn trong dự án.
---

# 📋 To-Spec Skill (Hanoi PropTech Edition)

Kỹ năng chuyển hóa ý tưởng của người dùng thành Bản Đặc Tả Kỹ Thuật (Spec) có cấu trúc chuẩn, giúp ngăn chặn triệt để tình trạng bỏ sót yêu cầu hoặc làm sai lệch nghiệp vụ.

## Cấu trúc chuẩn của một Bản Spec (`docs/specs/YYYY-MM-DD-<feature-name>.md`):

1. **Tổng quan (Overview & Goal):**
   - Tính năng này giải quyết bài toán gì cho người dùng hoặc hệ thống?
   - Tiêu chí thành công (Success Criteria).

2. **Từ vựng & Thực thể (Domain Language):**
   - Đối chiếu các thuật ngữ sẽ sử dụng trong tính năng với [GLOSSARY.md](file:///c:/Users/Admin/Downloads/Web%20bds/GLOSSARY.md).

3. **Cấu trúc Dữ liệu & Types (Data Model & Schema):**
   - TypeScript types mới trong `@/types/`.
   - Migration Supabase/PostgreSQL (nếu có): bảng, cột, kiểu dữ liệu, PostGIS geometry, RLS policies.

4. **Kiến trúc Thành phần & API Contracts (Architecture & Contracts):**
   - Danh sách Server Components vs Client Components.
   - API Route Handler hoặc Server Action: URL, Method, Request Body (Zod schema), Response format.

5. **Trường hợp Ngoại lệ & Rủi ro (Edge Cases & Failure Modes):**
   - Loading state, Empty state, Error state.
   - Timeout mạng, lỗi phân quyền (401/403), dữ liệu toạ độ GIS không hợp lệ.

6. **Kế hoạch Triển khai (Step-by-step Implementation Plan):**
   - Chia nhỏ tính năng thành các task độc lập, đánh dấu checklist `[ ]` để chuyển giao cho skill `implement-spec`.
