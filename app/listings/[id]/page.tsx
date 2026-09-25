import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { mockListings, ListingItem } from '@/lib/mock-data';
import { parseLocationCoordinates } from '@/lib/utils';
import ListingDetailClient from '@/components/listing/ListingDetailClient';

interface ListingPageProps {
  params: { id: string };
}

async function getListingById(id: string): Promise<ListingItem | null> {
  // 1. Kiểm tra mockListings
  const mockFound = mockListings.find((l) => l.id === id);
  if (mockFound) return mockFound;

  // 2. Truy vấn Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdqfxsszpglbgvpcqfss.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key'
        ? process.env.SUPABASE_SERVICE_ROLE_KEY
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hOfzwTGd3VBWbXF1ur0JLw_9lLyM9ju';

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const { data: row } = await supabase
      .from('listings')
      .select('*, users!user_id(full_name, avatar_url, phone)')
      .eq('id', id)
      .maybeSingle();

    if (row) {
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

      const autoDescription =
        row.description && row.description.trim().length > 10
          ? row.description
          : `Bán ${row.title || 'bất động sản'} vị trí đắc địa tại ${row.address || row.district || 'Hà Nội'}.
- Diện tích: ${area}m², mặt tiền rộng thoáng, ô tô đỗ cửa hoặc vào nhà thuận tiện.
- Thiết kế hiện đại ${row.floors || 4} tầng kiên cố, công năng tối ưu gồm ${row.bedrooms || 3} phòng ngủ, ${row.bathrooms || 2} phòng tắm khép kín, phòng khách và phòng bếp sang trọng.
- Vị trí trung tâm khu vực ${row.district || 'Hà Nội'}, hạ tầng đồng bộ, gần trường học các cấp, bệnh viện, chợ dân sinh và trung tâm thương mại.
- Pháp lý: ${row.legal_status || 'Sổ đỏ chính chủ, pháp lý minh bạch'}, sẵn sàng công chứng sang tên ngay trong ngày.
- Thích hợp an cư lâu dài, mở văn phòng đại diện hoặc đầu tư cho thuê sinh lời cao.`;

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
        images,
        status: row.status || 'active',
        isFeatured: row.is_featured || false,
        views: row.views || 48,
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        planningZone: row.planning_zone || 'Đất ở đô thị',
        planningYear: row.planning_year || 2030,
        legalStatus: row.legal_status || 'Sổ đỏ chính chủ',
        direction: row.direction || 'Đông Nam',
        description: autoDescription,
        userId: row.user_id,
        authorName: row.users?.full_name || row.author_name || undefined,
        authorPhone: row.users?.phone || row.author_phone || undefined,
        authorEmail: row.author_email || undefined,
        authorAvatar: row.users?.avatar_url || row.author_avatar || undefined,
        users: row.users || undefined,
      };
    }
  } catch (e) {
    console.warn('Lỗi khi fetch listing trong Server Component:', e);
  }

  return null;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const listing = (await getListingById(params.id)) || mockListings[0];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  
  const ogUrl = new URL('/api/og/listing', baseUrl);
  ogUrl.searchParams.set('title', listing.title);
  ogUrl.searchParams.set('price', listing.price.toString());
  ogUrl.searchParams.set('area', listing.area.toString());
  ogUrl.searchParams.set('district', listing.district);
  ogUrl.searchParams.set('type', listing.type);
  ogUrl.searchParams.set('score', '82');
  ogUrl.searchParams.set('zone', listing.planningZone || 'Đất ở đô thị');
  if (listing.images?.[0]) {
    ogUrl.searchParams.set('image', listing.images[0]);
  }

  const formattedPrice = (listing.price / 1e9).toFixed(1);

  return {
    title: `${listing.title} - HaNoi Realty`,
    description: `${listing.area}m² · ${listing.district} · ${formattedPrice} tỷ VNĐ`,
    openGraph: {
      title: listing.title,
      description: `Giá: ${formattedPrice} tỷ · ${listing.area}m² · ${listing.district}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description: `Giá: ${formattedPrice} tỷ · ${listing.area}m² · ${listing.district}`,
      images: [ogUrl.toString()],
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const initialListing = await getListingById(params.id);
  return <ListingDetailClient listingId={params.id} initialListing={initialListing || undefined} />;
}
