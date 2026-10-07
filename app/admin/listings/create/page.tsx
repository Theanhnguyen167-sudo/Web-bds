'use client';

import React from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CreateListingWizard } from '@/components/listing/CreateListingWizard';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function AdminCreateListingPage() {
  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader
        title="Đăng tin Bất động sản mới"
        breadcrumb="Tin đăng / Đăng tin BĐS"
      />

      <main className="p-6 max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                <Building2 className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-extrabold text-navy">
                Đăng tin Bất động sản mới (Admin)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Đăng bán hoặc cho thuê nhà đất, chung cư, biệt thự với quy trình chuẩn 6 bước.
            </p>
          </div>

          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-navy hover:bg-slate-100 border border-slate-200 bg-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại danh sách tin đăng</span>
          </Link>
        </div>

        {/* Reusing existing 6-step CreateListingWizard */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
          <React.Suspense
            fallback={
              <div className="py-20 text-center text-xs text-slate-400">
                Đang nạp trình đăng tin bất động sản...
              </div>
            }
          >
            <CreateListingWizard />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
