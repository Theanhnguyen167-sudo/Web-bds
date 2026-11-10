'use client';

import React, { useState, Suspense } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Coins, 
  TrendingUp, 
  Loader2 
} from 'lucide-react';
import { BROKER_MOCK_DEALS } from '@/lib/data/broker-mock-deals';
import { BrokerProfile } from '@/types/broker-nav';
import { DealMasterList } from '@/components/dashboard/broker/deals';

const DEFAULT_PROFILE: BrokerProfile = {
  id: 'usr_broker_01',
  fullName: 'Nguyễn Thế Anh',
  brokerCode: 'CTV-HN1089',
  email: 'theanh.nguyen@hanoirealty.vn',
  phone: '0912 888 999',
  role: 'ctv',
  verificationStatus: 'verified',
  subscriptionTier: 'ctv_monthly',
  referralCode: 'CTV-HN1089',
  teamName: 'Đội nhóm Tây Hồ - Cầu Giấy',
};

function BrokerDealsContent() {
  const [profile, setProfile] = useState<BrokerProfile>(DEFAULT_PROFILE);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER & QUY TẮC PHÒNG DEAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="h-7 w-7 text-blue-600" />
            Phòng Quản Lý Giao Dịch (Deal Room)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quy trình 4 giai đoạn minh bạch: Thương lượng ➔ Thỏa thuận cọc ➔ Công chứng ➔ Bàn giao & Tất toán
          </p>
        </div>

        {/* Dev test status */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1.5 text-[11px] self-start sm:self-auto border border-slate-200">
            <span className="font-bold text-slate-500 uppercase px-1">Test quyền:</span>
            <button
              onClick={() => setProfile({ ...profile, subscriptionTier: 'ctv_monthly' })}
              className={`px-2 py-0.5 rounded font-medium ${
                profile.subscriptionTier === 'ctv_monthly'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gói hoạt động
            </button>
            <button
              onClick={() => setProfile({ ...profile, subscriptionTier: 'expired' })}
              className={`px-2 py-0.5 rounded font-medium ${
                profile.subscriptionTier === 'expired'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hết hạn gói
            </button>
          </div>
        )}
      </div>

      {/* BANNER NGUYÊN TẮC BẢO VỆ HOA HỒNG */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3.5 text-xs text-blue-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Quyền lợi bất khả xâm phạm của môi giới:</strong> Kể cả khi tài khoản CTV hết hạn gói dịch vụ, <em>toàn bộ tiến độ deal, hồ sơ thỏa thuận và khoản hoa hồng đã phát sinh hợp lệ vẫn được bảo lưu 100%</em> và giải ngân đúng hạn khi giao dịch hoàn tất.
        </div>
      </div>

      {/* DANH SÁCH & KANBAN GIAO DỊCH */}
      <DealMasterList initialDeals={BROKER_MOCK_DEALS} profile={profile} />

    </div>
  );
}

export default function BrokerDealsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span>Đang tải phòng giao dịch Deal Room...</span>
          </div>
        </div>
      }
    >
      <BrokerDealsContent />
    </Suspense>
  );
}

