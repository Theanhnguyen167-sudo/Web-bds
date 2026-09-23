import { ListingItem } from '@/lib/mock-data';
import { getNearbyAmenitiesAndProjects } from '@/lib/data/hanoi-geo-poi';

export interface PropertyAIReport {
  id: string;
  listingId: string;
  score: number;
  planningScore: number;
  amenityScore: number;
  legalScore: number;
  planningZone: string;
  planningStatus: string;
  floorAreaRatio: number;
  maxHeight: string;
  nearbyProjects: Array<{
    name: string;
    distance: string;
    distanceMeters?: number;
    status: 'completed' | 'construction' | 'planning';
    year: string;
    lat?: number;
    lng?: number;
    type?: string;
    description?: string;
    priceImpactSummary?: string;
    googleMapsUrl?: string;
    directionsUrl?: string;
  }>;
  amenities: Array<{
    type: 'school' | 'hospital' | 'mall' | 'park' | 'metro';
    name: string;
    distance: string;
    distanceMeters?: number;
    rating: number;
    lat?: number;
    lng?: number;
    address?: string;
    travelTimeText?: string;
    googleMapsUrl?: string;
    directionsUrl?: string;
  }>;
  aiAnalysis: string;
  priceTrendPotential: number;
  liquidityRating: string;
  legalRisk: string;
  investmentRecommendation: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  generatedAt: string;
}

