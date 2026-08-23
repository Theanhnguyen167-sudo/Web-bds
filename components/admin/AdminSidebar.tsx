'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Building2,
  FileText,
  CreditCard,
  Package,
  MapPin,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, addToast } = useApp();

  const handleLogout = () => {
    setUser(null);
    addToast('Đã đăng xuất khỏi tài khoản Quản trị', 'info');
    router.push('/login');
  };

  const navGroups = [
    {
      title: 'Tổng quan',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Phân tích', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Nội dung',
      items: [
        {
          name: 'Người dùng',
          href: '/admin/users',
          icon: Users,
          badge: '5 mới',
          badgeColor: 'bg-blue-500/20 text-blue-400',
        },
        {
          name: 'Tin đăng',
          href: '/admin/listings',
          icon: Building2,
          badge: '23',
          badgeColor: 'bg-orange-500 text-white animate-pulse',
        },
        { name: 'Báo cáo AI', href: '/admin/reports', icon: FileText },
      ],
    },
    {
      title: 'Kinh doanh',
      items: [
        { name: 'Giao dịch', href: '/admin/payments', icon: CreditCard },
        { name: 'Gói dịch vụ', href: '/admin/packages', icon: Package },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        { name: 'Quy hoạch', href: '/admin/planning', icon: Compass },
        { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-60 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800 select-none">
      {/* ── TOP LOGO ── */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-orange-500/20">
            🏠
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight block">
              HaNoi <span className="text-orange-500">Realty</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* ── NAVIGATION GROUPS ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {group.title}
            </h4>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {/* Left active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="adminActiveNav"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-orange-500"
                      />
                    )}

                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? 'text-orange-400' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                          item.badgeColor || 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM USER & ACTIONS ── */}
      <div className="p-3 border-t border-slate-800 space-y-3 bg-slate-950/40">
        {/* User preview */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="h-8 w-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs border border-orange-500/30">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Super Admin
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại trang chủ</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
