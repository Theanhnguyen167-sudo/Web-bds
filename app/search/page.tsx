import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { SearchContent } from '@/components/search/SearchContent';

interface SearchPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const canonicalUrl = `${baseUrl}/search`;

  // Trang tìm kiếm có các tham số lọc/truy vấn không phải SEO landing page -> noindex, follow để tránh duplicate content (Patent US9063942B2)
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  return {
    title: 'Tìm Kiếm Bất Động Sản Hà Nội | HaNoi Realty',
    description: 'Tìm kiếm nhà đất, chung cư, biệt thự bán và cho thuê tại Hà Nội theo bản đồ quy hoạch, khoảng giá, diện tích và pháp lý.',
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !hasFilterQueries,
      follow: true,
    },
  };
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-page-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Đang tải trang tìm kiếm...</span>
          </div>
        </div>
      }
    >
      <SearchContent enableCanonicalMeta={true} />
    </Suspense>
  );
}
