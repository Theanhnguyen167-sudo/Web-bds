'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  Phone,
  MessageSquare,
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
  HelpCircle,
  Star,
  ChevronDown,
  Building
} from 'lucide-react';

export interface BrokerReferralInfo {
  brokerCode: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: 'ctv' | 'tpkd';
  roleTitle: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  districtFocus: string;
}

// Danh bạ dữ liệu mẫu chuyên viên tư vấn
const KNOWN_BROKERS: Record<string, BrokerReferralInfo> = {
  'CTV-HN1089': {
    brokerCode: 'CTV-HN1089',
    fullName: 'Trần Minh Đức',
    phone: '0912.838.291',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    role: 'ctv',
    roleTitle: 'Chuyên viên tư vấn BĐS Cao cấp',
    rating: 4.9,
    totalReviews: 38,
    isVerified: true,
    districtFocus: 'Đống Đa & Ba Đình',
  },
  'CTV-HN1092': {
    brokerCode: 'CTV-HN1092',
    fullName: 'Nguyễn Thu Trang',
    phone: '0983.192.831',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'ctv',
    roleTitle: 'Chuyên viên tư vấn Dự án Chung cư',
    rating: 5.0,
    totalReviews: 52,
    isVerified: true,
    districtFocus: 'Nam Từ Liêm & Cầu Giấy',
  },
  'CTV-HN1120': {
    brokerCode: 'CTV-HN1120',
    fullName: 'Lê Phương Anh',
    phone: '0936.551.482',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'ctv',
    roleTitle: 'Chuyên viên Biệt thự & Liền kề KĐT',
    rating: 4.95,
    totalReviews: 44,
    isVerified: true,
    districtFocus: 'Long Biên & Gia Lâm',
  },
  'TPKD-HN0021': {
    brokerCode: 'TPKD-HN0021',
    fullName: 'Nguyễn Văn Minh',
    phone: '0903.281.999',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'tpkd',
    roleTitle: 'Trưởng phòng Kinh doanh Quản lý',
    rating: 5.0,
    totalReviews: 89,
    isVerified: true,
    districtFocus: 'Toàn thành phố Hà Nội',
  },
};

interface BrokerReferralBadgeProps {
  propertyId?: string;
  propertyTitle?: string;
  defaultSellerName?: string;
  defaultSellerPhone?: string;
  onBrokerConfirmed?: (brokerCode: string, brokerName: string) => void;
  className?: string;
}

