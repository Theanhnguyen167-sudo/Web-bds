/**
 * Tiện ích xử lý dữ liệu quy hoạch GIS & GeoJSON cho Hà Nội
 */

export interface PlanningZoneItem {
  id: string;
  code: string;
  name: string;
  district: string;
  color: string;
  areaHa: number;
  maxFloors: number;
  density: string;
  status: 'published' | 'draft';
  type: 'residential' | 'commercial' | 'mixed' | 'green' | 'transport' | 'industrial' | 'public';
  planYear: number;
  coordinates: [number, number][]; // [lat, lng] array cho Leaflet
  sourceFile?: string;
  floorAreaRatio?: number;
  maxHeight?: string;
}

export const DEFAULT_PLANNING_ZONES: PlanningZoneItem[] = [
  {
    id: 'z1',
    code: 'ODT',
    name: 'Đất ở đô thị hiện hữu cải tạo',
    district: 'Đống Đa',
    color: '#ffdd29',
    areaHa: 450,
    maxFloors: 5,
    density: '70%',
    status: 'published',
    type: 'residential',
    planYear: 2030,
    floorAreaRatio: 3.5,
    maxHeight: '21m (5 tầng)',
    coordinates: [
      [21.0225, 105.8350],
      [21.0320, 105.8430],
      [21.0290, 105.8510],
      [21.0210, 105.8470],
      [21.0190, 105.8390],
    ],
  },
  {
    id: 'z2',
    code: 'TMD',
    name: 'Đất thương mại & Dịch vụ tổng hợp',
    district: 'Cầu Giấy',
    color: '#ef4444',
    areaHa: 280,
    maxFloors: 25,
    density: '60%',
    status: 'published',
    type: 'commercial',
    planYear: 2030,
    floorAreaRatio: 5.0,
    maxHeight: '45m (25 tầng)',
    coordinates: [
      [21.0340, 105.7850],
      [21.0420, 105.7950],
      [21.0380, 105.8050],
      [21.0300, 105.7980],
      [21.0310, 105.7880],
    ],
  },
  {
    id: 'z3',
    code: 'GT',
    name: 'Hành lang Giao thông & Tuyến Metro số 2',
    district: 'Tây Hồ - Hoàn Kiếm',
    color: '#3b82f6',
    areaHa: 120,
    maxFloors: 0,
    density: '15%',
    status: 'published',
    type: 'transport',
    planYear: 2030,
    floorAreaRatio: 0,
    maxHeight: 'Không áp dụng',
    coordinates: [
      [21.0170, 105.8360],
      [21.0180, 105.8420],
      [21.0400, 105.8590],
      [21.0390, 105.8530],
    ],
  },
  {
    id: 'z4',
    code: 'CCC',
    name: 'Đất công viên cây xanh & Thể dục thể thao',
    district: 'Tây Hồ',
    color: '#22c55e',
    areaHa: 520,
    maxFloors: 2,
    density: '5%',
    status: 'published',
    type: 'green',
    planYear: 2030,
    floorAreaRatio: 0.5,
    maxHeight: '2 tầng',
    coordinates: [
      [21.0500, 105.8100],
      [21.0620, 105.8300],
      [21.0580, 105.8450],
      [21.0430, 105.8280],
      [21.0430, 105.8120],
    ],
  },
  {
    id: 'z5',
    code: 'HH',
    name: 'Đất hỗn hợp & Đô thị mới Cầu Giấy (H2-2)',
    district: 'Cầu Giấy',
    color: '#8b5cf6',
    areaHa: 340,
    maxFloors: 15,
    density: '55%',
    status: 'published',
    type: 'mixed',
    planYear: 2030,
    floorAreaRatio: 4.0,
    maxHeight: '15 tầng',
    coordinates: [
      [21.0300, 105.7800],
      [21.0300, 105.7950],
      [21.0400, 105.7950],
      [21.0400, 105.7800],
      [21.0300, 105.7800],
    ],
  },
];

/**
 * Chuẩn hóa toạ độ WGS84 về định dạng Leaflet [lat, lng].
 * Ở Việt Nam / Hà Nội: Vĩ độ (lat) khoảng 20-22, Kinh độ (lng) khoảng 105-106.
 */
