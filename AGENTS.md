# 🤖 AI AGENT CODING SYSTEM ARCHITECTURE & GUIDELINES
**Dự án:** Nền tảng Bất Động Sản Hà Nội (Hanoi PropTech Platform)
**Mục tiêu:** Chuẩn hóa quy trình AI Agent hỗ trợ phát triển full-stack, đảm bảo code chuẩn production, clean architecture, type-safety và dễ bảo trì.

---

## 🎯 1. VAI TRÒ CỦA AI CODING AGENT (SUB-AGENT PERSONAS)

Khi nhận task, AI Agent cần tự xác định context và áp dụng đúng role:

| Persona | Trách nhiệm chính | Tiêu chuẩn & Chú ý |
|---|---|---|
| 🏗️ **Core & Architecture Agent** | Khởi tạo cấu trúc, config, type definitions, DB migrations | TypeScript strict, Schema PostGIS chuẩn, Supabase RLS chặt chẽ |
| 🗺️ **GIS & Mapbox Agent** | Tích hợp Mapbox GL JS, GeoJSON overlay quy hoạch, clustering, vẽ polygon | Tránh re-render map, xử lý GeoJSON tối ưu viewport, memoized markers |
| 🤖 **AI Engine Agent** | Tích hợp Gemini 1.5 Pro, prompt engineering, stream analysis, PDF generation | Temperature thấp (0.2), few-shot prompt, fallback khi AI timeout, React-PDF |
| 🎨 **UI/UX & Frontend Agent** | Xây dựng components (Shadcn/UI, Tailwind, Framer Motion), Responsive | Server Components ưu tiên, Client Component khi cần interactive, accessible |
| 💳 **Payment & API Agent** | Tích hợp VNPay, API routes, webhook verification, rate limit | Validate input (Zod), verify checksum VNPay, transaction safety |

---

## 📐 2. QUY CHUẨN CODE (CODING STANDARDS)

### 2.1. Next.js 14 & React Rules
- **Server Components mặc định:** Mọi component trong `app/` mặc định là Server Component trừ khi cần `useState`, `useEffect`, event listeners hoặc Mapbox SDK.
- **Client Components tách biệt:** Thêm `'use client'` ở đầu file cho component tương tác (Map, Filter Bar, Form wizard, Popup).
- **Data Fetching:** Fetch trực tiếp trên Server Component hoặc dùng React Server Actions / Route Handlers chuẩn RESTful.

### 2.2. TypeScript & Type Safety
- Không dùng `any`. Mọi response, request body, database entity đều phải có type trong `@/types/`.
- Sử dụng **Zod** để runtime validation cho form data và API input.
- File naming: `kebab-case` cho utilities/hooks (`use-debounce.ts`), `PascalCase` cho components (`ListingCard.tsx`).

### 2.3. Database & PostGIS Rules
- Toạ độ luôn theo chuẩn `(Longitude, Latitude)` - WGS 84 (`EPSG:4326`).
- Mọi truy vấn không gian (bán kính, polygon) sử dụng PostGIS functions: `ST_DWithin`, `ST_Contains`, `ST_Intersects`.
- Bật Row Level Security (RLS) cho tất cả bảng nhạy cảm (users, payments, subscriptions).

### 2.4. Error Handling & Security
- Mọi API route phải bọc trong `try...catch` và trả về format chuẩn:
  ```json
  { "success": boolean, "data"?: any, "error"?: { "message": string, "code": string } }
  ```
- Không hardcode secrets. Luôn dùng `process.env.NEXT_PUBLIC_*` cho client và `process.env.*` cho server.

---

## 🔄 3. QUY TRÌNH THỰC HIỆN TỪNG TASK (AGENT WORKFLOW)

```
[1. Phân tích yêu cầu] ➔ [2. Kiểm tra Schema & Types] ➔ [3. Viết/Cập nhật Code] ➔ [4. Review Security/Performance] ➔ [5. Xác nhận & Bàn giao]
```

1. **Step 1:** Đọc kỹ yêu cầu và đối chiếu với roadmap dự án.
2. **Step 2:** Kiểm tra `@/types` và `@/lib` xem đã có abstractions sẵn chưa.
3. **Step 3:** Triển khai code theo module độc lập, không tạo monolithic files (>300 lines tách sub-components).
4. **Step 4:** Kiểm tra Edge Cases: Loading state, Error state, Empty state, Mobile responsiveness.
5. **Step 5:** Cập nhật tài liệu / checklist trong `docs/`.
6. **Step 6:** Tự động đồng bộ lên GitHub (`git add .` ➔ `git commit -m "..."` ➔ `git push origin main`) sau khi hoàn thành task và kiểm tra build thành công.
