/**
 * THƯ VIỆN CHUYỂN ĐỔI HỆ TOẠ ĐỘ QUỐC GIA VN-2000 (HÀ NỘI) VÀ WGS-84
 * Chuẩn phép chiếu Transverse Mercator (UTM/Gauss-Krüger) theo Quyết định số 973/2001/QĐ-TCĐC
 * Kinh tuyến trục Hà Nội: 105°00' (Múi chiếu 3 độ, k0 = 0.9999)
 */

export interface VN2000Coordinate {
  x: number; // Toạ độ X (Bắc) tính bằng mét ~ 2,300,000m
  y: number; // Toạ độ Y (Đông) tính bằng mét ~ 580,000m
  formattedX: string;
  formattedY: string;
  centralMeridian: string;
  scaleFactor: number;
}

export interface WGS84Coordinate {
  lat: number;
  lng: number;
  dmsLat: string;
  dmsLng: string;
  formatted: string;
}

// Bán trục lớn và độ dẹt Elipxoit WGS-84 quy chuẩn VN-2000
const A = 6378137.0; // mét
const F = 1 / 298.257223563;
const E2 = 2 * F - F * F; // e^2 = 0.00669437999014
const E_PRIME_2 = E2 / (1 - E2); // e'^2 = 0.00673949674228

// Kinh tuyến trục chuẩn cho Hà Nội (Quy hoạch đô thị và Địa chính đo đạc)
export const HANOI_CENTRAL_MERIDIAN = 105.0; // 105°00'

/**
 * Chuyển độ thập phân sang Độ Phút Giây (DMS)
 */
export function toDMS(val: number, isLat: boolean): string {
  const dir = isLat ? (val >= 0 ? 'N' : 'S') : val >= 0 ? 'E' : 'W';
  const abs = Math.abs(val);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(1);
  return `${deg}°${min.toString().padStart(2, '0')}'${sec.padStart(4, '0')}"${dir}`;
}

/**
 * Chuyển đổi từ Toạ độ địa lý WGS-84 (Lat, Lng) sang Toạ độ phẳng VN-2000 Hà Nội (X, Y mét)
 */
export function wgs84ToVn2000(
  lat: number,
  lng: number,
  centralMeridian: number = HANOI_CENTRAL_MERIDIAN
): VN2000Coordinate {
  const k0 = 0.9999; // Hệ số co giãn múi chiếu 3 độ
  const falseEasting = 500000.0; // Toạ độ quy ước trục Y

  const phi = (lat * Math.PI) / 180.0;
  const lambda = (lng * Math.PI) / 180.0;
  const lambda0 = (centralMeridian * Math.PI) / 180.0;
  const deltaLambda = lambda - lambda0;

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const tanPhi = Math.tan(phi);

  // Bán kính cong chính khúc diện thẳng góc với kinh tuyến
  const n = A / Math.sqrt(1 - E2 * sinPhi * sinPhi);
  const t = tanPhi * tanPhi;
  const c = E_PRIME_2 * cosPhi * cosPhi;
  const aTerm = deltaLambda * cosPhi;

  // Cung kinh tuyến tính từ xích đạo
  const m =
    A *
    ((1 - E2 / 4 - (3 * E2 * E2) / 64 - (5 * Math.pow(E2, 3)) / 256) * phi -
      ((3 * E2) / 8 + (3 * E2 * E2) / 32 + (45 * Math.pow(E2, 3)) / 1024) * Math.sin(2 * phi) +
      ((15 * E2 * E2) / 256 + (45 * Math.pow(E2, 3)) / 1024) * Math.sin(4 * phi) -
      ((35 * Math.pow(E2, 3)) / 3072) * Math.sin(6 * phi));

  // Toạ độ X (Bắc)
  const x =
    k0 *
    (m +
      n *
        tanPhi *
        (Math.pow(aTerm, 2) / 2 +
          ((5 - t + 9 * c + 4 * c * c) * Math.pow(aTerm, 4)) / 24 +
          ((61 - 58 * t + t * t + 600 * c - 330 * E_PRIME_2) * Math.pow(aTerm, 6)) / 720));

  // Toạ độ Y (Đông)
  const y =
    k0 *
      n *
      (aTerm +
        ((1 - t + c) * Math.pow(aTerm, 3)) / 6 +
        ((5 - 18 * t + t * t + 72 * c - 58 * E_PRIME_2) * Math.pow(aTerm, 5)) / 120) +
    falseEasting;

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    formattedX: x.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m',
    formattedY: y.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m',
    centralMeridian: `${centralMeridian.toFixed(0)}°00'`,
    scaleFactor: k0,
  };
}

