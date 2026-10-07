export interface DistrictHubInfo {
  slug: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
  planningHighlights: string[];
  averagePriceHouseM2: number; // Triệu/m2
  averagePriceApartmentM2: number; // Triệu/m2
  priceTrend: string;
  keyStreets: string[];
  keyProjects: string[];
  metroLines: string[];
}

export const HANOI_DISTRICTS_HUB_DATA: Record<string, DistrictHubInfo> = {
  'cau-giay': {
    slug: 'cau-giay',
    name: 'Quận Cầu Giấy',
    shortName: 'Cầu Giấy',
    lat: 21.0315,
    lng: 105.7835,
    zoom: 14.5,
    description: 'Trung tâm công nghệ, tài chính và giáo dục đào tạo phía Tây Thủ đô. Nổi bật với Thung lũng Silicon Duy Tân, các trường đại học hàng đầu và tuyến đường sắt đô thị Metro Nhổn - Ga Hà Nội.',
    planningHighlights: [
      'Phân khu đô thị H2-2 quy hoạch phát triển trung tâm văn phòng hạng A',
      'Tuyến Metro số 3 (Nhổn - Ga Hà Nội) vận hành thương mại',
      'Đại lộ công viên Cầu Giấy & Công viên hồ điều hòa Yên Hòa'
    ],
    averagePriceHouseM2: 245,
    averagePriceApartmentM2: 68,
    priceTrend: '+7.2%',
    keyStreets: ['Phố Duy Tân', 'Đường Xuân Thủy', 'Đường Cầu Giấy', 'Đường Trần Duy Hưng', 'Phố Trung Kính'],
    keyProjects: ['Mandarin Garden', 'The Zei Cầu Giấy', 'D’Capitale Trần Duy Hưng', 'Discovery Complex'],
    metroLines: ['Metro Tuyến 3 (Ga Cầu Giấy, Ga Chùa Hà, Ga ĐH Quốc Gia)', 'Tuyến Metro số 5 (Tương lai)']
  },
  'dong-da': {
    slug: 'dong-da',
    name: 'Quận Đống Đa',
    shortName: 'Đống Đa',
    lat: 21.0185,
    lng: 105.8300,
    zoom: 14.5,
    description: 'Khu vực nội đô lịch sử lâu đời với mật độ dân cư và thương mại sầm uất bậc nhất. Điểm trung chuyển trọng yếu kết nối trung tâm Ba Đình và khu vực Tây Nam với tuyến đường sắt trên cao Cát Linh - Hà Đông.',
    planningHighlights: [
      'Cải tạo chỉnh trang các khu tập thể cũ Kim Liên, Trung Tự, Khương Thượng',
      'Tuyến Metro 2A Cát Linh - Hà Đông vận hành ổn định',
      'Nâng cấp trục giao thông xuyên tâm Vành đai 1 và Vành đai 2'
    ],
    averagePriceHouseM2: 280,
    averagePriceApartmentM2: 72,
    priceTrend: '+5.8%',
    keyStreets: ['Phố Xã Đàn', 'Phố Hào Nam', 'Phố Chùa Bộc', 'Phố Thái Hà', 'Phố Tôn Đức Thắng'],
    keyProjects: ['Hateco Laroma Huỳnh Thúc Kháng', 'D’. Le Pont D’or Hoàng Cầu', 'TNR Tower 54A Nguyễn Chí Thanh'],
    metroLines: ['Metro Tuyến 2A (Ga Cát Linh, Ga La Thành, Ga Thái Hà)', 'Metro Tuyến 3 (Ga Cát Linh, Ga Văn Miếu)']
  },
  'nam-tu-liem': {
    slug: 'nam-tu-liem',
    name: 'Quận Nam Từ Liêm',
    shortName: 'Nam Từ Liêm',
    lat: 21.0020,
    lng: 105.7600,
    zoom: 14,
    description: 'Thủ phủ hành chính, thể thao và đô thị thông minh mới phía Tây Hà Nội. Tập trung các công trình biểu tượng quốc gia như Sân vận động Mỹ Đình, Trung tâm Hội nghị Quốc gia và đại đô thị thông minh Vinhomes Smart City.',
    planningHighlights: [
      'Mở rộng trục đại lộ Tây Mỗ - Đại Mỗ kết nối Vành đai 3.5 và Lê Trọng Tấn',
      'Quy hoạch trục phát triển dọc Đại lộ Thăng Long',
      'Hệ sinh thái đại đô thị 280ha thông minh lớn nhất miền Bắc'
    ],
    averagePriceHouseM2: 195,
    averagePriceApartmentM2: 55,
    priceTrend: '+6.1%',
    keyStreets: ['Đại Lộ Thăng Long', 'Phố Mễ Trì', 'Đường Lê Đức Thọ', 'Đường Phạm Hùng', 'Phố Đình Thôn'],
    keyProjects: ['Vinhomes Smart City', 'Keangnam Landmark 72', 'The Matrix One Mễ Trì', 'Mỹ Đình Pearl'],
    metroLines: ['Tuyến Metro số 5 (Văn Cao - Hòa Lạc)', 'Tuyến Metro số 6 (Nội Bài - Ngọc Hồi)']
  },
  'tay-ho': {
    slug: 'tay-ho',
    name: 'Quận Tây Hồ',
    shortName: 'Tây Hồ',
    lat: 21.0650,
    lng: 105.8230,
    zoom: 14,
    description: 'Bất động sản sinh thái cao cấp và cộng đồng chuyên gia quốc tế quanh 500ha mặt nước Hồ Tây. Trung tâm hành chính mới Tây Hồ Tây (Starlake) và khu ngoại giao đại sứ quán quy mô quốc tế.',
    planningHighlights: [
      'Phân khu đô thị sinh thái cảnh quan ven Hồ Tây tầm nhìn 2045',
      'Đại đô thị Starlake Tây Hồ Tây đón các cơ quan bộ ngành di dời',
      'Tuyến đại lộ 10 làn xe Võ Chí Công kết nối Sân bay Quốc tế Nội Bài'
    ],
    averagePriceHouseM2: 360,
    averagePriceApartmentM2: 95,
    priceTrend: '+7.2%',
    keyStreets: ['Đường Võ Chí Công', 'Đường Lạc Long Quân', 'Đường Xuân Diệu', 'Đường Quảng An', 'Đường Hoàng Hoa Thám'],
    keyProjects: ['Starlake Tây Hồ Tây', 'Ciputra Nam Thăng Long', 'Sun Grand City Thụy Khuê', 'D’. Le Roi Soleil Quảng An'],
    metroLines: ['Tuyến Metro số 2 (Nam Thăng Long - Trần Hưng Đạo)']
  },
  'ba-dinh': {
    slug: 'ba-dinh',
    name: 'Quận Ba Đình',
    shortName: 'Ba Đình',
    lat: 21.0340,
    lng: 105.8250,
    zoom: 14.5,
    description: 'Trái tim chính trị - hành chính quốc gia của Việt Nam. Tập trung các cơ quan đầu não của Đảng, Nhà nước, các đại sứ quán ngoại giao và những tuyến phố di sản rợp bóng cây xanh.',
    planningHighlights: [
      'Bảo tồn nghiêm ngặt vùng cảnh quan di sản Ba Đình và Hoàng thành Thăng Long',
      'Ga ngầm trung chuyển lớn nhất Thủ đô - Ga ngầm S9 Kim Mã Tuyến 3',
      'Nâng cấp tuyến phố ngoại giao Liễu Giai - Văn Cao'
    ],
    averagePriceHouseM2: 340,
    averagePriceApartmentM2: 90,
    priceTrend: '+4.5%',
    keyStreets: ['Đường Kim Mã', 'Đường Liễu Giai', 'Phố Đội Cấn', 'Phố Phan Đình Phùng', 'Phố Hoàng Hoa Thám'],
    keyProjects: ['Vinhomes Metropolis 29 Liễu Giai', 'Lotte Center Hà Nội', 'Grandeur Palace Giảng Võ'],
    metroLines: ['Metro Tuyến 3 (Ga Kim Mã)', 'Tuyến Metro số 5 (Văn Cao)']
  },
  'hoan-kiem': {
    slug: 'hoan-kiem',
    name: 'Quận Hoàn Kiếm',
    shortName: 'Hoàn Kiếm',
    lat: 21.0310,
    lng: 105.8525,
    zoom: 15,
    description: 'Linh hồn lịch sử ngàn năm văn hiến của Thăng Long - Hà Nội với Hồ Gươm và 36 phố phường. Bất động sản có giá trị văn hóa và thanh khoản kim cương với giá đất đắt đỏ bậc nhất cả nước.',
    planningHighlights: [
      'Bảo tồn kiến trúc di sản Phố Cổ và không gian văn hóa đi bộ Hồ Gươm',
      'Tuyến Metro ngầm số 2 xuyên qua khu vực Trần Hưng Đạo - Hàng Đậu',
      'Quy hoạch không gian ngầm đô thị kết hợp thương mại dịch vụ du lịch'
    ],
    averagePriceHouseM2: 650,
    averagePriceApartmentM2: 150,
    priceTrend: '+3.9%',
    keyStreets: ['Phố Tràng Tiền', 'Phố Hàng Ngang', 'Phố Hàng Đào', 'Phố Lý Thường Kiệt', 'Phố Trần Hưng Đạo'],
    keyProjects: ['T-Place 30A Lý Thường Kiệt', 'D’. San Raffles Hàng Bài', 'Tràng Tiền Plaza'],
    metroLines: ['Metro Tuyến 2 (Ga Hàng Đậu, Ga Trần Hưng Đạo)']
  },
  'ha-dong': {
    slug: 'ha-dong',
    name: 'Quận Hà Đông',
    shortName: 'Hà Đông',
    lat: 20.9700,
    lng: 105.7750,
    zoom: 13.5,
    description: 'Cửa ngõ Tây Nam phát triển năng động với tốc độ đô thị hóa nhanh nhất Hà Nội. Kết nối trực tiếp với trung tâm thành phố qua tuyến đường sắt trên cao 2A và trục đại lộ Quang Trung - Nguyễn Trãi.',
    planningHighlights: [
      'Trục đô thị sinh thái kết nối Vành đai 3.5 và Vành đai 4 Vùng Thủ đô',
      'Đại siêu thị Aeon Mall Hà Đông thúc đẩy giao thương khu vực',
      'Mở rộng các cụm đô thị Văn Phú, Dương Nội, Park City'
    ],
    averagePriceHouseM2: 155,
    averagePriceApartmentM2: 42,
    priceTrend: '+6.8%',
    keyStreets: ['Đường Quang Trung', 'Đường Tố Hữu', 'Đường Lê Trọng Tấn', 'Đường Phùng Hưng', 'Đường Văn Phú'],
    keyProjects: ['Park City Hà Nội', 'Khu đô thị Văn Phú', 'Khu đô thị Dương Nội', 'The Terra An Hưng'],
    metroLines: ['Metro Tuyến 2A (Ga Văn Quán, Ga Hà Đông, Ga Yên Nghĩa)']
  },
  'long-bien': {
    slug: 'long-bien',
    name: 'Quận Long Biên',
    shortName: 'Long Biên',
    lat: 21.0420,
    lng: 105.8900,
    zoom: 13.5,
    description: 'Thủ phủ bất động sản sinh thái bên kia Sông Hồng với hạ tầng giao thông đồng bộ nhất Thủ đô. Cảnh quan thoáng đãng với quần thể biệt thự triệu đô Vinhomes Riverside và các đại siêu thị Aeon Mall, Savico MegaMall.',
    planningHighlights: [
      'Xây dựng các cây cầu huyết mạch mới qua Sông Hồng: Cầu Trần Hưng Đạo, Cầu Tứ Liên',
      'Phát triển thành phố bờ Đông hiện đại, không gian sống xanh ven sông',
      'Mở rộng các trục đường 40m kết nối thẳng cao tốc Hà Nội - Hải Phòng'
    ],
    averagePriceHouseM2: 175,
    averagePriceApartmentM2: 48,
    priceTrend: '+6.5%',
    keyStreets: ['Đường Nguyễn Văn Cừ', 'Đường Cổ Linh', 'Đường Ngô Gia Tự', 'Đường Chu Huy Mân', 'Đường Đoàn Khuê'],
    keyProjects: ['Vinhomes Riverside', 'Vinhomes Symphony', 'Khu đô thị Việt Hưng', 'Khu đô thị Sài Đồng'],
    metroLines: ['Tuyến Metro số 1 (Yên Viên - Ngọc Hồi)']
  }
};
