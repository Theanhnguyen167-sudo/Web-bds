# ðŸ“‹ PROJECT CONTEXT â€” HaNoi Realty Platform
> Auto-generated: 2026-10-13 23:06 | Script: scripts/generate-context.ps1
> **Má»¥c Ä‘Ã­ch:** TÃ i liá»‡u nÃ y Ä‘Æ°á»£c táº¡o tá»± Ä‘á»™ng Ä‘á»ƒ AI Agent / LLM khÃ¡c cÃ³ thá»ƒ
> Ä‘á»c vÃ  hiá»ƒu toÃ n bá»™ kiáº¿n trÃºc, stack vÃ  convention cá»§a dá»± Ã¡n nÃ y.

---

## 1. Tá»”NG QUAN Dá»° ÃN

**TÃªn dá»± Ã¡n:** HaNoi Realty â€” Ná»n táº£ng BÄS, Tra cá»©u Quy hoáº¡ch & Tháº©m Ä‘á»‹nh AI HÃ  Ná»™i
**GitHub:** https://github.com/Theanhnguyen167-sudo/Web-bds
**Stack chÃ­nh:** Next.js 14 App Router + TypeScript + Supabase + Leaflet + Google Gemini AI
**Triá»ƒn khai:** Vercel (production-ready)

### MÃ´ táº£ nghiá»‡p vá»¥
Ná»n táº£ng PropTech tháº¿ há»‡ má»›i cho thá»‹ trÆ°á»ng BÄS HÃ  Ná»™i, bao gá»“m:
- TÃ¬m kiáº¿m & Ä‘Äƒng tin BÄS (mua bÃ¡n, cho thuÃª) vá»›i báº£n Ä‘á»“ tÆ°Æ¡ng tÃ¡c
- Báº£n Ä‘á»“ quy hoáº¡ch phÃ¢n khu HÃ  Ná»™i 2030â€“2045 theo chuáº©n QCVN 01:2021
- Tháº©m Ä‘á»‹nh & Ä‘á»‹nh giÃ¡ BÄS báº±ng Google Gemini 1.5 Pro AI
- Thanh toÃ¡n gÃ³i há»™i viÃªn qua VNPay & MoMo
- Progressive Web App (PWA) há»— trá»£ offline
- Admin dashboard quáº£n lÃ½ toÃ n há»‡ thá»‘ng

---

## 2. TECH STACK & DEPENDENCIES

```json
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
```

### Dependencies Ä‘áº§y Ä‘á»§:
  - @google/generative-ai: ^0.21.0
  - @hookform/resolvers: ^3.9.0
  - @radix-ui/react-avatar: ^1.1.0
  - @radix-ui/react-dialog: ^1.1.1
  - @radix-ui/react-dropdown-menu: ^2.1.1
  - @radix-ui/react-label: ^2.1.0
  - @radix-ui/react-select: ^2.1.1
  - @radix-ui/react-slider: ^1.2.0
  - @radix-ui/react-slot: ^1.1.0
  - @radix-ui/react-switch: ^1.1.0
  - @radix-ui/react-tabs: ^1.1.0
  - @radix-ui/react-toast: ^1.2.1
  - @react-pdf/renderer: ^3.4.4
  - @supabase/ssr: ^0.5.1
  - @supabase/supabase-js: ^2.45.4
  - @vercel/og: ^1.0.0
  - axios: ^1.19.0
  - class-variance-authority: ^0.7.0
  - clsx: ^2.1.1
  - crypto-js: ^4.2.0
  - firebase: ^12.19.0
  - framer-motion: ^11.5.4
  - html2canvas: ^1.4.1
  - leaflet: ^1.9.4
  - lucide-react: ^0.441.0
  - mapbox-gl: ^3.6.0
  - next: ^14.2.10
  - react: ^18.3.1
  - react-dom: ^18.3.1
  - react-dropzone: ^14.2.3
  - react-hook-form: ^7.53.0
  - react-leaflet: ^4.2.1
  - react-leaflet-cluster: ^4.1.3
  - react-map-gl: ^7.1.7
  - recharts: ^3.10.1
  - tailwind-merge: ^2.5.2
  - tailwindcss-animate: ^1.0.7
  - zod: ^3.23.8

