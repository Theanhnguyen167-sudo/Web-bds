'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  BookmarkCheck, 
  Sparkles, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import { BROKER_MOCK_LISTINGS } from '@/lib/data/broker-mock-listings';
import { BrokerListing } from '@/types/broker-listing';
import { BrokerProfile } from '@/types/broker-nav';
import { 
  OpenListingPool, 
  CuratedListings, 
  MarketingKitModal, 
  AccountRestrictedModal 
} from '@/components/dashboard/broker/listings';

// Dữ liệu profile mặc định
const DEFAULT_PROFILE: BrokerProfile = {
  id: 'usr_broker_01',
  fullName: 'Nguyễn Thế Anh',
  brokerCode: 'CTV-HN1089',
  email: 'theanh.nguyen@hanoirealty.vn',
  phone: '0912 888 999',
  role: 'ctv',
  verificationStatus: 'verified', // 'verified' | 'pending' | 'rejected'
  subscriptionTier: 'ctv_monthly', // 'free' | 'ctv_monthly' | 'tpkd_monthly' | 'expired'
  referralCode: 'CTV-HN1089',
  teamName: 'Đội nhóm Tây Hồ - Cầu Giấy',
};

interface BrokerListingsContentProps {
  forcedTab?: 'pool' | 'curated';
}

function BrokerListingsContent({ forcedTab }: BrokerListingsContentProps) {
  const searchParams = useSearchParams();
  const paramTab = searchParams.get('tab') === 'curated' ? 'curated' : 'pool';
  const effectiveInitialTab = forcedTab || paramTab;

  const [activeTab, setActiveTab] = useState<'pool' | 'curated'>(effectiveInitialTab);
  const [listings, setListings] = useState<BrokerListing[]>(BROKER_MOCK_LISTINGS);
  const [profile, setProfile] = useState<BrokerProfile>(DEFAULT_PROFILE);

  // Modals state
  const [selectedListingForKit, setSelectedListingForKit] = useState<BrokerListing | null>(null);
  const [restrictedFeature, setRestrictedFeature] = useState<string | null>(null);

  // Toggle lưu vào tủ hàng
  const handleToggleCurate = (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCurated: !item.isCurated } : item
      )
    );
  };

  // Xóa khỏi tủ hàng
  const handleRemoveCurated = (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCurated: false } : item
      )
    );
  };

  // Cập nhật ghi chú cá nhân
  const handleUpdateNote = (id: string, note: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, privateNote: note } : item
      )
    );
  };

  const curatedCount = listings.filter((l) => l.isCurated).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER TRANG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="h-7 w-7 text-blue-600" />
            Nguồn Hàng Môi Giới HaNoi Realty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kho mở cho toàn bộ CTV đủ điều kiện • 1 căn nhà 1 mã BĐS chuẩn • Không chia địa bàn độc quyền
          </p>
        </div>

        {/* Thanh chuyển đổi trạng thái hồ sơ để test nhanh */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1.5 text-[11px] self-start sm:self-auto border border-slate-200">
            <span className="font-bold text-slate-500 uppercase px-1">Test quyền:</span>
            <button
              onClick={() => setProfile({ ...profile, verificationStatus: 'verified', subscriptionTier: 'ctv_monthly' })}
              className={`px-2 py-0.5 rounded font-medium ${
                profile.verificationStatus === 'verified' && profile.subscriptionTier !== 'expired'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hợp lệ
            </button>
            <button
              onClick={() => setProfile({ ...profile, verificationStatus: 'pending' })}
              className={`px-2 py-0.5 rounded font-medium ${
                profile.verificationStatus === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chờ duyệt
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

      {/* TABS CHUYỂN ĐỔI: KHO NHÀ MỞ vs TỦ HÀNG CÁ NHÂN */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('pool')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'pool'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Kho Nhà Chung (Nguồn mở)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-mono ${
              activeTab === 'pool' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {listings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('curated')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'curated'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <BookmarkCheck className="h-4 w-4" />
          <span>Tủ Hàng Cá Nhân</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-mono ${
              activeTab === 'curated' ? 'bg-blue-700 text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {curatedCount}
          </span>
        </button>
      </div>

      {/* NỘI DUNG THEO TAB ĐƯỢC CHỌN */}
      {activeTab === 'pool' ? (
        <OpenListingPool
          listings={listings}
          profile={profile}
          onToggleCurate={handleToggleCurate}
          onOpenMarketingKit={(item) => setSelectedListingForKit(item)}
          onRestrictedClick={(feat) => setRestrictedFeature(feat)}
        />
      ) : (
        <CuratedListings
          listings={listings}
          profile={profile}
          onRemoveCurated={handleRemoveCurated}
          onUpdateNote={handleUpdateNote}
          onOpenMarketingKit={(item) => setSelectedListingForKit(item)}
          onGoToOpenPool={() => setActiveTab('pool')}
        />
      )}

      {/* MODAL 1: BỘ TIẾP THỊ MARKETING KIT */}
      <MarketingKitModal
        isOpen={!!selectedListingForKit}
        onClose={() => setSelectedListingForKit(null)}
        listing={selectedListingForKit}
        profile={profile}
      />

      {/* MODAL 2: CẢNH BÁO GIỚI HẠN TÀI KHOẢN (CHƯA DUYỆT / HẾT HẠN) */}
      <AccountRestrictedModal
        isOpen={!!restrictedFeature}
        onClose={() => setRestrictedFeature(null)}
        profile={profile}
        featureName={restrictedFeature || 'tính năng'}
      />
    </div>
  );
}

export default function BrokerListingsPage({ forcedTab }: { forcedTab?: 'pool' | 'curated' }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span>Đang tải kho nguồn hàng...</span>
          </div>
        </div>
      }
    >
      <BrokerListingsContent forcedTab={forcedTab} />
    </Suspense>
  );
}