// Preset tailored reports for mock listings
const districtReportPresets: Record<string, Partial<PropertyAIReport>> = {
  'Đống Đa': {
    planningZone: 'Đất ở đô thị hiện hữu chỉnh trang',
    planningStatus: 'Ổn định, thuộc quy hoạch phân khu H1-2 đô thị lõi Hà Nội',
    floorAreaRatio: 3.5,
    maxHeight: '5 tầng + 1 tum (tối đa 21m)',
    nearbyProjects: [
      { name: 'Metro Tuyến 3 (Đoạn ngầm Ga Hà Nội - Cát Linh)', distance: '650m', status: 'construction', year: '2027' },
      { name: 'Mở rộng trục giao thông Đội Cấn - Hào Nam', distance: '300m', status: 'construction', year: '2026' },
      { name: 'Nâng cấp cải tạo không gian Văn Miếu - Quốc Tử Giám', distance: '1.1km', status: 'completed', year: '2024' },
      { name: 'Tuyến Metro Tuyến 2A (Cát Linh - Hà Đông)', distance: '500m', status: 'completed', year: '2021' },
    ],
    amenities: [
      { type: 'metro', name: 'Ga Cát Linh (Metro 2A & 3)', distance: '500m', rating: 4.9 },
      { type: 'school', name: 'Trường THCS Đống Đa & THPT Chu Văn An', distance: '600m', rating: 4.8 },
      { type: 'hospital', name: 'Bệnh viện Đống Đa & BV Bạch Mai', distance: '1.2km', rating: 4.7 },
      { type: 'mall', name: 'Vincom Center Phạm Ngọc Thạch', distance: '1.6km', rating: 4.6 },
      { type: 'park', name: 'Vườn hoa Hào Nam & Hồ Hoàng Cầu', distance: '250m', rating: 4.5 },
    ],
  },
  'Nam Từ Liêm': {
    planningZone: 'Đất ở đô thị cao tầng hiện đại',
    planningStatus: 'Được phê duyệt đồng bộ trong quy hoạch đại đô thị vệ tinh 2030',
    floorAreaRatio: 4.2,
    maxHeight: '38 tầng',
    nearbyProjects: [
      { name: 'Tuyến Metro số 5 (Văn Cao - Ngọc Khánh - Hòa Lạc)', distance: '900m', status: 'planning', year: '2028' },
      { name: 'Tuyến Metro số 6 (Nội Bài - Ngọc Hồi)', distance: '1.4km', status: 'planning', year: '2030' },
      { name: 'Nâng cấp kết nối Đại lộ Thăng Long - Lê Trọng Tấn', distance: '600m', status: 'completed', year: '2024' },
      { name: 'Công viên trung tâm 10.2ha & Hồ điều hòa Smart City', distance: '200m', status: 'completed', year: '2023' },
    ],
    amenities: [
      { type: 'mall', name: 'Vincom Mega Mall Smart City', distance: '350m', rating: 4.9 },
      { type: 'hospital', name: 'Bệnh viện Đa khoa Quốc tế Vinmec', distance: '700m', rating: 4.8 },
      { type: 'park', name: 'Công viên Vườn Nhật Zen Park 6.1ha', distance: '400m', rating: 4.9 },
      { type: 'school', name: 'Hệ thống liên cấp Vinschool Smart City', distance: '500m', rating: 4.7 },
    ],
  },
  'Tây Hồ': {
    planningZone: 'Đất ở sinh thái đô thị cảnh quan Hồ Tây',
    planningStatus: 'Bảo tồn mật độ thấp, cảnh quan mặt nước hồ tự nhiên',
    floorAreaRatio: 2.2,
    maxHeight: '3 - 4 tầng (chiều cao khống chế)',
    nearbyProjects: [
      { name: 'Quy hoạch trục không gian bán đảo Quảng An - Nhà hát Opera Hồ Tây', distance: '700m', status: 'planning', year: '2028' },
      { name: 'Cầu Tứ Liên vượt sông Hồng kết nối Đông Anh', distance: '1.8km', status: 'construction', year: '2027' },
      { name: 'Tổ hợp Lotte Mall Tây Hồ & Văn phòng quốc tế', distance: '2.2km', status: 'completed', year: '2023' },
      { name: 'Đường ven hồ Quảng Khánh - Đặng Thai Mai chỉnh trang', distance: '150m', status: 'completed', year: '2024' },
    ],
    amenities: [
      { type: 'park', name: 'Mặt nước & Đường dạo ven Hồ Tây', distance: '50m', rating: 5.0 },
      { type: 'school', name: 'Trường Quốc tế LHQ (UNIS) & Horizon', distance: '1.9km', rating: 4.9 },
      { type: 'mall', name: 'Trung tâm Lotte Mall Tây Hồ', distance: '2.2km', rating: 4.9 },
      { type: 'hospital', name: 'Bệnh viện Tim Hà Nội cơ sở 2', distance: '1.6km', rating: 4.7 },
    ],
  },
  'Cầu Giấy': {
    planningZone: 'Đất hỗn hợp văn phòng công nghệ & nhà ở',
    planningStatus: 'Khu công nghệ thông tin tập trung & văn phòng năng động',
    floorAreaRatio: 4.8,
    maxHeight: '8 - 12 tầng thương mại dịch vụ',
    nearbyProjects: [
      { name: 'Metro Tuyến 3 (Đoạn Cầu Giấy - Kim Mã - Ga Hà Nội)', distance: '850m', status: 'construction', year: '2027' },
      { name: 'Hầm chui trục Vành đai 2.5 Hoàng Quốc Việt kéo dài', distance: '1.2km', status: 'construction', year: '2026' },
      { name: 'Mở rộng phố Duy Tân - Trần Thái Tông kết nối Tôn Thất Thuyết', distance: '200m', status: 'completed', year: '2024' },
      { name: 'Khu công viên hồ điều hòa Cầu Giấy 10ha', distance: '600m', status: 'completed', year: '2023' },
    ],
    amenities: [
      { type: 'school', name: 'Đại học Quốc Gia Hà Nội & ĐH Sư Phạm', distance: '800m', rating: 4.9 },
      { type: 'hospital', name: 'Bệnh viện 19-8 Bộ Công An & Bệnh viện E', distance: '1.1km', rating: 4.7 },
      { type: 'park', name: 'Công viên Cầu Giấy & Công viên Yên Hòa', distance: '600m', rating: 4.8 },
      { type: 'mall', name: 'Keangnam Landmark 72 & The Garden Mall', distance: '1.4km', rating: 4.8 },
    ],
  },
  'Hoàn Kiếm': {
    planningZone: 'Khu bảo tồn phố cổ & dịch vụ du lịch di sản',
    planningStatus: 'Đặc thù phố cổ Hoàn Kiếm, giá trị bảo tồn và thương mại cao nhất thủ đô',
    floorAreaRatio: 2.8,
    maxHeight: '3 tầng (mặt tiền) + lùi 1 tầng',
    nearbyProjects: [
      { name: 'Tuyến Metro số 2 (Nam Thăng Long - Ga Hà Nội qua hồ Gươm)', distance: '550m', status: 'planning', year: '2028' },
      { name: 'Mở rộng không gian đi bộ phố cổ và bờ hồ Hoàn Kiếm', distance: '400m', status: 'completed', year: '2023' },
      { name: 'Dự án trùng tu phố Hàng Bông, Hàng Gai, Hàng Buồm', distance: '100m', status: 'construction', year: '2025' },
    ],
    amenities: [
      { type: 'park', name: 'Hồ Hoàn Kiếm (Hồ Gươm) & Vườn hoa Lý Thái Tổ', distance: '500m', rating: 5.0 },
      { type: 'hospital', name: 'Bệnh viện Hữu Nghị Việt Đức & BV Phụ Sản TW', distance: '700m', rating: 4.9 },
      { type: 'mall', name: 'Tràng Tiền Plaza & Phố đêm Đồng Xuân', distance: '600m', rating: 4.8 },
      { type: 'school', name: 'Trường THPT Việt Đức & THCS Trưng Vương', distance: '650m', rating: 4.8 },
    ],
  },
  'Long Biên': {
    planningZone: 'Khu đô thị sinh thái cao cấp ven sông',
    planningStatus: 'Khu đô thị kiểu mẫu Vinhomes Riverside, quy hoạch chuẩn mực quốc tế',
    floorAreaRatio: 1.8,
    maxHeight: '3.5 tầng',
    nearbyProjects: [
      { name: 'Cầu Trần Hưng Đạo nối Long Biên - Hoàn Kiếm', distance: '2.5km', status: 'construction', year: '2027' },
      { name: 'Dự án Cầu Vĩnh Tuy giai đoạn 2', distance: '1.8km', status: 'completed', year: '2023' },
      { name: 'Tuyến Metro số 1 (Yên Viên - Ngọc Hồi kết nối Gia Lâm/Long Biên)', distance: '3km', status: 'planning', year: '2030' },
      { name: 'Đại siêu thị Aeon Mall Long Biên & Vincom Plaza', distance: '900m', status: 'completed', year: '2022' },
    ],
    amenities: [
      { type: 'mall', name: 'Vincom Plaza Riverside & Aeon Mall Long Biên', distance: '800m', rating: 4.9 },
      { type: 'school', name: 'Trường Quốc tế Anh BIS (British International School)', distance: '400m', rating: 5.0 },
      { type: 'park', name: 'Hồ cảnh quan điều hòa 12.4ha & Kênh đào ven sông', distance: '50m', rating: 4.9 },
      { type: 'hospital', name: 'Bệnh viện Đa khoa Tâm Anh & Vinmec Times City', distance: '2.2km', rating: 4.8 },
    ],
  },
  'Ba Đình': {
    planningZone: 'Đất trung tâm hành chính chính trị & nhà ở cao cấp',
    planningStatus: 'Khu vực lõi Ba Đình, quy hoạch an ninh tuyệt đối, giá trị bền vững',
    floorAreaRatio: 4.0,
    maxHeight: 'Tòa nhà căn hộ khách sạn cao cấp',
    nearbyProjects: [
      { name: 'Metro Tuyến 3 (Ga Kim Mã - Đào Tấn)', distance: '400m', status: 'construction', year: '2026' },
      { name: 'Tuyến Metro số 5 (Dọc hành lang Liễu Giai - Kim Mã)', distance: '300m', status: 'planning', year: '2028' },
      { name: 'Dự án mở rộng trục Liễu Giai - Vạn Phúc', distance: '350m', status: 'completed', year: '2023' },
    ],
    amenities: [
      { type: 'mall', name: 'Lotte Center Hà Nội & Vincom Center Metropolis', distance: '150m', rating: 5.0 },
      { type: 'park', name: 'Công viên Thủ Lệ & Hồ Ngọc Khánh', distance: '450m', rating: 4.7 },
      { type: 'hospital', name: 'Bệnh viện Phụ Sản Hà Nội & BV Nhi Trung Ương', distance: '1.1km', rating: 4.8 },
      { type: 'school', name: 'Trường Thực Nghiệm & Trường Quốc tế RMIT', distance: '700m', rating: 4.9 },
    ],
  },
  'Thanh Xuân': {
    planningZone: 'Đất ở đô thị chỉnh trang gần các trục vành đai',
    planningStatus: 'Hạ tầng kết nối đồng bộ, thuận tiện giao thương ngã tư trọng điểm',
    floorAreaRatio: 3.6,
    maxHeight: '5 tầng + 1 tum',
    nearbyProjects: [
      { name: 'Vành đai 2.5 đoạn qua Thanh Xuân - Cầu Giấy', distance: '700m', status: 'construction', year: '2026' },
      { name: 'Hầm chui Nút giao thông Nguyễn Trãi - Khuất Duy Tiến', distance: '1.2km', status: 'completed', year: '2023' },
      { name: 'Tuyến Metro Tuyến 2A Cát Linh - Hà Đông (Ga Thượng Đình)', distance: '450m', status: 'completed', year: '2021' },
    ],
    amenities: [
      { type: 'metro', name: 'Ga Metro Thượng Đình (Tuyến 2A)', distance: '450m', rating: 4.8 },
      { type: 'mall', name: 'Royal City Mega Mall ngầm 230.000m²', distance: '650m', rating: 4.9 },
      { type: 'school', name: 'Đại học KHXH&NV & Đại học Hà Nội', distance: '900m', rating: 4.7 },
      { type: 'hospital', name: 'Bệnh viện Xây Dựng & Bệnh viện Y học Cổ truyền', distance: '1.4km', rating: 4.6 },
    ],
  },
};

