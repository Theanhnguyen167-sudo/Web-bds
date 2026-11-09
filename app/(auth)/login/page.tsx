'use client';

import React, { Suspense } from 'react';
import AuthPageContent from '@/components/auth/AuthPageContent';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-sm">
          Đang tải...
        </div>
      }
    >
      <AuthPageContent initialMode="login" />
    </Suspense>
  );
}
