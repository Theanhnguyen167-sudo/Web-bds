'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutValues } from '@/components/about/AboutValues';
import { AboutTeam } from '@/components/about/AboutTeam';
import { AboutRoadmap } from '@/components/about/AboutRoadmap';
import { AboutTestimonials } from '@/components/about/AboutTestimonials';
import { AboutCta } from '@/components/about/AboutCta';
import { AboutFooter } from '@/components/about/AboutFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-page-bg text-text-primary overflow-x-hidden font-sans flex flex-col justify-between">
      {/* Global Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section (Merged Hero + Stats Above-the-Fold) */}
        <AboutHero />

        {/* 2. Tầm nhìn - Sứ mệnh - Giá trị cốt lõi (3 Cards, Ample Whitespace) */}
        <AboutValues />

        {/* 3. Đội ngũ Sáng lập (4 Experts: NTA, TBM, LTH, PVK, Responsive 4/2/1) */}
        <AboutTeam />

        {/* 4. Lộ trình phát triển (Horizontal Timeline Progress Bar) */}
        <AboutRoadmap />

        {/* 5. Đánh giá khách hàng (Auto-playing Carousel / Slider) */}
        <AboutTestimonials />

        {/* 6. Call to Action (Single clean block before footer) */}
        <AboutCta />
      </main>

      {/* Global / About Footer */}
      <AboutFooter />
    </div>
  );
}
