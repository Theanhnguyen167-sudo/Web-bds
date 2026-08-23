# 🏛️ HANOI PROPTECH - SYSTEM ARCHITECTURE & CODEBASE OVERVIEW

## 1. 📂 CẤU TRÚC THƯ MỤC CHUẨN NEXT.JS 14 APP ROUTER

```
Web bds/
├── AGENTS.md                   # 🤖 Bộ quy chuẩn dành cho AI Coding Agents
├── package.json                # Dependencies & scripts
├── tsconfig.json               # Config TypeScript & path alias (@/*)
├── tailwind.config.ts          # Tokens, colors, dark-mode styling
├── next.config.mjs             # Image domains, webpack aliases
├── .env.example                # Biến môi trường mẫu
│
├── 📁 app/                     # Next.js App Router (Pages, Layouts & APIs)
│   ├── (auth)/                 # Nhóm trang xác thực (login, register)
│   ├── (main)/                 # Nhóm trang chính (home, map, listings, planning, reports)
│   └── api/                    # API Route Handlers (listings, ai/report, payment/vnpay)
│
├── 📁 components/              # React UI Components (Modular & Reusable)
│   ├── layout/                 # Header, Footer, Sidebar
│   ├── map/                    # Mapbox container, Markers, Popups, Overlays
│   ├── listing/                # ListingCard, Form wizard, Image uploaders
│   ├── search/                 # FilterPanel, SearchBar
│   ├── ai-report/              # ReportViewer, PDF Templates
│   └── ui/                     # Primitives (Buttons, Dialogs, Inputs)
│
├── 📁 lib/                     # Utilities, SDK Clients & Business Logic
│   ├── supabase/               # Supabase Browser & Server client
│   ├── mapbox/                 # Config, styles, toạ độ trung tâm Hà Nội
│   ├── ai/                     # Google Gemini client & Prompt templates
│   ├── payment/                # VNPay URL generator & Checksum verification
│   ├── scraper/                # Cheerio/Puppeteer crawl quy hoạch
│   └── utils.ts                # Formatting tiền VNĐ, m², Tailwind cn()
│
├── 📁 types/                   # TypeScript Type Definitions & Interfaces
│   ├── database.ts             # Entities, Enums, Profiles, Packages
│   ├── listing.ts              # BĐS DTOs, GeoPoint, Filters
│   ├── planning.ts             # PlanningZones, Projects, GeoJSON types
│   ├── ai-report.ts            # AI Valuation & Assessment interfaces
│   ├── payment.ts              # VNPay parameters & Responses
│   └── index.ts                # Unified export
│
├── 📁 public/                  # Static assets & GeoJSON maps
│   └── geojson/                # GeoJSON quy hoạch các quận Hà Nội
│
├── 📁 docs/                    # Tài liệu kỹ thuật
│   ├── database-schema.sql     # PostgreSQL + PostGIS initialization
│   ├── architecture.md         # Tài liệu kiến trúc này
│   └── api-routes.md           # API Specs
│
└── 📁 scripts/                 # CLI Scripts (Seed DB, Scrape data)
```

---

## 2. ⚡ LUỒNG DỮ LIỆU ĐẶC TRƯNG

1. **Bản đồ & Geospatial:**
   - Mapbox GL JS hiển thị tọa độ Hà Nội (`105.8342, 21.0278`).
   - PostGIS lưu `location GEOGRAPHY(POINT, 4326)` và `boundary GEOGRAPHY(POLYGON, 4326)`.
   - Spatial query hỗ trợ lọc bán kính lân cận (`ST_DWithin`) và kiểm tra nằm trong vùng quy hoạch (`ST_Contains`).

2. **Thẩm định BĐS bằng AI:**
   - Client gửi thông tin nhà đất ➔ Server tổng hợp dữ liệu quy hoạch & hạ tầng ➔ Gemini 1.5 Pro phân tích theo prompt chuyên sâu ➔ Trả về điểm tiềm năng + Báo cáo xuất PDF.

3. **Cổng thanh toán:**
   - Tạo giao dịch ➔ Redirect sang cổng VNPay Sandbox ➔ Webhook / Callback xác thực mã băm SHA-512 ➔ Kích hoạt gói thành viên.
