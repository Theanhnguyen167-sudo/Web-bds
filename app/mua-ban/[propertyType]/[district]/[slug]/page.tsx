import { notFound } from 'next/navigation';
import { findListingBySlug } from '@/lib/listing-slug';
import { ListingBySlugClient } from '@/components/listing/ListingBySlugClient';

interface ListingSlugPageProps {
  params: {
    propertyType: string;
    district: string;
    slug: string;
  };
}

export default function ListingSlugPage({ params }: ListingSlugPageProps) {
  const { propertyType, district, slug } = params;

  // Tra cứu listing từ mock-data / database server-side
  const listing = findListingBySlug(slug, propertyType, district);

  return (
    <ListingBySlugClient
      propertyType={propertyType}
      district={district}
      slug={slug}
      initialListingId={listing?.id}
    />
  );
}
