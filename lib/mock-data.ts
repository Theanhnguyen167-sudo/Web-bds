export interface ListingItem {
  id: string;
  title: string;
  price: number;
  pricePerM2: number;
  area: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  district: string;
  ward: string;
  lat: number;
  lng: number;
  type: "house" | "apartment" | "land" | "villa";
  images: string[];
  status: "active" | "pending" | "sold";
  isFeatured: boolean;
  views: number;
  createdAt: string;
  planningZone: string;
  planningYear: number;
  legalStatus: string;
  direction?: string;
  description?: string;
}

export const mockListings: ListingItem[] = [
  {
    id: "1",
    title: "Nhà phố Đống Đa 5 tầng, mặt tiền 6m, gần Văn Miếu",
    price: 8500000000,
    pricePerM2: 85000000,
    area: 100,
    floors: 5,
    bedrooms: 4,
    bathrooms: 3,
    address: "Phố Hào Nam, Đống Đa, Hà Nội",
    district: "Đống Đa",
    ward: "Phường Ô Chợ Dừa",
    lat: 21.0285,
    lng: 105.8412,
    type: "house",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: true,
    views: 234,
    createdAt: "2025-08-18",
    planningZone: "Đất ở đô thị",
    planningYear: 2030,
    legalStatus: "Sổ đỏ chính chủ",
    direction: "Đông Nam",
    description: "Vị trí đắc địa, ô tô vào nhà, trung tâm quận Đống Đa gần ga Cát Linh - Hà Đông và Văn Miếu Quốc Tử Giám. Nhà xây khung cột bê tông chắc chắn, thiết kế hiện đại full nội thất cao cấp.",
  },
  {
    id: "2",
    title: "Căn hộ cao cấp Masteri West Heights Tây Mỗ, 2PN view hồ công viên",
    price: 3600000000,
    pricePerM2: 56250000,
    area: 64,
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    address: "Đại đô thị Smart City, Nam Từ Liêm, Hà Nội",
    district: "Nam Từ Liêm",
    ward: "Phường Tây Mỗ",
    lat: 21.0028,
    lng: 105.7482,
    type: "apartment",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: true,
    views: 512,
    createdAt: "2025-08-19",
    planningZone: "Đất ở đô thị cao tầng",
    planningYear: 2030,
    legalStatus: "Sổ hồng lâu dài",
    direction: "Đông Bắc",
    description: "Căn hộ tầng trung view trọn công viên trung tâm 10.2ha. Thiết kế thông minh tối ưu ánh sáng tự nhiên. Tiện ích chuẩn 5 sao gồm bể bơi tầng thượng, lounge cao cấp.",
  },
  {
    id: "3",
    title: "Biệt thự song lập Tây Hồ view Hồ Tây thoáng mát, 180m2 sân vườn",
    price: 38000000000,
    pricePerM2: 211111111,
    area: 180,
    floors: 4,
    bedrooms: 5,
    bathrooms: 5,
    address: "Đường Quảng Khánh, Tây Hồ, Hà Nội",
    district: "Tây Hồ",
    ward: "Phường Quảng An",
    lat: 21.0625,
    lng: 105.8285,
    type: "villa",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: true,
    views: 840,
    createdAt: "2025-08-20",
    planningZone: "Đất ở sinh thái đô thị",
    planningYear: 2030,
    legalStatus: "Sổ đỏ chính chủ",
    direction: "Nam",
    description: "Khu vực biệt lập dành cho giới tinh hoa, cách mặt nước Hồ Tây 50m. Không khí trong lành, dân trí cao, an ninh 24/7, kiến trúc Tân cổ điển sang trọng.",
  },
  {
    id: "4",
    title: "Nhà mặt phố Cầu Giấy kinh doanh sầm uất, 8 tầng thang máy",
    price: 24500000000,
    pricePerM2: 272222222,
    area: 90,
    floors: 8,
    bedrooms: 6,
    bathrooms: 8,
    address: "Phố Duy Tân, Cầu Giấy, Hà Nội",
    district: "Cầu Giấy",
    ward: "Phường Dịch Vọng Hậu",
    lat: 21.0315,
    lng: 105.7825,
    type: "house",
    images: [
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: false,
    views: 388,
    createdAt: "2025-08-21",
    planningZone: "Đất hỗn hợp thương mại & ở",
    planningYear: 2030,
    legalStatus: "Sổ đỏ lâu dài",
    direction: "Tây Bắc",
    description: "Tòa nhà văn phòng mặt phố công nghệ Duy Tân. Doanh thu cho thuê 110 triệu/tháng. PCCC đạt chuẩn nghiệm thu mới nhất.",
  },
  {
    id: "5",
    title: "Đất thổ cư Hoàn Kiếm phố cổ, mặt tiền 5m kinh doanh khách sạn/homestay",
    price: 16800000000,
    pricePerM2: 240000000,
    area: 70,
    floors: 1,
    bedrooms: 0,
    bathrooms: 0,
    address: "Phố Hàng Bông, Hoàn Kiếm, Hà Nội",
    district: "Hoàn Kiếm",
    ward: "Phường Hàng Gai",
    lat: 21.0318,
    lng: 105.8495,
    type: "land",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: true,
    views: 620,
    createdAt: "2025-08-21",
    planningZone: "Khu bảo tồn phố cổ & dịch vụ du lịch",
    planningYear: 2030,
    legalStatus: "Sổ đỏ chính chủ",
    direction: "Đông",
    description: "Mảnh đất hiếm hoi còn lại tại lõi phố cổ Hoàn Kiếm. Phù hợp xây dựng Boutique Hotel hoặc chuỗi cafe/nhà hàng đón khách quốc tế.",
  },
  {
    id: "6",
    title: "Biệt thự ven sông Vinhomes Riverside Long Biên, 300m2 đơn lập VIP",
    price: 48000000000,
    pricePerM2: 160000000,
    area: 300,
    floors: 3,
    bedrooms: 5,
    bathrooms: 6,
    address: "Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội",
    district: "Long Biên",
    ward: "Phường Phúc Đồng",
    lat: 21.0425,
    lng: 105.9085,
    type: "villa",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: true,
    views: 930,
    createdAt: "2025-08-22",
    planningZone: "Khu đô thị sinh thái cao cấp",
    planningYear: 2030,
    legalStatus: "Sổ đỏ chính chủ",
    direction: "Đông Nam",
    description: "View sông sau nhà câu cá thư giãn, sân vườn cây xanh bao quanh. Đầy đủ nội thất nhập khẩu Châu Âu, trung tâm thương mại Vincom Plaza ngay gần.",
  },
  {
    id: "7",
    title: "Căn hộ Vinhomes Metropolis Liễu Giai Ba Đình, 3PN full kính tràn viền",
    price: 9200000000,
    pricePerM2: 83636363,
    area: 110,
    floors: 1,
    bedrooms: 3,
    bathrooms: 2,
    address: "29 Liễu Giai, Ba Đình, Hà Nội",
    district: "Ba Đình",
    ward: "Phường Ngọc Khánh",
    lat: 21.0336,
    lng: 105.8143,
    type: "apartment",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: false,
    views: 410,
    createdAt: "2025-08-22",
    planningZone: "Đất trung tâm hành chính & ở",
    planningYear: 2030,
    legalStatus: "Sổ hồng vĩnh viễn",
    direction: "Bắc",
    description: "Vị trí vàng trung tâm quận Ba Đình, view panorama toàn cảnh Hồ Tây và Lotte Center. Hệ thống trường quốc tế, rạp chiếu phim, đại sứ quán lân cận.",
  },
  {
    id: "8",
    title: "Nhà liền kề Thanh Xuân gần ngã tư sở, ngõ ô tô tránh đỗ ngày đêm",
    price: 7200000000,
    pricePerM2: 96000000,
    area: 75,
    floors: 4,
    bedrooms: 4,
    bathrooms: 4,
    address: "Phố Nguyễn Trãi, Thanh Xuân, Hà Nội",
    district: "Thanh Xuân",
    ward: "Phường Thượng Đình",
    lat: 20.9995,
    lng: 105.8152,
    type: "house",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: false,
    views: 290,
    createdAt: "2025-08-23",
    planningZone: "Đất ở hiện hữu chỉnh trang",
    planningYear: 2030,
    legalStatus: "Sổ đỏ phân lô",
    direction: "Tây Nam",
    description: "Khu phân lô cán bộ, an ninh tuyệt đối, gần ga Metro Thượng Đình và Royal City. Nhà tự xây tâm huyết, có giếng trời thoáng sáng.",
  },
  {
    id: "9",
    title: "Đất đấu giá Hai Bà Trưng sát công viên Thống Nhất, sổ đỏ phân lô",
    price: 11500000000,
    pricePerM2: 143750000,
    area: 80,
    floors: 1,
    bedrooms: 0,
    bathrooms: 0,
    address: "Phố Lê Duẩn, Hai Bà Trưng, Hà Nội",
    district: "Hai Bà Trưng",
    ward: "Phường Nguyễn Du",
    lat: 21.0175,
    lng: 105.8425,
    type: "land",
    images: [
      "https://images.unsplash.com/photo-1524813686514-a57563d77d61?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    ],
    status: "active",
    isFeatured: true,
    views: 520,
    createdAt: "2025-08-23",
    planningZone: "Đất dịch vụ đô thị",
    planningYear: 2030,
    legalStatus: "Sổ đỏ cất két",
    direction: "Đông",
    description: "Đất vuông vắn không lỗi phong thủy, trước mặt là hồ Bảy Mẫu công viên Thống Nhất. Được cấp phép xây dựng 6 tầng 1 tum.",
  },
];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  package: string;
  packageExpiry: string;
  aiReportsUsed: number;
  aiReportsLimit: number;
  listingsCount: number;
  activeListings: number;
  avatar: string;
}

export const mockUser: UserProfile = {
  id: "u1",
  name: "Nguyễn Văn An",
  email: "an@example.com",
  phone: "0988 123 456",
  role: "agent",
  package: "pro",
  packageExpiry: "2025-09-15",
  aiReportsUsed: 8,
  aiReportsLimit: 30,
  listingsCount: 12,
  activeListings: 8,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
};

export const mockAIReport = {
  id: "r1",
  listingId: "1",
  score: 82,
  planningScore: 90,
  amenityScore: 85,
  legalScore: 75,
  planningZone: "Đất ở đô thị",
  planningStatus: "Phù hợp xây dựng & Không quy hoạch treo",
  floorAreaRatio: 3.5,
  maxHeight: "21m (tối đa 6 tầng)",
  nearbyProjects: [
    { name: "Metro Line 2 (Nam Thăng Long - Trần Hưng Đạo)", distance: "1.2km", status: "construction", year: "2027" },
    { name: "Bệnh viện Ung Bướu mới", distance: "800m", status: "planning", year: "2026" },
    { name: "Lotte Mall Tây Hồ & Văn phòng", distance: "2.5km", status: "completed", year: "2023" },
    { name: "Mở rộng trục giao thông Đội Cấn - Hào Nam", distance: "300m", status: "construction", year: "2026" },
  ],
  amenities: [
    { type: "school", name: "Trường THCS Đống Đa & THPT Chu Văn An", distance: "500m", rating: 4.8 },
    { type: "hospital", name: "Bệnh viện Việt Đức & BV Bạch Mai", distance: "1.2km", rating: 4.7 },
    { type: "mall", name: "Vincom Center Phạm Ngọc Thạch", distance: "1.8km", rating: 4.6 },
    { type: "park", name: "Vườn hoa Hào Nam & Hồ Hoàng Cầu", distance: "200m", rating: 4.5 },
  ],
  aiAnalysis: "Bất động sản tọa lạc tại vị trí đắc địa thuộc quận Đống Đa với hệ sinh thái tiện ích hoàn chỉnh và hạ tầng giao thông kết nối metro hiện đại. Mức giá 85 triệu/m² nằm trong ngưỡng định giá hợp lý với tiềm năng tăng trưởng 14-18% trong vòng 24 tháng tới.",
  priceTrendPotential: 8.5,
  liquidityRating: "Rất Cao",
  legalRisk: "low",
  investmentRecommendation: "Nên mua để đầu tư dài hạn kết hợp khai thác dòng tiền cho thuê căn hộ dịch vụ cao cấp.",
};

export const mockPackages = [
  {
    id: "free",
    name: "Free",
    price: 0,
    listings: 3,
    duration: 7,
    aiReports: 0,
    features: ["Đăng 3 tin cơ bản", "Thời hạn tin 7 ngày", "Xem bản đồ quy hoạch", "Hỗ trợ cộng đồng"],
    isPopular: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: 299000,
    listings: 20,
    duration: 30,
    aiReports: 5,
    features: ["Đăng 20 tin BĐS", "Thời hạn tin 30 ngày", "2 tin nổi bật/tháng", "5 Báo cáo AI định giá", "Xuất file PDF"],
    isPopular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 599000,
    listings: 50,
    duration: 60,
    aiReports: 30,
    features: ["Đăng 50 tin BĐS", "Thời hạn tin 60 ngày", "10 tin nổi bật/tháng", "30 Báo cáo AI chuyên sâu", "Phân tích quy hoạch 2030", "Hỗ trợ ưu tiên 24/7"],
    isPopular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 1299000,
    listings: -1, // Unlimited
    duration: 90,
    aiReports: -1, // Unlimited
    features: ["Không giới hạn tin đăng", "Thời hạn tin 90 ngày", "Tin nổi bật không giới hạn", "Không giới hạn Báo cáo AI", "Quản trị đội ngũ môi giới", "Dedicated Account Manager"],
    isPopular: false,
  },
];
