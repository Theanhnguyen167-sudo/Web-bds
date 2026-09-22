import { searchHanoiAddressOffline, POPULAR_HANOI_LOCATIONS } from './hanoi-streets';

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

    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'vi' },
    }, 4000);

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

// Tìm điểm đường/phố gần nhất từ toạ độ nếu mạng chậm
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

  return {
    displayName: `${nearest.name}, ${nearest.ward ? nearest.ward + ', ' : ''}Quận ${nearest.district}, Hà Nội`,
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

    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': USER_AGENT },
    }, 3500);

    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();

    const addr = data.address || {};
    return {
      displayName: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      district: addr.city_district || addr.suburb || addr.district || '',
      ward: addr.quarter || addr.neighbourhood || '',
      road: addr.road || addr.pedestrian || '',
      houseNumber: addr.house_number || '',
    };
  } catch {
    // Fallback thông minh: Dùng toạ độ gần nhất ở Hà Nội
    return findNearestHanoiStreet(lat, lng);
  }
}

export async function searchAddress(query: string): Promise<
  Array<{
    lat: number;
    lng: number;
    displayName: string;
    shortName: string;
    district?: string;
    ward?: string;
    road?: string;
    houseNumber?: string;
  }>
> {
  if (!query || query.trim().length < 2) return [];

  // 1. Tìm kiếm tức thì trong kho dữ liệu phố phường Hà Nội
  const localResults = searchHanoiAddressOffline(query);

  // 2. Nếu có kết quả nội bộ đủ nhiều (>=3), trả về ngay lập tức không cần đợi mạng
  if (localResults.length >= 3) {
    return localResults;
  }

  // 3. Thử tìm kiếm mở rộng trực tuyến qua Nominatim
  try {
    await rateLimit();
    const q = `${query}, Hà Nội, Việt Nam`;
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=vn&addressdetails=1`;

    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'vi' },
    }, 3000);

    if (!res.ok) return localResults;
    const data = await res.json();

    const onlineResults = data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      shortName: item.display_name.split(',').slice(0, 2).join(',').trim(),
      district: item.address?.city_district || item.address?.suburb || item.address?.district || '',
      ward: item.address?.quarter || item.address?.neighbourhood || '',
      road: item.address?.road || '',
      houseNumber: item.address?.house_number || '',
    }));

    // Gộp và loại trùng
    const combined = [...localResults];
    for (const online of onlineResults) {
      if (!combined.some(c => Math.abs(c.lat - online.lat) < 0.002 && Math.abs(c.lng - online.lng) < 0.002)) {
        combined.push(online);
      }
    }

    return combined.slice(0, 6);
  } catch {
    return localResults;
  }
}
