import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { PlanningClient } from '@/components/map/PlanningClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

export const metadata: Metadata = {
  title: 'Tra Cứu Bản Đồ Quy Hoạch Hà Nội 2030 - 2045 | HaNoi Realty',
  description: 'Bản đồ tra cứu quy hoạch sử dụng đất Hà Nội số hoá độ phân giải cao: Đất ở đô thị, phân khu thương mại, hướng tuyến đường sắt đô thị Metro và các đại đô thị vệ tinh.',
  keywords: [
    'Bản đồ quy hoạch Hà Nội',
    'Tra cứu quy hoạch Hà Nội 2030',
    'Quy hoạch đất ở Hà Nội',
    'Bản đồ quy hoạch Cầu Giấy',
    'Bản đồ quy hoạch Nam Từ Liêm',
    'Tuyến metro Hà Nội',
  ],
  alternates: {
    canonical: `${baseUrl}/planning`,
  },
  openGraph: {
    title: 'Tra Cứu Bản Đồ Quy Hoạch Hà Nội 2030 - 2045 Trực Tuyến',
    description: 'Hệ thống tra cứu quy hoạch số hoá, toạ độ phân khu đô thị và hướng tuyến metro Hà Nội chuẩn xác nhất.',
    url: `${baseUrl}/planning`,
    type: 'website',
  },
};

export default function PlanningPage() {
  const planningSchema = {
    '@context': 'https://schema.org',
    '@type': 'Map',
    name: 'Bản đồ tra cứu quy hoạch Hà Nội 2030 - 2045',
    description: 'Bản đồ quy hoạch phân khu, sử dụng đất và hạ tầng giao thông Hà Nội',
    mapType: 'https://schema.org/TransitMap',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Thành phố Hà Nội, Việt Nam',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 21.0285,
        longitude: 105.8542,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a1128] text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(planningSchema) }}
      />
      <Navbar />

      <main className="flex-1 pt-16 sm:pt-20">
        <PlanningClient />
      </main>
    </div>
  );
}