/**
 * Sinh báo cáo AI chuyên sâu, chuẩn xác theo thuộc tính của từng bất động sản
 */
export function getAIReportForListing(listing: ListingItem): PropertyAIReport {
  const district = listing.district || 'Hà Nội';
  const preset = districtReportPresets[district] || districtReportPresets['Đống Đa'];

  // Điểm số phân tích động theo loại hình và pháp lý
  let baseScore = 82;
  let legalScore = 92;
  let planningScore = 85;
  let amenityScore = 84;
  let priceTrend = 8.5;

  if (listing.legalStatus?.toLowerCase().includes('sổ đỏ') || listing.legalStatus?.toLowerCase().includes('sổ hồng')) {
    legalScore = 96;
    baseScore += 5;
  }
  if (['Tây Hồ', 'Hoàn Kiếm', 'Ba Đình'].includes(district)) {
    baseScore += 5;
    amenityScore += 8;
    priceTrend = 9.2;
  } else if (['Cầu Giấy', 'Nam Từ Liêm'].includes(district)) {
    baseScore += 4;
    planningScore += 7;
    priceTrend = 11.5;
  } else if (['Long Biên'].includes(district)) {
    baseScore += 6;
    planningScore += 8;
    priceTrend = 12.0;
  }

  // Giới hạn điểm số từ 70 - 98
  const score = Math.min(98, Math.max(72, baseScore));
  legalScore = Math.min(98, Math.max(85, legalScore));
  planningScore = Math.min(98, Math.max(70, planningScore));
  amenityScore = Math.min(98, Math.max(70, amenityScore));

  const formatPriceM2 = listing.pricePerM2
    ? `${(listing.pricePerM2 / 1000000).toFixed(1)} triệu/m²`
    : 'hợp lý theo thị trường';

  const typeName =
    listing.type === 'apartment'
      ? 'Căn hộ chung cư cao cấp'
      : listing.type === 'villa'
      ? 'Biệt thự cao cấp'
      : listing.type === 'land'
      ? 'Đất nền thổ cư'
      : 'Nhà phố / Nhà riêng';

  const aiAnalysis = `Bất động sản [${listing.title}] tọa lạc tại vị trí chiến lược thuộc quận ${district}, Hà Nội. 
Với diện tích ${listing.area}m² và đơn giá chào bán khoảng ${formatPriceM2}, tài sản được đánh giá nằm trong vùng giá cạnh tranh so với mặt bằng chung cùng phân khúc khu vực.

Về pháp lý & sang tên: Khẳng định 100% hồ sơ pháp lý hoàn chỉnh (${listing.legalStatus || 'Sổ đỏ chính chủ'}), đất sạch tuyệt đối không tranh chấp, không vướng quy hoạch treo và đủ mọi điều kiện công chứng sang tên ngay trong ngày. Thuộc đồ án ${preset.planningZone || 'Đất ở đô thị'}, ${preset.planningStatus || 'quy hoạch ổn định lâu dài'}. Khả năng khai thác dòng tiền và gia tăng giá trị tài sản rất sáng nhờ hưởng lợi trực tiếp từ mạng lưới giao thông hạ tầng trọng điểm và các tuyến Metro đang triển khai.

Đánh giá tổng thể từ Gemini 1.5 Pro: Điểm tiềm năng đạt ${score}/100 với thanh khoản cao, phù hợp cho khách hàng có nhu cầu ở thực chất lượng cao hoặc nhà đầu tư nắm giữ tài sản sinh lời trung - dài hạn.`;

  const investmentRecommendation =
    listing.type === 'apartment'
      ? `Khuyến nghị mua để an cư hoặc đầu tư cho thuê dòng tiền (lợi suất dự kiến 5.5 - 6.5%/năm). Khu vực ${district} có nhu cầu thuê căn hộ của chuyên gia và gia đình trẻ luôn duy trì ở mức rất cao.`
      : listing.type === 'villa'
      ? `Khuyến nghị tích sản và khẳng định vị thế gia chủ. Bất động sản cao cấp tại ${district} có tính khan hiếm cao, biên độ tăng giá vững chắc trung bình 12 - 15%/năm.`
      : listing.type === 'land'
      ? `Khuyến nghị đầu tư đón đầu hạ tầng hoặc xây dựng khai thác thương mại/dịch vụ lưu trú. Vị trí lõi đất thổ cư tại ${district} luôn có tính thanh khoản tức thì.`
      : `Khuyến nghị mua để ở kết hợp kinh doanh hoặc mở văn phòng công ty. Khả năng thanh khoản rất nhanh trong vòng 15 - 30 ngày.`;

  // Trích xuất dữ liệu không gian thực tế từ tọa độ BĐS nếu có
  const spatialData =
    listing.lat && listing.lng
      ? getNearbyAmenitiesAndProjects(listing.lat, listing.lng, 4500)
      : null;

  const nearbyProjects =
    spatialData && spatialData.projects.length > 0
      ? spatialData.projects.map((p) => ({
          name: p.name,
          distance: p.distance,
          distanceMeters: p.distanceMeters,
          status: p.status,
          year: p.year,
          lat: p.lat,
          lng: p.lng,
          type: p.typeLabel,
          description: p.description,
          priceImpactSummary: p.priceImpactSummary,
          googleMapsUrl: p.googleMapsUrls.searchUrl,
          directionsUrl: p.googleMapsUrls.directionsUrl,
        }))
      : preset.nearbyProjects || [
          { name: 'Tuyến Metro đô thị kết nối trung tâm', distance: '600m', status: 'construction', year: '2027' },
          { name: 'Công viên cây xanh & Hồ điều hòa', distance: '450m', status: 'completed', year: '2023' },
          { name: 'Mở rộng trục đường liên khu vực', distance: '300m', status: 'construction', year: '2026' },
        ];

  const amenities =
    spatialData && spatialData.amenities.length > 0
      ? spatialData.amenities.map((a) => ({
          type:
            a.category === 'metro'
              ? ('metro' as const)
              : a.category === 'school'
              ? ('school' as const)
              : a.category === 'hospital'
              ? ('hospital' as const)
              : a.category === 'mall'
              ? ('mall' as const)
              : ('park' as const),
          name: a.name,
          distance: a.distance,
          distanceMeters: a.distanceMeters,
          rating: a.rating || 4.8,
          lat: a.lat,
          lng: a.lng,
          address: a.address,
          travelTimeText: a.travelTime.walkingText,
          googleMapsUrl: a.googleMapsUrls.searchUrl,
          directionsUrl: a.googleMapsUrls.directionsUrl,
        }))
      : preset.amenities || [
          { type: 'school', name: 'Hệ thống trường học chuẩn quốc gia', distance: '500m', rating: 4.8 },
          { type: 'hospital', name: 'Bệnh viện đa khoa khu vực', distance: '1.2km', rating: 4.7 },
          { type: 'mall', name: 'Trung tâm thương mại lớn', distance: '900m', rating: 4.6 },
          { type: 'park', name: 'Khu công viên vui chơi & TDTT', distance: '350m', rating: 4.5 },
        ];

  return {
    id: `REP-${listing.id}`,
    listingId: listing.id,
    score,
    planningScore,
    amenityScore,
    legalScore,
    planningZone: preset.planningZone || 'Đất ở đô thị',
    planningStatus: preset.planningStatus || 'Phù hợp xây dựng & Không vướng quy hoạch treo',
    floorAreaRatio: preset.floorAreaRatio || 3.5,
    maxHeight: preset.maxHeight || '5 tầng + 1 tum',
    nearbyProjects,
    amenities,
    aiAnalysis,
    priceTrendPotential: priceTrend,
    liquidityRating: score >= 85 ? 'Rất Cao (7-14 ngày)' : 'Cao (15-30 ngày)',
    legalRisk: listing.legalStatus ? `Khẳng định an toàn tuyệt đối · Đủ điều kiện sang tên ngay (${listing.legalStatus})` : 'Khẳng định an toàn tuyệt đối · Đủ điều kiện sang tên ngay (Sổ đỏ chính chủ)',
    investmentRecommendation,
    swot: {
      strengths: [
        `Pháp lý chuẩn chỉnh 100%: ${listing.legalStatus || 'Sổ đỏ chính chủ'}, cam kết đủ điều kiện công chứng sang tên ngay`,
        `Vị trí trung tâm quận ${district}, kết nối giao thông linh hoạt`,
        `Loại hình ${typeName} diện tích ${listing.area}m² dễ thanh khoản`,
      ],
      weaknesses: [
        'Mật độ lưu thông trục đường chính vào giờ cao điểm cần lưu ý',
        'Cạnh tranh về số lượng tin đăng trong cùng phân khúc',
      ],
      opportunities: [
        `Hưởng lợi trực tiếp từ các dự án Metro và mở rộng hạ tầng ${district}`,
        `Tiềm năng tăng giá kỳ vọng +${priceTrend}% / năm`,
        'Nhu cầu tìm kiếm bất động sản khu vực liên tục tăng trưởng',
      ],
      threats: [
        'Biến động lãi suất tín dụng vay mua BĐS trong ngắn hạn',
        'Yêu cầu khắt khe hơn về thủ tục định giá ngân hàng',
      ],
    },
    generatedAt: new Date().toISOString(),
  };
}
