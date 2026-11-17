# QUY CHUẨN BIÊN TẬP NỘI DUNG BÁO CHÍ BẤT ĐỘNG SẢN HANOI REALTY
*(HANOI REALTY EDITORIAL CONTENT STANDARD)*

**Áp dụng:** Toàn bộ hệ thống tin tức, bài viết phân tích, báo cáo thị trường, bản đồ quy hoạch và các AI Agents phát triển nội dung trên nền tảng HaNoi Realty.  
**Mục tiêu:** Xây dựng hệ thống tin tức bất động sản chuyên nghiệp, có nguồn báo chí chính thống, nội dung dài, hình ảnh phù hợp và thông tin xuất bản minh bạch.

---

## 1. QUY CHUẨN NỘI DUNG (CONTENT STANDARD)

- **Độ dài tối thiểu:** Mỗi bài viết phải có tối thiểu **1.200 từ tiếng Việt** trong phần nội dung chính.
  - *Lưu ý:* Không tính tiêu đề, chú thích ảnh, thông tin tác giả và danh sách nguồn tham khảo vào số từ.
- **Tiêu đề H1:** Rõ ràng, đúng trọng tâm, chuẩn báo chí, tối thiểu 20 ký tự.
- **Đoạn Sapo:** Khoảng **80–120 từ**, tóm lược các phát hiện cốt lõi, vấn đề thời sự và giá trị bài viết đem lại cho độc giả/nhà đầu tư.
- **Mục lục (Table of Contents):** Tự động sinh mục lục điều hướng neo link cho các bài viết dài.
- **Cấu trúc đề mục:** Có ít nhất **5–7 đề mục H2** và các tiểu mục H3 khi cần thiết.
- **Nội hàm phân tích:** Phải có số liệu thực tế, bối cảnh chính sách, so sánh chu kỳ, nhận định khách quan và kết luận tổng hợp.
- **Văn phong:** Báo chí chuyên nghiệp, khách quan, mạch lạc, dễ đọc. Tuyệt đối không viết lan man hoặc lặp từ để đối phó số lượng từ.
- **Nguyên tắc dữ liệu:** Không bịa đặt số liệu, không gán phát ngôn chuyên gia hoặc trích dẫn không có nguồn kiểm chứng.
- **Phân định rõ 3 luồng thông tin:**
  1. 🏛️ **Thông tin chính thức từ Nhà nước:** Luật, Nghị định, Quyết định phê duyệt quy hoạch, số liệu Ngân hàng Nhà nước, Tổng cục Thống kê, Sở Xây dựng.
  2. 📰 **Ghi nhận từ báo chí chính thống:** Diễn biến thị trường, khảo sát thực địa của phóng viên các cơ quan báo chí lớn.
  3. 🔍 **Góc nhìn & Nhận định của Ban biên tập HaNoi Realty:** Phân tích dữ liệu giá đất số hóa, khuyến nghị an toàn pháp lý cho nhà đầu tư.

---

## 2. NGUYÊN TẮC NGHIÊN CỨU VÀ TRÍCH DẪN (RESEARCH & CITATIONS)

Mỗi bài viết cần có **ít nhất 3 nguồn tham khảo phù hợp**, ưu tiên danh mục cơ quan chính thống:
- Báo Điện tử Chính phủ / Cổng Thông tin điện tử Chính phủ (`baochinhphu.vn`).
- Bộ Xây dựng (`moc.gov.vn`).
- Bộ Tài chính (`mof.gov.vn`).
- Ngân hàng Nhà nước Việt Nam (`sbv.gov.vn`).
- UBND thành phố Hà Nội (`hanoi.gov.vn`) và Sở Xây dựng Hà Nội (`soxaydung.hanoi.gov.vn`).
- Các cơ quan báo chí quốc gia uy tín: *VnExpress, Tuổi Trẻ, Thanh Niên, Báo Đầu tư, Thời báo Kinh tế Sài Gòn (The Saigon Times), Lao Động, VietnamNet*.

> [!IMPORTANT]
> **Không sao chép nguyên văn:** Bài viết trên HaNoi Realty phải là bài biên tập độc lập, tổng hợp đa chiều, đối chiếu chéo số liệu và đưa ra phân tích sâu sắc từ nhiều nguồn.

---

## 3. THÔNG TIN BẮT BUỘC TRONG MỖI BÀI (MANDATORY METADATA)