---

## 3. Cáº¤U TRÃšC THÆ¯ Má»¤C (DIRECTORY STRUCTURE)

```
Web bds/
â”œâ”€â”€ app/                    # Next.js 14 App Router pages
â”‚   â”œâ”€â”€ (auth)/            # Login, Register (Route Group)
â”‚   â”œâ”€â”€ admin/             # Admin dashboard (listings, users, analytics...)
â”‚   â”œâ”€â”€ api/               # Route Handlers (REST API)
â”‚   â”œâ”€â”€ dashboard/         # User dashboard
â”‚   â”œâ”€â”€ listing/           # Chi tiáº¿t tin Ä‘Äƒng
â”‚   â”œâ”€â”€ mua-ban/           # SEO routes: /mua-ban/[type]/[district]/[slug]
â”‚   â”œâ”€â”€ cho-thue/          # Cho thuÃª BÄS
â”‚   â”œâ”€â”€ planning/          # Báº£n Ä‘á»“ quy hoáº¡ch HÃ  Ná»™i
â”‚   â”œâ”€â”€ search/            # TÃ¬m kiáº¿m BÄS
â”‚   â”œâ”€â”€ pricing/           # Báº£ng giÃ¡ gÃ³i há»™i viÃªn
â”‚   â”œâ”€â”€ payment/           # Checkout, VNPay return, MoMo return
â”‚   â”œâ”€â”€ reports/           # BÃ¡o cÃ¡o tháº©m Ä‘á»‹nh AI
â”‚   â”œâ”€â”€ news/              # Tin tá»©c BÄS
â”‚   â””â”€â”€ streets/           # Háº¡ táº§ng & tuyáº¿n Ä‘Æ°á»ng HÃ  Ná»™i
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ map/               # PlanningMap, SearchMap, MapContainer, HybridMap...
â”‚   â”œâ”€â”€ listing/           # ListingCard, CreateListingWizard...
â”‚   â”œâ”€â”€ admin/             # Admin modals, tables
â”‚   â”œâ”€â”€ ai-report/         # ReportViewer, DownloadPDFButton
â”‚   â”œâ”€â”€ layout/            # Navbar, Footer
â”‚   â”œâ”€â”€ pwa/               # PwaProvider, install banner
â”‚   â””â”€â”€ ui/                # Shared UI (Toast, Modal, Button...)
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ ai/                # Gemini integration, prompts, report-service
â”‚   â”œâ”€â”€ context/           # AppContext (global state)
â”‚   â”œâ”€â”€ data/              # Hanoi locations, districts, streets, amenities
â”‚   â”œâ”€â”€ gis/               # Planning inspector, cadastral DB, VN-2000 coords
â”‚   â”œâ”€â”€ leaflet/           # Hanoi map data, fix-icons, geocoding
â”‚   â”œâ”€â”€ packages/          # GÃ³i Ä‘Äƒng tin (Free/Basic/Pro/Agency)
â”‚   â”œâ”€â”€ payment/           # VNPay, MoMo, invoice service
â”‚   â”œâ”€â”€ planning/          # Hanoi planning DB (13 quáº­n), planning-utils
â”‚   â”œâ”€â”€ search/            # Filter logic for listings
â”‚   â”œâ”€â”€ services/          # listing-service.ts (CRUD abstraction)
â”‚   â””â”€â”€ supabase/          # Client, server, queries (auth, listings, users...)
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ geojson/           # hanoi-districts-detailed.json (OSM real boundaries)
â”‚   â”œâ”€â”€ icons/             # PWA icons (192px, 512px, maskable)
â”‚   â””â”€â”€ sw.js              # Service Worker for offline PWA
â””â”€â”€ types/                 # TypeScript type definitions
```

