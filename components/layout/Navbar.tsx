'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import {
  Home,
  Layers,
  Sparkles,
  Tag,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Search,
  LayoutDashboard,
  Navigation,
  ChevronDown,
  ShieldCheck,
  Heart,
  Bell
} from 'lucide-react';
import { NotificationBell } from '@/components/notification/NotificationBell';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, savedListingIds, addToast } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Đồng bộ số lượng thông báo chưa đọc của riêng tài khoản đang đăng nhập
  useEffect(() => {
    const syncNotifCount = () => {
      try {
        const raw = localStorage.getItem('hanoi_realty_notifications');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            if (user) {
              const count = parsed.filter(
                (n: any) => (n.recipientUserId === user.id || n.recipientUserId === 'all') && !n.isRead
              ).length;
              setUnreadNotifCount(count);
            } else {
              setUnreadNotifCount(0);
            }
          }
        }
      } catch {}
    };
    syncNotifCount();
    window.addEventListener('hanoi_notifications_updated', syncNotifCount);
    window.addEventListener('storage', syncNotifCount);
    window.addEventListener('hanoi_new_notification', syncNotifCount);
    return () => {
      window.removeEventListener('hanoi_notifications_updated', syncNotifCount);
      window.removeEventListener('storage', syncNotifCount);
      window.removeEventListener('hanoi_new_notification', syncNotifCount);
    };
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Tìm kiếm', href: '/search' },
    { name: 'Quy hoạch', href: '/planning' },
    { name: 'Tin tức', href: '/news' },
    { name: 'Báo cáo AI', href: '/reports' },
    { name: 'Bảng giá', href: '/pricing' },
    { name: 'Về chúng tôi', href: '/about' },
  ];

  const handleLogout = async () => {
    try {
      const { signOut } = await import('@/lib/supabase/queries/auth');
      await signOut();
    } catch {
      // Dev fallback
    }
    setUser(null);
    setUserDropdownOpen(false);
    addToast('Đã đăng xuất thành công', 'info');
  };

  const handlePostListingClick = () => {
    if (!user) {
      addToast('Vui lòng đăng nhập để đăng tin', 'info');
      router.push('/login');
    } else {
      router.push('/listings/create');
    }
  };

  const isHomePageLight = pathname === '/' && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a1128]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10 text-white'
          : 'bg-[#0a1128]/95 backdrop-blur-sm shadow-sm border-b border-slate-800/80 text-white'
      }`}
    >
      <div
        className={`header-container w-full max-w-7xl 2xl:max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-16 sm:h-[68px]'
        }`}
      >
        {/* 1. LOGO */}
        <div className="logo shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/20 h-9 w-9 shrink-0 transition-all duration-300"
            >
              <Home className="h-4.5 w-4.5" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight flex items-center gap-1 text-white text-base lg:text-[17px] leading-tight transition-colors group-hover:text-white whitespace-nowrap">
                HaNoi <span className="text-accent font-black">Realty</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-300 -mt-0.5 leading-none whitespace-nowrap">
                PropTech & Quy Hoạch
              </span>
            </div>
          </Link>
        </div>

        {/* 2. MAIN NAVIGATION (Desktop lg+) */}
        <nav className="main-navigation hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-7 shrink-0 transition-all duration-200">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative rounded-xl text-xs xl:text-[13px] font-medium tracking-wide whitespace-nowrap shrink-0 transition-all duration-200 px-2 xl:px-2.5 py-1.5 ${
                  isActive
                    ? 'text-orange-400 font-bold bg-orange-500/10 border border-orange-500/25 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="whitespace-nowrap">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. HEADER ACTIONS (Desktop lg+) */}
        <div className="header-actions hidden lg:flex items-center gap-3 shrink-0">
          {/* Quick Search Shortcut */}
          <Link
            href="/search"
            className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/10 shrink-0"
            title="Tìm kiếm BĐS"
          >
            <Search className="h-4 w-4 shrink-0" />
          </Link>

          {/* Admin Portal Quick Switch Button for Admins */}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="h-9 flex items-center gap-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 px-3 text-xs font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-all shadow-xs whitespace-nowrap shrink-0"
              title="Chuyển sang trang Quản trị Admin"
            >
              <ShieldCheck className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="hidden xl:inline">Vào </span>
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Post Listing Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePostListingClick}
            className="h-9 flex items-center gap-1.5 rounded-xl bg-accent px-3.5 text-xs font-bold text-white shadow-sm shadow-accent/20 hover:bg-accent-hover transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">+ Đăng tin</span>
          </motion.button>

          {/* Auth State / Account Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setNotifOpen(false);
                setUserDropdownOpen(!userDropdownOpen);
              }}
              className="h-9 relative flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-2.5 text-white transition-all border border-white/10 hover:border-white/20 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <div className="relative shrink-0">
                {user ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 rounded-lg object-cover ring-1 ring-accent shrink-0"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/20 text-accent ring-1 ring-accent/40 shrink-0">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-accent px-0.5 text-[8px] font-extrabold text-white shadow-md ring-2 ring-[#0a1128]">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold max-w-[110px] xl:max-w-[140px] truncate text-slate-200">
                {user ? user.name : 'Tài khoản'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>

            {/* User Account Dropdown Menu */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 text-text-primary shadow-xl z-50"
                >
                  {user ? (
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
                      <p className="text-[11px] text-text-secondary truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          user.package && user.package.toLowerCase() !== 'free'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          Gói {user.package || 'Free'}{user.package && user.package.toLowerCase() !== 'free' ? ' VIP' : ''}
                        </span>
                        {user.role === 'admin' && (
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 uppercase">
                            Admin
                          </span>
                        )}
                        <span className="text-[10px] text-text-muted">
                          {user.package && user.package.toLowerCase() !== 'free' ? `HSD: ${user.packageExpiry}` : 'Miễn phí'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 border-b border-slate-100 mb-1 bg-slate-50/70 rounded-lg">
                      <p className="text-xs font-bold text-text-primary">Tài khoản HaNoi Realty</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        Đăng nhập để đồng bộ tin đăng, lịch hẹn & báo cáo AI.
                      </p>
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition-colors"
                      >
                        <User className="h-3.5 w-3.5" />
                        <span>Đăng nhập / Đăng ký</span>
                      </Link>
                    </div>
                  )}

                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors mb-1"
                    >
                      <ShieldCheck className="h-4 w-4 text-orange-600" />
                      <span>Vào trang Quản trị (Admin)</span>
                    </Link>
                  )}

                  {/* Mục Thông báo tích hợp trong Tài khoản */}
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setNotifOpen(true);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-orange-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-orange-500" />
                      <span>Thông báo</span>
                    </div>
                    {unreadNotifCount > 0 ? (
                      <span className="rounded-full bg-orange-100 text-orange-600 border border-orange-200 px-2 py-0.5 text-[10px] font-extrabold">
                        {unreadNotifCount} mới
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Đã đọc hết</span>
                    )}
                  </button>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-accent" />
                    <span>Bảng điều khiển</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=saved"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      <span>Tin đã lưu</span>
                    </div>
                    {savedListingIds.length > 0 && (
                      <span className="rounded-full bg-red-100 text-red-600 px-2 py-0.5 text-[10px] font-extrabold">
                        {savedListingIds.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-slate-50 transition-colors"
                  >
                    <Tag className="h-4 w-4 text-emerald-600" />
                    <span>Nâng cấp gói VIP</span>
                  </Link>

                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-danger hover:bg-red-50 transition-colors mt-1 border-t border-slate-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hamburger Menu Toggle (Tablet & Mobile < lg) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Tìm kiếm BĐS"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            onClick={handlePostListingClick}
            className="h-9 flex items-center justify-center rounded-xl bg-accent hover:bg-accent-hover px-3 text-xs font-bold text-white shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            Đăng tin
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            title={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer ${
              mobileMenuOpen
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25'
                : 'bg-white/5 text-white border-white/15 hover:bg-white/15'
            }`}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {!mobileMenuOpen && unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-extrabold text-white shadow-md ring-2 ring-[#0a1128]">
                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Popover Trung tâm Thông báo (Hiển thị trên cả Desktop & Mobile khi mở từ mục Tài khoản) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex justify-end">
        <NotificationBell
          isOpen={notifOpen}
          onOpenChange={setNotifOpen}
          hideTrigger
          onUnreadCountChange={setUnreadNotifCount}
        />
      </div>

      {/* Mobile & Tablet Drawer Menu (< lg) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden border-t border-white/10 bg-[#0a1128]/98 backdrop-blur-xl px-4 py-4 text-white shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'border border-orange-500 bg-orange-500/20 text-white font-bold shadow-sm'
                        : 'hover:bg-white/10 text-slate-200'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                  </Link>
                );
              })}
            </div>

              <div className="border-t border-slate-700 pt-3 mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setNotifOpen(true);
                  }}
                  className="flex items-center justify-between rounded-lg bg-primary-light/60 px-3 py-2 text-xs font-semibold text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-orange-400" />
                    <span>Thông báo tài khoản</span>
                  </div>
                  {unreadNotifCount > 0 && (
                    <span className="rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 text-[10px] font-extrabold">
                      {unreadNotifCount} mới
                    </span>
                  )}
                </button>
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 px-3 py-2 text-xs font-bold"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>🛡️ Vào trang Quản trị (Admin)</span>
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg bg-primary-light/60 px-3 py-2 text-xs font-semibold"
                    >
                      <LayoutDashboard className="h-4 w-4 text-accent" />
                      <span>Dashboard ({user.name})</span>
                    </Link>
                    <Link
                      href="/dashboard?tab=saved"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg bg-primary-light/60 px-3 py-2 text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                        <span>Tin đã lưu</span>
                      </div>
                      {savedListingIds.length > 0 && (
                        <span className="rounded-full bg-red-500/20 text-red-300 px-2 py-0.5 text-[10px] font-extrabold">
                          {savedListingIds.length}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-danger"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary-light px-3 py-2 text-xs font-semibold"
                  >
                    <User className="h-4 w-4" />
                    <span>Đăng nhập / Đăng ký</span>
                  </Link>
                )}
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
