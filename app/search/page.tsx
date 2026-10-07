import React, { Suspense } from 'react';
import { SearchContent } from '@/components/search/SearchContent';

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
