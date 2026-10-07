import { wgs84ToVn2000, formatWGS84, calculateDistanceMeters, VN2000Coordinate, WGS84Coordinate } from './vn2000';
import { PlanningZoneItem } from '@/lib/planning/planning-utils';
import { 
  PLANNING_STANDARD_SYMBOLS, 
  HANOI_DISTRICTS_PLANNING_PROFILES,
  HANOI_SUBDIVISION_GROUPS 
} from '@/lib/planning/hanoi-planning-db';
import { HANOI_DISTRICT_CENTERS } from '@/lib/leaflet/hanoi-data';

export interface PlanningInspectionResult {
  inspectionId: string;
  timestamp: string;
  point: [number, number]; // [lat, lng]
  wgs84: WGS84Coordinate;
  vn2000: VN2000Coordinate;
  matchType: 'inside' | 'nearest' | 'district_general';
  distanceToZoneMeters?: number;
  zone: {
    id: string;
    code: string;
    name: string;
    district: string;
    subdivisionCode?: string;
    subdivisionName?: string;
    color: string;
    type: string;
    planYear: number;
    status: string;
    legalBasis: string;
    pdfUrl?: string;
  };
  specs: {
    landUseTitle: string;
    landUseDescription: string;
    maxFloors: number;
    maxHeight: string;
    density: string;
    floorAreaRatio: number;
    setback: string; // Khoảng lùi xây dựng
    planningNote: string;
  };
}

/**
 * Thuật toán Ray-Casting xác định toạ độ [lat, lng] có nằm trong đa giác khép kín không
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  if (!polygon || polygon.length < 3) return false;

  const lat = point[0];
  const lng = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const latI = polygon[i][0];
    const lngI = polygon[i][1];
    const latJ = polygon[j][0];
    const lngJ = polygon[j][1];

    const intersect =
      lngI > lng !== lngJ > lng &&
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Tính tâm toạ độ (Centroid) của một đa giác
 */
export function getPolygonCentroid(polygon: [number, number][]): [number, number] {
  let latSum = 0;
  let lngSum = 0;
  const count = polygon.length;
  for (const pt of polygon) {
    latSum += pt[0];
    lngSum += pt[1];
  }
  return [latSum / count, lngSum / count];
}

/**
 * Tra cứu phân khu quy hoạch chi tiết tại một vị trí bất kỳ (Point-in-Polygon)
 */
