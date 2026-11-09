'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import { BROKER_MOCK_APPOINTMENTS } from '@/lib/data/broker-mock-appointments';
import { BrokerProfile } from '@/types/broker-nav';
import { AppointmentMasterView } from '@/components/dashboard/broker/appointments';
import { AccountRestrictedModal } from '@/components/dashboard/broker/listings';

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

function BrokerAppointmentsContent() {
  const searchParams = useSearchParams();
  const presetLeadId = searchParams.get('leadId') || undefined;
  const presetListingId = searchParams.get('listingId') || undefined;

  const [profile, setProfile] = useState<BrokerProfile>(DEFAULT_PROFILE);
  const [restrictedFeature, setRestrictedFeature] = useState<string | null>(null);

  const confirmedCount = BROKER_MOCK_APPOINTMENTS.filter(
    (a) => a.status === 'confirmed'
  ).length;

  const completedCount = BROKER_MOCK_APPOINTMENTS.filter(
    (a) => a.status === 'completed'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER & QUY TẮC ĐIỀU PHỐI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="h-7 w-7 text-indigo-600" />
            Lịch Hẹn Dẫn Khách Xem Nhà
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Điều phối thời gian đón tiếp minh bạch giữa Chuyên viên CTV – Khách mua – Chủ nhà
          </p>
        </div>

        {/* Thanh Dev Test quyền */}
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

      {/* 4 THẺ THỐNG KÊ LỊCH HẸN NHANH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng cuộc hẹn</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">{BROKER_MOCK_APPOINTMENTS.length}</div>
          <span className="text-[10px] text-slate-400">Đã thiết lập qua hệ thống</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Chủ nhà đã duyệt</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-700">{confirmedCount} lịch</div>
          <span className="text-[10px] text-emerald-600">Sẵn sàng đón tiếp</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Chờ chủ nhà xác nhận</span>
          <div className="mt-1 text-2xl font-extrabold text-amber-700">1 lịch</div>
          <span className="text-[10px] text-amber-600">Điều phối đang liên hệ</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase">Đã xem thành công</span>
          <div className="mt-1 text-2xl font-extrabold text-purple-700">{completedCount} buổi</div>
          <span className="text-[10px] text-purple-600">Đã cập nhật kết quả</span>
        </div>
      </div>

      {/* BANNER NGUYÊN TẮC AN TOÀN ĐIỀU PHỐI */}
      <div className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-3.5 text-xs text-indigo-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong>Quy chuẩn đón tiếp HaNoi Realty:</strong> Buổi xem nhà chỉ được coi là hợp lệ khi có sự xác nhận của chủ nhà qua hệ thống sàn. Sau buổi xem, chuyên viên cần cập nhật kết quả và ảnh check-in để làm căn cứ bảo lưu quyền lợi và phục vụ đối soát hoa hồng sau này.
        </div>
      </div>

      {/* BẢNG CHÍNH ĐIỀU KHIỂN LỊCH HẸN */}
      <AppointmentMasterView
        initialAppointments={BROKER_MOCK_APPOINTMENTS}
        profile={profile}
        onRestrictedClick={(feat) => setRestrictedFeature(feat)}
        presetLeadId={presetLeadId}
        presetListingId={presetListingId}
      />

      {/* MODAL CẢNH BÁO TÀI KHOẢN */}
      <AccountRestrictedModal
        isOpen={!!restrictedFeature}
        onClose={() => setRestrictedFeature(null)}
        profile={profile}
        featureName={restrictedFeature || 'Tạo lịch hẹn mới'}
      />

    </div>
  );
}

export default function BrokerAppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Đang tải lịch hẹn dẫn khách...</span>
          </div>
        </div>
      }
    >
      <BrokerAppointmentsContent />
    </Suspense>
  );
}
