import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { ReportsClient } from '@/components/ai-report/ReportsClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

export const metadata: Metadata = {
  title: 'Báo Cáo Thẩm Định & Định Giá BĐS AI Hà Nội | HaNoi Realty',
  description: 'Báo cáo phân tích chuyên sâu tiềm năng bất động sản bằng trí tuệ nhân tạo: Định giá thị trường, kiểm tra quy hoạch phân khu, phân tích thanh khoản và dòng tiền đầu tư.',
  alternates: {
    canonical: `${baseUrl}/reports`,
  },
  openGraph: {
    title: 'Báo Cáo Thẩm Định & Định Giá Bất Động Sản AI',
    description: 'Hệ thống định giá tự động và thẩm định tiềm năng đầu tư BĐS Hà Nội bằng mô hình AI chuyên sâu.',
    url: `${baseUrl}/reports`,
    type: 'website',
  },
};

export default function ReportsIndexPage() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <ReportsClient />
      </main>
    </div>
  );
}