---

## 4. ROUTES (PAGES)

### Frontend Pages:
  C:\Users\Admin\Downloads\Web bds\app
  C:\Users\Admin\Downloads\Web bds\app\(auth)\login
  C:\Users\Admin\Downloads\Web bds\app\(auth)\register
  C:\Users\Admin\Downloads\Web bds\app\about
  C:\Users\Admin\Downloads\Web bds\app\admin
  C:\Users\Admin\Downloads\Web bds\app\admin\analytics
  C:\Users\Admin\Downloads\Web bds\app\admin\articles
  C:\Users\Admin\Downloads\Web bds\app\admin\articles\new
  C:\Users\Admin\Downloads\Web bds\app\admin\articles\[id]\edit
  C:\Users\Admin\Downloads\Web bds\app\admin\listings
  C:\Users\Admin\Downloads\Web bds\app\admin\listings\create
  C:\Users\Admin\Downloads\Web bds\app\admin\listings\[id]
  C:\Users\Admin\Downloads\Web bds\app\admin\packages
  C:\Users\Admin\Downloads\Web bds\app\admin\payments
  C:\Users\Admin\Downloads\Web bds\app\admin\planning
  C:\Users\Admin\Downloads\Web bds\app\admin\reports
  C:\Users\Admin\Downloads\Web bds\app\admin\settings
  C:\Users\Admin\Downloads\Web bds\app\admin\users
  C:\Users\Admin\Downloads\Web bds\app\admin\users\[id]
  C:\Users\Admin\Downloads\Web bds\app\cho-thue
  C:\Users\Admin\Downloads\Web bds\app\dashboard
  C:\Users\Admin\Downloads\Web bds\app\khu-vuc\[slug]
  C:\Users\Admin\Downloads\Web bds\app\listings\create
  C:\Users\Admin\Downloads\Web bds\app\listings\[id]
  C:\Users\Admin\Downloads\Web bds\app\mua-ban
  C:\Users\Admin\Downloads\Web bds\app\mua-ban\[propertyType]
  C:\Users\Admin\Downloads\Web bds\app\mua-ban\[propertyType]\[district]
  C:\Users\Admin\Downloads\Web bds\app\mua-ban\[propertyType]\[district]\[slug]
  C:\Users\Admin\Downloads\Web bds\app\news
  C:\Users\Admin\Downloads\Web bds\app\offline
  C:\Users\Admin\Downloads\Web bds\app\payment\checkout
  C:\Users\Admin\Downloads\Web bds\app\payment\error
  C:\Users\Admin\Downloads\Web bds\app\payment\momo\return
  C:\Users\Admin\Downloads\Web bds\app\payment\processing
  C:\Users\Admin\Downloads\Web bds\app\payment\success
  C:\Users\Admin\Downloads\Web bds\app\payment\test
  C:\Users\Admin\Downloads\Web bds\app\payment\vnpay\return
  C:\Users\Admin\Downloads\Web bds\app\planning
  C:\Users\Admin\Downloads\Web bds\app\post-property
  C:\Users\Admin\Downloads\Web bds\app\post-property\[step]
  C:\Users\Admin\Downloads\Web bds\app\pricing
  C:\Users\Admin\Downloads\Web bds\app\reports
  C:\Users\Admin\Downloads\Web bds\app\reports\[id]
  C:\Users\Admin\Downloads\Web bds\app\search
  C:\Users\Admin\Downloads\Web bds\app\streets

