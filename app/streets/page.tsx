import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { StreetsClient } from '@/components/streets/StreetsClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

export const metadata: Metadata = {
  title: 'Tra Cứu Lộ Giới, Giá Đất & Mạng Lưới Metro Hà Nội | HaNoi Realty',
  description: 'Danh mục các tuyến đường huyết mạch, lộ giới quy hoạch mở rộng, đơn giá đất thị trường trung bình và tiến độ các tuyến đường sắt đô thị Metro Hà Nội.',
  alternates: {
    canonical: `${baseUrl}/streets`,
  },
  openGraph: {
    title: 'Hạ Tầng Giao Thông, Tuyến Đường & Mạng Lưới Metro Hà Nội',
    description: 'Tra cứu lộ giới quy hoạch, đơn giá đất thị trường và tiến độ các tuyến metro Hà Nội.',
    url: `${baseUrl}/streets`,
    type: 'website',
  },
};

export default function StreetsPage() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <StreetsClient />
      </main>
    </div>
  );
}
