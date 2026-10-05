import React, { Suspense } from 'react';
import { SearchContent } from '@/components/search/SearchContent';
import { RENT_CATEGORY_CONFIG } from '@/lib/listing-slug';

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
