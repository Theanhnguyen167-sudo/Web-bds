'use client';

import React, { useState, Suspense } from 'react';
import { BrokerProfile } from '@/types/broker-nav';
import { TeamManagementBoard } from '@/components/dashboard/broker/team';
import { Crown, Users2, ShieldAlert } from 'lucide-react';

const DEFAULT_TPKD_PROFILE: BrokerProfile = {
  id: 'usr_tpkd_01',
  fullName: 'Nguyễn Văn Minh',
  brokerCode: 'TPKD-HN0021',
  email: 'minh.nv@hanoirealty.vn',
  phone: '0903.281.999',
  role: 'tpkd',
  verificationStatus: 'verified',
  subscriptionTier: 'tpkd_monthly',
  referralCode: 'TPKD-HN0021',
  teamName: 'Đội nhóm Tây Hồ - Đống Đa',
  activeListingCount: 42,
  totalDealsClosed: 12,
};

function BrokerTeamContent() {
  const [profile, setProfile] = useState<BrokerProfile>(DEFAULT_TPKD_PROFILE);

  return (
    <div className="space-y-6">
      
      {/* Dev Test Bar cho phép kiểm tra phân quyền & trạng thái gói */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-900 flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-purple-600" />
              Dev Test Bar (Quản trị TPKD):
            </span>
            <span className="text-slate-600">
              Vai trò: <strong className="text-purple-800 uppercase">{profile.role}</strong> | Gói: <strong className="text-purple-800">{profile.subscriptionTier}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Đổi vai trò:</span>
            <button
              type="button"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  role: prev.role === 'tpkd' ? 'ctv' : 'tpkd',
                  brokerCode: prev.role === 'tpkd' ? 'CTV-HN1089' : 'TPKD-HN0021',
                }))
              }
              className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
                profile.role === 'tpkd'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {profile.role === 'tpkd' ? 'Đang là TPKD' : 'Đang là CTV'}
            </button>

            <span className="text-slate-400">|</span>

            <span className="text-slate-500 font-medium">Gói TPKD:</span>
            <button
              type="button"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  subscriptionTier:
                    prev.subscriptionTier === 'expired' ? 'tpkd_monthly' : 'expired',
                }))
              }
              className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
                profile.subscriptionTier === 'expired'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {profile.subscriptionTier === 'expired' ? 'Đang Hết Hạn (Expired)' : 'Đang Hoạt Động (Active)'}
            </button>
          </div>
        </div>
      )}

      {/* Main Board Component */}
      <TeamManagementBoard profile={profile} initialTab="members" />

    </div>
  );
}

export default function BrokerTeamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
      }
    >
      <BrokerTeamContent />
    </Suspense>
  );
}
