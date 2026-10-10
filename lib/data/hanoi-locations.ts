/**
 * Hanoi locations database and search utilities
 * Covers Districts, Major Urban Projects (Vinhomes, Ciputra, Starlake...),
 * Arterial Streets, Detailed Addresses (House Numbers, Alleys), and Famous Landmarks.
 */

export interface HanoiLocationItem {
  id: string;
  name: string;
  category: 'district' | 'project' | 'street' | 'landmark' | 'address';
  district?: string;
  ward?: string;
  lat: number;
  lng: number;
  zoom: number;
  description?: string;
  houseNumber?: string;
  street?: string;
  tags?: string[];
}

// Remove Vietnamese accents for fast fuzzy searching
export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export const HANOI_LOCATIONS: HanoiLocationItem[] = [
  // ── 1. QUẬN / HUYỆN HÀ NỘI ──
  { id: 'dist-hk', name: 'Quận Hoàn Kiếm', category: 'district', district: 'Hoàn Kiếm', lat: 21.0310, lng: 105.8525, zoom: 15, description: 'Trung tâm thủ đô, Phố Cổ & Hồ Gươm' },
  { id: 'dist-cg', name: 'Quận Cầu Giấy', category: 'district', district: 'Cầu Giấy', lat: 21.0360, lng: 105.7905, zoom: 14.5, description: 'Trung tâm văn phòng, công nghệ & giáo dục' },
  { id: 'dist-dd', name: 'Quận Đống Đa', category: 'district', district: 'Đống Đa', lat: 21.0185, lng: 105.8300, zoom: 14.5, description: 'Khu dân cư sầm uất, kết nối Metro Cát Linh' },
  { id: 'dist-bd', name: 'Quận Ba Đình', category: 'district', district: 'Ba Đình', lat: 21.0340, lng: 105.8250, zoom: 14.5, description: 'Trung tâm hành chính chính trị quốc gia' },
  { id: 'dist-th', name: 'Quận Tây Hồ', category: 'district', district: 'Tây Hồ', lat: 21.0650, lng: 105.8230, zoom: 14, description: 'Khu vực sinh thái Hồ Tây, BĐS cao cấp & chuyên gia nước ngoài' },
  { id: 'dist-tx', name: 'Quận Thanh Xuân', category: 'district', district: 'Thanh Xuân', lat: 20.9950, lng: 105.8080, zoom: 14.5, description: 'Trục đường Nguyễn Trãi, Vành đai 3' },
  { id: 'dist-hbt', name: 'Quận Hai Bà Trưng', category: 'district', district: 'Hai Bà Trưng', lat: 21.0080, lng: 105.8550, zoom: 14.5, description: 'Khu vực nội thành lâu đời, Times City' },
  { id: 'dist-hm', name: 'Quận Hoàng Mai', category: 'district', district: 'Hoàng Mai', lat: 20.9750, lng: 105.8500, zoom: 13.5, description: 'Cửa ngõ phía Nam, Gamuda Gardens, Linh Đàm' },
  { id: 'dist-lb', name: 'Quận Long Biên', category: 'district', district: 'Long Biên', lat: 21.0420, lng: 105.8900, zoom: 13.5, description: 'Đô thị sinh thái ven sông, Vinhomes Riverside' },
  { id: 'dist-ntl', name: 'Quận Nam Từ Liêm', category: 'district', district: 'Nam Từ Liêm', lat: 21.0020, lng: 105.7600, zoom: 14, description: 'Trung tâm mới phía Tây, SVĐ Mỹ Đình, Smart City' },
  { id: 'dist-btl', name: 'Quận Bắc Từ Liêm', category: 'district', district: 'Bắc Từ Liêm', lat: 21.0600, lng: 105.7600, zoom: 13.5, description: 'Ngoại Giao Đoàn, Ciputra, Đại học Mỏ' },
  { id: 'dist-hd', name: 'Quận Hà Đông', category: 'district', district: 'Hà Đông', lat: 20.9700, lng: 105.7750, zoom: 13.5, description: 'Khu đô thị phát triển nhanh, Metro 2A' },
  { id: 'dist-gl', name: 'Huyện Gia Lâm', category: 'district', district: 'Gia Lâm', lat: 21.0100, lng: 105.9300, zoom: 13, description: 'Đô thị biển hồ Vinhomes Ocean Park' },
  { id: 'dist-da', name: 'Huyện Đông Anh', category: 'district', district: 'Đông Anh', lat: 21.1350, lng: 105.8450, zoom: 12.5, description: 'Quy hoạch thành phố bờ Bắc sông Hồng' },
  { id: 'dist-hd-sub', name: 'Huyện Hoài Đức', category: 'district', district: 'Hoài Đức', lat: 21.0200, lng: 105.6950, zoom: 12.5, description: 'Trục Đại lộ Thăng Long, Vành đai 3.5' },
  { id: 'dist-tt', name: 'Huyện Thanh Trì', category: 'district', district: 'Thanh Trì', lat: 20.9400, lng: 105.8500, zoom: 12.5, description: 'Cửa ngõ phía Nam, bán đảo Linh Đàm mở rộng' },

  // ── 2. KHU ĐÔ THỊ & DỰ ÁN BĐS LỚN ──
  { id: 'proj-vr', name: 'Vinhomes Riverside', category: 'project', district: 'Long Biên', lat: 21.0494, lng: 105.9080, zoom: 15.5, description: 'Biệt thự sinh thái ven sông đẳng cấp bậc nhất Hà Nội' },
  { id: 'proj-vsc', name: 'Vinhomes Smart City', category: 'project', district: 'Nam Từ Liêm', lat: 20.9998, lng: 105.7441, zoom: 15.5, description: 'Đại đô thị thông minh 280ha tại Tây Mỗ - Đại Mỗ' },
  { id: 'proj-vop', name: 'Vinhomes Ocean Park 1', category: 'project', district: 'Gia Lâm', lat: 20.9922, lng: 105.9472, zoom: 15.5, description: 'Thành phố Biển Hồ 420ha Gia Lâm' },
  { id: 'proj-vm', name: 'Vinhomes Metropolis Liễu Giai', category: 'project', district: 'Ba Đình', lat: 21.0315, lng: 105.8152, zoom: 16.5, description: 'Tổ hợp căn hộ hạng sang 29 Liễu Giai đối diện Lotte' },
  { id: 'proj-rc', name: 'Vinhomes Royal City', category: 'project', district: 'Thanh Xuân', lat: 21.0033, lng: 105.8185, zoom: 16, description: 'Thành phố Hoàng Gia 72A Nguyễn Trãi' },
  { id: 'proj-tc', name: 'Vinhomes Times City', category: 'project', district: 'Hai Bà Trưng', lat: 20.9958, lng: 105.8672, zoom: 16, description: 'Khu đô thị sinh thái 458 Minh Khai' },
  { id: 'proj-starlake', name: 'Khu đô thị Starlake Tây Hồ Tây', category: 'project', district: 'Bắc Từ Liêm', lat: 21.0558, lng: 105.7983, zoom: 15.5, description: 'Đại đô thị kiểu mẫu Hàn Quốc, trung tâm hành chính mới' },
  { id: 'proj-ciputra', name: 'Ciputra Nam Thăng Long', category: 'project', district: 'Tây Hồ', lat: 21.0712, lng: 105.7951, zoom: 15.5, description: 'Khu đô thị quốc tế kiểu mẫu lâu đời phía Bắc Hà Nội' },
  { id: 'proj-ngd', name: 'Khu Ngoại Giao Đoàn', category: 'project', district: 'Bắc Từ Liêm', lat: 21.0601, lng: 105.7942, zoom: 16, description: 'Quần thể căn hộ và biệt thự đại sứ quán công viên hồ nước' },
  { id: 'proj-gamuda', name: 'Gamuda Gardens', category: 'project', district: 'Hoàng Mai', lat: 20.9702, lng: 105.8643, zoom: 15.5, description: 'Khu đô thị sinh thái xanh phong cách Malaysia' },
  { id: 'proj-ecopark', name: 'Ecopark', category: 'project', district: 'Gia Lâm', lat: 20.9632, lng: 105.9321, zoom: 15, description: 'Đại đô thị sinh thái xanh triệu cây ven sông Bắc Hưng Hải' },
  { id: 'proj-manor', name: 'The Manor Central Park', category: 'project', district: 'Hoàng Mai', lat: 20.9765, lng: 105.8193, zoom: 15.5, description: 'Tổ hợp phố thương mại sầm uất kế bên công viên Chu Văn An' },
  { id: 'proj-mandarin', name: 'Mandarin Garden', category: 'project', district: 'Cầu Giấy', lat: 21.0092, lng: 105.8015, zoom: 16.5, description: 'Tổ hợp căn hộ cao cấp Hoàng Minh Giám' },
  { id: 'proj-goldmark', name: 'Goldmark City', category: 'project', district: 'Bắc Từ Liêm', lat: 21.0421, lng: 105.7663, zoom: 16, description: '136 Hồ Tùng Mậu cạnh tuyến Metro Line 3' },
  { id: 'proj-keangnam', name: 'Keangnam Landmark 72', category: 'project', district: 'Nam Từ Liêm', lat: 21.0171, lng: 105.7839, zoom: 16, description: 'Tòa tháp biểu tượng cao nhất Hà Nội trên đường Phạm Hùng' },
  { id: 'proj-lotte', name: 'Lotte Center Hà Nội', category: 'project', district: 'Ba Đình', lat: 21.0332, lng: 105.8122, zoom: 16.5, description: 'Tòa tháp phức hợp 65 tầng Liễu Giai & Đào Tấn' },
  { id: 'proj-linhdam', name: 'Khu đô thị Linh Đàm', category: 'project', district: 'Hoàng Mai', lat: 20.9655, lng: 105.8285, zoom: 15, description: 'Bán đảo Linh Đàm xanh mát' },
  { id: 'proj-mydinh1', name: 'Khu Đô Thị Mỹ Đình 1', category: 'project', district: 'Nam Từ Liêm', lat: 21.0365, lng: 105.7655, zoom: 15.5, description: 'Khu đô thị Mỹ Đình 1, Cầu Diễn' },
  { id: 'proj-mydinh2', name: 'Khu Đô Thị Mỹ Đình 2', category: 'project', district: 'Nam Từ Liêm', lat: 21.0335, lng: 105.7712, zoom: 15.5, description: 'Khu đô thị Mỹ Đình 2, Nam Từ Liêm' },
  { id: 'proj-vanquan', name: 'Khu đô thị Văn Quán', category: 'project', district: 'Hà Đông', lat: 20.9805, lng: 105.7925, zoom: 15.5, description: 'Khu đô thị Văn Quán, Hà Đông' },
  { id: 'proj-molao', name: 'Khu đô thị Mỗ Lao', category: 'project', district: 'Hà Đông', lat: 20.9875, lng: 105.7825, zoom: 15.5, description: 'Khu đô thị Mộ Lao, Làng Việt Kiều Châu Âu' },

  // ── 3. TUYẾN ĐƯỜNG & PHỐ HUYẾT MẠCH ──
  { id: 'str-cg', name: 'Đường Cầu Giấy', category: 'street', district: 'Cầu Giấy', ward: 'Quan Hoa', lat: 21.0345, lng: 105.7995, zoom: 16, description: 'Trục thương mại Cầu Giấy - Kim Mã' },
  { id: 'str-dt', name: 'Phố Duy Tân', category: 'street', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0315, lng: 105.7835, zoom: 16.5, description: 'Thung lũng công nghệ, tập trung văn phòng IT' },
  { id: 'str-xt', name: 'Đường Xuân Thủy', category: 'street', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0368, lng: 105.7885, zoom: 16, description: 'Trục đại học ĐHQGHN, ĐH Sư Phạm' },
  { id: 'str-ttt', name: 'Phố Trần Thái Tông', category: 'street', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0322, lng: 105.7891, zoom: 16, description: 'Phố ẩm thực văn phòng Cầu Giấy' },
  { id: 'str-hqv', name: 'Đường Hoàng Quốc Việt', category: 'street', district: 'Cầu Giấy', ward: 'Nghĩa Đô', lat: 21.0465, lng: 105.7938, zoom: 16, description: 'Trục kết nối Cầu Giấy - Tây Hồ' },
  { id: 'str-tk', name: 'Phố Trung Kính', category: 'street', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0189, lng: 105.7942, zoom: 16, description: 'Phố Trung Kính sầm uất' },
  { id: 'str-tdh', name: 'Đường Trần Duy Hưng', category: 'street', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0084, lng: 105.7972, zoom: 16, description: 'Cửa ngõ Tây Nam nối Trung Hòa Nhân Chính' },
  { id: 'str-nc', name: 'Phố Nguyễn Chánh', category: 'street', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0112, lng: 105.7915, zoom: 16, description: 'Phố Nguyễn Chánh, KĐT Nam Trung Yên' },
  { id: 'str-ddn', name: 'Đường Dương Đình Nghệ', category: 'street', district: 'Cầu Giấy', ward: 'Yên Hòa', lat: 21.0225, lng: 105.7865, zoom: 16, description: 'Trục Cục Hải Quan - Viện Huyết Học' },
  { id: 'str-nt', name: 'Đường Nguyễn Trãi', category: 'street', district: 'Thanh Xuân', ward: 'Thượng Đình', lat: 20.9985, lng: 105.8115, zoom: 16, description: 'Trục giao thông chính tuyến Metro Cát Linh' },
  { id: 'str-lvl', name: 'Đường Lê Văn Lương', category: 'street', district: 'Thanh Xuân', ward: 'Nhân Chính', lat: 21.0055, lng: 105.8025, zoom: 16, description: 'Trục tài chính chung cư cao cấp' },
  { id: 'str-vtp', name: 'Phố Vũ Trọng Phụng', category: 'street', district: 'Thanh Xuân', ward: 'Thanh Xuân Trung', lat: 21.0012, lng: 105.8065, zoom: 16.5, description: 'Phố Vũ Trọng Phụng sầm uất' },
  { id: 'str-kdt', name: 'Đường Khuất Duy Tiến', category: 'street', district: 'Thanh Xuân', ward: 'Thanh Xuân Bắc', lat: 20.9945, lng: 105.7955, zoom: 16, description: 'Vành đai 3 trên cao' },
  { id: 'str-km', name: 'Đường Kim Mã', category: 'street', district: 'Ba Đình', ward: 'Kim Mã', lat: 21.0312, lng: 105.8185, zoom: 16, description: 'Trục ngoại giao Ba Đình, Metro 3' },
  { id: 'str-lg', name: 'Phố Liễu Giai', category: 'street', district: 'Ba Đình', ward: 'Liễu Giai', lat: 21.0345, lng: 105.8142, zoom: 16.5, description: 'Trục ngoại giao đối diện Lotte' },
  { id: 'str-dc', name: 'Phố Đội Cấn', category: 'street', district: 'Ba Đình', ward: 'Đội Cấn', lat: 21.0372, lng: 105.8215, zoom: 16, description: 'Phố Đội Cấn trung tâm Ba Đình' },
  { id: 'str-vc', name: 'Phố Văn Cao', category: 'street', district: 'Ba Đình', ward: 'Liễu Giai', lat: 21.0425, lng: 105.8162, zoom: 16, description: 'Trục thẳng tiến Hồ Tây' },
  { id: 'str-hht', name: 'Đường Hoàng Hoa Thám', category: 'street', district: 'Ba Đình', ward: 'Ngọc Hà', lat: 21.0415, lng: 105.8265, zoom: 16, description: 'Phố cây cảnh di sản chạy ven Hồ Tây' },
  { id: 'str-pdp', name: 'Phố Phan Đình Phùng', category: 'street', district: 'Ba Đình', ward: 'Quán Thánh', lat: 21.0412, lng: 105.8425, zoom: 16.5, description: 'Con đường rợp bóng sấu đẹp nhất Hà Nội' },
  { id: 'str-xd', name: 'Phố Xã Đàn', category: 'street', district: 'Đống Đa', ward: 'Nam Đồng', lat: 21.0145, lng: 105.8342, zoom: 16, description: 'Vành đai 1 sầm uất' },
  { id: 'str-hn', name: 'Phố Hào Nam', category: 'street', district: 'Đống Đa', ward: 'Ô Chợ Dừa', lat: 21.0258, lng: 105.8285, zoom: 16, description: 'Cạnh ga Metro Cát Linh' },
  { id: 'str-lang', name: 'Đường Láng', category: 'street', district: 'Đống Đa', ward: 'Láng Thượng', lat: 21.0185, lng: 105.8085, zoom: 16, description: 'Trục đường ven sông Tô Lịch' },
  { id: 'str-cb', name: 'Phố Chùa Bộc', category: 'street', district: 'Đống Đa', ward: 'Quang Trung', lat: 21.0078, lng: 105.8288, zoom: 16.5, description: 'Thiên đường thời trang Học viện Ngân hàng' },
  { id: 'str-th-dd', name: 'Phố Thái Hà', category: 'street', district: 'Đống Đa', ward: 'Trung Liệt', lat: 21.0135, lng: 105.8198, zoom: 16.5, description: 'Phố công nghệ - thiết bị số Đống Đa' },
  { id: 'str-htk', name: 'Phố Huỳnh Thúc Kháng', category: 'street', district: 'Đống Đa', ward: 'Láng Hạ', lat: 21.0205, lng: 105.8125, zoom: 16.5, description: 'Phố tài chính Huỳnh Thúc Kháng' },
  { id: 'str-lh', name: 'Đường Láng Hạ', category: 'street', district: 'Đống Đa', ward: 'Láng Hạ', lat: 21.0180, lng: 105.8160, zoom: 16, description: 'Phố ngân hàng và văn phòng' },
  { id: 'str-hc', name: 'Phố Hoàng Cầu', category: 'street', district: 'Đống Đa', ward: 'Ô Chợ Dừa', lat: 21.0182, lng: 105.8215, zoom: 16.5, description: 'Ven hồ Hoàng Cầu thoáng đãng' },
  { id: 'str-ocd', name: 'Phố Ô Chợ Dừa', category: 'street', district: 'Đống Đa', ward: 'Ô Chợ Dừa', lat: 21.0178, lng: 105.8272, zoom: 16, description: 'Ngã sáu Ô Chợ Dừa sầm uất' },
  { id: 'str-gv', name: 'Phố Giảng Võ', category: 'street', district: 'Đống Đa', ward: 'Cát Linh', lat: 21.0282, lng: 105.8242, zoom: 16, description: 'Phố Giảng Võ trung tâm' },
  { id: 'str-cl', name: 'Phố Cát Linh', category: 'street', district: 'Đống Đa', ward: 'Cát Linh', lat: 21.0285, lng: 105.8312, zoom: 16.5, description: 'Đầu mối Metro Tuyến 2A' },
  { id: 'str-ts', name: 'Phố Tây Sơn', category: 'street', district: 'Đống Đa', ward: 'Ngã Tư Sở', lat: 21.0112, lng: 105.8235, zoom: 16, description: 'Trục Ngã Tư Sở - Gò Đống Đa' },
  { id: 'str-ttt-dd', name: 'Phố Tôn Thất Tùng', category: 'street', district: 'Đống Đa', ward: 'Khương Thượng', lat: 21.0055, lng: 105.8305, zoom: 16.5, description: 'Khu vực ĐH Y Hà Nội' },
  { id: 'str-vcc', name: 'Đường Võ Chí Công', category: 'street', district: 'Tây Hồ', ward: 'Xuân La', lat: 21.0665, lng: 105.8025, zoom: 15.5, description: 'Đại lộ 10 làn kết nối Cầu Nhật Tân' },
  { id: 'str-llq', name: 'Đường Lạc Long Quân', category: 'street', district: 'Tây Hồ', ward: 'Bưởi', lat: 21.0552, lng: 105.8085, zoom: 16, description: 'Trục Lạc Long Quân ven Hồ Tây' },
  { id: 'str-xd-th', name: 'Đường Xuân Diệu', category: 'street', district: 'Tây Hồ', ward: 'Quảng An', lat: 21.0655, lng: 105.8275, zoom: 16, description: 'Bán đảo Tây Hồ, cộng đồng quốc tế' },
  { id: 'str-ac', name: 'Đường Âu Cơ', category: 'street', district: 'Tây Hồ', ward: 'Tứ Liên', lat: 21.0695, lng: 105.8285, zoom: 16, description: 'Trục đê Âu Cơ - Cầu Nhật Tân' },
  { id: 'str-tt-hk', name: 'Phố Tràng Tiền', category: 'street', district: 'Hoàn Kiếm', ward: 'Tràng Tiền', lat: 21.0255, lng: 105.8565, zoom: 16.5, description: 'Nhà hát Lớn, Tràng Tiền Plaza' },
  { id: 'str-dth', name: 'Phố Đinh Tiên Hoàng', category: 'street', district: 'Hoàn Kiếm', ward: 'Hàng Trống', lat: 21.0285, lng: 105.8525, zoom: 17, description: 'Phố đi bộ Hồ Gươm' },
  { id: 'str-hb', name: 'Phố Hàng Bài', category: 'street', district: 'Hoàn Kiếm', ward: 'Hàng Bài', lat: 21.0222, lng: 105.8528, zoom: 16.5, description: 'Phố trung tâm Hoàn Kiếm' },
  { id: 'str-bt', name: 'Phố Bà Triệu', category: 'street', district: 'Hoàn Kiếm', ward: 'Hàng Bài', lat: 21.0185, lng: 105.8505, zoom: 16.5, description: 'Trục thương mại Bà Triệu - Vincom' },
  { id: 'str-ph-hbt', name: 'Phố Phố Huế', category: 'street', district: 'Hai Bà Trưng', ward: 'Phố Huế', lat: 21.0145, lng: 105.8525, zoom: 16.5, description: 'Phố thương mại truyền thống' },
  { id: 'str-dcv', name: 'Đường Đại Cồ Việt', category: 'street', district: 'Hai Bà Trưng', ward: 'Lê Đại Hành', lat: 21.0085, lng: 105.8455, zoom: 16, description: 'Trục ĐHBK Hà Nội' },
  { id: 'str-bm', name: 'Phố Bạch Mai', category: 'street', district: 'Hai Bà Trưng', ward: 'Bạch Mai', lat: 21.0012, lng: 105.8485, zoom: 16.5, description: 'Phố Bạch Mai sầm uất' },
  { id: 'str-mk', name: 'Đường Minh Khai', category: 'street', district: 'Hai Bà Trưng', ward: 'Minh Khai', lat: 20.9985, lng: 105.8615, zoom: 16, description: 'Vành đai 2 trên cao, Times City' },
  { id: 'str-qt-hd', name: 'Đường Quang Trung', category: 'street', district: 'Hà Đông', ward: 'Quang Trung', lat: 20.9725, lng: 105.7745, zoom: 16, description: 'Trục chính quận Hà Đông, Metro 2A' },
  { id: 'str-tp-hd', name: 'Đường Trần Phú', category: 'street', district: 'Hà Đông', ward: 'Văn Quán', lat: 20.9855, lng: 105.7895, zoom: 16, description: 'Trục nối Thanh Xuân - Hà Đông' },
  { id: 'str-th-hd', name: 'Đường Tố Hữu', category: 'street', district: 'Hà Đông', ward: 'Vạn Phúc', lat: 20.9885, lng: 105.7725, zoom: 16, description: 'Lê Văn Lương kéo dài' },
  { id: 'str-pvd', name: 'Đường Phạm Văn Đồng', category: 'street', district: 'Bắc Từ Liêm', ward: 'Cổ Nhuế 1', lat: 21.0552, lng: 105.7825, zoom: 16, description: 'Vành đai 3 phía Bắc Cầu Thăng Long' },
  { id: 'str-ph-ntl', name: 'Đường Phạm Hùng', category: 'street', district: 'Nam Từ Liêm', ward: 'Mỹ Đình 1', lat: 21.0200, lng: 105.7790, zoom: 16, description: 'Vành đai 3 - Bến xe Mỹ Đình, Keangnam' },
  { id: 'str-dltt', name: 'Đại lộ Thăng Long', category: 'street', district: 'Nam Từ Liêm', ward: 'Mễ Trì', lat: 21.0050, lng: 105.7500, zoom: 14.5, description: 'Cao tốc cửa ngõ phía Tây' },
  { id: 'str-nvc', name: 'Đường Nguyễn Văn Cừ', category: 'street', district: 'Long Biên', ward: 'Bồ Đề', lat: 21.0415, lng: 105.8725, zoom: 16, description: 'Trục qua Cầu Chương Dương' },
  { id: 'str-gp', name: 'Đường Giải Phóng', category: 'street', district: 'Hoàng Mai', ward: 'Giáp Bát', lat: 20.9855, lng: 105.8415, zoom: 16, description: 'Cửa ngõ phía Nam, bến xe Giáp Bát' },

  // ── 4. ĐỊA DANH & TIỆN ÍCH NỔI TIẾNG ──
  { id: 'lm-hg', name: 'Hồ Hoàn Kiếm (Hồ Gươm)', category: 'landmark', district: 'Hoàn Kiếm', lat: 21.0285, lng: 105.8542, zoom: 16.5, description: 'Trái tim của thủ đô Hà Nội, Tháp Rùa, Đền Ngọc Sơn' },
  { id: 'lm-ht', name: 'Hồ Tây (West Lake)', category: 'landmark', district: 'Tây Hồ', lat: 21.0550, lng: 105.8250, zoom: 14.5, description: 'Hồ nước ngọt tự nhiên lớn nhất Hà Nội với 500ha mặt nước' },
  { id: 'lm-catlinh', name: 'Ga Metro Cát Linh', category: 'landmark', district: 'Đống Đa', lat: 21.0280, lng: 105.8383, zoom: 16.5, description: 'Ga đầu tuyến đường sắt trên cao 2A Cát Linh - Hà Đông' },
  { id: 'lm-ganhon', name: 'Ga Metro Nhổn', category: 'landmark', district: 'Bắc Từ Liêm', lat: 21.0451, lng: 105.7614, zoom: 16.5, description: 'Ga depot tuyến đường sắt Metro Tuyến 3' },
  { id: 'lm-gahanoi', name: 'Ga Hà Nội', category: 'landmark', district: 'Đống Đa', lat: 21.0245, lng: 105.8415, zoom: 16.5, description: 'Đầu mối đường sắt quốc gia' },
  { id: 'lm-bachmai', name: 'Bệnh viện Bạch Mai', category: 'landmark', district: 'Đống Đa', lat: 21.0046, lng: 105.8450, zoom: 16.5, description: '78 Giải Phóng, Phương Mai, Đống Đa' },
  { id: 'lm-dhqg', name: 'Đại học Quốc gia Hà Nội', category: 'landmark', district: 'Cầu Giấy', lat: 21.0380, lng: 105.7834, zoom: 16.5, description: '144 Xuân Thủy, Cầu Giấy' },
  { id: 'lm-bk', name: 'Đại học Bách Khoa Hà Nội', category: 'landmark', district: 'Hai Bà Trưng', lat: 21.0044, lng: 105.8431, zoom: 16.5, description: 'Số 1 Đại Cồ Việt, Hai Bà Trưng' },
  { id: 'lm-mydinh', name: 'Sân vận động Quốc gia Mỹ Đình', category: 'landmark', district: 'Nam Từ Liêm', lat: 21.0205, lng: 105.7638, zoom: 16, description: 'Đường Lê Đức Thọ, Mỹ Đình 1' },
];

