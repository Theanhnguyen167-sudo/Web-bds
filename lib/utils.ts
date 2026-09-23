import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Vietnamese currency:
 * 8500000000 -> "8.5 tỷ"
 * 850000000 -> "850 triệu"
 * 85000000 -> "85 triệu"
 */
export function formatCurrencyVND(amount: number): string {
  if (!amount || amount === 0) return "Thoả thuận";
  if (amount >= 1_000_000_000) {
    const ty = amount / 1_000_000_000;
    return `${ty % 1 === 0 ? ty : ty.toFixed(1)} tỷ`;
  }
  if (amount >= 1_000_000) {
    const trieu = amount / 1_000_000;
    return `${trieu % 1 === 0 ? trieu : trieu.toFixed(0)} triệu`;
  }
  return `${amount.toLocaleString("vi-VN")} đ`;
}

/**
 * Format price per m2
 * 85000000 -> "85 triệu/m²"
 */
export function formatPricePerM2(price: number, area: number): string {
  if (!price || !area || area <= 0) return "N/A";
  const perM2 = price / area;
  if (perM2 >= 1_000_000_000) {
    const ty = perM2 / 1_000_000_000;
    return `${ty.toFixed(1)} tỷ/m²`;
  }
  if (perM2 >= 1_000_000) {
    const trieu = perM2 / 1_000_000;
    return `${trieu.toFixed(1)} tr/m²`;
  }
  return `${Math.round(perM2).toLocaleString("vi-VN")} đ/m²`;
}

export function formatArea(area: number): string {
  return `${area} m²`;
}

// Danh sách toạ độ tâm các Quận/Huyện Hà Nội để fallback thông minh
export const HANOI_DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Đống Đa': { lat: 21.0185, lng: 105.8300 },
  'Hoàn Kiếm': { lat: 21.0310, lng: 105.8525 },
  'Cầu Giấy': { lat: 21.0315, lng: 105.7825 },
  'Tây Hồ': { lat: 21.0650, lng: 105.8230 },
  'Long Biên': { lat: 21.0420, lng: 105.8900 },
  'Nam Từ Liêm': { lat: 21.0020, lng: 105.7600 },
  'Bắc Từ Liêm': { lat: 21.0600, lng: 105.7600 },
  'Ba Đình': { lat: 21.0340, lng: 105.8250 },
  'Thanh Xuân': { lat: 20.9950, lng: 105.8080 },
  'Hai Bà Trưng': { lat: 21.0080, lng: 105.8550 },
  'Hà Đông': { lat: 20.9725, lng: 105.7745 },
  'Hoàng Mai': { lat: 20.9750, lng: 105.8500 },
  'Gia Lâm': { lat: 20.9945, lng: 105.9465 },
  'Đông Anh': { lat: 21.1350, lng: 105.8450 },
  'Hoài Đức': { lat: 21.0200, lng: 105.6950 },
  'Thanh Trì': { lat: 20.9400, lng: 105.8500 },
  'Sơn Tây': { lat: 21.1395, lng: 105.5035 },
  'Ba Vì': { lat: 21.2335, lng: 105.3585 },
  'Phúc Thọ': { lat: 21.1085, lng: 105.5485 },
  'Đan Phượng': { lat: 21.0985, lng: 105.6785 },
  'Quốc Oai': { lat: 20.9985, lng: 105.6385 },
  'Thạch Thất': { lat: 21.0085, lng: 105.5385 },
  'Chương Mỹ': { lat: 20.8885, lng: 105.6985 },
  'Thanh Oai': { lat: 20.8785, lng: 105.7785 },
  'Thường Tín': { lat: 20.8685, lng: 105.8685 },
  'Phú Xuyên': { lat: 20.7385, lng: 105.9085 },
  'Ứng Hòa': { lat: 20.7285, lng: 105.7685 },
  'Mỹ Đức': { lat: 20.6885, lng: 105.7285 },
  'Mê Linh': { lat: 21.1785, lng: 105.7185 },
  'Sóc Sơn': { lat: 21.2685, lng: 105.8485 },
};

/**
 * Phân tích toạ độ thông minh từ PostGIS EWKB hex string, GeoJSON hoặc WKT POINT
 * Đảm bảo luôn lấy toạ độ thật chính xác, không bị fallback nhầm vị trí
 */
export function parseLocationCoordinates(
  location: any,
  districtFallback?: string
): { lat: number; lng: number } {
  // Xác định toạ độ fallback chuẩn theo quận
  let fallback = { lat: 21.0315, lng: 105.7825 };
  if (districtFallback) {
    const cleanD = districtFallback.replace(/^(Quận|Huyện|Thị xã)\s+/i, '').trim();
    if (HANOI_DISTRICT_COORDINATES[cleanD]) {
      fallback = HANOI_DISTRICT_COORDINATES[cleanD];
    }
  }

  if (!location) return fallback;

  // 1. Nếu location là GeoJSON object { coordinates: [lng, lat] }
  if (typeof location === 'object' && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    const lng = Number(location.coordinates[0]);
    const lat = Number(location.coordinates[1]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }

  // 2. Nếu location là chuỗi WKT POINT(lng lat)
  if (typeof location === 'string' && location.toUpperCase().includes('POINT')) {
    const match = location.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
  }

  // 3. Nếu location là chuỗi PostGIS EWKB hex string (vd: 0101000020E61000004A0C022B87725A40...)
  if (typeof location === 'string' && /^[0-9a-fA-F]{42,}$/.test(location.trim())) {
    try {
      const hex = location.trim();
      const isLittleEndian = hex.startsWith('01');
      const hasSrid = isLittleEndian
        ? (parseInt(hex.substring(8, 10), 16) & 0x20) !== 0
        : (parseInt(hex.substring(2, 4), 16) & 0x20) !== 0;

      const offsetBytes = hasSrid ? 9 : 5; // 1 byte order + 4 bytes geom type + 4 bytes SRID
      const offsetHex = offsetBytes * 2;

      const lngHex = hex.substring(offsetHex, offsetHex + 16);
      const latHex = hex.substring(offsetHex + 16, offsetHex + 32);

      if (lngHex.length === 16 && latHex.length === 16) {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);

        for (let i = 0; i < 8; i++) {
          view.setUint8(i, parseInt(lngHex.substring(i * 2, i * 2 + 2), 16));
        }
        const lng = view.getFloat64(0, isLittleEndian);

        for (let i = 0; i < 8; i++) {
          view.setUint8(i, parseInt(latHex.substring(i * 2, i * 2 + 2), 16));
        }
        const lat = view.getFloat64(0, isLittleEndian);

        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
    } catch (e) {
      console.warn('Error parsing PostGIS EWKB hex coordinates:', e);
    }
  }

  return fallback;
}
