# 🏙️ HaNoi Realty — Nền Tảng BĐS, Tra Cứu Quy Hoạch & Thẩm Định AI Hà Nội

<p align="center">
  <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&auto=format&fit=crop&q=80" alt="HaNoi Realty Banner" width="100%" style="border-radius: 16px;" />
</p>

<p align="center">
  <strong>Nền tảng PropTech thế hệ mới cho thị trường Bất Động Sản Thủ Đô Hà Nội</strong><br>
  Tích hợp bản đồ quy hoạch phân khu 2030–2045, công nghệ thẩm định tiềm năng đầu tư bằng Google Gemini 1.5 Pro AI và đồng bộ thiết kế từ Google Stitch.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-11.5-f43f5e?style=for-the-badge&logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Google_Gemini-1.5_Pro-4285F4?style=for-the-badge&logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Deploy-Vercel_Ready-000000?style=for-the-badge&logo=vercel" alt="Vercel Ready" />
</p>

---

## 🌟 1. TÍNH NĂNG NỔI BẬT (CORE FEATURES)

### 🗺️ 1. Bản Đồ Tương Tác & Lớp Phủ Quy Hoạch 2030 (Interactive GIS Map)
- Mô phỏng bản đồ số Hà Nội với hệ toạ độ WGS84, định vị Sông Hồng, Hồ Tây và mạng lưới giao thông.
- Hiển thị trực quan các phân khu quy hoạch đô thị: **Đất ở đô thị (Xanh dương)**, **Đất thương mại dịch vụ (Đỏ/Hồng)**, **Đất công viên cây xanh (Xanh lá)**, **Đất hạ tầng giao thông (Vàng)**.
- Đánh dấu các tuyến đường sắt đô thị trọng điểm: **Metro Tuyến 2A (Cát Linh - Hà Đông)** và **Metro Tuyến 3 (Nhổn - Ga Hà Nội)**.
- Ghim vị trí BĐS với thẻ giá động, hỗ trợ phân cụm (clustering) và popup xem nhanh.

### 🤖 2. Thẩm Định & Định Giá Bất Động Sản Bằng AI (AI Valuation Engine)
- Tích hợp **Google Gemini 1.5 Pro** phân tích vị trí, pháp lý, đơn giá/m² và tiềm năng tăng trưởng.
- Vòng tròn điểm số SVG chạy mượt mà từ `0 ➔ 82/100` trong 1.5 giây.
- Phân tích đa chiều: Điểm tăng trưởng, tính thanh khoản, ma trận SWOT (Ưu điểm / Nhược điểm / Rủi ro pháp lý).
- Timeline khoảng cách tới các dự án hạ tầng lớn lân cận (Metro, Vành đai, Trường học, Bệnh viện).

### 🛣️ 3. Danh Mục Tuyến Đường & Hạ Tầng Giao Thông (`/streets`)
- Tra cứu hơn 20+ tuyến phố trung tâm thuộc 12 quận nội thành Hà Nội.
- Thông số chi tiết: Chiều dài, lộ giới mặt đường, quy hoạch mở rộng, đơn giá đất thị trường trung bình và tuyến Metro kết nối.
- Bản đồ thông tin mạng lưới các tuyến Metro đô thị và 6 trục Đường Vành đai thủ đô.

### ➕ 4. Wizard Đăng Tin BĐS 5 Bước Thông Minh (`/listings/create`)
- **Bước 1:** Chọn loại hình BĐS (Chung cư, Nhà riêng, Biệt thự, Đất nền, Mặt phố).
- **Bước 2:** Chọn vị trí & Click ghim toạ độ trực tiếp trên bản đồ Hà Nội.
- **Bước 3:** Kéo thả hình ảnh với tính năng Preview và đặt ảnh đại diện.
- **Bước 4:** Nhập diện tích, giá bán ➔ Hệ thống tự động tính đơn giá triệu/m² theo thời gian thực.
- **Bước 5:** Xem trước giao diện thực tế (Live Preview Card) và xuất bản tin.

### 💳 5. Bảng Giá Gói Hội Viên & Thanh Toán VNPay (`/pricing`)
- 4 gói dịch vụ tối ưu: **Miễn phí (Free)**, **Cơ bản (Basic)**, **Chuyên nghiệp (Pro)**, **Doanh nghiệp (Agency)**.
- Bộ chuyển đổi chu kỳ thanh toán Tháng / Năm với huy hiệu ưu đãi giảm 20%.
- Tích hợp hàm tạo URL thanh toán và xác thực Checksum SHA-512 chuẩn bảo mật cổng **VNPay Sandbox**.

### 📊 6. Bảng Điều Khiển Môi Giới & Đồng Bộ Google Stitch (`/dashboard`)
- Thống kê lượt xem tin đăng, BĐS đang hoạt động, số lượt báo cáo AI còn lại.
- Quản lý tin đăng (Xem chi tiết, Xoá tin, Kích hoạt báo cáo AI).
- Tab **Google Stitch Design Sync**: Quản lý khóa API, kiểm tra tình trạng đồng bộ 6 màn hình giao diện chính.

---

## 🏗️ 2. CÔNG NGHỆ SỬ DỤNG (TECH STACK)

