import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ListingCard } from '@/components/listing/ListingCard';
import {
  CATEGORY_MAP,
  getDistrictNameFromSlug,
  getDistrictSlug,
  SLUG_TO_PROPERTY_TYPE_MAP,
} from '@/lib/listing-slug';
import { HANOI_DISTRICTS_HUB_DATA } from '@/lib/data/hanoi-districts-hub';
import { mockListings, ListingItem } from '@/lib/mock-data';
import { createClient } from '@supabase/supabase-js';
import {
  Home,
  ChevronRight,
  Building,
  MapPin,
  Compass,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface RentDistrictCategoryPageProps {
  params: {
    propertyType: string;
    district: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const POPULAR_DISTRICTS = [
  { slug: 'dong-da', name: 'Đống Đa' },
  { slug: 'cau-giay', name: 'Cầu Giấy' },
  { slug: 'ba-dinh', name: 'Ba Đình' },
  { slug: 'thanh-xuan', name: 'Thanh Xuân' },
  { slug: 'tay-ho', name: 'Tây Hồ' },
  { slug: 'hai-ba-trung', name: 'Hai Bà Trưng' },
  { slug: 'nam-tu-liem', name: 'Nam Từ Liêm' },
  { slug: 'hoan-kiem', name: 'Hoàn Kiếm' },
  { slug: 'long-bien', name: 'Long Biên' },
];

const SILO_PROPERTY_TYPES = [
  { slug: 'nha-pho', name: 'Nhà phố' },
  { slug: 'chung-cu', name: 'Chung cư' },
  { slug: 'biet-thu', name: 'Biệt thự' },
  { slug: 'dat-nen', name: 'Đất nền' },
  { slug: 'nha-mat-pho', name: 'Nhà mặt phố' },
];

/**
 * Sinh nội dung mô tả ngắn độc bản cho từng quận cho thuê (chống copy trùng lặp)
 */
function generateRentDistrictDescription(
  propertyTypeName: string,
  districtSlug: string,
  districtName: string
): string {
  const hub = HANOI_DISTRICTS_HUB_DATA[districtSlug];
  const streetsText = hub?.keyStreets && hub.keyStreets.length > 0
    ? `tại các tuyến phố sầm uất như ${hub.keyStreets.slice(0, 4).join(', ')}`
    : `tại các trục đường chính`;

  const highlights = hub?.planningHighlights && hub.planningHighlights.length > 0
    ? `Khu vực sở hữu lợi thế hạ tầng: ${hub.planningHighlights[0]}.`
    : '';

  return `Thị trường cho thuê ${propertyTypeName.toLowerCase()} tại ${districtName}, Hà Nội thu hút lượng lớn khách thuê là các gia đình, chuyên gia và doanh nghiệp nhờ vị trí giao thông kết nối linh hoạt ${streetsText}. ${highlights} Nguồn hàng được cập nhật liên tục với đầy đủ tiện nghi, giá thuê minh bạch và hợp đồng thuê an toàn, pháp lý rõ ràng.`;
}

/**
 * Truy vấn danh sách tin đăng cho thuê active thực tế cho cặp (propertyType, district)
 */
async function getActiveRentListings(propertyType: string, districtSlug: string): Promise<ListingItem[]> {
  const districtName = getDistrictNameFromSlug(districtSlug);
  const rawProp = propertyType.toLowerCase();
  const category = CATEGORY_MAP[rawProp];
  const mappedType = SLUG_TO_PROPERTY_TYPE_MAP[rawProp] || category?.type;

  // 1. Lọc từ mockListings
  const localListings = mockListings.filter((item) => {
    if (item.status && item.status !== 'active') return false;
    if (item.purpose !== 'rent') return false;
    if (mappedType && item.type !== mappedType) return false;
    const itemDistrictSlug = getDistrictSlug(item.district);
    return itemDistrictSlug === districtSlug.toLowerCase();
  });

  // 2. Fetch bổ sung từ Supabase nếu có cấu hình
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
        ? process.env.SUPABASE_SERVICE_ROLE_KEY
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('purpose', 'rent');

      if (districtName) {
        query = query.ilike('district', `%${districtName}%`);
      }
      if (mappedType && mappedType !== 'all') {
        query = query.eq('property_type', mappedType);
      }

      const { data: dbData } = await query.limit(20);
      if (dbData && dbData.length > 0) {
        const localIds = new Set(localListings.map((l) => l.id));
        const newFromDb = dbData
          .filter((row) => !localIds.has(row.id))
          .map(
            (row) =>
              ({
                id: row.id,
                title: row.title || 'BĐS Cho Thuê Hà Nội',
                price: Number(row.price) || 0,
                pricePerM2: row.price_per_m2 || 0,
                area: Number(row.area) || 0,
                floors: row.floors || 1,
                bedrooms: row.bedrooms || 1,
                bathrooms: row.bathrooms || 1,
                address: row.address || `${districtName}, Hà Nội`,
                district: row.district || districtName,
                ward: row.ward || '',
                lat: row.lat || 21.0285,
                lng: row.lng || 105.8542,
                type: row.property_type || 'house',
                images:
                  Array.isArray(row.images) && row.images.length > 0
                    ? row.images
                    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'],
                status: row.status || 'active',
                isFeatured: row.is_featured || false,
                views: row.views || 45,
                createdAt: row.created_at ? row.created_at.split('T')[0] : '2025-08-18',
                planningZone: row.planning_zone || 'Đất ở đô thị',
                planningYear: row.planning_year || 2030,
                legalStatus: row.legal_status || 'Sổ đỏ chính chủ',
                purpose: 'rent',
                slug: row.slug,
              } as ListingItem)
          );
        return [...localListings, ...newFromDb];
      }
    }
  } catch {
    // Fallback an toàn về localListings
  }

  return localListings;
}

/**
 * Chỉ tạo trước các route thực sự có dữ liệu listing cho thuê phù hợp (chống tạo landing page rỗng)
 */
export function generateStaticParams() {
  const rentListings = mockListings.filter((l) => l.status === 'active' && l.purpose === 'rent');
  const validPairs = new Set<string>();

  for (const item of rentListings) {
    const propSlug = item.type === 'house' ? 'nha-pho' : item.type === 'apartment' ? 'chung-cu' : 'dat-nen';
    const distSlug = getDistrictSlug(item.district);
    if (distSlug) {
      validPairs.add(`${propSlug}:${distSlug}`);
    }
  }

  return Array.from(validPairs).map((pair) => {
    const [propertyType, district] = pair.split(':');
    return { propertyType, district };
  });
}

export async function generateMetadata({ params, searchParams }: RentDistrictCategoryPageProps): Promise<Metadata> {
  const { propertyType, district } = params;
  const rawProp = propertyType.toLowerCase();
  const category = CATEGORY_MAP[rawProp];
  const mappedType = SLUG_TO_PROPERTY_TYPE_MAP[rawProp] || category?.type;
  const districtName = getDistrictNameFromSlug(district);
  if ((!category && !mappedType) || !districtName) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const canonicalUrl = `${baseUrl}/cho-thue/${propertyType}/${district}`;
  const categoryName = category?.name?.replace('Mua bán', 'Cho thuê') || `Cho thuê ${propertyType}`;
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  return {
    title: `${categoryName} tại ${districtName}, Hà Nội - Cập Nhật Mới Nhất | HaNoi Realty`,
    description: `Danh sách ${categoryName.toLowerCase()} tại ${districtName}, Hà Nội. Vị trí đẹp, giá thuê tốt nhất.`,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasFilterQueries ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${categoryName} tại ${districtName}, Hà Nội - HaNoi Realty`,
      description: `Danh sách ${categoryName.toLowerCase()} tại ${districtName}, Hà Nội`,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function RentDistrictCategoryPage({ params }: RentDistrictCategoryPageProps) {
  const { propertyType, district } = params;

  // 1. Kiểm tra Category hợp lệ
  const rawProp = propertyType.toLowerCase();
  const category = CATEGORY_MAP[rawProp];
  const mappedType = SLUG_TO_PROPERTY_TYPE_MAP[rawProp] || category?.type;
  if (!category && !mappedType) {
    notFound();
  }

  // 2. Kiểm tra Quận/Huyện hợp lệ theo slug
  const districtName = getDistrictNameFromSlug(district);
  if (!districtName) {
    notFound();
  }

  // 3. Kiểm tra dữ liệu thực tế: Không tạo landing page nếu không có dữ liệu phù hợp
  const listings = await getActiveRentListings(propertyType, district);
  if (listings.length === 0) {
    notFound();
  }

  const categoryName = category?.name?.replace('Mua bán', 'Cho thuê') || `Cho thuê ${propertyType}`;

  // 4. Sinh mô tả ngắn dynamic cho khu vực cho thuê
  const districtDescription = generateRentDistrictDescription(
    categoryName,
    district,
    districtName
  );

  // 5. Liên kết ngữ nghĩa cùng khu vực & quận lân cận
  const otherTypesInDistrict = SILO_PROPERTY_TYPES.filter((t) => t.slug !== propertyType).slice(0, 4);
  const nearbyDistricts = POPULAR_DISTRICTS.filter((d) => d.slug !== district.toLowerCase()).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* ── BREADCRUMB CHUẨN SEMANTIC SILO ── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 py-4 overflow-x-auto no-scrollbar whitespace-nowrap"
        >
          <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1 shrink-0">
            <Home className="h-3.5 w-3.5 text-slate-400" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          <Link href="/cho-thue" className="hover:text-slate-900 transition-colors shrink-0">
            Cho thuê BĐS
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          <Link href={`/cho-thue/${propertyType}`} className="hover:text-slate-900 transition-colors shrink-0">
            {categoryName.replace('Cho thuê ', '')}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-semibold shrink-0" aria-current="page">
            {districtName}
          </span>
        </nav>

        {/* ── HERO BANNER: H1, SỐ LƯỢNG LISTING & MÔ TẢ KHU VỰC ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              {/* H1 RÕ RÀNG */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {categoryName} tại {districtName}, Hà Nội
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {/* SỐ LƯỢNG LISTING */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs sm:text-sm font-bold border border-orange-200/80">
                  <Building className="h-3.5 w-3.5 text-orange-600" />
                  Hiện có {listings.length} bất động sản
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {districtName}, Hà Nội
                </span>
              </div>
            </div>

            <Link
              href={`/search?purpose=rent&type=${mappedType || 'all'}&district=${encodeURIComponent(districtName)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-center"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Xem trên Bản đồ</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* NỘI DUNG MÔ TẢ NGẮN VỀ KHU VỰC CHO THUÊ (DYNAMIC) */}
          <div className="text-slate-600 text-sm leading-relaxed pt-1">
            <p>{districtDescription}</p>
          </div>
        </div>

        {/* ── DANH SÁCH LISTING CHO THUÊ (GRID 3 CỘT) ── */}
        <section className="space-y-4 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span>Danh sách {categoryName.toLowerCase()} tại {districtName}</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Cập nhật liên tục 24/7
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>

        {/* ── KHU VỰC LIÊN KẾT SEMANTIC SILO & CÁC KHU VỰC LIÊN QUAN ── */}
        <section className="pt-8 border-t border-slate-200/80 space-y-6">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-orange-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Khám phá liên quan trong cùng Semantic Silo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            {/* Cột 1: Internal links loại BĐS khác cho thuê tại cùng quận */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cho thuê BĐS khác tại {districtName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherTypesInDistrict.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/cho-thue/${item.slug}/${district}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-semibold border border-slate-200/70 hover:border-orange-200 transition-all shadow-xs"
                  >
                    <span>Cho thuê {item.name} tại {districtName}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Cột 2: Các khu vực liên quan (cùng loại BĐS tại các quận lân cận) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {categoryName.replace('Cho thuê ', '')} tại các khu vực lân cận
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearbyDistricts.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/cho-thue/${propertyType}/${d.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-semibold border border-slate-200/70 hover:border-orange-200 transition-all shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{categoryName.replace('Cho thuê ', '')} {d.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
