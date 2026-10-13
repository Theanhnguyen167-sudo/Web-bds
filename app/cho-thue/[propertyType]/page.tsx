import React, { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { SearchContent } from '@/components/search/SearchContent';
import { CATEGORY_MAP, SLUG_TO_PROPERTY_TYPE_MAP } from '@/lib/listing-slug';

interface RentCategoryPageProps {
  params: {
    propertyType: string;
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((propertyType) => ({
    propertyType,
  }));
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
