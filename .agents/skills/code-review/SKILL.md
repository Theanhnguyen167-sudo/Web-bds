---
name: code-review
description: Review code theo 2 trục độc lập của Matt Pocock (Standards vs Spec) bằng cách so sánh HEAD với điểm cố định (commit SHA, branch main). Dùng khi người dùng yêu cầu review code, kiểm tra trước khi commit hoặc audit chất lượng code.
---

# 🔍 Two-Axis Code Review Skill

Đánh giá pull request hoặc mã nguồn thay đổi theo 2 trục tách biệt nhằm tránh trường hợp code đẹp chuẩn convention nhưng làm sai nghiệp vụ, hoặc làm đúng tính năng nhưng code bẩn vi phạm chuẩn.

## Trục 1: Standards (Chuẩn code & Code Smells)
- Kiểm tra tuân thủ các quy tắc trong `AGENTS.md` (Server Components mặc định, TypeScript strict không dùng `any`, toạ độ Long/Lat WGS 84, try-catch chuẩn RESTful).
- Kiểm tra các Fowler Code Smells kinh điển:
  - **Mysterious Name**: Đặt tên biến/hàm tối nghĩa.
  - **Duplicated Code**: Lặp code.
  - **Primitive Obsession**: Dùng string/number bừa bãi thay vì type chặt chẽ (`@/types`).
  - **Shotgun Surgery**: Một thay đổi nhỏ phải sửa rải rác nhiều file.

## Trục 2: Spec (Bám sát yêu cầu & Chặn Scope Creep)
- Yêu cầu người dùng hoặc spec ban đầu yêu cầu những gì?
- Những yêu cầu nào bị bỏ sót hoặc làm chưa tới?
- Có hành vi nào tự ý thêm vào ngoài phạm vi yêu cầu (Scope Creep) không?
- Triển khai có đúng logic nghiệp vụ được thống nhất trong [GLOSSARY.md](file:///c:/Users/Admin/Downloads/Web%20bds/GLOSSARY.md) không?

## Báo cáo đầu ra:
Xuất báo cáo độc lập 2 phần `## Standards` và `## Spec`, kết thúc bằng bản tóm tắt 1 dòng ngắn gọn.
