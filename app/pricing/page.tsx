import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { PricingTable } from '@/components/membership/PricingTable';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

export const metadata: Metadata = {
  title: 'Bảng Giá Dịch Vụ & Gói Hội Viên VIP - HaNoi Realty',
  description: 'Bảng giá niêm yết các gói dịch vụ đăng tin BĐS, thẩm định giá AI chuyên sâu, tra cứu bản đồ quy hoạch Hà Nội 2030-2045 dành cho cá nhân, môi giới và doanh nghiệp.',
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
  openGraph: {
    title: 'Bảng Giá Dịch Vụ & Hội Viên VIP - HaNoi Realty PropTech',
    description: 'Bảng giá dịch vụ đăng tin BĐS thông minh, tra cứu quy hoạch và thẩm định AI độc quyền.',
    url: `${baseUrl}/pricing`,
    type: 'website',
  },
};

export default function PricingPage() {
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    name: 'Bảng giá dịch vụ hội viên HaNoi Realty',
    description: 'Dịch vụ đăng tin BĐS và tra cứu quy hoạch Hà Nội',
    priceCurrency: 'VND',
    validFrom: '2026-01-01',
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <PricingTable />
      </main>
    </div>
  );
}