export function inspectPointPlanning(
  point: [number, number],
  zones: PlanningZoneItem[]
): PlanningInspectionResult {
  const [lat, lng] = point;
  const wgs84 = formatWGS84(lat, lng);
  const vn2000 = wgs84ToVn2000(lat, lng);

  // 1. Kiểm tra điểm có nằm trong đa giác phân khu cụ thể nào không
  let matchingZone: PlanningZoneItem | null = null;

  for (const zone of zones) {
    if (zone.coordinates && zone.coordinates.length >= 3) {
      if (isPointInPolygon(point, zone.coordinates)) {
        matchingZone = zone;
        break;
      }
    }
  }

  let matchType: 'inside' | 'nearest' | 'district_general' = 'inside';
  let distanceMeters: number | undefined;

  // 2. Nếu không nằm trọn trong đa giác nào, tìm phân khu gần nhất trong bán kính
  if (!matchingZone && zones.length > 0) {
    let minDistance = Infinity;
    let closestZone: PlanningZoneItem | null = null;

    for (const zone of zones) {
      if (zone.coordinates && zone.coordinates.length >= 3) {
        const centroid = getPolygonCentroid(zone.coordinates);
        const dist = calculateDistanceMeters(point, centroid);
        if (dist < minDistance) {
          minDistance = dist;
          closestZone = zone;
        }
      }
    }

    if (closestZone && minDistance <= 3000) {
      matchingZone = closestZone;
      matchType = 'nearest';
      distanceMeters = minDistance;
    }
  }

  // 3. Nếu vẫn không tìm thấy, suy luận theo tâm quận gần nhất
  let districtName = 'Đống Đa';
  if (!matchingZone) {
    let minDistrictDist = Infinity;
    for (const [name, center] of Object.entries(HANOI_DISTRICT_CENTERS)) {
      const dist = calculateDistanceMeters(point, [center.lat, center.lng]);
      if (dist < minDistrictDist) {
        minDistrictDist = dist;
        districtName = name;
      }
    }
    matchType = 'district_general';
    distanceMeters = minDistrictDist;
  } else {
    districtName = matchingZone.district;
  }

  // 4. Lấy hồ sơ quận & phân khu
  const districtProfile = HANOI_DISTRICTS_PLANNING_PROFILES[districtName];
  const subdivisionCode = districtProfile?.subdivisionCode || 'H1-3';

  // Nhóm phân khu tổng thể
  const subdivisionGroup = HANOI_SUBDIVISION_GROUPS.find((g) =>
    g.districts.some((d) => districtName.toLowerCase().includes(d.toLowerCase()))
  );

  // 5. Xác định mã chuẩn và tên loại đất
  const zoneCode = matchingZone?.code || 'ODT-01';
  const prefix = zoneCode.split('-')[0] as keyof typeof PLANNING_STANDARD_SYMBOLS;
  const standardSymbol = PLANNING_STANDARD_SYMBOLS[prefix] || PLANNING_STANDARD_SYMBOLS.ODT;

  const color = matchingZone?.color || standardSymbol.color;
  const name = matchingZone?.name || `${standardSymbol.name} (${districtName})`;
  const type = matchingZone?.type || standardSymbol.type;

  // 6. Tính toán chỉ tiêu quy hoạch kiến trúc QCVN 01:2021
  const maxFloors = matchingZone?.maxFloors || (prefix === 'HH' ? 25 : prefix === 'TMD' ? 15 : prefix === 'CX' ? 1 : 5);
  const maxHeight = matchingZone?.maxHeight || (prefix === 'HH' ? '75m (25 tầng)' : prefix === 'TMD' ? '45m (15 tầng)' : prefix === 'CX' ? '4m' : '21m (5 tầng)');
  const density = matchingZone?.density || (prefix === 'CX' ? '5%' : prefix === 'HH' ? '50%' : '65%');
  const floorAreaRatio = matchingZone?.floorAreaRatio || (prefix === 'HH' ? 6.0 : prefix === 'TMD' ? 5.0 : prefix === 'CX' ? 0.1 : 3.5);

  // Khoảng lùi xây dựng quy chuẩn
  let setback = 'Tối thiểu 3.0m so với chỉ giới đường đỏ';
  if (prefix === 'HH') {
    setback = 'Tối thiểu 6.0m đối với công trình cao trên 28m (QCVN 01:2021)';
  } else if (prefix === 'CX') {
    setback = 'Tuyệt đối bảo tồn hành lang xanh, không xây dựng kiên cố';
  } else if (prefix === 'GT') {
    setback = 'Nằm trong hành lang an toàn giao thông đô thị và chỉ giới mở đường';
  } else if (prefix === 'TMD') {
    setback = 'Từ 3.0m đến 6.0m tạo khoảng đệm thương mại và vỉa hè người đi bộ';
  }

  // Căn cứ pháp lý
  const legalBasis =
    districtProfile?.legalBasis ||
    subdivisionGroup?.legalBasis ||
    `Quyết định phê duyệt đồ án quy hoạch phân khu đô thị ${districtName} của UBND TP Hà Nội`;

  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const inspectionId = `QH-HN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return {
    inspectionId,
    timestamp,
    point,
    wgs84,
    vn2000,
    matchType,
    distanceToZoneMeters: distanceMeters,
    zone: {
      id: matchingZone?.id || `inspected_${districtName}_${zoneCode}`.toLowerCase(),
      code: zoneCode,
      name,
      district: districtName,
      subdivisionCode,
      subdivisionName: subdivisionGroup?.name || `Phân khu ${subdivisionCode}`,
      color,
      type,
      planYear: matchingZone?.planYear || 2030,
      status: matchingZone?.status || 'Đã phê duyệt chính thức',
      legalBasis,
      pdfUrl: matchingZone?.pdfUrl,
    },
    specs: {
      landUseTitle: standardSymbol.name,
      landUseDescription: standardSymbol.desc,
      maxFloors,
      maxHeight,
      density,
      floorAreaRatio,
      setback,
      planningNote: matchType === 'inside'
        ? 'Vị trí thửa đất nằm hoàn toàn trong phạm vi ranh giới phân khu quy hoạch đã phê duyệt.'
        : matchType === 'nearest'
        ? `Vị trí cách ranh giới phân khu quy hoạch ${zoneCode} khoảng ${distanceMeters}m.`
        : 'Vị trí áp dụng chỉ tiêu kiểm soát quy hoạch chung theo định hướng phân khu đô thị trung tâm Hà Nội.',
    },
  };
}
