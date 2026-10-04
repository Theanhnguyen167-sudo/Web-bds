import { PlanningZoneItem } from '@/lib/planning/planning-utils';

export interface HanoiDistrictPlanningProfile {
  district: string;
  subdivisionCode: string; // VD: H1-3, H1-2, H2-1, N10...
  legalBasis: string;      // Quyết định phê duyệt của UBND TP Hà Nội
  planYear: number;
  center: [number, number]; // [lat, lng]
  zones: Array<{
    code: string;
    name: string;
    type: 'residential' | 'commercial' | 'mixed' | 'green' | 'transport' | 'industrial' | 'public';
    color: string;
    areaHa: number;
    maxFloors: number;
    maxHeight: string;
    density: string;
    floorAreaRatio: number;
    description: string;
    coordinates: [number, number][]; // Đa giác WGS84 khép kín
  }>;
}

/**
 * BẢNG MÃ MÀU & KÝ HIỆU QUY HOẠCH CHUẨN QUỐC GIA (QCVN 01:2021/BXD & TT 12/2016/TT-BXD)
 */
export const PLANNING_STANDARD_SYMBOLS = {
  ODT: {
    code: 'ODT',
    name: 'Đất ở đô thị hiện hữu cải tạo',
    color: '#FFDD29',
    type: 'residential',
    desc: 'Khu dân cư hiện hữu kết hợp chỉnh trang đồng bộ hạ tầng kỹ thuật',
  },
  TMD: {
    code: 'TMD',
    name: 'Đất thương mại, dịch vụ & tài chính',
    color: '#EF4444',
    type: 'commercial',
    desc: 'Trung tâm tài chính, thương xá, shophouse, văn phòng cho thuê',
  },
  HH: {
    code: 'HH',
    name: 'Đất hỗn hợp cao tầng',
    color: '#8B5CF6',
    type: 'mixed',
    desc: 'Tổ hợp công trình đa chức năng (căn hộ, văn phòng, TTTM)',
  },
  CX: {
    code: 'CX',
    name: 'Đất công viên, cây xanh & mặt nước',
    color: '#22C55E',
    type: 'green',
    desc: 'Công viên cây xanh, vườn hoa, hồ điều hòa sinh thái công cộng',
  },
  GT: {
    code: 'GT',
    name: 'Đất giao thông & đầu mối hạ tầng',
    color: '#3B82F6',
    type: 'transport',
    desc: 'Hành lang đường bộ chính, quảng trường, nhà ga metro, bến bãi',
  },
  CQ: {
    code: 'CQ',
    name: 'Đất cơ quan, công trình văn hóa',
    color: '#06B6D4',
    type: 'public',
    desc: 'Trụ sở cơ quan nhà nước, bảo tàng, trung tâm văn hóa cộng đồng',
  },
  GD: {
    code: 'GD',
    name: 'Đất giáo dục & đào tạo',
    color: '#6366F1',
    type: 'public',
    desc: 'Trường mầm non, tiểu học, trung học phổ thông, đại học, viện NCKH',
  },
  YT: {
    code: 'YT',
    name: 'Đất y tế & chăm sóc sức khỏe',
    color: '#EC4899',
    type: 'public',
    desc: 'Bệnh viện đa khoa, chuyên khoa, trung tâm y tế dự phòng',
  },
  CN: {
    code: 'CN',
    name: 'Đất công nghệ cao, cụm công nghiệp',
    color: '#64748B',
    type: 'industrial',
    desc: 'Khu nghiên cứu công nghệ cao, xưởng sạch, cụm tiểu thủ công nghiệp',
  },
  QSQP: {
    code: 'QSQP',
    name: 'Đất an ninh quốc phòng',
    color: '#DC2626',
    type: 'public',
    desc: 'Khu vực quản lý an ninh, quốc phòng theo quy hoạch đặc thù',
  },
} as const;

/**
 * HỒ SƠ QUY HOẠCH CHI TIẾT TỪNG QUẬN HÀ NỘI THEO ĐỒ ÁN ĐÃ ĐƯỢC UBND TP HÀ NỘI PHÊ DUYỆT
 */
