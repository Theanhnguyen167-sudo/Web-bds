'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReportViewer } from '@/components/ai-report/ReportViewer';
import { Loader2 } from 'lucide-react';

function ReportsContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams?.get('id') || '1';

  return <ReportViewer listingId={listingId} />;
}

export function ReportsClient() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex items-center justify-center gap-2 text-text-secondary text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <span>Đang tải báo cáo thẩm định AI...</span>
        </div>
      }
    >
      <ReportsContent />
    </Suspense>
  );
}
