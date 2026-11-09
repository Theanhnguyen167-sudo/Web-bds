'use client';

import React, { Suspense } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Download, 
  KeyRound, 
  Loader2 
} from 'lucide-react';
import { BROKER_MOCK_AGREEMENTS } from '@/lib/data/broker-mock-deals';
import { AgreementsList } from '@/components/dashboard/broker/deals';

function BrokerAgreementsContent() {
  const signedCount = BROKER_MOCK_AGREEMENTS.filter((a) => a.status === 'signed').length;
  const pendingSignCount = BROKER_MOCK_AGREEMENTS.filter((a) => a.status !== 'signed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER & THỐNG KÊ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="h-7 w-7 text-indigo-600" />
            Hợp Đồng & Thỏa Thuận Phân Chia Hoa Hồng
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quy trình pháp lý phân tầng minh bạch: Đã đọc ➔ Đã xác nhận điều khoản ➔ Đã ký số điện tử
          </p>
        </div>
      </div>

      {/* 3 THẺ THỐNG KÊ VĂN BẢN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng văn bản pháp lý</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">{BROKER_MOCK_AGREEMENTS.length} văn bản</div>
          <span className="text-[10px] text-slate-400">Gắn theo từng deal và toàn sàn</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Đã ký số điện tử</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-700">{signedCount} hợp đồng</div>
          <span className="text-[10px] text-emerald-600">Đầy đủ hiệu lực giải ngân</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Chờ ký số</span>
          <div className="mt-1 text-2xl font-extrabold text-amber-700">{pendingSignCount} văn bản</div>
          <span className="text-[10px] text-amber-600">Cần xác nhận mã OTP</span>
        </div>
      </div>

      {/* DANH SÁCH HỢP ĐỒNG */}
      <AgreementsList initialAgreements={BROKER_MOCK_AGREEMENTS} />

    </div>
  );
}

export default function BrokerAgreementsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Đang tải danh sách hợp đồng & thỏa thuận...</span>
          </div>
        </div>
      }
    >
      <BrokerAgreementsContent />
    </Suspense>
  );
}

