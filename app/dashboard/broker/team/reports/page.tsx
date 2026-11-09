'use client';

import React, { Suspense } from 'react';
import { BrokerProfile } from '@/types/broker-nav';
import { TeamManagementBoard } from '@/components/dashboard/broker/team';

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

export default function BrokerTeamReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
      }
    >
      <TeamManagementBoard profile={DEFAULT_TPKD_PROFILE} initialTab="overrides" />
    </Suspense>
  );
}
