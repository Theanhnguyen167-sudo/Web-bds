'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useApp } from '@/lib/context/AppContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useApp();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Siết chặt kiểm tra quyền Quản trị viên từ phiên xác thực
    if (!user) {
      setIsAuthorized(false);
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/admin')}`);
      return;
    }

    if (user.role !== 'admin') {
      setIsAuthorized(false);
      router.push('/dashboard');
      return;
    }

    setIsAuthorized(true);
  }, [user, pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Đang xác thực quyền Quản trị viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-60 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
