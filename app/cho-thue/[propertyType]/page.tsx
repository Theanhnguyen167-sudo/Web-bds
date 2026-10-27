import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { SearchContent } from '@/components/search/SearchContent';
import { CATEGORY_MAP, SLUG_TO_PROPERTY_TYPE_MAP, normalizeCategorySlug } from '@/lib/listing-slug';

interface RentCategoryPageProps {
  params: {
    propertyType: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((propertyType) => ({
    propertyType,
  }));
}

export async function generateMetadata({ params, searchParams }: RentCategoryPageProps): Promise<Metadata> {
  const rawProp = params.propertyType.toLowerCase();
  const category = CATEGORY_MAP[rawProp];
  const mappedType = SLUG_TO_PROPERTY_TYPE_MAP[rawProp] || category?.type;
  if (!category && !mappedType) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const normType = normalizeCategorySlug(params.propertyType) || params.propertyType;
  const canonicalUrl = `${baseUrl}/cho-thue/${normType}`;
  const categoryName = category?.name?.replace('Mua bán', 'Cho thuê') || `Cho thuê ${params.propertyType}`;
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  return {
    title: `${categoryName} Giá Tốt, Vị Trí Đẹp | HaNoi Realty`,
    description: `Danh sách ${categoryName.toLowerCase()} chính chủ tại Hà Nội với đầy đủ thông tin tiện ích, pháp lý và mức giá thuê tốt nhất.`,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasFilterQueries ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${categoryName} Hà Nội - HaNoi Realty`,
      description: `Danh sách ${categoryName.toLowerCase()} tại Hà Nội`,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function RentCategoryPage({ params }: RentCategoryPageProps) {
  if (params.propertyType === 'can-ho-chung-cu') {
    redirect('/cho-thue/chung-cu');
  }
  if (params.propertyType === 'nha-rieng') {
    redirect('/cho-thue/nha-pho');
  }

  const rawProp = params.propertyType.toLowerCase();
  const category = CATEGORY_MAP[rawProp];
  const mappedType = SLUG_TO_PROPERTY_TYPE_MAP[rawProp] || category?.type;

  if (!category && !mappedType) {
    notFound();
  }

  const categoryName = category?.name?.replace('Mua bán', 'Cho thuê') || `Cho thuê ${params.propertyType}`;

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
        initialType={mappedType}
        initialPurpose="rent"
        categoryKeyword={category?.keyword}
        categoryTitle={categoryName}
        enableCanonicalMeta={false}
      />
    </Suspense>
  );
}
