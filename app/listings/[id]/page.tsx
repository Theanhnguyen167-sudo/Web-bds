import { Metadata } from 'next';
import { permanentRedirect, notFound } from 'next/navigation';
import { mockListings } from '@/lib/mock-data';
import { getListingUrl } from '@/lib/listing-slug';
import { getListingBySlugOrIdServer } from '@/lib/services/listing-lookup';

interface ListingPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const listing = (await getListingBySlugOrIdServer(params.id)) || mockListings[0];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const formattedPrice = ((listing.price || 0) / 1e9).toFixed(1);
  const pageUrl = listing ? `${baseUrl}${getListingUrl(listing)}` : `${baseUrl}/listings/${params.id}`;

  return {
    title: `${listing.title} - HaNoi Realty`,
    description: `${listing.area}m² · ${listing.district} · ${formattedPrice} tỷ VNĐ · ${listing.legalStatus || 'Sổ đỏ chính chủ'}`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: listing.title,
      description: `Giá: ${formattedPrice} tỷ · ${listing.area}m² · ${listing.district} · Pháp lý: ${listing.legalStatus || 'Sổ đỏ chính chủ'}`,
      url: pageUrl,
      images: [
        {
          url: listing.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
      type: 'website',
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  // Tra cứu thống nhất từ Supabase CSDL hoặc mock-data
  const listing = await getListingBySlugOrIdServer(params.id);

  if (listing) {
    // Chuyển hướng vĩnh viễn (Permanent redirect 301/308) từ URL cũ sang URL SEO chuẩn:
    // /listings/[id] -> /mua-ban/[loai-bds]/[quan]/[slug] hoặc /cho-thue/...
    permanentRedirect(getListingUrl(listing));
  }

  // Nếu listing thực sự không tồn tại trên hệ thống -> KHÔNG redirect về homepage, trả về 404 Not Found
  notFound();
}