/**
 * Intelligent Vietnamese Address Parser
 * Extracts house numbers, alleys (ngõ, ngách), building towers from user query
 * and pairs them with known Hanoi streets or projects.
 */
export function parseVietnameseAddress(query: string): HanoiLocationItem | null {
  const cleanQ = query.trim();
  if (cleanQ.length < 3) return null;

  // Regex matching: '15 Duy Tan', 'Số 15 phố Duy Tân', 'Ngõ 36 Hoàng Cầu', 'Tòa R2 Royal City', '340 Thái Hà'
  const match = cleanQ.match(
    /^(số\s+|so\s+|ngõ\s+|ngo\s+|ngách\s+|ngach\s+|tòa\s+|toa\s+)?([0-9]+[a-zA-Z]?|[a-zA-Z][0-9]+)\s+(.+)$/i
  );

  if (!match) return null;

  const rawPrefix = (match[1] || '').trim();
  const houseNumber = match[2].trim();
  const streetPart = match[3].trim();
  const normalizedStreetPart = removeVietnameseTones(streetPart);

  // Search inside known streets and projects
  let matchedStreet: HanoiLocationItem | null = null;
  let highestScore = 0;

  for (const loc of HANOI_LOCATIONS) {
    if (loc.category !== 'street' && loc.category !== 'project') continue;

    const locNorm = removeVietnameseTones(loc.name);
    if (locNorm.includes(normalizedStreetPart) || normalizedStreetPart.includes(locNorm)) {
      const score = locNorm === normalizedStreetPart ? 100 : 50;
      if (score > highestScore) {
        highestScore = score;
        matchedStreet = loc;
      }
    }
  }

  if (!matchedStreet) return null;

  let prefix = 'Số';
  const lowerRaw = rawPrefix.toLowerCase();
  if (lowerRaw.includes('ngo') || lowerRaw.includes('ngõ')) {
    prefix = 'Ngõ';
  } else if (lowerRaw.includes('ngach') || lowerRaw.includes('ngách')) {
    prefix = 'Ngách';
  } else if (lowerRaw.includes('toa') || lowerRaw.includes('tòa')) {
    prefix = 'Tòa';
  }
  const formattedName = `${prefix} ${houseNumber} ${matchedStreet.name}`;

  return {
    id: `parsed-addr-${houseNumber}-${matchedStreet.id}`,
    name: formattedName,
    category: 'address',
    district: matchedStreet.district,
    ward: matchedStreet.ward,
    lat: matchedStreet.lat,
    lng: matchedStreet.lng,
    zoom: 17.5,
    description: matchedStreet.description
      ? `${matchedStreet.ward ? 'Phường ' + matchedStreet.ward + ', ' : ''}Quận ${matchedStreet.district}, Hà Nội`
      : `Địa chỉ chi tiết tại ${matchedStreet.name}, Hà Nội`,
    houseNumber,
    street: matchedStreet.name,
  };
}

