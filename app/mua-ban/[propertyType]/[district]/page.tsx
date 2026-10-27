import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { SearchContent } from '@/components/search/SearchContent';
import {
  CATEGORY_MAP,
  getDistrictNameFromSlug,
  getActiveListingsForCategoryAndDistrict,
  getValidCategoryDistrictPairs,
} from '@/lib/listing-slug';
import { mockListings } from '@/lib/mock-data';
import { createClient } from '@supabase/supabase-js';

interface DistrictCategoryPageProps {
  params: {
    propertyType: string;
    district: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Chỉ tạo trước các route thực sự có dữ liệu listing phù hợp (chống tạo landing page rỗng)
 */
export function generateStaticParams() {
  return getValidCategoryDistrictPairs(mockListings);
}

export async function generateMetadata({ params, searchParams }: DistrictCategoryPageProps): Promise<Metadata> {
  const { propertyType, district } = params;
  const category = CATEGORY_MAP[propertyType];
  const districtName = getDistrictNameFromSlug(district);
  if (!category || !districtName) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const canonicalUrl = `${baseUrl}/mua-ban/${propertyType}/${district}`;

  const hasFilterQueries = searchParams ? Object.keys(searchParams).length > 0 : false;

  return {
    title: `${category.name} tại ${districtName} - Cập Nhật Mới Nhất | HaNoi Realty`,
    description: `Danh sách ${category.name.toLowerCase()} tại ${districtName}, Hà Nội. Vị trí đẹp, quy hoạch minh bạch, giá tốt nhất.`,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(hasFilterQueries ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${category.name} tại ${districtName} - HaNoi Realty`,
      description: `Danh sách ${category.name.toLowerCase()} tại ${districtName}, Hà Nội`,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function DistrictCategoryPage({ params }: DistrictCategoryPageProps) {
  const { propertyType, district } = params;

  // 1. Kiểm tra Category hợp lệ
  const category = CATEGORY_MAP[propertyType];
  if (!category) {
    notFound();
  }

  // 2. Kiểm tra Quận/Huyện hợp lệ theo slug
  const districtName = getDistrictNameFromSlug(district);
  if (!districtName) {
    notFound();
  }

  // 3. Kiểm tra dữ liệu thực tế (chỉ tạo trang khi có listing phù hợp đang active)
  const localListings = getActiveListingsForCategoryAndDistrict(propertyType, district, mockListings);
  let hasActiveListings = localListings.length > 0;

  if (!hasActiveListings) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        let query = supabase
          .from('listings')
          .select('id')
          .ilike('district', `%${districtName}%`)
          .eq('status', 'active');

        if (category.type !== 'all') {
          query = query.eq('property_type', category.type);
        }

        const { data: dbData } = await query.limit(1);
        if (dbData && dbData.length > 0) {
          hasActiveListings = true;
        }
      }
    } catch {
      // Fallback khi không kết nối được database
    }
  }

  // NẾU KHÔNG CÓ DỮ LIỆU THỰC TẾ: Không tạo trang SEO rỗng -> Trả về 404 Not Found
  if (!hasActiveListings) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-page-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-500">
              Đang tải danh sách {category.name.toLowerCase()} tại {districtName}...
            </span>
          </div>
        </div>
      }
    >
      <SearchContent
        initialType={category.type}
        initialPurpose={category.purpose}
        categoryKeyword={category.keyword}
        initialDistrict={districtName}
        categoryTitle={`${category.name} tại ${districtName}`}
        enableCanonicalMeta={false}
      />
    </Suspense>
  );
}
