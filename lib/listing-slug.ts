import { ListingItem, mockListings } from '@/lib/mock-data';

/**
 * Bảng ánh xạ loại bất động sản sang slug URL thân thiện với SEO
 */
export const PROPERTY_TYPE_SLUG_MAP: Record<string, string> = {
  house: 'nha-pho',
  apartment: 'can-ho-chung-cu',
  land: 'dat-nen',
  villa: 'biet-thu',
  commercial: 'thuong-mai',
  project: 'du-an',
};

/**
 * Bảng ánh xạ ngược từ slug URL sang mã loại bất động sản trong hệ thống
 */
export const SLUG_TO_PROPERTY_TYPE_MAP: Record<string, string> = {
  'nha-pho': 'house',
  'nha-rieng': 'house',
  'can-ho-chung-cu': 'apartment',
  'chung-cu': 'apartment',
  'dat-nen': 'land',
  'biet-thu': 'villa',
  'thuong-mai': 'commercial',
  'du-an': 'project',
};

/**
 * Cấu hình danh mục chuẩn SEO cho các Category Bất Động Sản
 */
export interface CategoryRouteConfig {
  slug: string;
  name: string;
  type: string;
  purpose: 'sale' | 'rent';
  keyword?: string;
  description: string;
}

export const CATEGORY_MAP: Record<string, CategoryRouteConfig> = {
  'nha-pho': {
    slug: 'nha-pho',
    name: 'Mua bán Nhà phố',
    type: 'house',
    purpose: 'sale',
    description: 'Mua bán nhà phố, nhà riêng chính chủ, vị trí đẹp tại Hà Nội',
  },
  'chung-cu': {
    slug: 'chung-cu',
    name: 'Mua bán Chung cư',
    type: 'apartment',
    purpose: 'sale',
    description: 'Mua bán căn hộ chung cư cao cấp, dự án mới nhất tại Hà Nội',
  },
  'can-ho-chung-cu': {
    slug: 'chung-cu',
    name: 'Mua bán Chung cư',
    type: 'apartment',
    purpose: 'sale',
    description: 'Mua bán căn hộ chung cư cao cấp, dự án mới nhất tại Hà Nội',
  },
  'dat-nen': {
    slug: 'dat-nen',
    name: 'Mua bán Đất nền',
    type: 'land',
    purpose: 'sale',
    description: 'Mua bán đất nền dự án, đất thổ cư pháp lý minh bạch tại Hà Nội',
  },
  'biet-thu': {
    slug: 'biet-thu',
    name: 'Mua bán Biệt thự',
    type: 'villa',
    purpose: 'sale',
    description: 'Mua bán biệt thự đơn lập, song lập sang trọng tại Hà Nội',
  },
  'nha-mat-pho': {
    slug: 'nha-mat-pho',
    name: 'Mua bán Nhà mặt phố',
    type: 'house',
    purpose: 'sale',
    keyword: 'mặt phố',
    description: 'Mua bán nhà mặt phố kinh doanh đắc địa tại Hà Nội',
  },
  'penthouse': {
    slug: 'penthouse',
    name: 'Mua bán Penthouse',
    type: 'apartment',
    purpose: 'sale',
    keyword: 'penthouse',
    description: 'Mua bán penthouse cao cấp view panorama tại Hà Nội',
  },
};

export const RENT_CATEGORY_CONFIG: CategoryRouteConfig = {
  slug: 'cho-thue',
  name: 'Bất động sản Cho thuê',
  type: 'all',
  purpose: 'rent',
  description: 'Cho thuê nhà đất, căn hộ chung cư, văn phòng tại Hà Nội',
};

/**
 * Xóa dấu tiếng Việt chuẩn W3C / Unicode Normalization
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'));
}

/**
 * Chuyển chuỗi bất kỳ thành slug viết thường, không dấu, ngăn cách bằng dấu '-'
 */