function BrokerReferralBadgeInner({
  propertyId = 'default_property',
  propertyTitle = 'Bất động sản',
  defaultSellerName,
  defaultSellerPhone,
  onBrokerConfirmed,
  className = '',
}: BrokerReferralBadgeProps) {
  const searchParams = useSearchParams();
  const rawRef = searchParams.get('ref');

  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [broker, setBroker] = useState<BrokerReferralInfo | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [showManualBox, setShowManualBox] = useState(false);

  // Storage key theo từng căn nhà cụ thể (bảo đảm một khách có thể có nhiều CTV ở các căn khác nhau)
  const storageKey = `hanoi_realty_referral_${propertyId}`;

  // Kiểm tra ref từ URL hoặc từ localStorage khi mount
  useEffect(() => {
    let codeToUse = rawRef ? rawRef.trim().toUpperCase() : null;

    if (!codeToUse && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          codeToUse = parsed.brokerCode;
          setIsConfirmed(parsed.confirmed === true);
        }
      } catch {}
    }

    if (codeToUse) {
      setActiveCode(codeToUse);
      // Tìm trong danh bạ hoặc tạo fallback
      const found = KNOWN_BROKERS[codeToUse] || {
        brokerCode: codeToUse,
        fullName: 'Chuyên viên HaNoi Realty',
        phone: '0912 888 999',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: codeToUse.startsWith('TPKD') ? 'tpkd' : 'ctv',
        roleTitle: codeToUse.startsWith('TPKD') ? 'Trưởng phòng Kinh doanh' : 'Cộng tác viên Môi giới đã xác thực',
        rating: 4.9,
        totalReviews: 24,
        isVerified: true,
        districtFocus: 'Hà Nội',
      };
      setBroker(found);

      // Nếu có ref từ URL và chưa lưu thì lưu tạm trạng thái chưa confirm
      if (rawRef && typeof window !== 'undefined') {
        try {
          const existing = localStorage.getItem(storageKey);
          if (!existing) {
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                brokerCode: codeToUse,
                brokerName: found.fullName,
                confirmed: false,
                propertyId,
                updatedAt: new Date().toISOString(),
              })
            );
          }
        } catch {}
      }
    }
  }, [rawRef, propertyId, storageKey]);

  // Hành động: Xác nhận chuyên viên này
  const handleConfirmBroker = () => {
    if (!broker) return;
    setIsConfirmed(true);

    if (typeof window !== 'undefined') {
      try {
        const payload = {
          brokerCode: broker.brokerCode,
          brokerName: broker.fullName,
          confirmed: true,
          propertyId,
          propertyTitle,
          confirmedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        // Gắn vào session chung cho các form đặt lịch
        sessionStorage.setItem('active_booking_referral_code', broker.brokerCode);
        sessionStorage.setItem('active_booking_referral_name', broker.fullName);

        // Phát event tùy biến để BookingModal hoặc Contact Widget bắt được ngay
        window.dispatchEvent(
          new CustomEvent('hanoi_referral_confirmed', { detail: payload })
        );
      } catch {}
    }

    if (onBrokerConfirmed) {
      onBrokerConfirmed(broker.brokerCode, broker.fullName);
    }
  };

  // Hành động: Hủy / Đổi chuyên viên
  const handleRemoveBroker = () => {
    setIsConfirmed(false);
    setActiveCode(null);
    setBroker(null);
    setShowChangeModal(false);

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem('active_booking_referral_code');
        sessionStorage.removeItem('active_booking_referral_name');
        window.dispatchEvent(
          new CustomEvent('hanoi_referral_removed', { detail: { propertyId } })
        );
      } catch {}
    }
  };

  // Hành động: Nhập mã thủ công
  const handleApplyManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualCodeInput.trim().toUpperCase();
    if (!clean) {
      setManualError('Vui lòng nhập mã CTV (VD: CTV-HN1089)');
      return;
    }

    const found = KNOWN_BROKERS[clean] || {
      brokerCode: clean,
      fullName: 'Chuyên viên HaNoi Realty',
      phone: '0912 888 999',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: clean.startsWith('TPKD') ? 'tpkd' : 'ctv',
      roleTitle: 'Chuyên viên Môi giới đã xác thực',
      rating: 4.9,
      totalReviews: 20,
      isVerified: true,
      districtFocus: 'Hà Nội',
    };

    setActiveCode(clean);
    setBroker(found);
    setIsConfirmed(true);
    setShowManualBox(false);
    setShowChangeModal(false);
    setManualCodeInput('');
    setManualError(null);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            brokerCode: clean,
            brokerName: found.fullName,
            confirmed: true,
            propertyId,
            updatedAt: new Date().toISOString(),
          })
        );
        sessionStorage.setItem('active_booking_referral_code', clean);
      } catch {}
    }
  };

  // TRƯỜNG HỢP: KHÔNG CÓ REF VÀ CHƯA CÓ MÃ LƯU
  if (!broker) {
    return (
      <div className={`text-xs ${className}`}>
        {showManualBox ? (
          <form
            onSubmit={handleApplyManualCode}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Nhập mã Chuyên viên giới thiệu
              </span>
              <button
                type="button"
                onClick={() => setShowManualBox(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Nhập mã định danh của chuyên viên (CTV/TPKD) đã gửi thông tin căn nhà này cho bạn.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCodeInput}
                onChange={(e) => setManualCodeInput(e.target.value)}
                placeholder="VD: CTV-HN1089"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none uppercase font-mono font-semibold"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-3.5 py-1.5 font-bold text-white text-xs hover:bg-blue-500 shadow-xs"
              >
                Áp dụng
              </button>
            </div>
            {manualError && <p className="text-[11px] text-rose-600">{manualError}</p>}
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowManualBox(true)}
            className="w-full text-center py-2 px-3 rounded-xl border border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/40 text-slate-500 hover:text-blue-700 transition-colors text-[11px] font-medium flex items-center justify-center gap-1.5 group"
          >
            <Sparkles className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600" />
            <span>Bạn được chuyên viên giới thiệu căn này? <strong>Gắn mã CTV</strong></span>
          </button>
        )}
      </div>
    );
  }

  // TRƯỜNG HỢP: CÓ REF -> HIỂN THỊ BOX CHUYÊN VIÊN TƯ VẤN CỦA BẠN
  return (
    <div
      className={`rounded-2xl border transition-all ${
        isConfirmed
          ? 'border-emerald-300 bg-gradient-to-b from-emerald-50/60 to-white shadow-xs'
          : 'border-blue-300 bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white shadow-md'
      } p-4 sm:p-5 space-y-3.5 ${className}`}
    >
      
      {/* 1. Header Box */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-2 w-2 rounded-full ${
              isConfirmed ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'
            }`}
          />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
            {isConfirmed ? 'Chuyên viên đồng hành của bạn' : 'Chuyên viên tư vấn được chỉ định'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isConfirmed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Đã xác nhận
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 border border-blue-200">
              Được giới thiệu qua link
            </span>
          )}
        </div>
      </div>

      {/* 2. Thông tin Môi giới (Avatar, Tên, Mã, Đánh giá) */}
      <div className="flex items-start gap-3.5 pt-1">
        <div className="relative shrink-0">
          <img
            src={broker.avatarUrl}
            alt={broker.fullName}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-white border border-slate-200 shadow-xs"
          />
          {broker.isVerified && (
            <span
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-white"
              title="Đã xác thực chứng chỉ hành nghề & CCCD"
            >
              <ShieldCheck className="h-3 w-3" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              {broker.fullName}
            </h4>
            <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
              {broker.brokerCode}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
            {broker.roleTitle} • {broker.districtFocus}
          </p>

          <div className="flex items-center gap-2 mt-1 text-[11px]">
            <div className="flex items-center text-amber-500 font-bold gap-0.5">
              <Star className="h-3 w-3 fill-amber-400" />
              <span>{broker.rating}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{broker.totalReviews} lượt đánh giá tốt</span>
          </div>
        </div>
      </div>

      {/* 3. Thông báo cam kết minh bạch */}
      <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3 text-xs space-y-1.5">
        <p className="text-slate-700 leading-relaxed text-[11px]">
          Bạn đang xem thông tin căn nhà này qua liên kết tư vấn của chuyên viên{' '}
          <strong className="text-slate-900">{broker.fullName}</strong>.
        </p>
        <p className="text-[10px] text-slate-500 leading-tight">
          🛡️ <em>Cam kết HaNoi Realty:</em> Việc gắn mã chuyên viên hoàn toàn minh bạch, <strong>không làm thay đổi giá bán hay bất kỳ chi phí nào</strong> của người mua.
        </p>
      </div>

      {/* 4. Hàng nút hành động */}
      <div className="space-y-2 pt-1">
        {!isConfirmed ? (
          <button
            type="button"
            onClick={handleConfirmBroker}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <UserCheck className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>Xác nhận chuyên viên này hỗ trợ tôi</span>
          </button>
        ) : (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Đã gán mã tư vấn vào Form đặt lịch hẹn xem nhà</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] pt-1">
          <button
            type="button"
            onClick={() => setShowChangeModal(true)}
            className="text-slate-500 hover:text-slate-800 underline decoration-slate-300 hover:decoration-slate-600 transition-colors"
          >
            Tôi muốn đổi người hỗ trợ
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${broker.phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-semibold"
            >
              <Phone className="h-3 w-3 text-emerald-600" />
              <span>{broker.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* MODAL ĐỔI HOẶC BỎ CHUYÊN VIÊN HỖ TRỢ */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                Thay Đổi Chuyên Viên Tư Vấn
              </h4>
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có toàn quyền lựa chọn người hỗ trợ. Theo quy chế của sàn, bạn có thể chuyển sang liên hệ trực tiếp với Sàn hoặc đổi sang mã chuyên viên khác:
            </p>

            {/* Các tùy chọn thay đổi */}
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={handleRemoveBroker}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 transition-colors"
              >
                <div className="font-bold text-slate-900">
                  1. Tôi muốn liên hệ trực tiếp với Hotline Sàn HaNoi Realty
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Xóa mã giới thiệu trên căn nhà này, kết nối tổng đài hỗ trợ 1900 8888.
                </div>
              </button>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="font-bold text-slate-900">
                  2. Tôi có mã chuyên viên khác
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    placeholder="Nhập mã CTV khác..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs uppercase font-mono font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyManualCode}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 font-bold text-white text-xs hover:bg-blue-500"
                  >
                    Đổi
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export function BrokerReferralBadge(props: BrokerReferralBadgeProps) {
  return (
    <Suspense fallback={null}>
      <BrokerReferralBadgeInner {...props} />
    </Suspense>
  );
}

export default BrokerReferralBadge;