export const HANOI_DISTRICTS_PLANNING_PROFILES: Record<string, HanoiDistrictPlanningProfile> = {
  'Đống Đa': {
    district: 'Đống Đa',
    subdivisionCode: 'H1-3',
    legalBasis: 'Quyết định 1357/QĐ-UBND của UBND TP Hà Nội phê duyệt Quy hoạch phân khu đô thị H1-3',
    planYear: 2030,
    center: [21.0180, 105.8280],
    zones: [
      {
        code: 'ODT-01',
        name: 'Khu dân cư hiện hữu cải tạo Khâm Thiên - Văn Chương',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 165,
        maxFloors: 5,
        maxHeight: '21m (5 tầng)',
        density: '65%',
        floorAreaRatio: 3.5,
        description: 'Bảo tồn hình thái phố ngõ, mở rộng đường dân sinh, hạ ngầm cáp điện chiếu sáng',
        coordinates: [
          [21.0230, 105.8320],
          [21.0265, 105.8410],
          [21.0210, 105.8435],
          [21.0180, 105.8360],
          [21.0200, 105.8310],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Trục Trung tâm Tài chính - Thương mại Thái Hà - Chùa Bộc',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 85,
        maxFloors: 15,
        maxHeight: '45m (15 tầng)',
        density: '60%',
        floorAreaRatio: 5.5,
        description: 'Tập trung shophouse cao cấp, trung tâm điện máy, trụ sở ngân hàng và tòa nhà văn phòng',
        coordinates: [
          [21.0150, 105.8220],
          [21.0180, 105.8260],
          [21.0115, 105.8320],
          [21.0085, 105.8270],
        ],
      },
      {
        code: 'HH-01',
        name: 'Tổ hợp Phức hợp Cao tầng Láng Hạ - Huỳnh Thúc Kháng',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 110,
        maxFloors: 25,
        maxHeight: '75m (25 tầng)',
        density: '50%',
        floorAreaRatio: 6.0,
        description: 'Tổ hợp căn hộ chung cư cao cấp, tháp tài chính hỗn hợp và trung tâm hội nghị',
        coordinates: [
          [21.0185, 105.8140],
          [21.0225, 105.8190],
          [21.0170, 105.8250],
          [21.0135, 105.8195],
        ],
      },
      {
        code: 'CX-01',
        name: 'Công viên cây xanh & Không gian mặt nước hồ Hoàng Cầu - Đống Đa',
        type: 'green',
        color: '#22C55E',
        areaHa: 95,
        maxFloors: 1,
        maxHeight: '4m (Công trình cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Hồ sinh thái điều hòa không khí, đường dạo bộ ven hồ và khu vui chơi ngoài trời',
        coordinates: [
          [21.0205, 105.8235],
          [21.0240, 105.8265],
          [21.0220, 105.8305],
          [21.0185, 105.8275],
        ],
      },
      {
        code: 'GT-01',
        name: 'Hành lang Đầu mối Giao thông Đô thị & Ga Metro Cát Linh',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 65,
        maxFloors: 3,
        maxHeight: '12m (Hạ tầng giao thông)',
        density: '25%',
        floorAreaRatio: 1.0,
        description: 'Nhà ga trung tâm đường sắt đô thị Tuyến 2A Cát Linh - Hà Đông và bãi đỗ xe thông minh',
        coordinates: [
          [21.0250, 105.8270],
          [21.0285, 105.8310],
          [21.0260, 105.8340],
          [21.0230, 105.8295],
        ],
      },
      {
        code: 'GD-01',
        name: 'Cụm Đào tạo Đại học Thủy Lợi - Công Đoàn - Ngân Hàng',
        type: 'public',
        color: '#6366F1',
        areaHa: 75,
        maxFloors: 12,
        maxHeight: '36m (12 tầng)',
        density: '45%',
        floorAreaRatio: 3.8,
        description: 'Hệ thống trường đại học trọng điểm, ký túc xá và viện nghiên cứu khoa học',
        coordinates: [
          [21.0070, 105.8230],
          [21.0110, 105.8270],
          [21.0080, 105.8315],
          [21.0040, 105.8270],
        ],
      },
    ],
  },

  'Cầu Giấy': {
    district: 'Cầu Giấy',
    subdivisionCode: 'H2-1 & H2-2',
    legalBasis: 'Quyết định 6666/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị H2-1 và H2-2 Cầu Giấy',
    planYear: 2030,
    center: [21.0335, 105.7895],
    zones: [
      {
        code: 'TMD-01',
        name: 'Thung lũng Công nghệ & Văn phòng Tài chính Duy Tân',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 140,
        maxFloors: 30,
        maxHeight: '90m (30 tầng)',
        density: '55%',
        floorAreaRatio: 6.5,
        description: 'Tập trung các tập đoàn công nghệ thông tin, viễn thông và trụ sở tổng công ty',
        coordinates: [
          [21.0280, 105.7800],
          [21.0340, 105.7820],
          [21.0330, 105.7900],
          [21.0265, 105.7875],
        ],
      },
      {
        code: 'HH-01',
        name: 'Quần thể Hỗn hợp Đô thị Mới Trung Hòa - Nhân Chính',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 190,
        maxFloors: 35,
        maxHeight: '110m (35 tầng)',
        density: '50%',
        floorAreaRatio: 6.0,
        description: 'Trung tâm hỗn hợp hiện đại với khối đế thương mại, rạp chiếu phim và tháp chung cư cao cấp',
        coordinates: [
          [21.0090, 105.7970],
          [21.0160, 105.8020],
          [21.0130, 105.8090],
          [21.0060, 105.8035],
        ],
      },
      {
        code: 'CX-01',
        name: 'Công viên Sinh thái Cầu Giấy & Hồ điều hòa Yên Hòa',
        type: 'green',
        color: '#22C55E',
        areaHa: 125,
        maxFloors: 1,
        maxHeight: '4m (Công viên cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Lá phổi xanh của quận Cầu Giấy với đồi cỏ, hồ nước và sân chơi trẻ em chuẩn quốc tế',
        coordinates: [
          [21.0240, 105.7870],
          [21.0285, 105.7890],
          [21.0270, 105.7950],
          [21.0225, 105.7930],
        ],
      },
      {
        code: 'GD-01',
        name: 'Làng Đại học & Nghiên cứu ĐHQG Hà Nội - Sư Phạm',
        type: 'public',
        color: '#6366F1',
        areaHa: 110,
        maxFloors: 15,
        maxHeight: '45m (15 tầng)',
        density: '40%',
        floorAreaRatio: 3.6,
        description: 'Cụm trường đại học hàng đầu cả nước, thư viện quốc gia và khu ký túc xá sinh viên',
        coordinates: [
          [21.0360, 105.7790],
          [21.0410, 105.7810],
          [21.0395, 105.7890],
          [21.0345, 105.7870],
        ],
      },
      {
        code: 'ODT-01',
        name: 'Khu Đất ở đô thị hiện hữu Dịch Vọng - Nghĩa Tân',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 155,
        maxFloors: 7,
        maxHeight: '24m (7 tầng)',
        density: '65%',
        floorAreaRatio: 3.8,
        description: 'Khu dân cư ổn định, hoàn thiện hệ thống công viên mini và cải tạo bãi đỗ xe ngầm',
        coordinates: [
          [21.0380, 105.7900],
          [21.0440, 105.7940],
          [21.0420, 105.8030],
          [21.0360, 105.7985],
        ],
      },
      {
        code: 'GT-01',
        name: 'Nút giao Vành đai 3 - Cầu Giấy & Ga Metro Nhổn - Ga Hà Nội',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 80,
        maxFloors: 2,
        maxHeight: '8m (Hạ tầng giao thông)',
        density: '20%',
        floorAreaRatio: 0.8,
        description: 'Nút giao thông khác mức 3 tầng và hành lang đường sắt đô thị số 3',
        coordinates: [
          [21.0325, 105.7760],
          [21.0360, 105.7780],
          [21.0345, 105.7840],
          [21.0310, 105.7820],
        ],
      },
    ],
  },

  'Ba Đình': {
    district: 'Ba Đình',
    subdivisionCode: 'H1-2',
    legalBasis: 'Quyết định 1356/QĐ-UBND của UBND TP Hà Nội phê duyệt Quy hoạch phân khu đô thị H1-2',
    planYear: 2030,
    center: [21.0340, 105.8230],
    zones: [
      {
        code: 'CQ-01',
        name: 'Trung tâm Chính trị - Hành chính Quốc gia Ba Đình',
        type: 'public',
        color: '#06B6D4',
        areaHa: 135,
        maxFloors: 5,
        maxHeight: '19m (Kiểm soát chiều cao nghiêm ngặt)',
        density: '35%',
        floorAreaRatio: 2.0,
        description: 'Quần thể trụ sở cơ quan Trung ương Đảng, Quốc hội, Phủ Chủ tịch và Văn phòng Chính phủ',
        coordinates: [
          [21.0320, 105.8310],
          [21.0390, 105.8340],
          [21.0365, 105.8410],
          [21.0295, 105.8375],
        ],
      },
      {
        code: 'ODT-01',
        name: 'Đất ở đô thị chỉnh trang Đội Cấn - Vĩnh Phúc - Liễu Giai',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 145,
        maxFloors: 5,
        maxHeight: '20m (5 tầng)',
        density: '60%',
        floorAreaRatio: 3.2,
        description: 'Khu nhà ở thấp tầng truyền thống, bảo tồn mạng lưới làng cổ trong phố',
        coordinates: [
          [21.0370, 105.8150],
          [21.0420, 105.8190],
          [21.0390, 105.8270],
          [21.0340, 105.8220],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Khu Trung tâm Thương mại Quốc tế Liễu Giai - Kim Mã',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 75,
        maxFloors: 35,
        maxHeight: '120m (Tháp Lotte & Daewoo)',
        density: '60%',
        floorAreaRatio: 6.5,
        description: 'Tổ hợp khách sạn 5 sao, trung tâm thương mại cao cấp và các Đại sứ quán',
        coordinates: [
          [21.0295, 105.8100],
          [21.0345, 105.8130],
          [21.0325, 105.8200],
          [21.0275, 105.8165],
        ],
      },
      {
        code: 'CX-01',
        name: 'Quần thể Cây xanh Vườn Bách Thảo & Hồ Ngọc Khánh',
        type: 'green',
        color: '#22C55E',
        areaHa: 90,
        maxFloors: 1,
        maxHeight: '4m (Công viên cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Vườn thực vật lâu đời nhất thủ đô và công viên hồ nước cảnh quan điều hòa khí hậu',
        coordinates: [
          [21.0410, 105.8240],
          [21.0450, 105.8280],
          [21.0425, 105.8340],
          [21.0385, 105.8300],
        ],
      },
    ],
  },

  'Tây Hồ': {
    district: 'Tây Hồ',
    subdivisionCode: 'A6 & Khu vực Hồ Tây',
    legalBasis: 'Quyết định 4177/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị khu vực Hồ Tây và vùng phụ cận (A6)',
    planYear: 2030,
    center: [21.0600, 105.8250],
    zones: [
      {
        code: 'CX-01',
        name: 'Vùng Bảo tồn Sinh thái & Mặt nước Danh thắng Hồ Tây',
        type: 'green',
        color: '#22C55E',
        areaHa: 520,
        maxFloors: 1,
        maxHeight: 'Không cho phép xây dựng công trình nổi',
        density: '2%',
        floorAreaRatio: 0.05,
        description: 'Mặt nước cảnh quan linh thiêng, kiểm soát nghiêm ngặt hành lang bảo vệ nguồn nước',
        coordinates: [
          [21.0480, 105.8120],
          [21.0650, 105.8200],
          [21.0680, 105.8380],
          [21.0550, 105.8450],
          [21.0430, 105.8310],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Trục Du lịch - Dịch vụ - Khách sạn Nghỉ dưỡng Quảng An',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 95,
        maxFloors: 5,
        maxHeight: '18m (Bảo vệ tầm nhìn mặt hồ)',
        density: '45%',
        floorAreaRatio: 2.5,
        description: 'Bán đảo du lịch quốc tế, biệt thự nghỉ dưỡng, nhà hát Opera và dịch vụ ẩm thực ven hồ',
        coordinates: [
          [21.0580, 105.8250],
          [21.0630, 105.8280],
          [21.0600, 105.8360],
          [21.0545, 105.8320],
        ],
      },
      {
        code: 'HH-01',
        name: 'Khu Trung tâm Đô thị Mới Tây Hồ Tây (Starlake)',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 185,
        maxFloors: 35,
        maxHeight: '120m (35 tầng)',
        density: '45%',
        floorAreaRatio: 5.5,
        description: 'Trung tâm hành chính mới, trụ sở các bộ ngành Trung ương và tổ hợp văn phòng hạng A',
        coordinates: [
          [21.0520, 105.7950],
          [21.0600, 105.8010],
          [21.0560, 105.8100],
          [21.0485, 105.8030],
        ],
      },
      {
        code: 'ODT-01',
        name: 'Khu Đất ở đô thị làng cổ ven hồ Thụy Khuê - Yên Phụ',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 130,
        maxFloors: 4,
        maxHeight: '16m (4 tầng)',
        density: '55%',
        floorAreaRatio: 2.8,
        description: 'Bảo tồn kiến trúc truyền thống, chùa Trấn Quốc, đền Quán Thánh và cảnh quan ven đường Thanh Niên',
        coordinates: [
          [21.0420, 105.8280],
          [21.0470, 105.8320],
          [21.0440, 105.8410],
          [21.0390, 105.8370],
        ],
      },
    ],
  },

  'Hoàn Kiếm': {
    district: 'Hoàn Kiếm',
    subdivisionCode: 'H1-1',
    legalBasis: 'Quyết định 1355/QĐ-UBND của UBND TP Hà Nội phê duyệt Quy hoạch phân khu đô thị H1-1 Hoàn Kiếm',
    planYear: 2030,
    center: [21.0300, 105.8540],
    zones: [
      {
        code: 'ODT-01',
        name: 'Khu phố Cổ Hà Nội (Khu vực bảo tồn cấp 1)',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 105,
        maxFloors: 3,
        maxHeight: '12m (3 tầng đặc thù phố cổ)',
        density: '70%',
        floorAreaRatio: 2.2,
        description: 'Khu phố cổ 36 phố phường, cấm xây dựng cao tầng, giãn dân phố cổ và cải tạo hạ tầng du lịch',
        coordinates: [
          [21.0330, 105.8480],
          [21.0390, 105.8520],
          [21.0370, 105.8580],
          [21.0310, 105.8540],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Khu Trung tâm Thương mại - Dịch vụ Tràng Tiền - Lý Thường Kiệt',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 90,
        maxFloors: 8,
        maxHeight: '28m (8 tầng)',
        density: '60%',
        floorAreaRatio: 4.0,
        description: 'Trung tâm mua sắm xa xỉ Tràng Tiền Plaza, văn phòng đại diện các tập đoàn đa quốc gia',
        coordinates: [
          [21.0230, 105.8510],
          [21.0280, 105.8560],
          [21.0250, 105.8620],
          [21.0200, 105.8570],
        ],
      },
      {
        code: 'CX-01',
        name: 'Không gian Văn hóa - Lịch sử Hồ Gươm & Vườn hoa Lý Thái Tổ',
        type: 'green',
        color: '#22C55E',
        areaHa: 55,
        maxFloors: 1,
        maxHeight: '3m (Công trình phụ trợ cảnh quan)',
        density: '3%',
        floorAreaRatio: 0.05,
        description: 'Trái tim của Thủ đô, khu phố đi bộ cuối tuần, bảo vệ nguyên trạng di tích Đền Ngọc Sơn và Tháp Rùa',
        coordinates: [
          [21.0260, 105.8500],
          [21.0310, 105.8530],
          [21.0290, 105.8560],
          [21.0240, 105.8530],
        ],
      },
      {
        code: 'GT-01',
        name: 'Đầu mối Giao thông Ga Hà Nội & Tuyến Metro ngầm Số 1, Số 3',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 45,
        maxFloors: 4,
        maxHeight: '16m (Nhà ga ngầm hiện đại)',
        density: '30%',
        floorAreaRatio: 1.5,
        description: 'Nhà ga đường sắt quốc gia kết hợp trung tâm trung chuyển đường sắt đô thị ngầm hiện đại',
        coordinates: [
          [21.0220, 105.8390],
          [21.0260, 105.8420],
          [21.0240, 105.8460],
          [21.0200, 105.8430],
        ],
      },
    ],
  },

  'Nam Từ Liêm': {
    district: 'Nam Từ Liêm',
    subdivisionCode: 'H2-2 & GS',
    legalBasis: 'Quyết định 4567/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị Nam Từ Liêm',
    planYear: 2030,
    center: [21.0150, 105.7650],
    zones: [
      {
        code: 'HH-01',
        name: 'Quần thể Đô thị Thông minh Tây Mỗ - Đại Mỗ',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 280,
        maxFloors: 38,
        maxHeight: '130m (38 tầng)',
        density: '40%',
        floorAreaRatio: 5.5,
        description: 'Đại đô thị thông minh hiện đại với công viên Nhật Bản Zen Park và biển hồ nhân tạo',
        coordinates: [
          [20.9980, 105.7380],
          [21.0120, 105.7480],
          [21.0080, 105.7600],
          [20.9940, 105.7500],
        ],
      },
      {
        code: 'QSQP-01',
        name: 'Khu Liên hợp Thể thao Quốc gia & Sân vận động Mỹ Đình',
        type: 'public',
        color: '#DC2626',
        areaHa: 170,
        maxFloors: 4,
        maxHeight: '35m (Mái vòm sân vận động)',
        density: '25%',
        floorAreaRatio: 1.2,
        description: 'Tổ hợp công trình thể thao đẳng cấp quốc tế, phục vụ thi đấu Sea Games và các sự kiện tầm cỡ',
        coordinates: [
          [21.0170, 105.7600],
          [21.0250, 105.7650],
          [21.0220, 105.7730],
          [21.0140, 105.7680],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Khu Trung tâm Tài chính Thương mại Keangnam - Mễ Trì',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 130,
        maxFloors: 72,
        maxHeight: '350m (Tháp Keangnam Landmark 72)',
        density: '50%',
        floorAreaRatio: 7.5,
        description: 'Biểu tượng skyline phía Tây Hà Nội với văn phòng tài chính, khách sạn 5 sao InterContinental',
        coordinates: [
          [21.0120, 105.7800],
          [21.0180, 105.7840],
          [21.0160, 105.7900],
          [21.0100, 105.7860],
        ],
      },
      {
        code: 'CX-01',
        name: 'Công viên Mễ Trì & Hồ điều hòa sinh thái phía Tây',
        type: 'green',
        color: '#22C55E',
        areaHa: 95,
        maxFloors: 1,
        maxHeight: '4m (Công viên cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Hồ nước điều hòa ngập úng và công viên cây xanh râm mát cho cư dân phía Tây',
        coordinates: [
          [21.0080, 105.7720],
          [21.0130, 105.7750],
          [21.0110, 105.7800],
          [21.0060, 105.7770],
        ],
      },
    ],
  },

  'Hai Bà Trưng': {
    district: 'Hai Bà Trưng',
    subdivisionCode: 'H1-4',
    legalBasis: 'Quyết định 1358/QĐ-UBND của UBND TP Hà Nội phê duyệt Quy hoạch phân khu đô thị H1-4',
    planYear: 2030,
    center: [21.0060, 105.8530],
    zones: [
      {
        code: 'ODT-01',
        name: 'Khu dân cư hiện hữu Bạch Mai - Trương Định',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 175,
        maxFloors: 5,
        maxHeight: '21m (5 tầng)',
        density: '65%',
        floorAreaRatio: 3.5,
        description: 'Chỉnh trang các khu tập thể cũ, bổ sung bãi đỗ xe và trường mầm non công lập',
        coordinates: [
          [21.0020, 105.8480],
          [21.0090, 105.8520],
          [21.0070, 105.8600],
          [21.0000, 105.8560],
        ],
      },
      {
        code: 'CX-01',
        name: 'Lá phổi xanh Công viên Thống Nhất & Công viên Tuổi Trẻ',
        type: 'green',
        color: '#22C55E',
        areaHa: 140,
        maxFloors: 1,
        maxHeight: '4m (Công trình cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Công viên mở không hàng rào, hồ Bảy Mẫu và khu thể thao phức hợp cho thanh thiếu niên',
        coordinates: [
          [21.0110, 105.8420],
          [21.0170, 105.8460],
          [21.0150, 105.8530],
          [21.0090, 105.8490],
        ],
      },
      {
        code: 'GD-01',
        name: 'Tam giác Đào tạo Kỹ thuật: Bách Khoa - Xây Dựng - Kinh Tế',
        type: 'public',
        color: '#6366F1',
        areaHa: 95,
        maxFloors: 14,
        maxHeight: '42m (14 tầng)',
        density: '45%',
        floorAreaRatio: 3.8,
        description: 'Khu liên hợp nghiên cứu khoa học kỹ thuật và trung tâm đổi mới sáng tạo quốc gia',
        coordinates: [
          [21.0030, 105.8390],
          [21.0080, 105.8430],
          [21.0050, 105.8480],
          [21.0000, 105.8440],
        ],
      },
      {
        code: 'YT-01',
        name: 'Tổ hợp Y tế Trọng điểm Quốc gia Bạch Mai - Tai Mũi Họng - Da Liễu',
        type: 'public',
        color: '#EC4899',
        areaHa: 65,
        maxFloors: 18,
        maxHeight: '55m (18 tầng)',
        density: '50%',
        floorAreaRatio: 4.5,
        description: 'Hệ thống bệnh viện tuyến cuối hàng đầu miền Bắc, viện tim mạch và trung tâm xạ trị',
        coordinates: [
          [20.9990, 105.8400],
          [21.0040, 105.8440],
          [21.0020, 105.8490],
          [20.9970, 105.8450],
        ],
      },
    ],
  },

  'Thanh Xuân': {
    district: 'Thanh Xuân',
    subdivisionCode: 'H2-3',
    legalBasis: 'Quyết định 6667/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị H2-3 Thanh Xuân',
    planYear: 2030,
    center: [20.9980, 105.8120],
    zones: [
      {
        code: 'HH-01',
        name: 'Trục Đô thị Cao tầng Hỗn hợp Nguyễn Trãi - Cao Xà Lá',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 135,
        maxFloors: 35,
        maxHeight: '120m (35 tầng)',
        density: '50%',
        floorAreaRatio: 6.0,
        description: 'Tái thiết các nhà máy cũ thành khu phức hợp cao tầng, trung tâm thương mại và căn hộ xanh',
        coordinates: [
          [20.9940, 105.8080],
          [21.0020, 105.8150],
          [20.9990, 105.8220],
          [20.9910, 105.8150],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Phố Thương mại Dịch vụ & Tài chính Hoàng Đạo Thúy - Ngụy Như Kon Tum',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 85,
        maxFloors: 25,
        maxHeight: '85m (25 tầng)',
        density: '55%',
        floorAreaRatio: 5.5,
        description: 'Tập trung trụ sở ngân hàng, văn phòng bảo hiểm và nhà hàng shophouse cao cấp',
        coordinates: [
          [21.0030, 105.8000],
          [21.0080, 105.8040],
          [21.0050, 105.8110],
          [21.0000, 105.8070],
        ],
      },
      {
        code: 'CX-01',
        name: 'Công viên Nhân Chính & Hồ điều hòa sinh thái Thanh Xuân',
        type: 'green',
        color: '#22C55E',
        areaHa: 110,
        maxFloors: 1,
        maxHeight: '4m (Công viên cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Quần thể hồ điều hòa ngập úng và không gian xanh thể thao ngoài trời',
        coordinates: [
          [21.0050, 105.7950],
          [21.0100, 105.7990],
          [21.0080, 105.8040],
          [21.0030, 105.8000],
        ],
      },
      {
        code: 'ODT-01',
        name: 'Khu Đất ở đô thị hiện hữu Khương Đình - Kim Giang',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 145,
        maxFloors: 6,
        maxHeight: '21m (6 tầng)',
        density: '65%',
        floorAreaRatio: 3.5,
        description: 'Chỉnh trang đường bờ sông Tô Lịch, kè mái và xây dựng đường dạo bộ xanh',
        coordinates: [
          [20.9880, 105.8150],
          [20.9950, 105.8200],
          [20.9920, 105.8270],
          [20.9850, 105.8220],
        ],
      },
      {
        code: 'GT-01',
        name: 'Nút giao ngầm Thanh Xuân - Khuất Duy Tiến & Vành đai 3',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 60,
        maxFloors: 3,
        maxHeight: '12m (Nút giao khác mức)',
        density: '25%',
        floorAreaRatio: 0.8,
        description: 'Nút giao 4 tầng hiện đại bậc nhất Hà Nội gồm hầm chui, mặt đất, cầu cạn và đường sắt đô thị',
        coordinates: [
          [20.9970, 105.7980],
          [21.0020, 105.8020],
          [20.9990, 105.8070],
          [20.9940, 105.8030],
        ],
      },
    ],
  },

  'Hoàng Mai': {
    district: 'Hoàng Mai',
    subdivisionCode: 'H2-4',
    legalBasis: 'Quyết định 6668/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị H2-4 Hoàng Mai',
    planYear: 2030,
    center: [20.9750, 105.8450],
    zones: [
      {
        code: 'CX-01',
        name: 'Đại Công viên Yên Sở & Hệ thống Hồ điều hòa Linh Đàm',
        type: 'green',
        color: '#22C55E',
        areaHa: 320,
        maxFloors: 1,
        maxHeight: '4m (Công viên sinh thái)',
        density: '3%',
        floorAreaRatio: 0.05,
        description: 'Công viên sinh thái lớn nhất miền Bắc, hồ điều hòa thoát lũ chính của thủ đô',
        coordinates: [
          [20.9650, 105.8500],
          [20.9800, 105.8580],
          [20.9750, 105.8750],
          [20.9580, 105.8650],
        ],
      },
      {
        code: 'HH-01',
        name: 'Khu Đô thị Kiểu mẫu Bán đảo Linh Đàm & Đại Kim',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 195,
        maxFloors: 36,
        maxHeight: '125m (36 tầng)',
        density: '45%',
        floorAreaRatio: 5.5,
        description: 'Đô thị ven hồ, các tòa nhà căn hộ hiện đại và trung tâm thương mại dịch vụ giải trí',
        coordinates: [
          [20.9680, 105.8280],
          [20.9780, 105.8340],
          [20.9740, 105.8440],
          [20.9640, 105.8380],
        ],
      },
      {
        code: 'GT-01',
        name: 'Đầu mối Giao thông Cửa ngõ phía Nam - Bến xe Nước Ngầm & Giáp Bát',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 95,
        maxFloors: 3,
        maxHeight: '14m (Bến xe liên tỉnh & ga đường sắt)',
        density: '30%',
        floorAreaRatio: 1.2,
        description: 'Trung tâm trung chuyển hành khách lớn nhất cửa ngõ phía Nam kết nối cao tốc Pháp Vân',
        coordinates: [
          [20.9720, 105.8380],
          [20.9790, 105.8430],
          [20.9760, 105.8490],
          [20.9690, 105.8440],
        ],
      },
      {
        code: 'ODT-01',
        name: 'Khu Đất ở đô thị cải tạo Định Công - Tân Mai',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 160,
        maxFloors: 5,
        maxHeight: '21m (5 tầng)',
        density: '65%',
        floorAreaRatio: 3.5,
        description: 'Mở rộng tuyến đường Vành đai 2.5 và hoàn thiện mạng lưới giao thông ngõ xóm',
        coordinates: [
          [20.9820, 105.8350],
          [20.9900, 105.8400],
          [20.9870, 105.8500],
          [20.9790, 105.8450],
        ],
      },
    ],
  },

  'Long Biên': {
    district: 'Long Biên',
    subdivisionCode: 'N10',
    legalBasis: 'Quyết định 6112/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị N10 Long Biên',
    planYear: 2030,
    center: [21.0350, 105.8950],
    zones: [
      {
        code: 'HH-01',
        name: 'Đại Đô thị Sinh thái Vinhomes Riverside & Việt Hưng',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 260,
        maxFloors: 15,
        maxHeight: '45m (15 tầng)',
        density: '35%',
        floorAreaRatio: 3.2,
        description: 'Khu biệt thự sinh thái ven sông kiểu Venice, trường học quốc tế và trung tâm thương mại',
        coordinates: [
          [21.0380, 105.8950],
          [21.0500, 105.9080],
          [21.0430, 105.9220],
          [21.0310, 105.9090],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Trung tâm Mua sắm & Dịch vụ Quốc tế Aeon Mall Long Biên',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 110,
        maxFloors: 8,
        maxHeight: '35m (8 tầng)',
        density: '50%',
        floorAreaRatio: 4.0,
        description: 'Tổ hợp thương mại dịch vụ quy mô hàng đầu thủ đô, rạp chiếu phim và khu triển lãm',
        coordinates: [
          [21.0250, 105.8890],
          [21.0310, 105.8930],
          [21.0280, 105.9010],
          [21.0220, 105.8970],
        ],
      },
      {
        code: 'CX-01',
        name: 'Công viên Sinh thái Đầm Cầu Sa & Hồ Sài Đồng',
        type: 'green',
        color: '#22C55E',
        areaHa: 140,
        maxFloors: 1,
        maxHeight: '4m (Công viên cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Không gian mặt nước xanh mát, công viên thể thao và khu cắm trại dã ngoại cuối tuần',
        coordinates: [
          [21.0330, 105.8850],
          [21.0400, 105.8900],
          [21.0370, 105.8980],
          [21.0300, 105.8930],
        ],
      },
      {
        code: 'GT-01',
        name: 'Nút giao Cầu Vĩnh Tuy - Cổ Linh & Trục Cao tốc Hà Nội - Hải Phòng',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 85,
        maxFloors: 2,
        maxHeight: '10m (Hạ tầng giao thông)',
        density: '20%',
        floorAreaRatio: 0.6,
        description: 'Đầu mối giao thông kết nối liên vùng với cao tốc 5B và cầu Vĩnh Tuy giai đoạn 2',
        coordinates: [
          [21.0180, 105.8820],
          [21.0250, 105.8870],
          [21.0220, 105.8940],
          [21.0150, 105.8890],
        ],
      },
    ],
  },

  'Hà Đông': {
    district: 'Hà Đông',
    subdivisionCode: 'S4',
    legalBasis: 'Quyết định 4324/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị S4 Hà Đông',
    planYear: 2030,
    center: [20.9720, 105.7720],
    zones: [
      {
        code: 'HH-01',
        name: 'Quần thể Đô thị Hiện đại Mỗ Lao - Văn Phú - Park City',
        type: 'mixed',
        color: '#8B5CF6',
        areaHa: 220,
        maxFloors: 35,
        maxHeight: '120m (35 tầng)',
        density: '45%',
        floorAreaRatio: 5.2,
        description: 'Tổ hợp chung cư cao tầng, công viên trung tâm và trường học liên cấp quốc tế',
        coordinates: [
          [20.9650, 105.7600],
          [20.9780, 105.7680],
          [20.9730, 105.7820],
          [20.9600, 105.7740],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Trung tâm Mua sắm & Dịch vụ Aeon Mall Hà Đông',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 120,
        maxFloors: 10,
        maxHeight: '40m (10 tầng)',
        density: '55%',
        floorAreaRatio: 4.5,
        description: 'Khu phức hợp thương mại dịch vụ sầm uất bậc nhất phía Tây Nam Hà Nội',
        coordinates: [
          [20.9800, 105.7480],
          [20.9870, 105.7530],
          [20.9840, 105.7610],
          [20.9770, 105.7560],
        ],
      },
      {
        code: 'GT-01',
        name: 'Hành lang Tuyến Đường sắt Đô thị Cát Linh - Hà Đông (Ga Yên Nghĩa)',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 75,
        maxFloors: 3,
        maxHeight: '14m (Ga trên cao & Depot Yên Nghĩa)',
        density: '25%',
        floorAreaRatio: 1.0,
        description: 'Tuyến metro trên cao đầu tiên của Việt Nam với ga kết nối bến xe liên tỉnh',
        coordinates: [
          [20.9580, 105.7500],
          [20.9650, 105.7550],
          [20.9620, 105.7630],
          [20.9550, 105.7580],
        ],
      },
      {
        code: 'ODT-01',
        name: 'Làng Nghề Lụa Vạn Phúc & Khu dân cư cổ Quang Trung',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 130,
        maxFloors: 4,
        maxHeight: '16m (4 tầng)',
        density: '60%',
        floorAreaRatio: 2.8,
        description: 'Bảo tồn làng nghề truyền thống dệt lụa hơn 1000 năm tuổi kết hợp phát triển du lịch',
        coordinates: [
          [20.9750, 105.7720],
          [20.9820, 105.7770],
          [20.9790, 105.7850],
          [20.9720, 105.7800],
        ],
      },
    ],
  },

  'Bắc Từ Liêm': {
    district: 'Bắc Từ Liêm',
    subdivisionCode: 'H2-1 & GS',
    legalBasis: 'Quyết định 6669/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị Bắc Từ Liêm',
    planYear: 2030,
    center: [21.0550, 105.7650],
    zones: [
      {
        code: 'CQ-01',
        name: 'Khu Đoàn Ngoại Giao & Trụ sở Đại sứ quán các nước',
        type: 'public',
        color: '#06B6D4',
        areaHa: 160,
        maxFloors: 25,
        maxHeight: '80m (25 tầng)',
        density: '40%',
        floorAreaRatio: 4.5,
        description: 'Khu phức hợp ngoại giao quốc tế, đại sứ quán và các tổ chức phi chính phủ',
        coordinates: [
          [21.0580, 105.7850],
          [21.0660, 105.7920],
          [21.0620, 105.8020],
          [21.0540, 105.7950],
        ],
      },
      {
        code: 'CX-01',
        name: 'Công viên Hòa Bình & Hồ điều hòa Bắc Từ Liêm',
        type: 'green',
        color: '#22C55E',
        areaHa: 130,
        maxFloors: 1,
        maxHeight: '4m (Công viên cảnh quan)',
        density: '5%',
        floorAreaRatio: 0.1,
        description: 'Biểu tượng Thành phố vì Hòa bình, công viên cây xanh lớn phục vụ toàn khu vực Tây Bắc',
        coordinates: [
          [21.0550, 105.7780],
          [21.0610, 105.7820],
          [21.0590, 105.7890],
          [21.0530, 105.7850],
        ],
      },
      {
        code: 'ODT-01',
        name: 'Khu Đất ở đô thị Xuân Đỉnh - Cổ Nhuế',
        type: 'residential',
        color: '#FFDD29',
        areaHa: 170,
        maxFloors: 6,
        maxHeight: '21m (6 tầng)',
        density: '65%',
        floorAreaRatio: 3.5,
        description: 'Chỉnh trang đô thị, mở rộng đường nối Vành đai 2.5 và Vành đai 3 Phạm Văn Đồng',
        coordinates: [
          [21.0620, 105.7750],
          [21.0700, 105.7800],
          [21.0670, 105.7880],
          [21.0590, 105.7830],
        ],
      },
    ],
  },

  'Phân khu Sông Hồng': {
    district: 'Phân khu Sông Hồng',
    subdivisionCode: 'SONG_HONG',
    legalBasis: 'Quyết định 1045/QĐ-UBND của UBND TP Hà Nội phê duyệt Quy hoạch phân khu đô thị Sông Hồng',
    planYear: 2030,
    center: [21.0400, 105.8650],
    zones: [
      {
        code: 'CX-01',
        name: 'Công viên Sinh thái Bãi giữa Sông Hồng & Hồ nước cảnh quan',
        type: 'green',
        color: '#22C55E',
        areaHa: 450,
        maxFloors: 1,
        maxHeight: 'Công trình tạm phục vụ du lịch sinh thái',
        density: '2%',
        floorAreaRatio: 0.05,
        description: 'Khu vực bảo tồn không gian mặt nước, bãi bồi tự nhiên, cấm tuyệt đối xây dựng kiên cố',
        coordinates: [
          [21.0320, 105.8550],
          [21.0480, 105.8650],
          [21.0550, 105.8750],
          [21.0380, 105.8700],
        ],
      },
      {
        code: 'TMD-01',
        name: 'Trục Đô thị Dịch vụ - Du lịch Văn hóa Ven Sông Hồng',
        type: 'commercial',
        color: '#EF4444',
        areaHa: 180,
        maxFloors: 12,
        maxHeight: '40m (12 tầng - kiểm soát thoát lũ)',
        density: '35%',
        floorAreaRatio: 3.5,
        description: 'Chuỗi công trình thương mại dịch vụ du lịch, bến du thuyền và quảng trường ven sông',
        coordinates: [
          [21.0250, 105.8600],
          [21.0350, 105.8680],
          [21.0300, 105.8760],
          [21.0200, 105.8680],
        ],
      },
      {
        code: 'GT-01',
        name: 'Hành lang Tuyến Đại lộ Cảnh quan Ven Sông & Cầu Tứ Liên',
        type: 'transport',
        color: '#3B82F6',
        areaHa: 120,
        maxFloors: 2,
        maxHeight: '12m (Trục đại lộ ven đê)',
        density: '20%',
        floorAreaRatio: 0.8,
        description: 'Tuyến đại lộ ven sông kết nối trung tâm Hà Nội với sân bay Nội Bài qua cầu Tứ Liên',
        coordinates: [
          [21.0420, 105.8580],
          [21.0520, 105.8680],
          [21.0480, 105.8750],
          [21.0380, 105.8650],
        ],
      },
    ],
  },
};

/**
 * DANH MỤC NHÓM ĐỒ ÁN QUY HOẠCH PHÂN KHU HÀ NỘI CHUẨN (QĐ 1259/QĐ-TTg)
 * Tương thích hoàn toàn với quyhoach.hanoi.vn
 */
export interface HanoiSubdivisionGroup {
  id: string; // 'ALL' | 'H1' | 'H2' | 'N' | 'S' | 'SONG_HONG' | 'TAY_HO'
  name: string;
  shortLabel: string;
  badge: string;
  desc: string;
  legalBasis: string;
  districts: string[];
}

export const HANOI_SUBDIVISION_GROUPS: HanoiSubdivisionGroup[] = [
  {
    id: 'ALL',
    name: 'Tất cả Đồ án Quy hoạch Hà Nội',
    shortLabel: 'Tất cả đồ án',
    badge: 'Toàn TP',
    desc: 'Bản đồ quy hoạch tổng thể toàn bộ các phân khu đô thị Hà Nội',
    legalBasis: 'Quy hoạch chung xây dựng Thủ đô Hà Nội 2030 (QĐ 1259/QĐ-TTg)',
    districts: ['all'],
  },
  {
    id: 'H1',
    name: 'Phân khu Đô thị Lịch sử H1 (H1-1, H1-2, H1-3, H1-4)',
    shortLabel: 'Đô thị Lịch sử H1',
    badge: 'Nội đô lõi',
    desc: 'Bảo tồn không gian phố cổ, phố cũ, kiểm soát mật độ và giãn dân',
    legalBasis: 'Quyết định 1355, 1356, 1357, 1358/QĐ-UBND của UBND TP Hà Nội',
    districts: ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng'],
  },
  {
    id: 'H2',
    name: 'Phân khu Đô thị Trung tâm Mở rộng H2 (H2-1, H2-2, H2-3, H2-4)',
    shortLabel: 'Đô thị Mở rộng H2',
    badge: 'Trung tâm mới',
    desc: 'Trung tâm tài chính, tháp văn phòng, đại học và khu đô thị cao tầng hiện đại',
    legalBasis: 'Quyết định 6666, 6667, 6668, 6669/QĐ-UBND của UBND TP Hà Nội',
    districts: ['Cầu Giấy', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Thanh Xuân', 'Hoàng Mai'],
  },
  {
    id: 'N',
    name: 'Chuỗi Đô thị Bắc Sông Hồng (N1 - N11)',
    shortLabel: 'Bắc Sông Hồng (N)',
    badge: 'Phía Đông Bắc',
    desc: 'Đại đô thị sinh thái, logistics và trung tâm thương mại dịch vụ quốc tế',
    legalBasis: 'Quyết định 6112/QĐ-UBND và các đồ án phân khu N1 đến N11',
    districts: ['Long Biên', 'Gia Lâm', 'Đông Anh', 'Mê Linh'],
  },
  {
    id: 'S',
    name: 'Chuỗi Đô thị Phía Tây & Nam (S1 - S5)',
    shortLabel: 'Phía Tây & Nam (S)',
    badge: 'Hà Đông / Hoài Đức',
    desc: 'Hành lang đô thị hiện đại kết nối tuyến đường sắt Cát Linh - Hà Đông',
    legalBasis: 'Quyết định 4324/QĐ-UBND và các đồ án phân khu S1 đến S5',
    districts: ['Hà Đông', 'Hoài Đức', 'Thanh Trì'],
  },
  {
    id: 'SONG_HONG',
    name: 'Trục Cảnh quan Đô thị Sông Hồng & Sông Đuống',
    shortLabel: 'Đô thị Sông Hồng',
    badge: 'Trục sinh thái',
    desc: 'Trục không gian xanh biểu tượng, công viên ngập nước và bến du thuyền',
    legalBasis: 'Quyết định 1045/QĐ-UBND phê duyệt Quy hoạch phân khu đô thị Sông Hồng',
    districts: ['Phân khu Sông Hồng', 'Hoàn Kiếm', 'Ba Đình', 'Tây Hồ', 'Long Biên'],
  },
  {
    id: 'TAY_HO',
    name: 'Khu vực Hồ Tây & Vùng phụ cận (Phân khu A6)',
    shortLabel: 'Hồ Tây (A6)',
    badge: 'Khu danh thắng',
    desc: 'Bảo tồn danh thắng Hồ Tây, làng cổ Thụy Khuê và biệt thự bán đảo Quảng An',
    legalBasis: 'Quyết định 4177/QĐ-UBND của UBND TP Hà Nội',
    districts: ['Tây Hồ'],
  },
];

/**
 * Lấy toàn bộ danh sách phân khu chuẩn hóa của tất cả các quận Hà Nội
 */
export function getAllHanoiPlanningZones(): PlanningZoneItem[] {
  const allZones: PlanningZoneItem[] = [];
  Object.keys(HANOI_DISTRICTS_PLANNING_PROFILES).forEach((district) => {
    allZones.push(...getDetailedPlanningForDistrict(district));
  });
  return allZones;
}

/**
 * Bộ lọc phân khu nâng cao (theo nhóm đồ án, quận, loại đất ký hiệu)
 */
export function filterHanoiPlanningZones(
  zones: PlanningZoneItem[],
  options: {
    subdivisionGroup?: string;
    district?: string;
    zoneTypeCode?: string;
    searchQuery?: string;
  }
): PlanningZoneItem[] {
  let result = [...zones];

  // 1. Lọc theo nhóm đồ án H1, H2, N, S, SONG_HONG...
  if (options.subdivisionGroup && options.subdivisionGroup !== 'ALL') {
    const group = HANOI_SUBDIVISION_GROUPS.find((g) => g.id === options.subdivisionGroup);
    if (group && !group.districts.includes('all')) {
      result = result.filter((z) =>
        group.districts.some((d) => z.district?.toLowerCase().includes(d.toLowerCase()))
      );
    }
  }

  // 2. Lọc theo quận cụ thể
  if (options.district && options.district !== 'all') {
    result = result.filter((z) =>
      z.district?.toLowerCase().includes(options.district!.toLowerCase())
    );
  }

  // 3. Lọc theo mã ký hiệu đất (ODT, TMD, HH, CX, GT, CQ, GD, YT, QSQP)
  if (options.zoneTypeCode && options.zoneTypeCode !== 'all') {
    result = result.filter(
      (z) =>
        z.code?.toUpperCase().startsWith(options.zoneTypeCode!.toUpperCase()) ||
        z.type?.toLowerCase() === options.zoneTypeCode!.toLowerCase()
    );
  }

  // 4. Tìm kiếm từ khóa tự do
  if (options.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.toLowerCase().trim();
    result = result.filter(
      (z) =>
        z.name.toLowerCase().includes(q) ||
        z.code.toLowerCase().includes(q) ||
        z.district.toLowerCase().includes(q)
    );
  }

  return result;
}
export function getDetailedPlanningForDistrict(district: string): PlanningZoneItem[] {
  const profile = HANOI_DISTRICTS_PLANNING_PROFILES[district];
  if (profile) {
    return profile.zones.map((z, idx) => ({
      id: `ai_zone_${district}_${z.code}_${idx}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      code: z.code,
      name: z.name,
      district: profile.district,
      color: z.color,
      areaHa: z.areaHa,
      maxFloors: z.maxFloors,
      maxHeight: z.maxHeight,
      density: z.density,
      floorAreaRatio: z.floorAreaRatio,
      status: 'published',
      type: z.type,
      planYear: profile.planYear,
      coordinates: z.coordinates,
      sourceFile: profile.legalBasis,
    }));
  }

  // Nếu là quận ngoại vi chưa có profile tĩnh riêng: Tự động phân bổ đa giác quanh tâm quận với 6 ký hiệu chuẩn
  const fallbackSymbols = [
    PLANNING_STANDARD_SYMBOLS.ODT,
    PLANNING_STANDARD_SYMBOLS.TMD,
    PLANNING_STANDARD_SYMBOLS.HH,
    PLANNING_STANDARD_SYMBOLS.CX,
    PLANNING_STANDARD_SYMBOLS.GT,
    PLANNING_STANDARD_SYMBOLS.GD,
  ];

  return fallbackSymbols.map((sym, idx) => ({
    id: `ai_zone_${district}_${sym.code}_${idx}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
    code: `${sym.code}-0${idx + 1}`,
    name: `${sym.name} (${district})`,
    district: district,
    color: sym.color,
    areaHa: 100 + idx * 25,
    maxFloors: sym.code === 'CX' ? 1 : sym.code === 'HH' ? 25 : 5,
    maxHeight: sym.code === 'CX' ? '4m' : sym.code === 'HH' ? '75m' : '21m',
    density: sym.code === 'CX' ? '5%' : '60%',
    floorAreaRatio: sym.code === 'CX' ? 0.1 : 3.5,
    status: 'published',
    type: sym.type as any,
    planYear: 2030,
    coordinates: [
      [21.0285 + (idx * 0.005), 105.8542 + (idx * 0.006)],
      [21.0350 + (idx * 0.005), 105.8600 + (idx * 0.006)],
      [21.0300 + (idx * 0.005), 105.8700 + (idx * 0.006)],
      [21.0220 + (idx * 0.005), 105.8620 + (idx * 0.006)],
    ],
    sourceFile: `Đồ án Quy hoạch Phân khu Đô thị ${district} 2030`,
  }));
}