### API Routes (Route Handlers):
  /api/C:/Users/Admin/Downloads/Web bds/app/api/ai/district-planning-generator
  /api/C:/Users/Admin/Downloads/Web bds/app/api/ai/planning-pdf-analyzer
  /api/C:/Users/Admin/Downloads/Web bds/app/api/ai/report
  /api/C:/Users/Admin/Downloads/Web bds/app/api/bookings
  /api/C:/Users/Admin/Downloads/Web bds/app/api/geocode
  /api/C:/Users/Admin/Downloads/Web bds/app/api/listings
  /api/C:/Users/Admin/Downloads/Web bds/app/api/listings/[id]
  /api/C:/Users/Admin/Downloads/Web bds/app/api/map/nearby-amenities
  /api/C:/Users/Admin/Downloads/Web bds/app/api/payment/momo/create
  /api/C:/Users/Admin/Downloads/Web bds/app/api/payment/momo/ipn
  /api/C:/Users/Admin/Downloads/Web bds/app/api/payment/momo/status
  /api/C:/Users/Admin/Downloads/Web bds/app/api/payment/vnpay
  /api/C:/Users/Admin/Downloads/Web bds/app/api/payment/vnpay/create
  /api/C:/Users/Admin/Downloads/Web bds/app/api/payment/vnpay/ipn
  /api/C:/Users/Admin/Downloads/Web bds/app/api/payment/vnpay/return
  /api/C:/Users/Admin/Downloads/Web bds/app/api/reports/generate-pdf
  /api/C:/Users/Admin/Downloads/Web bds/app/api/sync-user

---

## 5. DATABASE SCHEMA (Supabase / PostgreSQL)

### Enums & Core Types:
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'broker' | 'agency' | 'admin';
export type MembershipTier = 'free' | 'vip1' | 'vip2' | 'vip3';
export type PropertyType = 'house' | 'apartment' | 'villa' | 'land' | 'commercial';
export type ListingType = 'sale' | 'rent';
export type ListingStatus = 'active' | 'pending' | 'sold' | 'rejected' | 'draft' | 'expired';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type NotificationCategory = 'planning' | 'listing' | 'ai' | 'message' | 'system' | 'appointment';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type ProjectStatus = 'planning' | 'construction' | 'completed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          membership_tier: MembershipTier;
          membership_expires_at: string | null;
          notification_preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          membership_tier?: MembershipTier;
          membership_expires_at?: string | null;
          notification_preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
