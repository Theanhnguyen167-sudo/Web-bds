'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { OrderSummary } from '@/components/payment/OrderSummary';
import { PaymentMethod } from '@/lib/payment/types';
import { mockPackages } from '@/lib/mock-data';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, addToast } = useApp();

  const packageIdParam = searchParams.get('packageId') || 'pro';
  const billingParam = (searchParams.get('billing') as 'monthly' | 'yearly') || 'monthly';

  const [packageId, setPackageId] = useState(packageIdParam);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>(billingParam);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('momo');
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Find selected package details
  const currentPkg =
    mockPackages.find((p) => p.id === packageId) ||
    mockPackages.find((p) => p.id === 'pro')!;

  const priceMonth = currentPkg.price;
  const priceYear = Math.round(currentPkg.price * 12 * 0.8); // 20% discount on yearly

  const basePrice = billing === 'yearly' ? priceYear : priceMonth;
  const priceAfterDiscount = Math.max(basePrice - discountAmount, 0);
  const vatAmount = Math.round(priceAfterDiscount * 0.1);
  const finalTotal = priceAfterDiscount + vatAmount;

  const handleApplyPromoCode = (code: string) => {
    if (code === 'VIP2025' || code === 'PROMO50' || code === 'HANOI') {
      const discount = 50000;
      setDiscountAmount(discount);
      setPromoApplied(true);
      addToast(`Đã áp dụng mã giảm giá ${code}: -50.000đ!`, 'success');
    } else {
      addToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error');
    }
  };

  const handleProcessPayment = async () => {
    if (!user) {
      addToast('Vui lòng đăng nhập để tiến hành thanh toán', 'warning');
      router.push(`/login?redirect=/payment/checkout?packageId=${packageId}&billing=${billing}`);
      return;
    }

    setLoading(true);

    try {
      if (selectedMethod === 'momo') {
        const res = await fetch('/api/payment/momo/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id || 'u1',
            packageId: currentPkg.id,
            packageName: `Gói ${currentPkg.name} (${billing === 'monthly' ? '1 tháng' : '1 năm'})`,
            amount: finalTotal,
            userEmail: user.email,
            userPhone: user.phone || '0988123456',
          }),
        });

        const data = await res.json();
        if (data.success) {
          if (data.payUrl) {
            router.push(data.payUrl);
          } else {
            router.push(`/payment/processing?orderId=${data.orderId}&method=momo&amount=${finalTotal}`);
          }
        } else {
          addToast(data.error || 'Lỗi khi tạo đơn hàng MoMo', 'error');
        }
      } else if (selectedMethod === 'vnpay') {
        const res = await fetch('/api/payment/vnpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id || 'u1',
            packageId: currentPkg.id,
            packageName: `Gói ${currentPkg.name} (${billing === 'monthly' ? '1 tháng' : '1 năm'})`,
            amount: finalTotal,
            userEmail: user.email,
            userPhone: user.phone || '0988123456',
            bankCode: selectedBank,
          }),
        });

        const data = await res.json();
        if (data.success && data.paymentUrl) {
          // Redirect to VNPay Gateway
          window.location.href = data.paymentUrl;
        } else {
          addToast('Lỗi khi chuyển hướng cổng VNPay', 'error');
        }
      } else {
        // Bank transfer manual flow
        router.push(
          `/payment/processing?orderId=CK_${user.id.slice(0, 6)}_${Date.now()}&method=bank_transfer&amount=${finalTotal}`
        );
      }
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      addToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-bg py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại bảng giá
          </Link>

          <Link href="/" className="font-extrabold text-sm text-navy">
            HaNoi <span className="text-orange-500">Realty</span> Payment
          </Link>
        </div>

        {/* ── 4-STEP INDICATOR ── */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className="text-slate-400 flex items-center justify-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px]">1</span>
              <span className="hidden sm:inline">Chọn gói</span>
            </div>
            <div className="text-orange-600 flex items-center justify-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px]">2</span>
              <span>Phương thức</span>
            </div>
            <div className="text-slate-400 flex items-center justify-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px]">3</span>
              <span className="hidden sm:inline">Thanh toán</span>
            </div>
            <div className="text-slate-400 flex items-center justify-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px]">4</span>
              <span className="hidden sm:inline">Hoàn tất</span>
            </div>
          </div>
        </div>

        {/* ── MAIN CHECKOUT 2-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Col: Payment Method Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
              selectedBank={selectedBank}
              onSelectBank={setSelectedBank}
              orderAmount={finalTotal}
              userId={user?.id || 'u1'}
              packageId={currentPkg.id}
            />

            {/* Proceed CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={loading}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang kết nối cổng thanh toán...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Tiến hành thanh toán ngay →</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Col: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <OrderSummary
              packageId={currentPkg.id}
              packageName={currentPkg.name}
              priceMonth={priceMonth}
              priceYear={priceYear}
              billing={billing}
              onToggleBilling={setBilling}
              features={currentPkg.features}
              discountAmount={discountAmount}
              onApplyPromoCode={handleApplyPromoCode}
              promoApplied={promoApplied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
