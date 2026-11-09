'use client';

import React, { useState, Suspense } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { BROKER_MOCK_LEADS } from '@/lib/data/broker-mock-leads';
import { BrokerProfile } from '@/types/broker-nav';
import { LeadMasterTable } from '@/components/dashboard/broker/leads';
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

function BrokerLeadsContent() {
  const [profile, setProfile] = useState<BrokerProfile>(DEFAULT_PROFILE);
  const [restrictedFeature, setRestrictedFeature] = useState<string | null>(null);

  const activeProtectionCount = BROKER_MOCK_LEADS.filter(
    (l) => l.protectionStatus === 'active' || l.protectionStatus === 'warning'
  ).length;

  const depositedCount = BROKER_MOCK_LEADS.filter(
    (l) => l.stage === 'deposited'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER & QUY TẮC BẢO LƯU */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-7 w-7 text-emerald-600" />
            Khách Hàng (CRM) & Bảo Lưu Quyền Lợi Môi Giới
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gắn chặt 5 yếu tố: Khách hàng – BĐS cụ thể – Chuyên viên – Thời gian – Bằng chứng thẩm định
          </p>
        </div>

        {/* Dev test permissions */}
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

      {/* THẺ THỐNG KÊ NHANH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng khách trong CRM</span>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">{BROKER_MOCK_LEADS.length}</div>
          <span className="text-[10px] text-slate-400">Đang được quản lý dữ liệu</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Đang bảo lưu độc quyền</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-700">{activeProtectionCount} khách</div>
          <span className="text-[10px] text-emerald-600">Hoa hồng được bảo vệ</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Đang dẫn xem & đàm phán</span>
          <div className="mt-1 text-2xl font-extrabold text-blue-700">2 khách</div>
          <span className="text-[10px] text-blue-600">Tiềm năng chốt cao</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase">Đã chốt cọc thành công</span>
          <div className="mt-1 text-2xl font-extrabold text-purple-700">{depositedCount} giao dịch</div>
          <span className="text-[10px] text-purple-600">Đang chuẩn bị công chứng</span>
        </div>
      </div>

      {/* BANNER NGUYÊN TẮC BẢO TOÀN DỮ LIỆU */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3.5 text-xs text-blue-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Cơ chế bảo lưu dữ liệu trọn vẹn của HaNoi Realty:</strong> Dù gói dịch vụ của CTV hết hạn hoặc tài khoản thay đổi trạng thái, <em>toàn bộ danh sách khách hàng, nhật ký tương tác và quyền hoa hồng đã phát sinh hợp lệ trước đó vẫn được bảo toàn nguyên vẹn</em> trên hệ thống, không bị xóa bỏ.
        </div>
      </div>

      {/* BẢNG CHÍNH CRM LEAD MASTER TABLE */}
      <LeadMasterTable
        initialLeads={BROKER_MOCK_LEADS}
        profile={profile}
        onRestrictedClick={(feat) => setRestrictedFeature(feat)}
      />

      {/* MODAL CẢNH BÁO TÀI KHOẢN KHI CLICK TÍNH NĂNG BỊ KHÓA */}
      <AccountRestrictedModal
        isOpen={!!restrictedFeature}
        onClose={() => setRestrictedFeature(null)}
        profile={profile}
        featureName={restrictedFeature || 'Đăng ký khách mới'}
      />

    </div>
  );
}

export default function BrokerLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span>Đang tải cơ sở dữ liệu khách hàng CRM...</span>
          </div>
        </div>
      }
    >
      <BrokerLeadsContent />
    </Suspense>
  );
}

