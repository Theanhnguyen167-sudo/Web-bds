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
 * Tự động tạo slug cho listing từ tiêu đề và dữ liệu listing:
 * - Viết thường, không dấu, dùng dấu '-'
 * - Loại bỏ từ lặp địa phương (quận/huyện) nếu trong tiêu đề đã xuất hiện, vì quận đã có trong path /khu-vuc/
 * - Giữ lại đầy đủ thông số quan trọng: loại nhà, số tầng, mặt tiền, vị trí trọng điểm
 * - Không nhồi nhét từ khóa
 */
export function generateListingSlug(listing: {
  title: string;
  district?: string;
  type?: string;
}): string {
  if (!listing || !listing.title) return '';

  const unaccentTitle = removeVietnameseAccents(listing.title);

  // Nếu tiêu đề có chứa tên quận, lược bỏ tên quận khỏi tiêu đề để tránh lặp từ trong URL
  // Ví dụ: "Nhà phố Đống Đa 5 tầng..." trong path "/dong-da/" -> "Nhà phố 5 tầng..."
  if (listing.district) {
    const rawDistrict = listing.district.replace(/^(Quận|Huyện|Thị xã)\s+/i, '').trim();
    const unaccentDistrict = removeVietnameseAccents(rawDistrict);
    const regex = new RegExp('(\\b|\\s)' + unaccentDistrict + '(\\b|\\s)', 'gi');
    const cleaned = unaccentTitle.replace(regex, ' ');
    return toSlug(cleaned);
  }

  return toSlug(unaccentTitle);
}

/**
 * Tạo URL SEO hoàn chỉnh theo cấu trúc:
 * /mua-ban/[loai-bat-dong-san]/[khu-vuc]/[listing-slug]
 * Ví dụ:
 * /mua-ban/nha-pho/dong-da/nha-pho-5-tang-mat-tien-6m-gan-van-mieu
 */
export function getListingUrl(listing: {
  id: string;
  title: string;
  type?: string;
  district?: string;
}): string {
  const typeSlug = getPropertyTypeSlug(listing.type);
  const districtSlug = getDistrictSlug(listing.district);
  const itemSlug = generateListingSlug(listing);

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

  // 1. Khớp chính xác slug + loại BĐS + quận
  const exactMatch = pool.find((item) => {
    const itemSlug = generateListingSlug(item);
    const itemTypeSlug = getPropertyTypeSlug(item.type);
    const itemDistrictSlug = getDistrictSlug(item.district);

    const matchesSlug = itemSlug === targetSlug;
    const matchesType = !propertyTypeSlug || itemTypeSlug === propertyTypeSlug;
    const matchesDistrict = !districtSlug || itemDistrictSlug === districtSlug;

    return matchesSlug && matchesType && matchesDistrict;
  });

  if (exactMatch) return exactMatch;

  // 2. Khớp theo slug tiêu đề tổng quát
  const slugOnlyMatch = pool.find((item) => generateListingSlug(item) === targetSlug);
  if (slugOnlyMatch) return slugOnlyMatch;

  // 3. Fallback: Nếu slug trùng với ID nguyên bản (backward compatibility)
  const idMatch = pool.find((item) => item.id === slug);
  if (idMatch) return idMatch;

  return undefined;
}
