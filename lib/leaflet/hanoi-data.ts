// Hardcoded data for Hanoi landmarks, universities, hospitals

export const HANOI_CENTER: [number, number] = [21.0285, 105.8542]

export const HANOI_UNIVERSITIES: Array<{
  name: string
  shortName: string
  lat: number
  lng: number
  type: 'university'
}> = [
  { name: 'Đại học Quốc gia Hà Nội', shortName: 'ĐHQGHN', lat: 21.0380, lng: 105.7834, type: 'university' },
  { name: 'Đại học Bách Khoa Hà Nội', shortName: 'ĐHBK HN', lat: 21.0044, lng: 105.8431, type: 'university' },
  { name: 'Đại học Kinh tế Quốc dân', shortName: 'ĐH KTQD', lat: 21.0163, lng: 105.8427, type: 'university' },
  { name: 'Đại học Sư phạm Hà Nội', shortName: 'ĐHSP HN', lat: 21.0400, lng: 105.8335, type: 'university' },
  { name: 'Đại học Khoa học TN Hà Nội', shortName: 'KHTN HN', lat: 21.0478, lng: 105.8126, type: 'university' },
  { name: 'Đại học Luật Hà Nội', shortName: 'ĐH Luật', lat: 21.0204, lng: 105.8399, type: 'university' },
  { name: 'Học viện Ngân hàng', shortName: 'HV Ngân hàng', lat: 21.0267, lng: 105.8052, type: 'university' },
  { name: 'Đại học FPT Hà Nội', shortName: 'FPT HN', lat: 21.0126, lng: 105.5258, type: 'university' },
  { name: 'Đại học Thương Mại', shortName: 'ĐH Thương Mại', lat: 21.0395, lng: 105.7927, type: 'university' },
  { name: 'Học viện Kỹ thuật Quân sự', shortName: 'HVKTQS', lat: 21.0128, lng: 105.8399, type: 'university' },
]

export const HANOI_HOSPITALS: Array<{
  name: string
  shortName: string
  lat: number
  lng: number
  type: 'hospital'
}> = [
  { name: 'Bệnh viện Bạch Mai', shortName: 'BV Bạch Mai', lat: 21.0046, lng: 105.8450, type: 'hospital' },
  { name: 'Bệnh viện Việt Đức', shortName: 'BV Việt Đức', lat: 21.0299, lng: 105.8451, type: 'hospital' },
  { name: 'Bệnh viện K', shortName: 'BV K', lat: 21.0361, lng: 105.8394, type: 'hospital' },
  { name: 'Bệnh viện 108', shortName: 'BV 108', lat: 21.0226, lng: 105.8448, type: 'hospital' },
  { name: 'Bệnh viện Nhi Trung ương', shortName: 'BV Nhi TW', lat: 21.0301, lng: 105.8303, type: 'hospital' },
]

// Planning zones GeoJSON-style polygons (mock data for Hanoi districts)
export const HANOI_PLANNING_ZONES = [
  {
    id: 'dongda-residential',
    name: 'Đất ở đô thị - Đống Đa',
    type: 'residential' as const,
    district: 'Đống Đa',
    planYear: 2030,
    color: '#22c55e',
    fillOpacity: 0.25,
    status: 'Cho phép xây dựng',
    floorAreaRatio: 3.5,
    maxHeight: '21m (7 tầng)',
    coordinates: [
      [21.0225, 105.8350],
      [21.0320, 105.8430],
      [21.0290, 105.8510],
      [21.0210, 105.8470],
      [21.0190, 105.8390],
    ] as [number, number][],
  },
  {
    id: 'hoankiem-commercial',
    name: 'Đất thương mại - Hoàn Kiếm',
    type: 'commercial' as const,
    district: 'Hoàn Kiếm',
    planYear: 2030,
    color: '#ef4444',
    fillOpacity: 0.25,
    status: 'Thương mại dịch vụ',
    floorAreaRatio: 5.0,
    maxHeight: '45m (15 tầng)',
    coordinates: [
      [21.0340, 105.8520],
      [21.0400, 105.8580],
      [21.0360, 105.8640],
      [21.0290, 105.8590],
      [21.0300, 105.8520],
    ] as [number, number][],
  },
  {
    id: 'caugiay-mixed',
    name: 'Đất hỗn hợp - Cầu Giấy',
    type: 'mixed' as const,
    district: 'Cầu Giấy',
    planYear: 2030,
    color: '#8b5cf6',
    fillOpacity: 0.25,
    status: 'Đất hỗn hợp',
    floorAreaRatio: 4.0,
    maxHeight: '30m (10 tầng)',
    coordinates: [
      [21.0350, 105.7900],
      [21.0450, 105.8000],
      [21.0420, 105.8100],
      [21.0300, 105.8050],
    ] as [number, number][],
  },
  {
    id: 'tayho-green',
    name: 'Đất mặt nước - Tây Hồ',
    type: 'green' as const,
    district: 'Tây Hồ',
    planYear: 2030,
    color: '#3b82f6',
    fillOpacity: 0.3,
    status: 'Bảo tồn mặt nước',
    floorAreaRatio: 0,
    maxHeight: 'Không cho xây',
    coordinates: [
      [21.0500, 105.8100],
      [21.0620, 105.8300],
      [21.0580, 105.8450],
      [21.0430, 105.8280],
      [21.0430, 105.8120],
    ] as [number, number][],
  },
  {
    id: 'metro-corridor',
    name: 'Hành lang Metro - Tuyến 2',
    type: 'transport' as const,
    district: 'Nhiều quận',
    planYear: 2030,
    color: '#f59e0b',
    fillOpacity: 0.3,
    status: 'Hành lang giao thông',
    floorAreaRatio: 0,
    maxHeight: 'Hành lang kỹ thuật',
    coordinates: [
      [21.0170, 105.8360],
      [21.0180, 105.8420],
      [21.0400, 105.8590],
      [21.0390, 105.8530],
    ] as [number, number][],
  },
  {
    id: 'namtuliem-new',
    name: 'Đất ở mới - Nam Từ Liêm',
    type: 'residential' as const,
    district: 'Nam Từ Liêm',
    planYear: 2030,
    color: '#22c55e',
    fillOpacity: 0.25,
    status: 'Cho phép xây dựng',
    floorAreaRatio: 2.5,
    maxHeight: '18m (6 tầng)',
    coordinates: [
      [20.9850, 105.7800],
      [20.9950, 105.8000],
      [20.9900, 105.8200],
      [20.9750, 105.8050],
    ] as [number, number][],
  },
]

