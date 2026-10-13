###############################################################
# generate-context.ps1
# Script tự động tạo PROJECT_CONTEXT.md để giới thiệu dự án
# cho AI Agent / LLM khác đọc hiểu toàn bộ kiến trúc.
#
# Cách dùng:
#   cd "c:\Users\Admin\Downloads\Web bds"
#   .\scripts\generate-context.ps1
#
# Output: PROJECT_CONTEXT.md ở thư mục gốc dự án
###############################################################

$root = "c:\Users\Admin\Downloads\Web bds"
$out  = "$root\PROJECT_CONTEXT.md"

function Get-Lines($file, $n = 40) {
  if (Test-Path $file) {
    return (Get-Content $file -TotalCount $n -Encoding UTF8) -join "`n"
  }
  return "(file not found)"
}

function Get-FileTree($dir, $filter = "*", $maxDepth = 3) {
  $items = Get-ChildItem $dir -Recurse -Filter $filter -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" } |
    ForEach-Object { "  " + $_.FullName.Replace($root + "\", "") }
  return $items -join "`n"
}

# ── Collect routes ──────────────────────────────────────────
$pages = Get-ChildItem "$root\app" -Recurse -Filter "page.tsx" -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch "node_modules|\.next" } |
  ForEach-Object { "  " + $_.FullName.Replace("$root\app\", "/").Replace("\page.tsx","") }

$apiRoutes = Get-ChildItem "$root\app\api" -Recurse -Filter "route.ts" -ErrorAction SilentlyContinue |
  ForEach-Object { "  /api/" + $_.FullName.Replace("$root\app\api\","").Replace("\route.ts","").Replace("\","/") }

# ── Collect component list ──────────────────────────────────
$components = Get-ChildItem "$root\components" -Recurse -Filter "*.tsx" -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch "node_modules" } |
  ForEach-Object { "  " + $_.FullName.Replace("$root\components\","") }

# ── Collect lib files ───────────────────────────────────────
$libFiles = Get-ChildItem "$root\lib" -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue |
  ForEach-Object { "  " + $_.FullName.Replace("$root\lib\","") }

# ── Read key snippets ───────────────────────────────────────
$pkgJson   = Get-Content "$root\package.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$depList   = ($pkgJson.dependencies.PSObject.Properties | ForEach-Object { "  - $($_.Name): $($_.Value)" }) -join "`n"
$envExample = Get-Lines "$root\.env.example" 60
$dbTypes   = Get-Lines "$root\lib\supabase\database.types.ts" 50
$appContext = Get-Lines "$root\lib\context\AppContext.tsx" 40
$agentsRules = Get-Lines "$root\AGENTS.md" 80

# ── Build markdown ──────────────────────────────────────────
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"

$md = @"
# 📋 PROJECT CONTEXT — HaNoi Realty Platform
> Auto-generated: $timestamp | Script: scripts/generate-context.ps1
> **Mục đích:** Tài liệu này được tạo tự động để AI Agent / LLM khác có thể
> đọc và hiểu toàn bộ kiến trúc, stack và convention của dự án này.

---

## 1. TỔNG QUAN DỰ ÁN

**Tên dự án:** HaNoi Realty — Nền tảng BĐS, Tra cứu Quy hoạch & Thẩm định AI Hà Nội
**GitHub:** https://github.com/Theanhnguyen167-sudo/Web-bds
**Stack chính:** Next.js 14 App Router + TypeScript + Supabase + Leaflet + Google Gemini AI
**Triển khai:** Vercel (production-ready)

### Mô tả nghiệp vụ
Nền tảng PropTech thế hệ mới cho thị trường BĐS Hà Nội, bao gồm:
- Tìm kiếm & đăng tin BĐS (mua bán, cho thuê) với bản đồ tương tác
- Bản đồ quy hoạch phân khu Hà Nội 2030–2045 theo chuẩn QCVN 01:2021
- Thẩm định & định giá BĐS bằng Google Gemini 1.5 Pro AI
- Thanh toán gói hội viên qua VNPay & MoMo
- Progressive Web App (PWA) hỗ trợ offline
- Admin dashboard quản lý toàn hệ thống

---

## 2. TECH STACK & DEPENDENCIES

``````json
{
  "framework": "Next.js 14.2 (App Router)",
  "language": "TypeScript (strict mode)",
  "styling": "Tailwind CSS + Framer Motion + Radix UI",
  "database": "Supabase (PostgreSQL + PostGIS)",
  "auth": "Firebase Authentication + Supabase RLS",
  "maps": "Leaflet 1.9 + react-leaflet (GIS) + Mapbox GL JS",
  "ai": "Google Gemini 1.5 Pro (@google/generative-ai)",
  "payment": "VNPay + MoMo",
  "pdf": "@react-pdf/renderer",
  "charts": "Recharts",
  "forms": "react-hook-form + Zod",
  "pwa": "Service Worker (public/sw.js) + manifest"
}
``````

### Dependencies đầy đủ:
$depList

---

## 3. CẤU TRÚC THƯ MỤC (DIRECTORY STRUCTURE)

``````
Web bds/
├── app/                    # Next.js 14 App Router pages
│   ├── (auth)/            # Login, Register (Route Group)
│   ├── admin/             # Admin dashboard (listings, users, analytics...)
│   ├── api/               # Route Handlers (REST API)
│   ├── dashboard/         # User dashboard
│   ├── listing/           # Chi tiết tin đăng
│   ├── mua-ban/           # SEO routes: /mua-ban/[type]/[district]/[slug]
│   ├── cho-thue/          # Cho thuê BĐS
│   ├── planning/          # Bản đồ quy hoạch Hà Nội
│   ├── search/            # Tìm kiếm BĐS
│   ├── pricing/           # Bảng giá gói hội viên
│   ├── payment/           # Checkout, VNPay return, MoMo return
│   ├── reports/           # Báo cáo thẩm định AI
│   ├── news/              # Tin tức BĐS
│   └── streets/           # Hạ tầng & tuyến đường Hà Nội
├── components/
│   ├── map/               # PlanningMap, SearchMap, MapContainer, HybridMap...
│   ├── listing/           # ListingCard, CreateListingWizard...
│   ├── admin/             # Admin modals, tables
│   ├── ai-report/         # ReportViewer, DownloadPDFButton
│   ├── layout/            # Navbar, Footer
│   ├── pwa/               # PwaProvider, install banner
│   └── ui/                # Shared UI (Toast, Modal, Button...)
├── lib/
│   ├── ai/                # Gemini integration, prompts, report-service
│   ├── context/           # AppContext (global state)
│   ├── data/              # Hanoi locations, districts, streets, amenities
│   ├── gis/               # Planning inspector, cadastral DB, VN-2000 coords
│   ├── leaflet/           # Hanoi map data, fix-icons, geocoding
│   ├── packages/          # Gói đăng tin (Free/Basic/Pro/Agency)
│   ├── payment/           # VNPay, MoMo, invoice service
│   ├── planning/          # Hanoi planning DB (13 quận), planning-utils
│   ├── search/            # Filter logic for listings
│   ├── services/          # listing-service.ts (CRUD abstraction)
│   └── supabase/          # Client, server, queries (auth, listings, users...)
├── public/
│   ├── geojson/           # hanoi-districts-detailed.json (OSM real boundaries)
│   ├── icons/             # PWA icons (192px, 512px, maskable)
│   └── sw.js              # Service Worker for offline PWA
└── types/                 # TypeScript type definitions
``````

---

## 4. ROUTES (PAGES)

### Frontend Pages:
$($pages -join "`n")

### API Routes (Route Handlers):
$($apiRoutes -join "`n")

---

## 5. DATABASE SCHEMA (Supabase / PostgreSQL)

### Enums & Core Types:
``````typescript
$dbTypes
``````

### Key Tables:
- **users** — id, email, full_name, phone, role (user/broker/agency/admin), membership_tier (free/vip1/vip2/vip3)
- **listings** — id, user_id, title, description, price, area, district, ward, street, property_type (house/apartment/villa/land/commercial), listing_type (sale/rent), status (active/pending/sold/rejected/draft/expired), lat/lng, images[], slug
- **appointments** — booking hẹn xem nhà, status (pending/confirmed/cancelled/completed)
- **notifications** — thông báo hệ thống (planning/listing/ai/message/system/appointment)
- **saved_listings** — BĐS yêu thích của user
- **subscriptions** — gói hội viên, payment history
- **planning_zones** — vùng quy hoạch phân khu (từ QCVN 01:2021)

### Row Level Security (RLS):
- Tất cả bảng nhạy cảm đều bật RLS
- User chỉ xem/sửa data của mình
- Admin có full access qua `role = 'admin'`

---

## 6. CONVENTIONS & CODING RULES

### File naming:
- Components: `PascalCase.tsx` (vd: `ListingCard.tsx`)
- Hooks/Utils: `kebab-case.ts` (vd: `use-debounce.ts`)
- API routes: `app/api/[resource]/route.ts`

### Component Rules (Next.js 14 App Router):
- **Server Components** mặc định cho tất cả trong `app/`
- **'use client'** chỉ khi cần: `useState`, `useEffect`, event handlers, Leaflet/Map SDK
- Data fetch: trực tiếp trong Server Component hoặc qua Server Actions

### TypeScript:
- **Không dùng `any`** — mọi entity phải có type trong `@/types/`
- Dùng **Zod** để validate form data và API input
- Response format chuẩn: `{ success: boolean, data?: any, error?: { message: string, code: string } }`

### GIS / Coordinates:
- Toạ độ chuẩn: **(Longitude, Latitude)** — WGS84 EPSG:4326
- Truy vấn không gian: PostGIS functions (`ST_DWithin`, `ST_Contains`, `ST_Intersects`)
- Map layers: Leaflet dùng `(lat, lng)` — cần đảo lại khi đọc từ PostGIS

### Secrets:
- Client-side: `process.env.NEXT_PUBLIC_*`
- Server-side: `process.env.*` (không expose ra client)
- Không hardcode bất kỳ key nào

---

## 7. ENVIRONMENT VARIABLES (.env.local)

``````bash
$envExample
``````

---

## 8. MAP & GIS ARCHITECTURE

### Leaflet Map (Primary — Planning & Search):
- **PlanningMap.tsx**: Bản đồ quy hoạch phân khu với SVG renderer, swipe comparison mode
- **SearchMap.tsx**: Bản đồ tìm kiếm BĐS với clustering markers
- **MapContainer.tsx**: Wrapper chọn loại map
- GeoJSON thực tế: `public/geojson/hanoi-districts-detailed.json` (10 quận OSM)
- Pane riêng `planningPane` cho layer quy hoạch (z-index management)

### Planning Data:
- `lib/planning/hanoi-planning-db.ts`: 13 quận nội thành với zones đầy đủ (coordinates, color, type, areaHa, maxFloors...)
- `lib/planning/planning-utils.ts`: Filter, search, group zones
- Màu sắc theo QCVN 01:2021: ODT(#FFDD29), TMD(#EF4444), HH(#8B5CF6), CX(#22C55E), GT(#3B82F6)...

### GIS Inspector:
- `lib/gis/planning-inspector.ts`: Tra cứu quy hoạch theo lat/lng
- `lib/gis/vn2000.ts`: Chuyển đổi toạ độ WGS84 ↔ VN-2000
- `lib/gis/cadastral-db.ts`: Cơ sở dữ liệu địa chính (sổ đỏ/thửa đất)

---

## 9. AI ENGINE (Google Gemini)

### Files:
- `lib/ai/gemini.ts`: Khởi tạo Gemini client, temperature=0.2
- `lib/ai/prompts.ts`: Few-shot prompts cho phân tích BĐS
- `lib/ai/report-service.ts`: Tổng hợp báo cáo AI
- `app/api/ai/report/route.ts`: Endpoint sinh báo cáo
- `app/api/ai/planning-pdf-analyzer/route.ts`: Phân tích PDF quy hoạch
- `app/api/ai/district-planning-generator/route.ts`: Tạo dữ liệu quy hoạch theo quận

### Output:
- Điểm tiềm năng đầu tư (0–100)
- SWOT analysis (strengths, weaknesses, risks, opportunities)
- Timeline hạ tầng lân cận
- Ước tính giá thị trường
- PDF report qua @react-pdf/renderer

---

## 10. PAYMENT GATEWAY

### VNPay:
- `lib/payment/vnpay.ts`: Tạo URL thanh toán, verify checksum
- `app/api/payment/vnpay/create/route.ts`: Tạo giao dịch
- `app/api/payment/vnpay/ipn/route.ts`: Webhook nhận kết quả
- `app/api/payment/vnpay/return/route.ts`: Return URL

### MoMo:
- `lib/payment/momo.ts`: Tích hợp MoMo payment
- Tương tự flow: create → ipn → return

### Gói hội viên (lib/packages/package-config.ts):
- **Free**: Đăng 3 tin/tháng, xem bản đồ cơ bản
- **VIP1 (Basic)**: Đăng 10 tin, xem quy hoạch chi tiết
- **VIP2 (Pro)**: Đăng 30 tin, AI thẩm định không giới hạn
- **VIP3 (Agency)**: Không giới hạn, white-label, API access

---

## 11. SEO ARCHITECTURE

### URL Structure (Semantic Silo):
``````
Level 1: /mua-ban                           # Category hub
Level 2: /mua-ban/[propertyType]            # Type: can-ho, nha-rieng, dat-nen...
Level 3: /mua-ban/[propertyType]/[district] # District: quan-dong-da, quan-ba-dinh...
Level 4: /mua-ban/[propertyType]/[district]/[slug] # Individual listing
``````

### Slug generation (lib/listing-slug.ts):
- Format: `[tinh-te]-[loai-bds]-[m2]m2-[gia]-[dia-chi-slug]-[id6]`
- Permanent redirect từ legacy ID-based URLs
- Collision resolution cho duplicate slugs

### Meta tags:
- Dynamic OG images qua @vercel/og
- Structured data JSON-LD cho từng listing
- Sitemap.xml tự động

---

## 12. PWA (Progressive Web App)

- **Service Worker**: `public/sw.js` — cache-first cho static assets, network-first cho API
- **Manifest**: `public/manifest.json` + `app/manifest.ts`
- **Install banner**: `components/pwa/PwaProvider.tsx`
- **Offline page**: `app/offline/page.tsx`
- **Icons**: 192px, 512px, maskable variants

---

## 13. GLOBAL STATE (AppContext)

``````typescript
// lib/context/AppContext.tsx
interface AppState {
  listings: Listing[]
  planningZones: PlanningZoneItem[]
  selectedPlanningZoneId: string | null
  activeDistrict: string
  // ... search filters, user session
}
``````

---

## 14. COMMIT WORKFLOW

- **Branch**: `main` (direct push — không dùng PR)
- **Convention**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Sau mỗi task**: commit + push ngay lên `origin/main`
- **Không tạo Pull Request** — push trực tiếp

---

## 15. KEY FILES TO UNDERSTAND FIRST

Nếu bạn là AI mới đọc tài liệu này, đọc theo thứ tự sau:

1. `AGENTS.md` — Rules & persona cho AI Agent
2. `lib/supabase/database.types.ts` — Schema toàn bộ database
3. `lib/context/AppContext.tsx` — Global state management
4. `components/map/PlanningMap.tsx` — Map phức tạp nhất (1300+ lines)
5. `lib/planning/hanoi-planning-db.ts` — Dữ liệu quy hoạch 13 quận
6. `lib/services/listing-service.ts` — CRUD listings abstraction
7. `app/page.tsx` — Homepage (entry point)
8. `.env.example` — Tất cả environment variables cần thiết

---

*Generated by: scripts/generate-context.ps1 | $(Get-Date -Format "yyyy-MM-dd HH:mm") | HaNoi Realty Platform*
"@

# ── Write output ─────────────────────────────────────────────
$md | Set-Content $out -Encoding UTF8
Write-Host ""
Write-Host "✅ PROJECT_CONTEXT.md đã được tạo!" -ForegroundColor Green
Write-Host "📁 File: $out" -ForegroundColor Cyan
Write-Host "📏 Kích thước: $([Math]::Round((Get-Item $out).Length / 1KB, 1)) KB" -ForegroundColor Cyan
Write-Host ""
Write-Host "👉 Cách dùng: Copy nội dung file PROJECT_CONTEXT.md và paste vào đầu" -ForegroundColor Yellow
Write-Host "   conversation với AI chatbot mới để nó hiểu dự án ngay lập tức." -ForegroundColor Yellow
Write-Host ""
