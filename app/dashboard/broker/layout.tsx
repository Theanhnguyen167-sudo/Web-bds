import React from 'react';
import type { Metadata } from 'next';
import { BrokerDashboardLayout } from '@/components/dashboard/broker/layout';

export const metadata: Metadata = {
  title: 'Phân hệ Môi giới & TPKD | HaNoi Realty',
  description: 'Bàn làm việc số dành cho Cộng tác viên và Trưởng phòng kinh doanh Bất động sản Hà Nội.',
};

export default function BrokerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BrokerDashboardLayout>{children}</BrokerDashboardLayout>;
}

