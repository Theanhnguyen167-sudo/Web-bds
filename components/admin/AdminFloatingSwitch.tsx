'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { ShieldCheck, Home, ArrowRightLeft } from 'lucide-react';

export const AdminFloatingSwitch: React.FC = () => {
  const pathname = usePathname();
  const { user } = useApp();

  // Only render if user is logged in and has role 'admin'
  if (!user || user.role !== 'admin') {
    return null;
  }

  const isAdminPage = pathname.startsWith('/admin');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
    >
      <Link
        href={isAdminPage ? '/' : '/admin'}
        className={`group flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md font-bold text-xs transition-all duration-300 border ${
          isAdminPage
            ? 'bg-white/95 text-navy hover:bg-white border-slate-200 hover:shadow-orange-500/10'
            : 'bg-[#0f172a]/95 text-white hover:bg-[#0f172a] border-orange-500/40 hover:border-orange-500 shadow-orange-500/20'
        }`}
        title={isAdminPage ? 'Quay lại Trang chủ người dùng' : 'Truy cập Admin Portal'}
      >
        <div
          className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
            isAdminPage
              ? 'bg-navy text-white'
              : 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
          }`}
        >
          {isAdminPage ? (
            <Home className="h-4 w-4" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-400">
            {isAdminPage ? 'Chế độ Quản trị' : 'Super Admin Active'}
          </span>
          <span className="font-black text-xs flex items-center gap-1">
            {isAdminPage ? '🏠 Về Trang chủ' : '🛡️ Vào Admin Portal'}
          </span>
        </div>

        <ArrowRightLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-orange-400 transition-colors ml-1" />
      </Link>
    </motion.div>
  );
};
