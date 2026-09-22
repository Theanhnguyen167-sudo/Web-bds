export interface HanoiStreetInfo {
  name: string;
  district: string;
  ward?: string;
  lat: number;
  lng: number;
  aliases?: string[];
}

export const POPULAR_HANOI_LOCATIONS: HanoiStreetInfo[] = [
  // Cầu Giấy
  { name: 'Phố Duy Tân', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0315, lng: 105.7835, aliases: ['duy tan', 'pho duy tan'] },
  { name: 'Đường Xuân Thủy', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0368, lng: 105.7885, aliases: ['xuan thuy'] },
  { name: 'Đường Cầu Giấy', district: 'Cầu Giấy', ward: 'Quan Hoa', lat: 21.0345, lng: 105.7995, aliases: ['cau giay'] },
  { name: 'Phố Trần Thái Tông', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0322, lng: 105.7891, aliases: ['tran thai tong'] },
  { name: 'Phố Nguyễn Phong Sắc', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0392, lng: 105.7924, aliases: ['nguyen phong sac'] },
  { name: 'Đường Hoàng Quốc Việt', district: 'Cầu Giấy', ward: 'Nghĩa Đô', lat: 21.0465, lng: 105.7938, aliases: ['hoang quoc viet'] },
  { name: 'Phố Trung Kính', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0189, lng: 105.7942, aliases: ['trung kinh'] },
  { name: 'Đường Trần Duy Hưng', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0084, lng: 105.7972, aliases: ['tran duy hung'] },
  { name: 'Phố Nguyễn Chánh', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0112, lng: 105.7915, aliases: ['nguyen chanh'] },
  { name: 'Phố Dịch Vọng Hậu', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0338, lng: 105.7852, aliases: ['dich vong hau'] },
  { name: 'Phố Nghĩa Tân', district: 'Cầu Giấy', ward: 'Nghĩa Tân', lat: 21.0421, lng: 105.7925, aliases: ['nghia tan'] },
  { name: 'Đường Nguyễn Khang', district: 'Cầu Giấy', ward: 'Yên Hòa', lat: 21.0175, lng: 105.8012, aliases: ['nguyen khang'] },
  { name: 'Đường Dương Đình Nghệ', district: 'Cầu Giấy', ward: 'Yên Hòa', lat: 21.0225, lng: 105.7865, aliases: ['duong dinh nghe'] },

  // Đống Đa
  { name: 'Phố Xã Đàn', district: 'Đống Đa', ward: 'Nam Đồng', lat: 21.0145, lng: 105.8342, aliases: ['xa dan'] },
  { name: 'Phố Hào Nam', district: 'Đống Đa', ward: 'Ô Chợ Dừa', lat: 21.0258, lng: 105.8285, aliases: ['hao nam'] },
  { name: 'Đường Láng', district: 'Đống Đa', ward: 'Láng Thượng', lat: 21.0185, lng: 105.8085, aliases: ['duong lang', 'lang'] },
  { name: 'Phố Chùa Bộc', district: 'Đống Đa', ward: 'Quang Trung', lat: 21.0078, lng: 105.8288, aliases: ['chua boc'] },
  { name: 'Phố Thái Hà', district: 'Đống Đa', ward: 'Trung Liệt', lat: 21.0135, lng: 105.8198, aliases: ['thai ha'] },
  { name: 'Phố Huỳnh Thúc Kháng', district: 'Đống Đa', ward: 'Láng Hạ', lat: 21.0205, lng: 105.8125, aliases: ['huynh thuc khang'] },
  { name: 'Đường Nguyễn Lương Bằng', district: 'Đống Đa', ward: 'Nam Đồng', lat: 21.0195, lng: 105.8275, aliases: ['nguyen luong bang'] },
  { name: 'Phố Tôn Đức Thắng', district: 'Đống Đa', ward: 'Hàng Bột', lat: 21.0265, lng: 105.8335, aliases: ['ton duc thang'] },
  { name: 'Phố Hoàng Cầu', district: 'Đống Đa', ward: 'Ô Chợ Dừa', lat: 21.0182, lng: 105.8215, aliases: ['hoang cau'] },
  { name: 'Phố Ô Chợ Dừa', district: 'Đống Đa', ward: 'Ô Chợ Dừa', lat: 21.0178, lng: 105.8272, aliases: ['o cho dua'] },
  { name: 'Phố Giảng Võ', district: 'Đống Đa', ward: 'Cát Linh', lat: 21.0282, lng: 105.8242, aliases: ['giang vo'] },
  { name: 'Phố Cát Linh', district: 'Đống Đa', ward: 'Cát Linh', lat: 21.0285, lng: 105.8312, aliases: ['cat linh'] },
  { name: 'Phố Tây Sơn', district: 'Đống Đa', ward: 'Ngã Tư Sở', lat: 21.0112, lng: 105.8235, aliases: ['tay son'] },

  // Nam Từ Liêm & Bắc Từ Liêm
  { name: 'Phố Mễ Trì', district: 'Nam Từ Liêm', ward: 'Mễ Trì', lat: 21.0125, lng: 105.7765, aliases: ['me tri'] },
  { name: 'Đại Lộ Thăng Long', district: 'Nam Từ Liêm', ward: 'Mễ Trì', lat: 21.0052, lng: 105.7715, aliases: ['thang long', 'dai lo thang long'] },
  { name: 'Đường Lê Đức Thọ', district: 'Nam Từ Liêm', ward: 'Mỹ Đình 2', lat: 21.0312, lng: 105.7685, aliases: ['le duc tho'] },
  { name: 'Khu Đô Thị Mỹ Đình 1', district: 'Nam Từ Liêm', ward: 'Cầu Diễn', lat: 21.0365, lng: 105.7655, aliases: ['my dinh 1', 'my dinh'] },
  { name: 'Khu Đô Thị Mỹ Đình 2', district: 'Nam Từ Liêm', ward: 'Mỹ Đình 2', lat: 21.0335, lng: 105.7712, aliases: ['my dinh 2'] },
  { name: 'Phố Đình Thôn', district: 'Nam Từ Liêm', ward: 'Mỹ Đình 1', lat: 21.0195, lng: 105.7745, aliases: ['dinh thon'] },
  { name: 'Khu đô thị Vinhomes Smart City', district: 'Nam Từ Liêm', ward: 'Tây Mỗ', lat: 21.0028, lng: 105.7482, aliases: ['smart city', 'vinhomes smart city', 'tay mo'] },
  { name: 'Đường Phạm Văn Đồng', district: 'Bắc Từ Liêm', ward: 'Cổ Nhuế 1', lat: 21.0552, lng: 105.7825, aliases: ['pham van dong'] },
  { name: 'Khu Ngoại Giao Đoàn', district: 'Bắc Từ Liêm', ward: 'Xuân Đỉnh', lat: 21.0665, lng: 105.7952, aliases: ['ngoai giao doan', 'xuan dinh'] },

  // Ba Đình
  { name: 'Đường Kim Mã', district: 'Ba Đình', ward: 'Kim Mã', lat: 21.0312, lng: 105.8185, aliases: ['kim ma'] },
  { name: 'Phố Liễu Giai', district: 'Ba Đình', ward: 'Liễu Giai', lat: 21.0345, lng: 105.8142, aliases: ['lieu giai'] },
  { name: 'Phố Đội Cấn', district: 'Ba Đình', ward: 'Đội Cấn', lat: 21.0372, lng: 105.8215, aliases: ['doi can'] },
  { name: 'Phố Văn Cao', district: 'Ba Đình', ward: 'Liễu Giai', lat: 21.0425, lng: 105.8162, aliases: ['van cao'] },
  { name: 'Đường Hoàng Hoa Thám', district: 'Ba Đình', ward: 'Ngọc Hà', lat: 21.0415, lng: 105.8265, aliases: ['hoang hoa tham'] },
  { name: 'Phố Phan Đình Phùng', district: 'Ba Đình', ward: 'Quán Thánh', lat: 21.0412, lng: 105.8425, aliases: ['phan dinh phung'] },

  // Hoàn Kiếm
  { name: 'Phố Tràng Tiền', district: 'Hoàn Kiếm', ward: 'Tràng Tiền', lat: 21.0255, lng: 105.8565, aliases: ['trang tien'] },
  { name: 'Phố Đinh Tiên Hoàng - Hồ Gươm', district: 'Hoàn Kiếm', ward: 'Hàng Trống', lat: 21.0285, lng: 105.8525, aliases: ['ho guom', 'hoan kiem', 'dinh tien hoang'] },
  { name: 'Phố Hàng Bài', district: 'Hoàn Kiếm', ward: 'Hàng Bài', lat: 21.0222, lng: 105.8528, aliases: ['hang bai'] },
  { name: 'Phố Bà Triệu', district: 'Hoàn Kiếm', ward: 'Hàng Bài', lat: 21.0185, lng: 105.8505, aliases: ['ba trieu'] },
  { name: 'Phố Lý Thường Kiệt', district: 'Hoàn Kiếm', ward: 'Trần Hưng Đạo', lat: 21.0235, lng: 105.8492, aliases: ['ly thuong kiet'] },
  { name: 'Phố Hai Bà Trưng', district: 'Hoàn Kiếm', ward: 'Tràng Tiền', lat: 21.0252, lng: 105.8485, aliases: ['hai ba trung'] },

  // Tây Hồ
  { name: 'Đường Lạc Long Quân', district: 'Tây Hồ', ward: 'Bưởi', lat: 21.0552, lng: 105.8085, aliases: ['lac long quan'] },
  { name: 'Đường Xuân Diệu', district: 'Tây Hồ', ward: 'Quảng An', lat: 21.0655, lng: 105.8275, aliases: ['xuan dieu'] },
  { name: 'Đường Quảng An - Bán Đảo Tây Hồ', district: 'Tây Hồ', ward: 'Quảng An', lat: 21.0625, lng: 105.8312, aliases: ['quang an', 'tay ho'] },
  { name: 'Đường Võ Chí Công', district: 'Tây Hồ', ward: 'Xuân La', lat: 21.0665, lng: 105.8025, aliases: ['vo chi cong'] },
  { name: 'Đường Âu Cơ', district: 'Tây Hồ', ward: 'Tứ Liên', lat: 21.0695, lng: 105.8285, aliases: ['au co'] },
  { name: 'Khu đô thị Ciputra Tây Hồ', district: 'Tây Hồ', ward: 'Phú Thượng', lat: 21.0785, lng: 105.7985, aliases: ['ciputra'] },

  // Thanh Xuân
  { name: 'Đường Nguyễn Trãi', district: 'Thanh Xuân', ward: 'Thượng Đình', lat: 20.9985, lng: 105.8115, aliases: ['nguyen trai'] },
  { name: 'Khu đô thị Royal City', district: 'Thanh Xuân', ward: 'Thượng Đình', lat: 21.0025, lng: 105.8155, aliases: ['royal city', 'vinhomes royal city'] },
  { name: 'Đường Lê Văn Lương', district: 'Thanh Xuân', ward: 'Nhân Chính', lat: 21.0055, lng: 105.8025, aliases: ['le van luong'] },
  { name: 'Phố Vũ Trọng Phụng', district: 'Thanh Xuân', ward: 'Thanh Xuân Trung', lat: 21.0012, lng: 105.8065, aliases: ['vu trong phung'] },
  { name: 'Đường Khuất Duy Tiến', district: 'Thanh Xuân', ward: 'Thanh Xuân Bắc', lat: 20.9945, lng: 105.7955, aliases: ['khuat duy tien'] },

  // Hai Bà Trưng
  { name: 'Phố Phố Huế', district: 'Hai Bà Trưng', ward: 'Phố Huế', lat: 21.0145, lng: 105.8525, aliases: ['pho hue'] },
  { name: 'Đường Đại Cồ Việt', district: 'Hai Bà Trưng', ward: 'Lê Đại Hành', lat: 21.0085, lng: 105.8455, aliases: ['dai co viet'] },
  { name: 'Phố Bạch Mai', district: 'Hai Bà Trưng', ward: 'Bạch Mai', lat: 21.0012, lng: 105.8485, aliases: ['bach mai'] },
  { name: 'Khu đô thị Vinhomes Times City', district: 'Hai Bà Trưng', ward: 'Vĩnh Tuy', lat: 20.9955, lng: 105.8685, aliases: ['times city', 'vinh tuy'] },
  { name: 'Đường Minh Khai', district: 'Hai Bà Trưng', ward: 'Minh Khai', lat: 20.9985, lng: 105.8615, aliases: ['minh khai'] },

  // Hà Đông
  { name: 'Đường Quang Trung - Hà Đông', district: 'Hà Đông', ward: 'Quang Trung', lat: 20.9725, lng: 105.7745, aliases: ['quang trung ha dong', 'quang trung'] },
  { name: 'Đường Trần Phú - Hà Đông', district: 'Hà Đông', ward: 'Văn Quán', lat: 20.9855, lng: 105.7895, aliases: ['tran phu'] },
  { name: 'Khu đô thị Văn Quán', district: 'Hà Đông', ward: 'Văn Quán', lat: 20.9805, lng: 105.7925, aliases: ['van quan'] },
  { name: 'Khu đô thị Mỗ Lao', district: 'Hà Đông', ward: 'Mộ Lao', lat: 20.9875, lng: 105.7825, aliases: ['mo lao'] },
  { name: 'Đường Tố Hữu (Lê Văn Lương kéo dài)', district: 'Hà Đông', ward: 'Vạn Phúc', lat: 20.9885, lng: 105.7725, aliases: ['to huu', 'le van luong keo dai'] },
  { name: 'Khu đô thị Geleximco Lê Trọng Tấn', district: 'Hà Đông', ward: 'Dương Nội', lat: 20.9785, lng: 105.7485, aliases: ['geleximco', 'le trong tan', 'duong noi'] },

  // Long Biên
  { name: 'Đường Nguyễn Văn Cừ', district: 'Long Biên', ward: 'Bồ Đề', lat: 21.0415, lng: 105.8725, aliases: ['nguyen van cu'] },
  { name: 'Đường Ngô Gia Tự', district: 'Long Biên', ward: 'Đức Giang', lat: 21.0655, lng: 105.8985, aliases: ['ngo gia tu'] },
  { name: 'Khu đô thị Vinhomes Riverside', district: 'Long Biên', ward: 'Phúc Đồng', lat: 21.0505, lng: 105.9085, aliases: ['vinhomes riverside', 'riverside'] },

  // Hoàng Mai
  { name: 'Đường Giải Phóng', district: 'Hoàng Mai', ward: 'Giáp Bát', lat: 20.9855, lng: 105.8415, aliases: ['giai phong'] },
  { name: 'Khu đô thị Linh Đàm', district: 'Hoàng Mai', ward: 'Hoàng Liệt', lat: 20.9655, lng: 105.8285, aliases: ['linh dam', 'ban dao linh dam'] },
  { name: 'Đường Tam Trinh', district: 'Hoàng Mai', ward: 'Yên Sở', lat: 20.9785, lng: 105.8645, aliases: ['tam trinh'] },

  // Gia Lâm & Đông Anh
  { name: 'Đại đô thị Vinhomes Ocean Park 1', district: 'Gia Lâm', ward: 'Đa Tốn', lat: 20.9945, lng: 105.9465, aliases: ['ocean park', 'vinhomes ocean park', 'gia lam'] },
  { name: 'Thị trấn Đông Anh', district: 'Đông Anh', ward: 'Đông Anh', lat: 21.1395, lng: 105.8485, aliases: ['dong anh'] },
];

/**
 * Hàm tìm kiếm thông minh địa chỉ tại Hà Nội
 */
export function searchHanoiAddressOffline(query: string) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Tách các từ khoá
  const terms = cleanQ.split(/\s+/).filter(Boolean);

  const matched = POPULAR_HANOI_LOCATIONS.filter((item) => {
    const rawTarget = `${item.name} ${item.district} ${item.ward || ''} ${(item.aliases || []).join(' ')}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Kiểm tra xem tất cả các từ trong query có xuất hiện trong target không
    return terms.every((term) => rawTarget.includes(term));
  });

  return matched.slice(0, 8).map((item) => ({
    lat: item.lat,
    lng: item.lng,
    displayName: `${item.name}, ${item.ward ? item.ward + ', ' : ''}Quận ${item.district}, Hà Nội`,
    shortName: item.name,
    district: item.district,
    ward: item.ward || '',
    road: item.name,
    houseNumber: '',
  }));
}
