---
name: postgis-spatial-query-optimizer
description: Tối ưu hóa mô hình cơ sở dữ liệu không gian PostGIS trên PostgreSQL / Supabase. Bao gồm: cấu trúc cột toạ độ chuẩn WGS 84, đánh chỉ mục GIST, viết RPC Stored Procedures tính toán bán kính trạm Metro và va chạm quy hoạch phân khu dưới 15ms.
---

# 🗺️ PostGIS Spatial Query Optimizer Skill

Kỹ năng chuyên sâu về kỹ thuật GIS không gian cho nền tảng Bất Động Sản Hà Nội, thay thế hoàn toàn các giải pháp lặp mảng Javascript chậm chạp bằng toán tử hình học tính toán trực tiếp trên database.

## 1. Chuẩn hóa toạ độ & Hệ quy chiếu:
- **Chuẩn không gian:** Luôn dùng `GEOMETRY(Point, 4326)` - hệ toạ độ WGS 84.
- **Thứ tự toạ độ:** Luôn là `ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)` — **Kinh độ (Lng) trước, Vĩ độ (Lat) sau**.
- **Chỉ mục GIST:** Bắt buộc phải đánh index trên mọi cột geometry:
  ```sql
  CREATE INDEX idx_listings_geom ON listings USING GIST (geom);
  CREATE INDEX idx_planning_zones_geom ON planning_zones USING GIST (geom);
  ```

## 2. Các hàm RPC Stored Procedure bắt buộc:
1. **Tìm kiếm BĐS theo bán kính trạm Metro / Trường học / Bệnh viện:**
   - Dùng `ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius_in_meters)` để tính khoảng cách trắc địa mét chuẩn xác theo độ cong trái đất.
2. **Kiểm tra va chạm quy hoạch (Planning Collision):**
   - Dùng `ST_Contains(zone.geom, listing.geom)` hoặc `ST_Intersects` để phát hiện ngay lập tức thửa đất đang nằm trong vùng Đất ở đô thị (ODT), Đất cây xanh (CX) hay dính Quy hoạch đường sắt/mở đường.
3. **Bounding Box Viewport Query (Khi kéo map):**
   - Dùng toán tử `geom && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)` để chỉ nạp đúng các điểm hiển thị trên màn hình người dùng, tránh query toàn bộ hàng chục ngàn tin đăng.
