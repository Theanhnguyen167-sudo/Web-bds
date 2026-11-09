'use client';

import React, { useState } from 'react';
import { BrokerProfile, BrokerRole, SubscriptionTier, VerificationStatus } from '@/types/broker-nav';
import { BrokerSidebar } from './BrokerSidebar';
import { BrokerHeader } from './BrokerHeader';
import { BrokerAlertBanner } from './BrokerAlertBanner';

interface BrokerDashboardLayoutProps {
  children: React.ReactNode;
  initialProfile?: BrokerProfile;
}

// Dữ liệu mẫu khởi tạo chuẩn hoá theo cơ chế thực tế
const DEFAULT_PROFILE: BrokerProfile = {
  id: 'usr_broker_default',
  fullName: 'Nguyễn Thế Anh',
  brokerCode: 'CTV-HN1089',
  email: 'theanh.nguyen@hanoirealty.vn',
  phone: '0912 888 999',
  role: 'ctv', // Mặc định là CTV, có thể chuyển đổi sang TPKD để kiểm tra phân quyền
  verificationStatus: 'verified', // 'verified' | 'pending' | 'rejected'
  subscriptionTier: 'ctv_monthly', // 'free' | 'ctv_monthly' | 'tpkd_monthly' | 'expired'
  referralCode: 'CTV-HN1089',
  subscriptionExpiresAt: '2026-12-09T23:59:59Z',
  teamName: 'Đội nhóm Tây Hồ - Cầu Giấy',
  activeListingCount: 18,
  totalDealsClosed: 4,
};

export const BrokerDashboardLayout: React.FC<BrokerDashboardLayoutProps> = ({
  children,
  initialProfile = DEFAULT_PROFILE,
}) => {
  const [profile, setProfile] = useState<BrokerProfile>(initialProfile);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Helper cho phép môi giới hoặc tester chuyển đổi role/status nhanh khi phát triển
  const toggleRole = (newRole: BrokerRole) => {
    setProfile((prev) => ({
      ...prev,
      role: newRole,
      brokerCode: newRole === 'tpkd' ? 'TPKD-HN0021' : 'CTV-HN1089',
      referralCode: newRole === 'tpkd' ? 'TPKD-HN0021' : 'CTV-HN1089',
      subscriptionTier: newRole === 'tpkd' ? 'tpkd_monthly' : 'ctv_monthly',
    }));
  };

  const toggleSubscription = (tier: SubscriptionTier) => {
    setProfile((prev) => ({ ...prev, subscriptionTier: tier }));
  };

  const toggleVerification = (status: VerificationStatus) => {
    setProfile((prev) => ({ ...prev, verificationStatus: status }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* 1. Sticky Warning Banner (Expired subscription hoặc Hồ sơ chưa duyệt) */}
      <BrokerAlertBanner profile={profile} />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar Navigation */}
        <BrokerSidebar
          profile={profile}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 3. Main Content Area */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Top Header Bar */}
          <BrokerHeader
            profile={profile}
            onToggleSidebarMobile={() => setIsMobileSidebarOpen(true)}
          />

          {/* Thanh công cụ hỗ trợ kiểm thử quyền hạn trong môi trường phát triển (Dev Tooling Bar) */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  [DEV TEST BAR]
                </span>
                <span>Vai trò:</span>
                <button
                  onClick={() => toggleRole('ctv')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    profile.role === 'ctv' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  CTV (Cộng tác viên)
                </button>
                <button
                  onClick={() => toggleRole('tpkd')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    profile.role === 'tpkd' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  TPKD (Trưởng phòng KD)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span>Gói:</span>
                {(['free', 'ctv_monthly', 'tpkd_monthly', 'expired'] as SubscriptionTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => toggleSubscription(tier)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      profile.subscriptionTier === tier ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tier}
                  </button>
                ))}

                <span className="ml-2">Duyệt:</span>
                {(['verified', 'pending', 'rejected'] as VerificationStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleVerification(status)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      profile.verificationStatus === status ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nội dung trang con */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

