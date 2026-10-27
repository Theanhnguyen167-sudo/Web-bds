import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findListingBySlug, getValidListingSlugParams } from '@/lib/listing-slug';
import { ListingBySlugClient } from '@/components/listing/ListingBySlugClient';

interface RentListingSlugPageProps {
  params: {
    propertyType: string;
    district: string;
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function generateStaticParams() {
  return getValidListingSlugParams('cho-thue');
}

export async function generateMetadata({ params, searchParams }: RentListingSlugPageProps): Promise<Metadata> {
  const { propertyType, district, slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const canonicalUrl = `${baseUrl}/cho-thue/${propertyType}/${district}/${slug}`;

  const listing = findListingBySlug(slug, propertyType, district, undefined, 'cho-thue');
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  const title = listing ? `${listing.title} - HaNoi Realty` : `BĐS cho thuê tại ${district} - HaNoi Realty`;
  const formattedPrice = listing
    ? listing.price > 1e6
      ? `${(listing.price / 1e6).toFixed(0)} tr/tháng`
      : `${listing.price} đ`
    : '';
  const description = listing
    ? `${listing.area}m² · ${listing.district} · ${formattedPrice} · Cho thuê chính chủ`
    : `Xem chi tiết bất động sản cho thuê tại ${district}, Hà Nội`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasFilterQueries ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      ...(listing?.images?.[0]
        ? {
            images: [
              {
                url: listing.images[0],
                width: 1200,
                height: 630,
                alt: listing.title,
              },
            ],
          }
        : {}),
    },
  };
}

export default function RentListingSlugPage({ params }: RentListingSlugPageProps) {
  const { propertyType, district, slug } = params;

  // Tra cứu listing từ mock-data / database server-side cho giao dịch cho thuê
  const listing = findListingBySlug(slug, propertyType, district, undefined, 'cho-thue');

  return (
    <ListingBySlugClient
      propertyType={propertyType}
      district={district}
      slug={slug}
      initialListingId={listing?.id}
      transactionType="cho-thue"
    />
  );
}