export function normalizeLatLng(coord: [number, number] | number[]): [number, number] {
  if (!Array.isArray(coord) || coord.length < 2) {
    return [21.0285, 105.8542];
  }
  const [x, y] = coord;
  // Nếu số đầu > 50 (kinh độ 105-106) và số sau < 50 (vĩ độ 20-22) -> là [lng, lat] GeoJSON -> đổi thành [lat, lng]
  if (x > 50 && y < 50) {
    return [Number(y), Number(x)];
  }
  return [Number(x), Number(y)];
}

/**
 * Tự động tính diện tích đa giác quy hoạch theo đơn vị Hécta (ha)
 * Áp dụng công thức Shoelace phẳng với tỉ lệ mét tại vĩ độ 21° Hà Nội
 */
export function calculatePolygonAreaHa(coords: [number, number][]): number {
  if (!coords || coords.length < 3) return 50;
  const LAT_METERS = 111139;
  const LNG_METERS = 103750;

  let area = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const x1 = coords[i][1] * LNG_METERS;
    const y1 = coords[i][0] * LAT_METERS;
    const x2 = coords[j][1] * LNG_METERS;
    const y2 = coords[j][0] * LAT_METERS;
    area += x1 * y2 - x2 * y1;
  }
  const sqMeters = Math.abs(area) / 2;
  const ha = Math.round((sqMeters / 10000) * 10) / 10;
  return ha > 0 && ha < 100000 ? ha : 150;
}

export interface ParsedZoneFeature {
  name: string;
  code: string;
  district: string;
  color: string;
  areaHa: number;
  maxFloors: number;
  density: string;
  status: 'published' | 'draft';
  type: 'residential' | 'commercial' | 'mixed' | 'green' | 'transport' | 'industrial' | 'public';
  planYear: number;
  coordinates: [number, number][];
}

/**
 * Phân tích nội dung file GeoJSON hoặc KML bản đồ quy hoạch
 */
export function parsePlanningMapFile(content: string, filename?: string): ParsedZoneFeature[] {
  const trimmed = content.trim();

  // 1. Nếu là định dạng KML
  if (trimmed.startsWith('<?xml') || trimmed.includes('<kml') || trimmed.includes('<Placemark')) {
    return parseKMLString(trimmed, filename);
  }

  // 2. Định dạng JSON / GeoJSON
  try {
    const json = JSON.parse(trimmed);
    const results: ParsedZoneFeature[] = [];

    let features: any[] = [];
    if (json.type === 'FeatureCollection' && Array.isArray(json.features)) {
      features = json.features;
    } else if (json.type === 'Feature') {
      features = [json];
    } else if (json.type === 'Polygon' || json.type === 'MultiPolygon') {
      features = [{ type: 'Feature', geometry: json, properties: {} }];
    } else if (Array.isArray(json)) {
      features = json;
    }

    for (let i = 0; i < features.length; i++) {
      const f = features[i];
      const props = f.properties || f.props || {};
      const geom = f.geometry || (f.coordinates ? f : null);

      if (!geom) continue;

      let rawCoords: number[][] = [];
      if (geom.type === 'Polygon' && Array.isArray(geom.coordinates)) {
        rawCoords = geom.coordinates[0]; // Vòng ranh giới ngoài
      } else if (geom.type === 'MultiPolygon' && Array.isArray(geom.coordinates)) {
        rawCoords = geom.coordinates[0]?.[0] || [];
      } else if (Array.isArray(geom.coordinates)) {
        rawCoords = geom.coordinates;
      }

      if (!rawCoords || rawCoords.length < 3) continue;

      const normalizedCoords = rawCoords.map((c) => normalizeLatLng(c as [number, number]));

      // Tự động nhận diện loại đất & màu sắc
      const rawType = (props.zone_type || props.type || props.loai_dat || 'residential').toLowerCase();
      let type: ParsedZoneFeature['type'] = 'residential';
      if (rawType.includes('com') || rawType.includes('thuong_mai') || rawType.includes('dich_vu')) type = 'commercial';
      else if (rawType.includes('green') || rawType.includes('cay_xanh') || rawType.includes('mat_nuoc')) type = 'green';
      else if (rawType.includes('trans') || rawType.includes('giao_thong') || rawType.includes('metro')) type = 'transport';
      else if (rawType.includes('mix') || rawType.includes('hon_hop')) type = 'mixed';
      else if (rawType.includes('ind') || rawType.includes('cong_nghiep')) type = 'industrial';
      else if (rawType.includes('pub') || rawType.includes('cong_cong')) type = 'public';

      const defaultColors: Record<string, string> = {
        residential: '#ffdd29',
        commercial: '#ef4444',
        mixed: '#8b5cf6',
        green: '#22c55e',
        transport: '#3b82f6',
        industrial: '#f59e0b',
        public: '#6366f1',
      };

      const color = props.color || props.color_code || props.fillColor || defaultColors[type];
      const district = props.district || props.quan || props.huyen || 'Cầu Giấy';
      const name =
        props.name ||
        props.ten ||
        props.title ||
        (filename ? `${filename.replace(/\.[^/.]+$/, '')} #${i + 1}` : `Phân khu quy hoạch #${i + 1}`);

      const typePrefix = {
        residential: 'ODT',
        commercial: 'TMD',
        mixed: 'HH',
        green: 'CCC',
        transport: 'GT',
        industrial: 'CN',
        public: 'CC',
      }[type] || 'QH';

      const code = (props.code || props.ma || `${typePrefix}-${i + 1}`).toUpperCase();
      const areaHa = props.areaHa || props.dien_tich || calculatePolygonAreaHa(normalizedCoords);
      const maxFloors =
        props.maxFloors ||
        props.tang_cao ||
        (type === 'commercial' ? 25 : type === 'residential' ? 5 : type === 'mixed' ? 15 : 0);
      const density =
        props.density ||
        props.mat_do ||
        (type === 'residential' ? '70%' : type === 'commercial' ? '60%' : type === 'mixed' ? '55%' : '15%');

      results.push({
        name,
        code,
        district,
        color,
        areaHa: Number(areaHa),
        maxFloors: Number(maxFloors),
        density: String(density),
        status: 'published',
        type,
        planYear: Number(props.plan_year || props.planYear || 2030),
        coordinates: normalizedCoords,
      });
    }

    return results;
  } catch (err) {
    console.error('Error parsing planning map JSON', err);
    return [];
  }
}

