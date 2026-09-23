'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoMoQRCode } from '@/components/payment/MoMoQRCode';
import { VietQRCode } from '@/components/payment/VietQRCode';
import { PaymentTimer } from '@/components/payment/PaymentTimer';
import { useApp } from '@/lib/context/AppContext';
import {
  Loader2,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  ExternalLink,
  Lock,
  Smartphone
} from 'lucide-react';
import { formatCurrencyVND } from '@/lib/utils';
import { VNPAY_BANK_CODES } from '@/lib/payment/vnpay';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, addToast } = useApp();

  const orderId = searchParams.get('orderId') || `HNREALTY_${Date.now()}`;
  const method = searchParams.get('method') || 'momo';
  const amount = Number(searchParams.get('amount') || '658900');
  const bankCode = searchParams.get('bankCode') || 'ALL';
  const paymentUrl = searchParams.get('paymentUrl') || '';

  const packageId = searchParams.get('packageId') || 'agency';
  const rawPackageName = searchParams.get('packageName');
  const billing = searchParams.get('billing') || 'monthly';
  const packageName = rawPackageName || (packageId === 'agency' ? 'Gói Agency' : packageId === 'basic' ? 'Gói Basic' : 'Gói Pro');

  const [isExpired, setIsExpired] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const [isManualConfirming, setIsManualConfirming] = useState(false);

  // Find bank name if bankCode is provided
  const selectedBankObj = VNPAY_BANK_CODES.find((b) => b.code === bankCode);

  const handleApplySuccessfulUpgrade = () => {
    if (user) {
      const isAgency = packageId.toLowerCase() === 'agency';
      const isBasic = packageId.toLowerCase() === 'basic';
      setUser({
        ...user,
        package: isAgency ? 'Agency' : isBasic ? 'Basic' : 'Pro',
        packageExpiry: billing === 'yearly' ? '2027-09-23' : '2026-10-23',
        listingsCount: isAgency ? 999999 : user.listingsCount + (isBasic ? 20 : 50),
        aiReportsLimit: isAgency ? 999999 : (user.aiReportsLimit || 0) + (isBasic ? 5 : 30),
      });
    }
  };

  // Auto-polling simulation for MoMo in dev sandbox
  useEffect(() => {
    if (method !== 'momo' || isExpired) return;

    const interval = setInterval(() => {
      setPollingCount((prev) => {
        const next = prev + 1;
        // In sandbox dev demo, automatically trigger success after 5 poll cycles (15s)
        if (next >= 5) {
          clearInterval(interval);
          handleApplySuccessfulUpgrade();
          addToast?.('🎉 Giao dịch MoMo đã được xác nhận thành công!', 'success');
          router.push(
            `/payment/success?orderId=${orderId}&method=momo&amount=${amount}&packageName=${encodeURIComponent(packageName)}`
          );
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isExpired, orderId, method, amount, router, packageName]);

  // Handler for Bank Transfer completion
  const handleBankTransferConfirmed = () => {
    setIsManualConfirming(true);
    handleApplySuccessfulUpgrade();
    addToast?.('🎉 Đã ghi nhận thông tin chuyển khoản VietQR!', 'success');
    setTimeout(() => {
      router.push(
        `/payment/success?orderId=${orderId}&method=${method}&amount=${amount}&packageName=${encodeURIComponent(packageName)}`
      );
    }, 800);
  };

  // Handler for instant Sandbox success (for MoMo or VNPay)
  const handleSimulateInstantSuccess = (selectedPaymentMethod = method) => {
    handleApplySuccessfulUpgrade();
    addToast?.('✅ Giao dịch đã được đối soát thành công!', 'success');
    router.push(
      `/payment/success?orderId=${orderId}&method=${selectedPaymentMethod}&amount=${amount}&packageName=${encodeURIComponent(packageName)}${
        bankCode ? `&bankCode=${bankCode}` : ''
      }`
    );
  };

  return (
    <div className="min-h-screen bg-page-bg py-8 sm:py-12 px-4 flex flex-col justify-between items-center">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/payment/checkout"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Đổi phương thức khác
          </Link>

          <span className="text-xs font-mono text-slate-400">
            Mã: {orderId.slice(0, 18)}
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════
            NHÁNH 1: VÍ MOMO (MOMO QR & APP)
            ═══════════════════════════════════════════════════════ */}
        {method === 'momo' && (
          <div className="space-y-6">
            <PaymentTimer onExpire={() => setIsExpired(true)} durationMinutes={15} />

            <MoMoQRCode
              amount={amount}
              orderId={orderId}
              isExpired={isExpired}
              onRefreshQR={() => setIsExpired(false)}
            />

            {/* MoMo App Deeplink for Mobile Users */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-2.5">
              <a
                href={`https://me.momo.vn/`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#ae2070] hover:bg-[#90165c] text-white font-bold text-xs rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                <span>Mở Ứng Dụng MoMo Trên Điện Thoại</span>
              </a>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 pt-1">
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                <span>Đang chờ bạn quét mã xác nhận trên điện thoại...</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Hệ thống tự động kích hoạt gói ngay sau khi giao dịch trên App hoàn tất.
              </p>

              {/* Dev Simulation Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSimulateInstantSuccess('momo')}
                  className="text-[11px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
                >
                  ⚡ Bấm để mô phỏng quét thành công ngay (Dev Sandbox)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            NHÁNH 2: CHUYỂN KHOẢN NGÂN HÀNG (VIETQR 24/7)
            ═══════════════════════════════════════════════════════ */}
        {method === 'bank_transfer' && (
          <div className="space-y-6">
            <PaymentTimer onExpire={() => setIsExpired(true)} durationMinutes={30} />

            <VietQRCode
              amount={amount}
              orderId={orderId}
              onConfirmPayment={handleBankTransferConfirmed}
              isProcessing={isManualConfirming}
            />

            {/* Help notice */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-xs text-slate-500 space-y-1 text-center">
              <p className="font-bold text-navy">Cần hỗ trợ chuyển khoản ngân hàng?</p>
              <p className="text-[11px]">
                Hotline kế toán: <strong className="text-orange-600">1800 6868</strong> (Miễn phí, 24/7)
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            NHÁNH 3: CỔNG THANH TOÁN VNPAY & VIETQR
            ═══════════════════════════════════════════════════════ */}
        {method === 'vnpay' && (
          <div className="space-y-6">
            <PaymentTimer onExpire={() => setIsExpired(true)} durationMinutes={15} />

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5 text-center">
              {/* VNPay & VietQR Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#005baa] to-[#ed1c24] text-white font-black text-xs flex items-center justify-center shadow-md">
                    VNP
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-sm text-navy">VNPay QR / VietQR Chuyển Khoản</h3>
                    <p className="text-[11px] text-slate-500">
                      Quét mã tức thì qua 40+ ứng dụng ngân hàng hoặc ví VNPay
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0066cc] text-[11px] font-extrabold border border-blue-200">
                  Napas 247
                </span>
              </div>

              {/* VietQR Component with Auto-filled Amount and Details */}
              <VietQRCode
                amount={amount}
                orderId={orderId}
                onConfirmPayment={handleBankTransferConfirmed}
                isProcessing={isManualConfirming}
              />

              {/* Optional Gateway link if needed */}
              {paymentUrl && (
                <div className="pt-1 text-center">
                  <a
                    href={paymentUrl}
                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center justify-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Mở cổng thẻ ATM / Quốc tế VNPay Sandbox</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancel Order Link */}
        <div className="text-center pt-2">
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
