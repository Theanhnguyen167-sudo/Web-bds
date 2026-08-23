'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ReportViewer } from '@/components/ai-report/ReportViewer';

export default function ReportPage() {
  const params = useParams();
  const listingId = (params?.id as string) || '1';

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <ReportViewer listingId={listingId} />
      </main>
    </div>
  );
}
