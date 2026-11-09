import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { SearchContent } from '@/components/search/SearchContent';
import { RENT_CATEGORY_CONFIG } from '@/lib/listing-slug';

interface RentCategoryPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: RentCategoryPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const canonicalUrl = `${baseUrl}/cho-thue`;
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  return {
    title: 'Cho Thuê Nhà Đất, Căn Hộ, Mặt Bằng Hà Nội | HaNoi Realty',
    description: 'Danh sách bất động sản cho thuê chính chủ tại Hà Nội: Căn hộ chung cư, nhà riêng, mặt bằng kinh doanh, văn phòng giá tốt nhất.',
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasFilterQueries ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: 'Bất Động Sản Cho Thuê Hà Nội - HaNoi Realty',
      description: 'Danh sách bất động sản cho thuê chính chủ tại Hà Nội',
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function RentCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-page-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Đang tải bất động sản cho thuê...</span>
          </div>
        </div>
      }
    >
      <SearchContent
        initialType={RENT_CATEGORY_CONFIG.type}
        initialPurpose={RENT_CATEGORY_CONFIG.purpose}
        categoryTitle={RENT_CATEGORY_CONFIG.name}
        enableCanonicalMeta={false}
      />
    </Suspense>
  );
}