/**
 * Filter locations based on query (accent-insensitive)
 * Includes parsed address candidate at the top if detected!
 */
export function searchHanoiLocations(query: string, limit = 8): HanoiLocationItem[] {
  if (!query || !query.trim()) return [];
  const normalizedQuery = removeVietnameseTones(query);

  const results: { item: HanoiLocationItem; score: number }[] = [];

  // Check if query is an address with house number
  const parsedAddress = parseVietnameseAddress(query);
  if (parsedAddress) {
    results.push({ item: parsedAddress, score: 200 });
  }

  for (const item of HANOI_LOCATIONS) {
    const nameNorm = removeVietnameseTones(item.name);
    const distNorm = item.district ? removeVietnameseTones(item.district) : '';
    const descNorm = item.description ? removeVietnameseTones(item.description) : '';

    let score = 0;
    if (nameNorm === normalizedQuery) {
      score += 100;
    } else if (nameNorm.startsWith(normalizedQuery)) {
      score += 60;
    } else if (nameNorm.includes(normalizedQuery)) {
      score += 40;
    } else if (distNorm.includes(normalizedQuery)) {
      score += 20;
    } else if (descNorm.includes(normalizedQuery)) {
      score += 10;
    }

    if (score > 0) {
      results.push({ item, score });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map((r) => r.item);
}

/**
 * Category metadata: labels, colors, and emoji icons
 */
export const LOCATION_CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  address:  { label: 'Số nhà / Địa chỉ', icon: '📍', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' },
  street:   { label: 'Tuyến đường', icon: '🛣️', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  project:  { label: 'Dự án / KĐT', icon: '🏙️', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
  district: { label: 'Quận / Huyện', icon: '🏛️', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  landmark: { label: 'Địa danh / Tiện ích', icon: '🎯', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
};
