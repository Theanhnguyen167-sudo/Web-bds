'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentSuccess } from '@/components/payment/PaymentSuccess';
import { useApp } from '@/lib/context/AppContext';
import { Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useApp();

  const orderId = searchParams.get('orderId') || `HNREALTY_${Date.now()}`;
  const method = searchParams.get('method') || 'momo';
  const amount = Number(searchParams.get('amount') || '658900');

  return (
    <div className="min-h-screen bg-page-bg py-12 px-4 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <PaymentSuccess
          orderId={orderId}
          method={method}
          amount={amount}
          packageName="Pro (1 tháng)"
          userEmail={user?.email || 'khachhang@gmail.com'}
        />
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
