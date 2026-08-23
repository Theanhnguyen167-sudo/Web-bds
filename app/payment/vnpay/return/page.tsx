'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Loader2 } from 'lucide-react';
import { VNPAY_RESPONSE_CODES } from '@/lib/payment/vnpay';

function VNPayReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, addToast } = useApp();

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode') || '00';
    const orderId = searchParams.get('vnp_TxnRef') || `VNPAY_${Date.now()}`;
    const rawAmount = searchParams.get('vnp_Amount') || '65890000';
    const amount = Math.round(Number(rawAmount) / 100);
    const bankCode = searchParams.get('vnp_BankCode') || 'NCB';
    const message =
      VNPAY_RESPONSE_CODES[responseCode] ||
      searchParams.get('vnp_Message') ||
      'Giao dịch VNPay hoàn tất';

    if (responseCode === '00') {
      if (user) {
        setUser({
          ...user,
          package: 'Pro',
          packageExpiry: '2026-09-24',
          listingsCount: user.listingsCount + 50,
          aiReportsLimit: (user.aiReportsLimit || 0) + 30,
        });
      }
      addToast('🎉 Thanh toán VNPay thành công!', 'success');
      router.push(`/payment/success?orderId=${orderId}&method=vnpay&amount=${amount}&bankCode=${bankCode}`);
    } else {
      addToast(`Thanh toán thất bại: ${message}`, 'error');
      router.push(`/payment/error?reason=${encodeURIComponent(message)}&method=vnpay&orderId=${orderId}`);
    }
  }, [searchParams, router, user, setUser, addToast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-page-bg">
      <Loader2 className="h-10 w-10 animate-spin text-[#0066cc]" />
      <p className="text-sm font-bold text-navy">Đang xác thực kết quả thanh toán VNPay...</p>
    </div>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <VNPayReturnContent />
    </Suspense>
  );
}
