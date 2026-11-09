import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { findListingBySlug, getListingUrl, getValidListingSlugParams } from '@/lib/listing-slug';
import { ListingBySlugClient } from '@/components/listing/ListingBySlugClient';

interface ListingSlugPageProps {
  params: {
    propertyType: string;
    district: string;
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function generateStaticParams() {
  return getValidListingSlugParams('mua-ban');
}

export async function generateMetadata({ params, searchParams }: ListingSlugPageProps): Promise<Metadata> {
  const { propertyType, district, slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

  const listing = findListingBySlug(slug, propertyType, district, undefined, 'mua-ban');
  if (!listing) return {};

  const canonicalUrl = `${baseUrl}${getListingUrl(listing)}`;
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  const title = `${listing.title} - HaNoi Realty`;
  const formattedPrice = listing ? ((listing.price || 0) / 1e9).toFixed(1) : '';
  const description = `${listing.area}m² · ${listing.district} · ${formattedPrice} tỷ VNĐ · ${listing.legalStatus || 'Sổ đỏ chính chủ'}`;

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

export default function ListingSlugPage({ params }: ListingSlugPageProps) {
  const { propertyType, district, slug } = params;

  // Tra cứu listing từ mock-data / database server-side
  const listing = findListingBySlug(slug, propertyType, district, undefined, 'mua-ban');

  if (listing) {
    const canonicalUrl = getListingUrl(listing);
    const currentPath = `/mua-ban/${propertyType}/${district}/${slug}`;

    // Nếu slug cũ, hoặc dùng ID thay vì slug, hoặc propertyType/district đã thay đổi:
    // Chuyển hướng 301/permanent vĩnh viễn trực tiếp sang URL mới (không redirect chain, không qua homepage)
    if (currentPath !== canonicalUrl) {
      permanentRedirect(canonicalUrl);
    }

    return (
      <ListingBySlugClient
        propertyType={propertyType}
        district={district}
        slug={slug}
        initialListingId={listing.id}
        transactionType="mua-ban"
      />
    );
  }

  // Nếu listing thực sự không tồn tại -> KHÔNG redirect về homepage, trả về 404 Not Found
  notFound();
}