Mỗi bài viết phải lưu trữ và hiển thị đầy đủ:
- **Tiêu đề (H1):** `title`
- **Tiêu đề SEO:** `seoTitle`
- **Mô tả SEO:** `seoDescription` (150–160 ký tự)
- **Ảnh đại diện:** `featuredImage` (kèm chú thích và bản quyền)
- **Nội dung đầy đủ:** `content`
- **Tên tác giả / Ban biên tập:** `authorName` (ví dụ: *Ban Phân tích Pháp lý & Thị trường HaNoi Realty*)
- **Thời gian đọc:** `readTime` (ví dụ: *10 phút đọc*)
- **Số từ nội dung chính:** `wordCount` (tối thiểu 1.200 từ)
- **Danh sách nguồn tham khảo:** `sources` (mảng đối tượng `ArticleSource`)

### Phân định minh bạch 3 mốc thời gian:
1. `sourcePublishedAt`: Ngày bài báo gốc xuất bản trên cơ quan báo chí ban đầu.
2. `createdAt`: Thời điểm bài viết được khởi tạo và biên tập trên HaNoi Realty.
3. `updatedAt`: Thời điểm nội dung được rà soát, bổ sung hoặc sửa đổi thực tế gần nhất.

> [!WARNING]
> - Không lấy ngày bài báo gốc làm ngày tạo bài của HaNoi Realty.
> - Nếu chưa có cập nhật mới, phải giữ nguyên ngày cập nhật gần nhất, tuyệt đối không dùng code tự động đổi ngày theo thời gian máy khách mỗi lần truy cập.

---

## 4. NGUYÊN TẮC NGUỒN CÓ THỂ NHẤN (CLICKABLE SOURCES)

Cuối mỗi bài viết bắt buộc phải có khối giao diện:

### **NGUỒN THAM KHẢO**
Mỗi mục nguồn phải hiển thị rõ:
- **Tên bài báo nguồn**
- **Tên cơ quan báo chí**
- **Ngày xuất bản gốc**
- **Đường dẫn trực tiếp:** Thẻ link mở bài báo gốc trong tab mới (`target="_blank" rel="noopener noreferrer"`).

> [!CAUTION]
> - Link phải thực sự hoạt động và dẫn đúng bài báo gốc.
> - Tuyệt đối không chỉ hiển thị tên miền dạng text trơn không thể nhấn.
> - Tuyệt đối không tạo link giả mạo hoặc link 404.

---

## 5. NGUYÊN TẮC HÌNH ẢNH (IMAGE GUIDELINES)

Mỗi bài viết phải có:
1. **Một ảnh đại diện (Featured Image):** Tỷ lệ chuẩn 16:9, độ phân giải cao, phù hợp với chủ đề bài viết.
2. **Tối thiểu 2–4 ảnh minh họa trong thân bài:**
   - Ảnh phải liên quan trực tiếp đến nội dung của từng đề mục tương ứng.
   - **Chú thích (Caption):** Mô tả rõ địa điểm, công trình, quy hoạch, sự kiện hiển thị trong ảnh.
   - **Ghi rõ nguồn ảnh (Photo Credit):** Nêu rõ nguồn gốc bản quyền (ví dụ: *Ảnh: Cổng Thông tin điện tử Chính phủ*, *Ảnh: Ban Quản lý Dự án*, hoặc *Ảnh đồ họa: HaNoi Realty Data Center*).
3. **Tuân thủ bản quyền:** Không dùng ảnh không có bản quyền, ưu tiên ảnh công bố chính thức hoặc ảnh đồ họa/chụp thực địa của HaNoi Realty.

---

## 6. QUY CHUẨN NGÀY CẬP NHẬT (TIMESTAMP INTEGRITY)

- Mọi mốc thời gian phải được lưu trữ bằng dữ liệu chuỗi ngày thực tế (`DD/MM/YYYY` hoặc `ISO 8601`).
- Không dùng hàm tự động `new Date()` để giả mạo thời gian cập nhật của bài viết.

---

## 7. QUY TRÌNH KIỂM DUYỆT TRƯỚC KHI ĐĂNG (PRE-PUBLISH CHECKLIST)

Trước khi chuyển trạng thái bài viết sang `published`, Ban biên tập hoặc AI Coding Agent phải rà soát:
- [ ] Kiểm tra số từ nội dung chính: Đạt >= 1.200 từ tiếng Việt.
- [ ] Kiểm tra đoạn Sapo: Đạt 80–120 từ.
- [ ] Kiểm tra đề mục: Có đủ 5–7 đề mục H2 và các đề mục H3.
- [ ] Kiểm tra danh sách nguồn: Có ít nhất 3 nguồn báo chí chính thống với link hoạt động.
- [ ] Kiểm tra 3 mốc thời gian: `sourcePublishedAt`, `createdAt`, `updatedAt` minh bạch.
- [ ] Kiểm tra hình ảnh: Có ảnh bìa + 2–4 ảnh thân bài kèm chú thích và nguồn ảnh.
- [ ] Kiểm tra chính tả và ngữ pháp tiếng Việt.
- [ ] Kiểm tra hiển thị responsive trên Desktop và Mobile.

