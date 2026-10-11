import { ListingItem } from '@/lib/mock-data';
import { HANOI_METRO_STATIONS } from '@/lib/leaflet/hanoi-data';

export interface SearchFilters {
  // Basic
  keyword: string;
  type: string; // 'all' | 'house' | 'apartment' | 'land' | 'villa' | 'commercial' | 'project'
  listingType: 'sale' | 'rent';

  // Location
  district: string;
  ward: string;
  street: string;

  // Price (in VND)
  minPrice: number | null;
  maxPrice: number | null;

  // Area (in m2)
  minArea: number | null;
  maxArea: number | null;

  // Property specs
  minBedrooms: number | null;
  maxBedrooms: number | null;
  minBathrooms: number | null;
  minFloors: number | null;

  // Direction (Đông, Tây, Nam, Bắc, Đông Bắc, Đông Nam, Tây Bắc, Tây Nam)
  direction: string[];

  // Legal
  legalStatus: string[];

  // Features (parking, elevator, pool, garden, security, pet, ac, internet)
  features: string[];

  // Planning zones
  planningZone: string[];

  // Price per m2
  minPricePerM2: number | null;
  maxPricePerM2: number | null;

  // Year built
  minYearBuilt: number | null;
  maxYearBuilt: number | null;

  // Quick toggles
  featuredOnly: boolean;
  verifiedOnly: boolean;
  hasAIReport: boolean;

  // Near amenities
  nearSchool: boolean;
  nearHospital: boolean;
  nearMetro: boolean;
  nearPark: boolean;
  nearRadius: number; // in km
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  keyword: '',
  type: 'all',
  listingType: 'sale',
  district: '',
  ward: '',
  street: '',
  minPrice: null,
  maxPrice: null,
  minArea: null,
  maxArea: null,
  minBedrooms: null,
  maxBedrooms: null,
  minBathrooms: null,
  minFloors: null,
  direction: [],
  legalStatus: [],
  features: [],
  planningZone: [],
  minPricePerM2: null,
  maxPricePerM2: null,
  minYearBuilt: null,
  maxYearBuilt: null,
  featuredOnly: false,
  verifiedOnly: false,
  hasAIReport: false,
  nearSchool: false,
  nearHospital: false,
  nearMetro: false,
  nearPark: false,
  nearRadius: 2,
};

// Haversine distance in meters
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Find nearest metro station distance in meters
export function findNearestMetroDistance(lat: number, lng: number): number {
  let minDistance = Infinity;
  for (const station of HANOI_METRO_STATIONS) {
    const dist = haversineDistance(lat, lng, station.lat, station.lng);
    if (dist < minDistance) minDistance = dist;
  }
  return minDistance;
}