export function toSlug(str: string): string {
  if (!str) return '';
  return removeVietnameseAccents(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ') // Xóa ký tự đặc biệt, dấu câu
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-'); // Loại bỏ gạch ngang liên tiếp
}

/**
 * Lấy slug cho loại bất động sản
 */
export function getPropertyTypeSlug(type?: string): string {
  if (!type) return 'nha-dat';
  return PROPERTY_TYPE_SLUG_MAP[type.toLowerCase()] || toSlug(type);
}

/**
 * Lấy slug cho khu vực (quận/huyện)
 * Tự động lược bỏ tiền tố "Quận", "Huyện", "Thị xã" để URL ngắn gọn, sạch sẽ
 */
export function getDistrictSlug(district?: string): string {
  if (!district) return 'ha-noi';
  const cleanDistrict = district.replace(/^(Quận|Huyện|Thị xã)\s+/i, '').trim();
  return toSlug(cleanDistrict);
}

/**
 * Tự động tạo slug base từ tiêu đề tin đăng (viết thường, không dấu, ngăn cách bằng '-')
 * - Tự động lược bỏ tên quận nếu tiêu đề chứa tên quận để tránh lặp từ thừa thãi trong URL
 */
export function generateBaseSlug(listing: {
  title: string;
  district?: string;
}): string {
  if (!listing || !listing.title) return '';

  const unaccentTitle = removeVietnameseAccents(listing.title);

  if (listing.district) {
    const rawDistrict = listing.district.replace(/^(Quận|Huyện|Thị xã)\s+/i, '').trim();
    const unaccentDistrict = removeVietnameseAccents(rawDistrict);
    const regex = new RegExp('(\\b|\\s)' + unaccentDistrict + '(\\b|\\s)', 'gi');
    const cleaned = unaccentTitle.replace(regex, ' ');
    const result = toSlug(cleaned);
    if (result) return result;
  }

  return toSlug(unaccentTitle);
}

/**
 * Tạo UNIQUE SLUG cho listing:
 * 1. QUY TẮC IMMUTABILITY: Nếu listing đã có slug (đã public/lưu trước đó), giữ nguyên 100%,
 *    không thay đổi ngay cả khi tiêu đề (title) bị sửa đổi sau này, chống gãy liên kết (broken URL).
 * 2. QUY TẮC UNIQUE: Nếu 2 listing có cùng tiêu đề hoặc cùng sinh ra 1 base slug:
 *    - Listing đầu tiên nhận: baseSlug
 *    - Listing thứ hai nhận: baseSlug-2
 *    - Listing thứ ba nhận: baseSlug-3
 *    - ...
 * 3. TIÊU CHÍ: Dễ đọc, ngắn gọn, không nhồi nhét ID khi không cần thiết, không ký tự đặc biệt.
 */
export function generateUniqueSlug(
  listing: {
    id?: string;
    title: string;
    slug?: string;
    district?: string;
    type?: string;
  },
  existingListings?: Array<{
    id: string;
    title: string;
    slug?: string;
    district?: string;
    type?: string;
  }>
): string {
  // 1. IMMUTABILITY: Nếu đã có slug cố định thì giữ nguyên tuyệt đối, không sinh lại
  if (listing.slug && listing.slug.trim()) {
    return listing.slug.trim();
  }

  // 2. Tạo base slug từ tiêu đề
  const baseSlug = generateBaseSlug(listing);
  if (!baseSlug) {
    return 'bds-' + (listing.id || 'chi-tiet');
  }

  const pool = existingListings || mockListings;
  const currentTypeSlug = getPropertyTypeSlug(listing.type);
  const currentDistrictSlug = getDistrictSlug(listing.district);

  // Xác định vị trí của listing trong danh sách (nếu đã nằm trong pool)
  const currentIndex = listing.id ? pool.findIndex((item) => item.id === listing.id) : -1;

  // 3. Thu thập các slug đã bị chiếm dụng trong cùng phân cấp URL
  const usedSlugs = new Set<string>();

  pool.forEach((item, index) => {
    // Không so sánh với chính bản thân listing đang xét
    if (listing.id && item.id === listing.id) {
      return;
    }

    const itemTypeSlug = getPropertyTypeSlug(item.type);
    const itemDistrictSlug = getDistrictSlug(item.district);

    // Chỉ kiểm tra xung đột trong cùng phân cấp URL (loại BĐS và quận/huyện)
    if (itemTypeSlug === currentTypeSlug && itemDistrictSlug === currentDistrictSlug) {
      // Trường hợp A: Item đã có slug cố định đã lưu -> chắc chắn đã chiếm slug đó
      if (item.slug && item.slug.trim()) {
        usedSlugs.add(item.slug.trim());
        return;
      }

      // Trường hợp B: Item chưa có slug cố định:
      // Chỉ ưu tiên nhường base slug cho item nếu item được tạo trước (index < currentIndex)
      // hoặc nếu listing đang xét là tin mới hoàn toàn chưa nằm trong pool (currentIndex === -1)
      const shouldReserve = currentIndex === -1 || index < currentIndex;
      if (shouldReserve) {
        const otherBase = generateBaseSlug(item);
        if (!usedSlugs.has(otherBase)) {
          usedSlugs.add(otherBase);
        } else {
          let count = 2;
          while (usedSlugs.has(`${otherBase}-${count}`)) {
            count++;
          }
          usedSlugs.add(`${otherBase}-${count}`);
        }
      }
    }
  });

  // 4. Nếu baseSlug chưa ai dùng -> Sử dụng ngay baseSlug
  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  // 5. Nếu bị trùng -> Thêm hậu tố thứ tự -2, -3,...
  let suffix = 2;
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix++;
  }

  return `${baseSlug}-${suffix}`;
}

