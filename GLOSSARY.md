# Hà Nội PropTech Ubiquitous Language & Domain Glossary
> Tài liệu chuẩn hóa thuật ngữ nghiệp vụ Bất Động Sản Hà Nội, Quy hoạch số hóa, SEO Google Patents và GIS.

## 1. Bản Đồ & Không Gian GIS (Geographic Information System)
**WGS 84 (EPSG:4326)**:
Hệ tọa độ chuẩn quốc tế lưu trữ theo cặp `(Longitude, Latitude)` - Kinh độ trước, Vĩ độ sau trong cơ sở dữ liệu và GeoJSON.
_Avoid_: (Lat, Lng) trong truy vấn SQL/GeoJSON PostGIS.

**PostGIS Spatial Index**:
Cơ chế đánh chỉ mục không gian `GIST(geom)` trên PostgreSQL/Supabase, phục vụ truy vấn `ST_DWithin` (bán kính) và `ST_Contains` (vùng quy hoạch) dưới 15ms.
_Avoid_: Lọc khoảng cách bằng thuật toán Haversine lặp qua toàn bộ hàng trong Javascript.

**Planning Zone Overlay (Lớp phủ quy hoạch)**:
Lớp bản đồ vector/raster biểu diễn quy hoạch phân khu đô thị Hà Nội giai đoạn 2030 - 2045 (đất ở đô thị ODT, đất cây xanh công viên CX, đất thương mại dịch vụ TMDV).
_Avoid_: Bản đồ quy hoạch chung chung, ảnh chụp vệ tinh không gắn lớp phân loại.

**Metro TOD (Transit-Oriented Development)**:
Chỉ số phát triển đô thị định hướng giao thông công cộng, đo lường khoảng cách thực tế và thời gian đi bộ từ BĐS đến các nhà ga Metro (Tuyến 2A Cát Linh - Hà Đông, Tuyến 3 Nhổn - Ga Hà Nội).
_Avoid_: Khoảng cách đường chim bay không tính lộ trình đi bộ.

---

## 2. Thẩm Định & Trí Tuệ Nhân Tạo (AI Valuation & Risk Assessment)
**AI Investment Score (Điểm đầu tư Gemini AI)**:
Chỉ số tổng hợp từ 1.0 đến 10.0 do mô hình Gemini phân tích dựa trên: đơn giá/m² so với mặt bằng quận, pháp lý sổ đỏ, hạ tầng Metro lân cận và quy hoạch tương lai.
_Avoid_: Điểm xếp hạng cảm tính, rating sao của môi giới.

**Substantive Freshness (Cập nhật thực chất)**:
Lịch sử thay đổi có giá trị thực tế của bất động sản (thay đổi giá bán, tình trạng đã cọc/đã bán, hoàn tất sổ đỏ, cập nhật tim đường quy hoạch mở rộng) đi kèm trường `dateModified` trong Schema JSON-LD.
_Avoid_: Bump ngày cập nhật ảo (chỉ sửa dấu chấm phẩy hoặc chạy cronjob đổi date mà không đổi nội dung).

---

## 3. Kiến Trúc Semantic SEO & Google Patents
**Topic Cluster Hub (Entity Hub)**:
Trang tĩnh chuẩn SEO đại diện cho một thực thể địa lý cấp quận/huyện (`/khu-vuc/[slug]`), đóng vai trò nút mạng trung tâm gom nhóm các bài đăng nhà đất, biểu đồ giá đường phố, trạm metro và bản đồ quy hoạch.
_Avoid_: Trang kết quả tìm kiếm rác, trang filter không có nội dung phân tích chuyên sâu.

**Information Gain Score (Patent 49)**:
Điểm số Google trao cho các trang có thông tin phân tích độc quyền (AI report, tình trạng quy hoạch phân khu, cự ly Metro) mà các trang cào dữ liệu (Batdongsan, Chotot) không hề có.
_Avoid_: Thin content, sao chép 100% mô tả từ người đăng rao vặt.

**Spider Trap Prevention (Patent 90)**:
Cơ chế bảo vệ Googlebot không rơi vào bẫy thu thập dữ liệu vô tận do tổ hợp bộ lọc đa tầng (faceted search) sinh ra hàng triệu URL tham số rác. Triển khai bằng Canonical URL và thẻ `noindex, follow` khi lọc sâu.
_Avoid_: Cho bot index tự do mọi query params `?minPrice=...&maxPrice=...&beds=...`.

**LCP Priority Element (Patent 86)**:
Ảnh đại diện chính của bất động sản (Hero Image) được phục vụ qua định dạng WebP tối ưu kích thước kèm thuộc tính `fetchpriority="high"` để đảm bảo LCP dưới 2.0s trên thiết bị di động.
_Avoid_: Chờ nạp xong toàn bộ bundle Javascript hoặc bản đồ nặng rồi mới render ảnh BĐS.