// Pure filter function
export function filterListings(
  listings: ListingItem[],
  filters: SearchFilters
): ListingItem[] {
  const nowTime = Date.now();

  return listings.filter((listing) => {
    // 0. LOẠI BỎ TIN ĐÃ HẾT HẠN HOẶC BỊ ẨN / TỪ CHỐI / NHÁP
    // VD: Tài khoản dùng gói Free đăng 1 tin được 7 ngày, sau 7 ngày tự động hết hạn và không hiển thị trên tìm kiếm
    if (listing.status === 'expired' || listing.status === 'hidden' || listing.status === 'rejected' || listing.status === 'draft') {
      return false;
    }
    if (listing.expiresAt) {
      const expiryTimestamp = new Date(listing.expiresAt).setHours(23, 59, 59, 999);
      if (nowTime > expiryTimestamp) {
        return false;
      }
    }

    // 1. Keyword search (title, address, district, description)
    if (filters.keyword.trim()) {
      const kw = filters.keyword.trim().toLowerCase();
      const match =
        listing.title.toLowerCase().includes(kw) ||
        listing.address.toLowerCase().includes(kw) ||
        listing.district.toLowerCase().includes(kw) ||
        (listing.description && listing.description.toLowerCase().includes(kw));
      if (!match) return false;
    }

    // 2. Property type
    if (filters.type !== 'all' && listing.type !== filters.type) {
      return false;
    }

    // 3. District
    if (
      filters.district &&
      filters.district !== 'Tất cả quận' &&
      filters.district !== 'all'
    ) {
      if (!listing.district.toLowerCase().includes(filters.district.toLowerCase())) {
        return false;
      }
    }

    // 4. Ward
    if (filters.ward && filters.ward !== 'Tất cả phường') {
      if (!listing.ward.toLowerCase().includes(filters.ward.toLowerCase())) {
        return false;
      }
    }

    // 5. Street
    if (filters.street.trim()) {
      const st = filters.street.trim().toLowerCase();
      if (!listing.address.toLowerCase().includes(st)) {
        return false;
      }
    }

    // 6. Price range
    if (filters.minPrice !== null && listing.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && listing.price > filters.maxPrice) return false;

    // 7. Area range
    if (filters.minArea !== null && listing.area < filters.minArea) return false;
    if (filters.maxArea !== null && listing.area > filters.maxArea) return false;

    // 8. Bedrooms
    if (filters.minBedrooms !== null && listing.bedrooms < filters.minBedrooms) {
      return false;
    }
    if (filters.maxBedrooms !== null && listing.bedrooms > filters.maxBedrooms) {
      return false;
    }

    // 9. Bathrooms
    if (filters.minBathrooms !== null && listing.bathrooms < filters.minBathrooms) {
      return false;
    }

    // 10. Floors
    if (filters.minFloors !== null && listing.floors < filters.minFloors) {
      return false;
    }

    // 11. Direction
    if (filters.direction.length > 0 && listing.direction) {
      const matched = filters.direction.some((d) =>
        listing.direction?.toLowerCase().includes(d.toLowerCase())
      );
      if (!matched) return false;
    }

    // 12. Legal Status
    if (filters.legalStatus.length > 0) {
      const matched = filters.legalStatus.some((status) =>
        listing.legalStatus.toLowerCase().includes(status.toLowerCase())
      );
      if (!matched) return false;
    }

    // 13. Planning Zone
    if (filters.planningZone.length > 0) {
      const matched = filters.planningZone.some((zone) =>
        listing.planningZone.toLowerCase().includes(zone.toLowerCase())
      );
      if (!matched) return false;
    }

    // 14. Featured Only
    if (filters.featuredOnly && !listing.isFeatured) {
      return false;
    }

    // 15. Near Metro
    if (filters.nearMetro) {
      const metroDist = findNearestMetroDistance(listing.lat, listing.lng);
      if (metroDist > filters.nearRadius * 1000) {
        return false;
      }
    }

    // 16. Listing Purpose (Cần bán vs Cho thuê)
    if (filters.listingType) {
      if (filters.listingType === 'rent') {
        const isRent =
          listing.purpose === 'rent' ||
          (listing.description && /cho thuê|giá thuê|cho thue/i.test(listing.description)) ||
          /cho thuê|cho thue/i.test(listing.title);
        if (!isRent) return false;
      } else if (filters.listingType === 'sale') {
        if (listing.purpose === 'rent') return false;
      }
    }

    return true;
  });
}

// Pure sort function
export function sortListings(
  listings: ListingItem[],
  sortBy: string
): ListingItem[] {
  return [...listings].sort((a, b) => {
    // 🌟 1. TIN NỔI BẬT ĐƯỢC ƯU TIÊN HIỂN THỊ Ở TOP 1 (HÀNG ĐẦU) THEO BỘ LỌC CỦA NGƯỜI DÙNG
    // Mỗi lần có khách tìm mua đất/nhà, tin nổi bật đáp ứng đúng nhu cầu luôn được đẩy lên đầu tiên
    const aFeatured = a.isFeatured ? 1 : 0;
    const bFeatured = b.isFeatured ? 1 : 0;
    if (aFeatured !== bFeatured) {
      return bFeatured - aFeatured; // 1 đứng trước 0 => tin nổi bật lên đầu
    }

    // Nếu cả 2 cùng là tin nổi bật, ưu tiên theo cấp độ gói: AGENCY (40 tin) > PRO (10 tin) > BASIC (2 tin)
    if (a.isFeatured && b.isFeatured) {
      const getBadgeScore = (item: ListingItem) => {
        const badge = (item.featuredBadge || '').toUpperCase();
        if (badge.includes('AGENCY')) return 3;
        if (badge.includes('PRO')) return 2;
        if (badge.includes('BASIC')) return 1;
        return 1;
      };
      const scoreDiff = getBadgeScore(b) - getBadgeScore(a);
      if (scoreDiff !== 0) return scoreDiff;
    }

    // 2. Tiếp theo sắp xếp theo tiêu chí người dùng lựa chọn (Giá, Diện tích, Mới nhất...)
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'area':
      case 'area_desc':
        return b.area - a.area;
      case 'price_m2_asc':
        return a.pricePerM2 - b.pricePerM2;
      case 'price_m2_desc':
        return b.pricePerM2 - a.pricePerM2;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}