| Thành Phần | Công Nghệ | Vai Trò |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server Components, File-based routing, API Route Handlers |
| **Ngôn ngữ** | TypeScript (Strict Mode) | Đảm bảo an toàn kiểu dữ liệu 100%, không sử dụng `any` |
| **Styling** | Tailwind CSS + Lucide Icons | Hệ thống Design Tokens chuẩn: Deep Navy (`#1a2744`) & Accent Orange (`#f97316`) |
| **Animation** | Framer Motion 11 | Hiệu ứng chuyển tab `layoutId`, modal spring animation, hover lift cards |
| **AI Intelligence**| Google Gemini 1.5 Pro | Thẩm định BĐS, phân tích quy hoạch, đề xuất chiến lược đầu tư |
| **Cơ sở dữ liệu** | PostgreSQL + PostGIS (Supabase) | Lưu trữ không gian toạ độ WGS84 (`EPSG:4326`), truy vấn `ST_DWithin` |
| **Cổng thanh toán**| VNPay Gateway SDK | Tạo giao dịch thanh toán trực tuyến bảo mật SHA-512 |
| **Design System** | Google Stitch AI MCP Proxy | Đồng bộ tự động Tokens và UI Components |
| **Triển khai** | Vercel Serverless | Tối ưu CDN, hỗ trợ CI/CD tự động khi push GitHub |

---

## 📁 3. CẤU TRÚC MÃ NGUỒN (PROJECT STRUCTURE)

```
Web bds/
├── 📁 app/                          # Next.js App Router (Pages & API Routes)
│   ├── layout.tsx                   # Root Layout & nạp Google Font Inter
│   ├── page.tsx                     # 🏠 Trang chủ (Map + Sidebar đồng bộ)
│   ├── (auth)/                      # Đăng nhập & Đăng ký
│   ├── listings/                    # Chi tiết BĐS & Wizard đăng tin 5 bước
│   ├── reports/[id]/                # Báo cáo Thẩm định AI chuyên sâu
│   ├── streets/                     # 🛣️ Danh mục Tuyến đường & Metro Hà Nội
│   ├── pricing/                     # Bảng giá gói hội viên VIP
│   ├── dashboard/                   # Quản lý tin đăng & Google Stitch Sync
│   └── api/                         # Backend REST API Handlers (AI, VNPay, Listings, Stitch)
│
├── 📁 components/                   # React UI Components
│   ├── layout/                      # Navbar, Sidebar, Header
│   ├── map/                         # MapContainer, PropertyMarker, PropertyPopup, PlanningLegend
│   ├── listing/                     # ListingCard, CreateListingWizard
│   ├── ai-report/                   # ReportViewer (Vòng tròn SVG 82/100)
│   ├── membership/                  # PricingTable (VIP Tiers)
│   └── ui/                          # Toast Notification Container
│
├── 📁 lib/                          # Data, Tiện ích & SDK Clients
│   ├── data/hanoi-streets.ts        # Danh mục Tuyến đường, Metro, Vành đai
│   ├── mock-data.ts                 # 9 BĐS thực tế tại Hà Nội, Mock User, AI Report
│   ├── utils.ts                     # Format tiền tệ VNĐ (tỷ, triệu, tr/m²)
│   ├── context/AppContext.tsx       # State toàn cục (Auth, Favorites, Active Pin, Toasts)
│   ├── ai/                          # Gemini 1.5 Pro Client & Prompt Thẩm định
│   └── payment/vnpay.ts             # Xử lý URL & Checksum thanh toán VNPay
│
├── 📁 types/                        # TypeScript Strict Interfaces
├── 📁 docs/                         # Tài liệu kiến trúc & Script SQL PostGIS
├── 📁 public/                       # GeoJSON ranh giới & quy hoạch Hà Nội
├── 🤖 AGENTS.md                     # Quy chuẩn hệ thống AI Coding Agent
├── ⚙️ next.config.mjs               # Tối ưu hóa Build Production & Remote Images
└── ☁️ vercel.json                   # Cấu hình triển khai tự động lên Vercel
```

---

## 🚀 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL (LOCAL SETUP)

### Bước 1: Clone Repository
```bash
git clone https://github.com/Theanhnguyen167-sudo/Web-bds.git
cd "Web bds"
```

### Bước 2: Cài Đặt Thư Viện
```bash
npm install --legacy-peer-deps
```

### Bước 3: Cấu Hình Biến Môi Trường
Tạo file `.env.local` tại thư mục gốc của dự án:
```env
# 1. Google Stitch Design & UI Sync
STITCH_API_KEY=AQ.Ab8RN6IZHLmSH1J7xdlYndtnZm6fJi2_YExaS4HA6Fqfr7YlTw
NEXT_PUBLIC_STITCH_CONNECTED=true

# 2. App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 3. Google Gemini AI API (Tùy chọn khi kích hoạt AI Live)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxx
GEMINI_MODEL=gemini-1.5-pro

# 4. VNPay Sandbox (Tùy chọn khi thanh toán)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/payment/vnpay/callback
```

### Bước 4: Khởi Động Máy Chủ Phát Triển
```bash
npm run dev
```
Mở trình duyệt và truy cập: [**http://localhost:3000**](http://localhost:3000)

### Bước 5: Kiểm Tra Đóng Gói Production Build
```bash
npm run build
```

---

## 🌐 5. HƯỚNG DẪN TRIỂN KHAI LÊN VERCEL (DEPLOYMENT)

1. Đẩy mã nguồn lên GitHub:
   ```bash
   git add .
   git commit -m "feat: complete HaNoi Realty platform"
   git push origin main
   ```
2. Truy cập [vercel.com](https://vercel.com) ➔ Chọn **Add New Project** ➔ Chọn repository `Web-bds`.
3. Điền các **Environment Variables** (ví dụ `STITCH_API_KEY`, `NEXT_PUBLIC_APP_URL`).
4. Bấm **Deploy**. Vercel sẽ tự động build và cấp domain `*.vercel.app` miễn phí.

---

## 📄 6. GIẤY PHÉP & BẢN QUYỀN (LICENSE)

Dự án được phát triển cho thị trường Bất Động Sản Hà Nội theo tiêu chuẩn mã nguồn mở MIT License.

*Copyright © 2026 HaNoi Realty Team. All rights reserved.*