export const HANOI_METRO_STATIONS = [
  { name: 'Ga Nhổn', lat: 21.0451, lng: 105.7614, line: 'Line 3' },
  { name: 'Ga Cầu Giấy', lat: 21.0330, lng: 105.7968, line: 'Line 3' },
  { name: 'Ga Kim Mã', lat: 21.0312, lng: 105.8136, line: 'Line 3' },
  { name: 'Ga Cát Linh', lat: 21.0280, lng: 105.8383, line: 'Line 2A' },
  { name: 'Ga Văn Miếu', lat: 21.0277, lng: 105.8350, line: 'Line 2A' },
  { name: 'Ga La Khê', lat: 20.9812, lng: 105.7818, line: 'Line 2A' },
]

export const PLANNING_ZONE_TYPES = {
  residential: { label: 'Đất ở đô thị', color: '#22c55e' },
  commercial:  { label: 'Thương mại dịch vụ', color: '#ef4444' },
  transport:   { label: 'Giao thông', color: '#f59e0b' },
  green:       { label: 'Mặt nước / Cây xanh', color: '#3b82f6' },
  public:      { label: 'Công trình công cộng', color: '#6366f1' },
  industrial:  { label: 'Công nghiệp', color: '#6b7280' },
  mixed:       { label: 'Đất hỗn hợp', color: '#8b5cf6' },
}

export const HANOI_DISTRICT_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Đống Đa': { lat: 21.0185, lng: 105.8300, zoom: 14.5 },
  'Hoàn Kiếm': { lat: 21.0310, lng: 105.8525, zoom: 15 },
  'Cầu Giấy': { lat: 21.0360, lng: 105.7905, zoom: 14.5 },
  'Tây Hồ': { lat: 21.0650, lng: 105.8230, zoom: 14 },
  'Long Biên': { lat: 21.0420, lng: 105.8900, zoom: 13.5 },
  'Nam Từ Liêm': { lat: 21.0020, lng: 105.7600, zoom: 14 },
  'Bắc Từ Liêm': { lat: 21.0600, lng: 105.7600, zoom: 13.5 },
  'Ba Đình': { lat: 21.0340, lng: 105.8250, zoom: 14.5 },
  'Thanh Xuân': { lat: 20.9950, lng: 105.8080, zoom: 14.5 },
  'Hai Bà Trưng': { lat: 21.0080, lng: 105.8550, zoom: 14.5 },
  'Hà Đông': { lat: 20.9700, lng: 105.7750, zoom: 13.5 },
  'Hoàng Mai': { lat: 20.9750, lng: 105.8500, zoom: 13.5 },
  'Gia Lâm': { lat: 21.0100, lng: 105.9300, zoom: 13 },
  'Đông Anh': { lat: 21.1350, lng: 105.8450, zoom: 12.5 },
  'Hoài Đức': { lat: 21.0200, lng: 105.6950, zoom: 12.5 },
  'Thanh Trì': { lat: 20.9400, lng: 105.8500, zoom: 12.5 },
}

