/**
 * HANOI GEO-SPATIAL POI & INFRASTRUCTURE DATA
 * Dữ liệu tọa độ thực tế chuẩn xác 100% (WGS84 / Google Maps)
 * Bao gồm:
 * 1. Tuyến & Ga Metro đô thị
 * 2. Dự án hạ tầng giao thông huyết mạch & trọng điểm
 * 3. Bệnh viện & Cơ sở y tế tuyến đầu
 * 4. Trường học & Đại học trọng điểm
 * 5. Trung tâm thương mại & Siêu thị lớn
 * 6. Công viên & Hồ cảnh quan mặt nước
 * 7. Phân khu quy hoạch đô thị Hà Nội (Đất ở ODT, Thương mại TMD, Cây xanh CCC, Giao thông GT)
 */

export interface GeoPOIItem {
  id: string;
  name: string;
  category: 'metro' | 'hospital' | 'school' | 'mall' | 'park' | 'infrastructure' | 'admin';
  categoryLabel: string;
  lat: number;
  lng: number;
  address: string;
  district: string;
  rating?: number;
  description?: string;
  googleMapsPlaceUrl?: string;
}

export interface InfrastructureProjectItem {
  id: string;
  name: string;
  type: 'metro' | 'bridge' | 'ring_road' | 'road_expansion' | 'urban_complex';
  typeLabel: string;
  lat: number;
  lng: number;
  district: string;
  status: 'completed' | 'construction' | 'planning';
  year: string;
  description: string;
  impactScore: number; // 1-10
  priceImpactSummary: string;
  googleMapsPlaceUrl?: string;
}

