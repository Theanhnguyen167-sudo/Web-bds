'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import {
  Search,
  Bell,
  ChevronDown,
  Globe,
  Home,
  Key,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  breadcrumb?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  breadcrumb = 'Tổng quan',
}) => {
  const router = useRouter();
  const { user, setUser, addToast } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Có 3 tin đăng mới cần phê duyệt',
      time: '5 phút trước',
      type: 'warning',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      id: 2,
      title: 'Giao dịch #TXN-90234 thành công (11.990.000đ)',
      time: '12 phút trước',
      type: 'success',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      id: 3,
      title: 'Báo cáo AI được tải xuống bởi khách hàng VIP',
      time: '28 phút trước',
      type: 'info',
      icon: Info,
      color: 'text-blue-500 bg-blue-50',
    },
  ];

  const handleLogout = () => {
    setUser(null);
    addToast('Đã đăng xuất khỏi tài khoản Quản trị', 'info');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
      {/* ── LEFT: Title & Breadcrumbs ── */}
      <div>
        <h1 className="text-base font-extrabold text-navy leading-tight">{title}</h1>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <span>Admin Portal</span>
          <span>/</span>
          <span className="text-slate-600 font-semibold">{breadcrumb}</span>
        </div>
      </div>

      {/* ── RIGHT: Search, Notifications, User Menu ── */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng, tin đăng, mã GD..."
            className="w-64 pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-navy">Thông báo hệ thống</span>
                  <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                    3 mới
                  </span>
                </div>

                <div className="space-y-1.5">
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className={`p-1.5 rounded-lg ${item.color} shrink-0 mt-0.5`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 font-semibold leading-tight line-clamp-2">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language Pill (Decorative) */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
          <span>🇻🇳</span>
          <span>VIE</span>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="h-7 w-7 rounded-lg bg-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              AD
            </div>
            <span className="hidden sm:block text-xs font-bold text-navy max-w-[100px] truncate">
              Admin
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs space-y-1"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-navy">Administrator</p>
                  <p className="text-[10px] text-slate-400">admin@hanoirealty.vn</p>
                </div>

                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <Home className="h-3.5 w-3.5 text-slate-400" />
                  <span>Xem trang chủ</span>
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <Key className="h-3.5 w-3.5 text-slate-400" />
                  <span>Đổi mật khẩu / Cài đặt</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors border-t border-slate-100"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
