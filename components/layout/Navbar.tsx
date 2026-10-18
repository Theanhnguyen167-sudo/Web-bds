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
  Bell,
  Download
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

  // Quản lý mục lục đổ xuống với Chế độ trễ an toàn (Safe Delay) chống tắt khi lia chuột chéo
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (menuName: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(menuName);
  };

  const handleMenuLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    // Độ trễ an toàn 250ms: Giữ menu mở khi lia chuột chéo từ nút bấm sang bảng dropdown
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };

  // Dọn dẹp timer khi component unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

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
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  interface NavSubItem {
    name: string;
    href: string;
  }

  interface NavLinkItem {
    name: string;
    href: string;
    subItems?: NavSubItem[];
  }

  const navLinks: NavLinkItem[] = [
    { name: 'Trang chủ', href: '/' },
    {
      name: 'Tìm kiếm',
      href: '/search',
      subItems: [
        { name: 'Mua bán nhà đất', href: '/search?type=sale' },
        { name: 'Cho thuê nhà đất', href: '/search?type=rent' },
        { name: 'Dự án bất động sản', href: '/search?type=project' },
        { name: 'Bản đồ tra cứu BĐS', href: '/search' },
      ],
    },
    {
      name: 'Quy hoạch',
      href: '/planning',
      subItems: [
        { name: 'Bản đồ quy hoạch Hà Nội', href: '/planning' },
        { name: 'Quy hoạch phân khu đô thị', href: '/planning' },
        { name: 'Kế hoạch sử dụng đất', href: '/planning' },
        { name: 'Tra cứu thửa đất theo toạ độ', href: '/planning' },
      ],
    },
    {
      name: 'Tin tức',
      href: '/news',
      subItems: [
        { name: 'Tất cả tin tức', href: '/news' },
        { name: 'Thị trường BĐS', href: '/news?category=market' },
        { name: 'Quy hoạch & Hạ tầng', href: '/news?category=planning' },
        { name: 'Biến động giá đất', href: '/news?category=pricing' },
        { name: 'Chính sách & Pháp lý', href: '/news?category=policy' },
        { name: 'Dự án & Quy hoạch', href: '/news?category=project' },
        { name: 'Tài chính & Đầu tư', href: '/news?category=investment' },
      ],
    },
    {
      name: 'Báo cáo AI',
      href: '/reports',
      subItems: [
        { name: 'Báo cáo thị trường BĐS', href: '/reports' },
        { name: 'Định giá nhà đất tự động', href: '/reports' },
        { name: 'Dự báo xu hướng giá', href: '/reports' },
      ],
    },
    {
      name: 'Bảng giá',
      href: '/pricing',
      subItems: [
        { name: 'Bảng giá đất Hà Nội mới nhất', href: '/pricing' },
        { name: 'Lịch sử biến động giá đất', href: '/pricing' },
        { name: 'So sánh giá đất theo quận', href: '/pricing' },
      ],
    },
    {
      name: 'Về chúng tôi',
      href: '/about',
      subItems: [
        { name: 'Giới thiệu Hanoi Realty', href: '/about' },
        { name: 'Đội ngũ chuyên gia', href: '/about#team' },
        { name: 'Liên hệ hợp tác', href: '/about#contact' },
      ],
    },
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
      className="fixed top-0 left-0 right-0 z-[100] bg-white/95 supports-[backdrop-filter]:bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-slate-800 transition-all duration-200"
    >
      <div
        className={`header-container w-full max-w-7xl 2xl:max-w-[1440px] mx-auto flex items-center justify-between px-2.5 min-[375px]:px-3 sm:px-6 lg:px-8 transition-all duration-300 flex-nowrap ${
          isScrolled ? 'h-16' : 'h-16 sm:h-[68px]'
        }`}
      >
        {/* 1. LOGO */}
        <div className="logo shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/20 h-7.5 w-7.5 min-[360px]:h-8 min-[360px]:w-8 sm:h-9 sm:w-9 shrink-0 transition-all duration-300"
            >
              <Home className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight flex items-center gap-1 text-[13.5px] min-[360px]:text-[14.5px] sm:text-base lg:text-[17px] leading-tight text-slate-900 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                HaNoi <span className="text-accent font-black">Realty</span>
              </span>
              <span className="text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] font-medium uppercase tracking-wider sm:tracking-widest -mt-0.5 leading-none text-slate-500 whitespace-nowrap transition-colors">
                PropTech & Quy Hoạch
              </span>
            </div>
          </Link>
        </div>

        {/* 2. MAIN NAVIGATION (Desktop lg+) */}
        <nav
          className="main-navigation hidden lg:flex items-center gap-1.5 xl:gap-2.5 2xl:gap-3.5 shrink-0 transition-all duration-200"
          onMouseLeave={handleMenuLeave}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href + '/');
            const hasSub = Boolean(link.subItems && link.subItems.length > 0);
            const isOpen = activeDropdown === link.name;

            return (
              <div
                key={link.name}
                className="relative py-2"
                onMouseEnter={() => hasSub && handleMenuEnter(link.name)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={link.href}
                  onClick={() => setActiveDropdown(null)}
                  className={`relative rounded-xl text-xs xl:text-[13px] font-medium tracking-wide whitespace-nowrap shrink-0 transition-all duration-200 px-2.5 py-1.5 flex items-center gap-1 ${
                    isActive || isOpen
                      ? 'text-accent font-bold bg-orange-50 border border-orange-200/80 shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                  {hasSub && (
                    <ChevronDown
                      className={`h-3 w-3 opacity-60 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 opacity-100 text-accent' : 'hover:opacity-100'
                      }`}
                    />
                  )}
                </Link>

                {/* Submenu Dropdown với Chế độ trễ an toàn & Cầu đệm vô hình chống tắt khi lia chuột chéo */}
                {hasSub && isOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[110]"
                    onMouseEnter={() => handleMenuEnter(link.name)}
                    onMouseLeave={handleMenuLeave}
                  >
                    {/* Cầu đệm vô hình (Invisible Bridge): mở rộng vùng đón chuột khi lia chéo góc */}
                    <div className="absolute -top-3 -left-12 -right-12 h-6 pointer-events-auto" />

                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="min-w-[220px] w-max max-w-[280px] rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] p-1.5 space-y-0.5"
                    >
                      {link.subItems?.map((sub) => {
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50/80 transition-all group/item"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-orange-500 group-hover/item:scale-125 transition-all" />
                              <span className="whitespace-nowrap">{sub.name}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 3. HEADER ACTIONS (Desktop lg+) */}
        <div className="header-actions hidden lg:flex items-center gap-3 shrink-0">
          {/* Quick Search Shortcut */}
          <Link
            href="/search"
            className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-slate-200/70 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:border-slate-300 shrink-0"
            title="Tìm kiếm BĐS"
          >
            <Search className="h-4 w-4 shrink-0" />
          </Link>

          {/* Admin Portal Quick Switch Button for Admins */}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="h-9 flex items-center gap-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 px-3 text-xs font-bold text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-xs whitespace-nowrap shrink-0"
              title="Chuyển sang trang Quản trị Admin"
            >
              <ShieldCheck className="h-4 w-4 text-orange-600 shrink-0" />
              <span className="hidden xl:inline">Vào </span>
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Post Listing Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePostListingClick}
            className="h-9 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3.5 text-xs font-bold text-white shadow-sm shadow-accent/20 hover:bg-accent-hover transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Đăng tin</span>
          </motion.button>

          {/* Auth State / Account Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setNotifOpen(false);
                setUserDropdownOpen(!userDropdownOpen);
              }}
              className="h-9 relative flex items-center gap-2 rounded-xl px-2.5 transition-all border border-slate-200/80 hover:border-slate-300 bg-slate-100/80 hover:bg-slate-200/70 text-slate-800 cursor-pointer shrink-0 whitespace-nowrap"
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
              </div>
              <span className="text-xs font-semibold max-w-[110px] xl:max-w-[140px] truncate text-slate-800">
                {user ? user.name : 'Tài khoản'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            </button>

            {/* User Account Dropdown Menu */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 text-text-primary shadow-xl z-[110]"
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

          {/* 4. Notification Bell - Đặt ngay bên phải phần tên người dùng (Trần Minh Hoàng) */}
          <div className="relative shrink-0">
            <NotificationBell
              isOpen={notifOpen}
              onOpenChange={(open) => {
                if (open) setUserDropdownOpen(false);
                setNotifOpen(open);
              }}
              isScrolled={true}
              onUnreadCountChange={setUnreadNotifCount}
            />
          </div>
        </div>

        {/* Mobile Right Actions (Tablet & Mobile < lg) - Thứ tự: Đăng tin, Tìm kiếm, Thông báo, Tài khoản (icon người), 3 gạch */}
        <div className="flex lg:hidden items-center gap-[15px] shrink-0 flex-nowrap ml-auto">
          {/* 1. Nút Đăng tin: Nút pill màu cam nổi bật, bo tròn tinh tế */}
          <button
            onClick={handlePostListingClick}
            className="h-7.5 flex items-center justify-center rounded-full bg-accent hover:bg-accent-hover active:scale-95 px-2.5 text-[11px] font-bold text-white shadow-sm shadow-accent/25 transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            Đăng tin
          </button>

          {/* 2. Nút Tìm kiếm: Icon kính lúp <Search /> tra cứu BĐS nhanh */}
          <Link
            href="/search"
            className="flex h-7.5 w-[22px] items-center justify-center transition-all shrink-0 active:scale-95 text-slate-700 hover:text-slate-900"
            title="Tìm kiếm BĐS nhanh"
          >
            <Search className="w-[22px] h-[22px] stroke-[2.2]" />
          </Link>

          {/* 3. Nút Thông báo: Icon chuông <Bell /> kích cỡ chuẩn 22px đồng bộ */}
          <div className="relative shrink-0">
            <NotificationBell
              isScrolled={true}
              onOpenChange={(open) => {
                if (open) setMobileMenuOpen(false);
              }}
              triggerClassName="relative flex h-7.5 w-[22px] items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 text-slate-700 hover:text-slate-900"
              iconClassName="w-[22px] h-[22px] stroke-[2.2]"
            />
          </div>

          {/* 4. Icon hình người (Tài khoản đăng nhập): Kích thước chuẩn 22px x 22px tròn tuyệt đối */}
          <Link
            href={user ? '/dashboard' : '/login'}
            aria-label="Tài khoản người dùng"
            title={user ? `Quản lý tài khoản: ${user.name}` : 'Đăng nhập / Đăng ký'}
            className="flex h-7.5 w-[22px] items-center justify-center transition-all shrink-0 active:scale-95 text-slate-700 hover:text-slate-900"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-[22px] h-[22px] aspect-square rounded-full object-cover ring-1.5 ring-accent shrink-0"
              />
            ) : (
              <User className="w-[22px] h-[22px] stroke-[2.2]" />
            )}
          </Link>

          {/* 5. Nút 3 dấu gạch (Menu): Kích thước chuẩn 22px x 22px đồng bộ, cách ảnh đại diện đúng 15px */}
          <button
            type="button"
            onClick={() => {
              setNotifOpen(false);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            title={mobileMenuOpen ? 'Đóng menu' : 'Mở menu hệ thống'}
            className="relative flex h-7.5 w-[22px] items-center justify-center p-0 border-0 border-none outline-none active:scale-90 transition-all cursor-pointer shrink-0 text-slate-800 hover:text-orange-500"
          >
            {mobileMenuOpen ? (
              <X className="w-[22px] h-[22px] stroke-[2.2] text-orange-500" />
            ) : (
              <Menu className="w-[22px] h-[22px] stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu (< lg) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className={`lg:hidden border-t px-4 py-4 shadow-2xl overflow-hidden ${
              isScrolled
                ? 'border-slate-200/80 bg-white/95 supports-[backdrop-filter]:bg-white/90 backdrop-blur-xl text-slate-800'
                : 'border-white/10 bg-[#0a1128]/98 backdrop-blur-xl text-white'
            }`}
          >
            <div className="flex flex-col gap-1.5 max-h-[65vh] overflow-y-auto no-scrollbar py-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <div key={link.name} className="flex flex-col">
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? isScrolled
                            ? 'border border-orange-500/40 bg-orange-50 text-accent font-bold shadow-xs'
                            : 'border border-orange-500 bg-orange-500/20 text-white font-bold shadow-sm'
                          : isScrolled
                            ? 'hover:bg-slate-100 text-slate-700'
                            : 'hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <span className="h-2 w-2 rounded-full bg-accent" />}
                    </Link>

                    {/* SubItems trên Mobile nếu có */}
                    {link.subItems && (
                      <div className="pl-3 pr-1 py-1 flex flex-wrap gap-1">
                        {link.subItems.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                              isScrolled
                                ? 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`border-t pt-3 mt-3 flex flex-col gap-2 ${
              isScrolled ? 'border-slate-200' : 'border-slate-700'
            }`}>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${
                        isScrolled
                          ? 'bg-orange-50 border-orange-200 text-orange-600'
                          : 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>🛡️ Vào trang Quản trị (Admin)</span>
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                      isScrolled
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-primary-light/60 hover:bg-primary-light text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4 text-accent" />
                    <span>Dashboard ({user.name})</span>
                  </Link>
                  <Link
                    href="/dashboard?tab=saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${
                      isScrolled
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-primary-light/60 hover:bg-primary-light text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      <span>Tin đã lưu</span>
                    </div>
                    {savedListingIds.length > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        isScrolled
                          ? 'bg-red-100 text-red-600'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {savedListingIds.length}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-danger cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                    isScrolled
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-primary-light hover:bg-primary-light/80 text-white'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Đăng nhập / Đăng ký</span>
                </Link>
              )}

              {/* Nút Cài đặt ứng dụng PWA */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open_pwa_install'));
                }}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all border ${
                  isScrolled
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200'
                    : 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border-orange-500/30'
                }`}
              >
                <Download className="h-4 w-4 text-orange-500" />
                <span>📲 Cài đặt App HaNoi Realty (PWA)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
