'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { findListingBySlug } from '@/lib/listing-slug';
import { ListingItem } from '@/lib/mock-data';
import ListingDetailClient from '@/components/listing/ListingDetailClient';

interface ListingBySlugClientProps {
  propertyType: string;
  district: string;
  slug: string;
  initialListingId?: string;
  initialListing?: ListingItem | null;
  transactionType?: 'mua-ban' | 'cho-thue';
}

export function ListingBySlugClient({
  propertyType,
  district,
  slug,
  initialListingId,
  initialListing,
  transactionType = 'mua-ban',
}: ListingBySlugClientProps) {
  const { listings } = useApp();

  // 1. Ưu tiên dữ liệu initialListing được truyền trực tiếp từ Server Component
  // 2. Nếu chưa có, tìm trong listings của AppContext
  // 3. Tra cứu slug với tập listings hiện có
  const targetListing =
    initialListing ||
    (initialListingId ? listings.find((l) => l.id === initialListingId) : null) ||
    findListingBySlug(slug, propertyType, district, listings, transactionType);

  const listingId = targetListing?.id || initialListingId || slug;

  return <ListingDetailClient listingId={listingId} initialListing={initialListing || targetListing} />;
}