function parseKMLString(kmlString: string, filename?: string): ParsedZoneFeature[] {
  const coordMatches = kmlString.matchAll(/<coordinates>([\s\S]*?)<\/coordinates>/gi);
  const results: ParsedZoneFeature[] = [];
  let index = 1;

  for (const match of coordMatches) {
    const rawText = match[1].trim();
    const rawPairs = rawText.split(/\s+/);
    const coords: [number, number][] = [];

    for (const pair of rawPairs) {
      const parts = pair.split(',');
      if (parts.length >= 2) {
        const lng = parseFloat(parts[0]);
        const lat = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords.push(normalizeLatLng([lat, lng]));
        }
      }
    }

    if (coords.length >= 3) {
      results.push({
        name: filename ? `${filename.replace(/\.[^/.]+$/, '')} #${index}` : `Phân khu quy hoạch KML #${index}`,
        code: `KML-${index}`,
        district: 'Hà Nội',
        color: '#f97316',
        areaHa: calculatePolygonAreaHa(coords),
        maxFloors: 10,
        density: '60%',
        status: 'published',
        type: 'mixed',
        planYear: 2030,
        coordinates: coords,
      });
      index++;
    }
  }

  return results;
}

/**
 * File mẫu GeoJSON Hà Nội để người dùng thử nghiệm nhanh 1 click
 */
export const SAMPLE_HANOI_GEOJSON = JSON.stringify(
  {
    type: 'FeatureCollection',
    name: 'Quy_Hoach_Phan_Khu_Ha_Noi_2030',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Phân khu Đô thị sinh thái ven Sông Hồng (R-1)',
          code: 'ST-SH',
          district: 'Tây Hồ - Ba Đình',
          zone_type: 'green',
          color: '#10b981',
          plan_year: 2030,
          max_floors: 3,
          density: '15%',
          areaHa: 680,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [105.8250, 21.0550],
              [105.8450, 21.0620],
              [105.8600, 21.0500],
              [105.8500, 21.0400],
              [105.8300, 21.0450],
              [105.8250, 21.0550],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          name: 'Khu công nghệ cao & Đổi mới sáng tạo Duy Tân (H2-1)',
          code: 'CNC-DT',
          district: 'Cầu Giấy',
          zone_type: 'commercial',
          color: '#f97316',
          plan_year: 2030,
          max_floors: 30,
          density: '50%',
          areaHa: 220,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [105.7750, 21.0250],
              [105.7900, 21.0250],
              [105.7900, 21.0350],
              [105.7750, 21.0350],
              [105.7750, 21.0250],
            ],
          ],
        },
      },
    ],
  },
  null,
  2
);
