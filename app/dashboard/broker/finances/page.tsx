'use client';

import React, { useState, Suspense } from 'react';
import { 
  Coins, 
  ShieldCheck, 
  Landmark, 
  Receipt, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { BROKER_MOCK_COMMISSIONS } from '@/lib/data/broker-mock-finances';
import { BrokerProfile } from '@/types/broker-nav';
import { CommissionLedger } from '@/components/dashboard/broker/finances';

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

function BrokerFinancesContent() {
  const [profile, setProfile] = useState<BrokerProfile>(DEFAULT_PROFILE);

  const isExpired = profile.subscriptionTier === 'expired';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER TRANG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Coins className="h-7 w-7 text-amber-500" />
            Thu Nhập & Ví Hoa Hồng (5 Trạng Thái Minh Bạch)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quy trình đối soát: Dự kiến ➔ Đủ điều kiện ➔ Chờ đối soát ➔ Đã chi trả (hoặc Tranh chấp)
          </p>
        </div>

        {/* Thanh Dev Test trạng thái gói */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1.5 text-[11px] self-start sm:self-auto border border-slate-200">
            <span className="font-bold text-slate-500 uppercase px-1">Test gói:</span>
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

      {/* BANNER CAM KẾT BẢO LƯU QUYỀN LỢI TÀI CHÍNH */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-4 text-xs text-blue-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Cam kết bảo lưu hoa hồng 100% của HaNoi Realty:</strong> Dù gói dịch vụ CTV của bạn đang hoạt động hay đã hết hạn ({isExpired ? <span className="font-bold text-rose-700">Tài khoản đang hết hạn gói</span> : <span className="font-bold text-emerald-700">Gói đang hoạt động</span>}), <em>bạn vẫn có toàn quyền theo dõi 100% lịch sử đối soát và nhận đầy đủ hoa hồng khi giao dịch hoàn tất</em>. Sàn tuyệt đối không khấu trừ hay hủy bỏ quyền lợi hoa hồng đã phát sinh hợp lệ.
        </div>
      </div>

      {/* BẢNG KÊ ĐỐI SOÁT TÀI CHÍNH */}
      <CommissionLedger initialRecords={BROKER_MOCK_COMMISSIONS} />

    </div>
  );
}

export default function BrokerFinancesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span>Đang tải bảng kê thu nhập & hoa hồng...</span>
          </div>
        </div>
      }
    >
      <BrokerFinancesContent />
    </Suspense>
  );
}

