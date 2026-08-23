import { Metadata } from 'next';
import { mockListings } from '@/lib/mock-data';
import ListingDetailClient from '@/components/listing/ListingDetailClient';

interface ListingPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const listing = mockListings.find((l) => l.id === params.id) || mockListings[0];
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

export default function ListingPage({ params }: ListingPageProps) {
  return <ListingDetailClient listingId={params.id} />;
}
