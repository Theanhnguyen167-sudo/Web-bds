'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoMoQRCode } from '@/components/payment/MoMoQRCode';
import { PaymentTimer } from '@/components/payment/PaymentTimer';
import { useApp } from '@/lib/context/AppContext';
import { Loader2, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, addToast } = useApp();

  const orderId = searchParams.get('orderId') || `HNREALTY_${Date.now()}`;
  const method = searchParams.get('method') || 'momo';
  const amount = Number(searchParams.get('amount') || '658900');

  const [isExpired, setIsExpired] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);

  // Polling simulation: simulate confirmation after 8-12 seconds in sandbox or on button click
  useEffect(() => {
    if (isExpired) return;

    const interval = setInterval(() => {
      setPollingCount((prev) => {
        const next = prev + 1;
        // In sandbox dev demo, automatically trigger success after 4 poll cycles (12 seconds)
        if (next >= 4) {
          clearInterval(interval);
          // Upgrade user package in local state
          if (user) {
            setUser({
              ...user,
              package: 'Pro',
              packageExpiry: '2026-09-24',
              listingsCount: user.listingsCount + 50,
              aiReportsLimit: (user.aiReportsLimit || 0) + 30,
            });
          }
          addToast('🎉 Giao dịch MoMo đã được xác nhận thành công!', 'success');
          router.push(
            `/payment/success?orderId=${orderId}&method=${method}&amount=${amount}`
          );
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isExpired, orderId, method, amount, router, user, setUser, addToast]);

  const handleSimulateInstantSuccess = () => {
    if (user) {
      setUser({
        ...user,
        package: 'Pro',
        packageExpiry: '2026-09-24',
        listingsCount: user.listingsCount + 50,
      });
    }
    router.push(
      `/payment/success?orderId=${orderId}&method=${method}&amount=${amount}`
    );
  };

  return (
    <div className="min-h-screen bg-page-bg py-8 sm:py-12 px-4 flex flex-col justify-between items-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/payment/checkout"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Đổi phương thức
          </Link>

          <span className="text-xs font-mono text-slate-400">
            Mã: {orderId.slice(0, 16)}...
          </span>
        </div>

        {/* Timer */}
        <PaymentTimer onExpire={() => setIsExpired(true)} />

        {/* QR Card */}
        <MoMoQRCode
          amount={amount}
          orderId={orderId}
          isExpired={isExpired}
          onRefreshQR={() => setIsExpired(false)}
        />

        {/* Polling Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
            <span>Đang chờ bạn quét mã xác nhận trên điện thoại...</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Hệ thống sẽ tự động làm mới ngay sau khi bạn bấm xác nhận trên App.
          </p>

          {/* Dev Simulation Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSimulateInstantSuccess}
              className="text-[11px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
            >
              ⚡ Bấm để mô phỏng quét thành công ngay (Dev Sandbox)
            </button>
          </div>
        </div>

        {/* Cancel */}
        <div className="text-center">
          <Link
            href="/payment/checkout"
            className="text-xs text-slate-400 hover:text-rose-500 font-semibold transition-colors"
          >
            Hủy đơn hàng này
          </Link>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center pt-6">
        © 2026 HaNoi Realty Payment Gateway. Cổng giao dịch bảo mật 256-bit SSL.
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <ProcessingContent />
    </Suspense>
  );
}
