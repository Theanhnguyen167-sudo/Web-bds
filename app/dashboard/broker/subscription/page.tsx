import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { SubscriptionManager } from '@/components/dashboard/broker/subscription';

export const metadata: Metadata = {
  title: 'Gói Dịch Vụ Môi Giới | HaNoi Realty',
  description: 'Quản lý gói dịch vụ CTV, TPKD, lịch sử thanh toán và biên nhận điện tử.',
};

export default function BrokerSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <SubscriptionManager />
    </Suspense>
  );
}
