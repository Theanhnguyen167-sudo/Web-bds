import { createClient } from '@supabase/supabase-js';
import { mockListings, ListingItem } from '@/lib/mock-data';
import { parseLocationCoordinates } from '@/lib/utils';
import { findListingBySlug } from '@/lib/listing-slug';

/**
 * Tạo Supabase Client an toàn cho Server-side queries
 * Chỉ sử dụng Anon Key hoặc Service Role Key trên Server, không rò rỉ ra Client
 */
function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

/**
 * Chuyển đổi bản ghi Supabase listings sang kiểu chuẩn ListingItem
 */
export function mapSupabaseListingToItem(row: any): ListingItem {
  const coords = parseLocationCoordinates(row.location, row.district);
  const lat = typeof row.lat === 'number' && !isNaN(row.lat) && row.lat !== 0 ? row.lat : coords.lat;
  const lng = typeof row.lng === 'number' && !isNaN(row.lng) && row.lng !== 0 ? row.lng : coords.lng;

  const area = Number(row.area) || 75;
  const price = Number(row.price) || 8500000000;
  const pricePerM2 = row.price_per_m2 || Math.round(price / (area || 1));

  let images: string[] = Array.isArray(row.images) && row.images.length > 0 ? row.images : [];
  if (images.length === 0) {
    images = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    ];
  }

  const rawTitle = row.title?.trim() || 'Bất động sản';
  const formattedTitle = rawTitle.toLowerCase().startsWith('bán') ? rawTitle : `Bán ${rawTitle}`;

  const autoDescription =
    row.description && row.description.trim().length > 10
      ? row.description
      : `${formattedTitle} vị trí đắc địa tại ${row.address || row.district || 'Hà Nội'}.
- Diện tích: ${area}m², mặt tiền rộng thoáng, ô tô đỗ cửa hoặc vào nhà thuận tiện.
- Thiết kế hiện đại ${row.floors || 4} tầng kiên cố, công năng tối ưu gồm ${row.bedrooms || 3} phòng ngủ, ${row.bathrooms || 2} phòng tắm khép kín.
- Vị trí trung tâm khu vực ${row.district || 'Hà Nội'}, hạ tầng đồng bộ.
- Pháp lý: ${row.legal_status || 'Sổ đỏ chính chủ, pháp lý minh bạch'}.`;

  const purpose: 'sale' | 'rent' =
    row.listing_type === 'rent' ||
    row.purpose === 'rent' ||
    row.title?.toLowerCase().includes('cho thuê') ||
    row.title?.toLowerCase().includes('thuê')
      ? 'rent'
      : 'sale';

  return {
    id: row.id,
    title: row.title || 'Bất động sản Hà Nội',
    price,
    pricePerM2,
    area,
    floors: row.floors || 4,
    bedrooms: row.bedrooms || 3,
    bathrooms: row.bathrooms || 2,
    address: row.address || `${row.district || 'Cầu Giấy'}, Hà Nội`,
    district: row.district || 'Cầu Giấy',
    ward: row.ward || '',
    lat,
    lng,
    type: row.property_type || 'house',
    propertyType: row.property_type || 'house',
    images,
    status: row.status || 'active',
    isFeatured: row.is_featured || false,
    views: row.views || row.views_count || 48,
    createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at ? row.updated_at.split('T')[0] : undefined,
    planningZone: row.planning_zone || row.planning_zone_code || 'Đất ở đô thị',
    planningYear: row.planning_year || 2030,
    legalStatus: row.legal_status || 'Sổ đỏ chính chủ',
    direction: row.direction || 'Đông Nam',
    description: autoDescription,
    purpose,
    propertyCode: row.listing_code || row.property_code || `BDS-${row.id.toString().slice(0, 5).toUpperCase()}`,
    verificationStatus: row.verification_status || (row.is_verified ? 'verified' : undefined),
    userId: row.user_id,
    authorName: row.users?.full_name || row.author_name || undefined,
    authorPhone: row.users?.phone || row.author_phone || undefined,
    authorEmail: row.author_email || undefined,
    authorAvatar: row.users?.avatar_url || row.author_avatar || undefined,
    users: row.users || undefined,
  };
}

/**
 * Tra cứu danh sách listing từ Supabase trên Server
 */
export async function getActiveListingsFromSupabase(): Promise<ListingItem[]> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('listings')
      .select('*, users!user_id(full_name, avatar_url, phone)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) {
      // Fallback query không join nếu foreign key users lỗi
      const { data: fallbackData } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(100);

      return (fallbackData || []).map(mapSupabaseListingToItem);
    }

    return (data || []).map(mapSupabaseListingToItem);
  } catch (err) {
    console.warn('Lỗi khi fetch active listings từ Supabase:', err);
    return [];
  }
}

/**
 * Tra cứu Bất Động Sản thống nhất bằng ID hoặc Slug trên Server
 * Ưu tiên:
 * 1. Database Supabase (ID trực tiếp nếu là UUID)
 * 2. Tra cứu bằng slug trong tập hợp listings từ Supabase
 * 3. Fallback mockListings (phục vụ môi trường phát triển / tin mẫu 1-9)
 */
export async function getListingBySlugOrIdServer(
  slugOrId: string,
  options?: {
    propertyType?: string;
    district?: string;
    transactionType?: 'mua-ban' | 'cho-thue';
  }
): Promise<ListingItem | null> {
  if (!slugOrId) return null;
  const cleanKey = slugOrId.trim();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanKey);

  // 1. Nếu là UUID hợp lệ, truy vấn trực tiếp bảng listings của Supabase
  if (isUuid) {
    try {
      const supabase = getServerSupabase();
      const { data: row } = await supabase
        .from('listings')
        .select('*, users!user_id(full_name, avatar_url, phone)')
        .eq('id', cleanKey)
        .maybeSingle();

      if (row) {
        return mapSupabaseListingToItem(row);
      }
    } catch (err) {
      console.warn('Lỗi query listing theo UUID:', err);
    }
  }

  // 2. Tải danh sách active listings từ Supabase để đối chiếu slug
  const dbListings = await getActiveListingsFromSupabase();

  if (dbListings.length > 0) {
    // A. Kiểm tra theo ID
    const foundById = dbListings.find((l) => l.id === cleanKey);
    if (foundById) return foundById;

    // B. Kiểm tra theo Slug
    const foundBySlug = findListingBySlug(
      cleanKey,
      options?.propertyType,
      options?.district,
      dbListings,
      options?.transactionType
    );
    if (foundBySlug) return foundBySlug;
  }

  // 3. Fallback: Kiểm tra trong mockListings
  const mockFoundById = mockListings.find((m) => m.id === cleanKey);
  if (mockFoundById) return mockFoundById;

  const mockFoundBySlug = findListingBySlug(
    cleanKey,
    options?.propertyType,
    options?.district,
    mockListings,
    options?.transactionType
  );
  if (mockFoundBySlug) return mockFoundBySlug;

  return null;
}