/**
 * Tương thích ngược: generateListingSlug gọi generateUniqueSlug
 */
export function generateListingSlug(
  listing: {
    id?: string;
    title: string;
    slug?: string;
    district?: string;
    type?: string;
  },
  existingListings?: Array<{
    id: string;
    title: string;
    slug?: string;
    district?: string;
    type?: string;
  }>
): string {
  return generateUniqueSlug(listing, existingListings);
}

/**
 * Tạo URL SEO hoàn chỉnh theo cấu trúc:
 * /mua-ban/[loai-bat-dong-san]/[khu-vuc]/[listing-slug]
 * Ví dụ:
 * /mua-ban/nha-pho/dong-da/nha-pho-5-tang-mat-tien-6m-gan-van-mieu
 */
export function getListingUrl(
  listing: {
    id: string;
    title: string;
    slug?: string;
    type?: string;
    district?: string;
  },
  existingListings?: Array<{
    id: string;
    title: string;
    slug?: string;
    district?: string;
    type?: string;
  }>
): string {
  const typeSlug = getPropertyTypeSlug(listing.type);
  const districtSlug = getDistrictSlug(listing.district);
  const itemSlug = generateUniqueSlug(listing, existingListings);

  return `/mua-ban/${typeSlug}/${districtSlug}/${itemSlug}`;
}

/**
 * Tìm listing bằng slug kết hợp typeSlug và districtSlug
 * Hỗ trợ tra cứu ID nguyên bản từ database/mock data
 */
export function findListingBySlug(
  slug: string,
  propertyTypeSlug?: string,
  districtSlug?: string,
  listingPool?: ListingItem[]
): ListingItem | undefined {
  const pool = listingPool || mockListings;
  if (!slug) return undefined;

  const targetSlug = slug.toLowerCase();

  // 1. Khớp chính xác trường slug đã lưu trữ
  const directSlugMatch = pool.find((item) => {
    if (!item.slug) return false;
    const matchesSlug = item.slug.toLowerCase() === targetSlug;
    const matchesType = !propertyTypeSlug || getPropertyTypeSlug(item.type) === propertyTypeSlug;
    const matchesDistrict = !districtSlug || getDistrictSlug(item.district) === districtSlug;
    return matchesSlug && matchesType && matchesDistrict;
  });
  if (directSlugMatch) return directSlugMatch;

  // 2. Khớp theo unique slug tính toán từ pool
  const computedMatch = pool.find((item) => {
    const itemUniqueSlug = generateUniqueSlug(item, pool);
    const itemTypeSlug = getPropertyTypeSlug(item.type);
    const itemDistrictSlug = getDistrictSlug(item.district);

    const matchesSlug = itemUniqueSlug === targetSlug;
    const matchesType = !propertyTypeSlug || itemTypeSlug === propertyTypeSlug;
    const matchesDistrict = !districtSlug || itemDistrictSlug === districtSlug;

    return matchesSlug && matchesType && matchesDistrict;
  });
  if (computedMatch) return computedMatch;

  // 3. Khớp theo base slug (nếu không có hậu tố)
  const baseMatch = pool.find((item) => {
    const itemBase = generateBaseSlug(item);
    return itemBase === targetSlug;
  });
  if (baseMatch) return baseMatch;

  // 4. Fallback: Nếu slug trùng với ID nguyên bản (backward compatibility)
  const idMatch = pool.find((item) => item.id === slug);
  if (idMatch) return idMatch;

  return undefined;
}
