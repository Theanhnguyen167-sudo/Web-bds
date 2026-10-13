import React, { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { SearchContent } from '@/components/search/SearchContent';
import { CATEGORY_MAP } from '@/lib/listing-slug';

interface CategoryPageProps {
  params: {
    propertyType: string;
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((propertyType) => ({
    propertyType,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Chuyển hướng các alias cũ sang URL chuẩn SEO
  if (params.propertyType === 'can-ho-chung-cu') {
    redirect('/mua-ban/chung-cu');
  }
  if (params.propertyType === 'nha-rieng') {
    redirect('/mua-ban/nha-pho');
  }
  if (params.propertyType === 'cho-thue') {
    redirect('/cho-thue');
  }

  const category = CATEGORY_MAP[params.propertyType];

  // Không tạo route giả: nếu không thuộc category hợp lệ thì trả về 404 Not Found
  if (!category) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-page-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Đang tải danh mục bất động sản...</span>
          </div>
        </div>
      }
    >
      <SearchContent
        initialType={category.type}
        initialPurpose={category.purpose}
        categoryKeyword={category.keyword}
        categoryTitle={category.name}
        enableCanonicalMeta={false}
      />
    </Suspense>
  );
}
