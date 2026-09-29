/**
 * Hanoi locations database and search utilities
 * Covers Districts, Major Urban Projects (Vinhomes, Ciputra, Starlake...),
 * Arterial Streets, and Famous Landmarks with coordinates and zoom levels.
 */

export interface HanoiLocationItem {
  id: string;
  name: string;
  category: 'district' | 'project' | 'street' | 'landmark';
  district?: string;
  lat: number;
  lng: number;
  zoom: number;
  description?: string;
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
  { id: 'proj-vop', name: 'Vinhomes Ocean Park', category: 'project', district: 'Gia Lâm', lat: 20.9922, lng: 105.9472, zoom: 15.5, description: 'Thành phố Biển Hồ 420ha với biển nước mặn nhân tạo' },
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

  // ── 3. TUYẾN ĐƯỜNG & PHỐ HUYẾT MẠCH ──
  { id: 'str-cg', name: 'Đường Cầu Giấy', category: 'street', district: 'Cầu Giấy', lat: 21.0330, lng: 105.7968, zoom: 15.5, description: 'Trục thương mại sầm uất song song tuyến Metro Nhổn' },
  { id: 'str-dt', name: 'Phố Duy Tân', category: 'street', district: 'Cầu Giấy', lat: 21.0305, lng: 105.7836, zoom: 16, description: 'Thung lũng Silicon Hà Nội, tập trung tòa nhà văn phòng công nghệ' },
  { id: 'str-tdh', name: 'Đường Trần Duy Hưng', category: 'street', district: 'Cầu Giấy', lat: 21.0090, lng: 105.7980, zoom: 15.5, description: 'Cửa ngõ Tây Nam nối Trung Hòa Nhân Chính và Đại lộ Thăng Long' },
  { id: 'str-nt', name: 'Đường Nguyễn Trãi', category: 'street', district: 'Thanh Xuân', lat: 20.9950, lng: 105.8120, zoom: 15.5, description: 'Trục giao thông chính phía Tây Nam theo tuyến đường sắt Cát Linh' },
  { id: 'str-km', name: 'Đường Kim Mã', category: 'street', district: 'Ba Đình', lat: 21.0315, lng: 105.8200, zoom: 16, description: 'Tuyến đường huyết mạch trung tâm Ba Đình nối Ga Kim Mã' },
  { id: 'str-lg', name: 'Đường Liễu Giai', category: 'street', district: 'Ba Đình', lat: 21.0350, lng: 105.8140, zoom: 16, description: 'Tuyến phố ngoại giao sang trọng bậc nhất Hà Nội' },
  { id: 'str-vcc', name: 'Đường Võ Chí Công', category: 'street', district: 'Tây Hồ', lat: 21.0660, lng: 105.8080, zoom: 15, description: 'Đại lộ 10 làn xe kết nối Cầu Nhật Tân tới sân bay Nội Bài' },
  { id: 'str-hht', name: 'Đường Hoàng Hoa Thám', category: 'street', district: 'Ba Đình', lat: 21.0440, lng: 105.8190, zoom: 15.5, description: 'Tuyến đường cây xanh di sản chạy ven Tây Hồ' },
  { id: 'str-ph', name: 'Đường Phạm Hùng', category: 'street', district: 'Nam Từ Liêm', lat: 21.0200, lng: 105.7790, zoom: 15, description: 'Trục Vành đai 3 phía Tây, Trung tâm Hội nghị Quốc gia' },
  { id: 'str-lh', name: 'Đường Láng Hạ', category: 'street', district: 'Đống Đa', lat: 21.0180, lng: 105.8160, zoom: 16, description: 'Phố tài chính ngân hàng sầm uất thủ đô' },
  { id: 'str-dltt', name: 'Đại lộ Thăng Long', category: 'street', district: 'Nam Từ Liêm', lat: 21.0050, lng: 105.7500, zoom: 14, description: 'Cao tốc hiện đại nhất cửa ngõ phía Tây hướng Hòa Lạc' },
  { id: 'str-pho-co', name: 'Khu Phố Cổ Hà Nội', category: 'street', district: 'Hoàn Kiếm', lat: 21.0345, lng: 105.8505, zoom: 16.5, description: '36 phố phường di sản: Hàng Ngang, Hàng Đào, Mã Mây, Tạ Hiện' },

  // ── 4. ĐỊA DANH & HẠ TẦNG NỔI TIẾNG ──
  { id: 'lm-hg', name: 'Hồ Hoàn Kiếm (Hồ Gươm)', category: 'landmark', district: 'Hoàn Kiếm', lat: 21.0285, lng: 105.8542, zoom: 16, description: 'Trái tim của thủ đô Hà Nội, Tháp Rùa, Đền Ngọc Sơn' },
  { id: 'lm-ht', name: 'Hồ Tây (West Lake)', category: 'landmark', district: 'Tây Hồ', lat: 21.0550, lng: 105.8250, zoom: 14.5, description: 'Hồ nước ngọt tự nhiên lớn nhất Hà Nội với 500ha mặt nước' },
  { id: 'lm-catlinh', name: 'Ga Metro Cát Linh', category: 'landmark', district: 'Đống Đa', lat: 21.0280, lng: 105.8383, zoom: 16.5, description: 'Ga đầu tuyến đường sắt trên cao 2A Cát Linh - Hà Đông' },
  { id: 'lm-ganhon', name: 'Ga Metro Nhổn', category: 'landmark', district: 'Bắc Từ Liêm', lat: 21.0451, lng: 105.7614, zoom: 16.5, description: 'Ga depot tuyến đường sắt Metro Tuyến 3' },
  { id: 'lm-gahanoi', name: 'Ga Hà Nội', category: 'landmark', district: 'Đống Đa', lat: 21.0245, lng: 105.8415, zoom: 16.5, description: 'Đầu mối đường sắt quốc gia và ga ngầm tương lai tuyến 3' },
  { id: 'lm-bachmai', name: 'Bệnh viện Bạch Mai', category: 'landmark', district: 'Đống Đa', lat: 21.0046, lng: 105.8450, zoom: 16, description: 'Bệnh viện tuyến cuối lớn nhất miền Bắc' },
  { id: 'lm-dhqg', name: 'Đại học Quốc gia Hà Nội', category: 'landmark', district: 'Cầu Giấy', lat: 21.0380, lng: 105.7834, zoom: 16, description: '144 Xuân Thủy, Cầu Giấy' },
];

/**
 * Filter locations based on query (accent-insensitive)
 */
export function searchHanoiLocations(query: string, limit = 8): HanoiLocationItem[] {
  if (!query || !query.trim()) return [];
  const normalizedQuery = removeVietnameseTones(query);

  const results: { item: HanoiLocationItem; score: number }[] = [];

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
export const LOCATION_CATEGORY_CONFIG = {
  district: { label: 'Quận / Huyện', icon: '🏛️', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  project:  { label: 'Dự án / KĐT', icon: '🏙️', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
  street:   { label: 'Tuyến đường', icon: '🛣️', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  landmark: { label: 'Địa danh',   icon: '📍', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
};