/**
 * Trả về thông tin WGS-84 đầy đủ kèm định dạng hiển thị
 */
export function formatWGS84(lat: number, lng: number): WGS84Coordinate {
  return {
    lat: Math.round(lat * 1000000) / 1000000,
    lng: Math.round(lng * 1000000) / 1000000,
    dmsLat: toDMS(lat, true),
    dmsLng: toDMS(lng, false),
    formatted: `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`,
  };
}

/**
 * Tính khoảng cách trắc địa đường chim bay giữa 2 điểm (Haversine, tính bằng mét)
 */
export function calculateDistanceMeters(
  point1: [number, number],
  point2: [number, number]
): number {
  const R = 6371e3; // Bán kính Trái Đất (mét)
  const phi1 = (point1[0] * Math.PI) / 180;
  const phi2 = (point2[0] * Math.PI) / 180;
  const deltaPhi = ((point2[0] - point1[0]) * Math.PI) / 180;
  const deltaLambda = ((point2[1] - point1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Chuyển đổi ngược từ Toạ độ phẳng VN-2000 (X, Y mét) sang Toạ độ WGS-84 (Lat, Lng)
 * X: Toạ độ Bắc (khoảng 2.300.000m)
 * Y: Toạ độ Đông (khoảng 580.000m)
 */
export function vn2000ToWgs84(
  x: number,
  y: number,
  centralMeridian: number = HANOI_CENTRAL_MERIDIAN
): [number, number] {
  const k0 = 0.9999;
  const falseEasting = 500000.0;
  const yPrime = y - falseEasting;
  const m = x / k0;

  const e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2));

  const mu =
    m /
    (A * (1 - E2 / 4 - (3 * E2 * E2) / 64 - (5 * Math.pow(E2, 3)) / 256));

  const phi1 =
    mu +
    ((3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * Math.pow(e1, 4)) / 32) * Math.sin(4 * mu) +
    ((151 * Math.pow(e1, 3)) / 96) * Math.sin(6 * mu) +
    ((1097 * Math.pow(e1, 4)) / 512) * Math.sin(8 * mu);

  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const tanPhi1 = Math.tan(phi1);

  const c1 = E_PRIME_2 * cosPhi1 * cosPhi1;
  const t1 = tanPhi1 * tanPhi1;
  const n1 = A / Math.sqrt(1 - E2 * sinPhi1 * sinPhi1);
  const r1 = (A * (1 - E2)) / Math.pow(1 - E2 * sinPhi1 * sinPhi1, 1.5);
  const d = yPrime / (n1 * k0);

  const lat =
    phi1 -
    ((n1 * tanPhi1) / r1) *
      (Math.pow(d, 2) / 2 -
        (5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * E_PRIME_2) * (Math.pow(d, 4) / 24) +
        (61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * E_PRIME_2 - 3 * c1 * c1) *
          (Math.pow(d, 6) / 720));

  const lngRad =
    (centralMeridian * Math.PI) / 180 +
    (d -
      (1 + 2 * t1 + c1) * (Math.pow(d, 3) / 6) +
      (5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * E_PRIME_2 + 24 * t1 * t1) *
        (Math.pow(d, 5) / 120)) /
      cosPhi1;

  const latDeg = (lat * 180) / Math.PI;
  const lngDeg = (lngRad * 180) / Math.PI;

  return [Math.round(latDeg * 1000000) / 1000000, Math.round(lngDeg * 1000000) / 1000000];
}