```

### Key Tables:
- **users** â€” id, email, full_name, phone, role (user/broker/agency/admin), membership_tier (free/vip1/vip2/vip3)
- **listings** â€” id, user_id, title, description, price, area, district, ward, street, property_type (house/apartment/villa/land/commercial), listing_type (sale/rent), status (active/pending/sold/rejected/draft/expired), lat/lng, images[], slug
- **appointments** â€” booking háº¹n xem nhÃ , status (pending/confirmed/cancelled/completed)
- **notifications** â€” thÃ´ng bÃ¡o há»‡ thá»‘ng (planning/listing/ai/message/system/appointment)
- **saved_listings** â€” BÄS yÃªu thÃ­ch cá»§a user
- **subscriptions** â€” gÃ³i há»™i viÃªn, payment history
- **planning_zones** â€” vÃ¹ng quy hoáº¡ch phÃ¢n khu (tá»« QCVN 01:2021)

### Row Level Security (RLS):
- Táº¥t cáº£ báº£ng nháº¡y cáº£m Ä‘á»u báº­t RLS
- User chá»‰ xem/sá»­a data cá»§a mÃ¬nh
- Admin cÃ³ full access qua ole = 'admin'

---

## 6. CONVENTIONS & CODING RULES

### File naming:
- Components: PascalCase.tsx (vd: ListingCard.tsx)
- Hooks/Utils: kebab-case.ts (vd: use-debounce.ts)
- API routes: pp/api/[resource]/route.ts

### Component Rules (Next.js 14 App Router):
- **Server Components** máº·c Ä‘á»‹nh cho táº¥t cáº£ trong pp/
- **'use client'** chá»‰ khi cáº§n: useState, useEffect, event handlers, Leaflet/Map SDK
- Data fetch: trá»±c tiáº¿p trong Server Component hoáº·c qua Server Actions

### TypeScript:
- **KhÃ´ng dÃ¹ng ny** â€” má»i entity pháº£i cÃ³ type trong @/types/
- DÃ¹ng **Zod** Ä‘á»ƒ validate form data vÃ  API input
- Response format chuáº©n: { success: boolean, data?: any, error?: { message: string, code: string } }

### GIS / Coordinates:
- Toáº¡ Ä‘á»™ chuáº©n: **(Longitude, Latitude)** â€” WGS84 EPSG:4326
- Truy váº¥n khÃ´ng gian: PostGIS functions (ST_DWithin, ST_Contains, ST_Intersects)
- Map layers: Leaflet dÃ¹ng (lat, lng) â€” cáº§n Ä‘áº£o láº¡i khi Ä‘á»c tá»« PostGIS

### Secrets:
- Client-side: process.env.NEXT_PUBLIC_*
- Server-side: process.env.* (khÃ´ng expose ra client)
- KhÃ´ng hardcode báº¥t ká»³ key nÃ o

---

## 7. ENVIRONMENT VARIABLES (.env.local)

```bash
# ==============================================================================
# 🏛️ HANOI PROPTECH PLATFORM - MẪU BIẾN MÔI TRƯỜNG (.env.example)
# ==============================================================================
# HƯỚNG DẪN DÀNH CHO 8 THÀNH VIÊN TRONG NHÓM:
# 1. Copy toàn bộ nội dung file này hoặc chạy lệnh: cp .env.example .env.local
# 2. Tạo một file tên là `.env.local` ở thư mục gốc của dự án và dán nội dung vào.
# 3. Chạy lệnh: npm run dev
# Lưu ý: Các key dưới đây đã có sẵn giá trị Sandbox/Test để bạn chạy được ngay!
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. 🌐 CẤU HÌNH DOMAIN & ỨNG DỤNG (APP CONFIG)
# ------------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ------------------------------------------------------------------------------
# 2. 🗄️ SUPABASE (DATABASE POSTGRESQL + POSTGIS + AUTH + STORAGE)
# Dự án: Hanoi Real Estate Platform
# Lấy key tại: https://supabase.com/dashboard/project/xdqfxsszpglbgvpcqfss/settings/api
# ------------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://xdqfxsszpglbgvpcqfss.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju
# (Tùy chọn cho Server-side Admin, không bắt buộc ở local)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ------------------------------------------------------------------------------
# 3. 🔥 FIREBASE (XÁC THỰC GOOGLE OAUTH & CLOUD STORAGE)
# Console: https://console.firebase.google.com/u/0/project/hanoi-realty
# ------------------------------------------------------------------------------
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDwucqCf_hTJHBZxoafY2uaiy2hHGwo4qs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hanoi-realty.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hanoi-realty
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hanoi-realty.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=768749724447
NEXT_PUBLIC_FIREBASE_APP_ID=1:768749724447:web:daf873332be0abcd67862a

# ------------------------------------------------------------------------------
# 4. 🗺️ MAPBOX GL JS (BẢN ĐỒ VỆ TINH & ĐỊNH VỊ)
# Đăng ký lấy token miễn phí tại: https://account.mapbox.com/access-tokens/
# ------------------------------------------------------------------------------
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiYWRtaW4taGFub2kiLCJhIjoiY2x6c2FtcGxlMDAwMG1rMWsyMWJmMGVjYSJ9.demo_token_or_use_leaflet
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/satellite-streets-v12

# ------------------------------------------------------------------------------
# 5. 🤖 GOOGLE GEMINI 1.5 PRO (AI THẨM ĐỊNH & PHÂN TÍCH QUY HOẠCH)
# Lấy API Key miễn phí 100% tại: https://aistudio.google.com/app/apikey
# ------------------------------------------------------------------------------
GEMINI_API_KEY=AIzaSy_your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro

