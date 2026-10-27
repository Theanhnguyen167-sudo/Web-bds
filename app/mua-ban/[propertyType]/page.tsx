import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { SearchContent } from '@/components/search/SearchContent';
import { CATEGORY_MAP, normalizeCategorySlug } from '@/lib/listing-slug';

interface CategoryPageProps {
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

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const normType = normalizeCategorySlug(params.propertyType) || params.propertyType;
  const category = CATEGORY_MAP[normType];
  if (!category) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const canonicalUrl = `${baseUrl}/mua-ban/${normType}`;

  // Kiểm tra faceted filter query params để chống duplicate content (Patent US9063942B2)
  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  return {
    title: `${category.name} Giá Tốt, Sổ Đỏ Chính Chủ | HaNoi Realty`,
    description: category.description,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasFilterQueries ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${category.name} Hà Nội - HaNoi Realty`,
      description: category.description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Chuyển hướng vĩnh viễn (301/308 permanent) các alias cũ sang URL chuẩn SEO
  if (params.propertyType === 'can-ho-chung-cu') {
    permanentRedirect('/mua-ban/chung-cu');
  }
  if (params.propertyType === 'nha-rieng') {
    permanentRedirect('/mua-ban/nha-pho');
  }
  if (params.propertyType === 'cho-thue') {
    permanentRedirect('/cho-thue');
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
