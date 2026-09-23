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

  const [isExpired, setIsExpired] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const [isManualConfirming, setIsManualConfirming] = useState(false);

  // Find bank name if bankCode is provided
  const selectedBankObj = VNPAY_BANK_CODES.find((b) => b.code === bankCode);

  const handleApplySuccessfulUpgrade = () => {
    if (user) {
      setUser({
        ...user,
        package: 'Pro',
        packageExpiry: '2026-09-24',
        listingsCount: user.listingsCount + 50,
        aiReportsLimit: (user.aiReportsLimit || 0) + 30,
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
            `/payment/success?orderId=${orderId}&method=momo&amount=${amount}`
          );
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isExpired, orderId, method, amount, router]);

  // Handler for Bank Transfer completion
  const handleBankTransferConfirmed = () => {
    setIsManualConfirming(true);
    handleApplySuccessfulUpgrade();
    addToast?.('🎉 Đã ghi nhận thông tin chuyển khoản VietQR!', 'success');
    setTimeout(() => {
      router.push(
        `/payment/success?orderId=${orderId}&method=bank_transfer&amount=${amount}`
      );
    }, 800);
  };

  // Handler for instant Sandbox success (for MoMo or VNPay)
  const handleSimulateInstantSuccess = (selectedPaymentMethod = method) => {
    handleApplySuccessfulUpgrade();
    addToast?.('✅ Giao dịch đã được đối soát thành công!', 'success');
    router.push(
      `/payment/success?orderId=${orderId}&method=${selectedPaymentMethod}&amount=${amount}${
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
            NHÁNH 3: CỔNG THANH TOÁN VNPAY
            ═══════════════════════════════════════════════════════ */}
        {method === 'vnpay' && (
          <div className="space-y-6">
            <PaymentTimer onExpire={() => setIsExpired(true)} durationMinutes={15} />

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5 text-center">
              {/* VNPay Header */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                  VNP
                </div>
                <div className="text-left">
                  <h3 className="font-black text-sm text-navy">Cổng Thanh Toán Quốc Gia VNPay</h3>
                  <p className="text-[11px] text-slate-500">
                    Kết nối an toàn chuẩn PCI-DSS & 3D-Secure
                  </p>
                </div>
              </div>

              {/* Amount Display */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <span className="font-mono font-bold text-navy">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng đã chọn:</span>
                  <span className="font-bold text-[#0066cc]">
                    {selectedBankObj ? `${selectedBankObj.name} (${selectedBankObj.code})` : 'Tất cả ngân hàng / VNPAY-QR'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Số tiền:</span>
                  <span className="font-black text-orange-600 text-base">
                    {formatCurrencyVND(amount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Gateway or Sandbox Direct Confirmation */}
              <div className="space-y-2.5 pt-1">
                {paymentUrl ? (
                  <a
                    href={paymentUrl}
                    className="w-full py-3.5 bg-[#0066cc] hover:bg-[#0052a3] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Mở Cổng Thanh Toán VNPay Gateway →</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Redirect to VNPay sandbox url or local return handler
                      router.push(`/payment/vnpay/return?vnp_ResponseCode=00&vnp_TxnRef=${orderId}&vnp_Amount=${amount * 100}&vnp_BankCode=${bankCode}`);
                    }}
                    className="w-full py-3.5 bg-[#0066cc] hover:bg-[#0052a3] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Xác nhận qua Cổng VNPay Gateway →</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSimulateInstantSuccess('vnpay')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Mô phỏng thanh toán thành công (Sandbox Dev)</span>
                </button>
              </div>

              {/* 3 Steps */}
              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#0066cc] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Chuyển tiếp sang giao diện bảo mật VNPay</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#0066cc] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Chọn Quét VNPAY-QR hoặc nhập thông tin thẻ ATM / Visa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#0066cc] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>Nhập mã OTP SMS ngân hàng để hoàn tất</span>
                </div>
              </div>

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
