'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { findListingBySlug } from '@/lib/listing-slug';
import ListingDetailClient from '@/components/listing/ListingDetailClient';

interface ListingBySlugClientProps {
  propertyType: string;
  district: string;
  slug: string;
  initialListingId?: string;
  transactionType?: 'mua-ban' | 'cho-thue';
}

export function ListingBySlugClient({
  propertyType,
  district,
  slug,
  initialListingId,
  transactionType = 'mua-ban',
}: ListingBySlugClientProps) {
  const { listings } = useApp();

  // 1. Nếu server đã xác định được ID từ database / mock-data, ưu tiên dùng ngay
  // 2. Nếu server chưa có (listing mới tạo trên trình duyệt lưu localStorage), client tìm trong useApp().listings
  const targetListing = initialListingId
    ? listings.find((l) => l.id === initialListingId) || { id: initialListingId }
    : findListingBySlug(slug, propertyType, district, listings, transactionType);

  const listingId = targetListing?.id || initialListingId || '1';

  return <ListingDetailClient listingId={listingId} />;
}
