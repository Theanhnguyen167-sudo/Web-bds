'use client';

import React from 'react';
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans flex flex-col justify-between">
      {/* 1. Global Navigation (Giữ nguyên) */}
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

      {/* Global / About Footer (Giữ nguyên) */}
      <AboutFooter />
    </div>
  );
}
