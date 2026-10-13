export interface HanoiStreetInfo {
  id?: string;
  name: string;
  district: string;
  ward?: string;
  lat: number;
  lng: number;
  aliases?: string[];
  category?: 'district' | 'town' | 'ward_commune' | 'project' | 'street' | 'landmark';
  description?: string;
  isSimilar?: boolean;
  similarReason?: string;
  badge?: string;
}

export interface DistrictRelation {
  district: string;
  reason: string;
  keyAreas: Array<{ name: string; ward?: string; lat: number; lng: number; desc?: string }>;
}

/**
 * Danh mục 30 Quận / Huyện / Thị xã của TP. Hà Nội kèm toạ độ và các khu vực lân cận / tương tự
 */
export const HANOI_ALL_DISTRICTS_CONFIG: Record<
  string,
  {
    type: 'Quận' | 'Huyện' | 'Thị xã';
    lat: number;
    lng: number;
    aliases: string[];
    similarDistricts: DistrictRelation[];
  }
> = {
  'Quốc Oai': {
    type: 'Huyện',
    lat: 20.9985,
    lng: 105.6385,
    aliases: ['quoc oai', 'huyen quoc oai', 'h quoc oai'],
    similarDistricts: [
      {
        district: 'Thạch Thất',
        reason: 'Giáp ranh phía Tây, cùng phân khu Hòa Lạc & ĐL Thăng Long',
        keyAreas: [
          { name: 'Khu công nghệ cao Hòa Lạc', ward: 'Thạch Hòa', lat: 21.0125, lng: 105.5350, desc: 'Tổ hợp công nghệ cao trọng điểm Tây Hà Nội' },
          { name: 'Đại học FPT Hòa Lạc', ward: 'Thạch Hòa', lat: 21.0126, lng: 105.5258, desc: 'Trung tâm đào tạo công nghệ cao' },
          { name: 'Xã Tân Xã (Hồ Tân Xã)', ward: 'Tân Xã', lat: 21.0255, lng: 105.5485, desc: 'Khu vực đất nền sinh thái ven hồ CNC' },
          { name: 'Xã Bình Yên', ward: 'Bình Yên', lat: 21.0350, lng: 105.5350, desc: 'Điểm nóng BĐS ven khu công nghệ cao' },
        ],
      },
      {
        district: 'Hoài Đức',
        reason: 'Giáp ranh phía Đông, cùng trục kết nối Đại Lộ Thăng Long về trung tâm',
        keyAreas: [
          { name: 'KĐT Nam An Khánh', ward: 'An Khánh', lat: 21.0065, lng: 105.7185, desc: 'Khu đô thị sinh thái cao cấp Sudico' },
          { name: 'KĐT Splendora Bắc An Khánh', ward: 'An Khánh', lat: 21.0165, lng: 105.7255, desc: 'Đại đô thị kiểu mẫu trục Thăng Long' },
          { name: 'Xã Vân Canh', ward: 'Vân Canh', lat: 21.0325, lng: 105.7350, desc: 'Kế cận Vành đai 3.5' },
        ],
      },
      {
        district: 'Chương Mỹ',
        reason: 'Giáp ranh phía Nam Quốc Oai, trục QL6 mở rộng',
        keyAreas: [
          { name: 'Thị trấn Chúc Sơn', ward: 'Chúc Sơn', lat: 20.9255, lng: 105.7050, desc: 'Trung tâm hành chính huyện Chương Mỹ' },
          { name: 'Thị trấn Xuân Mai', ward: 'Xuân Mai', lat: 20.8985, lng: 105.5850, desc: 'Đô thị vệ tinh Xuân Mai' },
        ],
      },
      {
        district: 'Đan Phượng',
        reason: 'Khu vực phía Bắc, cùng định hướng Vành đai 4 vùng Thủ đô',
        keyAreas: [
          { name: 'Thị trấn Phùng', ward: 'TT Phùng', lat: 21.0955, lng: 105.6725, desc: 'Trung tâm thương mại trục QL32' },
          { name: 'Xã Tân Hội (Vinhomes Wonder Park)', ward: 'Tân Hội', lat: 21.0985, lng: 105.6985, desc: 'Khu đô thị sinh thái 133ha' },
        ],
      },
    ],
  },
  'Hoài Đức': {
    type: 'Huyện',
    lat: 21.0200,
    lng: 105.6950,
    aliases: ['hoai duc', 'huyen hoai duc', 'h hoai duc'],
    similarDistricts: [
      {
        district: 'Nam Từ Liêm',
        reason: 'Giáp ranh trung tâm phía Tây, liền kề Vinhomes Smart City & Mỹ Đình',
        keyAreas: [
          { name: 'KĐT Vinhomes Smart City', ward: 'Tây Mỗ', lat: 20.9998, lng: 105.7441, desc: 'Đại đô thị thông minh 280ha' },
          { name: 'KĐT Mỹ Đình 1 & 2', ward: 'Mỹ Đình 1', lat: 21.0335, lng: 105.7712, desc: 'Trung tâm thể thao & BĐS sầm uất' },
        ],
      },
      {
        district: 'Hà Đông',
        reason: 'Giáp ranh phía Nam, cùng kết nối qua trục Lê Trọng Tấn',
        keyAreas: [
          { name: 'KĐT Dương Nội', ward: 'Dương Nội', lat: 20.9855, lng: 105.7550, desc: 'Khu đô thị sinh thái Nam Cường' },
          { name: 'KĐT Geleximco Lê Trọng Tấn', ward: 'Dương Nội', lat: 20.9785, lng: 105.7485, desc: 'Quần thể biệt thự liền kề mặt đường' },
        ],
      },
      {
        district: 'Quốc Oai',
        reason: 'Kế cận phía Tây theo trục Đại Lộ Thăng Long',
        keyAreas: [
          { name: 'Thị trấn Quốc Oai', ward: 'TT Quốc Oai', lat: 21.0015, lng: 105.6425, desc: 'Trung tâm hành chính huyện Quốc Oai' },
          { name: 'KĐT Sunny Garden City', ward: 'Sài Sơn', lat: 21.0125, lng: 105.6585, desc: 'Khu đô thị kiểu mẫu CEO Group' },
          { name: 'Xã Sài Sơn (Chùa Thầy)', ward: 'Sài Sơn', lat: 21.0255, lng: 105.6615, desc: 'Khu danh thắng du lịch Chùa Thầy' },
        ],
      },
      {
        district: 'Đan Phượng',
        reason: 'Giáp ranh phía Bắc dọc trục Quốc lộ 32',
        keyAreas: [
          { name: 'Thị trấn Phùng', ward: 'TT Phùng', lat: 21.0955, lng: 105.6725, desc: 'Trung tâm QL32' },
        ],
      },
    ],
  },
  'Thạch Thất': {
    type: 'Huyện',
    lat: 21.0085,
    lng: 105.5385,
    aliases: ['thach that', 'huyen thach that', 'hoa lac', 'hoalac'],
    similarDistricts: [
      {
        district: 'Quốc Oai',
        reason: 'Kế cận phía Đông, cùng phân khu Hòa Lạc & Đại lộ Thăng Long',
        keyAreas: [
          { name: 'Thị trấn Quốc Oai', ward: 'TT Quốc Oai', lat: 21.0015, lng: 105.6425, desc: 'Trung tâm huyện Quốc Oai' },
          { name: 'KĐT Sunny Garden City', ward: 'Sài Sơn', lat: 21.0125, lng: 105.6585, desc: 'KĐT hiện đại ven Đại lộ Thăng Long' },
          { name: 'Xã Ngọc Liệp (KCN Ngọc Liệp)', ward: 'Ngọc Liệp', lat: 21.0085, lng: 105.6155, desc: 'Cụm công nghiệp sầm uất' },
        ],
      },
      {
        district: 'Sơn Tây',
        reason: 'Giáp ranh phía Bắc, cùng định hướng cực tăng trưởng vệ tinh Tây Bắc',
        keyAreas: [
          { name: 'Thị xã Sơn Tây', ward: 'Quang Trung', lat: 21.1395, lng: 105.5035, desc: 'Đô thị cổ Sơn Tây' },
          { name: 'Khu du lịch Hồ Đồng Mô', ward: 'Sơn Đông', lat: 21.0985, lng: 105.4750, desc: 'Quần thể sân golf & sinh thái Đồng Mô' },
        ],
      },
      {
        district: 'Hoài Đức',
        reason: 'Kết nối cao tốc Thăng Long về trung tâm Hà Nội',
        keyAreas: [
          { name: 'KĐT Nam An Khánh', ward: 'An Khánh', lat: 21.0065, lng: 105.7185, desc: 'KĐT quy mô lớn trục Thăng Long' },
        ],
      },
    ],
  },
  'Cầu Giấy': {
    type: 'Quận',
    lat: 21.0315,
    lng: 105.7825,
    aliases: ['cau giay', 'quan cau giay', 'q cau giay'],
    similarDistricts: [
      {
        district: 'Nam Từ Liêm',
        reason: 'Giáp ranh trực tiếp khu Mỹ Đình, Mễ Trì, Keangnam',
        keyAreas: [
          { name: 'KĐT Mỹ Đình 1 & 2', ward: 'Mỹ Đình 1', lat: 21.0335, lng: 105.7712, desc: 'Khu đô thị sầm uất' },
          { name: 'Keangnam Landmark 72', ward: 'Mễ Trì', lat: 21.0171, lng: 105.7839, desc: 'Tòa tháp biểu tượng đường Phạm Hùng' },
          { name: 'KĐT Vinhomes Smart City', ward: 'Tây Mỗ', lat: 20.9998, lng: 105.7441, desc: 'Đại đô thị thông minh' },
        ],
      },
      {
        district: 'Đống Đa',
        reason: 'Giáp ranh qua trục Đường Láng, Huỳnh Thúc Kháng',
        keyAreas: [
          { name: 'Đường Láng', ward: 'Láng Thượng', lat: 21.0185, lng: 105.8085, desc: 'Trục giao thương dọc sông Tô Lịch' },
          { name: 'Phố Huỳnh Thúc Kháng', ward: 'Láng Hạ', lat: 21.0205, lng: 105.8125, desc: 'Phố tài chính văn phòng' },
        ],
      },
      {
        district: 'Thanh Xuân',
        reason: 'Kết nối trực tiếp qua trục Hoàng Đạo Thúy - Lê Văn Lương',
        keyAreas: [
          { name: 'Trung Hòa Nhân Chính', ward: 'Nhân Chính', lat: 21.0055, lng: 105.8025, desc: 'Trung tâm văn phòng & căn hộ cao cấp' },
        ],
      },
      {
        district: 'Tây Hồ',
        reason: 'Kết nối qua trục Võ Chí Công, Hoàng Quốc Việt',
        keyAreas: [
          { name: 'KĐT Starlake Tây Hồ Tây', ward: 'Xuân La', lat: 21.0558, lng: 105.7983, desc: 'Đại đô thị trung tâm mới' },
        ],
      },
    ],
  },
  'Nam Từ Liêm': {
    type: 'Quận',
    lat: 21.0020,
    lng: 105.7600,
    aliases: ['nam tu liem', 'quan nam tu liem', 'my dinh', 'mydinh'],
    similarDistricts: [
      {
        district: 'Cầu Giấy',
        reason: 'Kế cận trục Phạm Hùng, Duy Tân, Keangnam',
        keyAreas: [
          { name: 'Phố Duy Tân', ward: 'Dịch Vọng Hậu', lat: 21.0315, lng: 105.7835, desc: 'Thung lũng Silicon văn phòng' },
          { name: 'Đường Trần Duy Hưng', ward: 'Trung Hòa', lat: 21.0084, lng: 105.7972, desc: 'Trục cửa ngõ Tây Nam' },
        ],
      },
      {
        district: 'Hoài Đức',
        reason: 'Kế cận Vinhomes Smart City, Đại lộ Thăng Long',
        keyAreas: [
          { name: 'KĐT Nam An Khánh', ward: 'An Khánh', lat: 21.0065, lng: 105.7185, desc: 'KĐT sinh thái Sudico' },
          { name: 'KĐT Geleximco Lê Trọng Tấn', ward: 'An Khánh', lat: 20.9785, lng: 105.7485, desc: 'Khu biệt thự liền kề' },
        ],
      },
      {
        district: 'Hà Đông',
        reason: 'Giáp ranh Đại Mỗ - Vạn Phúc, Tố Hữu',
        keyAreas: [
          { name: 'KĐT Dương Nội', ward: 'Dương Nội', lat: 20.9855, lng: 105.7550, desc: 'KĐT Nam Cường' },
          { name: 'Phường Vạn Phúc', ward: 'Vạn Phúc', lat: 20.9825, lng: 105.7750, desc: 'Làng lụa truyền thống' },
        ],
      },
    ],
  },
  'Hà Đông': {
    type: 'Quận',
    lat: 20.9725,
    lng: 105.7745,
    aliases: ['ha dong', 'quan ha dong'],
    similarDistricts: [
      {
        district: 'Thanh Xuân',
        reason: 'Cùng trục huyết mạch Nguyễn Trãi - Trần Phú - Tuyến Metro 2A',
        keyAreas: [
          { name: 'KĐT Vinhomes Royal City', ward: 'Thượng Đình', lat: 21.0025, lng: 105.8155, desc: 'KĐT Hoàng Gia Nguyễn Trãi' },
          { name: 'Đường Nguyễn Trãi', ward: 'Thanh Xuân Bắc', lat: 20.9985, lng: 105.8115, desc: 'Trục đường sắt trên cao' },
        ],
      },
      {
        district: 'Nam Từ Liêm',
        reason: 'Kế cận trục Tố Hữu - Lê Trọng Tấn, Đại Mỗ',
        keyAreas: [
          { name: 'KĐT Vinhomes Smart City', ward: 'Tây Mỗ', lat: 20.9998, lng: 105.7441, desc: 'Thành phố thông minh' },
        ],
      },
      {
        district: 'Hoài Đức',
        reason: 'Liền kề KĐT Dương Nội, KĐT Geleximco A-B-C-D',
        keyAreas: [
          { name: 'KĐT Nam An Khánh', ward: 'An Khánh', lat: 21.0065, lng: 105.7185, desc: 'Khu đô thị sinh thái' },
        ],
      },
      {
        district: 'Thanh Oai',
        reason: 'Liền kề KĐT Thanh Hà Cienco 5, trục phát triển phía Nam',
        keyAreas: [
          { name: 'KĐT Thanh Hà Cienco 5', ward: 'Cự Khê', lat: 20.9455, lng: 105.7950, desc: 'Đại đô thị 400ha' },
        ],
      },
    ],
  },
  'Đông Anh': {
    type: 'Huyện',
    lat: 21.1350,
    lng: 105.8450,
    aliases: ['dong anh', 'huyen dong anh'],
    similarDistricts: [
      {
        district: 'Tây Hồ',
        reason: 'Kết nối thẳng qua Cầu Nhật Tân chỉ 5 phút',
        keyAreas: [
          { name: 'Đường Võ Chí Công', ward: 'Xuân La', lat: 21.0665, lng: 105.8025, desc: 'Đại lộ 10 làn xe kết nối Sân bay' },
          { name: 'KĐT Ciputra Tây Hồ', ward: 'Phú Thượng', lat: 21.0785, lng: 105.7985, desc: 'Đô thị quốc tế kiểu mẫu' },
        ],
      },
      {
        district: 'Sóc Sơn',
        reason: 'Giáp ranh phía Bắc, hướng Sân bay Quốc tế Nội Bài',
        keyAreas: [
          { name: 'Sân bay Quốc tế Nội Bài', ward: 'Phú Minh', lat: 21.2215, lng: 105.8075, desc: 'Cảng hàng không quốc tế' },
          { name: 'Thị trấn Sóc Sơn', ward: 'TT Sóc Sơn', lat: 21.2685, lng: 105.8485, desc: 'Trung tâm hành chính huyện' },
        ],
      },
      {
        district: 'Gia Lâm',
        reason: 'Kết nối qua trục Cầu Đuống, Vành đai 3',
        keyAreas: [
          { name: 'Vinhomes Ocean Park 1', ward: 'Đa Tốn', lat: 20.9945, lng: 105.9465, desc: 'Thành phố Biển Hồ' },
        ],
      },
      {
        district: 'Long Biên',
        reason: 'Kết nối qua Cầu Đông Trù',
        keyAreas: [
          { name: 'KĐT Vinhomes Riverside', ward: 'Phúc Đồng', lat: 21.0505, lng: 105.9085, desc: 'Biệt thự sinh thái ven sông' },
        ],
      },
    ],
  },
  'Gia Lâm': {
    type: 'Huyện',
    lat: 20.9945,
    lng: 105.9465,
    aliases: ['gia lam', 'huyen gia lam'],
    similarDistricts: [
      {
        district: 'Long Biên',
        reason: 'Liền kề trung tâm phía Đông, Aeon Mall, Vinhomes Riverside',
        keyAreas: [
          { name: 'KĐT Vinhomes Riverside', ward: 'Phúc Đồng', lat: 21.0505, lng: 105.9085, desc: 'Biệt thự cao cấp' },
          { name: 'Đường Cổ Linh (Aeon Mall)', ward: 'Long Biên', lat: 21.0265, lng: 105.8985, desc: 'Đại siêu thị Aeon Mall' },
        ],
      },
      {
        district: 'Hoàng Mai',
        reason: 'Kết nối qua Cầu Thanh Trì',
        keyAreas: [
          { name: 'KĐT Gamuda Gardens', ward: 'Yên Sở', lat: 20.9702, lng: 105.8643, desc: 'KĐT sinh thái' },
        ],
      },
      {
        district: 'Đông Anh',
        reason: 'Kết nối qua Cầu Đuống',
        keyAreas: [
          { name: 'Xã Xuân Canh (Trung tâm Triển lãm)', ward: 'Xuân Canh', lat: 21.1085, lng: 105.8650, desc: 'Triển lãm Quốc gia' },
        ],
      },
    ],
  },
  'Thanh Xuân': {
    type: 'Quận',
    lat: 20.9950,
    lng: 105.8080,
    aliases: ['thanh xuan', 'quan thanh xuan'],
    similarDistricts: [
      {
        district: 'Cầu Giấy',
        reason: 'Liền kề Trung Hòa Nhân Chính, Lê Văn Lương',
        keyAreas: [
          { name: 'Đường Trần Duy Hưng', ward: 'Trung Hòa', lat: 21.0084, lng: 105.7972, desc: 'Trục thương mại' },
        ],
      },
      {
        district: 'Đống Đa',
        reason: 'Kế cận Ngã Tư Sở, Trường Chinh, Tây Sơn',
        keyAreas: [
          { name: 'Phố Tây Sơn', ward: 'Ngã Tư Sở', lat: 21.0112, lng: 105.8235, desc: 'Trục Ngã Tư Sở' },
        ],
      },
      {
        district: 'Hà Đông',
        reason: 'Cùng trục huyết mạch Nguyễn Trãi - Trần Phú',
        keyAreas: [
          { name: 'KĐT Văn Quán', ward: 'Văn Quán', lat: 20.9805, lng: 105.7925, desc: 'KĐT kiểu mẫu' },
        ],
      },
    ],
  },
  'Tây Hồ': {
    type: 'Quận',
    lat: 21.0650,
    lng: 105.8230,
    aliases: ['tay ho', 'quan tay ho', 'ho tay'],
    similarDistricts: [
      {
        district: 'Ba Đình',
        reason: 'Kế cận Hồ Tây, Hoàng Hoa Thám, Phan Đình Phùng',
        keyAreas: [
          { name: 'Đường Phan Đình Phùng', ward: 'Quán Thánh', lat: 21.0412, lng: 105.8425, desc: 'Phố di sản' },
        ],
      },
      {
        district: 'Cầu Giấy',
        reason: 'Kết nối Võ Chí Công, Hoàng Quốc Việt',
        keyAreas: [
          { name: 'Đường Hoàng Quốc Việt', ward: 'Nghĩa Đô', lat: 21.0465, lng: 105.7938, desc: 'Trục công nghệ' },
        ],
      },
      {
        district: 'Đông Anh',
        reason: 'Kết nối thẳng qua Cầu Nhật Tân',
        keyAreas: [
          { name: 'Xã Vĩnh Ngọc', ward: 'Vĩnh Ngọc', lat: 21.1125, lng: 105.8285, desc: 'Chân Cầu Nhật Tân' },
        ],
      },
    ],
  },
  'Long Biên': {
    type: 'Quận',
    lat: 21.0420,
    lng: 105.8900,
    aliases: ['long bien', 'quan long bien'],
    similarDistricts: [
      {
        district: 'Hoàn Kiếm',
        reason: 'Kết nối qua Cầu Chương Dương, Cầu Long Biên',
        keyAreas: [
          { name: 'Phố Tràng Tiền - Hồ Gươm', ward: 'Tràng Tiền', lat: 21.0255, lng: 105.8565, desc: 'Trung tâm Thủ đô' },
        ],
      },
      {
        district: 'Gia Lâm',
        reason: 'Liền kề phía Đông, cùng trục phát triển',
        keyAreas: [
          { name: 'Vinhomes Ocean Park 1', ward: 'Đa Tốn', lat: 20.9945, lng: 105.9465, desc: 'Đại đô thị' },
        ],
      },
    ],
  },
  'Đống Đa': {
    type: 'Quận',
    lat: 21.0185,
    lng: 105.8300,
    aliases: ['dong da', 'quan dong da'],
    similarDistricts: [
      {
        district: 'Ba Đình',
        reason: 'Kế cận Giảng Võ, Cát Linh',
        keyAreas: [
          { name: 'Đường Kim Mã', ward: 'Kim Mã', lat: 21.0312, lng: 105.8185, desc: 'Trục trung tâm' },
        ],
      },
      {
        district: 'Cầu Giấy',
        reason: 'Kết nối Đường Láng, Cầu Giấy',
        keyAreas: [
          { name: 'Đường Cầu Giấy', ward: 'Quan Hoa', lat: 21.0345, lng: 105.7995, desc: 'Trục Cầu Giấy' },
        ],
      },
    ],
  },
  'Ba Đình': {
    type: 'Quận',
    lat: 21.0340,
    lng: 105.8250,
    aliases: ['ba dinh', 'quan ba dinh'],
    similarDistricts: [
      {
        district: 'Hoàn Kiếm',
        reason: 'Trung tâm lịch sử chính trị',
        keyAreas: [
          { name: 'Phố Tràng Tiền', ward: 'Tràng Tiền', lat: 21.0255, lng: 105.8565, desc: 'Phố trung tâm' },
        ],
      },
      {
        district: 'Tây Hồ',
        reason: 'Ven Hồ Tây',
        keyAreas: [
          { name: 'Bán đảo Quảng An', ward: 'Quảng An', lat: 21.0625, lng: 105.8312, desc: 'Hồ Tây' },
        ],
      },
    ],
  },
  'Hoàn Kiếm': {
    type: 'Quận',
    lat: 21.0310,
    lng: 105.8525,
    aliases: ['hoan kiem', 'quan hoan kiem', 'pho co', 'ho guom'],
    similarDistricts: [
      {
        district: 'Ba Đình',
        reason: 'Trung tâm Thủ đô',
        keyAreas: [
          { name: 'Phố Phan Đình Phùng', ward: 'Quán Thánh', lat: 21.0412, lng: 105.8425, desc: 'Phố di sản' },
        ],
      },
      {
        district: 'Hai Bà Trưng',
        reason: 'Kế cận Phố Huế, Bà Triệu',
        keyAreas: [
          { name: 'Phố Phố Huế', ward: 'Phố Huế', lat: 21.0145, lng: 105.8525, desc: 'Phố thương mại' },
        ],
      },
    ],
  },
  'Hoàng Mai': {
    type: 'Quận',
    lat: 20.9750,
    lng: 105.8500,
    aliases: ['hoang mai', 'quan hoang mai'],
    similarDistricts: [
      {
        district: 'Thanh Trì',
        reason: 'Giáp ranh phía Nam, cùng kết nối Quốc lộ 1A',
        keyAreas: [
          { name: 'Thị trấn Văn Điển', ward: 'TT Văn Điển', lat: 20.9525, lng: 105.8450, desc: 'Trung tâm Thanh Trì' },
          { name: 'KĐT Tứ Hiệp IEC', ward: 'Tứ Hiệp', lat: 20.9415, lng: 105.8585, desc: 'Khu đô thị mới' },
        ],
      },
      {
        district: 'Thanh Xuân',
        reason: 'Kết nối qua trục Nguyễn Xiển, Định Công',
        keyAreas: [
          { name: 'KĐT Royal City', ward: 'Thượng Đình', lat: 21.0025, lng: 105.8155, desc: 'KĐT Royal City' },
        ],
      },
    ],
  },
  'Hai Bà Trưng': {
    type: 'Quận',
    lat: 21.0080,
    lng: 105.8550,
    aliases: ['hai ba trung', 'quan hai ba trung'],
    similarDistricts: [
      {
        district: 'Hoàn Kiếm',
        reason: 'Giáp ranh trung tâm',
        keyAreas: [
          { name: 'Phố Bà Triệu', ward: 'Hàng Bài', lat: 21.0185, lng: 105.8505, desc: 'Phố trung tâm' },
        ],
      },
      {
        district: 'Hoàng Mai',
        reason: 'Giáp ranh phía Nam qua Minh Khai, Times City',
        keyAreas: [
          { name: 'KĐT Bán đảo Linh Đàm', ward: 'Hoàng Liệt', lat: 20.9655, lng: 105.8285, desc: 'KĐT Linh Đàm' },
        ],
      },
    ],
  },
  'Bắc Từ Liêm': {
    type: 'Quận',
    lat: 21.0600,
    lng: 105.7600,
    aliases: ['bac tu liem', 'quan bac tu liem'],
    similarDistricts: [
      {
        district: 'Cầu Giấy',
        reason: 'Giáp ranh qua Cầu Diễn, Hồ Tùng Mậu',
        keyAreas: [
          { name: 'Đường Xuân Thủy', ward: 'Dịch Vọng Hậu', lat: 21.0368, lng: 105.7885, desc: 'Trục ĐH Quốc Gia' },
        ],
      },
      {
        district: 'Tây Hồ',
        reason: 'Kế cận Starlake, Ciputra',
        keyAreas: [
          { name: 'KĐT Starlake Tây Hồ Tây', ward: 'Xuân La', lat: 21.0558, lng: 105.7983, desc: 'Starlake' },
        ],
      },
      {
        district: 'Hoài Đức',
        reason: 'Kế cận trục Quốc lộ 32',
        keyAreas: [
          { name: 'Thị trấn Trạm Trôi', ward: 'TT Trạm Trôi', lat: 21.0725, lng: 105.7050, desc: 'Trung tâm Hoài Đức' },
        ],
      },
    ],
  },
  'Thanh Trì': {
    type: 'Huyện',
    lat: 20.9400,
    lng: 105.8500,
    aliases: ['thanh tri', 'huyen thanh tri'],
    similarDistricts: [
      {
        district: 'Hoàng Mai',
        reason: 'Giáp ranh phía Bắc',
        keyAreas: [
          { name: 'KĐT Bán đảo Linh Đàm', ward: 'Hoàng Liệt', lat: 20.9655, lng: 105.8285, desc: 'Bán đảo Linh Đàm' },
        ],
      },
      {
        district: 'Thường Tín',
        reason: 'Giáp ranh phía Nam dọc QL1A',
        keyAreas: [
          { name: 'Thị trấn Thường Tín', ward: 'TT Thường Tín', lat: 20.8685, lng: 105.8685, desc: 'Trung tâm Thường Tín' },
        ],
      },
    ],
  },
  'Sơn Tây': {
    type: 'Thị xã',
    lat: 21.1395,
    lng: 105.5035,
    aliases: ['son tay', 'thi xa son tay', 'tx son tay'],
    similarDistricts: [
      {
        district: 'Ba Vì',
        reason: 'Giáp ranh phía Tây Bắc',
        keyAreas: [
          { name: 'Vườn Quốc gia Ba Vì', ward: 'Tản Lĩnh', lat: 21.0855, lng: 105.3650, desc: 'Du lịch sinh thái Ba Vì' },
        ],
      },
      {
        district: 'Thạch Thất',
        reason: 'Kế cận phía Nam, kết nối KCNC Hòa Lạc',
        keyAreas: [
          { name: 'Khu công nghệ cao Hòa Lạc', ward: 'Thạch Hòa', lat: 21.0125, lng: 105.5350, desc: 'Khu CNC Hòa Lạc' },
        ],
      },
    ],
  },
  'Ba Vì': {
    type: 'Huyện',
    lat: 21.2335,
    lng: 105.3585,
    aliases: ['ba vi', 'huyen ba vi'],
    similarDistricts: [
      {
        district: 'Sơn Tây',
        reason: 'Giáp ranh đô thị Sơn Tây',
        keyAreas: [
          { name: 'Thị xã Sơn Tây', ward: 'Quang Trung', lat: 21.1395, lng: 105.5035, desc: 'Thị xã Sơn Tây' },
        ],
      },
      {
        district: 'Thạch Thất',
        reason: 'Kế cận khu công nghệ cao',
        keyAreas: [
          { name: 'Khu CNC Hòa Lạc', ward: 'Thạch Hòa', lat: 21.0125, lng: 105.5350, desc: 'Hòa Lạc' },
        ],
      },
    ],
  },
  'Đan Phượng': {
    type: 'Huyện',
    lat: 21.0985,
    lng: 105.6785,
    aliases: ['dan phuong', 'huyen dan phuong'],
    similarDistricts: [
      {
        district: 'Hoài Đức',
        reason: 'Giáp ranh phía Nam, cùng kết nối QL32 & Vành đai 4',
        keyAreas: [
          { name: 'Thị trấn Trạm Trôi', ward: 'TT Trạm Trôi', lat: 21.0725, lng: 105.7050, desc: 'TT Trạm Trôi' },
        ],
      },
      {
        district: 'Bắc Từ Liêm',
        reason: 'Kết nối về trung tâm qua QL32',
        keyAreas: [
          { name: 'Ga Metro Nhổn', ward: 'Minh Khai', lat: 21.0451, lng: 105.7614, desc: 'Ga depot Nhổn' },
        ],
      },
    ],
  },
  'Chương Mỹ': {
    type: 'Huyện',
    lat: 20.8885,
    lng: 105.6985,
    aliases: ['chuong my', 'huyen chuong my', 'xuan mai', 'chuc son'],
    similarDistricts: [
      {
        district: 'Hà Đông',
        reason: 'Kết nối thẳng qua trục Quốc lộ 6',
        keyAreas: [
          { name: 'KĐT Văn Phú', ward: 'Phú La', lat: 20.9625, lng: 105.7685, desc: 'KĐT Văn Phú' },
        ],
      },
      {
        district: 'Quốc Oai',
        reason: 'Giáp ranh phía Bắc',
        keyAreas: [
          { name: 'Thị trấn Quốc Oai', ward: 'TT Quốc Oai', lat: 21.0015, lng: 105.6425, desc: 'Trung tâm Quốc Oai' },
        ],
      },
    ],
  },
  'Thanh Oai': {
    type: 'Huyện',
    lat: 20.8785,
    lng: 105.7785,
    aliases: ['thanh oai', 'huyen thanh oai', 'thanh ha'],
    similarDistricts: [
      {
        district: 'Hà Đông',
        reason: 'Giáp ranh trực tiếp KĐT Thanh Hà Cienco 5',
        keyAreas: [
          { name: 'KĐT Xa La', ward: 'Phúc La', lat: 20.9685, lng: 105.7925, desc: 'KĐT Xa La' },
        ],
      },
      {
        district: 'Thanh Trì',
        reason: 'Giáp ranh phía Đông',
        keyAreas: [
          { name: 'KĐT Tứ Hiệp', ward: 'Tứ Hiệp', lat: 20.9415, lng: 105.8585, desc: 'Tứ Hiệp IEC' },
        ],
      },
    ],
  },
  'Thường Tín': {
    type: 'Huyện',
    lat: 20.8685,
    lng: 105.8685,
    aliases: ['thuong tin', 'huyen thuong tin'],
    similarDistricts: [
      {
        district: 'Thanh Trì',
        reason: 'Giáp ranh phía Bắc trục Quốc lộ 1A',
        keyAreas: [
          { name: 'Thị trấn Văn Điển', ward: 'TT Văn Điển', lat: 20.9525, lng: 105.8450, desc: 'Văn Điển' },
        ],
      },
      {
        district: 'Phú Xuyên',
        reason: 'Giáp ranh phía Nam',
        keyAreas: [
          { name: 'Thị trấn Phú Xuyên', ward: 'TT Phú Xuyên', lat: 20.7385, lng: 105.9085, desc: 'Phú Xuyên' },
        ],
      },
    ],
  },
  'Phú Xuyên': {
    type: 'Huyện',
    lat: 20.7385,
    lng: 105.9085,
    aliases: ['phu xuyen', 'huyen phu xuyen'],
    similarDistricts: [
      {
        district: 'Thường Tín',
        reason: 'Giáp ranh phía Bắc',
        keyAreas: [
          { name: 'Thị trấn Thường Tín', ward: 'TT Thường Tín', lat: 20.8685, lng: 105.8685, desc: 'Thường Tín' },
        ],
      },
      {
        district: 'Ứng Hòa',
        reason: 'Giáp ranh phía Tây',
        keyAreas: [
          { name: 'Thị trấn Vân Đình', ward: 'TT Vân Đình', lat: 20.7285, lng: 105.7685, desc: 'Vân Đình' },
        ],
      },
    ],
  },
  'Ứng Hòa': {
    type: 'Huyện',
    lat: 20.7285,
    lng: 105.7685,
    aliases: ['ung hoa', 'huyen ung hoa', 'van dinh'],
    similarDistricts: [
      {
        district: 'Mỹ Đức',
        reason: 'Giáp ranh phía Tây',
        keyAreas: [
          { name: 'Thị trấn Đại Nghĩa', ward: 'TT Đại Nghĩa', lat: 20.6885, lng: 105.7285, desc: 'Mỹ Đức' },
        ],
      },
      {
        district: 'Thanh Oai',
        reason: 'Giáp ranh phía Bắc',
        keyAreas: [
          { name: 'Thị trấn Kim Bài', ward: 'TT Kim Bài', lat: 20.8785, lng: 105.7785, desc: 'Kim Bài' },
        ],
      },
    ],
  },
  'Mỹ Đức': {
    type: 'Huyện',
    lat: 20.6885,
    lng: 105.7285,
    aliases: ['my duc', 'huyen my duc', 'chua huong'],
    similarDistricts: [
      {
        district: 'Ứng Hòa',
        reason: 'Giáp ranh phía Đông',
        keyAreas: [
          { name: 'Thị trấn Vân Đình', ward: 'TT Vân Đình', lat: 20.7285, lng: 105.7685, desc: 'Vân Đình' },
        ],
      },
    ],
  },
  'Phúc Thọ': {
    type: 'Huyện',
    lat: 21.1085,
    lng: 105.5485,
    aliases: ['phuc tho', 'huyen phuc tho'],
    similarDistricts: [
      {
        district: 'Sơn Tây',
        reason: 'Giáp ranh phía Tây',
        keyAreas: [
          { name: 'Thị xã Sơn Tây', ward: 'Quang Trung', lat: 21.1395, lng: 105.5035, desc: 'Sơn Tây' },
        ],
      },
      {
        district: 'Thạch Thất',
        reason: 'Giáp ranh phía Nam',
        keyAreas: [
          { name: 'Thị trấn Liên Quan', ward: 'TT Liên Quan', lat: 21.0550, lng: 105.5850, desc: 'Thạch Thất' },
        ],
      },
    ],
  },
  'Mê Linh': {
    type: 'Huyện',
    lat: 21.1785,
    lng: 105.7185,
    aliases: ['me linh', 'huyen me linh'],
    similarDistricts: [
      {
        district: 'Đông Anh',
        reason: 'Giáp ranh phía Đông',
        keyAreas: [
          { name: 'Thị trấn Đông Anh', ward: 'TT Đông Anh', lat: 21.1395, lng: 105.8485, desc: 'Đông Anh' },
        ],
      },
      {
        district: 'Sóc Sơn',
        reason: 'Giáp ranh phía Bắc',
        keyAreas: [
          { name: 'Sân bay Quốc tế Nội Bài', ward: 'Phú Minh', lat: 21.2215, lng: 105.8075, desc: 'Nội Bài' },
        ],
      },
    ],
  },
  'Sóc Sơn': {
    type: 'Huyện',
    lat: 21.2685,
    lng: 105.8485,
    aliases: ['soc son', 'huyen soc son', 'noi bai'],
    similarDistricts: [
      {
        district: 'Đông Anh',
        reason: 'Giáp ranh phía Nam, cùng kết nối cao tốc Thăng Long - Nội Bài',
        keyAreas: [
          { name: 'Thị trấn Đông Anh', ward: 'TT Đông Anh', lat: 21.1395, lng: 105.8485, desc: 'Đông Anh' },
          { name: 'Xã Kim Chung', ward: 'Kim Chung', lat: 21.1215, lng: 105.7950, desc: 'KCN Thăng Long' },
        ],
      },
      {
        district: 'Mê Linh',
        reason: 'Giáp ranh phía Tây',
        keyAreas: [
          { name: 'Thị trấn Quang Minh', ward: 'TT Quang Minh', lat: 21.1985, lng: 105.7650, desc: 'KCN Quang Minh' },
        ],
      },
    ],
  },
};

