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
  getValidCategoryDistrictPairs,
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

interface DistrictCategoryPageProps {
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
 * Sinh nội dung mô tả ngắn độc bản cho từng quận và từng loại BĐS (chống copy trùng lặp)
 */
function generateDistrictCategoryDescription(
  propertyTypeName: string,
  districtSlug: string,
  districtName: string
): string {
  const hub = HANOI_DISTRICTS_HUB_DATA[districtSlug];
  const isApartment = propertyTypeName.toLowerCase().includes('chung cư');
  const priceText = isApartment
    ? (hub?.averagePriceApartmentM2 ? `khoảng ~${hub.averagePriceApartmentM2} triệu/m²` : 'mức giá cạnh tranh')
    : (hub?.averagePriceHouseM2 ? `trung bình ~${hub.averagePriceHouseM2} triệu/m²` : 'mức giá phù hợp');

  const streetsText = hub?.keyStreets && hub.keyStreets.length > 0
    ? `trên các trục đường huyết mạch như ${hub.keyStreets.slice(0, 4).join(', ')}`
    : `tại các trục giao thông trọng điểm`;

  const highlights = hub?.planningHighlights && hub.planningHighlights.length > 0
    ? `Khu vực hưởng lợi từ quy hoạch hạ tầng: ${hub.planningHighlights[0]}.`
    : '';

  return `Thị trường ${propertyTypeName.toLowerCase()} tại ${districtName}, Hà Nội luôn ghi nhận sự quan tâm lớn từ người mua ở thực và nhà đầu tư nhờ hạ tầng hoàn thiện và tính thanh khoản cao. Các bất động sản tập trung ${streetsText} với mức giá tham chiếu ${priceText}. ${highlights} Toàn bộ tin đăng đều có pháp lý minh bạch, quy hoạch ổn định, đáp ứng đa dạng nhu cầu an cư và tích lũy tài sản.`;
}

/**
 * Truy vấn danh sách tin đăng active thực tế cho cặp (propertyType, district)
 */
async function getActiveListings(propertyType: string, districtSlug: string): Promise<ListingItem[]> {
  const districtName = getDistrictNameFromSlug(districtSlug);
  const category = CATEGORY_MAP[propertyType];
  const targetType = category ? category.type : propertyType;

  // 1. Lọc từ mockListings
  const localListings = mockListings.filter((item) => {
    if (item.status && item.status !== 'active') return false;
    const itemPurpose = item.purpose || 'sale';
    if (itemPurpose !== 'sale') return false;

    if (targetType && targetType !== 'all') {
      const itType = item.type || (item as any).propertyType;
      if (itType !== targetType) return false;
    }

    if (category?.keyword) {
      const kw = category.keyword.toLowerCase();
      const match =
        (item.title && item.title.toLowerCase().includes(kw)) ||
        (item.address && item.address.toLowerCase().includes(kw)) ||
        (item.description && item.description.toLowerCase().includes(kw));
      if (!match) return false;
    }

    const dSlug = getDistrictSlug(item.district);
    return dSlug === districtSlug.toLowerCase();
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
        .eq('purpose', 'sale');

      if (districtName) {
        query = query.ilike('district', `%${districtName}%`);
      }
      if (targetType && targetType !== 'all') {
        query = query.eq('property_type', targetType);
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
                title: row.title || 'BĐS Hà Nội',
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
                    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'],
                status: row.status || 'active',
                isFeatured: row.is_featured || false,
                views: row.views || 50,
                createdAt: row.created_at ? row.created_at.split('T')[0] : '2025-08-18',
                planningZone: row.planning_zone || 'Đất ở đô thị',
                planningYear: row.planning_year || 2030,
                legalStatus: row.legal_status || 'Sổ đỏ chính chủ',
                purpose: (row.purpose as any) || 'sale',
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
 * Chỉ tạo trước các route thực sự có dữ liệu listing phù hợp (chống tạo landing page rỗng)
 */
export function generateStaticParams() {
  return getValidCategoryDistrictPairs(mockListings);
}

export async function generateMetadata({ params, searchParams }: DistrictCategoryPageProps): Promise<Metadata> {
  const { propertyType, district } = params;
  const category = CATEGORY_MAP[propertyType];
  const districtName = getDistrictNameFromSlug(district);
  if (!category || !districtName) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const canonicalUrl = `${baseUrl}/mua-ban/${propertyType}/${district}`;
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  return {
    title: `${category.name} tại ${districtName}, Hà Nội - Cập Nhật Mới Nhất | HaNoi Realty`,
    description: `Danh sách ${category.name.toLowerCase()} tại ${districtName}, Hà Nội. Vị trí đẹp, quy hoạch minh bạch, giá tốt nhất.`,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasFilterQueries ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${category.name} tại ${districtName}, Hà Nội - HaNoi Realty`,
      description: `Danh sách ${category.name.toLowerCase()} tại ${districtName}, Hà Nội`,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function DistrictCategoryPage({ params }: DistrictCategoryPageProps) {
  const { propertyType, district } = params;

  // 1. Kiểm tra Category hợp lệ
  const category = CATEGORY_MAP[propertyType];
  if (!category) {
    notFound();
  }

  // 2. Kiểm tra Quận/Huyện hợp lệ theo slug
  const districtName = getDistrictNameFromSlug(district);
  if (!districtName) {
    notFound();
  }

  // 3. Kiểm tra dữ liệu thực tế: Không tạo landing page nếu không có dữ liệu phù hợp
  const listings = await getActiveListings(propertyType, district);
  if (listings.length === 0) {
    notFound();
  }

  // 4. Sinh mô tả ngắn dynamic cho khu vực
  const districtDescription = generateDistrictCategoryDescription(
    category.name,
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
          <Link href="/mua-ban" className="hover:text-slate-900 transition-colors shrink-0">
            Mua bán BĐS
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          <Link href={`/mua-ban/${propertyType}`} className="hover:text-slate-900 transition-colors shrink-0">
            {category.name.replace('Mua bán ', '')}
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
                {category.name} tại {districtName}, Hà Nội
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
              href={`/search?type=${category.type}&district=${encodeURIComponent(districtName)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-center"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Xem trên Bản đồ</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* NỘI DUNG MÔ TẢ NGẮN VỀ KHU VỰC (DYNAMIC THEO LOẠI BĐS & QUẬN) */}
          <div className="text-slate-600 text-sm leading-relaxed pt-1">
            <p>{districtDescription}</p>
          </div>
        </div>

        {/* ── DANH SÁCH LISTING PHÙ HỢP (GRID 3 CỘT) ── */}
        <section className="space-y-4 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span>Danh sách {category.name.toLowerCase()} tại {districtName}</span>
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
            {/* Cột 1: Internal links loại BĐS khác tại cùng quận */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bất động sản khác tại {districtName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherTypesInDistrict.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/mua-ban/${item.slug}/${district}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-semibold border border-slate-200/70 hover:border-orange-200 transition-all shadow-xs"
                  >
                    <span>{item.name} tại {districtName}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Cột 2: Các khu vực liên quan (cùng loại BĐS tại các quận lân cận) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {category.name.replace('Mua bán ', '')} tại các khu vực lân cận
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearbyDistricts.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/mua-ban/${propertyType}/${d.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-semibold border border-slate-200/70 hover:border-orange-200 transition-all shadow-xs"
                  >
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{category.name.replace('Mua bán ', '')} {d.name}</span>
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
