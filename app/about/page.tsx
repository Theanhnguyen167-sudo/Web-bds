import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutWhatIs } from '@/components/about/AboutWhatIs';
import { AboutWhyUs } from '@/components/about/AboutWhyUs';
import { AboutHowItWorks } from '@/components/about/AboutHowItWorks';
import { AboutTargetAudience } from '@/components/about/AboutTargetAudience';
import { AboutValues } from '@/components/about/AboutValues';
import { AboutCommitments } from '@/components/about/AboutCommitments';
import { AboutCta } from '@/components/about/AboutCta';
import { AboutFooter } from '@/components/about/AboutFooter';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi - Đội Ngũ Sáng Lập & Sứ Mệnh | HaNoi Realty',
  description: 'Khám phá tầm nhìn, sứ mệnh và công nghệ tiên phong của HaNoi Realty trong việc minh bạch hóa thị trường bất động sản và bản đồ quy hoạch Thủ đô Hà Nội.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'Về Chúng Tôi - Nền Tảng BĐS & Quy Hoạch HaNoi Realty',
    description: 'Minh bạch hóa thị trường bất động sản và dữ liệu quy hoạch Thủ đô bằng công nghệ AI và GIS.',
    url: `${baseUrl}/about`,
    type: 'website',
  },
};

export default function AboutPage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'HaNoi Realty PropTech',
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    description: 'Nền tảng công nghệ bất động sản và tra cứu quy hoạch thông minh Hà Nội',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hà Nội',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.0285,
      longitude: 105.8542,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Section 1 & 2: Hero Section & Khối số liệu hệ thống */}
        <AboutHero />

        {/* Section 3: "Hanoi Realty là gì?" */}
        <AboutWhatIs />

        {/* Section 4: "Vì sao Hanoi Realty?" */}
        <AboutWhyUs />

        {/* Section 5: "Hanoi Realty hoạt động như thế nào?" (Timeline 5 bước) */}
        <AboutHowItWorks />

        {/* Section 6: "Hanoi Realty dành cho ai?" (4 đối tượng) */}
        <AboutTargetAudience />

        {/* Section 7: Tầm nhìn – Sứ mệnh – Giá trị cốt lõi */}
        <AboutValues />

        {/* Section 8: "Cam kết của Hanoi Realty" */}
        <AboutCommitments />

        {/* Section 9: CTA cuối trang */}
        <AboutCta />
      </main>

      {/* Global / About Footer */}
      <AboutFooter />
    </div>
  );
}
