import { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BuyerRequestWizard } from '@/components/buyer/BuyerRequestWizard';

export const metadata: Metadata = {
  title: 'Đăng Ký Nhu Cầu Mua BĐS - HaNoi Realty',
  description: 'Gửi tiêu chí tìm nhà đất tại Hà Nội miễn phí. HaNoi Realty lọc từ kho nguồn hàng đã xác minh quy hoạch và pháp lý sạch, kết nối BĐS đúng nhu cầu.',
};

export default function BuyerRequestPage() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <Suspense fallback={<div className="py-20 text-center text-sm text-text-muted">Đang tải bộ đăng ký nhu cầu...</div>}>
          <BuyerRequestWizard />
        </Suspense>
      </main>
    </div>
  );
}