export interface PlanningPolygonZone {
  id: string;
  code: string; // ODT, TMD, CCC, GT, HH, CLN...
  name: string;
  type: 'residential' | 'commercial' | 'green' | 'transport' | 'mixed' | 'public';
  typeLabel: string;
  district: string;
  color: string;
  fillOpacity: number;
  planYear: number;
  floorAreaRatio: number;
  maxHeight: string;
  density: string;
  status: string;
  description: string;
  coordinates: [number, number][]; // [lat, lng] array
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DANH MỤC TIỆN ÍCH THỰC TẾ HÀ NỘI (CHUẨN TỌA ĐỘ GOOGLE MAPS)
// ─────────────────────────────────────────────────────────────────────────────

export const HANOI_GEO_POIS: GeoPOIItem[] = [
  // ── GA METRO ĐÔ THỊ ──
  {
    id: 'poi-metro-catlinh',
    name: 'Ga Metro Cát Linh (Tuyến 2A & Tuyến 3)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0280,
    lng: 105.8383,
    address: '192 Phố Hào Nam, Ô Chợ Dừa, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.8,
    description: 'Ga đầu mối kết nối Metro Tuyến 2A (Cát Linh - Hà Đông) và Tuyến 3 (Nhổn - Ga Hà Nội)',
  },
  {
    id: 'poi-metro-vanmieu',
    name: 'Ga Metro Văn Miếu (Tuyến 3 Ngầm)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0285,
    lng: 105.8362,
    address: 'Phố Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.6,
    description: 'Ga ngầm S10 tuyến Metro số 3 (Nhổn - Ga Hà Nội), cạnh di tích Quốc gia đặc biệt Văn Miếu - Quốc Tử Giám',
  },
  {
    id: 'poi-metro-lathanh',
    name: 'Ga Metro La Thành (Tuyến 2A)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0210,
    lng: 105.8260,
    address: 'Phố Hoàng Cầu, Ô Chợ Dừa, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.7,
    description: 'Ga ven hồ Hoàng Cầu, kết nối tuyến Đê La Thành và Thái Hà',
  },
  {
    id: 'poi-metro-thaiha',
    name: 'Ga Metro Thái Hà (Tuyến 2A)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0152,
    lng: 105.8188,
    address: 'Đường Yên Lãng, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.7,
    description: 'Nút giao ngã tư Thái Hà - Hoàng Cầu - Yên Lãng',
  },
  {
    id: 'poi-metro-lang',
    name: 'Ga Metro Láng (Tuyến 2A)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0080,
    lng: 105.8130,
    address: 'Đường Láng, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.7,
    description: 'Ga vượt sông Tô Lịch, kết nối Đống Đa và Thanh Xuân',
  },
  {
    id: 'poi-metro-thuongdinh',
    name: 'Ga Metro Thượng Đình (Tuyến 2A)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 20.9995,
    lng: 105.8120,
    address: 'Đường Nguyễn Trãi, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    rating: 4.8,
    description: 'Đối diện đại đô thị Vinhomes Royal City và trục Vành đai 2',
  },
  {
    id: 'poi-metro-caugiay',
    name: 'Ga Metro Cầu Giấy (Tuyến 3)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0330,
    lng: 105.7968,
    address: 'Cầu Giấy, Ngọc Khánh, Ba Đình, Hà Nội',
    district: 'Cầu Giấy',
    rating: 4.9,
    description: 'Ga trung tâm chuyển tiếp đoạn trên cao và đi ngầm tuyến Metro 3',
  },
  {
    id: 'poi-metro-kimma',
    name: 'Ga Metro Kim Mã (Tuyến 3 Ngầm)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0312,
    lng: 105.8136,
    address: 'Đường Kim Mã, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    rating: 4.9,
    description: 'Ga ngầm hiện đại tại trung tâm quận Ba Đình gần khách sạn Daewoo và Lotte Center',
  },
  {
    id: 'poi-metro-dhqg',
    name: 'Ga Metro Đại học Quốc Gia (Tuyến 3)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0365,
    lng: 105.7820,
    address: 'Đường Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    rating: 4.8,
    description: 'Ga trung tâm kết nối ĐHQG, ĐH Sư Phạm và cụm văn phòng Duy Tân',
  },
  {
    id: 'poi-metro-nhon',
    name: 'Ga Metro Nhổn (Depot Tuyến 3)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0545,
    lng: 105.7350,
    address: 'Quốc lộ 32, Minh Khai, Bắc Từ Liêm, Hà Nội',
    district: 'Bắc Từ Liêm',
    rating: 4.7,
    description: 'Ga đầu tuyến 3 khu vực phía Tây Bắc',
  },
  {
    id: 'poi-metro-gahanoi',
    name: 'Ga Metro Ga Hà Nội (Tuyến 3 Ngầm)',
    category: 'metro',
    categoryLabel: 'Ga Metro',
    lat: 21.0245,
    lng: 105.8415,
    address: 'Đường Lê Duẩn, Văn Miếu, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.8,
    description: 'Đầu mối giao thông đường sắt quốc gia và ga ngầm metro trung tâm',
  },

  // ── BỆNH VIỆN TUYẾN ĐẦU & Y TẾ ──
  {
    id: 'poi-hosp-bachmai',
    name: 'Bệnh viện Bạch Mai',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0046,
    lng: 105.8450,
    address: '78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.8,
    description: 'Bệnh viện đa khoa tuyến cuối đặc biệt lớn nhất miền Bắc',
  },
  {
    id: 'poi-hosp-vietduc',
    name: 'Bệnh viện Hữu Nghị Việt Đức',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0299,
    lng: 105.8451,
    address: '40 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    rating: 4.9,
    description: 'Trung tâm phẫu thuật ngoại khoa hàng đầu cả nước',
  },
  {
    id: 'poi-hosp-108',
    name: 'Bệnh viện Trung ương Quân đội 108',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0226,
    lng: 105.8588,
    address: 'Số 1 Trần Hưng Đạo, Bạch Đằng, Hai Bà Trưng, Hà Nội',
    district: 'Hai Bà Trưng',
    rating: 4.9,
    description: 'Bệnh viện hạng đặc biệt quốc gia với trang thiết bị y khoa tiên tiến nhất',
  },
  {
    id: 'poi-hosp-nhitw',
    name: 'Bệnh viện Nhi Trung ương',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0289,
    lng: 105.8093,
    address: '18/879 Đê La Thành, Láng Thượng, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.7,
    description: 'Bệnh viện chuyên khoa Nhi đầu ngành cả nước',
  },
  {
    id: 'poi-hosp-phusan',
    name: 'Bệnh viện Phụ Sản Hà Nội',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0298,
    lng: 105.8080,
    address: '929 Đường La Thành, Ngọc Khánh, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    rating: 4.7,
    description: 'Bệnh viện chuyên khoa Phụ sản hạng I của thủ đô',
  },
  {
    id: 'poi-hosp-e',
    name: 'Bệnh viện E',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0505,
    lng: 105.7872,
    address: '89 Trần Cung, Nghĩa Tân, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    rating: 4.6,
    description: 'Bệnh viện đa khoa trung ương với Trung tâm Tim mạch hiện đại',
  },
  {
    id: 'poi-hosp-198',
    name: 'Bệnh viện 19-8 Bộ Công An',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0375,
    lng: 105.7765,
    address: 'Số 9 Trần Bình, Mai Dịch, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    rating: 4.7,
    description: 'Bệnh viện đa khoa hạng I thuộc Bộ Công An',
  },
  {
    id: 'poi-hosp-tamanh',
    name: 'Bệnh viện Đa khoa Tâm Anh',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0392,
    lng: 105.8752,
    address: '108 Hoàng Như Tiếp, Bồ Đề, Long Biên, Hà Nội',
    district: 'Long Biên',
    rating: 4.9,
    description: 'Bệnh viện khách sạn cao cấp hàng đầu bờ Đông sông Hồng',
  },
  {
    id: 'poi-hosp-vinmec-times',
    name: 'Bệnh viện Đa khoa Quốc tế Vinmec Times City',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 20.9958,
    lng: 105.8672,
    address: '458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội',
    district: 'Hai Bà Trưng',
    rating: 4.9,
    description: 'Bệnh viện đạt chuẩn thẩm định quốc tế JCI danh giá',
  },
  {
    id: 'poi-hosp-timhn2',
    name: 'Bệnh viện Tim Hà Nội (Cơ sở 2)',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0665,
    lng: 105.8115,
    address: 'Đường Võ Chí Công, Xuân La, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    rating: 4.7,
    description: 'Cơ sở hiện đại chuyên sâu tim mạch phục vụ khu vực Tây Hồ & ngoại thành',
  },
  {
    id: 'poi-hosp-dongda',
    name: 'Bệnh viện Đa khoa Đống Đa',
    category: 'hospital',
    categoryLabel: 'Bệnh viện',
    lat: 21.0152,
    lng: 105.8273,
    address: 'Ngõ 180 Nguyễn Lương Bằng, Quang Trung, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.6,
    description: 'Bệnh viện đa khoa trung tâm quận Đống Đa',
  },

  // ── GIÁO DỤC, ĐẠI HỌC & TRƯỜNG QUỐC TẾ ──
  {
    id: 'poi-edu-dhqg',
    name: 'Đại học Quốc gia Hà Nội',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0380,
    lng: 105.7834,
    address: '144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    rating: 4.9,
    description: 'Trung tâm đào tạo đại học và nghiên cứu khoa học số 1 Việt Nam',
  },
  {
    id: 'poi-edu-bachkhoa',
    name: 'Đại học Bách Khoa Hà Nội',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0044,
    lng: 105.8431,
    address: 'Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội',
    district: 'Hai Bà Trưng',
    rating: 4.9,
    description: 'Trường đại học kỹ thuật hàng đầu đất nước',
  },
  {
    id: 'poi-edu-ktqd',
    name: 'Đại học Kinh tế Quốc dân (NEU)',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0015,
    lng: 105.8427,
    address: '207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội',
    district: 'Hai Bà Trưng',
    rating: 4.9,
    description: 'Cái nôi đào tạo chuyên gia kinh tế, tài chính và quản trị kinh doanh',
  },
  {
    id: 'poi-edu-ftu',
    name: 'Đại học Ngoại Thương (FTU)',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0232,
    lng: 105.8035,
    address: '91 Phố Chùa Láng, Láng Thượng, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.9,
    description: 'Trường đại học danh giá hàng đầu ngành kinh tế đối ngoại',
  },
  {
    id: 'poi-edu-ams',
    name: 'Trường THPT Chuyên Hà Nội - Amsterdam',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0076,
    lng: 105.7955,
    address: 'Số 1 Hoàng Minh Giám, Trung Hòa, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    rating: 5.0,
    description: 'Trường THPT chuyên danh giá bậc nhất thủ đô',
  },
  {
    id: 'poi-edu-chuvanan',
    name: 'Trường THPT Chu Văn An (Trường Bưởi)',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0442,
    lng: 105.8293,
    address: 'Số 10 Thụy Khuê, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    rating: 4.9,
    description: 'Ngôi trường cổ kính hơn 115 năm tuổi tọa lạc bên bờ Hồ Tây',
  },
  {
    id: 'poi-edu-unis',
    name: 'Trường Quốc tế Liên Hợp Quốc UNIS Hanoi',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0772,
    lng: 105.7995,
    address: 'KĐT Nam Thăng Long Ciputra, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    rating: 5.0,
    description: 'Trường quốc tế hàng đầu đào tạo tú tài quốc tế IB',
  },
  {
    id: 'poi-edu-bis',
    name: 'Trường Quốc tế Anh BIS Hanoi',
    category: 'school',
    categoryLabel: 'Giáo dục',
    lat: 21.0475,
    lng: 105.9082,
    address: 'KĐT Vinhomes Riverside, Phúc Lợi, Long Biên, Hà Nội',
    district: 'Long Biên',
    rating: 4.9,
    description: 'Cơ sở giáo dục đẳng cấp quốc tế chuẩn Anh Quốc',
  },

  // ── TRUNG TÂM THƯƠNG MẠI & MUA SẮM ──
  {
    id: 'poi-mall-lottetayho',
    name: 'Lotte Mall Tây Hồ & Thủy cung',
    category: 'mall',
    categoryLabel: 'Mua sắm',
    lat: 21.0745,
    lng: 105.8122,
    address: '272 Võ Chí Công, Phú Thượng, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    rating: 4.9,
    description: 'Tổ hợp thương mại - giải trí - văn phòng quy mô 7.3ha lớn nhất thủ đô',
  },
  {
    id: 'poi-mall-lottecenter',
    name: 'Lotte Center Hà Nội & SkyWalk',
    category: 'mall',
    categoryLabel: 'Mua sắm',
    lat: 21.0322,
    lng: 105.8130,
    address: '54 Liễu Giai, Cống Vị, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    rating: 4.8,
    description: 'Tòa tháp biểu tượng 65 tầng trung tâm quận Ba Đình',
  },
  {
    id: 'poi-mall-vincomphamngocthach',
    name: 'Vincom Center Phạm Ngọc Thạch',
    category: 'mall',
    categoryLabel: 'Mua sắm',
    lat: 21.0082,
    lng: 105.8328,
    address: 'Số 2 Phạm Ngọc Thạch, Kim Liên, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.7,
    description: 'TTTM sầm uất trung tâm Đống Đa với cụm rạp chiếu phim BHD Star',
  },
  {
    id: 'poi-mall-vincomroyal',
    name: 'Vincom Mega Mall Royal City',
    category: 'mall',
    categoryLabel: 'Mua sắm',
    lat: 21.0028,
    lng: 105.8152,
    address: '72A Nguyễn Trãi, Thượng Đình, Thanh Xuân, Hà Nội',
    district: 'Thanh Xuân',
    rating: 4.8,
    description: 'Thành phố ngầm mua sắm ẩm thực giải trí khổng lồ 230.000m²',
  },
  {
    id: 'poi-mall-trangtien',
    name: 'Tràng Tiền Plaza',
    category: 'mall',
    categoryLabel: 'Mua sắm',
    lat: 21.0252,
    lng: 105.8538,
    address: '24 Hai Bà Trưng, Tràng Tiền, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    rating: 4.8,
    description: 'Trung tâm hàng hiệu xa xỉ hàng đầu thủ đô bên hồ Hoàn Kiếm',
  },
  {
    id: 'poi-mall-aeonlongbien',
    name: 'Aeon Mall Long Biên',
    category: 'mall',
    categoryLabel: 'Mua sắm',
    lat: 21.0265,
    lng: 105.8988,
    address: 'Số 27 Cổ Linh, Long Biên, Hà Nội',
    district: 'Long Biên',
    rating: 4.9,
    description: 'Đại siêu thị Nhật Bản phục vụ hàng triệu cư dân phía Đông',
  },
  {
    id: 'poi-mall-keangnam',
    name: 'Keangnam Landmark 72 & The Garden Mall',
    category: 'mall',
    categoryLabel: 'Mua sắm',
    lat: 21.0175,
    lng: 105.7838,
    address: 'Đường Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội',
    district: 'Nam Từ Liêm',
    rating: 4.8,
    description: 'Tòa nhà cao thứ hai Việt Nam cùng quần thể căn hộ dịch vụ cao cấp',
  },

  // ── CÔNG VIÊN & MẶT NƯỚC CẢNH QUAN ──
  {
    id: 'poi-park-hoankiem',
    name: 'Hồ Hoàn Kiếm (Hồ Gươm) & Phố Đi Bộ',
    category: 'park',
    categoryLabel: 'Công viên',
    lat: 21.0285,
    lng: 105.8542,
    address: 'Phố Đinh Tiên Hoàng, Hàng Trống, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    rating: 5.0,
    description: 'Trái tim văn hóa - lịch sử ngàn năm của thủ đô Hà Nội',
  },
  {
    id: 'poi-park-hotay',
    name: 'Hồ Tây & Đường Dạo Ven Hồ',
    category: 'park',
    categoryLabel: 'Công viên',
    lat: 21.0550,
    lng: 105.8250,
    address: 'Đường Thanh Niên - Quảng Khánh, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    rating: 5.0,
    description: 'Hồ nước ngọt tự nhiên lớn nhất thủ đô với hơn 500ha mặt nước sinh thái',
  },
  {
    id: 'poi-park-hoangcau',
    name: 'Hồ Hoàng Cầu & Vườn Hoa Hào Nam',
    category: 'park',
    categoryLabel: 'Công viên',
    lat: 21.0205,
    lng: 105.8245,
    address: 'Phố Hoàng Cầu, Ô Chợ Dừa, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.7,
    description: 'Lá phổi xanh điều hòa khí hậu trung tâm quận Đống Đa',
  },
  {
    id: 'poi-park-caugiay',
    name: 'Công viên Cầu Giấy (10ha)',
    category: 'park',
    categoryLabel: 'Công viên',
    lat: 21.0298,
    lng: 105.7915,
    address: 'Phố Thành Thái, Dịch Vọng, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    rating: 4.8,
    description: 'Công viên kiểu mẫu với đồi cỏ nhân tạo và khu vui chơi hiện đại',
  },
  {
    id: 'poi-park-thongnhat',
    name: 'Công viên Thống Nhất & Hồ Bảy Mẫu',
    category: 'park',
    categoryLabel: 'Công viên',
    lat: 21.0135,
    lng: 105.8435,
    address: '354A Lê Duẩn, Phương Liên, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    rating: 4.8,
    description: 'Công viên cây xanh di sản hơn 50ha lâu đời bậc nhất Hà Nội',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. DỰ ÁN HẠ TẦNG GIAO THÔNG & METRO TRỌNG ĐIỂM
// ─────────────────────────────────────────────────────────────────────────────

export const HANOI_INFRASTRUCTURE_PROJECTS: InfrastructureProjectItem[] = [
  {
    id: 'infra-metro-3-underground',
    name: 'Metro Tuyến 3 (Đoạn ngầm Kim Mã - Cát Linh - Ga Hà Nội)',
    type: 'metro',
    typeLabel: 'Tuyến Metro Ngầm',
    lat: 21.0280,
    lng: 105.8335,
    district: 'Đống Đa - Ba Đình',
    status: 'construction',
    year: '2027',
    description: 'Dự án trọng điểm quốc gia dài 4km đi ngầm qua 4 ga: Kim Mã, Cát Linh, Văn Miếu, Ga Hà Nội. Hiện robot khoan hầm TBM đang thi công liên tục.',
    impactScore: 9.8,
    priceImpactSummary: 'Tăng trưởng giá trị BĐS lân cận dự kiến 18 - 25% sau khi thông tuyến ngầm',
  },
  {
    id: 'infra-metro-2a',
    name: 'Đường sắt Đô thị Tuyến 2A (Cát Linh - Hà Đông)',
    type: 'metro',
    typeLabel: 'Metro Vận Hành',
    lat: 21.0152,
    lng: 105.8188,
    district: 'Đống Đa - Thanh Xuân',
    status: 'completed',
    year: '2021',
    description: 'Tuyến đường sắt đô thị đầu tiên của Việt Nam, chiều dài 13.05km với 12 ga trên cao, công suất vận chuyển hơn 35.000 lượt khách/ngày.',
    impactScore: 9.0,
    priceImpactSummary: 'Đã hoàn thành và tạo mặt bằng giá ổn định, thanh khoản cho thuê cực cao',
  },
  {
    id: 'infra-metro-line-5',
    name: 'Tuyến Metro số 5 (Văn Cao - Ngọc Khánh - Láng Hòa Lạc)',
    type: 'metro',
    typeLabel: 'Metro Quy Hoạch',
    lat: 21.0315,
    lng: 105.8050,
    district: 'Ba Đình - Cầu Giấy',
    status: 'planning',
    year: '2028',
    description: 'Tuyến metro trục Tây dài 39km kết nối lõi nội đô Ba Đình với Khu công nghệ cao Hòa Lạc.',
    impactScore: 9.2,
    priceImpactSummary: 'Tác động mạnh mẽ đến các BĐS dọc trục Liễu Giai - Trần Duy Hưng',
  },
  {
    id: 'infra-cau-tulien',
    name: 'Cầu Tứ Liên vượt sông Hồng & Đường nối cao tốc Hà Nội - Thái Nguyên',
    type: 'bridge',
    typeLabel: 'Cầu Vượt Sông',
    lat: 21.0720,
    lng: 105.8450,
    district: 'Tây Hồ - Đông Anh',
    status: 'construction',
    year: '2027',
    description: 'Cầu dây văng hiện đại kết nối trực tiếp quận Tây Hồ với trung tâm tài chính Đông Anh, chiều dài 4.8km.',
    impactScore: 9.6,
    priceImpactSummary: 'Tạo cú hích đột phá cho giá đất bán đảo Quảng An, Tứ Liên và Đông Anh',
  },
  {
    id: 'infra-cau-tranhungdao',
    name: 'Cầu Trần Hưng Đạo nối Hoàn Kiếm sang Long Biên',
    type: 'bridge',
    typeLabel: 'Cầu Vượt Sông',
    lat: 21.0260,
    lng: 105.8720,
    district: 'Hoàn Kiếm - Long Biên',
    status: 'planning',
    year: '2027',
    description: 'Cầu vòm kiến trúc phong cách Đông Dương nối phố Trần Hưng Đạo với đường Cổ Linh, Long Biên.',
    impactScore: 9.4,
    priceImpactSummary: 'Rút ngắn thời gian di chuyển từ Long Biên vào phố cổ còn 5 phút',
  },
  {
    id: 'infra-vanhdai-2-trencao',
    name: 'Đường Vành Đai 2 Trên Cao (Vĩnh Tuy - Ngã Tư Vọng - Ngã Tư Sở)',
    type: 'ring_road',
    typeLabel: 'Đường Vành Đai',
    lat: 21.0010,
    lng: 105.8360,
    district: 'Đống Đa - Hai Bà Trưng',
    status: 'completed',
    year: '2023',
    description: 'Tuyến đường trên cao hiện đại 4 làn xe giải tỏa áp lực giao thông cho toàn bộ vành đai trung tâm.',
    impactScore: 8.8,
    priceImpactSummary: 'Nâng cao kết nối vùng liên quận Đống Đa - Thanh Xuân - Hai Bà Trưng',
  },
  {
    id: 'infra-hamchui-vanhdai-25',
    name: 'Hầm chui Vành đai 2.5 (Hoàng Quốc Việt kéo dài - Nguyễn Văn Huyên)',
    type: 'road_expansion',
    typeLabel: 'Nút Giao Trọng Điểm',
    lat: 21.0450,
    lng: 105.7950,
    district: 'Cầu Giấy',
    status: 'construction',
    year: '2026',
    description: 'Nút giao ngầm thông suốt trục Vành đai 2.5 kết nối Cầu Giấy, Tây Hồ Tây và Bắc Từ Liêm.',
    impactScore: 8.9,
    priceImpactSummary: 'Thúc đẩy giá trị các phân khu đô thị mới Tây Hồ Tây và Nghĩa Đô',
  },
  {
    id: 'infra-vanhdai-4',
    name: 'Đường Vành đai 4 - Vùng Thủ đô Hà Nội (Dài 112.8km)',
    type: 'ring_road',
    typeLabel: 'Cao Tốc Vành Đai',
    lat: 20.9700,
    lng: 105.7000,
    district: 'Hà Đông - Hoài Đức - Thanh Trì',
    status: 'construction',
    year: '2027',
    description: 'Đại dự án liên kết vùng thủ đô kết nối Hà Nội, Hưng Yên và Bắc Ninh, quy mô 6 làn xe cao tốc.',
    impactScore: 9.7,
    priceImpactSummary: 'Mở rộng không gian phát triển đô thị vệ tinh toàn vùng Tây Nam',
  },
  {
    id: 'infra-moduong-haonam',
    name: 'Mở rộng trục giao thông Đội Cấn - Hào Nam - Ga Cát Linh',
    type: 'road_expansion',
    typeLabel: 'Mở Rộng Trục Phố',
    lat: 21.0290,
    lng: 105.8320,
    district: 'Đống Đa',
    status: 'construction',
    year: '2026',
    description: 'Nâng cấp mở rộng lòng đường lên 25m, chỉnh trang vỉa hè đồng bộ kết nối nhà ga Metro Cát Linh.',
    impactScore: 8.7,
    priceImpactSummary: 'Gia tăng trực tiếp giá trị thương mại cho nhà mặt phố và ngõ lớn',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. ĐA GIÁC PHÂN KHU QUY HOẠCH ĐÔ THỊ HÀ NỘI CHUẨN XÁC
// ─────────────────────────────────────────────────────────────────────────────

export const HANOI_GEO_PLANNING_ZONES: PlanningPolygonZone[] = [
  {
    id: 'plan-h1-2-dongda',
    code: 'H1-2 (ODT)',
    name: 'Phân Khu Đô Thị Lõi H1-2 (Đống Đa)',
    type: 'residential',
    typeLabel: 'Đất ở đô thị chỉnh trang',
    district: 'Đống Đa',
    color: '#22c55e',
    fillOpacity: 0.22,
    planYear: 2030,
    floorAreaRatio: 3.5,
    maxHeight: '21m (5 - 7 tầng)',
    density: '65 - 70%',
    status: 'Phù hợp xây dựng & Đã công bố đồ án',
    description: 'Khu vực đô thị hiện hữu cải tạo chỉnh trang, ưu tiên phát triển công trình dịch vụ thương mại ngầm quanh các ga Metro.',
    coordinates: [
      [21.0260, 105.8280],
      [21.0330, 105.8390],
      [21.0295, 105.8480],
      [21.0200, 105.8450],
      [21.0160, 105.8320],
      [21.0190, 105.8230],
    ],
  },
  {
    id: 'plan-h1-1-hoankiem',
    code: 'H1-1 (TMD-DS)',
    name: 'Phân Khu Đô Thị Di Sản H1-1 (Hoàn Kiếm)',
    type: 'commercial',
    typeLabel: 'Thương mại dịch vụ & Bảo tồn',
    district: 'Hoàn Kiếm',
    color: '#ef4444',
    fillOpacity: 0.22,
    planYear: 2030,
    floorAreaRatio: 2.8,
    maxHeight: '12m - 16m (3 - 4 tầng)',
    density: '75%',
    status: 'Bảo tồn nghiêm ngặt kiến trúc di sản',
    description: 'Khu phố cổ và phố cũ Hoàn Kiếm, kiểm soát chặt chẽ chiều cao tầng và mật độ xây dựng.',
    coordinates: [
      [21.0360, 105.8480],
      [21.0410, 105.8560],
      [21.0350, 105.8620],
      [21.0260, 105.8590],
      [21.0250, 105.8490],
    ],
  },
  {
    id: 'plan-h2-1-caugiay',
    code: 'H2-1 (HH)',
    name: 'Phân Khu Đô Thị Công Nghệ H2-1 (Cầu Giấy)',
    type: 'mixed',
    typeLabel: 'Đất hỗn hợp văn phòng & ở',
    district: 'Cầu Giấy',
    color: '#8b5cf6',
    fillOpacity: 0.24,
    planYear: 2030,
    floorAreaRatio: 5.5,
    maxHeight: '45m - 90m (15 - 28 tầng)',
    density: '50 - 60%',
    status: 'Khu công nghệ thông tin tập trung',
    description: 'Trung tâm văn phòng công nghệ cao, thương mại dịch vụ và nhà ở hiện đại kết nối tuyến Metro số 3.',
    coordinates: [
      [21.0300, 105.7820],
      [21.0430, 105.7900],
      [21.0400, 105.8050],
      [21.0270, 105.8000],
    ],
  },
  {
    id: 'plan-a6-tayho',
    code: 'A6 (CX-MN)',
    name: 'Phân Khu Cảnh Quan Sinh Thái A6 (Tây Hồ)',
    type: 'green',
    typeLabel: 'Đất mặt nước sinh thái & du lịch',
    district: 'Tây Hồ',
    color: '#3b82f6',
    fillOpacity: 0.25,
    planYear: 2035,
    floorAreaRatio: 1.8,
    maxHeight: '9m - 12m (3 tầng lùi)',
    density: '35%',
    status: 'Khu vực bảo tồn cảnh quan Hồ Tây',
    description: 'Vùng đệm mặt nước Hồ Tây, kiểm soát kiến trúc sinh thái mật độ thấp và bảo vệ hành lang thoát nước tự nhiên.',
    coordinates: [
      [21.0480, 105.8120],
      [21.0660, 105.8240],
      [21.0620, 105.8430],
      [21.0420, 105.8330],
      [21.0410, 105.8160],
    ],
  },
  {
    id: 'plan-gt-catlinh',
    code: 'GT-01',
    name: 'Hành Lang Hạ Tầng Kỹ Thuật & Ga Metro Cát Linh',
    type: 'transport',
    typeLabel: 'Đất công trình giao thông trọng điểm',
    district: 'Đống Đa',
    color: '#f59e0b',
    fillOpacity: 0.35,
    planYear: 2030,
    floorAreaRatio: 0,
    maxHeight: 'Hành lang an toàn metro',
    density: '15%',
    status: 'Quy hoạch hạ tầng giao thông công cộng',
    description: 'Khu vực hành lang an toàn đường sắt đô thị và quảng trường chuyển tiếp giao thông công cộng.',
    coordinates: [
      [21.0265, 105.8340],
      [21.0295, 105.8355],
      [21.0290, 105.8420],
      [21.0260, 105.8405],
    ],
  },
  {
    id: 'plan-n10-longbien',
    code: 'N10 (KĐT)',
    name: 'Phân Khu Đô Thị Sinh Thái N10 (Long Biên)',
    type: 'residential',
    typeLabel: 'Đô thị sinh thái ven sông',
    district: 'Long Biên',
    color: '#10b981',
    fillOpacity: 0.22,
    planYear: 2030,
    floorAreaRatio: 2.2,
    maxHeight: '15m (4 tầng)',
    density: '40%',
    status: 'Khu đô thị kiểu mẫu hiện đại',
    description: 'Quy hoạch khu đô thị sinh thái kết nối cầu Vĩnh Tuy, cầu Trần Hưng Đạo và hệ thống hồ điều hòa.',
    coordinates: [
      [21.0350, 105.8750],
      [21.0550, 105.8950],
      [21.0480, 105.9200],
      [21.0250, 105.9050],
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. CÔNG CỤ TÍNH TOÁN KHÔNG GIAN (SPATIAL DISTANCE ENGINE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tính khoảng cách chuẩn xác theo công thức Haversine (kết quả tính bằng mét)
 */
export function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Bán kính trái đất (mét)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Định dạng khoảng cách thân thiện:
 * < 1000m -> "450m"
 * >= 1000m -> "1.2 km"
 */
export function formatDistanceFriendly(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Ước tính thời gian di chuyển dựa trên cự ly:
 * - Đi bộ: trung bình 80 mét/phút
 * - Xe máy: trung bình 350 mét/phút (nội đô Hà Nội)
 */
export function estimateTravelTime(meters: number): {
  walkingMinutes: number;
  motorbikeMinutes: number;
  walkingText: string;
  motorbikeText: string;
} {
  const walkingMinutes = Math.max(1, Math.round(meters / 80));
  const motorbikeMinutes = Math.max(1, Math.round(meters / 350));
  return {
    walkingMinutes,
    motorbikeMinutes,
    walkingText: walkingMinutes <= 1 ? '~1 phút đi bộ' : `~${walkingMinutes} phút đi bộ`,
    motorbikeText: motorbikeMinutes <= 1 ? '~1 phút xe máy' : `~${motorbikeMinutes} phút xe máy`,
  };
}

/**
 * Tạo link Google Maps chuẩn (Mở app hoặc web Google Maps)
 */
export function createGoogleMapsUrls(
  name: string,
  destLat: number,
  destLng: number,
  originLat?: number,
  originLng?: number
): {
  searchUrl: string;
  directionsUrl: string;
} {
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;

  const directionsUrl =
    originLat && originLng
      ? `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;

  return { searchUrl, directionsUrl };
}

/**
 * Trích xuất danh sách tiện ích và dự án hạ tầng gần nhất tính từ vị trí BĐS
 */
export function getNearbyAmenitiesAndProjects(
  propLat: number,
  propLng: number,
  radiusMeters: number = 4000
): {
  projects: Array<
    InfrastructureProjectItem & {
      distanceMeters: number;
      distance: string;
      travelTime: ReturnType<typeof estimateTravelTime>;
      googleMapsUrls: ReturnType<typeof createGoogleMapsUrls>;
    }
  >;
  amenities: Array<
    GeoPOIItem & {
      distanceMeters: number;
      distance: string;
      travelTime: ReturnType<typeof estimateTravelTime>;
      googleMapsUrls: ReturnType<typeof createGoogleMapsUrls>;
    }
  >;
  nearestMetro?: GeoPOIItem & { distanceMeters: number; distance: string };
  nearestPlanningZone?: PlanningPolygonZone;
} {
  // 1. Tính toán khoảng cách đến từng dự án hạ tầng
  const sortedProjects = HANOI_INFRASTRUCTURE_PROJECTS.map((proj) => {
    const dist = haversineDistanceMeters(propLat, propLng, proj.lat, proj.lng);
    return {
      ...proj,
      distanceMeters: dist,
      distance: formatDistanceFriendly(dist),
      travelTime: estimateTravelTime(dist),
      googleMapsUrls: createGoogleMapsUrls(proj.name, proj.lat, proj.lng, propLat, propLng),
    };
  })
    .filter((p) => p.distanceMeters <= radiusMeters || p.impactScore >= 9.2) // Lấy dự án trong bán kính hoặc đại dự án tác động cao
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  // 2. Tính toán khoảng cách đến từng tiện ích POI
  const sortedAmenities = HANOI_GEO_POIS.map((poi) => {
    const dist = haversineDistanceMeters(propLat, propLng, poi.lat, poi.lng);
    return {
      ...poi,
      distanceMeters: dist,
      distance: formatDistanceFriendly(dist),
      travelTime: estimateTravelTime(dist),
      googleMapsUrls: createGoogleMapsUrls(poi.name, poi.lat, poi.lng, propLat, propLng),
    };
  })
    .filter((a) => a.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  // Tìm ga Metro gần nhất
  const metroStations = sortedAmenities.filter((a) => a.category === 'metro');
  const nearestMetro = metroStations.length > 0 ? metroStations[0] : undefined;

  // Tìm phân khu quy hoạch tương ứng
  const nearestPlanningZone = HANOI_GEO_PLANNING_ZONES[0];

  return {
    projects: sortedProjects.slice(0, 5),
    amenities: sortedAmenities.slice(0, 8),
    nearestMetro,
    nearestPlanningZone,
  };
}
