import {
  searchHanoiAddressOffline,
  searchHanoiLocationsSmart,
  POPULAR_HANOI_LOCATIONS,
  HanoiStreetInfo,
} from './hanoi-streets';

// Nominatim geocoding
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'HaNoiRealty/1.0 (hanoirealty.vn)';

// Rate limiting: 1 request per second
let lastRequestTime = 0;
const RATE_LIMIT_MS = 600;

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

async function fetchWithTimeout(resource: string, options: any = {}, timeout = 3500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  // 1. First check offline Hanoi lookup (instant)
  const localMatches = searchHanoiAddressOffline(address);
  if (localMatches.length > 0) {
    return {
      lat: localMatches[0].lat,
      lng: localMatches[0].lng,
      displayName: localMatches[0].displayName,
    };
  }

  // 2. Fallback to Nominatim online
  try {
    await rateLimit();
    const query = `${address}, Hà Nội, Việt Nam`;
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=vn`;

    const res = await fetchWithTimeout(
      url,
      {
        headers: { 'Accept-Language': 'vi' },
      },
      3000
    );

    if (!res.ok) return null;
    const data = await res.json();

    if (data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function formatDistrictName(district: string): string {
  if (!district) return '';
  if (district.startsWith('Quận') || district.startsWith('Huyện') || district.startsWith('Thị xã')) {
    return district;
  }
  const innerDistricts = [
    'Đống Đa', 'Hoàn Kiếm', 'Cầu Giấy', 'Tây Hồ', 'Ba Đình',
    'Hai Bà Trưng', 'Hoàng Mai', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm',
    'Hà Đông', 'Thanh Xuân'
  ];
  if (innerDistricts.includes(district)) return `Quận ${district}`;
  if (district === 'Sơn Tây') return 'Thị xã Sơn Tây';
  return `Huyện ${district}`;
}

// Tìm điểm đường/phố/xã gần nhất từ toạ độ nếu mạng chậm hoặc offline
function findNearestHanoiStreet(lat: number, lng: number) {
  let nearest = POPULAR_HANOI_LOCATIONS[0];
  let minDistance = 999999;

  for (const loc of POPULAR_HANOI_LOCATIONS) {
    const d = Math.hypot(loc.lat - lat, loc.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = loc;
    }
  }

  const distTitle = formatDistrictName(nearest.district);

  return {
    displayName: `${nearest.name}, ${nearest.ward ? nearest.ward + ', ' : ''}${distTitle}, Hà Nội`,
    district: nearest.district,
    ward: nearest.ward || '',
    road: nearest.name,
    houseNumber: '',
  };
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{
  displayName: string;
  district: string;
  ward: string;
  road: string;
  houseNumber: string;
}> {
  try {
    await rateLimit();
    const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`;

    const res = await fetchWithTimeout(
      url,
      {
        headers: { 'Accept-Language': 'vi' },
      },
      3000
    );

    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();

    const addr = data.address || {};
    const rawDistrict = addr.city_district || addr.suburb || addr.district || '';
    const cleanDistrict = rawDistrict.replace(/^(Quận|Huyện|Thị xã)\s+/i, '').trim();

    return {
      displayName: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      district: cleanDistrict || rawDistrict,
      ward: addr.quarter || addr.neighbourhood || addr.suburb || '',
      road: addr.road || addr.pedestrian || '',
      houseNumber: addr.house_number || '',
    };
  } catch {
    // Fallback thông minh: Dùng toạ độ gần nhất ở Hà Nội
    return findNearestHanoiStreet(lat, lng);
  }
}

export interface SearchResultItem {
  id: string;
  lat: number;
  lng: number;
  displayName: string;
  shortName: string;
  district: string;
  ward?: string;
  road?: string;
  houseNumber?: string;
  category?: string;
  isSimilar?: boolean;
  similarReason?: string;
  badge?: string;
  description?: string;
}

export interface DetailedAddressSearchResult {
  directMatches: SearchResultItem[];
  similarMatches: SearchResultItem[];
  detectedDistrict?: string;
  suggestedChips: SearchResultItem[];
}

function mapStreetToResultItem(item: HanoiStreetInfo, index: number = 0): SearchResultItem {
  const distTitle = formatDistrictName(item.district);
  const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const generatedId = item.id || `loc-${cleanName}-${Math.round(item.lat * 1000)}-${Math.round(item.lng * 1000)}-${index}`;

  return {
    id: generatedId,
    lat: item.lat,
    lng: item.lng,
    displayName: `${item.name}, ${item.ward ? item.ward + ', ' : ''}${distTitle}, Hà Nội`,
    shortName: item.name,
    district: item.district,
    ward: item.ward || '',
    road: item.road || item.name,
    houseNumber: item.houseNumber || '',
    category: item.category,
    isSimilar: item.isSimilar,
    similarReason: item.similarReason,
    badge: item.badge,
    description: item.description,
  };
}

/**
 * Tìm kiếm địa chỉ thông minh phân loại kết quả trực tiếp và khu vực tương tự lân cận
 */
export function searchAddressWithSuggestions(query: string): DetailedAddressSearchResult {
  const smartRes = searchHanoiLocationsSmart(query);
  return {
    directMatches: smartRes.directMatches.map((item, idx) => mapStreetToResultItem(item, idx)),
    similarMatches: smartRes.similarMatches.map((item, idx) => mapStreetToResultItem(item, idx + 100)),
    detectedDistrict: smartRes.detectedDistrict,
    suggestedChips: smartRes.suggestedChips.map((item, idx) => mapStreetToResultItem(item, idx + 200)),
  };
}

export async function searchAddress(query: string): Promise<SearchResultItem[]> {
  if (!query || query.trim().length < 2) return [];

  // 1. Tìm kiếm tức thì trong kho dữ liệu phố phường Hà Nội
  const smart = searchAddressWithSuggestions(query);
  const localResults = [...smart.directMatches, ...smart.similarMatches];

  // Nếu có kết quả nội bộ (thậm chí 1 kết quả), trả về ngay tức thì để UI phản hồi 0ms
  if (localResults.length > 0) {
    return localResults;
  }

  // 2. Thử tìm kiếm mở rộng trực tuyến qua Nominatim nếu từ khoá rất đặc thù (ngõ, số nhà cụ thể...)
  try {
    await rateLimit();
    const q = `${query}, Hà Nội, Việt Nam`;
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=vn&addressdetails=1`;

    const res = await fetchWithTimeout(
      url,
      {
        headers: { 'Accept-Language': 'vi' },
      },
      2500
    );

    if (!res.ok) return localResults;
    const data = await res.json();

    const onlineResults: SearchResultItem[] = data.map((item: any) => ({
      id: `osm-${item.place_id || Math.random().toString(36).slice(2, 8)}`,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      shortName: item.display_name.split(',').slice(0, 2).join(',').trim(),
      district: item.address?.city_district || item.address?.suburb || item.address?.district || '',
      ward: item.address?.quarter || item.address?.neighbourhood || '',
      road: item.address?.road || '',
      houseNumber: item.address?.house_number || '',
      category: 'street',
    }));

    return onlineResults.slice(0, 6);
  } catch {
    return localResults;
  }
}