# ------------------------------------------------------------------------------
# 6. 💳 CỔNG THANH TOÁN VNPAY (MÔI TRƯỜNG TEST SANDBOX)
# Tài liệu test VNPay: https://sandbox.vnpayment.vn/
# Thẻ test: Ngân hàng NCB - Số thẻ: 9704198526191432198 - Tên: NGUYEN VAN A - Ngày phát hành: 07/15 - OTP: 123456
# ------------------------------------------------------------------------------
VNPAY_TMN_CODE=DEMO1234
VNPAY_HASH_SECRET=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

---

## 8. MAP & GIS ARCHITECTURE

### Leaflet Map (Primary â€” Planning & Search):
- **PlanningMap.tsx**: Báº£n Ä‘á»“ quy hoáº¡ch phÃ¢n khu vá»›i SVG renderer, swipe comparison mode
- **SearchMap.tsx**: Báº£n Ä‘á»“ tÃ¬m kiáº¿m BÄS vá»›i clustering markers
- **MapContainer.tsx**: Wrapper chá»n loáº¡i map
- GeoJSON thá»±c táº¿: public/geojson/hanoi-districts-detailed.json (10 quáº­n OSM)
- Pane riÃªng planningPane cho layer quy hoáº¡ch (z-index management)

### Planning Data:
- lib/planning/hanoi-planning-db.ts: 13 quáº­n ná»™i thÃ nh vá»›i zones Ä‘áº§y Ä‘á»§ (coordinates, color, type, areaHa, maxFloors...)
- lib/planning/planning-utils.ts: Filter, search, group zones
- MÃ u sáº¯c theo QCVN 01:2021: ODT(#FFDD29), TMD(#EF4444), HH(#8B5CF6), CX(#22C55E), GT(#3B82F6)...

### GIS Inspector:
- lib/gis/planning-inspector.ts: Tra cá»©u quy hoáº¡ch theo lat/lng
- lib/gis/vn2000.ts: Chuyá»ƒn Ä‘á»•i toáº¡ Ä‘á»™ WGS84 â†” VN-2000
- lib/gis/cadastral-db.ts: CÆ¡ sá»Ÿ dá»¯ liá»‡u Ä‘á»‹a chÃ­nh (sá»• Ä‘á»/thá»­a Ä‘áº¥t)

---

## 9. AI ENGINE (Google Gemini)

### Files:
- lib/ai/gemini.ts: Khá»Ÿi táº¡o Gemini client, temperature=0.2
- lib/ai/prompts.ts: Few-shot prompts cho phÃ¢n tÃ­ch BÄS
- lib/ai/report-service.ts: Tá»•ng há»£p bÃ¡o cÃ¡o AI
- pp/api/ai/report/route.ts: Endpoint sinh bÃ¡o cÃ¡o
- pp/api/ai/planning-pdf-analyzer/route.ts: PhÃ¢n tÃ­ch PDF quy hoáº¡ch
- pp/api/ai/district-planning-generator/route.ts: Táº¡o dá»¯ liá»‡u quy hoáº¡ch theo quáº­n

### Output:
- Äiá»ƒm tiá»m nÄƒng Ä‘áº§u tÆ° (0â€“100)
- SWOT analysis (strengths, weaknesses, risks, opportunities)
- Timeline háº¡ táº§ng lÃ¢n cáº­n
- Æ¯á»›c tÃ­nh giÃ¡ thá»‹ trÆ°á»ng
- PDF report qua @react-pdf/renderer

---

## 10. PAYMENT GATEWAY

### VNPay:
- lib/payment/vnpay.ts: Táº¡o URL thanh toÃ¡n, verify checksum
- pp/api/payment/vnpay/create/route.ts: Táº¡o giao dá»‹ch
- pp/api/payment/vnpay/ipn/route.ts: Webhook nháº­n káº¿t quáº£
- pp/api/payment/vnpay/return/route.ts: Return URL

### MoMo:
- lib/payment/momo.ts: TÃ­ch há»£p MoMo payment
- TÆ°Æ¡ng tá»± flow: create â†’ ipn â†’ return

### GÃ³i há»™i viÃªn (lib/packages/package-config.ts):
- **Free**: ÄÄƒng 3 tin/thÃ¡ng, xem báº£n Ä‘á»“ cÆ¡ báº£n
- **VIP1 (Basic)**: ÄÄƒng 10 tin, xem quy hoáº¡ch chi tiáº¿t
- **VIP2 (Pro)**: ÄÄƒng 30 tin, AI tháº©m Ä‘á»‹nh khÃ´ng giá»›i háº¡n
- **VIP3 (Agency)**: KhÃ´ng giá»›i háº¡n, white-label, API access

---

## 11. SEO ARCHITECTURE

### URL Structure (Semantic Silo):
```
Level 1: /mua-ban                           # Category hub
Level 2: /mua-ban/[propertyType]            # Type: can-ho, nha-rieng, dat-nen...
Level 3: /mua-ban/[propertyType]/[district] # District: quan-dong-da, quan-ba-dinh...
Level 4: /mua-ban/[propertyType]/[district]/[slug] # Individual listing
```

### Slug generation (lib/listing-slug.ts):
- Format: [tinh-te]-[loai-bds]-[m2]m2-[gia]-[dia-chi-slug]-[id6]
- Permanent redirect tá»« legacy ID-based URLs
- Collision resolution cho duplicate slugs

### Meta tags:
- Dynamic OG images qua @vercel/og
- Structured data JSON-LD cho tá»«ng listing
- Sitemap.xml tá»± Ä‘á»™ng

---

## 12. PWA (Progressive Web App)

- **Service Worker**: public/sw.js â€” cache-first cho static assets, network-first cho API
- **Manifest**: public/manifest.json + pp/manifest.ts
- **Install banner**: components/pwa/PwaProvider.tsx
- **Offline page**: pp/offline/page.tsx
- **Icons**: 192px, 512px, maskable variants

---

## 13. GLOBAL STATE (AppContext)

```typescript
// lib/context/AppContext.tsx
interface AppState {
  listings: Listing[]
  planningZones: PlanningZoneItem[]
  selectedPlanningZoneId: string | null
  activeDistrict: string
  // ... search filters, user session
}
```

---

## 14. COMMIT WORKFLOW

- **Branch**: main (direct push â€” khÃ´ng dÃ¹ng PR)
- **Convention**: Conventional Commits (eat:, ix:, chore:, docs:)
- **Sau má»—i task**: commit + push ngay lÃªn origin/main
- **KhÃ´ng táº¡o Pull Request** â€” push trá»±c tiáº¿p

---

## 15. KEY FILES TO UNDERSTAND FIRST

Náº¿u báº¡n lÃ  AI má»›i Ä‘á»c tÃ i liá»‡u nÃ y, Ä‘á»c theo thá»© tá»± sau:

1. AGENTS.md â€” Rules & persona cho AI Agent
2. lib/supabase/database.types.ts â€” Schema toÃ n bá»™ database
3. lib/context/AppContext.tsx â€” Global state management
4. components/map/PlanningMap.tsx â€” Map phá»©c táº¡p nháº¥t (1300+ lines)
5. lib/planning/hanoi-planning-db.ts â€” Dá»¯ liá»‡u quy hoáº¡ch 13 quáº­n
6. lib/services/listing-service.ts â€” CRUD listings abstraction
7. pp/page.tsx â€” Homepage (entry point)
8. .env.example â€” Táº¥t cáº£ environment variables cáº§n thiáº¿t

---

*Generated by: scripts/generate-context.ps1 | 2026-10-13 23:06 | HaNoi Realty Platform*
