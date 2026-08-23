'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Loader2 } from 'lucide-react';
import { MOMO_RESULT_CODES } from '@/lib/payment/momo';

function MoMoReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, addToast } = useApp();

  useEffect(() => {
    const resultCode = searchParams.get('resultCode') || '0';
    const orderId = searchParams.get('orderId') || `HNREALTY_${Date.now()}`;
    const amount = searchParams.get('amount') || '658900';
    const message =
      searchParams.get('message') ||
      MOMO_RESULT_CODES[Number(resultCode)] ||
      'Giao dịch được xử lý';

    if (resultCode === '0' || resultCode === '9000') {
      if (user) {
        setUser({
          ...user,
          package: 'Pro',
          packageExpiry: '2026-09-24',
          listingsCount: user.listingsCount + 50,
          aiReportsLimit: (user.aiReportsLimit || 0) + 30,
        });
      }
      addToast('🎉 Thanh toán MoMo thành công!', 'success');
      router.push(`/payment/success?orderId=${orderId}&method=momo&amount=${amount}`);
    } else {
      addToast(`Thanh toán thất bại: ${message}`, 'error');
      router.push(`/payment/error?reason=${encodeURIComponent(message)}&method=momo&orderId=${orderId}`);
    }
  }, [searchParams, router, user, setUser, addToast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-page-bg">
      <Loader2 className="h-10 w-10 animate-spin text-[#ae2070]" />
      <p className="text-sm font-bold text-navy">Đang xác thực kết quả thanh toán MoMo...</p>
    </div>
  );
}

export default function MoMoReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <MoMoReturnContent />
    </Suspense>
  );
}