/**
 * Danh sách toàn bộ các vị trí tiêu biểu (xã, thị trấn, khu đô thị, phố...) của 30 Quận / Huyện Hà Nội
 */
export const POPULAR_HANOI_LOCATIONS: HanoiStreetInfo[] = [
  // ── 1. HUYỆN QUỐC OAI ──
  { name: 'Huyện Quốc Oai (Trung tâm huyện)', district: 'Quốc Oai', ward: 'Thị trấn Quốc Oai', lat: 20.9985, lng: 105.6385, category: 'district', description: 'Trung tâm hành chính huyện Quốc Oai', aliases: ['quoc oai', 'huyen quoc oai'] },
  { name: 'Thị trấn Quốc Oai', district: 'Quốc Oai', ward: 'Thị trấn Quốc Oai', lat: 21.0015, lng: 105.6425, category: 'town', description: 'Trung tâm thương mại & dịch vụ huyện Quốc Oai', aliases: ['tt quoc oai', 'thi tran quoc oai'] },
  { name: 'Khu đô thị Sunny Garden City', district: 'Quốc Oai', ward: 'Sài Sơn', lat: 21.0125, lng: 105.6585, category: 'project', description: 'Khu đô thị cao cấp CEO Group ven Đại lộ Thăng Long', aliases: ['sunny garden', 'sunny garden city', 'ceo quoc oai'] },
  { name: 'Xã Sài Sơn (Chùa Thầy)', district: 'Quốc Oai', ward: 'Sài Sơn', lat: 21.0255, lng: 105.6615, category: 'ward_commune', description: 'Quần thể di tích quốc gia đặc biệt Chùa Thầy', aliases: ['sai son', 'chua thay'] },
  { name: 'Xã Đồng Quang', district: 'Quốc Oai', ward: 'Đồng Quang', lat: 20.9785, lng: 105.6625, category: 'ward_commune', description: 'Khu dân cư sầm uất phía Nam Quốc Oai', aliases: ['dong quang'] },
  { name: 'Xã Ngọc Liệp (KCN Ngọc Liệp)', district: 'Quốc Oai', ward: 'Ngọc Liệp', lat: 21.0085, lng: 105.6155, category: 'ward_commune', description: 'Cụm công nghiệp Ngọc Liệp ven Đại lộ Thăng Long', aliases: ['ngoc liep', 'kcn ngoc liep'] },
  { name: 'Xã Thạch Thán', district: 'Quốc Oai', ward: 'Thạch Thán', lat: 20.9855, lng: 105.6355, category: 'ward_commune', description: 'Khu dân cư giáp thị trấn Quốc Oai', aliases: ['thach than'] },
  { name: 'Xã Yên Sơn', district: 'Quốc Oai', ward: 'Yên Sơn', lat: 21.0215, lng: 105.6455, category: 'ward_commune', description: 'Khu vực đất ở và trang trại sinh thái', aliases: ['yen son'] },
  { name: 'Xã Phượng Cách', district: 'Quốc Oai', ward: 'Phượng Cách', lat: 21.0285, lng: 105.6825, category: 'ward_commune', description: 'Khu vực bãi ven sông Đáy giáp Hoài Đức', aliases: ['phuong cach'] },
  { name: 'Xã Phú Cát (Giáp CNC Hòa Lạc)', district: 'Quốc Oai', ward: 'Phú Cát', lat: 20.9825, lng: 105.5825, category: 'ward_commune', description: 'Khu vực tiếp giáp Khu CNC Hòa Lạc và ĐL Thăng Long', aliases: ['phu cat'] },
  { name: 'Xã Cấn Hữu', district: 'Quốc Oai', ward: 'Cấn Hữu', lat: 20.9555, lng: 105.6315, category: 'ward_commune', description: 'Khu vực sinh thái phía Nam Quốc Oai', aliases: ['can huu'] },
  { name: 'Đại lộ Thăng Long (Km 18 - 25 Quốc Oai)', district: 'Quốc Oai', ward: 'Thị trấn Quốc Oai', lat: 21.0055, lng: 105.6425, category: 'street', description: 'Trục giao thông huyết mạch kết nối nội đô và Hòa Lạc', aliases: ['dai lo thang long quoc oai', 'thang long quoc oai'] },

  // ── 2. HUYỆN THẠCH THẤT ──
  { name: 'Khu công nghệ cao Hòa Lạc', district: 'Thạch Thất', ward: 'Thạch Hòa', lat: 21.0125, lng: 105.5350, category: 'project', description: 'Thung lũng công nghệ cao quốc gia', aliases: ['hoa lac', 'kcnc hoa lac', 'khu cong nghe cao hoa lac'] },
  { name: 'Đại học FPT Hòa Lạc', district: 'Thạch Thất', ward: 'Thạch Hòa', lat: 21.0126, lng: 105.5258, category: 'landmark', description: 'Khuôn viên ĐH FPT và khu R&D phần mềm', aliases: ['fpt hoa lac', 'dai hoc fpt'] },
  { name: 'Hồ Tân Xã', district: 'Thạch Thất', ward: 'Tân Xã', lat: 21.0255, lng: 105.5485, category: 'landmark', description: 'Khu vực đất sinh thái & nghỉ dưỡng ven hồ lớn nhất CNC Hòa Lạc', aliases: ['ho tan xa', 'tan xa'] },
  { name: 'Thị trấn Liên Quan', district: 'Thạch Thất', ward: 'Liên Quan', lat: 21.0550, lng: 105.5850, category: 'town', description: 'Trung tâm hành chính huyện Thạch Thất', aliases: ['lien quan', 'tt lien quan'] },
  { name: 'Xã Bình Yên', district: 'Thạch Thất', ward: 'Bình Yên', lat: 21.0350, lng: 105.5350, category: 'ward_commune', description: 'Khu đất nền phân lô tái định cư & nhà vườn ven Hòa Lạc', aliases: ['binh yen'] },
  { name: 'Xã Tiến Xuân', district: 'Thạch Thất', ward: 'Tiến Xuân', lat: 20.9750, lng: 105.4950, category: 'ward_commune', description: 'Khu nghỉ dưỡng sinh thái giáp ĐHQG Hà Nội', aliases: ['tien xuan'] },
  { name: 'Xã Hữu Bằng (Làng nghề mộc)', district: 'Thạch Thất', ward: 'Hữu Bằng', lat: 21.0385, lng: 105.6125, category: 'ward_commune', description: 'Làng nghề nội thất sầm uất bậc nhất', aliases: ['huu bang'] },

  // ── 3. HUYỆN HOÀI ĐỨC ──
  { name: 'Huyện Hoài Đức (Trung tâm huyện)', district: 'Hoài Đức', ward: 'Thị trấn Trạm Trôi', lat: 21.0200, lng: 105.6950, category: 'district', description: 'Đô thị cửa ngõ phía Tây, quy hoạch lên Quận', aliases: ['hoai duc', 'huyen hoai duc'] },
  { name: 'Thị trấn Trạm Trôi', district: 'Hoài Đức', ward: 'Thị trấn Trạm Trôi', lat: 21.0725, lng: 105.7050, category: 'town', description: 'Trung tâm hành chính huyện Hoài Đức trên QL32', aliases: ['tram troi', 'tt tram troi'] },
  { name: 'KĐT Splendora Bắc An Khánh', district: 'Hoài Đức', ward: 'An Khánh', lat: 21.0165, lng: 105.7255, category: 'project', description: 'Khu đô thị cao cấp liên doanh quốc tế Mailand Hanoi City', aliases: ['splendora', 'bac an khanh', 'mailand'] },
  { name: 'KĐT Nam An Khánh Sudico', district: 'Hoài Đức', ward: 'An Khánh', lat: 21.0065, lng: 105.7185, category: 'project', description: 'Khu đô thị sinh thái biệt thự ven hồ lớn', aliases: ['nam an khanh', 'sudico an khanh', 'an khanh'] },
  { name: 'KĐT Hinode Royal Park (Kim Chung - Di Trạch)', district: 'Hoài Đức', ward: 'Kim Chung', lat: 21.0655, lng: 105.7285, category: 'project', description: 'Đại đô thị 146ha mặt đường QL32 và Vành đai 3.5', aliases: ['hinode', 'kim chung di trach', 'hinode royal park'] },
  { name: 'KĐT Geleximco Lê Trọng Tấn (Khu A)', district: 'Hoài Đức', ward: 'An Khánh', lat: 21.0015, lng: 105.7325, category: 'project', description: 'Khu A Geleximco kết nối thẳng ĐL Thăng Long', aliases: ['geleximco khu a', 'geleximco an khanh'] },
  { name: 'KĐT Vân Canh HUD', district: 'Hoài Đức', ward: 'Vân Canh', lat: 21.0325, lng: 105.7350, category: 'project', description: 'Khu đô thị mặt đường Vành đai 3.5 nối Mỹ Đình', aliases: ['van canh', 'kdt van canh'] },
  { name: 'Xã Di Trạch', district: 'Hoài Đức', ward: 'Di Trạch', lat: 21.0550, lng: 105.7250, category: 'ward_commune', description: 'Khu vực đất đấu giá kế cận Vành đai 3.5', aliases: ['di trach'] },
  { name: 'Xã La Phù', district: 'Hoài Đức', ward: 'La Phù', lat: 20.9855, lng: 105.7285, category: 'ward_commune', description: 'Làng nghề bánh kẹo & dệt may sầm uất', aliases: ['la phu'] },

  // ── 4. QUẬN CẦU GIẤY ──
  { name: 'Phố Duy Tân', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0315, lng: 105.7835, category: 'street', description: 'Thung lũng công nghệ văn phòng sầm uất', aliases: ['duy tan', 'pho duy tan'] },
  { name: 'Đường Xuân Thủy', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0368, lng: 105.7885, category: 'street', description: 'Trục ĐHQGHN song song tuyến Metro Nhổn', aliases: ['xuan thuy'] },
  { name: 'Đường Cầu Giấy', district: 'Cầu Giấy', ward: 'Quan Hoa', lat: 21.0345, lng: 105.7995, category: 'street', description: 'Trục phố mua sắm thương mại đông đúc', aliases: ['cau giay', 'duong cau giay'] },
  { name: 'Phố Trần Thái Tông', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', lat: 21.0322, lng: 105.7891, category: 'street', description: 'Phố dịch vụ nhà hàng ẩm thực & văn phòng', aliases: ['tran thai tong'] },
  { name: 'Phố Trung Kính', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0189, lng: 105.7942, category: 'street', description: 'Trục kết nối Trung Hòa - Cầu Giấy', aliases: ['trung kinh'] },
  { name: 'Đường Trần Duy Hưng', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0084, lng: 105.7972, category: 'street', description: 'Cửa ngõ Tây Nam nối Trung Hòa Nhân Chính', aliases: ['tran duy hung'] },
  { name: 'Đường Hoàng Quốc Việt', district: 'Cầu Giấy', ward: 'Nghĩa Đô', lat: 21.0465, lng: 105.7938, category: 'street', description: 'Trục viện nghiên cứu và trường đại học', aliases: ['hoang quoc viet'] },
  { name: 'KĐT Nam Trung Yên', district: 'Cầu Giấy', ward: 'Trung Hòa', lat: 21.0145, lng: 105.7895, category: 'project', description: 'Khu chung cư & văn phòng sau Keangnam', aliases: ['nam trung yen'] },

  // ── 5. QUẬN NAM TỪ LIÊM ──
  { name: 'KĐT Vinhomes Smart City', district: 'Nam Từ Liêm', ward: 'Tây Mỗ', lat: 20.9998, lng: 105.7441, category: 'project', description: 'Đại đô thị thông minh 280ha lớn nhất miền Bắc', aliases: ['smart city', 'vinhomes smart city', 'tay mo', 'dai mo'] },
  { name: 'Khu Đô Thị Mỹ Đình 1', district: 'Nam Từ Liêm', ward: 'Cầu Diễn', lat: 21.0365, lng: 105.7655, category: 'project', description: 'Trung tâm dân cư & trường học chất lượng cao', aliases: ['my dinh 1', 'kdt my dinh 1'] },
  { name: 'Khu Đô Thị Mỹ Đình 2', district: 'Nam Từ Liêm', ward: 'Mỹ Đình 2', lat: 21.0335, lng: 105.7712, category: 'project', description: 'Khu dân cư mặt đường Lê Đức Thọ', aliases: ['my dinh 2', 'kdt my dinh 2'] },
  { name: 'Phố Mễ Trì (The Matrix One)', district: 'Nam Từ Liêm', ward: 'Mễ Trì', lat: 21.0125, lng: 105.7765, category: 'street', description: 'Khu đô thị căn hộ cao cấp cạnh Keangnam', aliases: ['me tri', 'matrix one'] },
  { name: 'Đường Lê Đức Thọ (SVĐ Mỹ Đình)', district: 'Nam Từ Liêm', ward: 'Mỹ Đình 1', lat: 21.0312, lng: 105.7685, category: 'landmark', description: 'Quần thể Khu liên hợp Thể thao Quốc gia', aliases: ['svd my dinh', 'le duc tho'] },
  { name: 'Phố Đình Thôn (Phố Hàn Quốc)', district: 'Nam Từ Liêm', ward: 'Mỹ Đình 1', lat: 21.0195, lng: 105.7745, category: 'street', description: 'Khu phố chuyên gia Hàn Quốc sầm uất', aliases: ['dinh thon'] },
  { name: 'Keangnam Landmark 72', district: 'Nam Từ Liêm', ward: 'Mễ Trì', lat: 21.0171, lng: 105.7839, category: 'landmark', description: 'Tòa nhà biểu tượng văn phòng hạng A', aliases: ['keangnam', 'landmark 72'] },

  // ── 6. QUẬN HÀ ĐÔNG ──
  { name: 'Khu đô thị Văn Quán', district: 'Hà Đông', ward: 'Văn Quán', lat: 20.9805, lng: 105.7925, category: 'project', description: 'Khu đô thị sinh thái hồ điều hòa Văn Quán', aliases: ['van quan', 'kdt van quan'] },
  { name: 'Khu đô thị Mỗ Lao', district: 'Hà Đông', ward: 'Mộ Lao', lat: 20.9875, lng: 105.7825, category: 'project', description: 'Làng Việt kiều Châu Âu cao cấp', aliases: ['mo lao', 'lang viet kieu chau au'] },
  { name: 'Khu đô thị Dương Nội', district: 'Hà Đông', ward: 'Dương Nội', lat: 20.9855, lng: 105.7550, category: 'project', description: 'Khu đô thị sinh thái Nam Cường ven hồ Thiên Văn Học', aliases: ['duong noi', 'nam cuong'] },
  { name: 'Khu đô thị Geleximco Lê Trọng Tấn (Khu B-C-D)', district: 'Hà Đông', ward: 'Dương Nội', lat: 20.9785, lng: 105.7485, category: 'project', description: 'Quần thể biệt thự liền kề dọc trục Lê Trọng Tấn', aliases: ['geleximco le trong tan', 'geleximco ha dong'] },
  { name: 'Khu đô thị Văn Phú', district: 'Hà Đông', ward: 'Phú La', lat: 20.9625, lng: 105.7685, category: 'project', description: 'Khu đô thị trung tâm hành chính quận Hà Đông', aliases: ['van phu', 'kdt van phu'] },
  { name: 'Khu đô thị ParkCity Hà Nội', district: 'Hà Đông', ward: 'La Khê', lat: 20.9755, lng: 105.7625, category: 'project', description: 'Khu nghỉ dưỡng sinh thái cao cấp phong cách Malaysia', aliases: ['parkcity', 'park city'] },
  { name: 'Phường Vạn Phúc (Làng lụa Vạn Phúc)', district: 'Hà Đông', ward: 'Vạn Phúc', lat: 20.9825, lng: 105.7750, category: 'landmark', description: 'Làng nghề lụa tơ tằm cổ truyền & phố ẩm thực', aliases: ['van phuc', 'lang lua van phuc'] },
  { name: 'Đường Tố Hữu (Lê Văn Lương kéo dài)', district: 'Hà Đông', ward: 'Vạn Phúc', lat: 20.9885, lng: 105.7725, category: 'street', description: 'Trục cao ốc chung cư & thương mại', aliases: ['to huu'] },
  { name: 'Đường Quang Trung - Hà Đông', district: 'Hà Đông', ward: 'Quang Trung', lat: 20.9725, lng: 105.7745, category: 'street', description: 'Trục đường chính dọc tuyến Metro 2A Cát Linh - Hà Đông', aliases: ['quang trung ha dong', 'quang trung'] },

  // ── 7. HUYỆN ĐÔNG ANH ──
  { name: 'Huyện Đông Anh (Trung tâm huyện)', district: 'Đông Anh', ward: 'Thị trấn Đông Anh', lat: 21.1350, lng: 105.8450, category: 'district', description: 'Đô thị bờ Bắc sông Hồng chuẩn bị lên Quận', aliases: ['dong anh', 'huyen dong anh'] },
  { name: 'Thị trấn Đông Anh', district: 'Đông Anh', ward: 'Thị trấn Đông Anh', lat: 21.1395, lng: 105.8485, category: 'town', description: 'Trung tâm thương mại & ga Đông Anh', aliases: ['tt dong anh'] },
  { name: 'Xã Vĩnh Ngọc (Chân Cầu Nhật Tân)', district: 'Đông Anh', ward: 'Vĩnh Ngọc', lat: 21.1125, lng: 105.8285, category: 'ward_commune', description: 'Cửa ngõ kết nối Tây Hồ qua cầu Nhật Tân', aliases: ['vinh ngoc', 'chan cau nhat tan'] },
  { name: 'Xã Xuân Canh (Trung tâm Triển lãm Quốc gia)', district: 'Đông Anh', ward: 'Xuân Canh', lat: 21.1085, lng: 105.8650, category: 'project', description: 'Đại dự án Trung tâm Hội chợ Triển lãm Quốc gia & Vinhomes', aliases: ['xuan canh', 'trien lam quoc gia'] },
  { name: 'Xã Kim Chung (KCN Thăng Long)', district: 'Đông Anh', ward: 'Kim Chung', lat: 21.1215, lng: 105.7950, category: 'ward_commune', description: 'Khu công nghiệp Thăng Long sầm uất', aliases: ['kim chung dong anh'] },
  { name: 'Khu di tích Cổ Loa', district: 'Đông Anh', ward: 'Cổ Loa', lat: 21.1155, lng: 105.8715, category: 'landmark', description: 'Di tích Thành Cổ Loa lịch sử', aliases: ['co loa', 'thanh co loa'] },

  // ── 8. HUYỆN GIA LÂM ──
  { name: 'Vinhomes Ocean Park 1', district: 'Gia Lâm', ward: 'Đa Tốn', lat: 20.9945, lng: 105.9465, category: 'project', description: 'Thành phố Biển Hồ 420ha với biển hồ nước mặn', aliases: ['ocean park', 'vinhomes ocean park', 'bien ho'] },
  { name: 'Thị trấn Trâu Quỳ (Học viện Nông nghiệp)', district: 'Gia Lâm', ward: 'Thị trấn Trâu Quỳ', lat: 21.0085, lng: 105.9325, category: 'town', description: 'Trung tâm hành chính huyện Gia Lâm', aliases: ['trau quy', 'tt trau quy'] },
  { name: 'Làng gốm Bát Tràng', district: 'Gia Lâm', ward: 'Bát Tràng', lat: 20.9755, lng: 105.9125, category: 'landmark', description: 'Làng gốm sứ cổ truyền ven sông Hồng', aliases: ['bat trang', 'lang gom bat trang'] },
  { name: 'Khu đô thị Đặng Xá', district: 'Gia Lâm', ward: 'Đặng Xá', lat: 21.0255, lng: 105.9550, category: 'project', description: 'Khu đô thị kiểu mẫu trên Quốc lộ 5', aliases: ['dang xa', 'kdt dang xa'] },
  { name: 'Chợ Ninh Hiệp', district: 'Gia Lâm', ward: 'Ninh Hiệp', lat: 21.0855, lng: 105.9425, category: 'landmark', description: 'Đầu mối vải và may mặc lớn nhất miền Bắc', aliases: ['ninh hiep', 'cho ninh hiep'] },

  // ── 9. QUẬN THANH XUÂN ──
  { name: 'KĐT Vinhomes Royal City', district: 'Thanh Xuân', ward: 'Thượng Đình', lat: 21.0025, lng: 105.8155, category: 'project', description: 'Thành phố Hoàng Gia 72A Nguyễn Trãi', aliases: ['royal city', 'vinhomes royal city'] },
  { name: 'Phường Nhân Chính (Trung Hòa Nhân Chính)', district: 'Thanh Xuân', ward: 'Nhân Chính', lat: 21.0055, lng: 105.8025, category: 'ward_commune', description: 'Trung tâm văn phòng và căn hộ Lê Văn Lương', aliases: ['nhan chinh', 'trung hoa nhan chinh'] },
  { name: 'Đường Nguyễn Trãi', district: 'Thanh Xuân', ward: 'Thanh Xuân Bắc', lat: 20.9985, lng: 105.8115, category: 'street', description: 'Trục giao thông đường sắt trên cao 2A', aliases: ['nguyen trai'] },
  { name: 'Đường Lê Văn Lương', district: 'Thanh Xuân', ward: 'Nhân Chính', lat: 21.0055, lng: 105.8025, category: 'street', description: 'Trục phố tài chính & chung cư cao cấp', aliases: ['le van luong'] },
  { name: 'Đường Khuất Duy Tiến (Vành đai 3)', district: 'Thanh Xuân', ward: 'Thanh Xuân Bắc', lat: 20.9945, lng: 105.7955, category: 'street', description: 'Trục Vành đai 3 trên cao', aliases: ['khuat duy tien'] },

  // ── 10. QUẬN ĐỐNG ĐA ──
  { name: 'Phố Xã Đàn (Vành đai 1)', district: 'Đống Đa', ward: 'Nam Đồng', lat: 21.0145, lng: 105.8342, category: 'street', description: 'Trục đường Vành đai 1 sầm uất', aliases: ['xa dan'] },
  { name: 'Phố Thái Hà', district: 'Đống Đa', ward: 'Trung Liệt', lat: 21.0135, lng: 105.8198, category: 'street', description: 'Phố công nghệ và thời trang cao cấp', aliases: ['thai ha'] },
  { name: 'Phố Chùa Bộc', district: 'Đống Đa', ward: 'Quang Trung', lat: 21.0078, lng: 105.8288, category: 'street', description: 'Thiên đường mua sắm giới trẻ', aliases: ['chua boc'] },
  { name: 'Đường Láng', district: 'Đống Đa', ward: 'Láng Thượng', lat: 21.0185, lng: 105.8085, category: 'street', description: 'Trục đường ven sông Tô Lịch', aliases: ['duong lang', 'lang'] },
  { name: 'Phố Hào Nam (Ga Metro Cát Linh)', district: 'Đống Đa', ward: 'Ô Chợ Dừa', lat: 21.0258, lng: 105.8285, category: 'landmark', description: 'Ga đầu tuyến Metro 2A Cát Linh', aliases: ['hao nam', 'cat linh'] },

  // ── 11. QUẬN TÂY HỒ ──
  { name: 'Đường Quảng An - Bán Đảo Tây Hồ', district: 'Tây Hồ', ward: 'Quảng An', lat: 21.0625, lng: 105.8312, category: 'street', description: 'Bất động sản biệt thự ven hồ triệu đô', aliases: ['quang an', 'ban dao tay ho'] },
  { name: 'KĐT Ciputra Nam Thăng Long', district: 'Tây Hồ', ward: 'Phú Thượng', lat: 21.0785, lng: 105.7985, category: 'project', description: 'Khu đô thị quốc tế kiểu mẫu lâu đời', aliases: ['ciputra', 'nam thang long'] },
  { name: 'KĐT Starlake Tây Hồ Tây', district: 'Tây Hồ', ward: 'Xuân La', lat: 21.0558, lng: 105.7983, category: 'project', description: 'Đại đô thị mới của các bộ ngành di dời', aliases: ['starlake', 'tay ho tay'] },
  { name: 'Đường Võ Chí Công', district: 'Tây Hồ', ward: 'Xuân La', lat: 21.0665, lng: 105.8025, category: 'street', description: 'Đại lộ 10 làn xe nối Cầu Nhật Tân', aliases: ['vo chi cong'] },
  { name: 'Đường Lạc Long Quân', district: 'Tây Hồ', ward: 'Bưởi', lat: 21.0552, lng: 105.8085, category: 'street', description: 'Trục phía Tây Hồ Tây', aliases: ['lac long quan'] },

  // ── 12. QUẬN LONG BIÊN ──
  { name: 'KĐT Vinhomes Riverside', district: 'Long Biên', ward: 'Phúc Đồng', lat: 21.0505, lng: 105.9085, category: 'project', description: 'Biệt thự sinh thái ven sông đẳng cấp nhất', aliases: ['riverside', 'vinhomes riverside'] },
  { name: 'Đường Cổ Linh (Aeon Mall Long Biên)', district: 'Long Biên', ward: 'Long Biên', lat: 21.0265, lng: 105.8985, category: 'landmark', description: 'Đại siêu thị Aeon Mall & cao tốc', aliases: ['aeon mall long bien', 'co linh'] },
  { name: 'Đường Nguyễn Văn Cừ', district: 'Long Biên', ward: 'Bồ Đề', lat: 21.0415, lng: 105.8725, category: 'street', description: 'Trục nối qua Cầu Chương Dương', aliases: ['nguyen van cu'] },
  { name: 'KĐT Việt Hưng', district: 'Long Biên', ward: 'Việt Hưng', lat: 21.0655, lng: 105.9050, category: 'project', description: 'KĐT kiểu mẫu trung tâm hành chính quận', aliases: ['viet hung', 'kdt viet hung'] },

  // ── 13. QUẬN HOÀNG MAI ──
  { name: 'KĐT Bán đảo Linh Đàm', district: 'Hoàng Mai', ward: 'Hoàng Liệt', lat: 20.9655, lng: 105.8285, category: 'project', description: 'Bán đảo sinh thái mặt nước hồ Linh Đàm', aliases: ['linh dam', 'ban dao linh dam'] },
  { name: 'KĐT Gamuda Gardens', district: 'Hoàng Mai', ward: 'Yên Sở', lat: 20.9702, lng: 105.8643, category: 'project', description: 'KĐT sinh thái xanh cạnh công viên Yên Sở', aliases: ['gamuda', 'gamuda gardens'] },
  { name: 'Đường Giải Phóng', district: 'Hoàng Mai', ward: 'Giáp Bát', lat: 20.9855, lng: 105.8415, category: 'street', description: 'Cửa ngõ phía Nam Thủ đô', aliases: ['giai phong'] },

  // ── 14. QUẬN BA ĐÌNH & HOÀN KIẾM ──
  { name: 'Hồ Hoàn Kiếm (Hồ Gươm)', district: 'Hoàn Kiếm', ward: 'Hàng Trống', lat: 21.0285, lng: 105.8542, category: 'landmark', description: 'Trái tim ngàn năm văn hiến Thủ đô', aliases: ['ho guom', 'ho hoan kiem'] },
  { name: 'Khu Phố Cổ Hà Nội', district: 'Hoàn Kiếm', ward: 'Hàng Bạc', lat: 21.0345, lng: 105.8505, category: 'landmark', description: '36 phố phường di sản lịch sử', aliases: ['pho co', '36 pho phuong'] },
  { name: 'Đường Kim Mã', district: 'Ba Đình', ward: 'Kim Mã', lat: 21.0312, lng: 105.8185, category: 'street', description: 'Trục Ba Đình - Cầu Giấy', aliases: ['kim ma'] },
  { name: 'Phố Liễu Giai (Vinhomes Metropolis)', district: 'Ba Đình', ward: 'Liễu Giai', lat: 21.0345, lng: 105.8142, category: 'project', description: 'Phố ngoại giao & căn hộ hạng sang', aliases: ['lieu giai', 'metropolis'] },

  // ── 15. CÁC HUYỆN NGOẠI THÀNH KHÁC ──
  { name: 'Thị xã Sơn Tây (Thành cổ Sơn Tây)', district: 'Sơn Tây', ward: 'Quang Trung', lat: 21.1395, lng: 105.5035, category: 'town', description: 'Đô thị cổ vệ tinh phía Tây Bắc', aliases: ['son tay', 'thanh co son tay'] },
  { name: 'Huyện Ba Vì (Vườn Quốc Gia Ba Vì)', district: 'Ba Vì', ward: 'Tản Lĩnh', lat: 21.0855, lng: 105.3650, category: 'landmark', description: 'Quần thể du lịch sinh thái nghỉ dưỡng núi Ba Vì', aliases: ['ba vi', 'vườn quốc gia ba vì'] },
  { name: 'Thị trấn Phùng (Huyện Đan Phượng)', district: 'Đan Phượng', ward: 'TT Phùng', lat: 21.0955, lng: 105.6725, category: 'town', description: 'Trung tâm huyện Đan Phượng trên QL32', aliases: ['phung', 'tt phung', 'dan phuong'] },
  { name: 'KĐT Vinhomes Wonder Park Đan Phượng', district: 'Đan Phượng', ward: 'Tân Hội', lat: 21.0985, lng: 105.6985, category: 'project', description: 'Đại dự án sinh thái 133ha Tân Hội - Liên Trung', aliases: ['wonder park', 'vinhomes dan phuong', 'tan hoi'] },
  { name: 'KĐT Thanh Hà Cienco 5', district: 'Thanh Oai', ward: 'Cự Khê', lat: 20.9455, lng: 105.7950, category: 'project', description: 'Đại đô thị sinh thái 400ha cửa ngõ phía Nam', aliases: ['thanh ha', 'thanh ha cienco 5', 'cu khe'] },
  { name: 'Thị trấn Chúc Sơn (Huyện Chương Mỹ)', district: 'Chương Mỹ', ward: 'Chúc Sơn', lat: 20.9255, lng: 105.7050, category: 'town', description: 'Trung tâm huyện Chương Mỹ trên QL6', aliases: ['chuc son', 'chuong my'] },
  { name: 'Thị trấn Sóc Sơn', district: 'Sóc Sơn', ward: 'TT Sóc Sơn', lat: 21.2685, lng: 105.8485, category: 'town', description: 'Trung tâm huyện Sóc Sơn gần Sân bay Nội Bài', aliases: ['soc son', 'tt soc son'] },
  { name: 'KĐT Mê Linh (Cienco 5 Mê Linh)', district: 'Mê Linh', ward: 'Tiền Phong', lat: 21.1685, lng: 105.7350, category: 'project', description: 'Khu đô thị sinh thái Bắc sông Hồng', aliases: ['me linh', 'cienco 5 me linh'] },
  { name: 'Thị trấn Văn Điển (Thanh Trì)', district: 'Thanh Trì', ward: 'TT Văn Điển', lat: 20.9525, lng: 105.8450, category: 'town', description: 'Trung tâm huyện Thanh Trì trên QL1A', aliases: ['van dien', 'thanh tri'] },
  { name: 'Thị trấn Thường Tín', district: 'Thường Tín', ward: 'TT Thường Tín', lat: 20.8685, lng: 105.8685, category: 'town', description: 'Trung tâm huyện làng nghề Thường Tín', aliases: ['thuong tin'] },
  { name: 'Thị trấn Vân Đình (Ứng Hòa)', district: 'Ứng Hòa', ward: 'TT Vân Đình', lat: 20.7285, lng: 105.7685, category: 'town', description: 'Trung tâm thương mại ẩm thực huyện Ứng Hòa', aliases: ['van dinh', 'ung hoa'] },
  { name: 'Khu danh thắng Chùa Hương (Mỹ Đức)', district: 'Mỹ Đức', ward: 'Hương Sơn', lat: 20.6185, lng: 105.7525, category: 'landmark', description: 'Quần thể danh thắng tâm linh Chùa Hương', aliases: ['chua huong', 'my duc'] },
];

/**
 * Chuẩn hóa chuỗi tìm kiếm không dấu
 */
export function normalizeQuery(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * Xóa các từ phụ BĐS để trích xuất địa danh cốt lõi
 * Ví dụ: "bán đất quốc oai" -> "quoc oai"
 */
export function extractCoreLocationQuery(query: string): string {
  let cleaned = normalizeQuery(query);
  const stopWords = [
    'ban dat tai',
    'ban dat o',
    'ban dat',
    'mua dat',
    'lo dat',
    'khu dat',
    'thua dat',
    'bat dong san',
    'nha dat',
    'can ban',
    'tim dat',
    'vi tri',
    'lo',
    'dat',
    'nha',
    'bds',
    'khu',
    'tai',
    'gan',
  ];

  for (const sw of stopWords) {
    const regex = new RegExp(`\\b${sw}\\b`, 'g');
    cleaned = cleaned.replace(regex, ' ');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

export interface SmartSearchResult {
  directMatches: HanoiStreetInfo[];
  similarMatches: HanoiStreetInfo[];
  detectedDistrict?: string;
  suggestedChips: HanoiStreetInfo[];
}

/**
 * Tìm kiếm thông minh địa chỉ tại Hà Nội kết hợp đề xuất khu vực tương tự / lân cận
 */
export function searchHanoiLocationsSmart(rawQuery: string): SmartSearchResult {
  if (!rawQuery || rawQuery.trim().length < 2) {
    // Trả về top địa điểm phổ biến
    const defaultChips = POPULAR_HANOI_LOCATIONS.slice(0, 8);
    return {
      directMatches: defaultChips,
      similarMatches: [],
      suggestedChips: defaultChips,
    };
  }

  const cleanQ = normalizeQuery(rawQuery);
  const coreQ = extractCoreLocationQuery(rawQuery) || cleanQ;
  const terms = coreQ.split(/\s+/).filter(Boolean);

  // 1. Nhận diện xem người dùng có đang tìm theo Quận/Huyện cụ thể không
  let detectedDistrictName: string | undefined;
  for (const [distName, config] of Object.entries(HANOI_ALL_DISTRICTS_CONFIG)) {
    const distNorm = normalizeQuery(distName);
    const matchesAlias = config.aliases.some((al) => {
      const normAl = normalizeQuery(al);
      return cleanQ.includes(normAl) || coreQ.includes(normAl);
    });

    if (distNorm.includes(coreQ) || coreQ.includes(distNorm) || matchesAlias) {
      detectedDistrictName = distName;
      break;
    }
  }

  // 2. Tìm các kết quả phù hợp trực tiếp (Direct Matches)
  const directMatches: HanoiStreetInfo[] = [];
  for (const item of POPULAR_HANOI_LOCATIONS) {
    const itemNameNorm = normalizeQuery(item.name);
    const itemDistNorm = normalizeQuery(item.district);
    const itemWardNorm = item.ward ? normalizeQuery(item.ward) : '';
    const aliasesNorm = (item.aliases || []).map(normalizeQuery).join(' ');
    const fullTarget = `${itemNameNorm} ${itemDistNorm} ${itemWardNorm} ${aliasesNorm}`;

    let isMatch = false;

    // Nếu đã nhận diện được quận và item thuộc quận đó
    if (detectedDistrictName && item.district.toLowerCase() === detectedDistrictName.toLowerCase()) {
      isMatch = true;
    } else if (terms.every((term) => fullTarget.includes(term))) {
      isMatch = true;
    } else if (coreQ.length >= 3 && fullTarget.includes(coreQ)) {
      isMatch = true;
    }

    if (isMatch) {
      directMatches.push({
        ...item,
        badge: item.category === 'project' ? 'Dự án' : item.category === 'town' ? 'Thị trấn' : item.category === 'district' ? 'Quận/Huyện' : undefined,
      });
    }
  }

  // Nếu tìm theo quận mà chưa nhận diện được trực tiếp thì lấy từ item đầu tiên
  if (!detectedDistrictName && directMatches.length > 0) {
    detectedDistrictName = directMatches[0].district;
  }

  // 3. Đề xuất các khu vực tương tự & lân cận (Similar & Neighboring Matches)
  const similarMatches: HanoiStreetInfo[] = [];

  if (detectedDistrictName && HANOI_ALL_DISTRICTS_CONFIG[detectedDistrictName]) {
    const distConfig = HANOI_ALL_DISTRICTS_CONFIG[detectedDistrictName];
    for (const relation of distConfig.similarDistricts) {
      // Thêm các khu vực tiêu biểu của quận lân cận
      for (const area of relation.keyAreas) {
        similarMatches.push({
          name: area.name,
          district: relation.district,
          ward: area.ward || '',
          lat: area.lat,
          lng: area.lng,
          category: 'project',
          description: area.desc || `Khu vực lân cận giáp ranh ${detectedDistrictName}`,
          isSimilar: true,
          similarReason: relation.reason,
          badge: `Lân cận ${relation.district}`,
        });
      }
    }
  }

  // Loại trùng giữa direct và similar
  const filteredSimilar = similarMatches.filter((sim) => {
    return !directMatches.some((dm) => dm.name.toLowerCase() === sim.name.toLowerCase() || (Math.abs(dm.lat - sim.lat) < 0.003 && Math.abs(dm.lng - sim.lng) < 0.003));
  });

  // 4. Tạo thanh Chips gợi ý nhanh (kết hợp các vị trí hot nhất của khu vực đang tìm + 2-3 vị trí lân cận)
  const suggestedChips: HanoiStreetInfo[] = [
    ...directMatches.slice(0, 5),
    ...filteredSimilar.slice(0, 4),
  ];

  return {
    directMatches: directMatches.slice(0, 10),
    similarMatches: filteredSimilar.slice(0, 8),
    detectedDistrict: detectedDistrictName,
    suggestedChips: suggestedChips.slice(0, 8),
  };
}

/**
 * Giữ hàm tương thích ngược cho các module cũ
 */
export function searchHanoiAddressOffline(query: string) {
  const result = searchHanoiLocationsSmart(query);
  const combined = [...result.directMatches, ...result.similarMatches];
  return combined.map((item) => ({
    lat: item.lat,
    lng: item.lng,
    displayName: `${item.name}, ${item.ward ? item.ward + ', ' : ''}${item.district.includes('Thị xã') || item.district.includes('Quận') || item.district.includes('Huyện') ? item.district : 'Quận ' + item.district}, Hà Nội`,
    shortName: item.name,
    district: item.district,
    ward: item.ward || '',
    road: item.name,
    houseNumber: '',
    category: item.category,
    isSimilar: item.isSimilar,
    similarReason: item.similarReason,
  }));
}
