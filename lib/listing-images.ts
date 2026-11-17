/**
 * lib/listing-images.ts
 * Module chuẩn hóa, xác thực và đồng bộ hình ảnh bất động sản (Task 14)
 * HaNoi Realty Platform
 */

export type PropertyType = 'house' | 'apartment' | 'land' | 'villa';

export interface PropertyTypeMeta {
  label: string;
  icon: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const PROPERTY_TYPE_META: Record<PropertyType, PropertyTypeMeta> = {
  house: {
    label: 'Nhà phố',
    icon: '🏠',
    colorClass: 'text-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    description: 'Nhà phố / Liền kề Hà Nội',
  },
  apartment: {
    label: 'Chung cư',
    icon: '🏢',
    colorClass: 'text-blue-500',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    description: 'Căn hộ chung cư cao cấp',
  },
  land: {
    label: 'Đất nền',
    icon: '🌿',
    colorClass: 'text-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    description: 'Đất thổ cư / Phân lô',
  },
  villa: {
    label: 'Biệt thự',
    icon: '🏰',
    colorClass: 'text-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-900/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    description: 'Biệt thự đơn lập / Song lập',
  },
};

/**
 * Kiểm tra xem một chuỗi có phải là Data URL base64 hợp lệ hay không
 */
export function isValidDataUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  return /^data:image\/(jpeg|jpg|png|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(url.trim());
}

/**
 * Kiểm tra xem một chuỗi có phải là URL hình ảnh hợp lệ (Web URL hoặc Supabase Storage URL)
 */
export function isValidHttpUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    // Relative path trong dự án (ví dụ /images/placeholder.jpg)
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Kiểm tra tính hợp lệ chung của một chuỗi ảnh
 */
export function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return isValidDataUrl(trimmed) || isValidHttpUrl(trimmed);
}

/**
 * Tách và chuẩn hoá mảng chuỗi ảnh từ Postgres array format: {url1,url2}
 */
function parsePostgresArrayString(str: string): string[] {
  const content = str.slice(1, -1).trim();
  if (!content) return [];
  // Parse từng phần tử có tính đến quotes
  const results: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      if (current.trim()) results.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    results.push(current.trim().replace(/^["']|["']$/g, ''));
  }
  return results;
}

/**
 * Chuẩn hóa dữ liệu images thành string[]:
 * - Hỗ trợ: string[], JSON string, Postgres array string, single URL, Data URL base64.
 * - Loại bỏ null, undefined, chuỗi rỗng.
 * - Loại bỏ URL trùng lặp nhưng giữ nguyên thứ tự ảnh gốc (ảnh đầu tiên là ảnh bìa).
 * - KHÔNG tự động tạo ảnh ảo, KHÔNG gán ảnh từ listing khác.
 * - Nếu không có ảnh hợp lệ, trả về mảng rỗng [] để component hiển thị placeholder theo loại BĐS.
 */
export function normalizeListingImages(imagesInput: unknown, propertyType?: string): string[] {
  if (!imagesInput) return [];

  let candidates: unknown[] = [];

  if (Array.isArray(imagesInput)) {
    candidates = imagesInput;
  } else if (typeof imagesInput === 'string') {
    const trimmed = imagesInput.trim();
    if (!trimmed) return [];

    // 1. Trường hợp chuỗi JSON: ["url1", "url2"]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          candidates = parsed;
        }
      } catch {
        candidates = [trimmed];
      }
    }
    // 2. Trường hợp Postgres array string: {"url1", "url2"}
    else if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      candidates = parsePostgresArrayString(trimmed);
    }
    // 3. Chuỗi đơn URL hoặc Data URL
    else {
      candidates = [trimmed];
    }
  }

  const isNonVilla = propertyType && ['house', 'apartment', 'land'].includes(propertyType.toLowerCase());

  // Lọc và chuẩn hóa từng URL hợp lệ, deduplicate giữ nguyên thứ tự
  const seen = new Set<string>();
  const validatedList: string[] = [];

  for (const item of candidates) {
    if (typeof item === 'string') {
      let cleanUrl = item.trim();
      
      // Chặn ảnh biệt thự bể bơi mẫu rò rỉ vào nhà phố / chung cư / đất nền
      if (isNonVilla && cleanUrl.includes('photo-1600585154340')) {
        continue;
      }

      // Xử lý thay thế các link Unsplash bị 404 (nếu có từ cache cũ)
      if (cleanUrl.includes('photo-1524813686514-a57563d77d61')) {
        cleanUrl = 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&auto=format&fit=crop&q=80';
      } else if (cleanUrl.includes('photo-1502005229762-ee1b2b8100ff')) {
        cleanUrl = 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80';
      }

      if (cleanUrl && isValidImageUrl(cleanUrl) && !seen.has(cleanUrl)) {
        seen.add(cleanUrl);
        validatedList.push(cleanUrl);
      }
    }
  }

  return validatedList;
}

/**
 * Lấy ảnh đại diện (Cover Image) đầu tiên của một listing
 * Trả về null nếu không có ảnh hợp lệ
 */
export function getListingCoverImage(imagesInput: unknown): string | null {
  const images = normalizeListingImages(imagesInput);
  return images.length > 0 ? images[0] : null;
}

/**
 * Lấy metadata và thông tin hiển thị của loại BĐS
 */
export function getPropertyTypeMeta(type?: string): PropertyTypeMeta {
  const normalizedType = (type || 'house').toLowerCase() as PropertyType;
  return PROPERTY_TYPE_META[normalizedType] || PROPERTY_TYPE_META.house;
}

/**
 * Tối ưu hóa URL hình ảnh:
 * - Giữ nguyên Data URL base64 (không làm hỏng hay chuyển thành URL giả).
 * - Tối ưu query param với ảnh Unsplash (WebP, width, quality).
 * - Giữ nguyên URL Supabase Storage hoặc URL bên thứ 3.
 */
export function getSafeImageUrl(url: string | null | undefined, width = 800, quality = 80): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Data URL base64: Giữ nguyên tuyệt đối
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Unsplash CDN: Tối ưu kích thước & định dạng tự động
  if (trimmed.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(trimmed);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('w', width.toString());
      parsed.searchParams.set('q', quality.toString());
      parsed.searchParams.set('fit', 'crop');
      return parsed.toString();
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

