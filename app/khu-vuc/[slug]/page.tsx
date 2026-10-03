import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ListingCard } from '@/components/listing/ListingCard';
import { HANOI_DISTRICTS_HUB_DATA } from '@/lib/data/hanoi-districts-hub';
import { mockListings } from '@/lib/mock-data';
import { createClient } from '@supabase/supabase-js';
import {
  MapPin,
  TrendingUp,
  Layers,
  Train,
  Building,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface DistrictHubPageProps {
  params: { slug: string };
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

export async function generateStaticParams() {
  return Object.keys(HANOI_DISTRICTS_HUB_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: DistrictHubPageProps): Promise<Metadata> {
  const district = HANOI_DISTRICTS_HUB_DATA[params.slug];
  if (!district) return {};

  const pageUrl = `${baseUrl}/khu-vuc/${params.slug}`;

  return {
    title: `Bất Động Sản & Bản Đồ Quy Hoạch ${district.name} 2030 - 2045 | HaNoi Realty`,
    description: `Tra cứu danh sách nhà đất bán mới nhất tại ${district.name}, bảng giá đất trung bình ~${district.averagePriceHouseM2} tr/m², thông tin quy hoạch phân khu và tiến độ các tuyến Metro.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Bất Động Sản & Quy Hoạch ${district.name} - HaNoi Realty`,
      description: district.description,
      url: pageUrl,
      type: 'website',
    },
  };
}

async function getListingsByDistrict(districtName: string) {
  // 1. Lọc trong mockListings
  const localListings = mockListings.filter(
    (l) => l.district.toLowerCase().includes(districtName.toLowerCase()) || districtName.toLowerCase().includes(l.district.toLowerCase())
  );

  // 2. Query Supabase bổ sung
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
        ? process.env.SUPABASE_SERVICE_ROLE_KEY
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const { data: dbListings } = await supabase
      .from('listings')
      .select('*')
      .ilike('district', `%${districtName}%`)
      .eq('status', 'active')
      .limit(6);

    if (dbListings && dbListings.length > 0) {
      return [...localListings, ...dbListings.map((row) => ({
        id: row.id,
        title: row.title || 'BĐS Hà Nội',
        price: Number(row.price) || 5000000000,
        pricePerM2: row.price_per_m2 || 80000000,
        area: Number(row.area) || 60,
        floors: row.floors || 4,
        bedrooms: row.bedrooms || 3,
        bathrooms: row.bathrooms || 2,
        address: row.address || `${districtName}, Hà Nội`,
        district: row.district || districtName,
        ward: row.ward || '',
        lat: row.lat || 21.03,
        lng: row.lng || 105.80,
        type: row.property_type || 'house',
        images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'],
        status: row.status || 'active',
        isFeatured: row.is_featured || false,
        views: row.views || 40,
        createdAt: row.created_at ? row.created_at.split('T')[0] : '2025-08-18',
        planningZone: row.planning_zone || 'Đất ở đô thị',
        planningYear: row.planning_year || 2030,
        legalStatus: row.legal_status || 'Sổ đỏ chính chủ',
      }))];
    }
  } catch (e) {
    console.warn('Lỗi khi fetch listings theo quận:', e);
  }

  return localListings;
}

export default async function DistrictHubPage({ params }: DistrictHubPageProps) {
  const district = HANOI_DISTRICTS_HUB_DATA[params.slug];
  if (!district) {
    notFound();
  }

  const listings = await getListingsByDistrict(district.shortName);

  // Schema.org Place & RealEstateListing Hub
  const districtSchema = {
    '@context': 'https://schema.org',
    '@type': 'AdministrativeArea',
    name: district.name,
    description: district.description,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: district.lat,
      longitude: district.lng,
    },
    containedInPlace: {
      '@type': 'City',
      name: 'Hà Nội',
    },
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(districtSchema) }}
      />
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 space-y-10">
        
        {/* ── BREADCRUMB & HEADER HUB ── */}
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-slate-400">Khu vực Hà Nội</span>
            <span>/</span>
            <span className="font-bold text-slate-800">{district.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-extrabold text-accent">
                <MapPin className="h-4 w-4" />
                <span>Trọng Điểm Đầu Tư Bất Động Sản Hà Nội</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {district.name} · Bản Đồ Quy Hoạch & Bất Động Sản 2026
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {district.description}
              </p>
            </div>

            {/* Quick Stats Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Giá Nhà Phố TB</span>
                <div className="text-lg sm:text-xl font-black text-rose-600">~{district.averagePriceHouseM2} tr/m²</div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> {district.priceTrend} năm
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Giá Chung Cư TB</span>
                <div className="text-lg sm:text-xl font-black text-blue-600">~{district.averagePriceApartmentM2} tr/m²</div>
                <span className="text-[10px] font-semibold text-slate-400">Khảo sát thực tế</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Tin Đăng Mở Bán</span>
                <div className="text-lg sm:text-xl font-black text-accent">{listings.length}+ tin</div>
                <span className="text-[10px] font-semibold text-emerald-600">Đã kiểm duyệt</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── QUY HOẠCH & HẠ TẦNG METRO HIGHLIGHTS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột 1: Điểm nhấn quy hoạch */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Quy Hoạch Đô Thị {district.shortName} Đến 2030-2045</h3>
                <span className="text-xs text-slate-400">Trích xuất từ dữ liệu Sở QHKT Hà Nội</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {district.planningHighlights.map((plan, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{plan}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/planning?district=${encodeURIComponent(district.shortName)}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors pt-2"
            >
              <span>Xem trực tiếp trên Bản Đồ Quy Hoạch Số Hoá</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Cột 2: Tuyến Metro & Hạ tầng giao thông */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Train className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Mạng Lưới Đường Sắt Đô Thị Metro</h3>
                <span className="text-xs text-slate-400">Kết nối vùng và gia tăng giá trị BĐS</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {district.metroLines.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 font-semibold">
                  <Train className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Các tuyến phố huyết mạch:</span>
              <div className="flex flex-wrap gap-1.5">
                {district.keyStreets.map((street, sIdx) => (
                  <Link
                    key={sIdx}
                    href={`/streets`}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    📍 {street}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── DANH SÁCH BẤT ĐỘNG SẢN MỚI NHẤT TẠI QUẬN ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Danh Sách Nhà Đất Bán Nổi Bật Tại {district.name}
              </h2>
              <p className="text-xs text-slate-500">Tin đăng chính chủ đã xác thực toạ độ và tình trạng quy hoạch</p>
            </div>

            <Link
              href={`/search?district=${encodeURIComponent(district.shortName)}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors"
            >
              <span>Xem toàn bộ BĐS {district.shortName}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 6).map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
              Hiện chưa có tin đăng bán mới tại {district.name}. Vui lòng quay lại sau!
            </div>
          )}
        </div>

        {/* ── CÁC DỰ ÁN & ĐẠI ĐÔ THỊ TIÊU BIỂU ── */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0a1128] rounded-3xl p-6 sm:p-8 text-white space-y-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-extrabold">Các Dự Án & Khu Đô Thị Nổi Tiếng Tại {district.name}</h3>
          </div>
          <p className="text-xs text-slate-300">
            Khu vực tập trung các đại dự án bất động sản cao cấp, văn phòng hạng A và các tiện ích thương mại tầm cỡ:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {district.keyProjects.map((proj, pIdx) => (
              <span key={pIdx} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all">
                🏢 {proj}
              </span>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
