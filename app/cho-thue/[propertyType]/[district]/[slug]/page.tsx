import { notFound } from 'next/navigation';
import { findListingBySlug, getValidListingSlugParams } from '@/lib/listing-slug';
import { ListingBySlugClient } from '@/components/listing/ListingBySlugClient';

interface RentListingSlugPageProps {
  params: {
    propertyType: string;
    district: string;
    slug: string;
  };
}

export function generateStaticParams() {
  return getValidListingSlugParams('cho-thue');
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
