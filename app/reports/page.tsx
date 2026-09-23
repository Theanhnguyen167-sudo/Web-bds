'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ReportViewer } from '@/components/ai-report/ReportViewer';
import { Loader2 } from 'lucide-react';

function ReportsContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams?.get('id') || '1';

  return <ReportViewer listingId={listingId} />;
}

export default function ReportsIndexPage() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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
      </main>
    </div>
  );
}
