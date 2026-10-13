import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { SearchContent } from '@/components/search/SearchContent';
import {
  CATEGORY_MAP,
  getDistrictNameFromSlug,
  SLUG_TO_PROPERTY_TYPE_MAP,
  getDistrictSlug,
} from '@/lib/listing-slug';
import { mockListings, ListingItem } from '@/lib/mock-data';

interface RentDistrictCategoryPageProps {
  params: {
    propertyType: string;
    district: string;
  };
}

/**
 * Chỉ tạo trước các route thực sự có dữ liệu listing cho thuê phù hợp (chống tạo landing page rỗng)
 */
export function generateStaticParams() {
  const rentListings = mockListings.filter((l) => l.status === 'active' && l.purpose === 'rent');
  const validPairs = new Set<string>();

  for (const item of rentListings) {
    const propSlug = item.type === 'house' ? 'nha-pho' : item.type === 'apartment' ? 'chung-cu' : 'dat-nen';
    const distSlug = getDistrictSlug(item.district);
    if (distSlug) {
      validPairs.add(`${propSlug}:${distSlug}`);
    }
  }

  return Array.from(validPairs).map((pair) => {
    const [propertyType, district] = pair.split(':');
    return { propertyType, district };
  });
}

export default async function RentDistrictCategoryPage({ params }: RentDistrictCategoryPageProps) {
  const { propertyType, district } = params;

  // 1. Kiểm tra Category hợp lệ
  const rawProp = propertyType.toLowerCase();
  const category = CATEGORY_MAP[rawProp];
  const mappedType = SLUG_TO_PROPERTY_TYPE_MAP[rawProp] || category?.type;
  if (!category && !mappedType) {
    notFound();
  }

  // 2. Kiểm tra Quận/Huyện hợp lệ theo slug
  const districtName = getDistrictNameFromSlug(district);
  if (!districtName) {
    notFound();
  }

  // 3. Kiểm tra dữ liệu thực tế (chỉ tạo trang khi có listing cho thuê phù hợp đang active)
  const hasRentListings = mockListings.some((item) => {
    if (item.status && item.status !== 'active') return false;
    if (item.purpose !== 'rent') return false;
    if (mappedType && item.type !== mappedType) return false;
    const itemDistrictSlug = getDistrictSlug(item.district);
    return itemDistrictSlug === district.toLowerCase();
  });

  // NẾU KHÔNG CÓ DỮ LIỆU THỰC TẾ: Không tạo trang SEO rỗng -> Trả về 404 Not Found
  if (!hasRentListings) {
    notFound();
  }

  const categoryName = category?.name?.replace('Mua bán', 'Cho thuê') || `Cho thuê ${propertyType}`;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-page-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-500">
              Đang tải danh sách cho thuê tại {districtName}...
            </span>
          </div>
        </div>
      }
    >
      <SearchContent
        initialType={mappedType}
        initialPurpose="rent"
        initialDistrict={districtName}
        categoryTitle={`${categoryName} tại ${districtName}`}
        enableCanonicalMeta={false}
      />
    </Suspense>
  );
}
