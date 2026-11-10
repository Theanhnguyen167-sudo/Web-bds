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
import {
  addListingToCurated,
  removeListingFromCurated,
  updateCuratedListingNote,
} from '@/lib/services/broker-curated-service';
import { useApp } from '@/lib/context/AppContext';

// Dữ liệu profile mặc định khi chưa có thông tin đăng nhập
const DEFAULT_PROFILE: BrokerProfile = {
  id: 'usr_guest',
  fullName: 'Cộng tác viên mới',
  brokerCode: 'CTV-CHODUYET',
  email: '',
  phone: '',
  role: 'ctv',
  verificationStatus: 'pending', // Mặc định chưa duyệt, khoá thông tin nội bộ
  subscriptionTier: 'free',
  referralCode: '',
  teamName: 'Đội nhóm kinh doanh',
};

interface BrokerListingsContentProps {
  forcedTab?: 'pool' | 'curated';
}

function BrokerListingsContent({ forcedTab }: BrokerListingsContentProps) {
  const { user } = useApp();
  const searchParams = useSearchParams();
  const paramTab = searchParams.get('tab') === 'curated' ? 'curated' : 'pool';
  const effectiveInitialTab = forcedTab || paramTab;

  const effectiveProfile = React.useMemo<BrokerProfile>(() => {
    if (user) {
      const isBrokerRole = user.role === 'agent' || user.role === 'broker' || user.role === 'tpkd' || user.role === 'admin';
      const isVerified = user.role === 'admin' || user.verificationStatus === 'verified';
      const isTpkd = user.role === 'tpkd' || user.package?.toLowerCase().includes('tpkd');
      return {
        id: user.id,
        fullName: user.name || 'Cộng tác viên',
        brokerCode: user.agentCode || `CTV-${user.id.slice(0, 6).toUpperCase()}`,
        email: user.email || '',
        phone: user.phone || '',
        role: isTpkd ? 'tpkd' : 'ctv',
        verificationStatus: isBrokerRole && isVerified ? 'verified' : ((user.verificationStatus as any) === 'rejected' ? 'rejected' : 'pending'),
        subscriptionTier: isTpkd ? 'tpkd_monthly' : (user.package?.toLowerCase().includes('free') ? 'free' : 'ctv_monthly'),
        referralCode: user.agentCode || user.id,
        teamName: 'Đội nhóm kinh doanh',
      };
    }
    return DEFAULT_PROFILE;
  }, [user]);

  const [activeTab, setActiveTab] = useState<'pool' | 'curated'>(effectiveInitialTab);
  const [listings, setListings] = useState<BrokerListing[]>(BROKER_MOCK_LISTINGS);
  const [profile, setProfile] = useState<BrokerProfile>(effectiveProfile);

  React.useEffect(() => {
    setProfile(effectiveProfile);
  }, [effectiveProfile]);

  // Modals state
  const [selectedListingForKit, setSelectedListingForKit] = useState<BrokerListing | null>(null);
  const [restrictedFeature, setRestrictedFeature] = useState<string | null>(null);

  // Toggle lưu vào tủ hàng (CHỈ INSERT/DELETE BẢNG broker_curated_listings, KHÔNG NHÂN BẢN BĐS)
  const handleToggleCurate = async (id: string) => {
    const target = listings.find((item) => item.id === id);
    if (!target) return;
    const nextCurated = !target.isCurated;

    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCurated: nextCurated } : item
      )
    );

    if (nextCurated) {
      await addListingToCurated(profile.id, profile.brokerCode, id);
    } else {
      await removeListingFromCurated(profile.id, id);
    }
  };

  // Xóa khỏi tủ hàng (CHỈ XÓA QUAN HỆ TRONG broker_curated_listings)
  const handleRemoveCurated = async (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCurated: false } : item
      )
    );
    await removeListingFromCurated(profile.id, id);
  };

  // Cập nhật ghi chú cá nhân (private notes)
  const handleUpdateNote = async (id: string, note: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, privateNote: note } : item
      )
    );
    await updateCuratedListingNote(profile.id, id, note);
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

export const BrokerListingsView: React.FC<BrokerListingsContentProps> = ({ forcedTab }) => {
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
};

